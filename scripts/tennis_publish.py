#!/usr/bin/env python3
"""Publish exactly one tennis match change with restricted AWS credentials."""
import argparse
import copy
import datetime as dt
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import uuid

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / "tennis-config.json").read_text())


class PublishError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise PublishError(message)


def parse_json(raw):
    def pairs(items):
        result = {}
        for key, value in items:
            require(key not in result, f"Duplicate JSON key: {key}")
            result[key] = value
        return result
    def constant(value):
        raise PublishError(f"Invalid JSON number: {value}")
    try:
        return json.loads(raw, object_pairs_hook=pairs, parse_constant=constant)
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise PublishError(f"Invalid JSON: {exc}") from exc


def text(value, nullable=False):
    return (nullable and value is None) or (isinstance(value, str) and 0 < len(value.strip()) <= 2000)


def validate_match(match):
    require(isinstance(match, dict), "Match must be an object")
    required = {"id", "date", "league", "season", "format", "opponents", "partner", "status", "result", "sets"}
    require(required <= match.keys(), "Missing required match fields")
    require(not (match.keys() - required - {"notes", "sample"}), "Unknown match fields")
    try:
        require(isinstance(match["id"], str) and str(uuid.UUID(match["id"])) == match["id"], "ID must be a canonical UUID")
        require(isinstance(match["date"], str) and dt.date.fromisoformat(match["date"]).isoformat() == match["date"], "Date must be YYYY-MM-DD")
    except (ValueError, TypeError, AttributeError) as exc:
        raise PublishError("Invalid match ID or date") from exc
    require(text(match["league"]), "League must be a nonempty string")
    require(text(match["season"], True) and text(match["partner"], True), "Season/partner must be text or null")
    require(match["format"] in ("singles", "doubles"), "Invalid format")
    opponents = match["opponents"]
    require(isinstance(opponents, list) and len(opponents) <= (1 if match["format"] == "singles" else 2) and all(text(x) for x in opponents), "Invalid opponents")
    require(match["format"] == "doubles" or match["partner"] is None, "Singles cannot have a partner")
    require(match["status"] in ("completed", "retired", "walkover", "historical-unknown"), "Invalid status")
    require(match["result"] in ("win", "loss", "unknown"), "Invalid result")
    require(isinstance(match.get("sample", False), bool), "sample must be a boolean")
    require("notes" not in match or text(match["notes"]), "Notes must be nonempty text")
    require(isinstance(match["sets"], list) and len(match["sets"]) <= 10, "Invalid sets")
    for score in match["sets"]:
        require(isinstance(score, dict) and {"kind", "ben", "opponent"} <= score.keys() and not (score.keys() - {"kind", "ben", "opponent", "tiebreak"}), "Invalid set fields")
        require(score["kind"] in ("set", "match-tiebreak"), "Invalid set kind")
        require(all(type(score[k]) is int and 0 <= score[k] <= 999 for k in ("ben", "opponent")), "Scores must be nonnegative integers")
        if "tiebreak" in score:
            tie = score["tiebreak"]
            require(score["kind"] == "set" and isinstance(tie, dict) and set(tie) == {"ben", "opponent"} and all(type(v) is int and 0 <= v <= 999 for v in tie.values()), "Invalid tiebreak")


def validate_document(doc):
    require(isinstance(doc, dict) and set(doc) == {"schemaVersion", "updatedAt", "matches"}, "Invalid document fields")
    require(type(doc["schemaVersion"]) is int and doc["schemaVersion"] == 1, "Unsupported schema version")
    try:
        require(isinstance(doc["updatedAt"], str) and dt.datetime.fromisoformat(doc["updatedAt"].replace("Z", "+00:00")).utcoffset() == dt.timedelta(0), "updatedAt must be a UTC timestamp")
    except (ValueError, TypeError) as exc:
        raise PublishError("Invalid updatedAt") from exc
    require(isinstance(doc["matches"], list), "matches must be an array")
    seen = set()
    for match in doc["matches"]:
        validate_match(match)
        require(match["id"] not in seen, "Duplicate match ID")
        seen.add(match["id"])


def check_diff(before, after, operation, target):
    validate_document(before)
    validate_document(after)
    old = {m["id"]: m for m in before["matches"]}
    new = {m["id"]: m for m in after["matches"]}
    require(before["schemaVersion"] == after["schemaVersion"], "Schema changed")
    if operation == "add":
        require(set(new) - set(old) == {target} and set(old) <= set(new), "Add must create exactly one ID")
    else:
        require(set(old) == set(new) and target in old, "Edit must preserve all IDs")
    require(all(new[k] == v for k, v in old.items() if operation == "add" or k != target), "Unrelated match changed")
    require([m["id"] for m in after["matches"] if m["id"] in old] == [m["id"] for m in before["matches"]], "Existing records reordered")


