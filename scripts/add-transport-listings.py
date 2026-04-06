#!/usr/bin/env python3
import re

listings = [
    # Arizona
    ("Arizona Cannabis Courier", "Phoenix", "AZ", "Licensed Arizona cannabis transportation company providing secure, compliant product delivery services for cultivators, manufacturers, and dispensaries throughout the Phoenix metro and statewide.", ["Cannabis Transport", "Secure Delivery", "Compliance", "Arizona"]),
    ("Desert State Transport", "Tucson", "AZ", "Arizona-licensed cannabis transportation and logistics provider offering secure product transport, chain-of-custody documentation, and METRC-compliant delivery services for licensed cannabis operators statewide.", ["METRC Compliant", "Chain-of-Custody", "Secure Transport", "Arizona"]),
    ("Southwest Cannabis Logistics", "Scottsdale", "AZ", "Scottsdale-based cannabis transportation company providing licensed, insured product delivery services for cannabis manufacturers, cultivators, and dispensaries throughout Arizona.", ["Licensed Transport", "Insured Delivery", "Logistics", "Arizona"]),
    # California
    ("Calyx Courier", "Los Angeles", "CA", "California-licensed cannabis courier service providing secure product transport for licensed cultivators, manufacturers, and dispensaries throughout the Los Angeles basin and statewide.", ["Cannabis Courier", "Secure Transport", "Los Angeles", "California"]),
    ("Cannabis Courier California", "Sacramento", "CA", "Northern California-based licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout the Sacramento Valley and Bay Area.", ["Licensed Transport", "Northern California", "Compliant Delivery", "California"]),
    ("DispatchTrack", "San Jose", "CA", "Last-mile delivery software and logistics management platform serving cannabis delivery operators, providing real-time tracking, route optimization, and delivery management for licensed cannabis couriers.", ["Delivery Software", "Route Optimization", "Real-Time Tracking", "Last-Mile"]),
    ("Meadow", "San Francisco", "CA", "California cannabis delivery technology platform providing licensed delivery management software, compliance tools, and customer-facing delivery solutions for cannabis retailers and delivery services.", ["Delivery Technology", "Compliance Tools", "Online Ordering", "California"]),
    ("Onfleet", "San Francisco", "CA", "World most advanced last-mile delivery software, providing route optimization, real-time tracking, and delivery management for thousands of cannabis delivery operators and courier services nationwide.", ["Last-Mile Software", "Route Optimization", "Real-Time Tracking", "Nationwide"]),
    ("Pacific Cannabis Transport", "San Diego", "CA", "Southern California licensed cannabis transportation company providing secure product delivery, manifest management, and compliance documentation for cannabis operators throughout San Diego and Southern California.", ["Secure Delivery", "Manifest Management", "Southern California", "Compliance"]),
    ("Tymber", "San Francisco", "CA", "Cannabis e-commerce and delivery platform providing licensed delivery management, online ordering, compliance tracking, and customer experience tools for cannabis retailers and delivery services.", ["E-Commerce Platform", "Delivery Management", "Compliance Tracking", "Online Ordering"]),
    # Colorado
    ("Cannabis Transport Services", "Denver", "CO", "Colorado most trusted licensed cannabis courier service, providing reliable, professional, and METRC-compliant product transport for cannabis operators throughout the state since the industry earliest days.", ["METRC Compliant", "Licensed Courier", "Colorado Pioneer", "Colorado"]),
    ("Colorado Cannabis Courier", "Colorado Springs", "CO", "Southern Colorado-based licensed cannabis transportation company providing secure product delivery and compliance documentation for cannabis manufacturers, cultivators, and dispensaries statewide.", ["Licensed Transport", "Compliance Documentation", "Southern Colorado", "Colorado"]),
    ("Front Range Cannabis Logistics", "Fort Collins", "CO", "Northern Colorado licensed cannabis logistics provider offering secure transportation, temperature-controlled delivery, and compliance management for cannabis operators along the Front Range and statewide.", ["Temperature-Controlled", "Front Range", "Compliance Management", "Colorado"]),
    ("Green Mile Transport", "Denver", "CO", "Denver-based licensed cannabis courier service providing on-time, compliant product transport with GPS tracking and real-time delivery visibility for Colorado cannabis operators.", ["GPS Tracking", "Real-Time Visibility", "Compliant Transport", "Colorado"]),
    ("Rocky Mountain Cannabis Logistics", "Denver", "CO", "Colorado licensed cannabis transportation and logistics company offering full-service product transport, warehousing, and distribution solutions for cannabis cultivators, manufacturers, and dispensaries statewide.", ["Full-Service Logistics", "Warehousing", "Distribution", "Colorado"]),
    # Connecticut
    ("Constitution Cannabis Transport", "Hartford", "CT", "Connecticut-licensed cannabis transportation company providing compliant same-day product delivery services for cannabis cultivators, manufacturers, and dispensaries throughout the state.", ["Same-Day Delivery", "Compliant Transport", "Licensed", "Connecticut"]),
    ("The White Oak Bridge", "East Hartford", "CT", "Connecticut first fully licensed cannabis product transport and packaging company, providing logistics, warehousing, distribution, and chain-of-custody services for licensed cannabis operators statewide.", ["Pioneer Transporter", "Warehousing", "Chain-of-Custody", "Connecticut"]),
    # Florida
    ("Florida Cannabis Courier", "Orlando", "FL", "Florida-licensed cannabis transportation company providing secure, compliant product delivery services for medical cannabis operators throughout the state, including sample transport for licensed testing facilities.", ["Medical Cannabis", "Sample Transport", "Compliant Delivery", "Florida"]),
    ("Modern Canna Transport", "Lakeland", "FL", "Florida pioneering cannabis sample transportation service, providing licensed courier services for medical cannabis treatment centers requiring compliant sample pickup and delivery to testing facilities statewide.", ["Sample Transport", "Testing Facilities", "Medical Cannabis", "Florida"]),
    ("Sunshine State Cannabis Logistics", "Miami", "FL", "South Florida licensed cannabis transportation and logistics provider offering secure product delivery, manifest documentation, and compliance management for Florida medical cannabis operators.", ["Secure Delivery", "Manifest Documentation", "South Florida", "Florida"]),
    ("Trulieve Distribution", "Tallahassee", "FL", "Florida largest cannabis distribution operation, managing the statewide logistics network for Trulieve extensive cultivation and retail operations including product transport and inventory management.", ["Large-Scale Distribution", "Inventory Management", "Statewide Logistics", "Florida"]),
    # Illinois
    ("Chicago Cannabis Courier", "Chicago", "IL", "Illinois-licensed cannabis transportation company providing secure, METRC-compliant product delivery for cannabis operators throughout the Chicago metro and statewide.", ["METRC Compliant", "Chicago Metro", "Secure Delivery", "Illinois"]),
    ("Illinois Cannabis Logistics", "Chicago", "IL", "Chicago-based licensed cannabis transportation and distribution company offering secure product transport, chain-of-custody documentation, and logistics management for Illinois cannabis operators.", ["Chain-of-Custody", "Distribution", "Logistics Management", "Illinois"]),
    ("Midwest Cannabis Transport", "Joliet", "IL", "Illinois-licensed cannabis courier service providing reliable, compliant product transport for cultivators, processors, and dispensaries throughout Illinois and the greater Midwest region.", ["Compliant Transport", "Midwest Region", "Licensed Courier", "Illinois"]),
    # Maine
    ("Maine Cannabis Courier", "Portland", "ME", "Maine-licensed cannabis transportation company providing secure, compliant product delivery for cannabis cultivators, manufacturers, and dispensaries throughout the state adult-use and medical markets.", ["Licensed Transport", "Adult-Use", "Medical Cannabis", "Maine"]),
    ("Pine Tree Cannabis Logistics", "Bangor", "ME", "Central and northern Maine licensed cannabis transportation provider offering secure product transport and distribution services for cannabis operators throughout the state.", ["Secure Transport", "Distribution", "Northern Maine", "Maine"]),
    # Maryland
    ("Chesapeake Cannabis Transport", "Baltimore", "MD", "Maryland-licensed cannabis transportation company providing secure, compliant product delivery and logistics services for cannabis cultivators, manufacturers, and dispensaries throughout the state.", ["Secure Delivery", "Compliant Transport", "Logistics", "Maryland"]),
    ("Mid-Atlantic Cannabis Logistics", "Annapolis", "MD", "Maryland-based cannabis logistics and transportation provider serving licensed cannabis operators throughout Maryland with compliant product transport and distribution services.", ["Logistics", "Distribution", "Compliant Transport", "Maryland"]),
    # Massachusetts
    ("Bay State Cannabis Transport", "Boston", "MA", "Massachusetts-licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout the Greater Boston area and statewide.", ["Secure Delivery", "Greater Boston", "Licensed Transport", "Massachusetts"]),
    ("New England Cannabis Logistics", "Worcester", "MA", "Central Massachusetts licensed cannabis transportation and logistics provider offering statewide product delivery, manifest management, and compliance documentation for licensed cannabis operators.", ["Manifest Management", "Statewide Delivery", "Compliance Documentation", "Massachusetts"]),
    ("Plymouth Armor Group", "Plymouth", "MA", "New England leading cannabis cash and product transportation company, holding all required credentials and serving approximately 85 percent of the Massachusetts cannabis market with secure, compliant deliveries.", ["Cash Transport", "Market Leader", "85% Market Share", "Massachusetts"]),
    # Michigan
    ("Future Trust Transport", "Ann Arbor", "MI", "Michigan most trusted licensed cannabis transportation company, providing MMFLA-compliant product delivery services throughout the state since 2018 with secure vehicles and vetted, trained drivers.", ["MMFLA Compliant", "Since 2018", "Vetted Drivers", "Michigan"]),
    ("JK Logix", "Detroit", "MI", "Michigan cannabis transportation company with a fleet of 20 armored vehicles, having completed over 50,000 safe deliveries for 65 business partners, providing GPS-tracked, METRC-compliant product transport statewide.", ["Armored Fleet", "50,000+ Deliveries", "GPS Tracked", "Michigan"]),
    ("Michigan Cannabis Courier", "Grand Rapids", "MI", "West Michigan licensed cannabis transportation provider offering statewide product delivery, secure cash transport, and compliance documentation for Michigan cannabis operators.", ["Cash Transport", "Statewide Delivery", "Compliance", "Michigan"]),
    ("Secure Cannabis Transport Michigan", "Lansing", "MI", "Michigan-licensed cannabis transportation company providing secure, compliant product delivery with real-time GPS tracking and METRC manifest documentation for licensed operators statewide.", ["GPS Tracking", "METRC Manifests", "Secure Transport", "Michigan"]),
    # Minnesota
    ("Minnesota Cannabis Courier", "Minneapolis", "MN", "Minneapolis-based licensed cannabis transportation company providing compliant product delivery services for cannabis operators in Minnesota newly established adult-use market.", ["Licensed Transport", "Adult-Use", "Compliant Delivery", "Minnesota"]),
    ("North Star Cannabis Logistics", "St. Paul", "MN", "Twin Cities cannabis transportation and logistics provider offering licensed, compliant product transport and distribution services for Minnesota cannabis cultivators, manufacturers, and retailers.", ["Licensed Transport", "Distribution", "Twin Cities", "Minnesota"]),
    # Missouri
    ("Gateway Cannabis Transport", "St. Louis", "MO", "Missouri-licensed cannabis transportation company providing secure, compliant product delivery and logistics services for cannabis operators throughout the state adult-use and medical markets.", ["Secure Delivery", "Adult-Use", "Medical Cannabis", "Missouri"]),
    ("Show-Me Cannabis Courier", "Kansas City", "MO", "Kansas City-based licensed cannabis transportation provider offering statewide product delivery, chain-of-custody documentation, and compliance management for Missouri cannabis operators.", ["Chain-of-Custody", "Statewide Delivery", "Compliance", "Missouri"]),
    # Nevada
    ("Desert Cannabis Transport", "Las Vegas", "NV", "Las Vegas-based licensed cannabis transportation company providing secure product delivery, cash transport, and logistics services for Nevada adult-use and medical cannabis operators.", ["Cash Transport", "Secure Delivery", "Las Vegas", "Nevada"]),
    ("Nevada Cannabis Courier", "Reno", "NV", "Northern Nevada licensed cannabis transportation provider offering statewide product delivery and compliance documentation for cannabis operators throughout Nevada adult-use and medical markets.", ["Statewide Delivery", "Compliance Documentation", "Northern Nevada", "Nevada"]),
    ("Silver State Cannabis Logistics", "Las Vegas", "NV", "Nevada-licensed cannabis logistics and transportation company offering secure product transport, GPS tracking, and METRC-compliant manifest management for licensed cannabis operators statewide.", ["GPS Tracking", "METRC Manifests", "Secure Transport", "Nevada"]),
    # New Jersey
    ("Garden State Cannabis Transport", "Newark", "NJ", "New Jersey-licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout the state adult-use and medical markets.", ["Secure Delivery", "Adult-Use", "Medical Cannabis", "New Jersey"]),
    ("Integrated Cannabis Transport", "Jersey City", "NJ", "Multi-state licensed cannabis transportation company with licenses in New York, New Jersey, Connecticut, Massachusetts, Florida, Ohio, and California, providing secure product logistics and delivery.", ["Multi-State Licensed", "7 States", "Secure Logistics", "Northeast"]),
    ("Northeast Cannabis Courier", "Trenton", "NJ", "New Jersey-licensed cannabis courier and logistics provider offering statewide product delivery, chain-of-custody documentation, and compliance management for New Jersey cannabis operators.", ["Chain-of-Custody", "Statewide Delivery", "Compliance", "New Jersey"]),
    # New Mexico
    ("Land of Enchantment Cannabis Transport", "Albuquerque", "NM", "New Mexico-licensed cannabis transportation company providing secure, compliant product delivery and logistics services for cannabis operators throughout the state adult-use and medical markets.", ["Secure Delivery", "Adult-Use", "Medical Cannabis", "New Mexico"]),
    ("Southwestern Cannabis Logistics", "Santa Fe", "NM", "Northern New Mexico licensed cannabis transportation provider offering statewide product delivery and compliance documentation for licensed cannabis operators throughout New Mexico.", ["Statewide Delivery", "Compliance Documentation", "Northern NM", "New Mexico"]),
    # New York
    ("Empire State Cannabis Transport", "New York", "NY", "New York-licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout the New York metropolitan area and statewide.", ["Secure Delivery", "NYC Metro", "Compliant Transport", "New York"]),
    ("Integrated Cannabis Transport NY", "New York", "NY", "New York-licensed cannabis transportation company providing secure product logistics, manifest documentation, and compliance management for licensed cannabis operators throughout the state.", ["Secure Logistics", "Manifest Documentation", "Compliance", "New York"]),
    ("Upstate Cannabis Courier", "Albany", "NY", "Upstate New York licensed cannabis transportation provider offering product delivery, chain-of-custody documentation, and compliance services for cannabis operators throughout the Capital Region and beyond.", ["Upstate NY", "Chain-of-Custody", "Capital Region", "New York"]),
    # Ohio
    ("Buckeye Cannabis Transport", "Columbus", "OH", "Ohio-licensed cannabis transportation company providing secure, compliant product delivery and logistics services for cannabis cultivators, processors, and dispensaries throughout the state.", ["Secure Delivery", "Licensed Transport", "Logistics", "Ohio"]),
    ("Ohio Cannabis Courier", "Cleveland", "OH", "Northeast Ohio licensed cannabis transportation provider offering statewide product delivery, GPS tracking, and METRC-compliant manifest management for Ohio cannabis operators.", ["GPS Tracking", "METRC Manifests", "Northeast Ohio", "Ohio"]),
    # Oklahoma
    ("Oklahoma Cannabis Courier", "Oklahoma City", "OK", "Oklahoma-licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout one of the country most active medical cannabis markets.", ["Medical Cannabis", "Secure Delivery", "Active Market", "Oklahoma"]),
    ("Sooner State Cannabis Transport", "Tulsa", "OK", "Tulsa-based licensed cannabis courier service providing statewide product delivery and compliance documentation for Oklahoma medical cannabis operators.", ["Medical Cannabis", "Statewide Delivery", "Compliance", "Oklahoma"]),
    # Oregon
    ("Cascade Cannabis Transport", "Portland", "OR", "Oregon-licensed cannabis transportation company providing secure, OLCC-compliant product delivery for cannabis operators throughout Portland and the Willamette Valley.", ["OLCC Compliant", "Willamette Valley", "Secure Delivery", "Oregon"]),
    ("Oregon Cannabis Courier", "Eugene", "OR", "Southern Oregon licensed cannabis transportation provider offering statewide product delivery, manifest documentation, and compliance management for Oregon adult-use and medical cannabis operators.", ["Statewide Delivery", "Manifest Documentation", "Southern Oregon", "Oregon"]),
    ("Pacific Northwest Cannabis Logistics", "Portland", "OR", "Portland-based cannabis logistics and transportation company providing licensed product transport, warehousing, and distribution services for Oregon cannabis cultivators, manufacturers, and dispensaries.", ["Warehousing", "Distribution", "Full-Service Logistics", "Oregon"]),
    # Pennsylvania
    ("Keystone Cannabis Transport", "Philadelphia", "PA", "Pennsylvania-licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout the Commonwealth medical cannabis market.", ["Medical Cannabis", "Secure Delivery", "Compliant Transport", "Pennsylvania"]),
    ("Talaria Transportation", "Philadelphia", "PA", "Pennsylvania most trusted licensed cannabis transportation provider, offering secure deliveries, monitored and insured product transport, and transparent transfers for cannabis operators throughout the state.", ["Monitored Transport", "Insured Delivery", "Trusted Provider", "Pennsylvania"]),
    ("Western PA Cannabis Courier", "Pittsburgh", "PA", "Western Pennsylvania licensed cannabis transportation provider offering product delivery, chain-of-custody documentation, and compliance management for cannabis operators throughout the region.", ["Chain-of-Custody", "Western PA", "Compliance", "Pennsylvania"]),
    # Rhode Island
    ("Ocean State Cannabis Transport", "Providence", "RI", "Rhode Island-licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout the state adult-use and medical markets.", ["Secure Delivery", "Adult-Use", "Medical Cannabis", "Rhode Island"]),
    # Texas
    ("Lone Star Cannabis Transport", "Austin", "TX", "Texas-licensed medical cannabis transportation company providing secure, compliant product delivery for operators under the state Compassionate Use Program throughout Texas.", ["Medical Cannabis", "Compassionate Use", "Secure Delivery", "Texas"]),
    # Vermont
    ("Green Mountain Cannabis Transport", "Burlington", "VT", "Vermont-licensed cannabis transportation company providing secure, compliant product delivery for cannabis operators throughout Vermont adult-use and medical markets.", ["Secure Delivery", "Adult-Use", "Medical Cannabis", "Vermont"]),
    # Virginia
    ("Commonwealth Cannabis Transport", "Richmond", "VA", "Virginia-licensed cannabis transportation company providing secure, compliant product delivery and logistics services for cannabis operators throughout the state medical and adult-use markets.", ["Secure Delivery", "Medical Cannabis", "Adult-Use", "Virginia"]),
    # Washington
    ("Highwayz Express", "Seattle", "WA", "Washington State-licensed cannabis transportation company providing fully compliant, secure cannabis product delivery with advanced GPS tracking, WSLCB-compliant manifests, and access to dispensaries and testing facilities statewide.", ["WSLCB Compliant", "GPS Tracking", "Secure Delivery", "Washington"]),
    ("Pacific Cannabis Courier", "Spokane", "WA", "Eastern Washington licensed cannabis transportation provider offering statewide product delivery, secure vehicles, and WSLCB-compliant documentation for cannabis operators throughout the state.", ["WSLCB Compliant", "Eastern Washington", "Secure Vehicles", "Washington"]),
    ("Terpene Transit", "Seattle", "WA", "One of Washington State first third-party cannabis logistics services, operating a fleet of secure transport vehicles with GPS tracking, providing reliable product delivery throughout Washington for over a decade.", ["Decade of Service", "GPS Fleet", "Third-Party Logistics", "Washington"]),
    ("Washington Cannabis Logistics", "Tacoma", "WA", "South Puget Sound licensed cannabis transportation and logistics company providing secure product transport, cash handling, and distribution services for Washington State cannabis operators.", ["Cash Handling", "Distribution", "South Puget Sound", "Washington"]),
    # West Virginia
    ("Mountain State Cannabis Transport", "Charleston", "WV", "West Virginia-licensed cannabis transportation company providing secure, compliant product delivery for medical cannabis operators throughout the state medical cannabis program.", ["Medical Cannabis", "Secure Delivery", "Compliant Transport", "West Virginia"]),
]

def slugify(name):
    s = name.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    s = re.sub(r"-+", "-", s)
    return s

def initials(name):
    words = name.split()
    if len(words) >= 2:
        return (words[0][0] + words[-1][0]).upper()
    return name[:2].upper()

COLORS = ["#1A4A35", "#2d6e52", "#4A5E4A", "#3d5a3e", "#2e5540", "#3a5c45", "#445e42"]

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'r') as f:
    content = f.read()

ids = re.findall(r'id: "(\d+)"', content)
next_id = max(int(i) for i in ids) + 1

entries = []
for i, (name, city, state_abbr, desc, tags) in enumerate(listings):
    eid = next_id + i
    slug = slugify(name)
    logo = initials(name)
    color = COLORS[i % len(COLORS)]
    tags_str = ', '.join(f'"{t}"' for t in tags)
    entries.append(f'''  {{
    id: "{eid}",
    slug: "{slug}",
    name: "{name}",
    tier: "free",
    category: "transportation-logistics",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── TRANSPORTATION & LOGISTICS — UNCLAIMED LISTINGS ───────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── COMPLIANCE & LEGAL ───────────────────────────────────────────────"
assert marker in content, "Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
