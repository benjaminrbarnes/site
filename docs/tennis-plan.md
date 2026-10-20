# Tennis publishing implementation handoff

Status: implemented October 20, 2026; see `docs/tennis-operations.md` for live resources and commands.
The user subsequently authorized production samples and end-to-end implementation;
sample records are explicitly marked and excluded from real statistics.
Date: 2026-10-20. Read this with repository instructions before implementing.

## Goal and scope

Ben texts Hermes a result; Hermes adds or edits one match; `/tennis/` updates
without a Git commit or site deployment. Keep one public JSON document.
No database, Notion, per-match objects, Lambda, or custom service.
Ben accepts that the agent technically can replace the entire document.
He explicitly proposed/authorized a small Python add/edit publishing program.
Infrastructure implementation is now authorized by the subsequent user goal.

Current site is Astro static, Amplify deploys `master`.
Running is generated from Markdown at build time. Tennis must fetch at runtime.
ETC dropdown now includes Running, Sauna, and a disabled Tennis/Coming soon label.
Replace the label with a link when the real page exists. Photos stays the homepage.

## Infrastructure and authentication

1. Inspect current account and region without exposing secrets. Current session
   may be root: use it only for explicitly approved tennis provisioning.
2. Create a dedicated uniquely named S3 bucket for tennis data. Enable versioning,
   bucket-owner-enforced object ownership, and default encryption. Use a lifecycle
   rule to expire noncurrent versions after 90 days; preserve current version.
3. Store only `tennis/matches.json`. Seed with clearly labeled sample entries per
   Ben's subsequent authorization; never represent them as real match history.
4. Public delivery: simplest option is the regional HTTPS S3 object URL, with
   anonymous GetObject permitted ONLY for that exact key. Configure CORS GET/HEAD
   for `https://www.benjaminbarnes.co`. Inspect account public-access controls first;
   do not weaken account-level controls. If they prohibit this, use private S3
   with CloudFront OAC instead, and report the extra component.
5. Content-Type application/json; Cache-Control public,max-age=300.
   Five-minute staleness is acceptable; no invalidation permission needed.
6. For Mac-based unattended Hermes, use a dedicated IAM USER with no console
   password and one access key, not a role with an expiring human login.
   Explain this terminology correction to Ben: roles need another credential source.
   Inline policy permits ONLY GetObject and PutObject on this exact object ARN.
   No ListBucket, DeleteObject, GetObjectVersion, ACL, IAM, or deployment permissions.
7. Create/store the secret directly in the existing supported credential facility
   used by Hermes/AWS CLI, in an isolated `tennis-publisher` profile. Never print
   it, commit it, put it in Obsidian, or expose it to browser JavaScript.
   Inspect the actual Hermes runtime first; don't assume its environment or paths.
   Verify its restricted identity without root fallback. Keys don't auto-expire,
   but revocation/rotation requires maintenance.

## Data contract v1

Top level: `schemaVersion: 1`, `updatedAt` UTC ISO timestamp, `matches` array.
Every match:
- `id`: stable UUID; retry must reuse it; edits never change it.
- `date`: YYYY-MM-DD local played date, not a timestamp converted through UTC.
- `league`: display string (T2, USTA ladder, friendly, etc.).
- `season`: nullable string.
- `format`: singles or doubles.
- `opponents`: array of display names (1 singles / 2 doubles when known).
- `partner`: nullable display name.
- `status`: completed, retired, walkover, or historical-unknown.
- `result`: win, loss, or unknown.
- `sets`: array; `{kind: "set", ben: 4, opponent: 6}`.
  Optional set `tiebreak: {ben: 5, opponent: 7}`.
  A deciding match tiebreak is `{kind: "match-tiebreak", ben: 10, opponent: 8}`.
- Optional `notes`: public match-specific text only.

Scores always from Ben/Ben's team's perspective. Allow empty sets and unknown
opponents for incomplete historical records; don't invent details or infer
retirement/walkover winners. Validate nonnegative integers and field types; don't
overfit standard scoring rules in v1. Do not store private phone/email, court
booking records, authentication data, or private agent notes.
Compute stats in the UI, not stored totals. Separate singles/doubles; explicitly
define counted results and exclude unknown results. Keep walkover counts distinct.

