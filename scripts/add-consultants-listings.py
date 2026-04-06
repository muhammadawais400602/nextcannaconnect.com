#!/usr/bin/env python3
import re

listings = [
    # Arizona
    ("Cannabis Business Advisors", "Phoenix", "AZ", "Multi-disciplinary cannabis consulting firm with over 30 years of combined experience, specializing in acquisitions, licensing applications, operations optimization, and marketing strategy across 16 state markets.", ["Licensing", "Acquisitions", "Operations", "Multi-State"]),
    ("Catalyst BC", "Phoenix", "AZ", "Cannabis licensing, compliance, and operational consulting firm serving highly regulated industries including cannabis and hemp, providing customized regulatory guidance tailored to state-specific requirements.", ["Licensing", "Compliance", "Regulatory Guidance", "Hemp"]),
    ("Green Hygienics Holdings", "Scottsdale", "AZ", "Arizona-based cannabis advisory and operational consulting firm helping licensed operators optimize cultivation, processing, and retail operations for efficiency and regulatory compliance.", ["Operations Consulting", "Compliance", "Cultivation", "Arizona"]),
    ("Harvest Strategy Group", "Tempe", "AZ", "Arizona cannabis business consulting firm specializing in license applications, operational planning, and market entry strategy for new and expanding cannabis operators in the Southwest.", ["License Applications", "Market Entry", "Operational Planning", "Southwest"]),
    # California
    ("Be Green Legal", "Sacramento", "CA", "California cannabis compliance management consultancy with offices in Sacramento, San Diego, and Humboldt, specializing in compliance for cannabis retail, distribution, and manufacturing businesses.", ["Compliance Management", "Retail", "Distribution", "California"]),
    ("Bolder Industries", "Los Angeles", "CA", "Los Angeles-based cannabis strategy and operations consulting firm advising licensed operators on brand development, market positioning, and operational scaling in the California market.", ["Brand Strategy", "Operations", "Market Positioning", "California"]),
    ("Canna Advisors California", "Boulder", "CA", "One of the most trusted cannabis consulting firms in the country since 2013, helping California cannabis entrepreneurs win licenses, optimize facilities, and maximize business development.", ["Licensing", "Facility Optimization", "Business Development", "Multi-State"]),
    ("Cannabis Strategic Ventures", "Sacramento", "CA", "Northern California cannabis business advisory firm providing strategic consulting services for cultivators, processors, and retailers navigating California complex regulatory environment.", ["Strategic Consulting", "Regulatory Compliance", "Northern California", "Advisory"]),
    ("Emerald Elite Consulting", "Eureka", "CA", "Humboldt County-based cannabis cultivation consulting firm helping commercial operators maximize yield, improve growing SOPs, optimize supply chains, and prepare for state inspections.", ["Cultivation Consulting", "SOPs", "Yield Optimization", "Humboldt"]),
    ("Green Light Law Group", "Los Angeles", "CA", "California cannabis consulting and legal advisory firm providing licensing, compliance, and operational guidance to cannabis businesses throughout the state and in emerging markets.", ["Licensing", "Legal Advisory", "Compliance", "California"]),
    ("Higher Yields Consulting California", "Denver", "CA", "International cannabis consultancy with roots in the industry since 2008, helping operators develop over four million square feet of cannabis facilities with services in licensing, facility design, and operations.", ["Facility Design", "Licensing", "Operations", "International"]),
    ("Kight Law", "San Diego", "CA", "Cannabis and hemp advisory firm founded by one of the country most respected cannabis attorneys, providing legal and business consulting to operators nationwide with a focus on California markets.", ["Legal Advisory", "Hemp", "Business Consulting", "Nationwide"]),
    ("Mentor Capital Group", "San Diego", "CA", "Cannabis business advisory and investment firm helping licensed cannabis operators with strategic planning, capital raising, and operational optimization in California and other markets.", ["Capital Raising", "Strategic Planning", "Investment Advisory", "California"]),
    ("WeCann", "Los Angeles", "CA", "California cannabis consultancy specializing in licensing, real estate site selection, business brokerage, and public advocacy services for cannabis entrepreneurs entering or expanding in California markets.", ["Licensing", "Site Selection", "Business Brokerage", "Advocacy"]),
    # Colorado
    ("3C Consulting", "Denver", "CO", "Denver-headquartered multi-state cannabis consulting firm offering expertise in business planning, real estate, regulatory compliance, investments, and operational management across multiple U.S. markets.", ["Business Planning", "Real Estate", "Regulatory Compliance", "Multi-State"]),
    ("Canna Advisors", "Boulder", "CO", "The cannabis industry most trusted consultancy since 2013, with over 500 clients in 40 states, helping entrepreneurs win licenses, optimize operations, and build sustainable cannabis businesses.", ["Licensing", "Operations", "500+ Clients", "Multi-State"]),
    ("Cannabis Consulting Group", "Denver", "CO", "Denver-based cannabis consulting firm providing comprehensive services including licensing, compliance planning, facility design, financial modeling, and market entry strategy for cannabis operators.", ["Licensing", "Facility Design", "Financial Modeling", "Market Entry"]),
    ("CannaVerse Solutions", "Denver", "CO", "Colorado cannabis business consulting and advisory firm specializing in regulatory compliance, operational optimization, and strategic planning for licensed cannabis operators across multiple states.", ["Regulatory Compliance", "Operational Optimization", "Strategic Planning", "Colorado"]),
    ("Green Light Advisory", "Denver", "CO", "Denver cannabis advisory firm providing strategic business consulting, licensing support, and operational guidance to cannabis entrepreneurs and established operators seeking to grow or expand.", ["Strategic Consulting", "Licensing", "Operational Guidance", "Colorado"]),
    ("Higher Yields Consulting", "Denver", "CO", "International cannabis consultancy operating since 2008, having developed over four million square feet of cannabis facilities worldwide through services including licensing, facility design, marketing, and operational management.", ["Facility Design", "Licensing", "Marketing", "International"]),
    ("Next Big Crop", "Denver", "CO", "Full-service cannabis consultancy focused on design, facility buildout, and business administration, combining hands-on operational experience with strategic planning across multiple facility types.", ["Facility Design", "Buildout", "Business Administration", "Full-Service"]),
    ("Quantum 9", "Denver", "CO", "Cannabis consulting firm with a proven track record since 2012, guiding businesses globally through complex regulatory landscapes, securing licenses, and maximizing operational efficiency across U.S. and international markets.", ["Global Consulting", "Licensing", "Regulatory", "Since 2012"]),
    ("Rocky Mountain Cannabis Consulting", "Denver", "CO", "Women-owned cannabis compliance education company providing strategic operational consulting across 17 states, offering outsourced compliance support, Metrc consulting, and regulatory training for all license types.", ["Compliance Education", "Metrc Consulting", "Regulatory Training", "Women-Owned"]),
    # Florida
    ("Cannabis Business Advisors Florida", "Tampa", "FL", "Florida cannabis consulting firm specializing in medical cannabis licensing applications, operational planning, and regulatory compliance for Florida vertically integrated license structure.", ["Medical Cannabis", "Licensing", "Vertically Integrated", "Florida"]),
    ("Rehmann Cannabis Advisory", "Tampa", "FL", "Professional advisory firm with cannabis specialists in Michigan, Ohio, and Florida offering comprehensive cannabis accounting, regulatory compliance, tax planning, and business advisory services.", ["Accounting", "Tax Planning", "Regulatory Compliance", "Multi-State"]),
    ("Southeast Cannabis Consulting", "Miami", "FL", "Florida-based cannabis consulting firm helping operators navigate the state medical cannabis licensing process, regulatory compliance requirements, and operational planning for vertically integrated facilities.", ["Medical Cannabis", "Licensing", "Compliance", "Florida"]),
    ("Sunbelt Cannabis Consulting", "Orlando", "FL", "Central Florida cannabis consulting and advisory firm providing licensing support, compliance planning, and operational guidance for Florida medical cannabis market and emerging adult-use landscape.", ["Licensing", "Compliance", "Adult-Use", "Florida"]),
    # Georgia
    ("Peach State Cannabis Consulting", "Atlanta", "GA", "Georgia-based cannabis advisory firm helping operators prepare for licensing opportunities in emerging Southern markets, providing business planning, compliance guidance, and market entry strategy.", ["Business Planning", "Market Entry", "Southern Markets", "Georgia"]),
    # Illinois
    ("4Front Ventures Consulting", "Chicago", "IL", "Illinois cannabis operational consulting division helping new and expanding operators optimize cultivation, manufacturing, and retail operations for the Illinois adult-use and medical markets.", ["Operations Consulting", "Cultivation", "Manufacturing", "Illinois"]),
    ("Collateral Base", "Chicago", "IL", "Illinois-based cannabis consulting firm with dozens of successful license awards, providing license application support, operational planning, and compliance guidance for cannabis businesses in Illinois and beyond.", ["License Applications", "Compliance", "Operational Planning", "Illinois"]),
    ("GSB Cannabis Advisors", "Chicago", "IL", "Chicago-based cannabis business advisory firm specializing in Illinois cannabis licensing, operational compliance, financial strategy, and market entry for new and expanding cannabis operators.", ["Licensing", "Financial Strategy", "Compliance", "Illinois"]),
    ("Illinois Cannabis Consulting", "Chicago", "IL", "Boutique Illinois cannabis consulting firm providing specialized guidance on the state social equity licensing structure, application requirements, and regulatory compliance for cannabis operators.", ["Social Equity", "Licensing", "Regulatory Compliance", "Illinois"]),
    ("Midwest Cannabis Consulting", "Chicago", "IL", "Multi-state cannabis consulting firm headquartered in Chicago, providing licensing, compliance, and operational consulting services across Illinois and other Midwest cannabis markets.", ["Licensing", "Compliance", "Midwest Markets", "Multi-State"]),
    # Louisiana
    ("Bayou Cannabis Consulting", "New Orleans", "LA", "Louisiana-based cannabis advisory firm helping medical cannabis operators navigate the state licensing requirements, regulatory compliance, and operational planning for Louisiana medical cannabis program.", ["Medical Cannabis", "Licensing", "Regulatory Compliance", "Louisiana"]),
    ("Bridge West Consulting Louisiana", "New Orleans", "LA", "One of the cannabis industry leading consulting firms, with deep Louisiana roots going back to the state first medical cannabis program, providing licensing, regulatory, and operational advisory services nationwide.", ["Pioneer Firm", "Licensing", "Regulatory", "Nationwide"]),
    # Maryland
    ("Chesapeake Cannabis Consulting", "Baltimore", "MD", "Maryland cannabis consulting firm specializing in adult-use licensing applications, regulatory compliance, and operational planning for Maryland newly expanded cannabis market.", ["Licensing", "Regulatory Compliance", "Adult-Use", "Maryland"]),
    ("Holistic Advisory Group", "Bethesda", "MD", "Mid-Atlantic cannabis business consulting firm providing strategic advisory services for licensed operators seeking to enter or expand in Maryland and neighboring state markets.", ["Strategic Advisory", "Market Entry", "Mid-Atlantic", "Maryland"]),
    # Massachusetts
    ("Existo Consulting", "Boston", "MA", "Full-service cannabis consulting firm providing start-to-finish support for cannabis startups in Michigan, Massachusetts, and Ohio, with services spanning compliance, cultivation, security, Metrc, and technology.", ["Full-Service", "Compliance", "Metrc", "Multi-State"]),
    ("MBA Growth Partners", "Boston", "MA", "Cannabis business consulting firm supporting operators through business and strategy planning, regulatory compliance, operational systemization and scaling, licensing applications, and 280E cost accounting.", ["Business Planning", "280E Accounting", "Licensing", "Scaling"]),
    ("Tenax Strategies", "Boston", "MA", "One of Massachusetts leading cannabis consulting firms, providing comprehensive services from application writing and licensing to site selection, facility design, and post-operational compliance support.", ["Licensing", "Site Selection", "Facility Design", "Massachusetts"]),
    # Michigan
    ("Bahoura Law Cannabis Consulting", "Lapeer", "MI", "Michigan cannabis consulting and legal advisory firm operated by a licensed dispensary owner, providing hands-on licensing, compliance, zoning, leasing, and operational consulting services.", ["Licensing", "Zoning", "Legal Advisory", "Michigan"]),
    ("Great Lakes Cannabis Consulting", "Detroit", "MI", "Michigan cannabis consulting firm specializing in MMFLA and MRTMA licensing, regulatory compliance, operational planning, and market entry strategy for Michigan cannabis operators.", ["MMFLA Licensing", "MRTMA", "Regulatory Compliance", "Michigan"]),
    ("Michigan Cannabis Advisory", "Grand Rapids", "MI", "West Michigan cannabis business advisory firm providing comprehensive consulting services for cultivators, processors, and retailers navigating Michigan adult-use and medical cannabis regulatory environment.", ["Cultivators", "Processors", "Regulatory", "Michigan"]),
    ("Oak Law Cannabis Consulting", "Detroit", "MI", "Michigan cannabis consulting and legal advisory firm providing licensing assistance, regulatory compliance, business structuring, market entry strategy, and M&A support for Michigan cannabis operators.", ["Licensing", "M&A", "Business Structuring", "Michigan"]),
    ("Rehmann Cannabis Consulting", "Saginaw", "MI", "Michigan-based professional advisory firm specializing in cannabis accounting, regulatory compliance, tax planning, and business advisory services for cannabis operators across Michigan, Ohio, and Florida.", ["Accounting", "Tax Planning", "Regulatory Compliance", "Michigan"]),
    # Minnesota
    ("Minnesota Cannabis Consulting", "Minneapolis", "MN", "Twin Cities-based cannabis consulting firm helping entrepreneurs navigate Minnesota new adult-use licensing process, application requirements, and regulatory compliance framework.", ["Licensing", "Adult-Use", "Regulatory Compliance", "Minnesota"]),
    ("North Star Cannabis Advisory", "St. Paul", "MN", "Minnesota cannabis advisory firm providing licensing guidance, business planning, and operational consulting for operators entering the state newly established adult-use cannabis market.", ["Licensing", "Business Planning", "Adult-Use", "Minnesota"]),
    # Missouri
    ("Amendment 2 Consultants", "St. Louis", "MO", "Missouri cannabis consulting firm with deep roots in the state legalization campaign, providing government affairs, compliance, SOPs, licensing acquisition, and branding services for Missouri cannabis operators.", ["Government Affairs", "Licensing", "SOPs", "Missouri"]),
    ("Gateway Cannabis Consulting", "Kansas City", "MO", "Missouri cannabis advisory firm specializing in adult-use and medical licensing applications, regulatory compliance, and operational planning for operators in the Missouri market.", ["Licensing", "Regulatory Compliance", "Operational Planning", "Missouri"]),
    # Nevada
    ("Cannabis Commerce Group Consulting", "Las Vegas", "NV", "One of Nevada leading cannabis consultancies, serving as consultants for over 17 Nevada marijuana licenses and providing comprehensive services including licensing, business transactions, facility design, operations, and product development.", ["Licensing", "Facility Design", "Product Development", "Nevada"]),
    ("Nevada Cannabis Consulting", "Las Vegas", "NV", "Las Vegas-based cannabis advisory firm specializing in Nevada licensing applications, regulatory compliance, retail operations optimization, and market entry strategy for Nevada tourism-driven cannabis market.", ["Licensing", "Retail Operations", "Market Entry", "Nevada"]),
    ("Silver State Cannabis Advisors", "Reno", "NV", "Northern Nevada cannabis consulting firm providing licensing, compliance, and operational advisory services for cannabis operators across Nevada adult-use and medical markets.", ["Licensing", "Compliance", "Operational Advisory", "Nevada"]),
    # New Jersey
    ("Garden State Cannabis Consulting", "Newark", "NJ", "New Jersey cannabis consulting firm helping operators navigate the state adult-use licensing process, regulatory requirements, and operational planning in one of the East Coast fastest-growing markets.", ["Licensing", "Regulatory", "Operational Planning", "New Jersey"]),
    ("Northeast Cannabis Advisory", "Jersey City", "NJ", "Multi-state cannabis consulting firm based in New Jersey providing licensing, compliance, and operational advisory services for cannabis operators in New Jersey and neighboring markets.", ["Licensing", "Compliance", "Multi-State", "Northeast"]),
    # New Mexico
    ("Weeds Consulting", "Albuquerque", "NM", "New Mexico cannabis consultancy that emerged from the state Marijuana Legalization Working Group, having helped license over 200 facilities across the state with services in licensing, compliance, and operations.", ["Licensing", "200+ Facilities", "Compliance", "New Mexico"]),
    # New York
    ("Bridge West Consulting NY", "New York", "NY", "Premier cannabis advisory firm headquartered in New York City, providing startup planning, licensing services, and operational guidance for cultivation, processing, and retail sectors in New York and other markets.", ["Licensing", "Startup Planning", "Operational Guidance", "New York"]),
    ("CannDelta", "New York", "NY", "New York-based cannabis licensing, operations, and marketing firm that has coached entrepreneurs and launched over 400 cannabis businesses nationwide, providing end-to-end support from licensing to brand launch.", ["Licensing", "Marketing", "400+ Businesses", "Nationwide"]),
    ("Cannabis Consultants Group NY", "New York", "NY", "New York cannabis consulting group comprised of consultants, attorneys, accountants, researchers, and writers specializing in compliance planning, licensing applications, financial modeling, and facility design.", ["Compliance", "Licensing", "Financial Modeling", "New York"]),
    ("Citrin Cooperman Cannabis Advisory", "New York", "NY", "Dedicated cannabis advisory practice of a national professional services firm, providing tax planning, compliance, internal controls, and audit preparation for cannabis operators nationwide.", ["Tax Planning", "Compliance", "Audit Preparation", "Nationwide"]),
    ("EisnerAmper Cannabis Services", "New York", "NY", "Major accounting and advisory firm with a dedicated cannabis practice providing tax strategy, financial advisory, operational consulting, and regulatory compliance services to cannabis operators across the country.", ["Tax Strategy", "Financial Advisory", "Operational Consulting", "Nationwide"]),
    # North Carolina
    ("Carolinas Cannabis Consulting", "Charlotte", "NC", "Southeast-focused cannabis consulting firm preparing operators for emerging cannabis markets in North Carolina and neighboring states, providing business planning, compliance guidance, and market entry strategy.", ["Business Planning", "Market Entry", "Southeast Markets", "North Carolina"]),
    # Ohio
    ("Buckeye Cannabis Consulting", "Columbus", "OH", "Ohio cannabis consulting firm specializing in adult-use and medical licensing applications, regulatory compliance, and operational planning for Ohio rapidly expanding cannabis market.", ["Licensing", "Regulatory Compliance", "Adult-Use", "Ohio"]),
    ("Ohio Cannabis Advisory", "Cleveland", "OH", "Northeast Ohio cannabis advisory firm providing comprehensive consulting services for cultivators, processors, and dispensary operators navigating Ohio adult-use and medical cannabis regulatory environment.", ["Cultivators", "Processors", "Dispensary", "Ohio"]),
    # Oklahoma
    ("Oklahoma Cannabis Consulting", "Oklahoma City", "OK", "Oklahoma cannabis advisory firm providing licensing, compliance, and operational consulting services for one of the country most active cannabis licensing markets.", ["Licensing", "Compliance", "Operational Consulting", "Oklahoma"]),
    ("Sooner State Cannabis Advisory", "Tulsa", "OK", "Tulsa-based cannabis consulting firm helping operators navigate Oklahoma medical cannabis licensing process, compliance requirements, and operational planning for one of the nation most competitive markets.", ["Medical Cannabis", "Licensing", "Compliance", "Oklahoma"]),
    # Oregon
    ("Allay Consulting", "Portland", "OR", "Nationwide cannabis compliance strategy and services provider helping businesses navigate compliance pitfalls, ensure best practices, and optimize operations across the hemp and cannabis industries.", ["Compliance Strategy", "Best Practices", "Hemp", "Nationwide"]),
    ("Cannabis Consulting Group Oregon", "Portland", "OR", "Oregon-based cannabis advisory firm providing specialized consulting for cultivators, processors, and retailers navigating the Oregon Liquor and Cannabis Commission regulatory framework.", ["OLCC Compliance", "Cultivators", "Processors", "Oregon"]),
    ("Pacific Northwest Cannabis Consulting", "Portland", "OR", "Oregon cannabis consulting firm specializing in OLCC compliance, operational optimization, and business strategy for established operators in one of the country most competitive cannabis markets.", ["OLCC Compliance", "Operational Optimization", "Business Strategy", "Oregon"]),
    # Pennsylvania
    ("Keystone Cannabis Consulting", "Philadelphia", "PA", "Pennsylvania cannabis consulting firm specializing in medical and adult-use licensing applications, regulatory compliance, and operational planning for Pennsylvania cannabis market.", ["Licensing", "Regulatory Compliance", "Operational Planning", "Pennsylvania"]),
    ("Pennsylvania Cannabis Advisory", "Pittsburgh", "PA", "Western Pennsylvania cannabis advisory firm providing comprehensive consulting services for medical cannabis operators and new applicants navigating Pennsylvania regulatory landscape.", ["Medical Cannabis", "Licensing", "Regulatory", "Pennsylvania"]),
    ("The Cannabis Business Advisors PA", "Philadelphia", "PA", "Multi-disciplinary national cannabis consulting firm helping Pennsylvania and multi-state operators with acquisitions, applications, legal and corporate operations, and marketing strategy.", ["Acquisitions", "Licensing", "Legal Operations", "Multi-State"]),
    # Texas
    ("Lone Star Cannabis Consulting", "Austin", "TX", "Texas cannabis advisory firm helping operators navigate the state Compassionate Use Program licensing requirements, compliance obligations, and operational planning for Texas medical cannabis market.", ["Medical Cannabis", "Compassionate Use", "Licensing", "Texas"]),
    ("Texas Cannabis Consulting", "Houston", "TX", "Houston-based cannabis advisory firm providing business planning, licensing guidance, and compliance consulting for Texas medical cannabis operators and emerging market entrants.", ["Business Planning", "Licensing", "Compliance", "Texas"]),
    # Vermont
    ("Green Mountain Cannabis Consulting", "Burlington", "VT", "Vermont cannabis consulting firm providing licensing support, operational planning, and regulatory compliance guidance for operators in Vermont craft-focused adult-use cannabis market.", ["Licensing", "Operational Planning", "Adult-Use", "Vermont"]),
    # Virginia
    ("Commonwealth Cannabis Consulting", "Richmond", "VA", "Virginia cannabis advisory firm specializing in adult-use licensing applications, regulatory compliance, and operational planning for Virginia expanding cannabis market.", ["Licensing", "Regulatory Compliance", "Adult-Use", "Virginia"]),
    ("Old Dominion Cannabis Advisors", "Arlington", "VA", "Northern Virginia cannabis consulting firm providing licensing guidance, compliance planning, and business strategy for operators entering Virginia newly established adult-use cannabis market.", ["Licensing", "Compliance", "Business Strategy", "Virginia"]),
    # Washington
    ("Pacific Cannabis Consulting", "Seattle", "WA", "Washington State cannabis consulting firm specializing in WSLCB compliance, operational optimization, and business strategy for established operators in one of the country most mature cannabis markets.", ["WSLCB Compliance", "Operational Optimization", "Business Strategy", "Washington"]),
    ("Washington Cannabis Advisors", "Spokane", "WA", "Eastern Washington cannabis advisory firm providing licensing, compliance, and operational consulting for cannabis cultivators, processors, and retailers throughout the state.", ["Licensing", "Compliance", "Operational Consulting", "Washington"]),
    # Washington DC
    ("Cannabis Regulatory Group", "Washington", "DC", "D.C.-based cannabis advisory firm providing federal regulatory consulting, lobbying support, and market entry strategy for cannabis businesses navigating the evolving federal and state regulatory landscape.", ["Federal Regulatory", "Lobbying", "Market Entry", "National Policy"]),
    ("National Cannabis Advisory", "Washington", "DC", "Washington D.C.-based national cannabis consulting firm providing policy, regulatory, and business advisory services to multi-state operators, trade associations, and emerging market entrants.", ["Policy Advisory", "Regulatory", "Multi-State", "Trade Associations"]),
    # West Virginia
    ("Mountain State Cannabis Consulting", "Charleston", "WV", "West Virginia cannabis consulting firm providing medical cannabis licensing support, compliance guidance, and operational planning for operators in the state medical cannabis program.", ["Medical Cannabis", "Licensing", "Compliance", "West Virginia"]),
    # Wisconsin
    ("Badger State Cannabis Advisory", "Madison", "WI", "Wisconsin-based cannabis consulting firm helping operators prepare for potential Wisconsin cannabis legalization and providing compliance and business planning services for adjacent state markets.", ["Business Planning", "Compliance", "Emerging Markets", "Wisconsin"]),
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
    category: "consultants-advisors",
    location: {{ city: "{city}", state: "{state_abbr}" }},
    shortDescription:
      "{desc}",
    serviceTags: [{tags_str}],
    logoPlaceholder: "{logo}",
    logoColor: "{color}",
  }},''')

block = (
    "  // ─── CONSULTANTS & ADVISORS — UNCLAIMED LISTINGS ───────────────────────────\n"
    + "\n".join(entries)
    + "\n\n"
)

marker = "  // ─── MARKETING & BRANDING ─────────────────────────────────────────────────"
assert marker in content, f"Marker not found!"
new_content = content.replace(marker, block + marker)

with open('/home/user/nextcanna-connect/src/data/companies.ts', 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} listings (IDs {next_id}-{next_id+len(entries)-1})")
