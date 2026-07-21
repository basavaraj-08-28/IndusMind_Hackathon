from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from ..database import get_db
from ..models import models
from ..schemas import schemas

router = APIRouter(prefix="/maintenance", tags=["Maintenance Intelligence"])

@router.get("/equipment", response_model=list[schemas.EquipmentOut])
def get_equipment(db: Session = Depends(get_db)):
    equip = db.query(models.Equipment).all()
    if not equip:
        # Populate defaults
        default_equip = [
            models.Equipment(
                id="P-101",
                name="Centrifugal Pump P101",
                category="Pump",
                location="Zone A - Fluid Processing",
                health_score=92,
                rul=120,
                risk_score=15,
                status="Healthy",
                last_maintenance="2026-05-10",
                next_maintenance="2026-09-10",
                technician="Marcus Vance"
            ),
            models.Equipment(
                id="B-202",
                name="Steam Boiler B202",
                category="Boiler",
                location="Zone B - Steam Generation Unit",
                health_score=48,
                rul=14,
                risk_score=78,
                status="Critical",
                last_maintenance="2025-11-15",
                next_maintenance="2026-07-20",
                technician="Sarah Jenkins"
            ),
            models.Equipment(
                id="C-303",
                name="Reciprocating Compressor C303",
                category="Compressor",
                location="Zone C - Gas Compression Station",
                health_score=72,
                rul=45,
                risk_score=42,
                status="Warning",
                last_maintenance="2026-03-04",
                next_maintenance="2026-08-04",
                technician="David Miller"
            )
        ]
        db.add_all(default_equip)
        db.commit()
        equip = db.query(models.Equipment).all()
    return equip

@router.get("/tasks", response_model=list[schemas.MaintenanceTaskOut])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.MaintenanceTask).all()
    if not tasks:
        default_tasks = [
            models.MaintenanceTask(
                id="task-101",
                equipment_id="B-202",
                equipment_name="Steam Boiler B202",
                task_name="Replace Overpressure Valve SV-B",
                priority="High",
                status="Pending",
                due_date="2026-07-20",
                assigned_to="Sarah Jenkins",
                cost=4500.0
            ),
            models.MaintenanceTask(
                id="task-102",
                equipment_id="C-303",
                equipment_name="Reciprocating Compressor C303",
                task_name="Oil Filter and Gasket Replacement",
                priority="Medium",
                status="In Progress",
                due_date="2026-08-04",
                assigned_to="David Miller",
                cost=1200.0
            )
        ]
        db.add_all(default_tasks)
        db.commit()
        tasks = db.query(models.MaintenanceTask).all()
    return tasks

@router.post("/tasks", response_model=schemas.MaintenanceTaskOut)
def create_task(task_in: schemas.MaintenanceTaskCreate, db: Session = Depends(get_db)):
    equip = db.query(models.Equipment).filter(models.Equipment.id == task_in.equipment_id).first()
    if not equip:
        raise HTTPException(status_code=404, detail="Equipment asset not found")
        
    db_task = models.MaintenanceTask(
        id=f"task-{str(uuid.uuid4())[:8]}",
        equipment_id=task_in.equipment_id,
        equipment_name=equip.name,
        task_name=task_in.task_name,
        priority=task_in.priority,
        status="Pending",
        due_date=task_in.due_date,
        assigned_to=task_in.assigned_to,
        cost=task_in.cost
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
