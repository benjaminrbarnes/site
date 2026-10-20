---
name: tennis-website
description: Publish or correct Ben's public tennis match history on benjaminbarnes.co when he says to update his website with a match, score, or historical tennis results. Use for public match publishing, not court bookings or league result submission.
---

# Tennis website

Live page: https://www.benjaminbarnes.co/tennis/
Publisher: `/Users/ben/Documents/Development.nosync/site/scripts/tennis_publish.py`.
Run with `python3`; it uses its own isolated restricted AWS profile. No password
or root login is needed. Never print or inspect AWS credential files. No gateway
restart, deployment, IAM change, or direct S3 overwrite is needed for match updates.

Ben authorizes publishing when he asks to update his website with match details.
He also authorized clearly labeled sample entries for testing. Existing sample
entries are marked `sample: true` and excluded from real stats. Keep that flag when
editing tests; real matches use `sample: false`. Never turn a fake opponent or score
into a real record. Do not infer played results from calendar entries/reservations.

## Workflow

1. Read current matches with:
   `python3 /Users/ben/Documents/Development.nosync/site/scripts/tennis_publish.py list`
2. Resolve whether the user wants a new match or a correction. Match existing date,
   league, opponents and format; do not add a duplicate of an already-recorded match.
   Use actual played date in America/New_York unless Ben specifies another local date.
3. Create one JSON match input in a temporary working file, or pass JSON through
   stdin (`--input -`). Generate a UUID once for a new match and reuse it on retries.
   For edits preserve the existing UUID and copy the full existing record, modifying
   only the requested fields. Scores always from Ben's/team's perspective.
4. Run `add --input PATH --dry-run` or `edit --id UUID --input PATH --dry-run`.
   Inspect the semantic diff. Then repeat without `--dry-run`. One command changes
   one match; process a historical batch one record at a time.
5. Success must report `verified: true` (or an identical verified no-op). On a
   conflict/error, reread current data before doing anything else; never blindly
   retry or bypass the publisher. Report failure if it cannot be resolved safely.
6. Reply briefly with what was published, score/date, and the live page link.
   Public browser caches can lag up to five minutes. Don't claim browser rendering
   was verified unless you actually checked it. Authenticated S3 read-back is what
   `verified` establishes. No need to send any other messages.

## JSON match fields

Required fields: `id` (UUID), `date` (YYYY-MM-DD), `league` (text), `season` (text or
null), `format` (singles/doubles), `opponents` (array of display names), `partner`
(text or null; null in singles), `status` (completed/retired/walkover/historical-unknown),
`result` (win/loss/unknown), `sets` (array). Optional `sample` boolean, `notes` public text.

Each set: `{"kind":"set","ben":6,"opponent":4}`.
Set tiebreak: `{"kind":"set","ben":7,"opponent":6,"tiebreak":{"ben":7,"opponent":5}}`.
Match tiebreak: `{"kind":"match-tiebreak","ben":10,"opponent":8}`.
Incomplete historical scores can use `sets: []`; unknown opponents `opponents: []`.
Ask for missing material details of a new result rather than inventing league/date.
Retirements/walkovers must reflect what Ben actually reports. No private phone,
email, credentials, scheduling notes, or unrelated personal details belong here.

Example sample files are in `/Users/ben/Documents/Development.nosync/site/docs/tennis-examples/`.
For the initial user test, changing `notes` on sample opponent A is safe and keeps
all real statistics untouched. There is no delete command; if Ben asks to remove
the demos entirely, explain that admin cleanup is required rather than overwriting
the document with the agent credentials.

The publisher validates the whole JSON, permits exactly one new/edited ID,
preserves every other record, checks concurrency via ETag, and reads back its write.
It deliberately has no root credential fallback. If authentication fails, report
the exact error without exposing keys; don't run `aws login` or use default credentials.
