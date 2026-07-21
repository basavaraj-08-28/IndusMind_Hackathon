from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..services.gemini_service import gemini_client

router = APIRouter(prefix="/incidents", tags=["Incident Management"])

@router.get("/", response_model=list[schemas.IncidentOut])
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(models.Incident).all()
    if not incidents:
        default_incidents = [
            models.Incident(
                id="inc-901",
                title="Compressor C303 Overheating & Shutdown",
                equipment_id="C-303",
                equipment_name="Reciprocating Compressor C303",
                date="2026-03-02",
                type="Failure",
                severity="Major",
                description="Compressor experienced sudden discharge temperature spike reaching 145C. Thermal trip activated.",
                root_cause="Lack of lubricating oil flow due to oil filter blockage.",
                preventive_action="Incorporate differential pressure gauges. Inspect filter elements every 90 days.",
                status="Resolved",
                location="Zone C - Gas Compression"
            ),
            models.Incident(
                id="inc-902",
                title="Boiler Steam Flange Near Miss Valve Leak",
                equipment_id="B-202",
                equipment_name="Steam Boiler B202",
                date="2026-07-05",
                type="Near Miss",
                severity="Critical",
                description="Hissing steam micro-leakage around gasket flange at 520C detected on Boiler pipe.",
                root_cause="Thermal stress fatigue of the gasket flange from excessive thermal cycling.",
                preventive_action="Replacing flange gasket with standard high-strength graphite composite. Install scanning monitors.",
                status="Investigating",
                location="Zone B - Steam Generation"
            )
        ]
        db.add_all(default_incidents)
        db.commit()
        incidents = db.query(models.Incident).all()
    return incidents

@router.post("/", response_model=schemas.IncidentOut)
def create_incident(inc_in: schemas.IncidentCreate, db: Session = Depends(get_db)):
    equip_name = None
    if inc_in.equipment_id:
        equip = db.query(models.Equipment).filter(models.Equipment.id == inc_in.equipment_id).first()
        if equip:
            equip_name = equip.name

    # Trigger Gemini RCA Solver
    rca_analysis = gemini_client.perform_rca(inc_in.title, inc_in.description)

    db_inc = models.Incident(
        id=f"inc-{str(uuid.uuid4())[:8]}",
        title=inc_in.title,
        equipment_id=inc_in.equipment_id,
        equipment_name=equip_name,
        date=inc_in.date,
        type=inc_in.type,
        severity=inc_in.severity,
        description=inc_in.description,
        root_cause=rca_analysis.get("root_cause", "Pending extraction..."),
        preventive_action=rca_analysis.get("preventive_action", "Scheduled PM checkups..."),
        status="Open",
        location=inc_in.location
      )
    db.add(db_inc)
    db.commit()
    db.refresh(db_inc)
    return db_inc

@router.put("/{inc_id}/resolve", response_model=schemas.IncidentOut)
def resolve_incident(inc_id: str, db: Session = Depends(get_db)):
    inc = db.query(models.Incident).filter(models.Incident.id == inc_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    inc.status = "Resolved"
    db.commit()
    db.refresh(inc)
    return inc
