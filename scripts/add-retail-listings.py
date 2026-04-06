#!/usr/bin/env python3
import re

listings = [
    # Arizona
    ("Harvest HOC", "Tempe", "AZ", "Multi-state cannabis dispensary operator with retail locations across Arizona providing adult-use and medical cannabis products, budtender-guided experiences, and online ordering for pickup and delivery.", ["Dispensary", "Adult-Use", "Medical Cannabis", "Online Ordering"]),
    ("Mint Cannabis", "Phoenix", "AZ", "Arizona-licensed cannabis dispensary chain operating multiple retail locations throughout the Phoenix metro, providing premium adult-use and medical cannabis products and a hospitality-driven retail experience.", ["Dispensary Chain", "Adult-Use", "Medical Cannabis", "Phoenix Metro"]),
    ("Sol Flower", "Tempe", "AZ", "Arizona cannabis retail operator with multiple dispensary locations offering a premium adult-use and medical cannabis shopping experience with curated product selections and expert staff.", ["Dispensary", "Premium Retail", "Adult-Use", "Arizona"]),
    ("Verde Natural", "Phoenix", "AZ", "Phoenix-based cannabis dispensary providing adult-use and medical cannabis products with a focus on patient education, sustainable products, and community-oriented retail operations.", ["Dispensary", "Patient Education", "Sustainable", "Arizona"]),
    # California
    ("Airfield Supply Co.", "San Jose", "CA", "Premier San Jose cannabis dispensary offering a full range of adult-use and medical cannabis products in a welcoming, airport-themed retail environment with knowledgeable staff.", ["Dispensary", "Adult-Use", "Medical Cannabis", "California"]),
    ("Cova POS", "Los Angeles", "CA", "Cannabis retail POS software provider offering a full-featured, tablet-based point-of-sale solution with built-in compliance, online ordering, delivery management, and detailed reporting for dispensaries.", ["POS Software", "Compliance", "Online Ordering", "Delivery Management"]),
    ("Dutchie", "Beaverton", "OR", "North America number one cannabis retail platform, providing POS, e-commerce, loyalty, payments, and compliance software for dispensaries of all sizes across the U.S. and Canada.", ["POS Platform", "E-Commerce", "Loyalty", "Compliance Software"]),
    ("Eaze", "San Francisco", "CA", "California cannabis delivery platform and dispensary technology provider offering on-demand cannabis delivery, e-commerce technology, and retail operations management for licensed California operators.", ["Cannabis Delivery", "E-Commerce", "Retail Technology", "California"]),
    ("Flowhub", "Denver", "CO", "Purpose-built cannabis retail software providing POS, inventory management, compliance, e-commerce, loyalty, and payments in one platform for dispensaries seeking to scale profitably.", ["POS Software", "Inventory Management", "Compliance", "E-Commerce"]),
    ("Glass House Retail", "Chula Vista", "CA", "California cannabis dispensary and retail operator providing premium adult-use cannabis products sourced from their own large-scale greenhouse cultivation facilities throughout the state.", ["Dispensary", "Premium Products", "Vertically Integrated", "California"]),
    ("Harborside", "San Jose", "CA", "One of California pioneering cannabis dispensaries, providing adult-use and medical cannabis products, patient education, and a full retail experience at multiple California locations.", ["Pioneer Dispensary", "Adult-Use", "Medical Cannabis", "California"]),
    ("MedMen", "Culver City", "CA", "Multi-state cannabis retail company with licensed dispensaries in California and other states, providing a premium adult-use retail experience with curated product selections.", ["Premium Dispensary", "Adult-Use", "Multi-State", "California"]),
    ("Weedmaps", "Irvine", "CA", "Cannabis technology and marketplace platform providing online menus, delivery management, dispensary listings, and digital marketing tools for cannabis retailers and delivery services nationwide.", ["Marketplace Platform", "Online Menus", "Delivery Management", "Digital Marketing"]),
    # Colorado
    ("3C Consulting Retail", "Denver", "CO", "Colorado cannabis retail consulting firm providing dispensary design, operations optimization, compliance, and staff training for cannabis retailers in Colorado and other state markets.", ["Dispensary Consulting", "Operations", "Compliance", "Staff Training"]),
    ("Colorado Harvest Company", "Denver", "CO", "Colorado cannabis dispensary and retailer operating multiple locations throughout the Denver metro, offering adult-use flower, concentrates, edibles, and accessories in a premium retail environment.", ["Dispensary", "Adult-Use", "Denver Metro", "Colorado"]),
    ("Cure8", "Denver", "CO", "Cannabis IT and security services company providing dispensary POS consulting, managed IT services, security camera systems, and cybersecurity solutions for cannabis retailers nationwide.", ["IT Services", "POS Consulting", "Security Systems", "Cybersecurity"]),
    ("L'eagle Services", "Denver", "CO", "Colorado premier organic cannabis dispensary providing pesticide-free, sustainably grown cannabis products in a patient-focused retail environment in Denver.", ["Organic Dispensary", "Pesticide-Free", "Sustainable", "Colorado"]),
    ("Lightshade", "Denver", "CO", "Colorado cannabis dispensary operator with multiple Denver-area locations offering a wide range of adult-use and medical cannabis products in welcoming, community-focused retail spaces.", ["Dispensary Chain", "Adult-Use", "Community-Focused", "Colorado"]),
    ("Native Roots", "Denver", "CO", "One of Colorado largest cannabis dispensary chains, operating multiple retail locations throughout the state and offering a full range of adult-use and medical cannabis products.", ["Dispensary Chain", "Adult-Use", "Multi-Location", "Colorado"]),
    ("Schwazze Retail", "Denver", "CO", "Colorado leading cannabis retailer operating dozens of dispensary locations under multiple brands, providing adult-use and medical cannabis products statewide.", ["Large-Scale Retail", "Multi-Brand", "Adult-Use", "Colorado"]),
    ("Terrapin Care Station", "Boulder", "CO", "Colorado cannabis dispensary and retailer with multiple Front Range locations offering premium adult-use and medical cannabis products sourced from their own cultivation and extraction operations.", ["Dispensary", "Vertically Integrated", "Front Range", "Colorado"]),
    # Connecticut
    ("Fine Fettle", "Rowland", "CT", "Connecticut cannabis dispensary operator providing adult-use and medical cannabis products at multiple locations throughout the state in a premium, patient-focused retail environment.", ["Dispensary", "Adult-Use", "Patient-Focused", "Connecticut"]),
    ("Sanctuary Medicinals", "New Haven", "CT", "Connecticut-licensed cannabis retailer providing adult-use and medical cannabis products with a focus on patient education, community engagement, and accessible pricing.", ["Dispensary", "Patient Education", "Community", "Connecticut"]),
    # Florida
    ("Curaleaf Florida", "Miami", "FL", "Florida largest cannabis retailer, operating an extensive network of medical cannabis dispensaries throughout the state providing patients with a full range of cannabis products.", ["Medical Cannabis", "Dispensary Network", "Large-Scale Retail", "Florida"]),
    ("MüV", "Tampa", "FL", "Florida medical cannabis dispensary chain operated by AYR Wellness, providing premium cannabis flower, vape cartridges, edibles, and topicals at multiple locations throughout the state.", ["Medical Cannabis", "Dispensary Chain", "Premium Products", "Florida"]),
    ("Trulieve Florida", "Tallahassee", "FL", "Florida largest cannabis company with the most extensive dispensary network in the state, providing medical cannabis patients with a full range of products and pickup and delivery options.", ["Medical Cannabis", "Largest Network", "Pickup & Delivery", "Florida"]),
    # Illinois
    ("Cresco Labs Retail", "Chicago", "IL", "Illinois cannabis retailer operating Sunnyside dispensaries at multiple locations throughout the state, providing adult-use and medical cannabis products in a branded retail environment.", ["Sunnyside Dispensaries", "Adult-Use", "Multi-Location", "Illinois"]),
    ("Green Thumb Industries Retail", "Chicago", "IL", "Illinois cannabis retailer operating RISE dispensaries throughout the state, providing adult-use and medical cannabis products with a focus on consistency, quality, and patient education.", ["RISE Dispensaries", "Adult-Use", "Patient Education", "Illinois"]),
    ("Dispensary 33", "Chicago", "IL", "Independent Chicago cannabis dispensary providing adult-use and medical cannabis products with a community-first approach and curated selection of premium flower, concentrates, and edibles.", ["Independent Dispensary", "Community-First", "Premium Selection", "Chicago"]),
    ("Revolution Cannabis Retail", "Chicago", "IL", "Illinois cannabis retailer operating multiple dispensary locations throughout the state providing adult-use and medical cannabis products sourced from their own cultivation facilities.", ["Dispensary", "Vertically Integrated", "Adult-Use", "Illinois"]),
    # Maine
    ("Wellness Connection of Maine", "Portland", "ME", "Maine first licensed cannabis retailer, operating multiple dispensary locations providing adult-use and medical cannabis products with a focus on patient education and quality.", ["Pioneer Dispensary", "Adult-Use", "Medical Cannabis", "Maine"]),
    ("East Coast Cannabis Retail", "Topsham", "ME", "Maine cannabis dispensary operator providing adult-use and medical cannabis products from their own cultivation facilities at retail locations serving Maine adult-use market.", ["Dispensary", "Vertically Integrated", "Adult-Use", "Maine"]),
    # Maryland
    ("Curio Wellness", "Lutherville", "MD", "Maryland cannabis retailer operating dispensary locations that provide adult-use and medical cannabis products under the Grassroots Cannabis brand with a focus on education and patient care.", ["Dispensary", "Adult-Use", "Patient Education", "Maryland"]),
    ("Columbia Care Maryland", "Baltimore", "MD", "Multi-state cannabis retailer with licensed dispensary operations in Maryland providing adult-use and medical cannabis products through their branded retail network.", ["Dispensary", "Multi-State", "Adult-Use", "Maryland"]),
    # Massachusetts
    ("Canna Provisions Retail", "Holyoke", "MA", "Massachusetts cannabis retailer operating dispensaries in Holyoke and Lee, providing adult-use and medical cannabis products with a focus on community engagement and quality.", ["Dispensary", "Adult-Use", "Community", "Massachusetts"]),
    ("Cultivated", "Northampton", "MA", "Massachusetts cannabis dispensary providing adult-use and medical cannabis products in a welcoming, education-focused retail environment in the Pioneer Valley.", ["Dispensary", "Education-Focused", "Adult-Use", "Massachusetts"]),
    ("Revolutionary Clinics", "Somerville", "MA", "Massachusetts cannabis retailer with multiple dispensary locations throughout the Boston metro area, providing adult-use and medical cannabis products in a patient-focused environment.", ["Dispensary Chain", "Boston Metro", "Adult-Use", "Massachusetts"]),
    ("Theory Wellness Retail", "Great Barrington", "MA", "Massachusetts cannabis retailer with dispensary locations in the Berkshires and beyond, providing adult-use and medical cannabis products with a focus on wellness and quality.", ["Dispensary", "Wellness-Focused", "Adult-Use", "Massachusetts"]),
    # Michigan
    ("Gage Cannabis Retail", "Detroit", "MI", "Michigan cannabis retailer operating multiple dispensary locations throughout the state providing adult-use cannabis products in a premium, lifestyle-oriented retail environment.", ["Dispensary Chain", "Adult-Use", "Lifestyle Brand", "Michigan"]),
    ("Lume Cannabis Retail", "Evart", "MI", "Michigan largest cannabis retailer by number of locations, operating dispensaries throughout the state providing adult-use and medical cannabis products at competitive prices.", ["Largest Retailer", "Adult-Use", "Multi-Location", "Michigan"]),
    ("New Standard Michigan", "Grand Rapids", "MI", "Michigan cannabis dispensary operator with multiple locations throughout the state providing adult-use cannabis products in welcoming, accessible retail environments.", ["Dispensary", "Adult-Use", "Accessible", "Michigan"]),
    ("Pleasantrees Retail", "Harrison Township", "MI", "Michigan cannabis dispensary known for premium craft cannabis products sourced from their own cultivation facilities, serving adult-use and medical customers.", ["Craft Dispensary", "Vertically Integrated", "Premium Products", "Michigan"]),
    ("Skymint", "East Lansing", "MI", "Michigan cannabis dispensary chain with multiple locations throughout the state providing adult-use and medical cannabis products with a focus on customer education and experience.", ["Dispensary Chain", "Adult-Use", "Customer Education", "Michigan"]),
    # Minnesota
    ("KORONA POS", "Las Vegas", "NV", "Cannabis retail POS software provider offering cloud-based dispensary point-of-sale with Metrc integration, inventory management, loyalty programs, and e-commerce capabilities for dispensaries nationwide.", ["POS Software", "Metrc Integration", "Inventory Management", "Loyalty Programs"]),
    ("Leafly", "Seattle", "WA", "Cannabis marketplace and technology platform providing online menus, dispensary listings, strain information, and digital marketing tools for cannabis retailers across all legal markets.", ["Marketplace Platform", "Online Menus", "Strain Database", "Digital Marketing"]),
    # Missouri
    ("Clovr Retail", "Kansas City", "MO", "Missouri cannabis dispensary operator with multiple retail locations throughout the state providing adult-use and medical cannabis products with a focus on accessibility and education.", ["Dispensary", "Adult-Use", "Accessibility", "Missouri"]),
    ("Proper Cannabis Retail", "St. Louis", "MO", "Missouri cannabis retailer operating multiple dispensary locations providing premium adult-use and medical cannabis products under the Proper brand throughout the state.", ["Premium Dispensary", "Adult-Use", "Branded Retail", "Missouri"]),
    # Nevada
    ("Acres Cannabis", "Las Vegas", "NV", "Las Vegas cannabis dispensary and retailer providing a full range of adult-use and medical cannabis products in a premium, customer-focused retail environment near the Las Vegas Strip.", ["Dispensary", "Adult-Use", "Las Vegas Strip", "Nevada"]),
    ("Oasis Cannabis", "Las Vegas", "NV", "Las Vegas cannabis dispensary with multiple locations providing adult-use and medical cannabis products with a focus on value pricing, broad product selection, and excellent customer service.", ["Dispensary", "Value Pricing", "Adult-Use", "Nevada"]),
    ("Planet 13", "Las Vegas", "NV", "The world largest cannabis retail entertainment complex, providing an immersive adult-use cannabis shopping experience with a full range of premium products and interactive features.", ["Entertainment Complex", "Immersive Retail", "Adult-Use", "Las Vegas"]),
    # New Jersey
    ("Apothecarium NJ", "Philadelphia", "PA", "Multi-state cannabis dispensary operator with licensed retail locations in New Jersey providing adult-use and medical cannabis products in a pharmacy-inspired retail environment.", ["Pharmacy-Inspired", "Adult-Use", "Medical Cannabis", "New Jersey"]),
    ("Greenleaf Compassion Center", "Montclair", "NJ", "New Jersey first licensed cannabis dispensary, providing adult-use and medical cannabis products with a long-standing commitment to patient care and community engagement.", ["Pioneer Dispensary", "Patient Care", "Community", "New Jersey"]),
    ("Harmony Foundation NJ", "Secaucus", "NJ", "New Jersey cannabis dispensary and retailer providing adult-use and medical cannabis products with a focus on education, accessibility, and responsible consumption.", ["Dispensary", "Education", "Accessibility", "New Jersey"]),
    ("TerrAscend Retail NJ", "Maplewood", "NJ", "New Jersey cannabis retailer operating The Apothecarium dispensaries, providing premium adult-use and medical cannabis products in a welcoming, design-forward retail environment.", ["Apothecarium", "Premium Dispensary", "Adult-Use", "New Jersey"]),
    # New Mexico
    ("Ultra Health Retail", "Bernalillo", "NM", "New Mexico largest cannabis retailer with an extensive dispensary network throughout the state, providing adult-use and medical cannabis products at accessible prices.", ["Largest Retailer", "Dispensary Network", "Adult-Use", "New Mexico"]),
    ("The Verdes Foundation Retail", "Albuquerque", "NM", "New Mexico cannabis dispensary operator providing adult-use and medical cannabis products at multiple locations with a focus on quality, education, and community.", ["Dispensary", "Adult-Use", "Community", "New Mexico"]),
    # New York
    ("Columbia Care NY Retail", "New York", "NY", "New York cannabis retailer operating licensed dispensary locations in the state, providing adult-use and medical cannabis products as New York market continues to expand.", ["Dispensary", "Adult-Use", "New York", "Expanding Market"]),
    ("Housing Works Cannabis Co.", "New York", "NY", "New York first legally operating adult-use cannabis dispensary, operated by a nonprofit organization with all profits supporting housing and services for homeless New Yorkers.", ["Nonprofit Dispensary", "Adult-Use", "Social Mission", "New York"]),
    # Ohio
    ("Cannabist Ohio", "Columbus", "OH", "Ohio cannabis dispensary operator with multiple retail locations throughout the state providing adult-use and medical cannabis products in welcoming, patient-focused environments.", ["Dispensary", "Adult-Use", "Patient-Focused", "Ohio"]),
    ("Standard Wellness Ohio", "Gibsonburg", "OH", "Ohio cannabis retailer operating dispensary locations that provide premium medical and adult-use cannabis products sourced from their own cultivation and processing facilities.", ["Dispensary", "Vertically Integrated", "Premium Products", "Ohio"]),
    ("Verdant Creations", "Columbus", "OH", "Ohio cannabis dispensary operator with multiple locations providing medical cannabis products to registered patients throughout the state with a focus on education and care.", ["Medical Cannabis", "Patient Education", "Multi-Location", "Ohio"]),
    # Oklahoma
    ("Apothecary Farms Retail", "Tulsa", "OK", "Oklahoma cannabis dispensary and retailer providing a full range of medical cannabis products at multiple locations throughout the state with a focus on quality and patient education.", ["Medical Cannabis", "Dispensary", "Patient Education", "Oklahoma"]),
    ("Maribis of Oklahoma", "Oklahoma City", "OK", "Oklahoma cannabis retailer operating dispensary locations throughout the state providing medical cannabis products with competitive pricing and a broad product selection.", ["Medical Cannabis", "Competitive Pricing", "Dispensary", "Oklahoma"]),
    # Oregon
    ("Chalice Farms Retail", "Portland", "OR", "Oregon cannabis dispensary chain operating multiple retail locations throughout the Portland metro and statewide, providing adult-use cannabis products and a premium retail experience.", ["Dispensary Chain", "Adult-Use", "Premium Retail", "Oregon"]),
    ("Diem Cannabis Retail", "Salem", "OR", "Oregon cannabis dispensary operator with multiple locations throughout the state providing adult-use and medical cannabis products in welcoming, accessible retail environments.", ["Dispensary", "Adult-Use", "Multi-Location", "Oregon"]),
    ("Nectar Cannabis Retail", "Portland", "OR", "Portland-based cannabis dispensary chain with multiple Oregon locations providing a broad selection of adult-use and medical cannabis products at competitive prices.", ["Dispensary Chain", "Adult-Use", "Competitive Pricing", "Oregon"]),
    ("POSRG", "Portland", "OR", "Cannabis dispensary POS hardware and services company providing enterprise-grade point-of-sale systems, compliance integrations, and support for dispensaries and multi-state operators nationwide.", ["POS Hardware", "Enterprise Systems", "Compliance Integration", "Nationwide"]),
    # Pennsylvania
    ("Apothecarium Pennsylvania", "Philadelphia", "PA", "Pennsylvania cannabis dispensary operator providing medical cannabis products in a pharmacy-inspired retail environment at multiple locations throughout the Commonwealth.", ["Medical Cannabis", "Pharmacy-Inspired", "Multi-Location", "Pennsylvania"]),
    ("Holistic Industries PA Retail", "Pittsburgh", "PA", "Pennsylvania cannabis retailer operating dispensary locations throughout the state providing premium medical cannabis products under the Grassroots Cannabis brand.", ["Medical Cannabis", "Grassroots Brand", "Dispensary", "Pennsylvania"]),
    ("TerrAscend PA Retail", "Boothwyn", "PA", "Pennsylvania cannabis dispensary operator providing premium medical cannabis products at multiple retail locations throughout the Commonwealth with a focus on patient education.", ["Medical Cannabis", "Premium Dispensary", "Patient Education", "Pennsylvania"]),
    # Rhode Island
    ("Slater Center", "Providence", "RI", "Rhode Island cannabis dispensary providing adult-use and medical cannabis products with a focus on patient care, education, and accessible pricing for the Rhode Island community.", ["Dispensary", "Patient Care", "Adult-Use", "Rhode Island"]),
    # Texas
    ("Compassionate Cultivation Retail", "Austin", "TX", "Texas medical cannabis dispensary operating under the state Compassionate Use Program, providing low-THC cannabis products to registered patients through their Texas retail locations.", ["Medical Cannabis", "Compassionate Use", "Low-THC", "Texas"]),
    ("Texas Original Compassionate Cultivation", "Austin", "TX", "Texas-licensed medical cannabis retailer operating under the Compassionate Use Program, providing cannabis oil products and patient consultations at retail locations throughout Texas.", ["Medical Cannabis", "Cannabis Oil", "Patient Consultations", "Texas"]),
    # Vermont
    ("Ceres Natural Remedies Retail", "Burlington", "VT", "Vermont cannabis dispensary providing adult-use and medical cannabis products in Burlington and other Vermont locations with a focus on quality, education, and community engagement.", ["Dispensary", "Adult-Use", "Community", "Vermont"]),
    # Virginia
    ("Columbia Care Virginia Retail", "Richmond", "VA", "Virginia cannabis retailer operating licensed medical dispensary locations throughout the state providing premium cannabis products for registered patients.", ["Medical Cannabis", "Dispensary", "Registered Patients", "Virginia"]),
    ("Green Leaf Medical Virginia", "Richmond", "VA", "Virginia cannabis dispensary operator with medical locations throughout the state providing cannabis products and patient consultations under Virginia medical cannabis program.", ["Medical Cannabis", "Patient Consultations", "Dispensary", "Virginia"]),
    # Washington
    ("Xtracted Laboratories Retail", "Seattle", "WA", "Washington State cannabis retailer and dispensary operator providing premium cannabis concentrate products and a full product range for adult-use consumers throughout the state.", ["Dispensary", "Concentrates", "Adult-Use", "Washington"]),
    ("Phat Panda Retail", "Spokane", "WA", "Washington State cannabis brand operating retail cannabis operations and wholesale distribution providing premium cannabis products to dispensaries throughout the state.", ["Retail Operations", "Wholesale", "Premium Products", "Washington"]),
    ("springbig", "Boca Raton", "FL", "Cannabis retail loyalty and marketing platform providing dispensaries with SMS marketing, loyalty programs, customer engagement tools, and data analytics to drive repeat visits and revenue.", ["Loyalty Platform", "SMS Marketing", "Customer Engagement", "Data Analytics"]),
    # Washington DC
    ("Takoma Wellness Center Retail", "Washington", "DC", "D.C.-licensed medical cannabis dispensary providing locally grown cannabis products to registered patients in the nation capital with a focus on patient care and education.", ["Medical Cannabis", "Local Cultivation", "Patient Care", "Washington DC"]),
    # West Virginia
    ("Verano West Virginia Retail", "Charleston", "WV", "West Virginia cannabis retailer operating licensed medical dispensary locations providing premium cannabis products to registered patients throughout the state.", ["Medical Cannabis", "Dispensary", "Registered Patients", "West Virginia"]),
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
    category: "retail-dispensary",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── RETAIL & DISPENSARY — UNCLAIMED LISTINGS ───────────────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── COMPLIANCE & LEGAL ───────────────────────────────────────────────"
assert marker in content, "Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
