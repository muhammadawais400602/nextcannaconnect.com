#!/usr/bin/env python3
"""
One-time cleanup: removes test/rejected user accounts, their companies,
and their signup applications from MongoDB.

Run:
  MONGODB_URI="mongodb+srv://..." python3 scripts/cleanup-test-accounts.py

Requirements:
  pip install pymongo
"""

import os
import re
import sys

try:
    from pymongo import MongoClient
except ImportError:
    print("❌  pymongo not installed.  Run: pip install pymongo")
    sys.exit(1)

# Load .env.local if present
env_path = os.path.join(os.path.dirname(__file__), "../.env.local")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            m = re.match(r'^([A-Z_][A-Z0-9_]*)=(.*)$', line.strip())
            if m:
                os.environ.setdefault(m.group(1), m.group(2).strip("\"'"))

MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    print("❌  MONGODB_URI not set.")
    sys.exit(1)

TEST_EMAILS = [
    "freelancebyawyy@gmail.com",
    "malikawyy@gmail.com",
    "cocomo1351@gmail.com",
]


def run():
    client = MongoClient(MONGODB_URI)
    db = client.get_default_database()

    users_col    = db["companies"]  # will look up companyIds first
    companies_col = db["companies"]
    users_col    = db["users"]
    signups_col  = db["signupapplications"]

    # Find companyIds linked to these users before deleting them
    users = list(db["users"].find({"email": {"$in": TEST_EMAILS}}, {"companyId": 1}))
    company_ids = [u["companyId"] for u in users if u.get("companyId")]

    # Delete companies linked to these users
    if company_ids:
        res = db["companies"].delete_many({"_id": {"$in": company_ids}})
        print(f"✅  Deleted {res.deleted_count} linked company/companies")
    else:
        # Fallback: try deleting by company name "cofcode"
        res = db["companies"].delete_many({"name": "cofcode"})
        print(f"✅  Deleted {res.deleted_count} company/companies named 'cofcode'")

    # Delete users
    res = db["users"].delete_many({"email": {"$in": TEST_EMAILS}})
    print(f"✅  Deleted {res.deleted_count} user(s)")

    # Delete signup applications
    res = db["signupapplications"].delete_many({"email": {"$in": TEST_EMAILS}})
    print(f"✅  Deleted {res.deleted_count} signup application(s)")

    client.close()
    print("\nDone. All test accounts and applications removed.")


if __name__ == "__main__":
    run()
