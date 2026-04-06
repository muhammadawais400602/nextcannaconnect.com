#!/usr/bin/env python3
import re

listings = [
    # Arizona
    ("Cannabis Creative Agency AZ", "Phoenix", "AZ", "Arizona cannabis marketing and branding agency providing dispensary advertising, social media management, SEO, and packaging design for licensed cannabis operators throughout the state.", ["Marketing", "Social Media", "SEO", "Packaging Design"]),
    ("Desert Bloom Branding", "Scottsdale", "AZ", "Scottsdale-based cannabis branding and design firm specializing in brand identity development, product packaging, and digital marketing for Arizona adult-use and medical cannabis market.", ["Brand Identity", "Packaging", "Digital Marketing", "Arizona"]),
    ("Southwest Cannabis Marketing", "Tempe", "AZ", "Arizona cannabis marketing agency providing comprehensive digital marketing, local SEO, content creation, and brand development services for dispensaries and cannabis brands statewide.", ["Digital Marketing", "SEO", "Content Creation", "Arizona"]),
    # California
    ("Bloom Branding", "Los Angeles", "CA", "Los Angeles cannabis branding and packaging agency specializing in brand strategy, visual identity, product packaging design, and regulatory-compliant label creation for California cannabis brands.", ["Brand Strategy", "Visual Identity", "Packaging Design", "Label Compliance"]),
    ("Budder Creative", "San Francisco", "CA", "Award-winning cannabis branding and design agency helping cannabis operators develop brand identity, product packaging, marketing strategy, and website design for competitive cannabis markets.", ["Brand Identity", "Packaging", "Marketing Strategy", "Award-Winning"]),
    ("Cannaverse Solutions", "Los Angeles", "CA", "California cannabis marketing and branding agency with over 40 years of combined industry experience, providing brand strategy, packaging, website development, SEO, and social media management.", ["Brand Strategy", "Packaging", "SEO", "Social Media"]),
    ("Cannabis Creative Group", "Los Angeles", "CA", "Award-winning full-service cannabis marketing agency with offices in California and nationally, providing website design, SEO, social media, email marketing, packaging design, and branding.", ["Full-Service Marketing", "SEO", "Packaging", "Award-Winning"]),
    ("Custom 420 Supply", "Los Angeles", "CA", "California-based cannabis packaging supplier specializing in custom child-resistant packaging, mylar bags, vape cartridge boxes, labels, and branded packaging solutions for cannabis operators nationwide.", ["Child-Resistant Packaging", "Mylar Bags", "Labels", "Custom Packaging"]),
    ("Greenlit", "Hollywood", "CA", "Hollywood-based cannabis marketing and branding agency collaborating with cannabis entrepreneurs to activate brand identities, websites, digital marketing strategies, and packaging design.", ["Brand Identity", "Digital Marketing", "Websites", "Packaging"]),
    ("HIGHOPES", "San Diego", "CA", "Cannabis branding agency specializing in brand identity, web design, packaging design, and marketing since 2016, helping cannabis businesses stand out in competitive regulated markets.", ["Brand Identity", "Web Design", "Packaging", "Since 2016"]),
    ("KindTyme", "San Francisco", "CA", "Cannabis marketing and design agency providing brand identity, packaging design, website development, cannabis photography, social media strategy, and SEO for cannabis operators nationwide.", ["Brand Identity", "Photography", "SEO", "Social Media"]),
    ("Puf Creativ", "Los Angeles", "CA", "Cannabis creative and marketing firm specializing in brand strategy, photography, video content, and advertising solutions for cannabis and CBD brands in California and beyond.", ["Brand Strategy", "Photography", "Video Content", "Advertising"]),
    ("RXD Company", "Los Angeles", "CA", "Cannabis packaging company with dozens of patents, producing custom child-resistant packaging, label printing, inventory management services, and custom-engineered compliance packaging for cannabis brands.", ["Patented Packaging", "Child-Resistant", "Label Printing", "Compliance"]),
    ("Sister Merci", "Los Angeles", "CA", "Strategy-led creative agency specializing in bold branding for highly regulated industries including cannabis, offering customer research, brand naming, visual identity, packaging, and content production.", ["Brand Strategy", "Brand Naming", "Visual Identity", "Regulated Industries"]),
    ("The Flower Agency", "Los Angeles", "CA", "Omni-channel cannabis digital marketing agency founded by brand veterans with experience at Spotify, Grubhub, and Uber, providing programmatic advertising, SEO, social media, and influencer marketing.", ["Programmatic Advertising", "Influencer Marketing", "SEO", "Omni-Channel"]),
    # Colorado
    ("3C Consulting Marketing", "Denver", "CO", "Denver cannabis marketing and brand strategy division providing integrated marketing services, brand development, and digital marketing for cannabis operators across Colorado and multiple state markets.", ["Integrated Marketing", "Brand Development", "Digital Marketing", "Colorado"]),
    ("Cannabis Creative Group Colorado", "Denver", "CO", "Denver office of the nationally recognized cannabis marketing agency, providing website design, SEO, packaging, branding, and digital marketing for Colorado cannabis operators.", ["Website Design", "SEO", "Packaging", "Colorado"]),
    ("Cultivated Marketing", "Denver", "CO", "Denver-based cannabis marketing firm providing full-service digital marketing, content strategy, social media management, and brand development for Colorado cannabis operators and national brands.", ["Digital Marketing", "Content Strategy", "Social Media", "Full-Service"]),
    ("Higher Ground Marketing", "Denver", "CO", "Colorado cannabis marketing and public relations firm providing brand strategy, media relations, event marketing, and content development for cannabis brands seeking premium market positioning.", ["PR", "Brand Strategy", "Event Marketing", "Media Relations"]),
    ("Hybrid Marketing Co", "Denver", "CO", "Denver cannabis marketing agency providing comprehensive marketing solutions including brand strategy, content marketing, digital advertising, and agency consulting for cannabis operators.", ["Brand Strategy", "Content Marketing", "Digital Advertising", "Consulting"]),
    ("Wurk", "Denver", "CO", "Denver-based cannabis industry marketing and workforce platform providing marketing technology, HR management, payroll, and compliance solutions for cannabis businesses nationwide.", ["Marketing Technology", "HR Management", "Payroll", "Compliance"]),
    # Connecticut
    ("Constitution Cannabis Marketing", "Hartford", "CT", "Connecticut cannabis marketing and branding agency specializing in dispensary marketing, brand identity, digital marketing, and packaging design for Connecticut adult-use cannabis market.", ["Dispensary Marketing", "Brand Identity", "Packaging Design", "Connecticut"]),
    # Florida
    ("Florida Cannabis Marketing", "Miami", "FL", "Miami-based cannabis marketing agency providing digital marketing, SEO, social media management, and brand development for Florida medical cannabis operators and emerging adult-use market.", ["Digital Marketing", "SEO", "Social Media", "Florida"]),
    ("Sunshine State Cannabis Branding", "Tampa", "FL", "Tampa cannabis branding and packaging firm specializing in brand identity, product packaging, label design, and marketing strategy for Florida medical cannabis operators.", ["Brand Identity", "Packaging", "Label Design", "Florida"]),
    # Georgia
    ("Southern Cannabis Branding", "Atlanta", "GA", "Atlanta-based cannabis branding and marketing firm helping operators prepare for emerging Southern cannabis markets with brand identity, packaging design, and market positioning strategy.", ["Brand Identity", "Packaging", "Market Positioning", "Southern Markets"]),
    # Illinois
    ("Chicago Cannabis Marketing", "Chicago", "IL", "Chicago cannabis marketing agency providing digital marketing, SEO, social media management, and brand development for Illinois adult-use and medical cannabis operators.", ["Digital Marketing", "SEO", "Social Media", "Illinois"]),
    ("Midwest Cannabis Creative", "Chicago", "IL", "Chicago-based cannabis branding and creative agency providing brand strategy, packaging design, website development, and digital marketing for Illinois and Midwest cannabis operators.", ["Brand Strategy", "Packaging", "Website Development", "Midwest"]),
    # Maine
    ("Canna Supply House", "Brooklyn", "NY", "Cannabis packaging company based in Brooklyn specializing in child-resistant custom packaging, pre-roll tubes, concentrate containers, and branded packaging for cannabis operators in the Northeast.", ["Child-Resistant Packaging", "Pre-Roll Tubes", "Custom Packaging", "Northeast"]),
    ("Pine State Cannabis Marketing", "Portland", "ME", "Maine cannabis marketing and branding agency providing brand identity, packaging design, digital marketing, and content strategy for Maine adult-use cannabis operators.", ["Brand Identity", "Packaging", "Digital Marketing", "Maine"]),
    # Maryland
    ("Chesapeake Cannabis Marketing", "Baltimore", "MD", "Maryland cannabis marketing and branding agency providing digital marketing, SEO, social media management, packaging design, and brand development for Maryland adult-use cannabis operators.", ["Digital Marketing", "SEO", "Packaging Design", "Maryland"]),
    ("Mid-Atlantic Cannabis Creative", "Bethesda", "MD", "Mid-Atlantic cannabis creative agency providing brand strategy, packaging design, website development, and integrated marketing services for cannabis operators in Maryland and neighboring markets.", ["Brand Strategy", "Packaging", "Integrated Marketing", "Mid-Atlantic"]),
    # Massachusetts
    ("Cannabis Creative Group Boston", "Boston", "MA", "Nationally recognized cannabis marketing agency headquartered in Boston and Chicago, providing award-winning website design, SEO, social media, packaging design, branding, and photography nationwide.", ["Website Design", "SEO", "Photography", "Award-Winning"]),
    ("CannaPlanners", "Burlington", "VT", "Cannabis marketing agency trusted by hundreds of cannabis companies, specializing in web design, SEO, retention marketing, packaging design, logo design, and branding for dispensaries and brands.", ["Web Design", "SEO", "Retention Marketing", "Branding"]),
    ("ESBE Creative", "Boston", "MA", "Woman-owned cannabis marketing agency specializing in customer loyalty programs for cannabis brands and retailers, offering loyalty performance audits, Alpine IQ setup, and custom loyalty management programs.", ["Loyalty Programs", "Alpine IQ", "Retention Marketing", "Woman-Owned"]),
    ("New England Cannabis Marketing", "Boston", "MA", "Boston cannabis marketing firm providing full-service digital marketing, brand strategy, content development, and packaging design for Massachusetts and New England cannabis operators.", ["Digital Marketing", "Brand Strategy", "Packaging", "New England"]),
    # Michigan
    ("Great Lakes Cannabis Marketing", "Detroit", "MI", "Michigan cannabis marketing and branding agency providing digital marketing, SEO, social media management, brand development, and packaging design for Michigan adult-use cannabis operators.", ["Digital Marketing", "SEO", "Packaging Design", "Michigan"]),
    ("Michigan Cannabis Creative", "Grand Rapids", "MI", "West Michigan cannabis branding and creative agency specializing in brand identity, packaging design, website development, and digital marketing for Michigan cannabis operators.", ["Brand Identity", "Packaging", "Website Development", "Michigan"]),
    # Minnesota
    ("BV Company", "Minneapolis", "MN", "Minnesota cannabis marketing agency providing cannabis SEO, social media management, website design, content marketing, packaging and labeling design, and digital advertising for Minnesota cannabis operators.", ["SEO", "Social Media", "Packaging", "Minnesota"]),
    ("North Star Cannabis Marketing", "St. Paul", "MN", "Twin Cities cannabis marketing and branding agency providing brand strategy, digital marketing, packaging design, and content development for Minnesota newly established adult-use cannabis market.", ["Brand Strategy", "Digital Marketing", "Packaging", "Minnesota"]),
    # Missouri
    ("Gateway Cannabis Marketing", "St. Louis", "MO", "St. Louis cannabis marketing and branding agency specializing in digital marketing, brand identity, packaging design, and social media management for Missouri adult-use and medical cannabis operators.", ["Digital Marketing", "Brand Identity", "Packaging", "Missouri"]),
    # Nevada
    ("Desert Cannabis Marketing", "Las Vegas", "NV", "Las Vegas cannabis marketing agency specializing in tourism-driven cannabis brand strategy, digital marketing, SEO, social media, and packaging design for Nevada adult-use operators.", ["Tourism Marketing", "Brand Strategy", "SEO", "Nevada"]),
    ("Las Vegas Cannabis Branding", "Las Vegas", "NV", "Nevada cannabis branding and creative agency providing brand identity development, product packaging design, and marketing strategy for Nevada entertainment-driven adult-use cannabis market.", ["Brand Identity", "Packaging Design", "Marketing Strategy", "Nevada"]),
    # New Jersey
    ("Garden State Cannabis Marketing", "Newark", "NJ", "New Jersey cannabis marketing agency providing digital marketing, SEO, social media management, brand development, and packaging design for New Jersey adult-use cannabis operators.", ["Digital Marketing", "SEO", "Packaging", "New Jersey"]),
    ("Benevolent Mercenaries", "Jersey City", "NJ", "Cannabis marketing agency specializing in cause-driven brand strategy, content marketing, and digital advertising for cannabis operators seeking to build purpose-led brand identities.", ["Brand Strategy", "Content Marketing", "Digital Advertising", "Purpose-Driven"]),
    # New York
    ("Canna Supply House NY", "Brooklyn", "NY", "Brooklyn-based cannabis packaging company specializing in child-resistant custom packaging, vape boxes, pre-roll tubes, concentrate containers, and branded packaging for cannabis operators in New York and the Northeast.", ["Child-Resistant Packaging", "Custom Packaging", "Pre-Roll Tubes", "New York"]),
    ("New York Cannabis Marketing", "New York", "NY", "New York cannabis marketing agency providing digital marketing, SEO, social media management, packaging design, and brand development for New York rapidly growing adult-use cannabis market.", ["Digital Marketing", "SEO", "Packaging", "New York"]),
    ("Northstar Creative", "New York", "NY", "New York-based cannabis branding and creative agency providing brand strategy, visual identity, product packaging design, and digital marketing for cannabis brands in New York and nationally.", ["Brand Strategy", "Visual Identity", "Packaging", "National"]),
    # North Carolina
    ("DRG Technologies", "Charlotte", "NC", "North Carolina cannabis label and packaging company with 40-plus years of experience, producing custom cannabis labels, child-resistant packaging, and compliant printed materials for cannabis operators nationwide.", ["Cannabis Labels", "Child-Resistant Packaging", "Compliance Printing", "Nationwide"]),
    # Ohio
    ("Buckeye Cannabis Marketing", "Columbus", "OH", "Ohio cannabis marketing and branding agency providing digital marketing, brand identity, packaging design, and content strategy for Ohio adult-use and medical cannabis operators.", ["Digital Marketing", "Brand Identity", "Packaging", "Ohio"]),
    # Oklahoma
    ("Sooner State Cannabis Marketing", "Oklahoma City", "OK", "Oklahoma cannabis marketing and branding agency providing digital marketing, SEO, social media management, and brand development for Oklahoma medical cannabis operators.", ["Digital Marketing", "SEO", "Social Media", "Oklahoma"]),
    # Oregon
    ("Calyx Containers", "Portland", "OR", "Oregon-based cannabis packaging company producing domestically manufactured child-resistant packaging solutions including drams, FlexPack pouches, and custom printed containers for cannabis operators nationwide.", ["Child-Resistant Packaging", "FlexPack", "Custom Printing", "Domestic Manufacturing"]),
    ("KindTyme Oregon", "Bend", "OR", "Central Oregon cannabis marketing and design agency providing brand identity, packaging design, website development, photography, and digital marketing for Oregon cannabis operators.", ["Brand Identity", "Packaging", "Photography", "Oregon"]),
    ("Pacific Northwest Cannabis Branding", "Portland", "OR", "Portland cannabis branding and creative agency specializing in brand strategy, visual identity, product packaging, and marketing for Oregon competitive adult-use cannabis market.", ["Brand Strategy", "Visual Identity", "Packaging", "Oregon"]),
    ("Thrive Cannabis Marketing", "Portland", "OR", "Portland cannabis marketing agency providing SEO, content marketing, social media strategy, and digital advertising for Oregon dispensaries and cannabis brands seeking to grow their customer base.", ["SEO", "Content Marketing", "Social Media", "Oregon"]),
    # Pennsylvania
    ("Atlantic Packaging", "Philadelphia", "PA", "Pennsylvania-based cannabis packaging company providing certified child-resistant cartons, trays, labels, and packaging equipment for cannabis operators throughout the Northeast and nationally.", ["Child-Resistant Cartons", "Labels", "Packaging Equipment", "Northeast"]),
    ("Keystone Cannabis Marketing", "Philadelphia", "PA", "Pennsylvania cannabis marketing and branding agency providing digital marketing, brand identity, packaging design, and marketing strategy for Pennsylvania medical and adult-use cannabis operators.", ["Digital Marketing", "Brand Identity", "Packaging", "Pennsylvania"]),
    ("Royal Label", "Philadelphia", "PA", "Pennsylvania family-owned cannabis label printing company with over 60 years of experience, producing GMP-compliant custom cannabis labels meeting state-specific regulatory requirements for cannabis operators nationwide.", ["GMP Labels", "Custom Printing", "Regulatory Compliance", "60+ Years"]),
    # Rhode Island
    ("Ocean State Cannabis Marketing", "Providence", "RI", "Rhode Island cannabis marketing and branding agency providing digital marketing, brand identity, packaging design, and marketing strategy for Rhode Island adult-use cannabis operators.", ["Digital Marketing", "Brand Identity", "Packaging", "Rhode Island"]),
    # Tennessee
    ("Southern Tier Cannabis Branding", "Nashville", "TN", "Nashville-based cannabis branding and design firm specializing in brand identity and packaging design for cannabis operators in legal markets and businesses preparing for emerging Southern cannabis markets.", ["Brand Identity", "Packaging Design", "Southern Markets", "Emerging Markets"]),
    # Texas
    ("Lone Star Cannabis Marketing", "Austin", "TX", "Austin cannabis marketing and branding agency providing brand strategy, digital marketing, packaging design, and marketing consulting for Texas medical cannabis operators and hemp brands.", ["Brand Strategy", "Digital Marketing", "Packaging", "Texas"]),
    # Utah
    ("Calyx Containers Utah", "Salt Lake City", "UT", "Utah-based cannabis packaging manufacturer producing domestically manufactured child-resistant drams, FlexPack pouches, and custom printed packaging with fast lead times and state-specific compliance support.", ["Child-Resistant Packaging", "FlexPack", "Custom Printing", "Utah"]),
    ("Mountain West Cannabis Packaging", "Salt Lake City", "UT", "Utah-based cannabis and hemp packaging supplier providing child-resistant containers, custom labels, and branded packaging solutions for cannabis operators in legal Western markets.", ["Child-Resistant Containers", "Custom Labels", "Branded Packaging", "Western Markets"]),
    # Vermont
    ("CannaPlanners VT", "Burlington", "VT", "Vermont-based cannabis marketing agency trusted by hundreds of cannabis companies nationwide, providing web design, SEO, retention marketing, packaging design, and branding for dispensaries and cannabis brands.", ["Web Design", "SEO", "Retention Marketing", "Vermont"]),
    ("Green Mountain Cannabis Marketing", "Burlington", "VT", "Vermont cannabis marketing and branding agency providing brand identity, packaging design, digital marketing, and content strategy for Vermont adult-use cannabis operators.", ["Brand Identity", "Packaging", "Digital Marketing", "Vermont"]),
    # Virginia
    ("Commonwealth Cannabis Marketing", "Richmond", "VA", "Virginia cannabis marketing and branding agency providing digital marketing, brand identity, packaging design, and marketing strategy for Virginia expanding adult-use cannabis market.", ["Digital Marketing", "Brand Identity", "Packaging", "Virginia"]),
    # Washington
    ("Emerald City Cannabis Marketing", "Seattle", "WA", "Seattle cannabis marketing agency providing SEO, social media management, content marketing, and digital advertising for Washington State dispensaries and cannabis brands.", ["SEO", "Social Media", "Content Marketing", "Washington"]),
    ("Happy Head Marketing", "Seattle", "WA", "Washington-based cannabis packaging supplier specializing in certified child-resistant tins, pop-top tubes, mylar pouches, and paperboard packaging with extensive customization options for cannabis brands nationwide.", ["Child-Resistant Tins", "Pop-Top Tubes", "Mylar Pouches", "Custom Packaging"]),
    ("Pacific Cannabis Creative", "Seattle", "WA", "Seattle cannabis branding and creative agency providing brand strategy, visual identity, packaging design, and digital marketing for Washington State cannabis operators and national brands.", ["Brand Strategy", "Visual Identity", "Packaging", "Washington"]),
    ("Vetrina Group", "Seattle", "WA", "Woman-owned cannabis retail consulting and marketing firm helping cannabis dispensaries use data to optimize performance, with services spanning labor costs, inventory management, data insights, and marketing strategy.", ["Retail Consulting", "Data Analytics", "Inventory Management", "Woman-Owned"]),
    # Washington DC
    ("Capital Cannabis Marketing", "Washington", "DC", "D.C.-based cannabis marketing and branding agency providing brand strategy, digital marketing, packaging design, and public affairs communications for cannabis operators in D.C. and mid-Atlantic markets.", ["Brand Strategy", "Digital Marketing", "Public Affairs", "DC"]),
    # Wisconsin
    ("Great Lakes Cannabis Packaging", "Milwaukee", "WI", "Wisconsin-based cannabis and hemp packaging supplier providing child-resistant containers, custom labels, mylar bags, and branded packaging solutions for cannabis operators in legal markets.", ["Child-Resistant Containers", "Custom Labels", "Mylar Bags", "Wisconsin"]),
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
    category: "marketing-branding-packaging",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── MARKETING & BRANDING — UNCLAIMED LISTINGS ─────────────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── COMPLIANCE & LEGAL ───────────────────────────────────────────────"
assert marker in content, "Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
