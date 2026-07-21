from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import uuid
import datetime

from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..services.vector_store import vector_db

router = APIRouter(prefix="/documents", tags=["Document Ingestion"])

@router.get("/", response_model=list[schemas.DocumentOut])
def get_documents(db: Session = Depends(get_db)):
    docs = db.query(models.Document).all()
    # If DB is empty, initialize default mock docs into SQLite for sandbox demo
    if not docs:
        default_docs = [
            models.Document(
                id="doc-1",
                name="Standard Operating Procedure - Pump P101 Startup.pdf",
                category="SOP",
                upload_date="2026-06-01",
                status="Processed",
                size="2.4 MB",
                content_summary="This document details the startup procedures and sequence for the Centrifugal Pump P101...",
                equipment_tag="Centrifugal Pump P101",
                technician_tag="Marcus Vance",
                date_tag="2026-05-10",
                regulations_tag="OSHA 1910.147 (LOTO)"
            ),
            models.Document(
                id="doc-2",
                name="Boiler B202 Operating Manual.pdf",
                category="Manual",
                upload_date="2026-06-10",
                status="Processed",
                size="12.8 MB",
                content_summary="Manufacturer operation manual for the high-pressure Steam Boiler B202...",
                equipment_tag="Steam Boiler B202",
                date_tag="2024-10-15",
                regulations_tag="ASME Section I (Boilers)"
            )
        ]
        db.add_all(default_docs)
        db.commit()
        docs = db.query(models.Document).all()
    return docs

@router.post("/upload", response_model=schemas.DocumentOut)
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("SOP"),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        text_content = content.decode("utf-8", errors="ignore")
    except Exception:
        text_content = "Scanned binary drawings file. Extracted layout outlines."

    doc_id = f"doc-{str(uuid.uuid4())[:8]}"
    date_str = datetime.date.today().isoformat()
    
    # Basic Entity Extraction via RegEx
    equipment = "Steam Boiler B202" if "b202" in text_content.lower() else "Centrifugal Pump P101" if "p101" in text_content.lower() else "Emergency Generator G501" if "g501" in text_content.lower() else None
    technician = "Sarah Jenkins" if "sarah" in text_content.lower() else "Marcus Vance" if "marcus" in text_content.lower() else "David Miller" if "david" in text_content.lower() else "System Operator"
    regulation = "OSHA LOTO 1910" if "loto" in text_content.lower() else "ASME Section I" if "asme" in text_content.lower() else None

    # Load text into the in-memory vector store simulator
    vector_db.add_document(
        doc_id=doc_id,
        name=file.filename,
        text=text_content or "Ingested industrial blueprint documentation.",
        meta={"category": category, "equipment": equipment}
    )

    db_doc = models.Document(
        id=doc_id,
        name=file.filename,
        category=category,
        upload_date=date_str,
        status="Processed",
        size=f"{round(len(content)/(1024*1024), 2)} MB" if content else "1.0 MB",
        content_summary=f"Parsed file contents for {file.filename}. Ingested into search indices and generated vectors.",
        equipment_tag=equipment,
        technician_tag=technician,
        date_tag=date_str,
        regulations_tag=regulation
    )

    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.delete("/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
