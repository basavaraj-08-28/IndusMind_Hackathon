from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Plant Manager") # Plant Manager, Maintenance Engineer, Safety Officer, Quality Engineer, Administrator
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # SOP, Manual, Maintenance Log, Inspection Report, Compliance Standard, Drawing
    upload_date = Column(String, nullable=False)
    status = Column(String, default="Processed") # Processed, Processing, Failed
    size = Column(String, nullable=False)
    content_summary = Column(Text, nullable=True)
    
    # Extracted Entities JSON storage
    equipment_tag = Column(String, nullable=True)
    technician_tag = Column(String, nullable=True)
    date_tag = Column(String, nullable=True)
    regulations_tag = Column(String, nullable=True)

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Pump, Boiler, Compressor, Turbine, Generator
    location = Column(String, nullable=False)
    health_score = Column(Integer, default=100)
    rul = Column(Integer, default=365) # Remaining Useful Life in days
    risk_score = Column(Integer, default=0)
    status = Column(String, default="Healthy") # Healthy, Warning, Critical
    last_maintenance = Column(String, nullable=True)
    next_maintenance = Column(String, nullable=True)
    technician = Column(String, nullable=True)

class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"

    id = Column(String, primary_key=True, index=True)
    equipment_id = Column(String, ForeignKey("equipment.id"))
    equipment_name = Column(String, nullable=False)
    task_name = Column(String, nullable=False)
    priority = Column(String, default="Medium") # High, Medium, Low
    status = Column(String, default="Pending") # Pending, In Progress, Completed
    due_date = Column(String, nullable=False)
    assigned_to = Column(String, nullable=False)
    cost = Column(Float, default=0.0)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    equipment_id = Column(String, nullable=True)
    equipment_name = Column(String, nullable=True)
    date = Column(String, nullable=False)
    type = Column(String, nullable=False) # Failure, Near Miss, Safety Violation, Leak
    severity = Column(String, nullable=False) # Critical, Major, Minor
    description = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=True)
    preventive_action = Column(Text, nullable=True)
    status = Column(String, default="Open") # Open, Investigating, Resolved
    location = Column(String, nullable=False)

class ComplianceGap(Base):
    __tablename__ = "compliance_gaps"

    id = Column(String, primary_key=True, index=True)
    regulation = Column(String, nullable=False)
    deviation = Column(Text, nullable=False)
    risk_level = Column(String, default="Medium") # High, Medium, Low
    status = Column(String, default="Open") # Open, Addressed
    equipment_id = Column(String, nullable=True)
    equipment_name = Column(String, nullable=True)
    due_date = Column(String, nullable=False)
