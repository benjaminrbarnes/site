import copy
import datetime as dt
import importlib.util
import json
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("tennis", Path(__file__).resolve().parents[1] / "scripts/tennis_publish.py")
t = importlib.util.module_from_spec(spec)
spec.loader.exec_module(t)


def match(n=1):
    return {"id": f"00000000-0000-4000-8000-{n:012d}", "date": "2026-10-20", "league": "Friendly", "season": None, "format": "singles", "opponents": ["Example"], "partner": None, "status": "completed", "result": "win", "sets": [{"kind": "set", "ben": 6, "opponent": 4}]}


def document():
    return {"schemaVersion": 1, "updatedAt": "2026-10-20T00:00:00Z", "matches": [match()]}


class Store:
    def __init__(self):
        self.raw = json.dumps(document()).encode()
        self.puts = 0
    def read(self):
        return self.raw, '"etag"'
    def put(self, raw, etag):
        assert etag == '"etag"'
        self.puts += 1
        self.raw = raw


class PublisherTests(unittest.TestCase):
    def test_add_preserves_history(self):
        before = document()
        after, changed = t.prepare(before, match(2), "add")
        self.assertTrue(changed)
        self.assertEqual(after["matches"][:-1], before["matches"])
        self.assertEqual(len(before["matches"]), 1)

    def test_edit_preserves_unrelated(self):
        before = document()
        before["matches"].append(match(2))
        edited = match()
        edited["result"] = "loss"
        after, _ = t.prepare(before, edited, "edit", edited["id"])
        self.assertEqual(after["matches"][1], before["matches"][1])
        self.assertEqual(after["matches"][0], edited)

    def test_diff_rejects_history_mutation(self):
        before = document()
        after, _ = t.prepare(before, match(2), "add")
        after["matches"][0]["result"] = "loss"
        with self.assertRaises(t.PublishError): t.check_diff(before, after, "add", match(2)["id"])

    def test_diff_rejects_delete(self):
        before = document()
        after, _ = t.prepare(before, match(2), "add")
        after["matches"].pop(0)
        with self.assertRaises(t.PublishError): t.check_diff(before, after, "add", match(2)["id"])

    def test_duplicates_and_missing_edit(self):
        m = match()
        m["league"] = "Different"
        with self.assertRaises(t.PublishError): t.prepare(document(), m, "add")
        with self.assertRaises(t.PublishError): t.prepare(document(), match(2), "edit")

    def test_noop_retry(self):
        store = Store()
        result = t.publish(store, match(), "add")
        self.assertFalse(result["changed"])
        self.assertEqual(store.puts, 0)

    def test_invalid_json(self):
        for raw in ('{"x":1,"x":2}', '{"x":NaN}', '{oops'):
            with self.assertRaises(t.PublishError): t.parse_json(raw)

    def test_invalid_match(self):
        for key, value in (("date", "2026-02-30"), ("id", "oops"), ("format", "squash"), ("sample", "yes")):
            m = match(); m[key] = value
            with self.assertRaises(t.PublishError): t.validate_match(m)
        m = match(); m["sets"][0]["ben"] = True
        with self.assertRaises(t.PublishError): t.validate_match(m)

    def test_unknown_history_and_doubles_tiebreaks(self):
        m = match(); m.update(status="historical-unknown", result="unknown", sets=[], opponents=[])
        t.validate_match(m)
        m.update(format="doubles", partner="Partner", opponents=["A", "B"], sets=[{"kind":"set", "ben":7, "opponent":6, "tiebreak":{"ben":7,"opponent":5}}, {"kind":"match-tiebreak", "ben":10,"opponent":8}])
        t.validate_match(m)

    def test_dry_run_no_write(self):
        store = Store(); original = store.raw
        result = t.publish(store, match(2), "add", dry_run=True)
        self.assertTrue(result["changed"])
        self.assertEqual(store.raw, original)
        self.assertEqual(store.puts, 0)

    def test_publish_readback(self):
        store = Store()
        self.assertTrue(t.publish(store, match(2), "add")["verified"])
        self.assertEqual(len(json.loads(store.raw)["matches"]), 2)

    def test_conflict_stops(self):
        store = Store()
        with patch.object(store, "put", side_effect=t.PublishError("412 Precondition Failed")):
            with self.assertRaises(t.PublishError): t.publish(store, match(2), "add")
        self.assertEqual(store.puts, 0)

    def test_uncertain_success_is_read_back(self):
        store = Store()
        def timeout(raw, etag):
            store.raw = raw
            raise subprocess.TimeoutExpired("aws", 90)
        with patch.object(store, "put", side_effect=timeout):
            self.assertTrue(t.publish(store, match(2), "add")["verified"])

    def test_readback_mismatch(self):
        store = Store()
        with patch.object(store, "put", return_value=None):
            with self.assertRaises(t.PublishError): t.publish(store, match(2), "add")

    def test_no_ambient_aws_credentials(self):
        with patch.dict(t.os.environ, {"AWS_ACCESS_KEY_ID":"fake-root", "AWS_SESSION_TOKEN":"fake-token", "AWS_PROFILE":"default"}):
            store = t.S3Store()
            self.assertNotIn("AWS_ACCESS_KEY_ID", store.env)
            self.assertNotIn("AWS_SESSION_TOKEN", store.env)
            self.assertNotIn("AWS_PROFILE", store.env)
            self.assertIn("tennis-publisher", store.env["AWS_SHARED_CREDENTIALS_FILE"])

    def test_delete_preserves_remaining(self):
        before = document(); before["matches"].extend([match(2), match(3)])
        after, changed = t.prepare(before, None, "delete", match(2)["id"])
        self.assertTrue(changed)
        self.assertEqual(after["matches"], [before["matches"][0], before["matches"][2]])
        self.assertEqual(len(before["matches"]), 3)

    def test_delete_retry_noop_and_invalid_id(self):
        after, changed = t.prepare(document(), None, "delete", match(2)["id"])
        self.assertFalse(changed)
        self.assertEqual(after, document())
        with self.assertRaises(t.PublishError): t.prepare(document(), None, "delete", "bad-id")

    def test_delete_rejects_multiple_or_mutation(self):
        before = document(); before["matches"].append(match(2))
        after, _ = t.prepare(before, None, "delete", match()["id"])
        after["matches"][0]["result"] = "loss"
        with self.assertRaises(t.PublishError): t.check_diff(before, after, "delete", match()["id"])
        after["matches"] = []
        with self.assertRaises(t.PublishError): t.check_diff(before, after, "delete", match()["id"])

    def test_delete_publish_and_dry_run(self):
        store = Store(); raw = store.raw
        self.assertTrue(t.publish(store, None, "delete", match()["id"], True)["dryRun"])
        self.assertEqual(store.raw, raw)
        result = t.publish(store, None, "delete", match()["id"])
        self.assertTrue(result["verified"])
        self.assertEqual(json.loads(store.raw)["matches"], [])

    def test_delete_conflict_stops(self):
        store = Store()
        with patch.object(store, "put", side_effect=t.PublishError("412")):
            with self.assertRaises(t.PublishError): t.publish(store, None, "delete", match()["id"])

    def test_restore_and_preview(self):
        store = Store(); previous = store.raw
        current = document(); current["matches"].append(match(2)); store.raw = json.dumps(current).encode()
        original_read = store.read
        with patch.object(store, "read", side_effect=lambda version_id=None: (previous, '"old-etag"') if version_id else original_read()):
            result = t.restore(store, "old-version", True)
            self.assertEqual(result["removedIds"], [match(2)["id"]])
            self.assertEqual(store.puts, 0)
            self.assertTrue(t.restore(store, "old-version")["verified"])
        self.assertEqual(store.raw, previous)

    def test_restore_can_repair_corrupt_current_but_reject_bad_backup(self):
        store = Store(); previous = store.raw; store.raw = b'not json'
        original_read = store.read
        with patch.object(store, "read", side_effect=lambda version_id=None: (previous, '"old-etag"') if version_id else original_read()):
            self.assertTrue(t.restore(store, "valid-version")["currentMalformed"])
        self.assertEqual(store.raw, previous)
        with patch.object(store, "read", side_effect=lambda version_id=None: (b'invalid', '"x"') if version_id else original_read()):
            with self.assertRaises(t.PublishError): t.restore(store, "invalid-version")

    def test_restore_readback_mismatch(self):
        store = Store(); previous = store.raw
        doc = document(); doc["matches"] = []; store.raw = json.dumps(doc).encode()
        original_read = store.read
        with patch.object(store, "read", side_effect=lambda version_id=None: (previous, '"old-etag"') if version_id else original_read()), patch.object(store, "put", return_value=None):
            with self.assertRaises(t.PublishError): t.restore(store, "old-version")


if __name__ == "__main__": unittest.main()
