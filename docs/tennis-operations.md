# Tennis website operations

The live page is https://www.benjaminbarnes.co/tennis/ . It reads a public JSON
document at runtime; publishing a result does not rebuild the site.

## Resources and authentication

- Account: 552544732655; region: us-east-1.
- Dedicated bucket: `benjaminbarnes-tennis-552544732655`.
- Only public key: `tennis/matches.json` (regional HTTPS URL in `tennis-config.json`).
- Versioning enabled; noncurrent versions expire after 90 days. Current data is retained.
- Encryption: SSE-S3 AES256; ACLs disabled; HTTPS required.
- CORS allows the two production origins and local preview 127.0.0.1:4330.
- Cache-Control: `public,max-age=300`; no invalidations or constant polling required.
- Dedicated IAM user: `ben-website-tennis-publisher`, no console login.
- Inline policy `TennisObjectOnly`: only GetObject/PutObject on the exact JSON key.
- Isolated AWS profile: `tennis-publisher`, credentials/config under
  `/Users/ben/.aws/tennis-publisher/` with owner-only access. No credentials in Git.
- Publisher strips ambient AWS variables and uses only this profile. Missing or
  revoked credentials fail; it cannot silently use the root session.

The IAM key is long-lived, so normal publishing needs no password or browser login.
To revoke access, an admin can deactivate/delete the IAM user's access key (resolve
its ID using list-access-keys; do not print its secret). To rotate, create a replacement
key, update ONLY the isolated credentials file with owner-only permissions, verify
publisher read/write, then deactivate/delete the old key. The one-time provisioning
script is intended for initial setup, not rotation; it preserves an existing file.
Never change the account root credentials or default profile for this feature.

## Commands

From the repository, or use the absolute publisher path from anywhere:

```
python3 scripts/tennis_publish.py list
python3 scripts/tennis_publish.py add --input match.json --dry-run
python3 scripts/tennis_publish.py add --input match.json
python3 scripts/tennis_publish.py edit --id UUID --input revised-match.json --dry-run
python3 scripts/tennis_publish.py edit --id UUID --input revised-match.json
```

`--input -` reads stdin. Input is one complete match object, not the whole document.
See `hermes-skills/tennis-website/SKILL.md` for the contract and score conventions.
`docs/tennis-examples/` contains explicitly fake records; `sample: true` excludes
them from real statistics. Real records use `sample: false` or omit the flag.

The semantic diff checks that only the selected record changes and no old records
disappear/reorder. Upload uses the downloaded ETag; conflicts stop. Identical retry
is a no-op. Successful writes are read back byte-for-byte. Never blindly retry an
uncertain upload. `verified: true` establishes S3 read-back; public caches may lag.

There is no agent delete operation. Admins can remove demos once Ben requests it,
using a reviewed versioned update. Do not infer historical results from bookings.

## Hermes

The repository-owned skill is linked into both default and ava profiles at
`skills/productivity/tennis-website/SKILL.md`. Both profiles use a local terminal.
`hermes skills list --source local --enabled-only` (and `hermes -p ava ...`) verifies
discovery. New skill discovery is supported without changing vendor source.

Ben can text: “Update my tennis website: change the notes on Sample opponent A
to ‘Tested from my phone.’ Keep it marked as a sample match.”

For a real new result, provide played date, league, singles/doubles, opponent(s),
partner if doubles, result and score. Hermes asks for material unknowns and runs
the dry-run/publish sequence. It does not submit scores to a league or message opponents.

## Rollback and verification

Use admin `list-object-versions` on the exact key, inspect a prior version, and
restore it as a NEW current version with correct content headers. Do not delete
version history or let Hermes perform administrative rollback. Website code can
be rolled back through Git and Amplify.

```
python3 -m unittest discover -s tests -v
npm run build
```

Check desktop/mobile, filtering, sample exclusions, failure/empty states and exact
local dates. No new package dependency, daemon, database, API server or gateway
patch is required. `scripts/provision_tennis.py` is the explicitly authorized
one-time admin setup; don't run it from Hermes.
