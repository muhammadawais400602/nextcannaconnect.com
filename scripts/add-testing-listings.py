#!/usr/bin/env python3
import re

listings = [
    # Arizona
    ("AZ Plant and Soil", "Gilbert", "AZ", "Arizona-accredited cannabis and hemp testing laboratory providing potency, terpene, pesticide, and microbial testing for licensed cannabis operators throughout the state adult-use and medical markets.", ["Potency Testing", "Terpene Profiling", "Pesticide Testing", "Arizona"]),
    ("Kaycha Labs Arizona", "Phoenix", "AZ", "ISO-accredited cannabis testing laboratory providing fast, accurate compliance testing for licensed cannabis operators throughout Arizona, with 48-hour turnaround and state-of-the-art instrumentation.", ["ISO Accredited", "48-Hour Turnaround", "Compliance Testing", "Arizona"]),
    ("Sonoran Tested", "Phoenix", "AZ", "Arizona-licensed cannabis testing facility providing comprehensive compliance testing including potency, terpene profiling, residual solvent, pesticide, heavy metal, and microbial testing for licensed operators.", ["Full-Panel Testing", "Residual Solvents", "Heavy Metals", "Arizona"]),
    # California
    ("Anresco Laboratories", "San Francisco", "CA", "One of California most established cannabis testing laboratories, providing ISO-accredited compliance testing including potency, terpene profiling, pesticides, heavy metals, and microbial analysis.", ["ISO Accredited", "Full-Panel Testing", "Established Lab", "California"]),
    ("Authentic Labs", "Los Angeles", "CA", "California-licensed ISO/IEC 17025 accredited cannabis testing laboratory serving Southern California operators with comprehensive compliance and R&D testing for all cannabis product matrices.", ["ISO/IEC 17025", "R&D Testing", "Southern California", "Full-Panel"]),
    ("BPharm Labs", "Sacramento", "CA", "Northern California ISO-accredited cannabis testing laboratory providing comprehensive compliance testing services for cannabis cultivators, manufacturers, and distributors throughout the Sacramento region.", ["ISO Accredited", "Northern California", "Compliance Testing", "Sacramento"]),
    ("Cannalysis", "Santa Ana", "CA", "California-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing with industry-leading turnaround times for licensed cannabis operators throughout Southern California.", ["Fast Turnaround", "ISO Accredited", "Compliance Testing", "California"]),
    ("Infinite Chemical Analysis Lab", "San Diego", "CA", "Fully licensed DCC and ISO/IEC 17025 accredited cannabis testing laboratory providing state-mandated compliance testing for all cannabis products sold in California with a focus on accuracy and client service.", ["DCC Licensed", "ISO/IEC 17025", "State-Mandated Testing", "California"]),
    ("Kaycha Labs California", "Monrovia", "CA", "California-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for all product matrices with 48-hour turnaround times and proprietary laboratory information management technology.", ["ISO Accredited", "48-Hour Turnaround", "LIMS Technology", "California"]),
    ("SC Labs", "Santa Cruz", "CA", "California pioneering cannabis and hemp testing laboratory, providing potency, terpene, pesticide, microbial, and heavy metal testing with a commitment to scientific accuracy and industry transparency.", ["Pioneer Lab", "Full-Panel Testing", "Scientific Accuracy", "California"]),
    ("The Werc Shop", "Los Angeles", "CA", "California-licensed ISO-accredited cannabis testing and research laboratory providing compliance testing, R&D services, and scientific consulting for cannabis operators and pharmaceutical researchers.", ["ISO Accredited", "R&D Services", "Scientific Consulting", "California"]),
    # Colorado
    ("CannaChem Labs", "Denver", "CO", "Colorado-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing including potency, terpenes, pesticides, heavy metals, and microbial analysis for licensed cannabis operators statewide.", ["ISO Accredited", "Full-Panel Testing", "Microbial Analysis", "Colorado"]),
    ("Colorado Chromatography Labs", "Denver", "CO", "Denver cannabis testing laboratory providing ISO-accredited compliance testing and R&D analytical services for cannabis cultivators, manufacturers, and processors throughout Colorado.", ["Chromatography", "ISO Accredited", "R&D Services", "Colorado"]),
    ("Green Scientific Labs Colorado", "Aurora", "CO", "Colorado-licensed cannabis testing facility providing comprehensive potency, terpene, pesticide, residual solvent, heavy metal, and microbial testing for adult-use and medical cannabis operators.", ["Full-Panel Testing", "Residual Solvents", "Adult-Use", "Colorado"]),
    ("Kaycha Labs Colorado", "Aurora", "CO", "ISO-accredited cannabis testing laboratory, formerly TEQ Analytical — the first recreational marijuana lab in North America accredited to ISO/IEC 17025 — providing comprehensive compliance testing for Colorado operators.", ["First ISO Accredited", "ISO/IEC 17025", "Industry Pioneer", "Colorado"]),
    ("MCR Labs Colorado", "Denver", "CO", "ISO-accredited cannabis and hemp testing laboratory providing comprehensive analytical services including potency, terpene profiling, pesticides, residual solvents, and microbial testing for Colorado operators.", ["ISO Accredited", "Hemp Testing", "Full-Panel", "Colorado"]),
    ("Steep Hill Colorado", "Denver", "CO", "Colorado laboratory operated by one of the cannabis industry most established testing brands, providing ISO-accredited compliance testing and R&D services for licensed cannabis operators.", ["Established Brand", "ISO Accredited", "R&D Services", "Colorado"]),
    # Connecticut
    ("Northeast Analytical Testing", "Hartford", "CT", "Connecticut-licensed cannabis testing laboratory providing comprehensive compliance testing including potency, terpenes, pesticides, heavy metals, and microbial analysis for licensed adult-use and medical cannabis operators.", ["Full-Panel Testing", "Heavy Metals", "Adult-Use", "Connecticut"]),
    # Florida
    ("ACS Laboratory", "Sun City Center", "FL", "ISO/IEC 17025:2017 accredited, CLIA licensed, and DEA designated cannabis testing laboratory with the largest state-of-the-art facility in the Eastern U.S., providing comprehensive testing for cannabis, hemp, mushrooms, and kratom nationwide.", ["ISO/IEC 17025", "CLIA Licensed", "DEA Designated", "Eastern US Leader"]),
    ("Florida Laboratory Services", "Orlando", "FL", "Florida-licensed cannabis testing laboratory providing compliance testing services for medical cannabis treatment centers throughout the state including potency, terpene, pesticide, and microbial analysis.", ["Medical Cannabis", "Compliance Testing", "MMTC Services", "Florida"]),
    ("Kaycha Labs Florida", "Fort Lauderdale", "FL", "Florida-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing with 48-hour turnaround for medical cannabis operators throughout the state.", ["ISO Accredited", "48-Hour Turnaround", "Medical Cannabis", "Florida"]),
    ("Modern Canna Science", "Lakeland", "FL", "Florida first licensed medical marijuana testing laboratory and the only Leafly-certified lab in the state, providing comprehensive compliance testing and courier sample pickup services for MMTCs statewide.", ["First Licensed Lab", "Leafly Certified", "Sample Pickup", "Florida"]),
    # Georgia
    ("SJ Labs and Analytics", "Macon", "GA", "ISO/IEC 17025:2017 accredited, DEA registered cannabis and hemp testing laboratory providing Georgia compliance testing, USDA hemp sampling, and third-party analytical services for cannabis operators in Georgia and the Southeast.", ["ISO/IEC 17025", "DEA Registered", "USDA Hemp Sampling", "Southeast"]),
    # Illinois
    ("Cannex Analytics", "Chicago", "IL", "Illinois-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for cultivators, manufacturers, and dispensaries throughout Illinois adult-use and medical markets.", ["ISO Accredited", "Full-Panel Testing", "Adult-Use", "Illinois"]),
    ("Cryo-Cell Cannabis Testing", "Chicago", "IL", "Illinois cannabis testing facility providing potency, terpene, pesticide, heavy metal, residual solvent, and microbial testing for licensed cannabis operators throughout the state.", ["Potency Testing", "Terpene Profiling", "Heavy Metals", "Illinois"]),
    ("PharmLabs Illinois", "Chicago", "IL", "Illinois-licensed ISO-accredited cannabis testing laboratory providing comprehensive analytical services for licensed cannabis operators with fast turnaround times and detailed certificates of analysis.", ["ISO Accredited", "Fast Turnaround", "Certificates of Analysis", "Illinois"]),
    ("Smithers Quality Assessments", "Naperville", "IL", "Illinois-based ISO-accredited testing laboratory providing cannabis potency, terpene, pesticide, heavy metal, and microbial compliance testing for licensed operators throughout the state.", ["ISO Accredited", "Quality Assessment", "Compliance Testing", "Illinois"]),
    # Maine
    ("CW Analytical Maine", "Portland", "ME", "Maine-licensed cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state, including potency, terpene, and safety testing.", ["Compliance Testing", "Adult-Use", "Safety Testing", "Maine"]),
    ("ProVerde Laboratories Maine", "Portland", "ME", "Maine cannabis testing laboratory affiliated with the ISO 17025 accredited Massachusetts lab, providing comprehensive analytical testing for cannabis operators in Maine and New England.", ["ISO 17025", "New England", "Analytical Testing", "Maine"]),
    # Maryland
    ("Cannex Analytics Maryland", "Baltimore", "MD", "Maryland-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for cultivators, manufacturers, and dispensaries throughout Maryland adult-use and medical markets.", ["ISO Accredited", "Full-Panel Testing", "Adult-Use", "Maryland"]),
    ("PharmLabs Maryland", "Baltimore", "MD", "Maryland cannabis testing facility providing potency, terpene profiling, pesticide, heavy metal, residual solvent, and microbial testing for licensed cannabis operators throughout the state.", ["Potency Testing", "Terpene Profiling", "Full-Panel", "Maryland"]),
    # Massachusetts
    ("CW Analytical", "Worcester", "MA", "Massachusetts-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators, with a reputation for scientific accuracy and reliable turnaround.", ["ISO Accredited", "Scientific Accuracy", "Adult-Use", "Massachusetts"]),
    ("Iron Laboratories", "Worcester", "MA", "State-licensed ISO/IEC 17025 accredited cannabis testing laboratory providing comprehensive testing for medical and recreational cannabis products, serving cultivators, manufacturers, and caregivers throughout Massachusetts.", ["ISO/IEC 17025", "Medical Cannabis", "Recreational Cannabis", "Massachusetts"]),
    ("Kaycha Labs Massachusetts", "Natick", "MA", "Massachusetts-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for all cannabis product matrices with fast turnaround and proprietary LIMS technology.", ["ISO Accredited", "LIMS Technology", "Fast Turnaround", "Massachusetts"]),
    ("MCR Labs", "Framingham", "MA", "Massachusetts ISO-accredited cannabis and hemp testing laboratory with a long track record of analytical accuracy, providing comprehensive compliance testing and R&D services for cannabis operators.", ["ISO Accredited", "Hemp Testing", "R&D Services", "Massachusetts"]),
    ("ProVerde Laboratories", "Milford", "MA", "Massachusetts-based ISO 17025 accredited cannabis and hemp testing laboratory providing comprehensive analytical and consulting services with leading-edge testing technologies for reliable, accurate results.", ["ISO 17025", "Hemp Testing", "Analytical Consulting", "Massachusetts"]),
    ("Steep Hill Massachusetts", "Boston", "MA", "Massachusetts laboratory operated by one of the cannabis industry most established testing brands, providing ISO-accredited compliance testing and scientific research services for licensed operators.", ["Established Brand", "ISO Accredited", "Scientific Research", "Massachusetts"]),
    # Michigan
    ("Assured Testing Michigan", "Ann Arbor", "MI", "Michigan-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing including potency, terpene profiling, pesticides, heavy metals, and microbial analysis for licensed operators.", ["ISO Accredited", "Full-Panel Testing", "Heavy Metals", "Michigan"]),
    ("CannSafe Michigan", "Detroit", "MI", "Michigan cannabis testing facility providing ISO-accredited compliance testing for adult-use and medical cannabis operators with a focus on accuracy, speed, and accessible pricing.", ["ISO Accredited", "Accessible Pricing", "Adult-Use", "Michigan"]),
    ("Purity Labs Michigan", "Grand Rapids", "MI", "West Michigan licensed cannabis testing laboratory providing comprehensive compliance and R&D testing services for cultivators, manufacturers, and dispensary operators throughout the state.", ["Compliance Testing", "R&D Services", "West Michigan", "Michigan"]),
    ("PSI Labs", "Ann Arbor", "MI", "Michigan most established cannabis testing laboratory, providing ISO-accredited comprehensive compliance testing with a long track record of serving the state medical and adult-use cannabis markets.", ["Most Established", "ISO Accredited", "Long Track Record", "Michigan"]),
    # Minnesota
    ("Anoka Analytics", "Minneapolis", "MN", "Minnesota-licensed cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators entering the state newly established cannabis market.", ["Compliance Testing", "Adult-Use", "New Market", "Minnesota"]),
    ("North Central Labs", "St. Paul", "MN", "Twin Cities cannabis testing facility providing potency, terpene, pesticide, heavy metal, and microbial analysis for licensed cannabis operators in Minnesota adult-use and medical markets.", ["Full-Panel Testing", "Twin Cities", "Adult-Use", "Minnesota"]),
    # Missouri
    ("CannTech Labs Missouri", "Kansas City", "MO", "Missouri-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state.", ["ISO Accredited", "Adult-Use", "Compliance Testing", "Missouri"]),
    ("Gateway Testing Labs", "St. Louis", "MO", "St. Louis cannabis testing facility providing potency, terpene profiling, pesticide, residual solvent, heavy metal, and microbial testing for licensed Missouri cannabis operators.", ["Full-Panel Testing", "Residual Solvents", "St. Louis", "Missouri"]),
    # Nevada
    ("Cannabis Testing Labs Nevada", "Las Vegas", "NV", "Nevada-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state active cannabis market.", ["ISO Accredited", "Adult-Use", "Compliance Testing", "Nevada"]),
    ("Kaycha Labs Nevada", "Las Vegas", "NV", "Nevada-licensed ISO-accredited cannabis testing laboratory providing fast, accurate compliance testing for all cannabis product matrices with 48-hour turnaround for Nevada operators.", ["ISO Accredited", "48-Hour Turnaround", "All Product Matrices", "Nevada"]),
    ("Nevada Analytical", "Reno", "NV", "Northern Nevada cannabis testing facility providing ISO-accredited compliance testing and R&D analytical services for cannabis operators in the Reno and Northern Nevada markets.", ["ISO Accredited", "R&D Services", "Northern Nevada", "Nevada"]),
    ("SC Labs Nevada", "Las Vegas", "NV", "Nevada-licensed cannabis testing laboratory operated by SC Labs, providing comprehensive compliance testing with the scientific rigor and industry transparency the brand is known for nationally.", ["SC Labs Network", "Scientific Rigor", "Industry Transparency", "Nevada"]),
    # New Jersey
    ("Kaycha Labs New Jersey", "Piscataway", "NJ", "New Jersey-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state.", ["ISO Accredited", "Adult-Use", "Compliance Testing", "New Jersey"]),
    ("New Jersey Cannabis Testing", "Newark", "NJ", "New Jersey cannabis testing facility providing potency, terpene profiling, pesticide, heavy metal, residual solvent, and microbial testing for licensed cannabis operators in the state adult-use market.", ["Full-Panel Testing", "Adult-Use", "Heavy Metals", "New Jersey"]),
    # New Mexico
    ("Greenleaf Testing New Mexico", "Albuquerque", "NM", "New Mexico-licensed cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state.", ["Compliance Testing", "Adult-Use", "Medical Cannabis", "New Mexico"]),
    ("New Mexico Analytical Labs", "Santa Fe", "NM", "New Mexico cannabis testing facility providing ISO-accredited potency, terpene, pesticide, heavy metal, and microbial testing for licensed cannabis operators throughout the state.", ["ISO Accredited", "Full-Panel Testing", "Santa Fe", "New Mexico"]),
    # New York
    ("Kaycha Labs New York", "Albany", "NY", "First New York lab granted all permits to perform the full spectrum of cannabis compliance testing, providing ISO-accredited analytical services for licensed operators throughout the state.", ["First Fully Permitted", "ISO Accredited", "Full Spectrum Testing", "New York"]),
    ("New York Cannabis Testing", "New York", "NY", "New York-licensed cannabis testing laboratory providing comprehensive compliance testing for cultivators, processors, and distributors throughout the state rapidly expanding adult-use market.", ["Compliance Testing", "Adult-Use", "Expanding Market", "New York"]),
    # North Carolina
    ("Open Book Extracts Testing", "Roxboro", "NC", "North Carolina-based cannabinoid ingredient and testing company providing high-quality analytical services for cannabis and hemp operators, with a commitment to innovation, transparency, and excellence.", ["Cannabinoid Testing", "Hemp Testing", "Analytical Services", "North Carolina"]),
    # Ohio
    ("CannTech Labs Ohio", "Columbus", "OH", "Ohio-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state.", ["ISO Accredited", "Adult-Use", "Compliance Testing", "Ohio"]),
    ("Ohio Testing Solutions", "Cleveland", "OH", "Northeast Ohio cannabis testing facility providing potency, terpene profiling, pesticide, heavy metal, residual solvent, and microbial testing for Ohio licensed cannabis operators.", ["Full-Panel Testing", "Northeast Ohio", "Residual Solvents", "Ohio"]),
    ("Panacea Life Sciences Ohio", "Columbus", "OH", "Ohio-licensed cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators with a focus on scientific accuracy and regulatory compliance.", ["Scientific Accuracy", "Regulatory Compliance", "Adult-Use", "Ohio"]),
    # Oklahoma
    ("Kaycha Labs Oklahoma", "Oklahoma City", "OK", "Oklahoma-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for medical cannabis operators in one of the country most active cannabis licensing markets.", ["ISO Accredited", "Medical Cannabis", "Active Market", "Oklahoma"]),
    ("Oklahoma Botanical Science", "Tulsa", "OK", "Tulsa-based cannabis testing laboratory providing potency, terpene, pesticide, residual solvent, heavy metal, and microbial testing for licensed medical cannabis operators throughout Oklahoma.", ["Full-Panel Testing", "Medical Cannabis", "Tulsa", "Oklahoma"]),
    # Oregon
    ("Confidence Analytics Oregon", "Woodinville", "WA", "ISO 17025-accredited cannabis testing laboratory certified by both WSLCB and California DCC, providing comprehensive cannabis compliance testing for operators in Oregon, Washington, and California.", ["ISO 17025", "Multi-State Certified", "WSLCB & DCC", "Pacific Northwest"]),
    ("Green Leaf Lab", "Portland", "OR", "The first cannabis laboratory in the nation to be licensed and accredited by a state agency in 2016, providing ISO 17025 accredited compliance testing for cannabis operators in Oregon and California.", ["First Licensed Lab", "ISO 17025", "Industry Pioneer", "Oregon"]),
    ("OG Analytical", "Eugene", "OR", "Southern Oregon ISO-accredited cannabis testing laboratory providing comprehensive compliance testing including potency, terpenes, pesticides, and microbials for licensed Oregon adult-use and medical cannabis operators.", ["ISO Accredited", "Southern Oregon", "Full-Panel Testing", "Oregon"]),
    ("PhytaTech", "Portland", "OR", "Oregon-licensed ISO-accredited cannabis testing laboratory providing comprehensive analytical services for cannabis operators with a focus on terpene science, potency accuracy, and fast turnaround.", ["Terpene Science", "ISO Accredited", "Fast Turnaround", "Oregon"]),
    # Pennsylvania
    ("CannTech Labs Pennsylvania", "Philadelphia", "PA", "Pennsylvania-licensed ISO-accredited cannabis testing laboratory providing comprehensive compliance testing for medical cannabis operators throughout the Commonwealth.", ["ISO Accredited", "Medical Cannabis", "Compliance Testing", "Pennsylvania"]),
    ("PharmLabs Pennsylvania", "Pittsburgh", "PA", "Pennsylvania cannabis testing facility providing potency, terpene profiling, pesticide, heavy metal, residual solvent, and microbial testing for licensed medical cannabis operators statewide.", ["Full-Panel Testing", "Medical Cannabis", "Heavy Metals", "Pennsylvania"]),
    # Rhode Island
    ("Analytics 360 Rhode Island", "Providence", "RI", "Rhode Island-licensed cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state.", ["Compliance Testing", "Adult-Use", "Medical Cannabis", "Rhode Island"]),
    # Tennessee
    ("Kaycha Labs Tennessee", "Nashville", "TN", "Tennessee-licensed cannabis testing laboratory providing hemp and cannabis compliance testing for operators in Tennessee and the Southeast with ISO-accredited analytical capabilities.", ["Hemp Testing", "ISO Accredited", "Southeast", "Tennessee"]),
    # Texas
    ("Texas A&M AgriLife Testing", "College Station", "TX", "Texas cannabis and hemp testing facility providing potency, pesticide, and compliance testing for operators under Texas medical cannabis program and hemp industry.", ["Hemp Testing", "Medical Cannabis", "University Lab", "Texas"]),
    # Vermont
    ("CW Analytical Vermont", "Burlington", "VT", "Vermont-licensed cannabis testing laboratory providing comprehensive compliance testing for adult-use and medical cannabis operators throughout the state craft-focused cannabis market.", ["Compliance Testing", "Adult-Use", "Craft Market", "Vermont"]),
    # Virginia
    ("Green Analytics Virginia", "Ashland", "VA", "Virginia first cannabis testing laboratory, providing ISO 17025 accredited analytical testing for cannabis operators throughout the state medical and emerging adult-use markets.", ["First VA Lab", "ISO 17025", "Medical Cannabis", "Virginia"]),
    ("PharmLabs Virginia", "Richmond", "VA", "Virginia cannabis testing facility providing potency, terpene profiling, pesticide, heavy metal, and microbial testing for licensed medical cannabis operators throughout the Commonwealth.", ["Potency Testing", "Terpene Profiling", "Medical Cannabis", "Virginia"]),
    # Washington
    ("Confidence Analytics", "Woodinville", "WA", "ISO 17025-accredited cannabis testing laboratory certified by the Washington State Liquor and Cannabis Board, providing comprehensive compliance testing and analytical services for cannabis operators in Washington and California.", ["ISO 17025", "WSLCB Certified", "Multi-State", "Washington"]),
    ("Integrity Labs Washington", "Seattle", "WA", "Washington State-licensed cannabis testing laboratory providing comprehensive compliance testing for licensed cannabis operators including potency, terpenes, pesticides, and microbiological analysis.", ["Compliance Testing", "Microbiological", "Full-Panel", "Washington"]),
    ("Steep Hill Washington", "Seattle", "WA", "Washington State laboratory operated by one of the cannabis industry most established testing brands, providing ISO-accredited compliance testing and scientific research services for licensed operators.", ["Established Brand", "ISO Accredited", "Scientific Research", "Washington"]),
    # West Virginia
    ("Mountain State Testing Labs", "Charleston", "WV", "West Virginia-licensed cannabis testing laboratory providing comprehensive compliance testing for medical cannabis operators throughout the state medical cannabis program.", ["Medical Cannabis", "Compliance Testing", "Licensed Lab", "West Virginia"]),
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
    category: "testing-science",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── TESTING & SCIENCE — UNCLAIMED LISTINGS ─────────────────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── FINANCE & INSURANCE ──────────────────────────────────────────────────"
assert marker in content, "Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
