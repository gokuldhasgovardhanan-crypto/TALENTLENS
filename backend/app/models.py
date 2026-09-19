from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    avatar = Column(String(255), nullable=True)
    user_type = Column(String(50), default="job_seeker") # candidate/student, job_seeker, employee, hr_admin
    current_title = Column(String(100), default="")
    department = Column(String(100), default="Engineering")
    experience_years = Column(Float, default=0.0)
    career_stage = Column(String(50), default="Mid-Level") # Student/Fresher, Early Career, Mid-Level, Senior, Lead
    bio = Column(Text, default="")
    completeness_pct = Column(Integer, default=85)
    location = Column(String(100), default="Bangalore, India")
    target_role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    skills = relationship("ProfileSkill", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("CareerRoadmap", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("RecommendationFeedback", back_populates="user", cascade="all, delete-orphan")
    simulations = relationship("WhatIfSimulation", back_populates="user", cascade="all, delete-orphan")
    target_role = relationship("JobRole", foreign_keys=[target_role_id])


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    canonical_name = Column(String(100), index=True, nullable=False)
    category = Column(String(50), index=True, default="Technical") # Technical, Data & Analytics, Engineering, Soft Skills, Leadership, Operations
    cluster = Column(String(50), default="General") # e.g. Data Science, Web Dev, Cloud, Business Intelligence
    description = Column(Text, default="")


class SkillAlias(Base):
    __tablename__ = "skill_aliases"

    id = Column(Integer, primary_key=True, index=True)
    alias = Column(String(100), unique=True, index=True, nullable=False)
    canonical_name = Column(String(100), index=True, nullable=False)


class ProfileSkill(Base):
    __tablename__ = "profile_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False, index=True)
    proficiency = Column(String(30), default="Intermediate") # Beginner, Intermediate, Advanced, Expert
    confidence_pct = Column(Integer, default=85)
    is_inferred = Column(Boolean, default=False)
    verification_status = Column(String(30), default="verified") # verified, inferred, confirmed, rejected
    recency_months = Column(Integer, default=3)
    notes = Column(Text, default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")
    evidence_items = relationship("SkillEvidence", back_populates="profile_skill", cascade="all, delete-orphan")


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(Integer, primary_key=True, index=True)
    profile_skill_id = Column(Integer, ForeignKey("profile_skills.id"), nullable=False, index=True)
    source_type = Column(String(50), default="project") # project, certification, ticket_resolution, course, work_history
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    url = Column(String(255), default="")
    confidence_pct = Column(Integer, default=85)
    recency_label = Column(String(50), default="3 months ago")
    date_recorded = Column(DateTime, default=datetime.utcnow)

    profile_skill = relationship("ProfileSkill", back_populates="evidence_items")


class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), unique=True, index=True, nullable=False)
    department = Column(String(100), index=True, default="Engineering")
    level = Column(String(50), default="Mid-Level") # Entry, Mid-Level, Senior, Lead
    description = Column(Text, default="")
    min_experience_years = Column(Float, default=2.0)
    salary_range = Column(String(50), default="$80,000 - $110,000")
    open_positions = Column(Integer, default=1)
    location = Column(String(100), default="Bangalore / Remote")
    work_mode = Column(String(30), default="Hybrid") # Remote, Hybrid, Onsite

    # Relationships
    required_skills = relationship("RoleSkill", back_populates="role", cascade="all, delete-orphan")


class RoleSkill(Base):
    __tablename__ = "role_skills"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False, index=True)
    importance = Column(String(30), default="required") # required, preferred, nice_to_have
    min_proficiency = Column(String(30), default="Intermediate")
    weight = Column(Float, default=1.0)

    role = relationship("JobRole", back_populates="required_skills")
    skill = relationship("Skill")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    role_performed = Column(String(100), default="")
    tech_stack = Column(String(255), default="")
    outcome = Column(Text, default="")
    start_date = Column(String(50), default="2025-01")
    end_date = Column(String(50), default="Present")

    user = relationship("User", back_populates="projects")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False, index=True)
    provider = Column(String(100), default="Internal Academy")
    resource_type = Column(String(50), default="course") # course, certification, project, mentorship, internal_gig, practice
    difficulty = Column(String(30), default="Intermediate") # Beginner, Intermediate, Advanced
    duration_hours = Column(Integer, default=10)
    estimated_impact_pct = Column(Integer, default=15) # score boost estimation
    url = Column(String(255), default="")
    description = Column(Text, default="")

    skill = relationship("Skill")


class CareerRoadmap(Base):
    __tablename__ = "career_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    target_role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=False, index=True)
    current_compatibility_pct = Column(Integer, default=0)
    target_compatibility_pct = Column(Integer, default=90)
    title = Column(String(150), nullable=False)
    summary = Column(Text, default="")
    milestones_json = Column(Text, default="[]") # Structured JSON milestones
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")
    target_role = relationship("JobRole")


class RecommendationFeedback(Base):
    __tablename__ = "recommendation_feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    recommendation_type = Column(String(50), default="role") # role, skill, roadmap
    item_id = Column(Integer, default=0)
    item_title = Column(String(100), default="")
    is_positive = Column(Boolean, default=True)
    feedback_reason = Column(String(100), default="") # Wrong skill, Wrong role, Experience mismatch, Not interested, Already have skill
    comment = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedback")


class WhatIfSimulation(Base):
    __tablename__ = "whatif_simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    target_role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=False, index=True)
    original_score = Column(Integer, default=0)
    projected_score = Column(Integer, default=0)
    added_skills_json = Column(Text, default="[]")
    unlocked_roles_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="simulations")
    target_role = relationship("JobRole")
