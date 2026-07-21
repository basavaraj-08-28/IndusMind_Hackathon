from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str

class UserOut(UserBase):
    id: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None

# Documents
class DocumentOut(BaseModel):
    id: str
    name: str
    category: str
    upload_date: str
    status: str
    size: str
    content_summary: Optional[str] = None
    equipment_tag: Optional[str] = None
    technician_tag: Optional[str] = None
    date_tag: Optional[str] = None
    regulations_tag: Optional[str] = None

    class Config:
        from_attributes = True

# Chat
class QueryInput(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    citations: List[str]

# Equipment
class EquipmentOut(BaseModel):
    id: str
    name: str
    category: str
    location: str
    health_score: int
    rul: int
    risk_score: int
    status: str
    last_maintenance: Optional[str] = None
    next_maintenance: Optional[str] = None
    technician: Optional[str] = None

    class Config:
        from_attributes = True

# Maintenance
class MaintenanceTaskCreate(BaseModel):
    equipment_id: str
    task_name: str
    priority: str
    due_date: str
    assigned_to: str
    cost: float

class MaintenanceTaskOut(BaseModel):
    id: str
    equipment_id: str
    equipment_name: str
    task_name: str
    priority: str
    status: str
    due_date: str
    assigned_to: str
    cost: float

    class Config:
        from_attributes = True

# Incidents
class IncidentCreate(BaseModel):
    title: str
    equipment_id: Optional[str] = None
    date: str
    type: str
    severity: str
    description: str
    location: str

class IncidentOut(BaseModel):
    id: str
    title: str
    equipment_id: Optional[str] = None
    equipment_name: Optional[str] = None
    date: str
    type: str
    severity: str
    description: str
    root_cause: Optional[str] = None
    preventive_action: Optional[str] = None
    status: str
    location: str

    class Config:
        from_attributes = True

# Compliance
class ComplianceGapCreate(BaseModel):
    regulation: str
    deviation: str
    risk_level: str
    due_date: str
    equipment_id: Optional[str] = None

class ComplianceGapOut(BaseModel):
    id: str
    regulation: str
    deviation: str
    risk_level: str
    status: str
    equipment_id: Optional[str] = None
    equipment_name: Optional[str] = None
    due_date: str

    class Config:
        from_attributes = True
