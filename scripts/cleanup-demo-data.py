#!/usr/bin/env python3
"""
One-time cleanup: removes all demo/test companies and accounts from MongoDB.

Deletes:
  Companies : greenleaf-packaging-co, desert-bloom-cannabis-demo
  Users     : demo.dispensary@nextcanna.com

Run:
  MONGODB_URI="mongodb+srv://..." python3 scripts/cleanup-demo-data.py

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

DEMO_SLUGS  = ["greenleaf-packaging-co", "desert-bloom-cannabis-demo"]
DEMO_EMAILS = ["demo.dispensary@nextcanna.com"]


def run():
    client = MongoClient(MONGODB_URI)
    db = client.get_default_database()

    # Companies
    result = db["companies"].delete_many({"slug": {"$in": DEMO_SLUGS}})
    print(f"✅  Deleted {result.deleted_count} demo company/companies")

    # Users
    result = db["users"].delete_many({"email": {"$in": DEMO_EMAILS}})
    print(f"✅  Deleted {result.deleted_count} demo user(s)")

    client.close()
    print("\nAll demo data removed. Database is clean.")


if __name__ == "__main__":
    run()
