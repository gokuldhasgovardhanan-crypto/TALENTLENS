"""
Comprehensive canonical skill dictionary & taxonomy for TalentLens.
Compatible with ESCO / O*NET concepts with local fuzzy normalization.
"""

CANONICAL_SKILLS = [
    # Data & Analytics
    {"name": "SQL", "canonical_name": "SQL", "category": "Data & Analytics", "cluster": "Databases & Querying", "description": "Relational database querying, aggregations, joins, and data extraction."},
    {"name": "Python", "canonical_name": "Python", "category": "Technical", "cluster": "Programming Languages", "description": "General purpose programming for data manipulation, backend scripting, and machine learning."},
    {"name": "Power BI", "canonical_name": "Power BI", "category": "Data & Analytics", "cluster": "Business Intelligence", "description": "Interactive data visualization, DAX calculations, and executive BI reporting."},
    {"name": "Tableau", "canonical_name": "Tableau", "category": "Data & Analytics", "cluster": "Business Intelligence", "description": "Visual analytics dashboarding, storytelling, and ad-hoc data discovery."},
    {"name": "Data Analysis", "canonical_name": "Data Analysis", "category": "Data & Analytics", "cluster": "Analytical Thinking", "description": "Synthesizing trends, cohorts, operational metrics, and hypothesis validation."},
    {"name": "Statistics", "canonical_name": "Statistics", "category": "Data & Analytics", "cluster": "Mathematics & Stats", "description": "Descriptive and inferential statistics, probability distributions, A/B testing."},
    {"name": "Machine Learning", "canonical_name": "Machine Learning", "category": "Technical", "cluster": "AI & Data Science", "description": "Supervised/unsupervised algorithms, classification, regression, model evaluation."},
    {"name": "Pandas", "canonical_name": "Pandas", "category": "Data & Analytics", "cluster": "Data Manipulation", "description": "Python data frame library for wrangling, filtering, and time-series indexing."},
    {"name": "ETL Pipelines", "canonical_name": "ETL Pipelines", "category": "Engineering", "cluster": "Data Engineering", "description": "Extract, transform, and load workflows for structured data warehouses."},
    {"name": "Data Warehousing", "canonical_name": "Data Warehousing", "category": "Engineering", "cluster": "Data Engineering", "description": "Snowflake, BigQuery, dimensional modeling, and OLAP star schemas."},
    {"name": "Data Visualization", "canonical_name": "Data Visualization", "category": "Data & Analytics", "cluster": "Business Intelligence", "description": "Communicating insights visually via charts, dashboards, and storytelling."},

    # Software Engineering & Web
    {"name": "JavaScript", "canonical_name": "JavaScript", "category": "Technical", "cluster": "Web Development", "description": "Modern ECMAScript client-side and server-side web scripting."},
    {"name": "TypeScript", "canonical_name": "TypeScript", "category": "Technical", "cluster": "Web Development", "description": "Typed superset of JavaScript for scalable frontend and enterprise systems."},
    {"name": "React", "canonical_name": "React", "category": "Technical", "cluster": "Web Development", "description": "Component-based declarative UI library for modern web applications."},
    {"name": "Node.js", "canonical_name": "Node.js", "category": "Technical", "cluster": "Backend Development", "description": "Asynchronous event-driven server runtime environment."},
    {"name": "FastAPI", "canonical_name": "FastAPI", "category": "Technical", "cluster": "Backend Development", "description": "High-performance Python ASGI web framework with automatic OpenAPI docs."},
    {"name": "REST APIs", "canonical_name": "REST APIs", "category": "Technical", "cluster": "Backend Development", "description": "Architecting HTTP API endpoints, JSON payloads, and authentication."},
    {"name": "Git", "canonical_name": "Git", "category": "Engineering", "cluster": "DevOps & Tooling", "description": "Distributed version control, branching strategies, and collaboration."},
    {"name": "Docker", "canonical_name": "Docker", "category": "Engineering", "cluster": "Cloud & DevOps", "description": "Containerization, Dockerfile recipes, and lightweight deployment packages."},
    {"name": "Kubernetes", "canonical_name": "Kubernetes", "category": "Engineering", "cluster": "Cloud & DevOps", "description": "Orchestration of containerized services and cluster scaling."},
    {"name": "Cloud Computing (AWS/GCP)", "canonical_name": "Cloud Computing", "category": "Engineering", "cluster": "Cloud & DevOps", "description": "Deploying scalable infrastructure on AWS, GCP, or Azure."},

    # Product, Operations & Support
    {"name": "Incident Management", "canonical_name": "Incident Management", "category": "Operations", "cluster": "Operations & Support", "description": "Triage, root-cause diagnostics, escalation handling, and post-mortem analysis."},
    {"name": "Customer Support", "canonical_name": "Customer Support", "category": "Operations", "cluster": "Operations & Support", "description": "Client troubleshooting, SLA adherence, and empathy-driven resolution."},
    {"name": "Troubleshooting", "canonical_name": "Troubleshooting", "category": "Operations", "cluster": "Operations & Support", "description": "Systematic issue diagnosis across network, logs, and application layers."},
    {"name": "Process Optimization", "canonical_name": "Process Optimization", "category": "Operations", "cluster": "Business Operations", "description": "Streamlining operational bottlenecks, SOP development, and Lean workflows."},
    {"name": "Workflow Automation", "canonical_name": "Workflow Automation", "category": "Operations", "cluster": "Business Operations", "description": "Automating manual spreadsheets and repetitive tasks using scripts and tools."},
    {"name": "Excel / Advanced Spreadsheets", "canonical_name": "Excel", "category": "Operations", "cluster": "Business Operations", "description": "VLOOKUP, INDEX/MATCH, Pivot Tables, financial modeling, and macros."},
    {"name": "Product Strategy", "canonical_name": "Product Strategy", "category": "Leadership", "cluster": "Product Management", "description": "Defining vision, roadmapping, MVP scoping, and user value metrics."},
    {"name": "Agile & Scrum", "canonical_name": "Agile & Scrum", "category": "Leadership", "cluster": "Project Management", "description": "Sprint planning, user story grooming, retrospectives, and Jira delivery."},

    # Soft Skills & Leadership
    {"name": "Stakeholder Communication", "canonical_name": "Stakeholder Communication", "category": "Soft Skills", "cluster": "Communication & Interpersonal", "description": "Executive briefing, cross-functional alignment, and active listening."},
    {"name": "Problem Solving", "canonical_name": "Problem Solving", "category": "Soft Skills", "cluster": "Cognitive Capabilities", "description": "Root-cause deduction, structured decision making, and creative problem solving."},
    {"name": "Critical Thinking", "canonical_name": "Critical Thinking", "category": "Soft Skills", "cluster": "Cognitive Capabilities", "description": "Objective analysis, bias evaluation, and nuanced synthesis."},
    {"name": "Team Leadership", "canonical_name": "Team Leadership", "category": "Leadership", "cluster": "Management", "description": "Mentoring, performance coaching, delegation, and talent empowerment."},
    {"name": "Cross-Functional Collaboration", "canonical_name": "Cross-Functional Collaboration", "category": "Soft Skills", "cluster": "Communication & Interpersonal", "description": "Bridging engineering, product, sales, and design teams."},
]