## Small deterministic publisher

Suggested `scripts/tennis_publish.py`, Python standard library plus installed
AWS CLI via subprocess argument arrays (no shell interpolation). No daemon/MCP.
Commands:

```
python3 scripts/tennis_publish.py add --input new-match.json --dry-run
python3 scripts/tennis_publish.py add --input new-match.json
python3 scripts/tennis_publish.py edit --id UUID --input corrected-match.json
```

Repository-owned code is now authorized; use minimal built-in validation rather
than introducing a schema framework/dependency for this small contract.
Always use the explicit restricted profile/bucket/key, not ambient root credentials.
Download current object into a private temporary directory and retain its ETag.
Parse with duplicate-key rejection and reject NaN/infinity. Validate entire document.
Construct candidate by deep-copying, then adding one record or replacing exactly
one existing ID. For add, exact retry of an existing identical ID is a verified
no-op; conflicting duplicate fails. For edit, missing ID fails.

Compare records by ID, not textual formatting/order:
- Add: exactly one new ID; zero removed IDs; every old record deeply equal.
- Edit: identical ID set; only the target record may differ.
- Only top-level updatedAt may otherwise change.
Reject any violation. Print concise human-readable change summary, no secrets.
Dry-run does not upload. Serialize valid UTF-8 JSON and validate again.
Upload with `s3api put-object --if-match ORIGINAL_ETAG`; no blind overwrite/retry.
On conflict, abort with reread-and-reapply instruction (do not automatically merge).
Read back via authenticated S3 and compare actual bytes/parsed contents.
If send outcome uncertain, read back before retrying. Public page may lag 5 minutes.
Deletion/recovery were subsequently authorized: `delete --id UUID` removes exactly
one record with the same diff/concurrency/read-back safeguards. `versions` and
`restore --version-id VERSION` support recovery without deleting backup versions.
Corrections use edit; historical import adds one
validated record at a time, preserving IDs across retries.

## Website

Build `/tennis/` using existing typography/layout. Fetch public JSON at runtime.
Responsive match list grouped by year, newest first, record summary and simple
league/singles/doubles filters. Show date, league, opponents/partner, W/L, set scores.
Use safe text nodes, not innerHTML from public data. Validate incoming data enough
to avoid rendering a broken document. Provide loading, empty, error/retry, and
last-updated states; failed fetch must not appear as a zero-match record.
Five-minute cache on ordinary visits is fine; no automatic constant polling.
No credentials in browser or build output.

## Verification and Hermes handoff

Unit tests: valid add/edit; unchanged unrelated records; duplicate/conflicting IDs;
invalid JSON/types/dates; unknown history; doubles and tiebreaks; concurrency failure;
read-back mismatch; retry no-op. Mock AWS for tests. Never use production as a fixture.
Build site and check desktop/mobile, keyboard ETC menu, empty/error states,
and dates without timezone drift.

Test restricted credentials with expected allowed read and an IAM policy simulation
for denied unrelated writes/deletes; don't create unrelated test objects.
Exercise full add/edit workflow in a separate staging key/profile if needed,
then remove staging permissions. Production demo records must stay marked sample
and excluded from real statistics, per Ben's subsequent testing authorization.
Once ready, give Ben the exact Hermes instruction for adding one real match.
Ben may ask Hermes directly; don't message Hermes externally without explicit approval.
Inspect existing Hermes skill/config instructions and integrate a short publishing
procedure with examples. No vendor patches or new services.
Initial historical import waits for authoritative records and Ben's desired public
names/notes. Don't infer history from scheduled matches or reservations.

## Rollback and acceptance

Hermes can preview and restore an older version when Ben requests recovery, using
GetObjectVersion and prefix-scoped ListBucketVersions. It cannot delete backup versions.
Report exact new resources, public data URL, restricted profile, tested permissions,
deployment result, and credential rotation/revocation procedure without secrets.
Version rollback restores bad data updates; Git revert restores UI/publisher code.
Acceptance: normal Hermes updates need no password, only one match changes per
command, prior records remain intact, and public page updates within cache lifetime.
