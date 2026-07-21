from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from ..database import get_db
from ..models import models
from ..schemas import schemas

router = APIRouter(prefix="/compliance", tags=["Compliance Management"])

@router.get("/gaps", response_model=list[schemas.ComplianceGapOut])
def get_gaps(db: Session = Depends(get_db)):
    gaps = db.query(models.ComplianceGap).all()
    if not gaps:
        default_gaps = [
            models.ComplianceGap(
                id="gap-301",
                regulation="Factory Act 1948 Sec 21 (Machinery Fencing)",
                deviation="Belts and gears on Emergency Generator G501 lack permanent physical protective guard mesh.",
                risk_level="High",
                status="Open",
                equipment_id="G-501",
                equipment_name="Emergency Generator G501",
                due_date="2026-07-31"
            ),
            models.ComplianceGap(
                id="gap-302",
                regulation="ASME Section I / OISD Standard 177",
                deviation="Steam Boiler B202 safety relief valve SV-B seat leakage exceeding limits. Recertification expired.",
                risk_level="High",
                status="Open",
                equipment_id="B-202",
                equipment_name="Steam Boiler B202",
                due_date="2026-07-20"
            )
        ]
        db.add_all(default_gaps)
        db.commit()
        gaps = db.query(models.ComplianceGap).all()
    return gaps

@router.post("/gaps", response_model=schemas.ComplianceGapOut)
def create_gap(gap_in: schemas.ComplianceGapCreate, db: Session = Depends(get_db)):
    equip_name = None
    if gap_in.equipment_id:
        equip = db.query(models.Equipment).filter(models.Equipment.id == gap_in.equipment_id).first()
        if equip:
            equip_name = equip.name

    db_gap = models.ComplianceGap(
        id=f"gap-{str(uuid.uuid4())[:8]}",
        regulation=gap_in.regulation,
        deviation=gap_in.deviation,
        risk_level=gap_in.risk_level,
        status="Open",
        equipment_id=gap_in.equipment_id,
        equipment_name=equip_name,
        due_date=gap_in.due_date
    )
    db.add(db_gap)
    db.commit()
    db.refresh(db_gap)
    return db_gap

@router.put("/gaps/{gap_id}", response_model=schemas.ComplianceGapOut)
def resolve_gap(gap_id: str, db: Session = Depends(get_db)):
    gap = db.query(models.ComplianceGap).filter(models.ComplianceGap.id == gap_id).first()
    if not gap:
        raise HTTPException(status_code=404, detail="Gap record not found")
    
    gap.status = "Addressed"
    db.commit()
    db.refresh(gap)
    return gap
