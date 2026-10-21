# Website AWS access

## Everyday identity

Use the programmatic IAM user `ben-website-maintainer`, not the account root
session, for ordinary work on this website. There is no console password.
Its long-lived access key does not automatically expire like an `aws login`
session; an administrator can revoke or rotate it. Never create root access keys.

- Account: `552544732655`.
- Identity: `arn:aws:iam::552544732655:user/website/ben-website-maintainer`.
- Named profile: `website-maintainer`.
- Isolated files: `/Users/ben/.aws/website-maintainer/config` and
  `/Users/ben/.aws/website-maintainer/credentials`.
- Directory mode `700`, file modes `600`. No secrets belong in this repository,
  Obsidian, chat, logs, screenshots, or command output.
- AWS policy: `arn:aws:iam::552544732655:policy/website/BenWebsiteMaintainerAccess`.
  The same managed policy is attached as both a permission grant and a permissions
  boundary. Its reviewed source is `website-maintainer-policy.json` in this folder.

Set the explicit isolated profile and remove ambient credentials before running
website AWS commands. This changes only the current process/shell, not Ben's
default/root profile:

```sh
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_SECURITY_TOKEN
unset AWS_DEFAULT_PROFILE AWS_ROLE_ARN AWS_WEB_IDENTITY_TOKEN_FILE
unset AWS_CONTAINER_CREDENTIALS_RELATIVE_URI AWS_CONTAINER_CREDENTIALS_FULL_URI
unset AWS_CONTAINER_AUTHORIZATION_TOKEN AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE
export AWS_CONFIG_FILE=/Users/ben/.aws/website-maintainer/config
export AWS_SHARED_CREDENTIALS_FILE=/Users/ben/.aws/website-maintainer/credentials
export AWS_PROFILE=website-maintainer
export AWS_EC2_METADATA_DISABLED=true
export AWS_REGION=us-east-1
aws sts get-caller-identity
```

Require the exact IAM-user ARN above before writes. If credentials fail, stop;
never fall back to root or another profile. A profile is credential separation,
not an OS sandbox: other local processes running as Ben may have file access.

## Permitted operations

- List/read/upload/replace/delete current objects only under
  `s3://benjaminbarnes.co/photos/` (bucket region `us-west-2`), including multipart
  upload operations and reading/listing retained versions.
- Read/write only `s3://benjaminbarnes-tennis-552544732655/tennis/matches.json`
  and read/list its retained versions. Use `scripts/tennis_publish.py` for match
  changes instead of rewriting the document manually.
- Read bucket location, versioning, encryption, and lifecycle configuration for
  those two buckets; no bucket configuration writes.
- Inspect/invalidate only CloudFront distributions `E1CR178U2NK86M` (image handler)
  and `E32K5P3LYOEF4Q` (original files).
- Inspect Amplify app `d805pdw6o5mtv` and its deployment history, and inspect/start/
  stop existing `master` deployment jobs. This does not authorize an unrequested deployment. Git access
  remains separate from AWS authentication.
- Inspect configuration and logs for
  `ImageResizer-BackEndImageHandlerLambdaFunctionADEF-kOgafqrYuc6j` and read API
  Gateway REST API `04857sl81a`. No Lambda/API/infrastructure modifications.

## Safety boundary and recovery

No IAM/account/organization administration, role assumption, unrelated private
resources, billing access, bucket/ACL/public-access changes, infrastructure edits,
or permanent object-version deletion. The identity cannot grant itself more
permissions, disable versioning, or change backup retention. Adding broader
grants alone cannot bypass its permissions boundary.

Photo-bucket versioning was enabled on October 21, 2026 at 11:47 UTC. Existing
objects were not changed. No lifecycle/automatic deletion rule was added; stored
old versions consume S3 storage. AWS recommends waiting 15 minutes after the first
enablement before PUT/DELETE operations: do not write before 12:02:14 UTC
(8:02:14 AM Eastern) on this date. Require a non-null version ID on subsequent
test/new uploads. A normal current-object delete then creates a recoverable delete
marker. Restore by reading/copying an older version to a new current version;
never purge versions. This is recovery, not an independent cross-account backup.

Always resolve exact objects and review the expected diff before replacement or
deletion. Prefer new prefixes for new albums. The scope of this credential does
not override Ben's approval requirements for public uploads or deployments.

Tennis has separate existing versioning and 90-day noncurrent-version retention;
this setup did not change that lifecycle policy.

## Existing Hermes publisher stays separate

Hermes uses `ben-website-tennis-publisher` with the isolated `tennis-publisher`
profile, not this broader identity. Its single active long-lived key was verified
October 21, 2026. It has no console password, groups, or attached managed policies;
its inline `TennisObjectOnly` policy permits GetObject/PutObject/GetObjectVersion
only on the tennis document, plus ListBucketVersions for that exact key. It has
no S3 DeleteObject/DeleteObjectVersion permission. Removing one match rewrites the
versioned JSON through the validated publisher; it does not delete the S3 object.
The identity/key/policy and Hermes configuration were left unchanged.

## Verification on October 21, 2026

- Current policy version `v4` matches `website-maintainer-policy.json` exactly;
  IAM Access Analyzer reported no findings. It is both the attached grant and
  the user's permissions boundary. No other policies/groups/console login exist.
- Actual isolated-profile requests verified the exact IAM-user identity, photo
  object reads/prefix listing/versioning, both website image-service components,
  log-stream metadata, and Amplify app/branch/job/job-history reads. IAM user
  listing was actually denied. No deployment or cache invalidation was triggered.
- Policy simulations confirmed permitted media/deployment operations and denied
  IAM administration, role assumption, unrelated-resource writes/job listing,
  other-branch deployment, bucket/security/retention changes, infrastructure edits,
  and permanent version deletion. A simulated extra broad identity grant could
  not bypass the permissions boundary.
- Hermes's isolated identity and current tennis-object read worked. Its existing
  policy, one active key, absent login profile, and 90-day version lifecycle were
  read back without changing them. All 23 publisher unit tests passed.
- After the full propagation interval, a disposable object under
  `photos/_access-checks/2026-10-21-f751e0c3-7fec-4652-878d-9d80da68ed9c.txt`
  passed actual upload, versioned overwrite, byte read-back, prior-version read,
  deletion, restore-as-new-version, and byte-identical restored read-back checks.
  Permanent version deletion was actually rejected with AccessDenied. The current
  test object was removed recoverably; three tiny test versions and two delete
  markers remain. No real photo or tennis data was changed by these tests.

## Key maintenance

An administrator must rotate/revoke this user's key. To rotate: create a second
key without displaying its secret, configure only the isolated files with owner-
only permissions, verify the exact identity and permitted operations, then
deactivate the old key. Do not overwrite other profiles or print credential files.
If compromise is suspected, deactivate the key first and investigate CloudTrail.
Removing the permissions boundary requires an administrator and explicit approval.

Sources: live AWS configuration and IAM verification on October 21, 2026;
[IAM access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html);
[S3 versioning propagation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/manage-versioning-examples.html).
