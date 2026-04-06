#!/usr/bin/env python3
import re

listings = [
    # Arizona
    ("Copperstate Legal Group", "Phoenix", "AZ", "Arizona cannabis law firm providing licensing applications, regulatory compliance, corporate structuring, and operational legal counsel for adult-use and medical cannabis operators throughout the state.", ["Licensing", "Regulatory Compliance", "Corporate Structuring", "Arizona"]),
    ("Gammage & Burnham", "Phoenix", "AZ", "Phoenix full-service law firm with a dedicated cannabis practice providing licensing, regulatory compliance, real estate, and business counsel to cannabis operators in Arizona.", ["Licensing", "Real Estate", "Business Counsel", "Arizona"]),
    ("Green Light Law Group Arizona", "Scottsdale", "AZ", "Arizona cannabis legal advisory firm providing licensing, compliance management, and business counsel to cannabis operators navigating the state adult-use and medical regulatory framework.", ["Licensing", "Compliance Management", "Legal Advisory", "Arizona"]),
    ("Titus Brueckner & Levine", "Scottsdale", "AZ", "Arizona cannabis law firm with extensive experience in cannabis licensing, regulatory compliance, entity formation, and operational legal support for licensed cannabis businesses.", ["Licensing", "Entity Formation", "Regulatory Compliance", "Arizona"]),
    # California
    ("Ariel Clark Law", "Los Angeles", "CA", "Los Angeles cannabis compliance and legal advisory firm specializing in California cannabis licensing, regulatory compliance, and operational legal support for licensed operators throughout the state.", ["Licensing", "Regulatory Compliance", "Legal Advisory", "California"]),
    ("California Cannabis Law Group", "Los Angeles", "CA", "California cannabis law firm providing comprehensive legal services including licensing applications, compliance management, contracts, real estate, and employment law for California cannabis operators.", ["Licensing", "Employment Law", "Contracts", "California"]),
    ("Cogent Law", "San Francisco", "CA", "Cannabis law firm specializing in federal, state, and municipal regulatory compliance and advocacy, providing licensing, corporate structuring, fundraising, and multi-state expansion legal services.", ["Regulatory Compliance", "Corporate Structuring", "Multi-State", "Federal"]),
    ("Dickenson Peatman & Fogarty", "Napa", "CA", "Northern California law firm with a cannabis practice providing licensing, compliance, real estate, and business counsel to cannabis operators throughout Northern California complex regulatory landscape.", ["Licensing", "Real Estate", "Business Counsel", "Northern California"]),
    ("Feuerstein Kulick", "Los Angeles", "CA", "Well-regarded cannabis law boutique recognized by Chambers USA for handling high-profile M&A deals, licensing issues, and providing counsel to multi-state operators and cannabis investors.", ["Chambers USA", "M&A", "Licensing", "Multi-State"]),
    ("Kight Law", "San Diego", "CA", "Cannabis and hemp law firm founded by one of the country most respected cannabis attorneys, providing legal counsel, compliance advisory, and business consulting to cannabis operators nationwide.", ["Hemp Law", "Compliance Advisory", "Nationwide", "California"]),
    ("McGlinchey Stafford", "Los Angeles", "CA", "National law firm with robust cannabis practice providing transactional, regulatory, and dispute resolution services for cannabis operators throughout the West Coast and nationally.", ["Transactional", "Regulatory", "Dispute Resolution", "National"]),
    ("Zuber Lawler", "Los Angeles", "CA", "Cannabis law firm recognized by Chambers USA for expertise in compliance, real estate, regulatory, and licensing services for cannabis businesses operating in California and other state markets.", ["Chambers USA", "Compliance", "Real Estate", "California"]),
    # Colorado
    ("Brownstein Hyatt Farber Schreck", "Denver", "CO", "Denver-based national law firm with a leading cannabis practice recognized by Chambers USA, providing licensing, regulatory compliance, M&A, and lobbying services for cannabis operators and investors.", ["Chambers USA", "M&A", "Lobbying", "Colorado"]),
    ("Cannabis Industry Lawyer", "Peoria", "IL", "National cannabis law firm founded by Top 200 Cannabis Lawyer Tom Howard, providing licensing, compliance, corporate structuring, M&A, and regulatory counsel for cannabis businesses across multiple states.", ["Top 200 Cannabis Lawyer", "Licensing", "M&A", "Multi-State"]),
    ("Colorado Cannabis Law", "Denver", "CO", "Denver cannabis law firm providing licensing applications, regulatory compliance, entity formation, employment law, and operational legal support for Colorado cannabis operators.", ["Licensing", "Employment Law", "Entity Formation", "Colorado"]),
    ("Hoban Law Group", "Denver", "CO", "Denver-based international cannabis law firm providing comprehensive legal services for cannabis and hemp operators, including licensing, compliance, corporate transactions, and federal regulatory guidance.", ["International", "Hemp Law", "Federal Regulatory", "Colorado"]),
    ("Vicente LLP", "Denver", "CO", "Leading national cannabis law firm with deep Colorado roots, providing licensing, regulatory compliance, M&A, lobbying, and multi-state expansion legal services for cannabis operators and investors.", ["National Leader", "Lobbying", "M&A", "Multi-State"]),
    # Connecticut
    ("Cohen and Wolf", "Bridgeport", "CT", "Connecticut law firm with a cannabis practice providing licensing applications, regulatory compliance, and business legal services for cannabis operators in Connecticut adult-use market.", ["Licensing", "Regulatory Compliance", "Adult-Use", "Connecticut"]),
    ("Wiggin and Dana", "New Haven", "CT", "Connecticut full-service law firm with a cannabis group providing licensing, regulatory compliance, real estate, and corporate services for licensed cannabis operators in the state.", ["Licensing", "Real Estate", "Corporate Services", "Connecticut"]),
    # Florida
    ("Akerman LLP", "Miami", "FL", "Nationally recognized full-service law firm with a leading cannabis practice, providing regulatory compliance, transactional, and corporate legal services for cannabis businesses and investors in Florida and nationally.", ["Regulatory Compliance", "Transactional", "National", "Florida"]),
    ("Carey Leisure & Neal", "Clearwater", "FL", "Florida cannabis law firm providing licensing, regulatory compliance, corporate structuring, and operational legal support for medical cannabis operators in Florida highly regulated market.", ["Medical Cannabis", "Licensing", "Corporate Structuring", "Florida"]),
    ("GreenspoonMarder", "Fort Lauderdale", "FL", "Florida-based national law firm with a recognized cannabis practice providing comprehensive legal services including licensing, compliance, real estate, M&A, and banking for cannabis operators.", ["National Firm", "M&A", "Banking", "Florida"]),
    ("Saul Ewing Arnstein & Lehr", "Miami", "FL", "National law firm with a cannabis practice advising state cannabis license applicants, ancillary service providers, investors, and management companies on licensing and compliance matters nationwide.", ["Licensing", "Investors", "Ancillary Services", "National"]),
    # Illinois
    ("Collateral Base Law", "Chicago", "IL", "Illinois cannabis law firm with a track record of winning license awards, providing licensing application support, operational planning, compliance guidance, and legal services for Illinois cannabis businesses.", ["License Awards", "Licensing", "Compliance", "Illinois"]),
    ("Fox Rothschild Illinois", "Chicago", "IL", "National law firm with a cannabis practice providing licensing, compliance, corporate transactions, and employment law services for cannabis operators in Illinois and other states.", ["Licensing", "Employment Law", "Corporate Transactions", "Illinois"]),
    ("Howard & Howard", "Chicago", "IL", "Illinois cannabis law firm providing licensing applications, regulatory compliance, corporate structuring, and operational legal support for cannabis businesses throughout the state adult-use and medical markets.", ["Licensing", "Regulatory Compliance", "Corporate Structuring", "Illinois"]),
    ("Much Shelist", "Chicago", "IL", "Chicago law firm with a cannabis practice providing comprehensive legal services including licensing, regulatory compliance, real estate, M&A, and corporate counsel for Illinois cannabis operators.", ["Licensing", "Real Estate", "M&A", "Illinois"]),
    # Maine
    ("Drummond Woodsum", "Portland", "ME", "Maine law firm with a cannabis practice providing licensing, regulatory compliance, real estate, and business legal services for cannabis operators in Maine adult-use and medical markets.", ["Licensing", "Real Estate", "Adult-Use", "Maine"]),
    ("Murray Plumb & Murray", "Portland", "ME", "Maine cannabis law firm providing licensing, compliance, entity formation, and operational legal support for cultivators, processors, and retailers in Maine cannabis market.", ["Licensing", "Entity Formation", "Compliance", "Maine"]),
    # Maryland
    ("Rosenberg Martin Greenberg", "Baltimore", "MD", "Maryland law firm with a cannabis practice providing licensing applications, regulatory compliance, corporate structuring, and business legal services for Maryland cannabis operators.", ["Licensing", "Corporate Structuring", "Regulatory Compliance", "Maryland"]),
    ("Saul Ewing Maryland", "Baltimore", "MD", "Maryland office of the national cannabis law firm, providing licensing, compliance, and corporate legal services for cannabis operators in Maryland adult-use and medical markets.", ["Licensing", "Compliance", "Adult-Use", "Maryland"]),
    # Massachusetts
    ("Foley Hoag", "Boston", "MA", "Boston law firm with a cannabis practice providing licensing, regulatory compliance, corporate structuring, and employment law services for Massachusetts cannabis operators.", ["Licensing", "Employment Law", "Corporate Structuring", "Massachusetts"]),
    ("Goulston & Storrs", "Boston", "MA", "Massachusetts law firm with a cannabis practice providing licensing applications, real estate, regulatory compliance, and business counsel for cannabis operators throughout New England.", ["Licensing", "Real Estate", "New England", "Massachusetts"]),
    ("Nutter McClennen & Fish", "Boston", "MA", "Boston law firm with a cannabis practice providing licensing, compliance, real estate, M&A, and operational legal support for cannabis operators in Massachusetts and New England.", ["Licensing", "M&A", "Real Estate", "Massachusetts"]),
    ("Prince Lobel Tye", "Boston", "MA", "Massachusetts cannabis law firm providing licensing applications, regulatory compliance, corporate structuring, and ongoing operational legal support for adult-use and medical cannabis operators.", ["Licensing", "Regulatory Compliance", "Adult-Use", "Massachusetts"]),
    # Michigan
    ("Clark Hill", "Detroit", "MI", "National law firm with a nationally recognized cannabis practice, providing comprehensive legal services for cannabis businesses including licensing, compliance, real estate, M&A, and employment law.", ["National Practice", "M&A", "Employment Law", "Michigan"]),
    ("Dykema", "Detroit", "MI", "National law firm recognized as Law360 Cannabis Practice Group of the Year, with deep Michigan expertise in cannabis licensing, compliance, corporate transactions, real estate, and policy since 2007.", ["Law360 Winner", "Since 2007", "Corporate Transactions", "Michigan"]),
    ("Fraser Trebilcock", "Lansing", "MI", "Michigan cannabis law firm with deep regulatory relationships, providing licensing applications, compliance management, corporate structuring, and operational legal support for Michigan cannabis operators.", ["Regulatory Relationships", "Licensing", "Compliance Management", "Michigan"]),
    ("Miller Canfield", "Detroit", "MI", "Michigan full-service law firm with a cannabis practice providing licensing, regulatory compliance, real estate, employment, and corporate legal services for cannabis operators statewide.", ["Full-Service", "Real Estate", "Employment Law", "Michigan"]),
    ("Varnum LLP", "Grand Rapids", "MI", "West Michigan law firm with a cannabis practice providing licensing applications, regulatory compliance, corporate structuring, and real estate legal services for Michigan cannabis operators.", ["Licensing", "Real Estate", "Corporate Structuring", "Michigan"]),
    # Minnesota
    ("Ballard Spahr Minnesota", "Minneapolis", "MN", "Minnesota office of the national cannabis law firm, providing licensing, compliance, and corporate legal services for operators entering Minnesota newly established adult-use cannabis market.", ["National Firm", "Licensing", "Adult-Use", "Minnesota"]),
    ("Fredrikson & Byron", "Minneapolis", "MN", "Minnesota law firm with a cannabis practice providing licensing, regulatory compliance, corporate structuring, and business legal services for cannabis operators in the state emerging adult-use market.", ["Licensing", "Corporate Structuring", "Emerging Market", "Minnesota"]),
    # Missouri
    ("Armstrong Teasdale", "St. Louis", "MO", "Missouri law firm with a cannabis practice providing licensing applications, regulatory compliance, corporate structuring, and business legal services for Missouri cannabis operators.", ["Licensing", "Corporate Structuring", "Regulatory Compliance", "Missouri"]),
    ("Husch Blackwell", "Kansas City", "MO", "National law firm with a cannabis practice providing comprehensive legal services for cannabis businesses including licensing, compliance, M&A, real estate, and regulatory counsel.", ["National Firm", "M&A", "Real Estate", "Missouri"]),
    # Nevada
    ("Dickinson Wright Nevada", "Las Vegas", "NV", "Nevada cannabis law firm providing comprehensive legal services including licensing, compliance, corporate structuring, real estate, and M&A support for Nevada adult-use and medical cannabis operators.", ["Licensing", "M&A", "Real Estate", "Nevada"]),
    ("Fox Rothschild Nevada", "Las Vegas", "NV", "Nevada cannabis law firm providing licensing, compliance, corporate transactions, real estate, and employment law services for cannabis operators in Nevada well-established adult-use market.", ["Licensing", "Employment Law", "Corporate Transactions", "Nevada"]),
    ("Kolesar & Leatham", "Las Vegas", "NV", "Nevada full-service law firm with a cannabis practice providing licensing, regulatory compliance, real estate, and corporate legal services for Nevada adult-use and medical cannabis operators.", ["Licensing", "Real Estate", "Full-Service", "Nevada"]),
    # New Jersey
    ("Chiesa Shahinian & Giantomasi", "Newark", "NJ", "New Jersey cannabis law firm recognized by Chambers USA for expertise in licensing, regulatory compliance, and corporate counsel, serving high-profile investment firms and cannabis operators.", ["Chambers USA", "Licensing", "Investment Firms", "New Jersey"]),
    ("McCarter & English", "Newark", "NJ", "New Jersey law firm recognized by Chambers USA for cannabis M&A transactions, financing, licensing applications, real estate, and IP matters for cannabis investors and operators.", ["Chambers USA", "M&A", "Financing", "New Jersey"]),
    ("Pashman Stein Walder Hayden", "Hackensack", "NJ", "New Jersey cannabis law firm providing licensing, compliance, corporate structuring, and operational legal support for cannabis operators in New Jersey growing adult-use market.", ["Licensing", "Compliance", "Corporate Structuring", "New Jersey"]),
    # New Mexico
    ("Modrall Sperling", "Albuquerque", "NM", "New Mexico law firm with a cannabis practice providing licensing, regulatory compliance, real estate, and corporate legal services for cannabis operators in New Mexico adult-use market.", ["Licensing", "Real Estate", "Regulatory Compliance", "New Mexico"]),
    ("Robles Rael & Anaya", "Albuquerque", "NM", "New Mexico cannabis law firm providing licensing applications, regulatory compliance, and business legal services for cannabis operators in the state adult-use and medical markets.", ["Licensing", "Regulatory Compliance", "Business Legal", "New Mexico"]),
    # New York
    ("Feuerstein Kulick New York", "New York", "NY", "New York cannabis law boutique recognized by Chambers USA for M&A, licensing, and legal counsel to multi-state cannabis operators and investors in New York complex regulatory environment.", ["Chambers USA", "M&A", "Multi-State", "New York"]),
    ("Foley Hoag New York", "New York", "NY", "New York cannabis law firm providing licensing, regulatory compliance, corporate structuring, and employment law services for cannabis operators in New York rapidly expanding adult-use market.", ["Licensing", "Employment Law", "Adult-Use", "New York"]),
    ("Harris Beach", "New York", "NY", "New York law firm with a cannabis practice providing licensing applications, regulatory compliance, real estate, and corporate legal services for cannabis operators statewide.", ["Licensing", "Real Estate", "Corporate Services", "New York"]),
    ("Manatt Phelps & Phillips", "New York", "NY", "National law firm recognized by Chambers USA for cannabis company formation, corporate restructuring, national and international expansion, real estate, compliance, and tax law services.", ["Chambers USA", "Company Formation", "International", "National"]),
    # Ohio
    ("Frantz Ward", "Cleveland", "OH", "Ohio cannabis law firm recognized by Chambers USA as a distinguished cannabis practice, providing licensing, compliance, M&A, real estate, and operational legal services for Ohio cannabis operators.", ["Chambers USA", "M&A", "Real Estate", "Ohio"]),
    ("Mac Murray & Shuster", "Dublin", "OH", "Ohio cannabis law firm with a compliance-first approach, providing licensing, regulatory compliance, employment law, and multi-state expansion services for Ohio cannabis operators and ancillary businesses.", ["Compliance-First", "Employment Law", "Multi-State", "Ohio"]),
    ("Roetzel & Andress", "Columbus", "OH", "Ohio law firm with a cannabis practice providing licensing, regulatory compliance, corporate transactions, and real estate legal services for adult-use and medical cannabis operators statewide.", ["Licensing", "Corporate Transactions", "Real Estate", "Ohio"]),
    # Oklahoma
    ("Hall Estill", "Oklahoma City", "OK", "Oklahoma law firm with a cannabis practice providing licensing, regulatory compliance, entity formation, and operational legal support for medical cannabis operators in Oklahoma active market.", ["Medical Cannabis", "Licensing", "Entity Formation", "Oklahoma"]),
    ("McAfee & Taft", "Oklahoma City", "OK", "Oklahoma cannabis law firm providing licensing applications, regulatory compliance, corporate structuring, and business legal services for medical cannabis operators throughout the state.", ["Licensing", "Corporate Structuring", "Medical Cannabis", "Oklahoma"]),
    # Oregon
    ("Davis Wright Tremaine", "Portland", "OR", "Oregon cannabis law firm recognized by Chambers USA for compliance advice, civil litigation, and federal agency challenges, providing full-spectrum legal services for cannabis operators in Oregon and nationwide.", ["Chambers USA", "Civil Litigation", "Federal Challenges", "Oregon"]),
    ("Green Light Law Group Oregon", "Portland", "OR", "Oregon cannabis legal advisory firm providing OLCC compliance management, licensing, and operational legal support for cannabis cultivators, processors, and retailers throughout the state.", ["OLCC Compliance", "Licensing", "Legal Advisory", "Oregon"]),
    ("Tonkon Torp", "Portland", "OR", "Oregon law firm with a cannabis practice providing licensing, regulatory compliance, corporate transactions, real estate, and operational legal services for Oregon adult-use cannabis operators.", ["Licensing", "Corporate Transactions", "Real Estate", "Oregon"]),
    # Pennsylvania
    ("Ballard Spahr", "Philadelphia", "PA", "National law firm with a recognized cannabis practice providing licensing, compliance, corporate transactions, and regulatory legal services for cannabis operators in Pennsylvania and multiple state markets.", ["National Firm", "Licensing", "Corporate Transactions", "Pennsylvania"]),
    ("Duane Morris", "Philadelphia", "PA", "National law firm recognized by Chambers USA, Legal 500, and Law360 as a national cannabis law leader, providing comprehensive legal services for cannabis businesses and investors across the U.S. and internationally.", ["Chambers USA", "Law360", "National Leader", "International"]),
    ("Saul Ewing Pennsylvania", "Philadelphia", "PA", "Pennsylvania office of the national cannabis law firm, providing licensing, compliance, and corporate legal services for cannabis operators in Pennsylvania medical and emerging adult-use markets.", ["Licensing", "Compliance", "Medical Cannabis", "Pennsylvania"]),
    # Texas
    ("Armbrust & Brown", "Austin", "TX", "Texas cannabis and hemp law firm providing regulatory compliance, licensing guidance, and business legal services for operators under Texas Compassionate Use Program and hemp industry.", ["Hemp Law", "Compassionate Use", "Regulatory Compliance", "Texas"]),
    ("Jackson Walker", "Dallas", "TX", "Texas law firm with a cannabis and hemp practice providing regulatory compliance, licensing, entity formation, and business legal services for Texas cannabis and hemp operators.", ["Hemp Law", "Licensing", "Entity Formation", "Texas"]),
    # Vermont
    ("Gravel & Shea", "Burlington", "VT", "Vermont cannabis law firm providing licensing, regulatory compliance, corporate structuring, and operational legal support for cannabis operators in Vermont adult-use market.", ["Licensing", "Corporate Structuring", "Adult-Use", "Vermont"]),
    # Virginia
    ("Cogent Law Virginia", "Richmond", "VA", "Virginia cannabis law firm providing licensing applications, regulatory compliance, corporate structuring, and business legal support for operators in Virginia expanding adult-use cannabis market.", ["Licensing", "Corporate Structuring", "Adult-Use", "Virginia"]),
    ("McGuireWoods", "Richmond", "VA", "National law firm recognized by Chambers USA with a distinguished cannabis practice, providing legal services to private equity investors, financial institutions, and cannabis operators.", ["Chambers USA", "Private Equity", "Financial Institutions", "National"]),
    # Washington
    ("Dickinson Wright Washington", "Seattle", "WA", "Washington State cannabis law firm providing comprehensive legal services including licensing, compliance, corporate transactions, and M&A support for cannabis operators in the state mature market.", ["Licensing", "M&A", "Corporate Transactions", "Washington"]),
    ("Foster Garvey", "Seattle", "WA", "Seattle cannabis law firm providing licensing, regulatory compliance, corporate structuring, real estate, and employment legal services for Washington State cannabis operators.", ["Licensing", "Real Estate", "Employment Law", "Washington"]),
    ("Oles Morrison Rinker & Baker", "Seattle", "WA", "Seattle cannabis law firm providing licensing, compliance, corporate transactions, and operational legal support for Washington State cannabis operators in one of the country most established markets.", ["Licensing", "Corporate Transactions", "Compliance", "Washington"]),
    # Washington DC
    ("Dentons", "Washington", "DC", "Global law firm recognized by Chambers USA with an increasing cannabis footprint, representing multinational businesses and investors in high-value cannabis M&A and regulatory matters nationwide.", ["Global Firm", "Chambers USA", "M&A", "Multinational"]),
    ("Steptoe & Johnson", "Washington", "DC", "Washington D.C.-based national law firm with a cannabis practice providing federal regulatory guidance, lobbying, compliance, and corporate legal services for cannabis businesses and investors.", ["Federal Regulatory", "Lobbying", "National Firm", "DC"]),
    # West Virginia
    ("Bowles Rice", "Charleston", "WV", "West Virginia law firm with a cannabis practice providing licensing, regulatory compliance, real estate, and business legal services for medical cannabis operators in the state.", ["Medical Cannabis", "Licensing", "Real Estate", "West Virginia"]),
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
    category: "compliance-legal",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── COMPLIANCE & LEGAL — UNCLAIMED LISTINGS ───────────────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── TECHNOLOGY & SOFTWARE ────────────────────────────────────────────────"
assert marker in content, "Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
