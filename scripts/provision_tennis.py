#!/usr/bin/env python3
"""One-time admin provisioning for Ben's tennis publisher. Never prints keys."""
import configparser
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / "tennis-config.json").read_text())
USER = "ben-website-tennis-publisher"


def aws(*args, allow_missing=False):
    done = subprocess.run(["/opt/homebrew/bin/aws", "--region", CONFIG["region"], *args, "--output", "json"], capture_output=True, text=True, timeout=90)
    if done.returncode:
        if allow_missing and any(code in done.stderr for code in ("NoSuchEntity", "NoSuchBucket", "Not Found", "404", "NoSuchPublicAccessBlockConfiguration")):
            return None
        raise RuntimeError(done.stderr.strip())
    return json.loads(done.stdout or "{}")


def main():
    identity = aws("sts", "get-caller-identity")
    if identity["Account"] != "552544732655":
        raise RuntimeError("Wrong AWS account")
    account_block = aws("s3control", "get-public-access-block", "--account-id", identity["Account"], allow_missing=True)
    if account_block and any(account_block["PublicAccessBlockConfiguration"].values()):
        raise RuntimeError("Account public-access controls enabled; use CloudFront OAC rather than weakening them")
    if aws("s3api", "head-bucket", "--bucket", CONFIG["bucket"], allow_missing=True) is None:
        aws("s3api", "create-bucket", "--bucket", CONFIG["bucket"], "--object-ownership", "BucketOwnerEnforced")
    aws("s3api", "put-public-access-block", "--bucket", CONFIG["bucket"], "--public-access-block-configuration", json.dumps({"BlockPublicAcls": True, "IgnorePublicAcls": True, "BlockPublicPolicy": False, "RestrictPublicBuckets": False}))
    aws("s3api", "put-bucket-versioning", "--bucket", CONFIG["bucket"], "--versioning-configuration", "Status=Enabled")
    aws("s3api", "put-bucket-encryption", "--bucket", CONFIG["bucket"], "--server-side-encryption-configuration", json.dumps({"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}))
    aws("s3api", "put-bucket-lifecycle-configuration", "--bucket", CONFIG["bucket"], "--lifecycle-configuration", json.dumps({"Rules": [{"ID": "tennis-history-90-days", "Status": "Enabled", "Filter": {"Prefix": CONFIG["key"]}, "NoncurrentVersionExpiration": {"NoncurrentDays": 90}}]}))
    aws("s3api", "put-bucket-cors", "--bucket", CONFIG["bucket"], "--cors-configuration", json.dumps({"CORSRules": [{"AllowedOrigins": ["https://www.benjaminbarnes.co", "https://benjaminbarnes.co", "http://127.0.0.1:4330"], "AllowedMethods": ["GET", "HEAD"], "AllowedHeaders": ["*"], "ExposeHeaders": ["ETag"], "MaxAgeSeconds": 300}]}))
    resource = f"arn:aws:s3:::{CONFIG['bucket']}/{CONFIG['key']}"
    aws("s3api", "put-bucket-policy", "--bucket", CONFIG["bucket"], "--policy", json.dumps({"Version": "2012-10-17", "Statement": [{"Sid": "PublicReadTennisOnly", "Effect": "Allow", "Principal": "*", "Action": "s3:GetObject", "Resource": resource}, {"Sid": "RequireTLS", "Effect": "Deny", "Principal": "*", "Action": "s3:*", "Resource": [f"arn:aws:s3:::{CONFIG['bucket']}", f"arn:aws:s3:::{CONFIG['bucket']}/*"], "Condition": {"Bool": {"aws:SecureTransport": "false"}}}]}))
    if aws("iam", "get-user", "--user-name", USER, allow_missing=True) is None:
        aws("iam", "create-user", "--user-name", USER, "--tags", "Key=Purpose,Value=PublicTennisPublishing")
    aws("iam", "put-user-policy", "--user-name", USER, "--policy-name", "TennisObjectOnly", "--policy-document", json.dumps({"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["s3:GetObject", "s3:PutObject"], "Resource": resource}]}))
    auth = Path.home() / ".aws" / "tennis-publisher"
    auth.mkdir(mode=0o700, parents=True, exist_ok=True)
    credentials = auth / "credentials"
    if not credentials.exists():
        keys = aws("iam", "list-access-keys", "--user-name", USER)["AccessKeyMetadata"]
        if keys:
            raise RuntimeError("User already has a key but local credential file is absent; inspect before creating more")
        key = aws("iam", "create-access-key", "--user-name", USER)["AccessKey"]
        ini = configparser.ConfigParser()
        ini[CONFIG["profile"]] = {"aws_access_key_id": key["AccessKeyId"], "aws_secret_access_key": key["SecretAccessKey"]}
        with os.fdopen(os.open(credentials, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as stream:
            ini.write(stream)
    config_path = auth / "config"
    if not config_path.exists():
        ini = configparser.ConfigParser()
        ini[f"profile {CONFIG['profile']}"] = {"region": CONFIG["region"], "output": "json"}
        with os.fdopen(os.open(config_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as stream:
            ini.write(stream)
    print(json.dumps({"bucket": CONFIG["bucket"], "user": USER, "credentialDirectory": str(auth), "publicUrl": CONFIG["publicUrl"]}))


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, subprocess.TimeoutExpired) as exc:
        print(f"Provisioning stopped: {exc}", file=sys.stderr)
        sys.exit(1)
