#!/usr/bin/env python3
"""
Import 1700+ dispensaries from a JSON file into MongoDB as free-tier
(Unclaimed) Company records.

Usage:
  MONGODB_URI="mongodb+srv://..." python3 scripts/import-dispensaries.py

Place your JSON file at:  scripts/dispensaries.json

The script is safe to re-run — it uses upsert on slug so existing
records are updated rather than duplicated.

Requirements:
  pip install pymongo
"""

import json
import os
import re
import sys
from datetime import datetime, timezone

try:
    from pymongo import MongoClient, UpdateOne
except ImportError:
    print("❌  pymongo not installed.  Run: pip install pymongo")
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
    print("❌  MONGODB_URI not set.")
    sys.exit(1)

JSON_PATH = os.path.join(os.path.dirname(__file__), "dispensaries.json")
if not os.path.exists(JSON_PATH):
    print(f"❌  dispensaries.json not found at {JSON_PATH}")
    sys.exit(1)

LOGO_COLORS = [
    "#1A4A35", "#2d6e52", "#4A5E4A", "#3d5a3e",
    "#2e5540", "#3a5c45", "#445e42", "#1e6b45",
]

BATCH_SIZE = 100


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "dispensary"


def initials(name: str) -> str:
    words = [w for w in name.split() if w]
    if len(words) >= 2:
        return (words[0][0] + words[-1][0]).upper()
    return name[:2].upper() if len(name) >= 2 else (name[0].upper() if name else "DI")


def make_short_desc(entry: dict) -> str:
    desc = (entry.get("description") or "").strip()
    if desc:
        return desc[:200]
    city  = (entry.get("address_city") or "").strip()
    state = (entry.get("address_state") or "").strip()
    name  = (entry.get("name") or "Cannabis Dispensary").strip()
    if city and state:
        return f"{name} is a cannabis dispensary located in {city}, {state}."
    return f"{name} — licensed cannabis dispensary."


def build_doc(entry: dict, index: int, slug: str) -> dict:
    now = datetime.now(timezone.utc)

    logo_url    = (entry.get("logo_url") or "").strip()
    banner_url  = (entry.get("featured_image") or logo_url).strip()

    doc = {
        "slug":             slug,
        "name":             (entry.get("name") or "").strip(),
        "tier":             "free",
        "category":         "retail-dispensary",
        "location": {
            "address": (entry.get("address_street") or "").strip(),
            "city":    (entry.get("address_city")   or "").strip(),
            "state":   (entry.get("address_state")  or "").strip(),
            "zip":     (entry.get("address_zip")    or "").strip(),
        },
        "shortDescription": make_short_desc(entry),
        "fullDescription":  (entry.get("description") or "").strip() or None,
        "serviceTags":      ["Dispensary", "Cannabis Retail"],
        "logoPlaceholder":  initials(entry.get("name") or "DI"),
        "logoColor":        LOGO_COLORS[index % len(LOGO_COLORS)],
        "logoUrl":          logo_url   or None,
        "bannerImageUrl":   banner_url or None,
        "phone":            (entry.get("phone")   or "").strip() or None,
        "email":            (entry.get("email")   or "").strip() or None,
        "website":          (entry.get("website") or "").strip() or None,
        "instagramUrl":     (entry.get("social_instagram") or "").strip() or None,
        "facebookUrl":      (entry.get("social_facebook")  or "").strip() or None,
        "twitterUrl":       (entry.get("social_twitter")   or "").strip() or None,
        "yelpUrl":          (entry.get("social_yelp")      or "").strip() or None,
        "leaflyUrl":        (entry.get("leafly_url")       or "").strip() or None,
        "isFeatured":       False,
        "updatedAt":        now,
    }

    # Remove None values so we don't overwrite existing data with nulls on re-run
    return {k: v for k, v in doc.items() if v is not None or k in
            ("slug", "name", "tier", "category", "location",
             "shortDescription", "logoPlaceholder", "logoColor", "isFeatured", "updatedAt")}


def run():
    print(f"Loading {JSON_PATH} …")
    with open(JSON_PATH, encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, dict):
        # Handle {"dispensaries": [...]} wrapper
        data = data.get("dispensaries") or data.get("data") or list(data.values())[0]

    if not isinstance(data, list):
        print("❌  Expected a JSON array (or object with array value).")
        sys.exit(1)

    print(f"Found {len(data)} entries.")

    print("Connecting to MongoDB …")
    client = MongoClient(MONGODB_URI)
    db     = client.get_default_database()
    col    = db["companies"]

    # Build a set of existing slugs to handle duplicates within the file
    existing_slugs: set = set(
        doc["slug"] for doc in col.find({}, {"slug": 1, "_id": 0})
    )
    used_slugs: set = set(existing_slugs)

    ops      = []
    skipped  = 0
    now      = datetime.now(timezone.utc)

    for i, entry in enumerate(data):
        name = (entry.get("name") or "").strip()
        if not name:
            skipped += 1
            continue

        base_slug = slugify(name)
        slug      = base_slug
        suffix    = 2
        while slug in used_slugs and slug not in existing_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

        doc = build_doc(entry, i, slug)

        ops.append(
            UpdateOne(
                {"slug": slug},
                {
                    "$set":         doc,
                    "$setOnInsert": {"createdAt": now},
                },
                upsert=True,
            )
        )

        # Flush in batches
        if len(ops) >= BATCH_SIZE:
            col.bulk_write(ops, ordered=False)
            print(f"  … inserted/updated {i + 1} / {len(data)}")
            ops = []

    if ops:
        col.bulk_write(ops, ordered=False)

    client.close()

    total = len(data) - skipped
    print(f"\n✅  Done. {total} dispensaries imported ({skipped} skipped — no name).")
    print(f"   They appear at /directory under the Unclaimed filter.\n")


if __name__ == "__main__":
    run()