SKILL_ALIASES = {
    # SQL
    "sql": "SQL",
    "mysql": "SQL",
    "postgres": "SQL",
    "postgresql": "SQL",
    "sqlite": "SQL",
    "sql queries": "SQL",
    "tsql": "SQL",
    "plsql": "SQL",

    # Python
    "python": "Python",
    "python3": "Python",
    "python programming": "Python",
    "py": "Python",

    # Power BI
    "powerbi": "Power BI",
    "power bi": "Power BI",
    "pbi": "Power BI",
    "powerbi desktop": "Power BI",
    "dax": "Power BI",
    "bi dashboard": "Power BI",
    "business intelligence dashboard": "Power BI",

    # Tableau
    "tableau": "Tableau",
    "tableau desktop": "Tableau",
    "tableau server": "Tableau",

    # Data Analysis
    "data analysis": "Data Analysis",
    "data analytics": "Data Analysis",
    "analytics": "Data Analysis",
    "quantitative analysis": "Data Analysis",
    "business analysis": "Data Analysis",

    # JavaScript / TypeScript
    "js": "JavaScript",
    "javascript": "JavaScript",
    "es6": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",

    # React
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "react native": "React",

    # Node
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",

    # Python Data
    "pandas": "Pandas",
    "numpy": "Data Analysis",
    "scipy": "Statistics",
    "statistics": "Statistics",
    "stats": "Statistics",
    "applied statistics": "Statistics",

    # ML
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "scikit-learn": "Machine Learning",
    "sklearn": "Machine Learning",
    "deep learning": "Machine Learning",

    # Incident / Support
    "incident management": "Incident Management",
    "incident response": "Incident Management",
    "crisis management": "Incident Management",
    "customer support": "Customer Support",
    "tech support": "Customer Support",
    "troubleshooting": "Troubleshooting",
    "debugging": "Troubleshooting",
    "issue diagnosis": "Troubleshooting",

    # Ops & Excel
    "process optimization": "Process Optimization",
    "lean": "Process Optimization",
    "process improvement": "Process Optimization",
    "workflow automation": "Workflow Automation",
    "excel": "Excel / Advanced Spreadsheets",
    "advanced excel": "Excel / Advanced Spreadsheets",
    "spreadsheets": "Excel / Advanced Spreadsheets",
    "google sheets": "Excel / Advanced Spreadsheets",

    # Soft Skills
    "communication": "Stakeholder Communication",
    "stakeholder communication": "Stakeholder Communication",
    "stakeholder management": "Stakeholder Communication",
    "problem solving": "Problem Solving",
    "analytical thinking": "Problem Solving",
    "team leadership": "Team Leadership",
    "leadership": "Team Leadership",
}
