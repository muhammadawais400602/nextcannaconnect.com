#!/usr/bin/env python3
"""Add 100 unclaimed cultivation & growing listings to companies.ts"""

import re

listings = [
    ("GrowGeneration", "Denver", "Colorado", "CO", "One of the nation's largest hydroponic supply companies, offering commercial grow equipment, lighting, nutrients, growing media, and full facility design services for licensed cannabis cultivators.", ["Hydroponic Supplies", "Grow Equipment", "LED Lighting", "Facility Design"]),
    ("Hydrofarm Commercial", "Petaluma", "California", "CA", "Commercial cannabis cultivation equipment supplier offering grow racks, benching systems, LED lighting, and precision irrigation equipment for large-scale indoor facilities.", ["Grow Racks", "LED Lighting", "Irrigation Equipment", "Benching Systems"]),
    ("Fluence by OSRAM", "Austin", "Texas", "TX", "Manufacturer of high-efficiency LED lighting systems specifically engineered for commercial cannabis cultivation, with solutions for indoor and greenhouse operations nationwide.", ["LED Lighting", "Greenhouse Systems", "Indoor Cultivation", "Energy Efficiency"]),
    ("FOHSE", "Las Vegas", "Nevada", "NV", "Commercial LED grow light manufacturer producing high-intensity fixtures designed for large-scale cannabis cultivation facilities requiring maximum yield and energy efficiency.", ["LED Grow Lights", "Commercial Cultivation", "High-Intensity Lighting", "Yield Optimization"]),
    ("InSpire Transpiration Solutions", "San Francisco", "California", "CA", "Specialist in cannabis HVAC and climate control systems, providing integrated heating, cooling, and dehumidification solutions for licensed indoor cultivation operations.", ["HVAC", "Climate Control", "Dehumidification", "Indoor Cultivation"]),
    ("Glass House Brands", "Santa Barbara", "California", "CA", "One of California's largest greenhouse cannabis cultivators, operating large-scale sustainable cultivation facilities producing flower for the California wholesale and retail market.", ["Greenhouse Cultivation", "Wholesale Flower", "Sustainable Growing", "Commercial Scale"]),
    ("Lowell Farms", "Monterey County", "California", "CA", "Licensed California cannabis cultivator specializing in sun-grown and organic cultivation practices, supplying wholesale flower to licensed retailers statewide.", ["Sun-Grown Cultivation", "Organic Cannabis", "Wholesale Flower", "Outdoor Growing"]),
    ("TruLeaf Cultivation", "Rohnert Park", "California", "CA", "Northern California cannabis cultivator focused on premium indoor flower production, supplying licensed dispensaries throughout the state.", ["Indoor Cultivation", "Premium Flower", "Wholesale", "Northern California"]),
    ("Mango Tech Store", "Rohnert Park", "California", "CA", "Cannabis cultivation equipment supplier specializing in advanced environmental and irrigation controllers for commercial indoor grow operations.", ["Environmental Controllers", "Irrigation Systems", "Grow Equipment", "Commercial Indoor"]),
    ("NorCal Cannabis Company", "Santa Rosa", "California", "CA", "Vertically integrated California cannabis operator with large-scale indoor cultivation, extraction, and distribution capabilities serving the statewide market.", ["Indoor Cultivation", "Extraction", "Distribution", "Vertically Integrated"]),
    ("Gold Flora", "San Diego", "California", "CA", "Licensed California cannabis cultivator and brand operator producing premium flower and concentrates for the adult-use market through licensed retail partners.", ["Premium Flower", "Concentrates", "Adult-Use", "Brand Operations"]),
    ("Lyfted Farms", "Modesto", "California", "CA", "Central Valley cannabis cultivator specializing in high-quality indoor flower production, operating state-licensed cultivation facilities in California's agricultural heartland.", ["Indoor Cultivation", "Premium Flower", "Central Valley", "Licensed Facility"]),
    ("Green Dot Labs", "Boulder", "Colorado", "CO", "Colorado's premier cannabis cultivation and extraction operation, specializing exclusively in high-terpene extracts and solventless concentrates for the adult-use market.", ["Extraction", "Solventless Concentrates", "High-Terpene", "Cultivation"]),
    ("LivWell Enlightened Health", "Denver", "Colorado", "CO", "One of Colorado's largest cannabis operators, with multiple licensed cultivation facilities producing flower and trim for wholesale and retail distribution statewide.", ["Commercial Cultivation", "Wholesale Flower", "Retail", "Multi-Site Operations"]),
    ("Colorado Harvest Company", "Denver", "Colorado", "CO", "Licensed Colorado cannabis cultivator and retailer with cultivation facilities producing indoor flower for sale through their own retail locations and wholesale partners.", ["Indoor Cultivation", "Retail", "Wholesale", "Colorado"]),
    ("Mile Hydro", "Denver", "Colorado", "CO", "Denver-based hydroponic supply store serving commercial cannabis cultivators with lighting, nutrients, growing media, and indoor garden equipment.", ["Hydroponic Supplies", "Nutrients", "Grow Lighting", "Growing Media"]),
    ("OptiLeaf", "Denver", "Colorado", "CO", "Cannabis grow management technology company providing turn-key cultivation control and monitoring systems for commercial cannabis facilities in Colorado and beyond.", ["Grow Management", "Cultivation Technology", "Monitoring Systems", "Commercial Facilities"]),
    ("Chalice Farms", "Portland", "Oregon", "OR", "Oregon-licensed cannabis cultivator and retailer operating cultivation facilities that supply premium flower to their own dispensary network and wholesale partners.", ["Cultivation", "Retail", "Wholesale Flower", "Oregon"]),
    ("Diem Cannabis", "Salem", "Oregon", "OR", "Licensed Oregon cannabis cultivator producing a range of flower and concentrate products for the state's adult-use and medical markets through licensed retail channels.", ["Flower Production", "Concentrates", "Adult-Use", "Medical Cannabis"]),
    ("TKO Reserve", "Portland", "Oregon", "OR", "Oregon cannabis cultivation and processing operation focused on organic growing practices and premium flower production for the Oregon adult-use market.", ["Organic Cultivation", "Premium Flower", "Processing", "Adult-Use"]),
    ("Nectar Cannabis", "Portland", "Oregon", "OR", "Multi-location Oregon cannabis operator with licensed cultivation and retail operations, producing and selling flower and cannabis products statewide.", ["Cultivation", "Retail", "Multi-Location", "Oregon"]),
    ("Highly Distributed", "Portland", "Oregon", "OR", "Oregon wholesale cannabis distributor offering hydroponic equipment, nutrients, bulk soil, and greenhouse supplies to licensed commercial cultivators at wholesale pricing.", ["Wholesale Distribution", "Hydroponic Equipment", "Nutrients", "Greenhouse Supplies"]),
    ("Ascend Wellness Holdings", "Ann Arbor", "Michigan", "MI", "Vertically integrated multi-state cannabis operator with licensed cultivation facilities in Michigan producing premium flower and concentrates for medical and adult-use markets.", ["Cultivation", "Concentrates", "Multi-State", "Vertically Integrated"]),
    ("Trucenta", "Battle Creek", "Michigan", "MI", "Michigan cannabis operator with both indoor and outdoor cultivation facilities, including a large-scale farm supplying wholesale and retail markets.", ["Indoor Cultivation", "Outdoor Cultivation", "Wholesale", "Michigan"]),
    ("C3 Industries", "Ann Arbor", "Michigan", "MI", "Michigan-based vertically integrated cannabis company with licensed cultivation, manufacturing, and retail operations producing the Cloud Cover and High Profile brands.", ["Cultivation", "Manufacturing", "Retail", "Brand Operations"]),
    ("Pure Roots", "Detroit", "Michigan", "MI", "Vertically integrated Michigan cannabis company with licensed cultivation facilities producing premium flower for their own dispensary network and wholesale partners.", ["Premium Flower", "Dispensary Network", "Wholesale", "Michigan"]),
    ("Redbud Roots", "Three Rivers", "Michigan", "MI", "Licensed Michigan cannabis cultivator focused on small-batch, craft indoor flower production for the adult-use market, known for high-terpene and high-potency cultivars.", ["Craft Cultivation", "Indoor Flower", "High-Terpene", "Small-Batch"]),
    ("Hello Farms", "Ionia", "Michigan", "MI", "Michigan cannabis cultivation facility producing premium indoor flower and concentrates for wholesale distribution to licensed dispensaries across the state.", ["Indoor Cultivation", "Concentrates", "Wholesale", "Michigan"]),
    ("New Standard", "Grand Rapids", "Michigan", "MI", "Licensed Michigan cannabis cultivator and retailer operating cultivation facilities that supply premium flower to their dispensary network and wholesale market.", ["Cultivation", "Retail", "Wholesale Flower", "Michigan"]),
    ("Skymint", "Lansing", "Michigan", "MI", "Michigan cannabis operator with licensed cultivation facilities producing premium flower and processed products for adult-use retail through owned and partner dispensaries.", ["Premium Flower", "Processed Products", "Adult-Use", "Dispensary Network"]),
    ("In Grown Farms", "Chicago", "Illinois", "IL", "Licensed Illinois cannabis cultivator producing premium indoor flower for the adult-use and medical markets, supplying licensed dispensaries throughout the state.", ["Indoor Cultivation", "Premium Flower", "Adult-Use", "Medical Cannabis"]),
    ("Cresco Labs", "Chicago", "Illinois", "IL", "One of the largest vertically integrated cannabis operators in the United States, with licensed cultivation facilities in Illinois producing flower and concentrates for multiple state markets.", ["Commercial Cultivation", "Concentrates", "Multi-State", "Vertically Integrated"]),
    ("Verano Holdings", "Chicago", "Illinois", "IL", "Multi-state cannabis operator with licensed cultivation and processing facilities in Illinois producing artisanal cannabis products under the Verano and Encore brands.", ["Artisanal Cultivation", "Processing", "Multi-State", "Brand Operations"]),
    ("Green Thumb Industries", "Chicago", "Illinois", "IL", "Major cannabis multi-state operator with licensed cultivation facilities in Illinois producing flower, concentrates, and infused products for the adult-use and medical markets.", ["Cultivation", "Concentrates", "Infused Products", "Multi-State"]),
    ("4Front Ventures", "Chicago", "Illinois", "IL", "Vertically integrated cannabis company with cultivation and manufacturing facilities in Illinois focused on providing high-quality, affordable cannabis products at scale.", ["Cultivation", "Manufacturing", "Vertically Integrated", "Commercial Scale"]),
    ("Trulieve Cannabis", "Tallahassee", "Florida", "FL", "Florida's largest cannabis operator, with extensive licensed cultivation and processing facilities producing a full range of medical cannabis products for Florida patients.", ["Medical Cannabis", "Cultivation", "Processing", "Florida"]),
    ("Ayr Wellness", "Miami", "Florida", "FL", "Multi-state cannabis operator with large-scale cultivation facilities in Florida producing premium flower, concentrates, and infused products for the state's medical market.", ["Cultivation", "Concentrates", "Infused Products", "Medical Market"]),
    ("Curaleaf Holdings", "Miami", "Florida", "FL", "One of the largest cannabis operators in the United States, with licensed cultivation and processing facilities in Florida serving the state's medical cannabis patient base.", ["Cultivation", "Processing", "Medical Cannabis", "Multi-State"]),
    ("Planet 13 Holdings", "Las Vegas", "Nevada", "NV", "Nevada-based cannabis operator with licensed cultivation and production facilities supporting their large-format retail operations and wholesale distribution in the state.", ["Cultivation", "Production", "Retail", "Nevada"]),
    ("Acreage Holdings", "New York", "New York", "NY", "Multi-state cannabis operator with licensed cultivation facilities producing premium flower and concentrate products for adult-use retail distribution.", ["Cultivation", "Concentrates", "Multi-State", "Adult-Use"]),
    ("Body and Mind", "Las Vegas", "Nevada", "NV", "Nevada-licensed cannabis cultivator and retailer with cultivation facilities producing premium flower and processed products for Nevada's adult-use and medical markets.", ["Cultivation", "Retail", "Premium Flower", "Nevada"]),
    ("Grow Sciences", "Phoenix", "Arizona", "AZ", "Arizona-licensed cannabis cultivator known for producing high-quality, award-winning flower using advanced indoor cultivation techniques and premium genetics.", ["Premium Cultivation", "Indoor Flower", "Premium Genetics", "Arizona"]),
    ("Harvest Health and Recreation", "Tempe", "Arizona", "AZ", "Multi-state cannabis operator with licensed cultivation facilities in Arizona producing a range of flower and processed cannabis products for adult-use and medical markets.", ["Cultivation", "Processed Products", "Multi-State", "Arizona"]),
    ("Jushi Holdings", "Boca Raton", "Florida", "FL", "Multi-state cannabis operator with licensed cultivation and processing facilities in Pennsylvania and other states producing premium cannabis products for medical and adult-use markets.", ["Cultivation", "Processing", "Multi-State", "Premium Products"]),
    ("Standard Farms", "Columbus", "Ohio", "OH", "Licensed Pennsylvania and Ohio cannabis cultivator producing high-quality medical cannabis flower and concentrates for dispensary distribution in multiple states.", ["Medical Cannabis", "Cultivation", "Concentrates", "Multi-State"]),
    ("iAnthus Capital Holdings", "New York", "New York", "NY", "Multi-state cannabis operator with licensed cultivation facilities in Massachusetts and other states producing premium cannabis products for medical and adult-use markets.", ["Cultivation", "Multi-State", "Medical Cannabis", "Adult-Use"]),
    ("MariMed", "Norwood", "Massachusetts", "MA", "Massachusetts-based vertically integrated cannabis company with licensed cultivation facilities producing premium flower and infused products for adult-use and medical markets.", ["Cultivation", "Infused Products", "Vertically Integrated", "Massachusetts"]),
    ("Bud's Goods", "Watertown", "Massachusetts", "MA", "Massachusetts cannabis operator with licensed cultivation facilities producing New England-grown cannabis flower and products for their own dispensary network.", ["Cultivation", "Dispensary Network", "New England", "Massachusetts"]),
    ("East Coast Cannabis", "Topsham", "Maine", "ME", "Maine-licensed cannabis operator with large-scale cultivation facilities producing premium indoor and greenhouse flower for adult-use and medical markets in New England.", ["Indoor Cultivation", "Greenhouse", "Premium Flower", "New England"]),
    ("HTG Supply", "Harrisburg", "Pennsylvania", "PA", "Multi-state indoor garden and hydroponic supply company with locations across the Northeast, serving commercial cannabis cultivators with lighting, nutrients, and growing equipment.", ["Hydroponic Supplies", "Grow Lighting", "Nutrients", "Commercial Cultivation"]),
    ("Shore Grow", "Toms River", "New Jersey", "NJ", "New Jersey hydroponic supply store providing cannabis cultivators with nutrients, grow lights, irrigation equipment, and expert cultivation support.", ["Hydroponic Supplies", "Nutrients", "Grow Lights", "Irrigation"]),
    ("JumpLights", "New Jersey", "New Jersey", "NJ", "Commercial LED grow light manufacturer producing high-performance lighting systems for cannabis cultivators, with a focus on yield improvement and energy efficiency.", ["LED Grow Lights", "Commercial Lighting", "Energy Efficiency", "Yield Improvement"]),
    ("HVAC Equipment Sales Corp", "New Jersey", "New Jersey", "NJ", "HVAC solutions provider specializing in climate control systems for cannabis grow rooms and greenhouse facilities throughout the New York metro and New Jersey region.", ["HVAC", "Climate Control", "Grow Room Systems", "Greenhouse"]),
    ("Peaches Garden", "Ewing", "New Jersey", "NJ", "Licensed New Jersey cannabis cultivator producing premium indoor flower and cannabis products for the state's adult-use market through licensed retail partners.", ["Indoor Cultivation", "Premium Flower", "Adult-Use", "New Jersey"]),
    ("Catoctin Mountain Growers", "Keymar", "Maryland", "MD", "State-licensed greenhouse cultivation operation producing cannabis and specialty crops from a 23-acre facility, serving licensed operators in Maryland's adult-use market.", ["Greenhouse Cultivation", "Large-Scale Growing", "Maryland", "Adult-Use"]),
    ("Curio Wellness", "Lutherville", "Maryland", "MD", "Maryland-licensed cannabis cultivator and processor operating large-scale cultivation facilities producing premium medical and adult-use cannabis products for statewide distribution.", ["Cultivation", "Processing", "Medical Cannabis", "Maryland"]),
    ("Botanical Sciences", "Pooler", "Georgia", "GA", "Licensed cannabis cultivation and processing operation providing high-quality cannabis products in state-legal markets, with operations focused on Southeast U.S. markets.", ["Cultivation", "Processing", "Southeast Markets", "Licensed Operations"]),
    ("Compassionate Cultivation", "Austin", "Texas", "TX", "Texas-licensed medical cannabis cultivator and processor operating under the state's Compassionate Use Program to produce low-THC cannabis products for registered patients.", ["Medical Cannabis", "Low-THC", "Cultivation", "Texas"]),
    ("Sunburn Cannabis", "Tucson", "Arizona", "AZ", "Arizona-licensed cannabis cultivator specializing in sun-grown outdoor and greenhouse cultivation, producing premium flower for adult-use dispensaries across the state.", ["Sun-Grown", "Outdoor Cultivation", "Greenhouse", "Premium Flower"]),
    ("Schwazze", "Denver", "Colorado", "CO", "Colorado cannabis operator with licensed cultivation facilities producing flower and concentrates for their own retail network and wholesale distribution across the state.", ["Cultivation", "Concentrates", "Retail Network", "Colorado"]),
    ("Veritas Fine Cannabis", "Denver", "Colorado", "CO", "Colorado premium cannabis cultivator focused on producing top-shelf indoor flower using craft cultivation techniques, supplying licensed dispensaries throughout the state.", ["Premium Cultivation", "Indoor Flower", "Craft Techniques", "Colorado"]),
    ("L'eagle Services", "Denver", "Colorado", "CO", "Colorado-licensed organic cannabis cultivator focused on sustainable, pesticide-free growing practices for the adult-use market.", ["Organic Cultivation", "Pesticide-Free", "Sustainable Growing", "Adult-Use"]),
    ("Lightshade", "Denver", "Colorado", "CO", "Colorado cannabis operator with licensed cultivation facilities producing a range of indoor flower strains for their own dispensary network and wholesale partners.", ["Indoor Cultivation", "Flower Strains", "Dispensary Network", "Colorado"]),
    ("Medicine Man Technologies", "Denver", "Colorado", "CO", "Colorado cannabis company with multiple licensed cultivation facilities providing wholesale cannabis and cannabis products to licensed dispensaries throughout the state.", ["Wholesale Cultivation", "Multi-Site", "Colorado", "Licensed Dispensaries"]),
    ("Holistic Industries", "Washington", "District of Columbia", "DC", "Multi-state cannabis operator with licensed cultivation facilities in Pennsylvania, Massachusetts, Maryland, and Michigan producing premium cannabis products for medical and adult-use markets.", ["Multi-State Cultivation", "Premium Products", "Medical Cannabis", "Adult-Use"]),
    ("Takoma Wellness Center", "Washington", "District of Columbia", "DC", "D.C.-licensed medical cannabis cultivator and dispensary providing locally grown cannabis products to registered patients in the nation's capital.", ["Medical Cannabis", "Local Cultivation", "Dispensary", "Washington DC"]),
    ("Canna Provisions", "Holyoke", "Massachusetts", "MA", "Massachusetts-licensed cannabis cultivator and retailer with in-house cultivation producing premium indoor flower for their dispensary and wholesale market.", ["Indoor Cultivation", "Premium Flower", "Retail", "Massachusetts"]),
    ("Theory Wellness", "Great Barrington", "Massachusetts", "MA", "Massachusetts cannabis operator with licensed cultivation facilities producing premium flower and concentrate products for adult-use and medical markets in New England.", ["Premium Cultivation", "Concentrates", "Adult-Use", "New England"]),
    ("Canopy Growth US Operations", "New York", "New York", "NY", "Major cannabis corporation with licensed cultivation and processing operations across multiple U.S. states, producing cannabis flower and derivative products at commercial scale.", ["Commercial Cultivation", "Processing", "Multi-State", "Large-Scale"]),
    ("The Verdes Foundation", "Albuquerque", "New Mexico", "NM", "New Mexico-licensed cannabis cultivator and dispensary operating cultivation facilities that produce premium flower and cannabis products for adult-use and medical markets.", ["Cultivation", "Dispensary", "Premium Flower", "New Mexico"]),
    ("Ultra Health", "Bernalillo", "New Mexico", "NM", "New Mexico's largest licensed cannabis cultivator and dispensary operator, with large-scale cultivation facilities producing medical and adult-use cannabis products statewide.", ["Large-Scale Cultivation", "Medical Cannabis", "Adult-Use", "New Mexico"]),
    ("Schwazze New Mexico", "Albuquerque", "New Mexico", "NM", "Cannabis operator with licensed cultivation and retail facilities in New Mexico producing and distributing premium cannabis flower and products across the state.", ["Cultivation", "Retail", "Distribution", "New Mexico"]),
    ("Revolutionary Clinics", "Somerville", "Massachusetts", "MA", "Massachusetts-licensed cannabis cultivator and multi-location dispensary operator with in-house cultivation facilities producing premium products for the adult-use market.", ["Cultivation", "Multi-Location Dispensary", "Premium Products", "Massachusetts"]),
    ("Gage Cannabis", "Detroit", "Michigan", "MI", "Michigan cannabis operator with licensed cultivation facilities producing premium indoor flower and concentrates for their own dispensary network and wholesale distribution.", ["Indoor Cultivation", "Concentrates", "Dispensary Network", "Michigan"]),
    ("Pleasantrees", "Harrison Township", "Michigan", "MI", "Michigan cannabis cultivator known for producing high-quality indoor flower and solventless concentrates, supplying licensed dispensaries throughout the state.", ["Indoor Flower", "Solventless Concentrates", "Premium Quality", "Michigan"]),
    ("Lume Cannabis", "Evart", "Michigan", "MI", "Michigan-licensed cannabis operator with large-scale cultivation facilities producing a high volume of indoor flower and cannabis products for their statewide dispensary network.", ["Large-Scale Cultivation", "Indoor Flower", "Dispensary Network", "Michigan"]),
    ("Acreage Holdings Maine", "Portland", "Maine", "ME", "Multi-state cannabis operator with licensed cultivation facilities in Maine producing premium cannabis flower and products for adult-use and medical markets.", ["Cultivation", "Premium Flower", "Multi-State", "Maine"]),
    ("Wellness Connection of Maine", "Portland", "Maine", "ME", "Maine's first licensed cannabis operator, with cultivation facilities producing premium medical and adult-use cannabis products for statewide distribution.", ["Pioneer Operator", "Cultivation", "Medical Cannabis", "Maine"]),
    ("Cookies", "San Francisco", "California", "CA", "Nationally recognized cannabis brand with licensed cultivation operations in California and other states, producing premium flower and branded cannabis products for national distribution.", ["Premium Cultivation", "Brand Operations", "National Distribution", "California"]),
    ("Raw Garden", "Santa Barbara", "California", "CA", "California-licensed cannabis cultivator and processor producing premium sun-grown flower and live resin concentrates for the California adult-use market.", ["Sun-Grown Cultivation", "Live Resin", "Concentrates", "California"]),
    ("Jungle Boys", "Los Angeles", "California", "CA", "California-licensed cannabis cultivator known for producing premium, high-terpene indoor flower and concentrates for the California adult-use market.", ["Premium Indoor Flower", "High-Terpene", "Concentrates", "California"]),
    ("Harborside", "San Jose", "California", "CA", "California's pioneering cannabis dispensary and licensed cultivator, producing and selling premium cannabis products to adult-use and medical customers.", ["Pioneer Cultivator", "Dispensary", "Premium Products", "California"]),
    ("Item 9 Labs", "Phoenix", "Arizona", "AZ", "Arizona-licensed cannabis cultivator and concentrate producer operating state-of-the-art cultivation and extraction facilities for the adult-use and medical markets.", ["Cultivation", "Concentrates", "Extraction", "Arizona"]),
    ("Wyld", "Portland", "Oregon", "OR", "Oregon-based cannabis cultivator and infused product producer, growing premium cannabis for use in their nationally distributed edibles and beverages line.", ["Cultivation", "Infused Products", "Edibles", "Beverages"]),
    ("LaGrange Cultivation", "LaGrange", "Ohio", "OH", "Ohio-licensed cannabis cultivator operating indoor grow facilities producing premium medical cannabis flower and products for dispensary distribution across the state.", ["Indoor Cultivation", "Medical Cannabis", "Premium Flower", "Ohio"]),
    ("Riviera Creek", "Weston", "West Virginia", "WV", "West Virginia-licensed medical cannabis cultivator producing premium indoor flower and processed products for the state's medical cannabis patient population.", ["Medical Cannabis", "Indoor Cultivation", "Premium Flower", "West Virginia"]),
    ("Grassroots Cannabis", "Chicago", "Illinois", "IL", "Licensed cannabis cultivator operating in multiple states including Illinois, Pennsylvania, and Maryland, producing premium flower and processed products for medical and adult-use markets.", ["Multi-State Cultivation", "Premium Flower", "Processed Products", "Medical Cannabis"]),
    ("Acreage Holdings Pennsylvania", "Philadelphia", "Pennsylvania", "PA", "Licensed Pennsylvania cannabis cultivator producing medical cannabis flower and products for distribution through licensed dispensaries across the Commonwealth.", ["Medical Cannabis", "Cultivation", "Pennsylvania", "Dispensary Distribution"]),
    ("Columbia Care", "New York", "New York", "NY", "Multi-state cannabis operator with licensed cultivation facilities in New York and other states producing premium cannabis products for medical and adult-use markets.", ["Cultivation", "Multi-State", "Medical Cannabis", "New York"]),
    ("Vireo Health", "Minneapolis", "Minnesota", "MN", "Minnesota-licensed medical cannabis cultivator and processor with facilities producing pharmaceutical-grade cannabis products for registered patients under the state's medical program.", ["Medical Cannabis", "Pharmaceutical Grade", "Cultivation", "Minnesota"]),
    ("LeafLine Labs", "Cottage Grove", "Minnesota", "MN", "Minnesota-licensed medical cannabis cultivator and manufacturer producing cannabis oil products and formulations for registered patients through their state-licensed dispensary network.", ["Medical Cannabis", "Cannabis Oil", "Manufacturing", "Minnesota"]),
    ("Native Roots", "Denver", "Colorado", "CO", "Colorado cannabis operator with licensed cultivation facilities producing premium flower and cannabis products for their own dispensary network and wholesale distribution.", ["Cultivation", "Premium Flower", "Dispensary Network", "Colorado"]),
    ("Copperstate Farms", "Snowflake", "Arizona", "AZ", "One of the largest greenhouse cannabis cultivation operations in the United States, producing premium sun-grown flower at scale for the Arizona adult-use and medical markets.", ["Greenhouse Cultivation", "Sun-Grown", "Large-Scale", "Arizona"]),
    ("Jushi Pennsylvania", "Scranton", "Pennsylvania", "PA", "Licensed Pennsylvania cannabis cultivator producing premium medical cannabis flower and derivative products for distribution through licensed dispensaries across the state.", ["Medical Cannabis", "Cultivation", "Derivative Products", "Pennsylvania"]),
    ("Vext Science", "Phoenix", "Arizona", "AZ", "Arizona and Ohio-licensed cannabis cultivator and processor producing premium flower, concentrates, and infused products for adult-use and medical markets.", ["Cultivation", "Concentrates", "Infused Products", "Multi-State"]),
    ("Terrapin Care Station", "Boulder", "Colorado", "CO", "Colorado cannabis operator with licensed cultivation facilities producing premium indoor flower and concentrate products for their own dispensary network and wholesale partners.", ["Indoor Cultivation", "Concentrates", "Dispensary Network", "Colorado"]),
    ("Hemptown USA", "Portland", "Oregon", "OR", "Oregon-based cannabis and hemp cultivator operating outdoor and greenhouse cultivation facilities, producing biomass and premium flower for the Oregon adult-use market.", ["Hemp Cultivation", "Outdoor Growing", "Greenhouse", "Biomass"]),
]

def slugify(name):
    import re
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

new_entries = []
start_id = 21
for i, (name, city, state_name, state_abbr, desc, tags) in enumerate(listings):
    eid = start_id + i
    slug = slugify(name)
    logo = initials(name)
    color = COLORS[i % len(COLORS)]
    tags_str = ', '.join(f'"{t}"' for t in tags)
    entry = f'''  {{
    id: "{eid}",
    slug: "{slug}",
    name: "{name}",
    tier: "free",
    category: "cultivation-growing",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},'''
    new_entries.append(entry)

block = '\n'.join(new_entries)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'r') as f:
    content = f.read()

marker = '  // ─── MANUFACTURERS & SUPPLIERS ───────────────────────────────────────────'
insert_block = f'\n  // ─── CULTIVATION & GROWING — UNCLAIMED LISTINGS ────────────────────────────\n{block}\n\n{marker}'

new_content = content.replace(marker, insert_block)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(new_entries)} listings (IDs {start_id}–{start_id + len(new_entries) - 1})")
