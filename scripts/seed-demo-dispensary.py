#!/usr/bin/env python3
"""
Seed script: insert a demo free-tier (unclaimed) dispensary + test vendor user.

Run:
  MONGODB_URI="mongodb+srv://..." python3 scripts/seed-demo-dispensary.py

Requirements:
  pip install pymongo bcrypt
"""

import os
import re
import sys
from datetime import datetime, timezone

try:
    from pymongo import MongoClient
except ImportError:
    print("❌  pymongo not installed.  Run: pip install pymongo")
    sys.exit(1)

try:
    import bcrypt
except ImportError:
    print("❌  bcrypt not installed.  Run: pip install bcrypt")
    sys.exit(1)

# ── Load .env.local if present ────────────────────────────────────────────────
env_path = os.path.join(os.path.dirname(__file__), "../.env.local")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            m = re.match(r'^([A-Z_][A-Z0-9_]*)=(.*)$', line.strip())
            if m:
                os.environ.setdefault(m.group(1), m.group(2).strip("\"'"))

MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    print("❌  MONGODB_URI not set. Pass it as an env var or add it to .env.local")
    sys.exit(1)

# ── Test credentials ──────────────────────────────────────────────────────────
VENDOR_EMAIL    = "demo.dispensary@nextcanna.com"
VENDOR_PASSWORD = "Demo@NC2024!"
COMPANY_SLUG    = "desert-bloom-cannabis-demo"
# ─────────────────────────────────────────────────────────────────────────────

NOW = datetime.now(timezone.utc)

COMPANY = {
    "slug":             COMPANY_SLUG,
    "name":             "Desert Bloom Cannabis (Demo)",
    "tier":             "free",
    "category":         "retail-dispensary",
    "location": {
        "address": "3500 Las Vegas Blvd S",
        "city":    "Las Vegas",
        "state":   "Nevada",
        "zip":     "89109",
    },
    "shortDescription": (
        "Full-service adult-use and medical cannabis dispensary on the Las Vegas Strip, "
        "offering flower, concentrates, edibles, and accessories with expert budtender service."
    ),
    "fullDescription": (
        "Desert Bloom Cannabis is a licensed adult-use and medical cannabis retailer "
        "serving the Las Vegas metropolitan area. Our knowledgeable budtenders help every "
        "customer find the right product for their needs, whether they are a first-time "
        "visitor or an experienced connoisseur.\n\n"
        "We carry a wide selection of locally grown flower, premium concentrates, edibles, "
        "tinctures, and accessories from Nevada's top cultivators and brands. Our menu is "
        "updated daily and available for online ordering with in-store pickup."
    ),
    "serviceTags": [
        "Adult-Use",
        "Medical Cannabis",
        "Online Ordering",
        "In-Store Pickup",
        "Budtender Guidance",
    ],
    "logoPlaceholder": "DB",
    "logoColor":        "#2d6e52",
    "foundedYear":      2020,
    "website":          "https://example.com/desert-bloom",
    "phone":            "+1 (702) 555-0182",
    "email":            "info@desertbloom.example.com",
    "teamSize":         "12 employees",
    "serviceArea":      "Las Vegas Metro",
    "yearsInCannabis":  4,
    "isFeatured":       False,
    "createdAt":        NOW,
    "updatedAt":        NOW,
}


def run():
    print("Connecting to MongoDB…")
    client = MongoClient(MONGODB_URI)
    db = client.get_default_database()

    companies_col = db["companies"]
    users_col     = db["users"]

    # ── Company ───────────────────────────────────────────────────────────────
    companies_col.delete_one({"slug": COMPANY_SLUG})
    result     = companies_col.insert_one(COMPANY)
    company_id = result.inserted_id
    print(f"✅  Company created : {COMPANY['name']}")
    print(f"   Slug             : {COMPANY_SLUG}")
    print(f"   Tier             : {COMPANY['tier']}  (unclaimed)")
    print(f"   MongoDB ID       : {company_id}")

    # ── Vendor user ───────────────────────────────────────────────────────────
    password_hash = bcrypt.hashpw(VENDOR_PASSWORD.encode(), bcrypt.gensalt()).decode()
    users_col.delete_one({"email": VENDOR_EMAIL})
    users_col.insert_one({
        "email":       VENDOR_EMAIL,
        "fullName":    "Demo Dispensary",
        "companyName": "Desert Bloom Cannabis (Demo)",
        "accountType": "vendor",
        "tier":        "free",
        "category":    "retail-dispensary",
        "companyId":   company_id,
        "passwordHash": password_hash,
        "isActive":    True,
        "createdAt":   NOW,
        "updatedAt":   NOW,
    })
    print(f"✅  Vendor user created : {VENDOR_EMAIL}")

    print()
    print("─" * 52)
    print("  TEST CREDENTIALS")
    print("─" * 52)
    print(f"  Vendor login page : /vendor/login")
    print(f"  Email             : {VENDOR_EMAIL}")
    print(f"  Password          : {VENDOR_PASSWORD}")
    print()
    print(f"  Listing (frontend): /vendor/{COMPANY_SLUG}")
    print(f"  Admin dashboard   : /admin/companies")
    print("─" * 52)

    client.close()


if __name__ == "__main__":
    run()
