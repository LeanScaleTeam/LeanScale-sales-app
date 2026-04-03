const team = [
  {
    id: "izzy",
    name: "Izzy Navin",
    title: "GTM Architect",
    role: "Architect",
    location: "New York, NY",
    photo: "https://leanscale.team/wp-content/uploads/2024/03/Izzy_Side_Head_Shot_Website_c7becb29c8-1024x1024.jpg",
    headline: "The operator who's held every seat at the table — architect, analyst, engineer.",
    specialties: ["Salesforce", "HubSpot", "Data Analytics", "RevOps"],
    experience: [
      "4+ years of RevOps Experience",
      "Been an Architect, Analyst, & Engineer at LeanScale across 20+ customer engagements",
      "Salesforce Administration and Data Analytics",
      "HubSpot RevOps Certified"
    ],
    personal: "Enjoys playing pickleball, practicing yoga, and has a true passion for fashion."
  },
  {
    id: "kylee",
    name: "Kylee Wharton-Ward",
    title: "GTM Architect",
    role: "Architect",
    location: "Salt Lake City, UT",
    photo: "/images/team/kylee.png",
    headline: "Built GTM ops from scratch at a Series A startup. Now she does it faster.",
    specialties: ["Marketo", "Salesforce", "LeanData", "Salesloft", "Gong"],
    experience: [
      "5+ years of Marketing & Sales Operations experience",
      "Most recently scaled GTM Operations at Series A startup Vasion",
      "Expertise in GTM process optimization and MarTech",
      "Certifications in Marketo, Salesforce, LeanData, Salesloft, & Gong"
    ],
    personal: "Always has a knitting project going, loves to read, and loses all track of time on the pickleball court."
  },
  {
    id: "brian",
    name: "Brian Reeves",
    title: "Sr. GTM Architect",
    role: "Architect",
    location: "Phoenix, AZ",
    photo: "https://leanscale.team/wp-content/uploads/2025/08/image-40.png",
    headline: "9 years. 8+ Marketo builds. Spent 7 years inside one of the best-run marketing orgs in B2B.",
    specialties: ["Marketo", "HubSpot", "ZoomInfo", "Qualified", "Marketing Ops"],
    experience: [
      "9+ years of experience in Marketing Operations and Marketing Automation",
      "Spent 7 years at Keap being a key cog in Marketing Operations",
      "8+ years as a Marketo Expert",
      "HubSpot RevOps & Marketing Certified",
      "Additional Certifications in Qualified & ZoomInfo"
    ],
    personal: "Passionate about designing, implementing, and optimizing workflows and campaigns that drive lead generation, customer engagement, and conversion."
  },
  {
    id: "derek",
    name: "Derek Mogar",
    title: "GTM Architect",
    role: "Architect",
    location: "Phoenix, AZ",
    photo: "/images/team/derek.jpg",
    headline: "A decade on the sales floor gives you a sixth sense for what breaks in the CRM.",
    specialties: ["HubSpot", "Sales Ops", "Product Marketing", "RevOps"],
    experience: [
      "3+ years of Revenue Operations leader experience",
      "10+ years of Sales Experience across multiple industries",
      "4+ years as a Product Marketer",
      "HubSpot Sales Hub Certified"
    ],
    personal: "Spends downtime coaching youth baseball and competing in national softball tournaments."
  },
  {
    id: "john",
    name: "John Attley",
    title: "Director, GTM Operations",
    role: "Architect",
    location: "Vancouver, BC",
    photo: "https://leanscale.team/wp-content/uploads/2024/12/John-Attley.jpg",
    headline: "Brings the strategic calm of a director to the urgency of a startup sprint.",
    specialties: ["GTM Strategy", "Sales Ops", "SaaS Operations", "Account Mgmt"],
    experience: [
      "6+ years of Operations Experience",
      "Nearly a decade of Sales & Account Management experience",
      "GTM Experience across SaaS and Services",
      "5+ years of Startup Experience"
    ],
    personal: "Loves playing in Friday Night Adult Men's Soccer League & rooting for the Toronto Maple Leafs."
  },
  {
    id: "kavean",
    name: "Kavean Gobal",
    title: "GTM Engineer",
    role: "Engineer",
    location: "Toronto, ON",
    photo: "https://leanscale.team/wp-content/uploads/2024/12/Kavean-Gobal.jpeg",
    headline: "Triple-certified Salesforce admin who's seen a dozen high-growth orgs from the inside.",
    specialties: ["Salesforce", "LeanData", "RevOps", "B2B SaaS"],
    experience: [
      "3+ years in Revenue Operations at B2B startups",
      "Experience with over a dozen high growth Go-to-Markets",
      "Certified Salesforce (3x) & LeanData Admin"
    ],
    personal: "Fan of the NBA (more specifically the Raptors), and enjoys searching for the best food spots in Toronto."
  },
  {
    id: "eduardo",
    name: "Eduardo Anton",
    title: "GTM Engineer",
    role: "Engineer",
    location: "São Paulo, Brazil",
    photo: "https://leanscale.team/wp-content/uploads/2024/03/Eduardo_b850cbe675-1-1024x1024.jpg",
    headline: "15+ hyper-growth startups. Every one ran on systems he built.",
    specialties: ["Salesforce", "HubSpot", "GTM Systems", "SaaS Ops"],
    experience: [
      "6 years experience in Development and Analyst positions",
      "Certified Salesforce and HubSpot Administrator",
      "Worked with over 15 hyper-growth startups GTM Systems"
    ],
    personal: "Experienced Triathlete, and avid explorer and traveler of the world!"
  },
  {
    id: "raph",
    name: "Raphael Ribeiro",
    title: "GTM Engineer",
    role: "Engineer",
    location: "São Paulo, Brazil",
    photo: "https://leanscale.team/wp-content/uploads/2024/03/Raphael_e0a7351036-1024x1024.jpeg",
    headline: "15 years turning complex requirements into clean, working systems — without shortcuts.",
    specialties: ["Business Analysis", "Systems Architecture", "RevOps", "PM"],
    experience: [
      "15 years of Business and Systems Analysis",
      "2 years as a PM",
      "1 year of Engineering across B2B SaaS"
    ],
    personal: "Fan of sports and new technology. Completed 1 Half Iron Man, 4 Sprint Triathlons and a few dozen street races."
  },
  {
    id: "rodolfo",
    name: "Rodolfo Flores da Silva",
    title: "GTM Engineer",
    role: "Engineer",
    location: "São Paulo, Brazil",
    photo: "https://leanscale.team/wp-content/uploads/2024/03/Rodolfo_3f2e22bdc1-1024x1024.jpeg",
    headline: "12 years debugging the systems others built — and doing it better the second time.",
    specialties: ["Salesforce", "HubSpot", "Systems Analysis", "Development"],
    experience: [
      "12 years of experience in support, development, and systems analysis",
      "Salesforce Certified Administrator",
      "HubSpot Sales Software and Sales Hub Software Certified"
    ],
    personal: "Passionate about reading and games."
  },
  {
    id: "solange",
    name: "Solange Sonaglio",
    title: "GTM Engineer",
    role: "Engineer",
    location: "Florianópolis, Brazil",
    photo: "https://leanscale.team/wp-content/uploads/2025/08/T02E3D7G7EF-U093P9LB075-6e92e147553f-512.jpeg",
    headline: "Scrum master, product owner, and data analyst — she brings all three lenses to every project.",
    specialties: ["Product Ops", "Data Observability", "Scrum", "Systems Analysis"],
    experience: [
      "15+ years in SaaS and development",
      "Experience as Product Owner, Systems Analyst, Scrum Master, and Data Observability Analyst",
      "Proven track record implementing scalable solutions across diverse systems"
    ],
    personal: "Enjoys traveling the world and experiencing new cultures."
  },
  {
    id: "christopher",
    name: "Christopher Mardian",
    title: "GTM Engineer",
    role: "Engineer",
    location: "Los Angeles, CA",
    photo: "https://leanscale.team/wp-content/uploads/2024/03/Christopher_Side_Head_Shot_Website_e9fd1f6e5f-1024x1024.jpg",
    headline: "Started in Customer Success. That's exactly why your post-sale systems will actually work.",
    specialties: ["Salesforce", "RevOps", "Customer Success", "Revenue Ops"],
    experience: [
      "10 years of Customer Success and Analysis roles across technology verticals",
      "5 years Revenue Operations Experience",
      "3 years Salesforce Administrator and Revenue Operations"
    ],
    personal: "Does not like hot fruit."
  },
  {
    id: "diego",
    name: "Diego Carvalho",
    title: "GTM Engineer",
    role: "Engineer",
    location: "São Paulo, Brazil",
    photo: "/images/team/diego.png",
    headline: "Four Salesforce certifications and an IronMan on the horizon. He finishes what he starts.",
    specialties: ["Salesforce", "Project Management", "CRM Architecture"],
    experience: [
      "Experienced Salesforce consultant with over 8 years of experience",
      "Extensive expertise in project management",
      "Holder of 4 Salesforce (SFDC) certifications"
    ],
    personal: "Training for his first IronMan!"
  },
];

export default team;
