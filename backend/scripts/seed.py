import sys
import os
from datetime import datetime, timedelta

# Add parent directory to sys.path so we can import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import engine, Base, SessionLocal
from app.models import (
    User, Skill, SkillAlias, ProfileSkill, SkillEvidence,
    JobRole, RoleSkill, Project, LearningResource, RecommendationFeedback
)
from app.taxonomy import CANONICAL_SKILLS, SKILL_ALIASES

sys.stdout.reconfigure(encoding='utf-8')

def seed_database():
    print("[*] Recreating database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("[+] Seeding Canonical Skills...")
    skill_objects = {}
    for s_data in CANONICAL_SKILLS:
        skill = Skill(
            name=s_data["name"],
            canonical_name=s_data["canonical_name"],
            category=s_data["category"],
            cluster=s_data["cluster"],
            description=s_data["description"]
        )
        db.add(skill)
        skill_objects[s_data["canonical_name"]] = skill

    db.commit()

    print("[+] Seeding Skill Aliases...")
    for alias, canon in SKILL_ALIASES.items():
        db.add(SkillAlias(alias=alias, canonical_name=canon))
    db.commit()

    # Refresh skills to have IDs
    for s_name in skill_objects:
        db.refresh(skill_objects[s_name])

    print("[+] Seeding Benchmark Job Roles...")
    roles_data = [
        {
            "title": "Data Analyst",
            "department": "Data & Analytics",
            "level": "Mid-Level",
            "min_experience_years": 2.0,
            "salary_range": "$85,000 - $115,000",
            "open_positions": 4,
            "location": "Bangalore / Hybrid",
            "work_mode": "Hybrid",
            "description": "Extract insights from customer behavior, build executive dashboards in Power BI, and write high-efficiency SQL queries.",
            "skills": [
                ("SQL", "required", "Advanced", 1.8),
                ("Data Analysis", "required", "Advanced", 1.6),
                ("Power BI", "required", "Intermediate", 1.4),
                ("Python", "preferred", "Intermediate", 1.2),
                ("Statistics", "preferred", "Intermediate", 1.0),
                ("Stakeholder Communication", "required", "Intermediate", 1.0)
            ]
        },
        {
            "title": "Business Analyst",
            "department": "Operations & Strategy",
            "level": "Mid-Level",
            "min_experience_years": 2.5,
            "salary_range": "$90,000 - $120,000",
            "open_positions": 2,
            "location": "Bangalore / Hybrid",
            "work_mode": "Hybrid",
            "description": "Analyze operational workflows, optimize business bottlenecks, design requirements, and bridge technical and business teams.",
            "skills": [
                ("Process Optimization", "required", "Advanced", 1.5),
                ("Data Analysis", "required", "Intermediate", 1.4),
                ("Excel", "required", "Advanced", 1.3),
                ("Stakeholder Communication", "required", "Advanced", 1.4),
                ("Workflow Automation", "preferred", "Intermediate", 1.1)
            ]
        },
        {
            "title": "Junior Machine Learning Engineer",
            "department": "Data & Analytics",
            "level": "Entry-Level",
            "min_experience_years": 0.5,
            "salary_range": "$75,000 - $100,000",
            "open_positions": 3,
            "location": "Bangalore / Remote",
            "work_mode": "Remote",
            "description": "Develop supervised ML models, conduct exploratory data analysis in Pandas, and deploy inference APIs.",
            "skills": [
                ("Python", "required", "Advanced", 1.8),
                ("Machine Learning", "required", "Intermediate", 1.6),
                ("Data Analysis", "required", "Intermediate", 1.3),
                ("Pandas", "required", "Intermediate", 1.2),
                ("Problem Solving", "required", "Intermediate", 1.1)
            ]
        },
        {
            "title": "Full Stack Software Engineer",
            "department": "Engineering",
            "level": "Mid-Level",
            "min_experience_years": 3.0,
            "salary_range": "$100,000 - $135,000",
            "open_positions": 5,
            "location": "Bangalore / Hybrid",
            "work_mode": "Hybrid",
            "description": "Build responsive React frontends and scalable FastAPI / Node.js backend services.",
            "skills": [
                ("React", "required", "Advanced", 1.5),
                ("TypeScript", "required", "Intermediate", 1.4),
                ("Python", "required", "Intermediate", 1.2),
                ("REST APIs", "required", "Advanced", 1.4),
                ("Git", "required", "Intermediate", 1.0)
            ]
        },
        {
            "title": "Operations & Incident Lead",
            "department": "Operations",
            "level": "Senior",
            "min_experience_years": 4.0,
            "salary_range": "$95,000 - $125,000",
            "open_positions": 2,
            "location": "Bangalore / Onsite",
            "work_mode": "Onsite",
            "description": "Lead incident triage teams, ensure 99.9% SLA adherence, and conduct executive post-mortems.",
            "skills": [
                ("Incident Management", "required", "Expert", 1.8),
                ("Troubleshooting", "required", "Advanced", 1.5),
                ("Stakeholder Communication", "required", "Advanced", 1.5),
                ("Process Optimization", "preferred", "Intermediate", 1.2)
            ]
        },
        {
            "title": "Cloud DevOps Engineer",
            "department": "Engineering",
            "level": "Mid-Level",
            "min_experience_years": 2.5,
            "salary_range": "$105,000 - $140,000",
            "open_positions": 2,
            "location": "Remote",
            "work_mode": "Remote",
            "description": "Automate CI/CD pipelines, containerize microservices in Docker, and manage cloud infrastructure.",
            "skills": [
                ("Docker", "required", "Advanced", 1.6),
                ("Cloud Computing", "required", "Intermediate", 1.5),
                ("Git", "required", "Intermediate", 1.2),
                ("Python", "preferred", "Intermediate", 1.1)
            ]
        }
    ]

    role_objects = {}
    for r_data in roles_data:
        role = JobRole(
            title=r_data["title"],
            department=r_data["department"],
            level=r_data["level"],
            min_experience_years=r_data["min_experience_years"],
            salary_range=r_data["salary_range"],
            open_positions=r_data["open_positions"],
            location=r_data["location"],
            work_mode=r_data["work_mode"],
            description=r_data["description"]
        )
        db.add(role)
        db.commit()
        db.refresh(role)
        role_objects[role.title] = role

        for s_canon, imp, prof, w in r_data["skills"]:
            if s_canon in skill_objects:
                db.add(RoleSkill(
                    role_id=role.id,
                    skill_id=skill_objects[s_canon].id,
                    importance=imp,
                    min_proficiency=prof,
                    weight=w
                ))
    db.commit()

    print("[+] Seeding Learning Resources & Projects...")
    resources = [
        ("Python Analytics & Pandas Masterclass", "Python", "DataCamp", "course", "Beginner", 15, 18, "Master pandas, exploratory data analysis, and scripting."),
        ("Applied Statistics & A/B Testing for Analysts", "Statistics", "Internal Academy", "course", "Intermediate", 20, 16, "Hypothesis testing, probability, and business metric interpretation."),
        ("Advanced SQL Query Optimization & Window Functions", "SQL", "TalentLens Academy", "practice", "Advanced", 10, 15, "Subqueries, CTEs, and enterprise performance tuning."),
        ("Executive Power BI Dashboards & DAX", "Power BI", "Microsoft Learn", "certification", "Intermediate", 18, 15, "Data modeling, relationships, DAX measures, and visual hierarchy."),
        ("Practical Machine Learning with Scikit-Learn", "Machine Learning", "Coursera", "course", "Intermediate", 25, 20, "Supervised classification, regression, and cross-validation."),
        ("Business Process Modeling & Lean Operations", "Process Optimization", "Internal Gig", "internal_gig", "Intermediate", 30, 22, "Streamlining sprint workflows and cross-department handoffs."),
        ("Production Docker & Containerization", "Docker", "Linux Foundation", "certification", "Intermediate", 12, 14, "Containerizing web services and microservice recipes.")
    ]

    for title, s_canon, provider, r_type, diff, dur, impact, desc in resources:
        if s_canon in skill_objects:
            db.add(LearningResource(
                title=title,
                skill_id=skill_objects[s_canon].id,
                provider=provider,
                resource_type=r_type,
                difficulty=diff,
                duration_hours=dur,
                estimated_impact_pct=impact,
                description=desc
            ))
    db.commit()

    print("[+] Seeding Key Demo Personas...")

    # PERSONA 1: Priya Sharma (Support Engineer -> Hidden Data Analyst)
    priya = User(
        name="Priya Sharma",
        email="priya.sharma@talentlens.io",
        avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        user_type="employee",
        current_title="Support Engineer",
        department="Operations",
        experience_years=2.5,
        career_stage="Mid-Level",
        bio="Technical support engineer resolving complex enterprise customer queries. Discovered deep passion for data analysis while building incident telemetry dashboards.",
        completeness_pct=92,
        location="Bangalore, India",
        target_role_id=role_objects["Data Analyst"].id
    )
    db.add(priya)
    db.commit()
    db.refresh(priya)

    # Priya's Projects
    p_incident = Project(
        user_id=priya.id,
        title="Incident Telemetry & SLA Root Cause Analytics",
        description="Analyzed 10,000+ support tickets using custom SQL queries and created an automated Power BI dashboard identifying top system latency bottlenecks.",
        role_performed="Lead Analyst / Support Engineer",
        tech_stack="SQL, Power BI, Excel",
        outcome="Reduced recurring customer issue recurrence by 28% and cut triage latency by 35%."
    )
    db.add(p_incident)
    db.commit()

    # Priya's Skills & Evidence
    priya_skills = [
        ("SQL", "Advanced", 92, False, "verified", "Developed complex SQL aggregations to analyze customer incidents across 10k+ database logs.", "Incident Telemetry Project"),
        ("Power BI", "Intermediate", 88, False, "verified", "Designed interactive dashboards with DAX measures for executive support reviews.", "Incident Telemetry Project"),
        ("Customer Support", "Expert", 95, False, "verified", "Managed critical Tier-3 enterprise ticket resolutions maintaining 98% CSAT.", "Work History"),
        ("Troubleshooting", "Advanced", 90, False, "verified", "Diagnosed cross-layer system bugs and network timeout anomalies.", "Work History"),
        ("Data Analysis", "Intermediate", 86, True, "inferred", "AI Inferred: Discovered root-cause analytical synthesis directly from ticket metric queries.", "AI Inference Engine"),
        ("Stakeholder Communication", "Intermediate", 82, True, "inferred", "AI Inferred: Presenting incident post-mortems and SLA metrics to engineering management.", "AI Inference Engine")
    ]

    for s_canon, prof, conf, inferred, status, ev_desc, ev_title in priya_skills:
        if s_canon in skill_objects:
            ps = ProfileSkill(
                user_id=priya.id,
                skill_id=skill_objects[s_canon].id,
                proficiency=prof,
                confidence_pct=conf,
                is_inferred=inferred,
                verification_status=status,
                recency_months=2,
                notes="Verified active evidence"
            )
            db.add(ps)
            db.commit()
            db.refresh(ps)

            db.add(SkillEvidence(
                profile_skill_id=ps.id,
                source_type="project" if "Project" in ev_title else "work_history",
                title=ev_title,
                description=ev_desc,
                confidence_pct=conf,
                recency_label="2 months ago"
            ))
    db.commit()

    # PERSONA 2: Arjun Kumar (Fresher / Student -> Machine Learning / Data)
    arjun = User(
        name="Arjun Kumar",
        email="arjun.kumar@talentlens.io",
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        user_type="candidate",
        current_title="Final-Year CS Student",
        department="Engineering",
        experience_years=0.5,
        career_stage="Student/Fresher",
        bio="Final-year Computer Science undergraduate with hands-on capstone projects in predictive modeling, exploratory data analysis, and REST APIs.",
        completeness_pct=88,
        location="Chennai, India",
        target_role_id=role_objects["Junior Machine Learning Engineer"].id
    )
    db.add(arjun)
    db.commit()
    db.refresh(arjun)

    # Arjun's Projects
    p_churn = Project(
        user_id=arjun.id,
        title="Customer Churn Prediction & ML Pipeline",
        description="Trained Random Forest and Gradient Boosting models on telecom dataset; built Flask inference API.",
        role_performed="Lead Developer",
        tech_stack="Python, Scikit-Learn, Pandas, REST APIs",
        outcome="Achieved 89% ROC-AUC on holdout validation test set."
    )
    p_weather = Project(
        user_id=arjun.id,
        title="Real-time Weather Intelligence API",
        description="Built automated pipeline fetching global weather feeds and visualizing atmospheric anomalies.",
        role_performed="Full Stack Contributor",
        tech_stack="Python, FastAPI, Pandas",
        outcome="Processed 50k API calls with sub-100ms response time."
    )
    db.add_all([p_churn, p_weather])
    db.commit()

    arjun_skills = [
        ("Python", "Advanced", 94, False, "verified", "Wrote end-to-end data pipelines and API services in Python.", "Customer Churn Project"),
        ("Machine Learning", "Intermediate", 85, False, "verified", "Trained classification algorithms with hyperparameter tuning.", "Customer Churn Project"),
        ("Pandas", "Intermediate", 89, False, "verified", "Data cleaning, feature engineering, and one-hot encoding.", "Customer Churn Project"),
        ("Data Analysis", "Intermediate", 84, True, "inferred", "AI Inferred: Demonstrated structured exploratory analysis during feature preparation.", "AI Inference Engine"),
        ("Problem Solving", "Advanced", 88, True, "inferred", "AI Inferred: Algorithmic decomposition and model evaluation heuristics.", "AI Inference Engine")
    ]

    for s_canon, prof, conf, inferred, status, ev_desc, ev_title in arjun_skills:
        if s_canon in skill_objects:
            ps = ProfileSkill(
                user_id=arjun.id,
                skill_id=skill_objects[s_canon].id,
                proficiency=prof,
                confidence_pct=conf,
                is_inferred=inferred,
                verification_status=status,
                recency_months=1,
                notes="Verified project evidence"
            )
            db.add(ps)
            db.commit()
            db.refresh(ps)

            db.add(SkillEvidence(
                profile_skill_id=ps.id,
                source_type="project",
                title=ev_title,
                description=ev_desc,
                confidence_pct=conf,
                recency_label="1 month ago"
            ))
    db.commit()

    # PERSONA 3: Rahul Menon (Operations Executive -> Business Analyst)
    rahul = User(
        name="Rahul Menon",
        email="rahul.menon@talentlens.io",
        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        user_type="employee",
        current_title="Operations Executive",
        department="Operations",
        experience_years=3.2,
        career_stage="Mid-Level",
        bio="Operations specialist focusing on process optimization, spreadsheet automation, and cross-functional team coordination.",
        completeness_pct=90,
        location="Mumbai, India",
        target_role_id=role_objects["Business Analyst"].id
    )
    db.add(rahul)
    db.commit()
    db.refresh(rahul)

    rahul_skills = [
        ("Excel", "Expert", 96, False, "verified", "Constructed automated multi-tab financial and supply chain reconciliation sheets.", "Work History"),
        ("Process Optimization", "Advanced", 91, False, "verified", "Designed Lean standard operating procedures cutting procurement lag.", "Work History"),
        ("Stakeholder Communication", "Advanced", 88, False, "verified", "Led weekly executive operational reviews with senior directors.", "Work History"),
        ("Data Analysis", "Intermediate", 80, True, "inferred", "AI Inferred: Interpreting complex supply-chain metrics and trend forecasting.", "AI Inference Engine"),
        ("Workflow Automation", "Intermediate", 82, True, "inferred", "AI Inferred: Macro-driven repetitive task reduction across ops queue.", "AI Inference Engine")
    ]

    for s_canon, prof, conf, inferred, status, ev_desc, ev_title in rahul_skills:
        if s_canon in skill_objects:
            ps = ProfileSkill(
                user_id=rahul.id,
                skill_id=skill_objects[s_canon].id,
                proficiency=prof,
                confidence_pct=conf,
                is_inferred=inferred,
                verification_status=status,
                recency_months=3,
                notes="Operational metrics"
            )
            db.add(ps)
            db.commit()
            db.refresh(ps)
            db.add(SkillEvidence(
                profile_skill_id=ps.id,
                source_type="work_history",
                title=ev_title,
                description=ev_desc,
                confidence_pct=conf,
                recency_label="3 months ago"
            ))
    db.commit()

    # PERSONA 4: Ananya HR (Workforce Recruiter / HR Lead)
    ananya = User(
        name="Ananya HR",
        email="ananya.hr@talentlens.io",
        avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        user_type="hr_admin",
        current_title="Director of People & Talent Intelligence",
        department="People Operations",
        experience_years=8.0,
        career_stage="Lead",
        bio="Workforce strategist leveraging AI skill graphs to unlock internal mobility, mitigate skill risks, and build agile high-performing teams.",
        completeness_pct=100,
        location="Bangalore, India",
        target_role_id=None
    )
    db.add(ananya)
    db.commit()

    print("[+] Generating 30+ Synthetic Employee Ecosystem...")
    names = [
        ("Siddharth Patel", "Software Engineer", "Engineering", 3.0),
        ("Meera Krishnan", "QA Automation Engineer", "Engineering", 2.0),
        ("Kavita Iyer", "Customer Success Specialist", "Sales & Support", 2.2),
        ("Vikram Verma", "DevOps Specialist", "Engineering", 4.0),
        ("Rohan Joshi", "Product Associate", "Product", 2.0),
        ("Sneha Deshmukh", "Technical Writer", "Operations", 1.8),
        ("Aditya Rao", "Frontend Developer", "Engineering", 2.5),
        ("Divya Nambiar", "Data Coordinator", "Data & Analytics", 1.5),
        ("Tanvi Bhat", "Operations Associate", "Operations", 2.1),
        ("Karan Kapoor", "Support Lead", "Sales & Support", 4.5),
        ("Neha Gupta", "Junior Developer", "Engineering", 1.0),
        ("Amitabh Saxena", "Security Analyst", "Engineering", 3.5),
        ("Pooja Nair", "Sales Enablement Specialist", "Sales & Support", 2.8),
        ("Naveen Reddy", "Cloud Infrastructure Eng", "Engineering", 3.2),
        ("Deepak Malhotra", "Business Operations", "Operations", 3.0),
        ("Shweta Sen", "UI/UX Designer", "Product", 3.5),
        ("Varun Singhal", "Data Engineer", "Data & Analytics", 3.0),
        ("Anjali Pillai", "Scrum Master", "Engineering", 4.2),
        ("Ramesh Chandran", "IT Support Specialist", "Operations", 2.5),
        ("Manish Tiwari", "Operations Analyst", "Operations", 2.0),
        ("Preeti Agarwal", "Content Strategist", "Product", 2.4),
        ("Alok Pandey", "Backend Developer", "Engineering", 3.1),
        ("Geeta Sundaram", "Quality Analyst", "Engineering", 2.2),
        ("Harish Pillai", "Product Specialist", "Product", 2.8),
        ("Nisha Thomas", "Support Engineer", "Sales & Support", 2.0)
    ]

    for name, title, dept, exp in names:
        u = User(
            name=name,
            email=f"{name.lower().replace(' ', '.')}@talentlens.io",
            avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={name.replace(' ', '')}",
            user_type="employee",
            current_title=title,
            department=dept,
            experience_years=exp,
            career_stage="Mid-Level" if exp >= 2 else "Early Career",
            bio=f"Demonstrated track record in {dept} with active contributions to core team deliverables.",
            completeness_pct=85,
            location="Bangalore, India",
            target_role_id=role_objects["Data Analyst"].id if "Operations" in dept or "Support" in dept else role_objects["Full Stack Software Engineer"].id
        )
        db.add(u)
        db.commit()
        db.refresh(u)

        # Assign 3-4 skills
        sample_skills = ["SQL", "Python", "Excel", "Incident Management", "Problem Solving", "React", "Docker", "Stakeholder Communication"]
        import random
        chosen = random.sample(sample_skills, 3)
        for s_canon in chosen:
            if s_canon in skill_objects:
                ps = ProfileSkill(
                    user_id=u.id,
                    skill_id=skill_objects[s_canon].id,
                    proficiency=random.choice(["Intermediate", "Advanced"]),
                    confidence_pct=random.randint(80, 94),
                    is_inferred=random.choice([False, True]),
                    verification_status="verified",
                    recency_months=random.randint(1, 6)
                )
                db.add(ps)
                db.commit()
                db.refresh(ps)
                db.add(SkillEvidence(
                    profile_skill_id=ps.id,
                    source_type="work_history",
                    title="Project Contributions",
                    description=f"Demonstrated execution in {s_canon} for {dept} deliverables.",
                    confidence_pct=ps.confidence_pct,
                    recency_label="3 months ago"
                ))

    db.commit()
    db.close()
    print("[SUCCESS] TalentLens Database successfully seeded with rich synthetic talent ecosystem!")

if __name__ == "__main__":
    seed_database()
