#!/usr/bin/env python3
import re

listings = [
    ("Copperstate Farms Processing", "Snowflake", "AZ", "Large-scale cannabis processing and manufacturing operation producing wholesale flower, pre-rolls, and trim for licensed brands and dispensaries across the Arizona adult-use market.", ["Processing", "Pre-Rolls", "Wholesale Flower", "Arizona"]),
    ("Grön", "Phoenix", "AZ", "Cannabis edibles manufacturer producing sugar-coated gummy pearls with a focus on minor cannabinoids and innovative flavor profiles, distributed through licensed dispensaries in Arizona and Oregon.", ["Edibles", "Gummies", "Minor Cannabinoids", "Infused Products"]),
    ("Item 9 Labs Corp", "Phoenix", "AZ", "Licensed Arizona cannabis manufacturer and concentrate producer specializing in premium vape cartridges, live resin, and sauce concentrates for the adult-use and medical markets.", ["Vape Cartridges", "Live Resin", "Concentrates", "Arizona"]),
    ("Juva", "Scottsdale", "AZ", "Arizona-licensed cannabis manufacturer producing a full range of infused products including edibles, tinctures, and topicals for the state adult-use and medical markets.", ["Edibles", "Tinctures", "Topicals", "Infused Products"]),
    ("Vext Science Manufacturing", "Phoenix", "AZ", "Licensed cannabis manufacturer operating processing and production facilities in Arizona, producing premium concentrates and infused products for adult-use and medical retail.", ["Concentrates", "Infused Products", "Processing", "Arizona"]),
    ("Artifacts", "Los Angeles", "CA", "California-licensed cannabis manufacturer producing premium pre-rolls and infused flower products using top-shelf indoor cannabis for the state adult-use market.", ["Pre-Rolls", "Infused Flower", "Indoor Cannabis", "California"]),
    ("Bloom Farms", "San Francisco", "CA", "California cannabis manufacturer and brand producing premium vape cartridges, pre-rolls, and concentrates sourced from sustainable farms throughout the state.", ["Vape Cartridges", "Pre-Rolls", "Concentrates", "Sustainable"]),
    ("Cloudious9", "Hayward", "CA", "California-based cannabis vaporizer manufacturer producing innovative vape hardware and devices for cannabis oil and concentrate consumption, serving brands and dispensaries nationwide.", ["Vape Hardware", "Vaporizers", "Cannabis Devices", "OEM"]),
    ("Connected Cannabis Co.", "Sacramento", "CA", "Vertically integrated California cannabis company with large-scale manufacturing operations producing premium flower, vape cartridges, and concentrates for California, Arizona, and Florida markets.", ["Premium Flower", "Vape Cartridges", "Concentrates", "Multi-State"]),
    ("Jetty Extracts", "Sacramento", "CA", "California-licensed cannabis extract manufacturer producing premium vape cartridges, tinctures, and concentrates using solventless and solvent-based extraction methods.", ["Extracts", "Vape Cartridges", "Solventless", "Tinctures"]),
    ("Kiva Confections", "San Francisco", "CA", "California leading cannabis confections manufacturer producing chocolate bars, gummies, mints, and bites using precisely dosed THC and CBD formulations for licensed dispensaries statewide.", ["Edibles", "Chocolate", "Gummies", "Precisely Dosed"]),
    ("Legion of Bloom", "Fairfield", "CA", "California cannabis manufacturer specializing in solventless concentrates and rosin products, supplying premium extracts to licensed dispensaries throughout the state.", ["Solventless", "Rosin", "Concentrates", "California"]),
    ("Lowell Herb Co.", "Los Angeles", "CA", "California cannabis manufacturer producing premium pre-roll packs and flower products using sustainably farmed cannabis, distributed through licensed retailers statewide.", ["Pre-Rolls", "Sustainable Cannabis", "Flower Products", "California"]),
    ("My Green Network", "Los Angeles", "CA", "Southern California full-service white label and private label cannabis manufacturer, producing custom gummies, vape cartridges, pre-rolls, and concentrates for licensed brands.", ["White Label", "Private Label", "Custom Manufacturing", "Full-Service"]),
    ("RAE", "Vernon", "CA", "California-based cannabis vape hardware manufacturer specializing in ceramic cartridges, batteries, and disposable pens with full customization options for cannabis brands.", ["Vape Hardware", "Ceramic Cartridges", "Batteries", "OEM"]),
    ("Raw Garden", "Santa Barbara", "CA", "California-licensed cannabis manufacturer and processor producing live resin vape cartridges and concentrates from sun-grown cannabis for the adult-use market.", ["Live Resin", "Vape Cartridges", "Sun-Grown", "Concentrates"]),
    ("Se7enLeaf", "Costa Mesa", "CA", "Licensed California cannabis manufacturer offering white label and co-packing services including extraction, refinement, formulation, and packaging for vape cartridges, edibles, and pre-rolls.", ["White Label", "Co-Packing", "Extraction", "Formulation"]),
    ("Sunderstorm", "Los Angeles", "CA", "California cannabis manufacturer producing the KANA brand of premium cannabis-infused gummies and edibles, distributed through licensed dispensaries throughout the state.", ["Edibles", "Gummies", "Infused Products", "California"]),
    ("West Coast Cure", "Los Angeles", "CA", "California-licensed cannabis manufacturer known for premium indoor flower, pre-rolls, and concentrate products distributed to licensed dispensaries across the state.", ["Indoor Flower", "Pre-Rolls", "Concentrates", "California"]),
    ("iKrusher", "Irvine", "CA", "California-based vape hardware manufacturer and wholesale supplier offering AIO disposables, 510 cartridges, batteries, and pod systems with customization and OEM capabilities for cannabis brands.", ["Vape Hardware", "510 Cartridges", "Disposables", "OEM"]),
    ("BellRock Brands", "Denver", "CO", "Colorado-based cannabis manufacturing company operating 11 brands and over 200 SKUs across nine states, producing edibles, concentrates, and topicals.", ["Multi-Brand", "Edibles", "Concentrates", "Topicals"]),
    ("Binske", "Denver", "CO", "Colorado cannabis manufacturer producing artisanal infused products including chocolate bars, gummies, and vape cartridges using premium cannabis extract and natural ingredients.", ["Artisanal Edibles", "Chocolate", "Gummies", "Vape Cartridges"]),
    ("Coda Signature", "Denver", "CO", "Colorado-licensed cannabis manufacturer producing premium infused chocolates, truffles, and topicals using high-quality cannabis extract for the adult-use market.", ["Infused Chocolate", "Truffles", "Topicals", "Premium Edibles"]),
    ("Dixie Brands", "Denver", "CO", "One of Colorado pioneering cannabis-infused product manufacturers, producing a wide range of edibles, beverages, tinctures, and topicals for multiple state markets.", ["Edibles", "Beverages", "Tinctures", "Topicals"]),
    ("Incredibly Correct (incredibles)", "Denver", "CO", "Colorado top-selling cannabis edibles manufacturer producing chocolate bars, gummies, tarts, and mints distributed through licensed dispensaries in Colorado, Illinois, Nevada, and other states.", ["Edibles", "Chocolate Bars", "Gummies", "Multi-State"]),
    ("Leiffa", "Denver", "CO", "Colorado cannabis manufacturer producing premium cannabis-infused beverages and tinctures using nano-emulsion technology for fast-acting effects.", ["Beverages", "Tinctures", "Nano-Emulsion", "Fast-Acting"]),
    ("Newt Brothers Artisanal", "Denver", "CO", "Denver-based cannabis edibles manufacturer handcrafting premium chocolate squares and confections for licensed dispensaries throughout the Colorado adult-use market.", ["Artisanal Edibles", "Chocolate", "Confections", "Colorado"]),
    ("Rocky Mountain Extraction Services", "Fort Collins", "CO", "Northern Colorado cannabis manufacturer producing premium CBD and THC extracts, distillates, and isolates using state-of-the-art equipment for licensed brands and operators.", ["Extraction", "Distillates", "Isolates", "White Label"]),
    ("Wana Brands", "Boulder", "CO", "America leading cannabis edibles company, producing fast-acting gummies in multiple formulations distributed through thousands of dispensaries across 15 states and Canada.", ["Gummies", "Fast-Acting", "Multi-State", "Market Leader"]),
    ("Fine Fettle", "Rowland", "CT", "Connecticut-licensed cannabis manufacturer producing premium flower, pre-rolls, and processed cannabis products for the state adult-use and medical markets.", ["Flower", "Pre-Rolls", "Processed Products", "Connecticut"]),
    ("Schwazze Connecticut", "Hartford", "CT", "Licensed cannabis manufacturer operating production and processing facilities in Connecticut, producing premium cannabis products for adult-use and medical retail distribution.", ["Manufacturing", "Processing", "Adult-Use", "Connecticut"]),
    ("Fluent Cannabis (Cansortium)", "Miami", "FL", "Florida-licensed vertically integrated cannabis manufacturer producing premium medical cannabis products including flower, oil cartridges, and edibles for registered patients statewide.", ["Medical Cannabis", "Oil Cartridges", "Edibles", "Florida"]),
    ("Liberty Health Sciences", "Gainesville", "FL", "Florida-licensed cannabis manufacturer producing a full range of medical cannabis products including flower, concentrates, tinctures, and capsules for the state medical market.", ["Medical Cannabis", "Concentrates", "Tinctures", "Florida"]),
    ("MuV (AYR Wellness)", "Tampa", "FL", "Florida cannabis manufacturer producing premium medical cannabis products under the MuV brand, including flower, vape cartridges, edibles, and topicals for licensed dispensaries.", ["Medical Cannabis", "Vape Cartridges", "Edibles", "Florida"]),
    ("Private Label Hemp Lab", "Orlando", "FL", "Florida-based white label and private label cannabis and hemp product manufacturer offering a full range of cannabinoid-infused products for brands and operators nationwide.", ["White Label", "Private Label", "Hemp Products", "Nationwide"]),
    ("Cresco Labs Manufacturing", "Chicago", "IL", "One of the largest cannabis manufacturers in the United States, producing branded wholesale cannabis products including flower, vape cartridges, and edibles for dispensaries across multiple states.", ["Wholesale Manufacturing", "Vape Cartridges", "Edibles", "Multi-State"]),
    ("Green Thumb Industries GTI", "Chicago", "IL", "Major cannabis manufacturer producing the Incredibles edibles brand and other product lines distributed through licensed dispensaries in Illinois, Ohio, and other states.", ["Edibles", "Multi-Brand", "Multi-State", "Illinois"]),
    ("Revolution Cannabis", "Delavan", "IL", "Illinois-licensed cannabis cultivator and manufacturer producing premium flower, pre-rolls, and concentrates for the adult-use and medical markets through licensed retail channels.", ["Flower", "Pre-Rolls", "Concentrates", "Illinois"]),
    ("Verano Manufacturing", "Chicago", "IL", "Multi-state cannabis manufacturer producing artisanal cannabis products under the Verano and Encore brands for distribution through licensed dispensaries in Illinois and beyond.", ["Artisanal Products", "Multi-Brand", "Multi-State", "Illinois"]),
    ("Calyx Peaks", "Portland", "ME", "Maine-licensed cannabis manufacturer producing premium concentrates and extract products for the adult-use and medical markets through licensed dispensaries statewide.", ["Concentrates", "Extracts", "Adult-Use", "Maine"]),
    ("Wellness Connection of Maine", "Portland", "ME", "Maine first licensed cannabis manufacturer, producing a full range of medical and adult-use cannabis products including flower, concentrates, and infused items for statewide distribution.", ["Flower", "Concentrates", "Infused Products", "Maine"]),
    ("Chesapeake Apothecary", "Westminster", "MD", "Maryland-licensed cannabis manufacturer producing premium medical and adult-use cannabis products including flower, vape cartridges, and edibles for distribution statewide.", ["Flower", "Vape Cartridges", "Edibles", "Maryland"]),
    ("Curio Wellness Manufacturing", "Lutherville", "MD", "Maryland-licensed cannabis manufacturer producing premium cannabis products under the Grassroots Cannabis brand for distribution through licensed dispensaries across the state.", ["Premium Products", "Branded Cannabis", "Maryland", "Dispensary Distribution"]),
    ("Berkshire Roots", "Pittsfield", "MA", "Massachusetts-licensed cannabis manufacturer producing premium flower, pre-rolls, and concentrates at their Western Massachusetts facility for the state adult-use market.", ["Flower", "Pre-Rolls", "Concentrates", "Massachusetts"]),
    ("Canna Provisions", "Holyoke", "MA", "Massachusetts-licensed cannabis manufacturer and retailer producing premium indoor flower and processed products at their Holyoke facility for adult-use retail.", ["Indoor Flower", "Processed Products", "Retail", "Massachusetts"]),
    ("Schwazze Massachusetts", "Boston", "MA", "Licensed cannabis manufacturer operating production and processing facilities in Massachusetts, producing premium cannabis products for adult-use and medical retail.", ["Manufacturing", "Processing", "Adult-Use", "Massachusetts"]),
    ("Theory Wellness Manufacturing", "Great Barrington", "MA", "Massachusetts cannabis manufacturer producing premium flower, concentrates, and edibles at their production facilities for adult-use and medical markets in New England.", ["Flower", "Concentrates", "Edibles", "New England"]),
    ("Arise Bioscience", "Ann Arbor", "MI", "Michigan-licensed cannabis manufacturer specializing in pharmaceutical-grade cannabis extract formulations and cannabinoid-based products for the medical and adult-use markets.", ["Pharmaceutical Grade", "Extract Formulations", "Cannabinoids", "Michigan"]),
    ("C3 Industries Manufacturing", "Ann Arbor", "MI", "Michigan-based cannabis manufacturer producing the Cloud Cover and High Profile brands, including premium flower, vape cartridges, and concentrates for statewide retail distribution.", ["Flower", "Vape Cartridges", "Concentrates", "Michigan"]),
    ("Exhale Systems", "Detroit", "MI", "Michigan-licensed cannabis manufacturer operating multiple consumer brands, producing vape cartridges, concentrates, and infused products for the Michigan market.", ["Vape Cartridges", "Concentrates", "Infused Products", "Michigan"]),
    ("GreenLeaf Michigan", "Grand Rapids", "MI", "Michigan-licensed cannabis manufacturer producing premium infused products and concentrates for adult-use and medical dispensaries across the state.", ["Infused Products", "Concentrates", "Adult-Use", "Michigan"]),
    ("Gage Cannabis Manufacturing", "Detroit", "MI", "Michigan cannabis manufacturer producing premium flower, vape cartridges, and concentrates for their own dispensary network and wholesale distribution to licensed retailers.", ["Flower", "Vape Cartridges", "Concentrates", "Michigan"]),
    ("Lume Cannabis Manufacturing", "Evart", "MI", "Michigan-licensed cannabis manufacturer producing a high volume of flower, pre-rolls, and infused products for their statewide dispensary network and wholesale partners.", ["Flower", "Pre-Rolls", "Infused Products", "Michigan"]),
    ("Pleasantrees Manufacturing", "Harrison Township", "MI", "Michigan cannabis manufacturer producing high-quality solventless concentrates and rosin products for licensed dispensaries throughout the state.", ["Solventless", "Rosin", "Concentrates", "Michigan"]),
    ("LeafLine Labs Manufacturing", "Cottage Grove", "MN", "Minnesota-licensed medical cannabis manufacturer producing pharmaceutical-grade cannabis oil formulations, capsules, and vaporizer products for registered patients statewide.", ["Medical Cannabis", "Cannabis Oil", "Capsules", "Minnesota"]),
    ("Vireo Health Manufacturing", "Minneapolis", "MN", "Minnesota-licensed medical cannabis manufacturer producing high-quality oil products, capsules, and vaporizer cartridges for registered patients under the state medical cannabis program.", ["Medical Cannabis", "Oil Products", "Vaporizers", "Minnesota"]),
    ("Clovr Cannabis", "Kansas City", "MO", "Missouri-licensed cannabis manufacturer producing premium flower, vape cartridges, and edibles for the state adult-use and medical markets through licensed dispensaries statewide.", ["Flower", "Vape Cartridges", "Edibles", "Missouri"]),
    ("Proper Cannabis", "St. Louis", "MO", "Missouri cannabis manufacturer producing premium indoor flower, concentrates, and infused products under the Proper brand for distribution through licensed dispensaries across the state.", ["Indoor Flower", "Concentrates", "Infused Products", "Missouri"]),
    ("Acres Cannabis", "Las Vegas", "NV", "Nevada-licensed cannabis manufacturer producing a full range of flower, pre-rolls, concentrates, and edibles for adult-use and medical dispensaries throughout the state.", ["Flower", "Pre-Rolls", "Concentrates", "Nevada"]),
    ("Bear Rootz", "Las Vegas", "NV", "Nevada-based vape pen hardware manufacturer specializing in patented quartz atomizer technology, offering cartridges, all-in-one disposables, and batteries for cannabis brands nationwide.", ["Vape Hardware", "Quartz Atomizer", "Disposables", "OEM"]),
    ("Dr. Dabber", "Las Vegas", "NV", "Nevada-based cannabis vaporizer company producing premium vape hardware and CBD products, specializing in high-quality dab pens and vaporizer devices for cannabis concentrates.", ["Dab Pens", "Vaporizers", "Concentrate Devices", "Hardware"]),
    ("Oasis Cannabis", "Las Vegas", "NV", "Nevada-licensed cannabis manufacturer producing premium flower, concentrates, vape cartridges, and edibles for adult-use and medical retail distribution throughout the state.", ["Flower", "Concentrates", "Vape Cartridges", "Nevada"]),
    ("Schwazze Nevada", "Las Vegas", "NV", "Licensed cannabis manufacturer with production facilities in Nevada producing premium cannabis products for adult-use and medical retail distribution statewide.", ["Manufacturing", "Processing", "Adult-Use", "Nevada"]),
    ("The Kind Pen", "Newark", "NJ", "New Jersey-based cannabis vaporizer manufacturer producing high-quality, affordable vaping solutions for cannabis oils, waxes, and dry herbs, backed by a lifetime warranty.", ["Vaporizers", "Vape Pens", "Cannabis Hardware", "Lifetime Warranty"]),
    ("TerrAscend New Jersey", "Boonton", "NJ", "Licensed New Jersey cannabis manufacturer producing premium medical and adult-use cannabis products at their state-of-the-art processing facility for statewide dispensary distribution.", ["Medical Cannabis", "Processing", "Adult-Use", "New Jersey"]),
    ("Ultra Health Manufacturing", "Bernalillo", "NM", "New Mexico largest cannabis manufacturer, producing a full range of flower, concentrates, edibles, and topicals from their large-scale production facilities for statewide distribution.", ["Flower", "Concentrates", "Edibles", "New Mexico"]),
    ("Schwazze New Mexico Manufacturing", "Albuquerque", "NM", "Licensed cannabis manufacturer operating production and processing facilities in New Mexico, producing premium cannabis products for adult-use and medical retail distribution.", ["Manufacturing", "Processing", "Adult-Use", "New Mexico"]),
    ("The Blinc Group", "New York", "NY", "New York-based vape hardware manufacturer and industry leader in cannabis vaporizer technology, producing premium cartridges, batteries, and vape systems for cannabis brands nationwide.", ["Vape Hardware", "Cartridges", "Batteries", "Industry Leader"]),
    ("Columbia Care Manufacturing", "New York", "NY", "Multi-state cannabis manufacturer with licensed production facilities in New York producing premium cannabis products for medical and adult-use markets.", ["Manufacturing", "Multi-State", "Medical Cannabis", "New York"]),
    ("Etain Health", "New York", "NY", "New York-licensed medical cannabis manufacturer and dispensary operator producing premium cannabis oil products and formulations for registered patients throughout the state.", ["Medical Cannabis", "Cannabis Oil", "Formulations", "New York"]),
    ("Pulsar Vaporizers", "Asheville", "NC", "Vaporizer manufacturer producing a wide range of cannabis vape devices for dry herbs, concentrates, and oils, with over 260 product options including batteries and cartridges.", ["Vaporizers", "Vape Devices", "Dry Herb", "Hardware"]),
    ("BeneLeaves", "Columbus", "OH", "Ohio-licensed cannabis manufacturer specializing in white label production of vape pens, topicals, and edibles, operating to FDA and USDA standards for licensed cannabis operators.", ["White Label", "Vape Pens", "Topicals", "Ohio"]),
    ("Certified Cultivations", "Cleveland", "OH", "Ohio-licensed cannabis manufacturer producing premium medical cannabis flower and processed products for distribution through licensed dispensaries across the state.", ["Medical Cannabis", "Flower", "Processed Products", "Ohio"]),
    ("Standard Wellness", "Gibsonburg", "OH", "Ohio-licensed cannabis manufacturer producing premium medical cannabis products including flower, vape cartridges, and edibles for statewide dispensary distribution.", ["Medical Cannabis", "Vape Cartridges", "Edibles", "Ohio"]),
    ("Avid Hemp", "Portland", "OR", "Oregon-based cannabis and hemp manufacturer producing premium cannabinoid extracts, tinctures, and infused products for the adult-use and medical markets.", ["Hemp Manufacturing", "Extracts", "Tinctures", "Oregon"]),
    ("Drops", "Portland", "OR", "Oregon-based cannabis manufacturer producing premium live rosin gummies and infused products using organic, sun-grown cannabis for the adult-use market.", ["Live Rosin", "Gummies", "Organic", "Oregon"]),
    ("Gron Chocolate", "Portland", "OR", "Oregon cannabis manufacturer producing sugar-coated gummy pearls and chocolate products with a focus on minor cannabinoids, distributed through licensed dispensaries in Oregon, Arizona, and Missouri.", ["Gummies", "Chocolate", "Minor Cannabinoids", "Multi-State"]),
    ("Wyld", "Portland", "OR", "Oregon leading cannabis edibles manufacturer producing fruit-flavored gummies that dominate market share in six Western states, known for consistent quality and accessible pricing.", ["Gummies", "Edibles", "Market Leader", "Multi-State"]),
    ("Arvida Labs", "Philadelphia", "PA", "Full-scale cannabinoid manufacturer producing white label vapes, edibles, concentrates, and pre-rolls for licensed cannabis brands, with capabilities from pilot runs to national distribution.", ["White Label", "Full-Scale Manufacturing", "Vapes", "National Distribution"]),
    ("GTI Pennsylvania", "Pittsburgh", "PA", "Licensed Pennsylvania cannabis manufacturer producing premium medical cannabis flower, vape cartridges, and concentrates for distribution through licensed dispensaries statewide.", ["Medical Cannabis", "Vape Cartridges", "Concentrates", "Pennsylvania"]),
    ("Holistic Industries Pennsylvania", "Pittsburgh", "PA", "Multi-state cannabis manufacturer with licensed production facilities in Pennsylvania producing premium medical cannabis products for statewide dispensary distribution.", ["Medical Cannabis", "Multi-State", "Manufacturing", "Pennsylvania"]),
    ("TerrAscend Pennsylvania", "Boothwyn", "PA", "Award-winning cannabis manufacturer with state-of-the-art cultivation and processing facilities in Pennsylvania producing premium cannabis products for medical and adult-use markets.", ["Award-Winning", "Processing", "Medical Cannabis", "Pennsylvania"]),
    ("Compassionate Cultivation Manufacturing", "Austin", "TX", "Texas-licensed medical cannabis manufacturer operating under the Compassionate Use Program, producing low-THC cannabis oil products for registered patients statewide.", ["Medical Cannabis", "Low-THC", "Compassionate Use", "Texas"]),
    ("Texas Original", "Austin", "TX", "Texas-licensed medical cannabis manufacturer producing premium cannabis oil products, capsules, and tinctures for registered patients under the state Compassionate Use Program.", ["Medical Cannabis", "Cannabis Oil", "Tinctures", "Texas"]),
    ("Ceres Natural Remedies", "Burlington", "VT", "Vermont-licensed cannabis manufacturer producing premium flower, concentrates, and infused products for the state adult-use and medical markets through licensed dispensaries.", ["Flower", "Concentrates", "Infused Products", "Vermont"]),
    ("Vermont Artisanal", "Montpelier", "VT", "Vermont cannabis manufacturer specializing in small-batch, craft cannabis products including premium flower, solventless concentrates, and edibles for the Vermont adult-use market.", ["Craft Manufacturing", "Solventless", "Small-Batch", "Vermont"]),
    ("Dharma Pharmaceuticals", "Marion", "VA", "Virginia-licensed medical cannabis manufacturer producing premium pharmaceutical-grade cannabis oil products and formulations for registered patients throughout the state.", ["Medical Cannabis", "Pharmaceutical Grade", "Cannabis Oil", "Virginia"]),
    ("Green Leaf Medical", "Richmond", "VA", "Virginia-licensed cannabis manufacturer producing a full range of medical cannabis products including flower, vape cartridges, and edibles for statewide dispensary distribution.", ["Medical Cannabis", "Vape Cartridges", "Edibles", "Virginia"]),
    ("ACTIVE formerly AVD", "Seattle", "WA", "Seattle-based cannabis vaporizer hardware manufacturer producing devices specifically designed for live resin and rosin extracts, partnering with over 400 cannabis brands worldwide.", ["Vape Hardware", "Live Resin Devices", "OEM", "Global Brands"]),
    ("Aunt Marys Farmhouse Bakes", "Seattle", "WA", "Washington-licensed cannabis edibles manufacturer producing artisanal baked goods and infused confections for adult-use dispensaries throughout the state.", ["Edibles", "Baked Goods", "Artisanal", "Washington"]),
    ("Fairwinds Manufacturing", "Vancouver", "WA", "Washington-licensed cannabis manufacturer specializing in precisely dosed CBD and THC tinctures, capsules, and topicals for medical and adult-use markets.", ["Tinctures", "Capsules", "Topicals", "Precisely Dosed"]),
    ("Oleum Extracts", "Seattle", "WA", "Washington-licensed cannabis manufacturer producing premium concentrates, cartridges, and extract products for licensed dispensaries throughout the state.", ["Concentrates", "Cartridges", "Extracts", "Washington"]),
    ("Phat Panda", "Spokane", "WA", "Washington State largest cannabis manufacturer by volume, producing a full range of flower, pre-rolls, concentrates, and edibles for licensed dispensaries statewide.", ["Flower", "Pre-Rolls", "Concentrates", "Market Leader"]),
    ("Tribal Seeds", "Bellingham", "WA", "Washington-licensed cannabis manufacturer producing premium indoor flower and genetics for the adult-use market, with a focus on rare and heritage cannabis varieties.", ["Indoor Flower", "Cannabis Genetics", "Heritage Varieties", "Washington"]),
    ("Verano West Virginia", "Charleston", "WV", "West Virginia-licensed medical cannabis manufacturer producing premium cannabis products including flower, vape cartridges, and concentrates for the state medical cannabis program.", ["Medical Cannabis", "Vape Cartridges", "Concentrates", "West Virginia"]),
    ("Partnered Process", "Madison", "WI", "Wisconsin-based organic cannabis and hemp manufacturer producing USDA Organic CBD products including edibles, tinctures, and topicals with both white label and private label capabilities.", ["Organic CBD", "USDA Organic", "White Label", "Hemp Products"]),
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
    category: "manufacturers-suppliers",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── MANUFACTURERS & SUPPLIERS — UNCLAIMED LISTINGS ────────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── CONSULTANTS & ADVISORS ───────────────────────────────────────────────"
assert marker in content, "Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
