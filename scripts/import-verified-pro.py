#!/usr/bin/env python3
"""
Import Verified Pro (elite-tier) dispensary listings from a JSON file into MongoDB.

Usage:
  MONGODB_URI="mongodb+srv://..." python3 scripts/import-verified-pro.py

Place your JSON file at: scripts/verified-pro-dispensaries.json

The script is safe to re-run — it uses upsert on slug so existing records
are updated rather than duplicated.

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

JSON_PATH = os.path.join(os.path.dirname(__file__), "verified-pro-dispensaries.json")
if not os.path.exists(JSON_PATH):
    print(f"❌  verified-pro-dispensaries.json not found at {JSON_PATH}")
    sys.exit(1)

LOGO_COLORS = [
    "#1A4A35", "#2d6e52", "#4A5E4A", "#3d5a3e",
    "#2e5540", "#3a5c45", "#445e42", "#1e6b45",
]

BATCH_SIZE = 100

PLACEHOLDER_PHRASES = [
    "available on listing",
    "available via",
]


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


def is_placeholder(val: str | None) -> bool:
    if not val:
        return True
    lower = val.lower()
    return any(p in lower for p in PLACEHOLDER_PHRASES)


def clean_email(raw: str | None) -> str:
    if not raw:
        return ""
    m = re.match(r'\[([^\]]+)\]\(mailto:[^)]+\)', raw)
    return m.group(1).strip() if m else raw.strip()


def build_doc(entry: dict, index: int, slug: str, now: datetime) -> dict:
    branding = entry.get("branding") or {}
    contact  = entry.get("contact")  or {}
    social   = entry.get("social_links") or {}
    stats    = entry.get("stats")    or {}
    about    = entry.get("about")    or {}

    name = (entry.get("company_name") or "").strip()

    doc: dict = {
        "slug":             slug,
        "name":             name,
        "tier":             "elite",
        "category":         "retail-dispensary",
        "location": {
            "address": (entry.get("address") or "").strip(),
            "city":    (entry.get("city")    or "").strip(),
            "state":   (entry.get("state")   or "").strip(),
            "zip":     "",
        },
        "shortDescription": (entry.get("short_description") or f"{name} — licensed cannabis dispensary.").strip(),
        "logoPlaceholder":  (branding.get("logo_initials") or initials(name)).upper()[:2],
        "logoColor":        branding.get("logo_color") or LOGO_COLORS[index % len(LOGO_COLORS)],
        "serviceTags":      entry.get("core_services_tags") if isinstance(entry.get("core_services_tags"), list) else ["Dispensary", "Cannabis Retail"],
        "isFeatured":       False,
        "updatedAt":        now,
    }

    # About / description
    full_desc = (about.get("full_description") or "").strip()
    if full_desc:
        doc["fullDescription"] = full_desc

    # Branding images
    logo_url   = (branding.get("logo_image_url")   or "").strip()
    banner_url = (branding.get("banner_image_url") or "").strip()
    if logo_url:
        doc["logoUrl"] = logo_url
    if banner_url:
        doc["bannerImageUrl"] = banner_url

    # Contact
    website = (contact.get("website") or "").strip()
    if website and not is_placeholder(website):
        doc["website"] = website

    phone = (contact.get("phone") or "").strip()
    if phone:
        doc["phone"] = phone

    email = clean_email(contact.get("email"))
    if email and not is_placeholder(email):
        doc["email"] = email

    # Social links
    if (v := (social.get("instagram") or "").strip()):  doc["instagramUrl"] = v
    if (v := (social.get("facebook")  or "").strip()):  doc["facebookUrl"]  = v
    if (v := (social.get("twitter")   or "").strip()):  doc["twitterUrl"]   = v
    if (v := (social.get("linkedin")  or "").strip()):  doc["linkedinUrl"]  = v
    if (v := (social.get("youtube")   or "").strip()):  doc["youtubeUrl"]   = v
    if (v := (social.get("yelp")      or "").strip()):  doc["yelpUrl"]      = v
    if (v := (social.get("leafly")    or "").strip()):  doc["leaflyUrl"]    = v
    # Also pick up leafly_url at root level
    if (v := (entry.get("leafly_url") or "").strip()):  doc["leaflyUrl"]    = v

    # Stats
    if stats.get("founded_year"):
        doc["foundedYear"] = int(stats["founded_year"])
    if stats.get("team_size"):
        doc["teamSize"] = str(stats["team_size"])
    if (v := (stats.get("regions_served") or "").strip()):
        doc["serviceArea"] = v
    if stats.get("years_in_cannabis"):
        doc["yearsInCannabis"] = int(stats["years_in_cannabis"])

    # States served & certifications
    states = entry.get("states_served")
    if isinstance(states, list) and states:
        doc["statesServed"] = states

    certs = entry.get("certifications")
    if isinstance(certs, list) and certs:
        doc["certifications"] = certs

    # Ratings
    if entry.get("rating") is not None:
        doc["rating"] = float(entry["rating"])
    if entry.get("review_count") is not None:
        doc["reviewCount"] = int(entry["review_count"])

    # Products
    products = entry.get("product_offerings")
    if isinstance(products, list) and products:
        doc["products"] = [
            {
                "name":        p.get("name", ""),
                "description": p.get("description", ""),
                **({"imageUrl": p["image_url"]} if p.get("image_url") else {}),
            }
            for p in products
        ]

    return doc


def run():
    print(f"Loading {JSON_PATH} …")
    with open(JSON_PATH, encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, dict):
        data = next((v for v in data.values() if isinstance(v, list)), None)
        if data is None:
            print("❌  Expected a JSON array (or object with array value).")
            sys.exit(1)

    if not isinstance(data, list):
        print("❌  Expected a JSON array.")
        sys.exit(1)

    print(f"Found {len(data)} entries.")

    print("Connecting to MongoDB …")
    client = MongoClient(MONGODB_URI)
    db     = client.get_default_database()
    col    = db["companies"]

    existing_slugs: set = set(
        doc["slug"] for doc in col.find({}, {"slug": 1, "_id": 0})
    )
    used_slugs: set = set(existing_slugs)

    ops     = []
    skipped = 0
    now     = datetime.now(timezone.utc)

    for i, entry in enumerate(data):
        name = (entry.get("company_name") or "").strip()
        if not name:
            skipped += 1
            print(f"  ⚠  Entry {i + 1} skipped — no company_name.")
            continue

        base_slug = slugify(name)
        slug      = base_slug
        suffix    = 2
        while slug in used_slugs and slug not in existing_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

        doc = build_doc(entry, i, slug, now)

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

        if len(ops) >= BATCH_SIZE:
            col.bulk_write(ops, ordered=False)
            print(f"  … inserted/updated {i + 1} / {len(data)}")
            ops = []

    if ops:
        col.bulk_write(ops, ordered=False)

    client.close()

    total = len(data) - skipped
    print(f"\n✅  Done. {total} Verified Pro dispensaries imported ({skipped} skipped — no name).")
    print(f"   They appear at /directory under the Verified Pro filter.\n")


if __name__ == "__main__":
    run()