def prepare(before, match, operation, target=None):
    validate_document(before)
    validate_match(match)
    target = target or match["id"]
    require(target == match["id"], "Edit cannot change the ID")
    existing = next((m for m in before["matches"] if m["id"] == target), None)
    if existing == match:
        return copy.deepcopy(before), False
    require(operation != "add" or existing is None, "Conflicting duplicate ID")
    require(operation != "edit" or existing is not None, "Edit ID not found")
    after = copy.deepcopy(before)
    if operation == "add":
        after["matches"].append(copy.deepcopy(match))
    else:
        after["matches"] = [copy.deepcopy(match) if m["id"] == target else m for m in after["matches"]]
    after["updatedAt"] = dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
    check_diff(before, after, operation, target)
    return after, True


class S3Store:
    def __init__(self):
        self.aws = shutil.which("aws") or "/opt/homebrew/bin/aws"
        self.env = {k: v for k, v in os.environ.items() if not k.startswith("AWS_")}
        auth = Path.home() / ".aws" / "tennis-publisher"
        self.env.update(AWS_SHARED_CREDENTIALS_FILE=str(auth / "credentials"), AWS_CONFIG_FILE=str(auth / "config"), AWS_EC2_METADATA_DISABLED="true", AWS_PAGER="")

    def run(self, *args):
        done = subprocess.run([self.aws, "--profile", CONFIG["profile"], "--region", CONFIG["region"], *args, "--output", "json"], env=self.env, capture_output=True, text=True, timeout=90)
        if done.returncode:
            raise PublishError(done.stderr.strip())
        return json.loads(done.stdout or "{}")

    def read(self):
        with tempfile.TemporaryDirectory(prefix="tennis-read-") as directory:
            path = Path(directory) / "data.json"
            meta = self.run("s3api", "get-object", "--bucket", CONFIG["bucket"], "--key", CONFIG["key"], str(path))
            return path.read_bytes(), meta["ETag"]

    def put(self, raw, etag):
        with tempfile.TemporaryDirectory(prefix="tennis-write-") as directory:
            path = Path(directory) / "data.json"
            path.write_bytes(raw)
            return self.run("s3api", "put-object", "--bucket", CONFIG["bucket"], "--key", CONFIG["key"], "--body", str(path), "--content-type", "application/json", "--cache-control", "public,max-age=300", "--if-match", etag)


def publish(store, match, operation, target=None, dry_run=False):
    original, etag = store.read()
    before = parse_json(original)
    after, changed = prepare(before, match, operation, target)
    summary = {"operation": operation, "id": match["id"], "changed": changed, "dryRun": dry_run, "beforeCount": len(before["matches"]), "afterCount": len(after["matches"]), "changes": {k: {"before": next((m for m in before["matches"] if m["id"] == match["id"]), {}).get(k), "after": v} for k, v in match.items() if next((m for m in before["matches"] if m["id"] == match["id"]), {}).get(k) != v}}
    if changed and not dry_run:
        raw = (json.dumps(after, ensure_ascii=False, allow_nan=False, indent=2) + "\n").encode()
        validate_document(parse_json(raw))
        try:
            store.put(raw, etag)
        except (PublishError, subprocess.TimeoutExpired):
            # A timeout may follow a successful upload. Inspect before any retry.
            verified, _ = store.read()
            if verified != raw:
                raise
        verified, _ = store.read()
        require(verified == raw, "Read-back differs; inspect current data before retrying")
        summary["verified"] = True
    elif not dry_run:
        summary["verified"] = True
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for operation in ("add", "edit"):
        command = sub.add_parser(operation)
        command.add_argument("--input", required=True, help="Match JSON file, or - for stdin")
        if operation == "edit":
            command.add_argument("--id", required=True)
        command.add_argument("--dry-run", action="store_true")
    sub.add_parser("list", help="Read and validate current data")
    args = parser.parse_args()
    try:
        store = S3Store()
        if args.command == "list":
            raw, _ = store.read()
            doc = parse_json(raw)
            validate_document(doc)
            print(json.dumps(doc, ensure_ascii=False, indent=2))
            return
        raw = sys.stdin.buffer.read() if args.input == "-" else Path(args.input).read_bytes()
        print(json.dumps(publish(store, parse_json(raw), args.command, getattr(args, "id", None), args.dry_run), ensure_ascii=False, indent=2))
    except (PublishError, OSError, subprocess.TimeoutExpired) as exc:
        print(f"Tennis publish stopped: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
