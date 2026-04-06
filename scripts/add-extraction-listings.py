#!/usr/bin/env python3
import re

listings = [
    # Alaska
    ("Xtracted Laboratories Alaska", "Talkeetna", "AK", "Alaska-licensed cannabis extraction and processing facility producing premium concentrates and extract products for licensed dispensaries and operators in the state.", ["Extraction", "Concentrates", "Alaska", "Processing"]),
    ("Greatland Ganja", "Anchorage", "AK", "Alaska-licensed cannabis operator with in-house extraction and processing capabilities producing concentrates and infused products for the state adult-use market.", ["Extraction", "Concentrates", "Infused Products", "Alaska"]),
    # Arizona
    ("Harvest HOC Extraction", "Tempe", "AZ", "Licensed Arizona cannabis extraction and processing facility producing premium concentrates, distillates, and infused products for adult-use and medical retail distribution statewide.", ["Concentrates", "Distillates", "Infused Products", "Arizona"]),
    ("Item 9 Labs Extraction", "Phoenix", "AZ", "Arizona leading licensed cannabis extraction company specializing in live resin, sauce, and high-terpene full-spectrum extracts using state-of-the-art hydrocarbon extraction technology.", ["Live Resin", "Hydrocarbon Extraction", "High-Terpene", "Arizona"]),
    ("Mint Cannabis Extraction", "Phoenix", "AZ", "Licensed Arizona cannabis extraction and processing operator producing premium concentrate products for their own dispensary network and wholesale distribution throughout the state.", ["Concentrates", "Dispensary Network", "Wholesale", "Arizona"]),
    ("Sol Flower Extraction", "Tempe", "AZ", "Arizona-licensed cannabis extraction and processing facility producing premium concentrates, vape cartridges, and distillates for adult-use and medical retail distribution.", ["Concentrates", "Vape Cartridges", "Distillates", "Arizona"]),
    # California
    ("Abstrax Tech", "Tustin", "CA", "California-licensed cannabis extraction company operating the world largest cannabis hydrocarbon extractor, offering toll processing services and producing premium live resin and cured concentrates for licensed operators statewide.", ["Hydrocarbon Extraction", "Toll Processing", "Live Resin", "Large-Scale"]),
    ("Bloom Extraction", "San Francisco", "CA", "California-licensed cannabis extraction company producing premium distillate and live resin oil for their own vape cartridge brand and wholesale supply to licensed manufacturers.", ["Distillate", "Live Resin", "Vape Oil", "California"]),
    ("Connected Extracts", "Sacramento", "CA", "California-licensed cannabis extraction and processing facility producing premium live resin, rosin, and distillate products for the adult-use market and their own branded product lines.", ["Live Resin", "Rosin", "Distillate", "California"]),
    ("Floracy", "Nevada City", "CA", "California-licensed cannabis toll processing facility specializing in ethanol extraction, winterization, and decarboxylation, producing Full Extract Cannabis Oil for licensed operators throughout the state.", ["Ethanol Extraction", "Toll Processing", "FECO", "California"]),
    ("Glass House Extraction", "Ventura", "CA", "Large-scale California cannabis extraction and processing facility converting greenhouse-grown cannabis into premium distillate, live resin, and concentrate products for wholesale distribution.", ["Large-Scale Extraction", "Distillate", "Live Resin", "Wholesale"]),
    ("Jetty Extracts Processing", "Sacramento", "CA", "California-licensed cannabis extraction facility producing premium solventless and solvent-based concentrates including rosin, live resin, and distillate for their branded product lines.", ["Solventless", "Live Resin", "Distillate", "California"]),
    ("Kase Manufacturing", "Ceres", "CA", "California-based cannabis manufacturing and extraction facility centrally located near major distribution hubs, providing extraction and processing services for licensed cannabis operators statewide.", ["Extraction Services", "Manufacturing", "Toll Processing", "California"]),
    ("Legion of Bloom Processing", "Fairfield", "CA", "California-licensed cannabis extraction operation specializing in solventless rosin and hash production, supplying premium wholesale extracts to licensed dispensaries throughout the state.", ["Solventless", "Rosin", "Hash", "Wholesale"]),
    ("Raw Garden Processing", "Santa Barbara", "CA", "One of California largest cannabis extraction operations, processing sun-grown cannabis into premium live resin and resin sauce products for the adult-use market.", ["Live Resin", "Resin Sauce", "Sun-Grown", "Large-Scale"]),
    ("Se7enLeaf Extraction", "Costa Mesa", "CA", "California-licensed cannabis extraction and toll processing facility offering CO2, ethanol, and hydrocarbon extraction, biomass refinement, and remediation services for licensed operators.", ["CO2 Extraction", "Ethanol Extraction", "Toll Processing", "Remediation"]),
    ("West Coast Cure Processing", "Los Angeles", "CA", "California-licensed cannabis extraction and processing operation producing premium hydrocarbon concentrates and live resin products for licensed dispensaries throughout Southern California.", ["Hydrocarbon Concentrates", "Live Resin", "Southern California", "Processing"]),
    # Colorado
    ("BioTrackTHC Processing", "Denver", "CO", "Colorado cannabis extraction and processing operator using advanced CO2 and ethanol extraction methods to produce premium distillate and concentrate products for the adult-use market.", ["CO2 Extraction", "Ethanol Extraction", "Distillate", "Colorado"]),
    ("Breckenridge Cannabis Club Extraction", "Breckenridge", "CO", "Colorado-licensed cannabis extraction facility producing premium concentrates and processed products for their dispensary network and wholesale distribution throughout the state.", ["Concentrates", "Dispensary Network", "Wholesale", "Colorado"]),
    ("Colorado Extraction Services", "Denver", "CO", "Denver-based cannabis extraction and toll processing company offering CO2, hydrocarbon, and ethanol extraction services for licensed cultivators and operators throughout Colorado.", ["Toll Processing", "CO2 Extraction", "Hydrocarbon", "Colorado"]),
    ("Ebbu", "Evergreen", "CO", "Colorado cannabis extraction and research company specializing in the development of standardized cannabinoid and terpene formulations for licensed manufacturers and brands.", ["R&D Extraction", "Cannabinoid Formulations", "Terpenes", "Colorado"]),
    ("Green Dot Labs Extraction", "Boulder", "CO", "Colorado premier cannabis extraction operation producing award-winning high-terpene full-spectrum extracts and live resin products exclusively for the adult-use concentrate market.", ["High-Terpene", "Full-Spectrum", "Live Resin", "Award-Winning"]),
    ("Mile High Labs", "Broomfield", "CO", "Global leader in hemp-derived cannabinoid extraction and manufacturing, operating a 400,000 square foot GMP and ISO 9001 certified facility producing bulk cannabinoids and private label CBD products.", ["Hemp Extraction", "Bulk Cannabinoids", "GMP Certified", "Private Label"]),
    ("Rocky Mountain Extraction Services", "Fort Collins", "CO", "Northern Colorado cannabis extraction and processing facility offering ethanol and CO2 extraction, distillation, and refinement services for licensed cannabis operators throughout the state.", ["Ethanol Extraction", "CO2 Extraction", "Distillation", "Toll Processing"]),
    ("Schwazze Extraction", "Denver", "CO", "Colorado-licensed cannabis extraction and processing operation producing premium concentrates and distillates for their own branded products and wholesale distribution throughout the state.", ["Concentrates", "Distillates", "Wholesale", "Colorado"]),
    ("Terrapin Extraction", "Boulder", "CO", "Colorado-licensed cannabis extraction facility producing premium hydrocarbon and CO2 concentrates for their own dispensary network and wholesale partners statewide.", ["Hydrocarbon", "CO2 Concentrates", "Dispensary Network", "Colorado"]),
    ("Veritas Extraction", "Denver", "CO", "Colorado cannabis extraction operation focused on producing premium solventless and hydrocarbon concentrates using top-shelf indoor flower for the adult-use concentrate market.", ["Solventless", "Hydrocarbon", "Premium Concentrates", "Colorado"]),
    ("Xabis", "Denver", "CO", "World-leading cannabis extraction facility design, construction, and management company with experience building and operating extraction operations across five U.S. states.", ["Facility Design", "Extraction Management", "Multi-State", "Consulting"]),
    # Connecticut
    ("Fine Fettle Extraction", "Rowland", "CT", "Connecticut-licensed cannabis extraction and processing facility producing premium concentrates and processed cannabis products for adult-use and medical retail distribution statewide.", ["Concentrates", "Processing", "Adult-Use", "Connecticut"]),
    ("Grown in CT", "Simsbury", "CT", "Connecticut-licensed cannabis extraction and processing operator producing premium concentrate products for the state adult-use and medical markets through licensed retail channels.", ["Concentrates", "Adult-Use", "Medical Cannabis", "Connecticut"]),
    # Florida
    ("Curaleaf Extraction", "Miami", "FL", "Multi-state cannabis extraction operator with licensed processing facilities in Florida producing premium medical cannabis concentrates and oil products for statewide patient distribution.", ["Medical Cannabis", "Concentrates", "Oil Products", "Florida"]),
    ("Liberty Health Sciences Extraction", "Gainesville", "FL", "Florida-licensed cannabis extraction and processing facility producing premium medical cannabis oil, distillate, and concentrate products for statewide dispensary distribution.", ["Medical Cannabis", "Oil Extraction", "Distillate", "Florida"]),
    ("Trulieve Extraction", "Tallahassee", "FL", "Florida largest cannabis extraction operation, processing large volumes of in-house cannabis into premium concentrates, distillates, and oil products for their statewide dispensary network.", ["Large-Scale Extraction", "Distillates", "Oil Products", "Florida"]),
    # Illinois
    ("Cresco Labs Extraction", "Chicago", "IL", "One of the largest cannabis extraction operations in the United States, producing premium concentrates, distillates, and processed products for multi-state branded wholesale distribution.", ["Large-Scale Extraction", "Distillates", "Multi-State", "Wholesale"]),
    ("Green Thumb Extraction", "Chicago", "IL", "Illinois-licensed cannabis extraction and processing facility producing premium concentrates and infused products for their own brands and wholesale distribution to licensed dispensaries.", ["Concentrates", "Infused Products", "Wholesale", "Illinois"]),
    ("Revolution Cannabis Extraction", "Delavan", "IL", "Illinois-licensed cannabis extraction and processing operation producing premium live resin, distillate, and concentrate products for adult-use and medical retail distribution statewide.", ["Live Resin", "Distillate", "Concentrates", "Illinois"]),
    ("Verano Extraction", "Chicago", "IL", "Multi-state cannabis extraction operator with licensed processing facilities in Illinois producing premium artisanal concentrates and distillate products for their own brands and wholesale.", ["Artisanal Concentrates", "Distillate", "Multi-State", "Illinois"]),
    # Maine
    ("Calyx Peaks Extraction", "Portland", "ME", "Maine-licensed cannabis extraction and processing facility producing premium solventless and solvent-based concentrates for adult-use and medical dispensaries throughout the state.", ["Solventless", "Concentrates", "Adult-Use", "Maine"]),
    ("Northeast Patients Group Extraction", "Portland", "ME", "Maine pioneering cannabis extraction operation with licensed processing capabilities producing premium concentrates and processed products for adult-use and medical retail distribution.", ["Concentrates", "Pioneer Operator", "Processing", "Maine"]),
    ("Xtracted Laboratories Maine", "Portland", "ME", "One of the first large-scale cannabis processing labs established on the East Coast, producing premium extracts and concentrates for licensed dispensaries in Maine and New England.", ["Large-Scale Extraction", "East Coast Pioneer", "Concentrates", "New England"]),
    # Maryland
    ("Curio Wellness Extraction", "Lutherville", "MD", "Maryland-licensed cannabis extraction and processing facility producing premium concentrates and distillate products for their own brands and wholesale distribution statewide.", ["Concentrates", "Distillate", "Wholesale", "Maryland"]),
    ("Holistic Industries Extraction", "College Park", "MD", "Multi-state cannabis extraction operator with licensed processing facilities in Maryland producing premium medical and adult-use concentrates for statewide dispensary distribution.", ["Medical Cannabis", "Concentrates", "Multi-State", "Maryland"]),
    # Massachusetts
    ("Berkshire Roots Extraction", "Pittsfield", "MA", "Massachusetts-licensed cannabis extraction facility producing premium concentrates and processed products from their Western Massachusetts cultivation operations for adult-use retail.", ["Concentrates", "Processing", "Adult-Use", "Massachusetts"]),
    ("DabScience Extractions", "Worcester", "MA", "Massachusetts-based cannabis extraction and processing company specializing in pharmaceutical-grade plant extraction and refinement techniques, producing premium concentrates for licensed operators.", ["Pharmaceutical Grade", "Extraction", "Refinement", "Massachusetts"]),
    ("Hollister Biosciences Extraction", "Boston", "MA", "Massachusetts-licensed cannabis extraction and processing operator producing premium hemp-derived and cannabis concentrate products for the medical and adult-use markets.", ["Hemp Extraction", "Concentrates", "Medical Cannabis", "Massachusetts"]),
    ("Theory Wellness Extraction", "Great Barrington", "MA", "Massachusetts-licensed cannabis extraction facility producing premium solventless concentrates and live resin products for their own dispensary network and wholesale distribution.", ["Solventless", "Live Resin", "Dispensary Network", "Massachusetts"]),
    # Michigan
    ("Ascend Wellness Extraction", "Ann Arbor", "MI", "Michigan-licensed cannabis extraction and processing operation producing premium concentrates and distillate products for their own branded lines and wholesale distribution statewide.", ["Concentrates", "Distillate", "Wholesale", "Michigan"]),
    ("C3 Industries Extraction", "Ann Arbor", "MI", "Michigan-based cannabis extraction facility producing premium live resin, rosin, and distillate products under the Cloud Cover and High Profile brands for statewide retail distribution.", ["Live Resin", "Rosin", "Distillate", "Michigan"]),
    ("Gage Cannabis Extraction", "Detroit", "MI", "Michigan-licensed cannabis extraction and processing operation producing premium concentrates and vape products for their own dispensary network and wholesale distribution throughout the state.", ["Concentrates", "Vape Products", "Dispensary Network", "Michigan"]),
    ("Lume Cannabis Extraction", "Evart", "MI", "Michigan-licensed cannabis extraction facility processing in-house cultivation into premium concentrates, distillates, and vape products for their statewide dispensary network.", ["Concentrates", "Distillates", "Vape Products", "Michigan"]),
    ("Pleasantrees Extraction", "Harrison Township", "MI", "Michigan premier solventless extraction operation producing premium live rosin and hash products for licensed dispensaries throughout the state.", ["Solventless", "Live Rosin", "Hash", "Michigan"]),
    ("Skymint Extraction", "Lansing", "MI", "Michigan-licensed cannabis extraction and processing facility producing premium concentrates and infused products for their dispensary network and wholesale distribution statewide.", ["Concentrates", "Infused Products", "Dispensary Network", "Michigan"]),
    # Minnesota
    ("LeafLine Labs Processing", "Cottage Grove", "MN", "Minnesota-licensed medical cannabis extraction and processing facility producing pharmaceutical-grade cannabis oil products and formulations for registered patients statewide.", ["Medical Cannabis", "Cannabis Oil", "Pharmaceutical Grade", "Minnesota"]),
    ("Vireo Health Processing", "Minneapolis", "MN", "Minnesota-licensed medical cannabis processing operation producing high-quality oil formulations, distillates, and cannabinoid products for registered patients under the state medical program.", ["Medical Cannabis", "Oil Formulations", "Distillates", "Minnesota"]),
    # Missouri
    ("Clovr Cannabis Extraction", "Kansas City", "MO", "Missouri-licensed cannabis extraction and processing facility producing premium concentrates, live resin, and distillate products for adult-use and medical retail distribution statewide.", ["Concentrates", "Live Resin", "Distillate", "Missouri"]),
    ("Proper Cannabis Extraction", "St. Louis", "MO", "Missouri cannabis extraction operation producing premium concentrates and processed products under the Proper brand for distribution through licensed dispensaries across the state.", ["Concentrates", "Branded Products", "Wholesale", "Missouri"]),
    # Nevada
    ("Acres Cannabis Extraction", "Las Vegas", "NV", "Nevada-licensed cannabis extraction and processing facility producing premium concentrates, distillates, and oil products for adult-use and medical dispensaries throughout the state.", ["Concentrates", "Distillates", "Oil Products", "Nevada"]),
    ("Green Therapeutics Nevada", "Las Vegas", "NV", "Nevada-licensed cannabis toll processing and extraction company offering hydrocarbon extraction services producing premium concentrates and ready-to-retail vape cartridges for licensed operators.", ["Toll Processing", "Hydrocarbon Extraction", "Vape Cartridges", "Nevada"]),
    ("Nevada Organic Remedies", "Reno", "NV", "Nevada-licensed cannabis extraction and processing operation producing premium medical and adult-use concentrate products using organic extraction methods for statewide retail distribution.", ["Organic Extraction", "Concentrates", "Medical Cannabis", "Nevada"]),
    ("Planet 13 Extraction", "Las Vegas", "NV", "Nevada-licensed cannabis extraction facility processing in-house cultivation into premium concentrate products for their large-format retail operations and wholesale distribution.", ["Concentrates", "Retail Integration", "Wholesale", "Nevada"]),
    # New Jersey
    ("Acreage Holdings NJ Extraction", "Egg Harbor", "NJ", "New Jersey-licensed cannabis extraction and processing facility producing premium medical and adult-use concentrate products for statewide dispensary distribution.", ["Medical Cannabis", "Concentrates", "Adult-Use", "New Jersey"]),
    ("TerrAscend NJ Extraction", "Boonton", "NJ", "New Jersey-licensed cannabis extraction and processing operation producing premium concentrates and distillate products for their own dispensary network and wholesale distribution.", ["Concentrates", "Distillate", "Dispensary Network", "New Jersey"]),
    # New Mexico
    ("Ultra Health Extraction", "Bernalillo", "NM", "New Mexico largest cannabis extraction operation, processing in-house cultivation into premium concentrates, distillates, and oil products for statewide dispensary distribution.", ["Large-Scale Extraction", "Concentrates", "Distillates", "New Mexico"]),
    ("Schwazze NM Extraction", "Albuquerque", "NM", "Licensed cannabis extraction and processing facility in New Mexico producing premium concentrates and processed products for adult-use and medical retail distribution statewide.", ["Concentrates", "Processing", "Adult-Use", "New Mexico"]),
    # New York
    ("Columbia Care NY Extraction", "New York", "NY", "New York-licensed cannabis extraction and processing facility producing premium medical and adult-use concentrate products for statewide dispensary distribution.", ["Medical Cannabis", "Concentrates", "Adult-Use", "New York"]),
    ("Nowave", "Rochester", "NY", "New York State-licensed cannabis processor operating a 32,000 square foot cGMP-certified facility specializing in extractions, packaged goods, and infused product manufacturing for wholesale distribution.", ["cGMP Extraction", "Packaged Goods", "Infused Products", "Wholesale"]),
    ("NorthEast Extracts", "New York", "NY", "New York State-licensed CO2 extraction company producing premium cannabis concentrates and extracts for licensed dispensaries and wholesale distribution throughout the state.", ["CO2 Extraction", "Concentrates", "Wholesale", "New York"]),
    # North Carolina
    ("Open Book Extracts", "Roxboro", "NC", "North Carolina-based cannabinoid extraction and ingredient manufacturer producing high-quality, cost-effective cannabinoid ingredients and finished products for licensed operators nationwide.", ["Cannabinoid Extraction", "Ingredients", "Nationwide", "B2B"]),
    # Ohio
    ("Prodigy Processing Solutions", "Hartsville", "OH", "Ohio-based FDA cGMP and EU GMP compliant cannabis extraction equipment manufacturer and extraction services provider, producing pharmaceutical-grade cannabinoid APIs and cannabis extracts.", ["FDA cGMP", "EU GMP", "Pharmaceutical Grade", "Cannabinoid APIs"]),
    ("Standard Wellness Extraction", "Gibsonburg", "OH", "Ohio-licensed cannabis extraction and processing facility producing premium medical cannabis concentrates, vape products, and distillates for statewide dispensary distribution.", ["Medical Cannabis", "Concentrates", "Vape Products", "Ohio"]),
    ("Verano Ohio Extraction", "Columbus", "OH", "Ohio-licensed cannabis extraction and processing operation producing premium concentrates and distillate products for adult-use and medical retail distribution throughout the state.", ["Concentrates", "Distillate", "Adult-Use", "Ohio"]),
    # Oklahoma
    ("Apothecary Farms Extraction", "Tulsa", "OK", "Oklahoma-licensed cannabis extraction and processing facility producing premium concentrates, distillates, and vape cartridges for medical and adult-use retail distribution statewide.", ["Concentrates", "Distillates", "Vape Cartridges", "Oklahoma"]),
    ("Schwazze Oklahoma Extraction", "Oklahoma City", "OK", "Licensed cannabis extraction and processing operation in Oklahoma producing premium concentrate products for adult-use and medical retail distribution through licensed dispensaries.", ["Concentrates", "Processing", "Adult-Use", "Oklahoma"]),
    # Oregon
    ("Avid Hemp Extraction", "Portland", "OR", "Oregon-licensed cannabis and hemp extraction facility producing premium cannabinoid extracts, distillates, and isolates for licensed manufacturers and brands throughout the state.", ["Hemp Extraction", "Distillates", "Isolates", "Oregon"]),
    ("Chalice Farms Extraction", "Portland", "OR", "Oregon-licensed cannabis extraction and processing facility producing premium live resin, rosin, and distillate products for their own dispensary network and wholesale partners.", ["Live Resin", "Rosin", "Distillate", "Oregon"]),
    ("Hemptown USA Processing", "Portland", "OR", "Oregon-licensed cannabis and hemp processing facility producing premium biomass extracts, distillates, and cannabinoid products for licensed manufacturers and wholesale buyers.", ["Hemp Processing", "Biomass Extracts", "Distillates", "Oregon"]),
    ("Oregrown Extraction", "Bend", "OR", "Oregon-licensed cannabis extraction and processing operation producing premium solventless and hydrocarbon concentrates for licensed dispensaries throughout the state.", ["Solventless", "Hydrocarbon", "Concentrates", "Oregon"]),
    ("Wyld Processing", "Portland", "OR", "Oregon-licensed cannabis processing facility extracting and refining premium cannabis oil for use in Wyld nationally distributed cannabis-infused gummies and edibles line.", ["Cannabis Oil", "Refining", "Edibles Processing", "Oregon"]),
    # Pennsylvania
    ("Holistic Industries PA Extraction", "Pittsburgh", "PA", "Multi-state cannabis extraction operator with licensed processing facilities in Pennsylvania producing premium medical cannabis concentrates for statewide dispensary distribution.", ["Medical Cannabis", "Concentrates", "Multi-State", "Pennsylvania"]),
    ("TerrAscend PA Extraction", "Boothwyn", "PA", "Pennsylvania-licensed cannabis extraction and processing facility producing award-winning premium concentrates and distillate products for medical and adult-use retail distribution.", ["Award-Winning", "Concentrates", "Distillate", "Pennsylvania"]),
    ("Vireo Health PA Processing", "Johnstown", "PA", "Pennsylvania-licensed medical cannabis extraction and processing facility producing premium oil products and formulations for registered patients through licensed dispensaries statewide.", ["Medical Cannabis", "Oil Products", "Formulations", "Pennsylvania"]),
    # Texas
    ("Compassionate Cultivation Processing", "Austin", "TX", "Texas-licensed medical cannabis extraction and processing facility operating under the Compassionate Use Program, producing low-THC cannabis oil products for registered patients.", ["Medical Cannabis", "Low-THC", "Cannabis Oil", "Texas"]),
    ("Texas Original Processing", "Austin", "TX", "Texas-licensed medical cannabis extraction and processing operation producing premium cannabis oil formulations and products for registered patients under the state Compassionate Use Program.", ["Medical Cannabis", "Cannabis Oil", "Compassionate Use", "Texas"]),
    # Vermont
    ("Ceres Natural Remedies Extraction", "Burlington", "VT", "Vermont-licensed cannabis extraction and processing facility producing premium concentrates and processed cannabis products for adult-use and medical retail distribution statewide.", ["Concentrates", "Processing", "Adult-Use", "Vermont"]),
    ("Vermont Artisanal Processing", "Montpelier", "VT", "Vermont cannabis extraction operation specializing in small-batch solventless rosin and ice water hash production for the state craft-focused adult-use market.", ["Solventless", "Rosin", "Ice Water Hash", "Vermont"]),
    # Virginia
    ("Dharma Pharmaceuticals Processing", "Marion", "VA", "Virginia-licensed medical cannabis extraction and processing facility producing pharmaceutical-grade cannabis oil products and formulations for registered patients throughout the state.", ["Medical Cannabis", "Pharmaceutical Grade", "Cannabis Oil", "Virginia"]),
    ("Green Leaf Medical Extraction", "Richmond", "VA", "Virginia-licensed cannabis extraction and processing operation producing premium medical cannabis concentrate products and oil formulations for statewide dispensary distribution.", ["Medical Cannabis", "Concentrates", "Oil Formulations", "Virginia"]),
    # Washington
    ("Emerald City Collective Extraction", "Seattle", "WA", "Washington State-licensed cannabis extraction and processing facility producing premium hydrocarbon and CO2 concentrates for licensed dispensaries throughout the Puget Sound region.", ["Hydrocarbon", "CO2 Concentrates", "Puget Sound", "Washington"]),
    ("Fairwinds Extraction", "Vancouver", "WA", "Washington-licensed cannabis extraction operation producing premium cannabis distillates and oil products used in their precisely dosed tinctures, capsules, and topicals.", ["Distillates", "Cannabis Oil", "Precisely Dosed", "Washington"]),
    ("Integrity Labs", "Seattle", "WA", "Washington State-licensed cannabis extraction and processing company producing premium concentrates and extract products for licensed dispensaries and wholesale buyers throughout the state.", ["Concentrates", "Extracts", "Wholesale", "Washington"]),
    ("Oleum Extracts Processing", "Seattle", "WA", "Washington-licensed cannabis extraction and processing facility producing premium hydrocarbon concentrates, live resin, and distillate products for licensed dispensaries statewide.", ["Hydrocarbon", "Live Resin", "Distillate", "Washington"]),
    ("Phat Panda Extraction", "Spokane", "WA", "Washington State largest cannabis extraction operation, processing large volumes of in-house cannabis into concentrates, distillates, and vape products for licensed dispensaries statewide.", ["Large-Scale Extraction", "Concentrates", "Vape Products", "Washington"]),
    ("Root Sciences", "Seattle", "WA", "Worldwide leader in the distribution of end-to-end lab extraction equipment and support services, providing premium CO2, ethanol, hydrocarbon, and solventless extraction technology to cannabis processors nationwide.", ["Extraction Equipment", "Lab Services", "CO2 Extraction", "Worldwide"]),
    ("Xtracted Laboratories Washington", "Seattle", "WA", "One of the first large-scale cannabis processing labs in the country, producing premium extracts and concentrates for licensed dispensaries in Washington State and other markets.", ["Pioneer Lab", "Large-Scale", "Extracts", "Washington"]),
    # West Virginia
    ("Morgantown Extracts", "Morgantown", "WV", "West Virginia-licensed medical cannabis extraction and processing facility producing premium concentrate products and oil formulations for the state medical cannabis patient population.", ["Medical Cannabis", "Concentrates", "Oil Formulations", "West Virginia"]),
    ("Verano WV Extraction", "Charleston", "WV", "West Virginia-licensed medical cannabis extraction and processing operation producing premium concentrate products for registered patients through licensed dispensaries statewide.", ["Medical Cannabis", "Concentrates", "Processing", "West Virginia"]),
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
    category: "extraction-processing",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── EXTRACTION & PROCESSING — UNCLAIMED LISTINGS ─────────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── CONSULTANTS & ADVISORS ───────────────────────────────────────────────"
assert marker in content, "Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
