import re
from typing import List, Dict, Any

class VectorStore:
    def __init__(self):
        # In-memory document storage representing Vector DB collections
        self.documents: Dict[str, dict] = {}
        self.chunks: List[dict] = []

    def add_document(self, doc_id: str, name: str, text: str, meta: dict = None):
        self.documents[doc_id] = {
            "name": name,
            "text": text,
            "meta": meta or {}
        }
        
        # Split text into chunks (e.g., sentences or fixed line chunks)
        lines = text.split('\n')
        current_chunk = []
        word_count = 0
        
        for line in lines:
            if not line.strip():
                continue
            current_chunk.append(line)
            word_count += len(line.split())
            
            if word_count > 100: # chunk size limit
                chunk_text = " ".join(current_chunk)
                self.chunks.append({
                    "doc_id": doc_id,
                    "doc_name": name,
                    "text": chunk_text
                })
                current_chunk = []
                word_count = 0
                
        if current_chunk:
            self.chunks.append({
                "doc_id": doc_id,
                "doc_name": name,
                "text": " ".join(current_chunk)
            })

    def retrieve_context(self, query: str, top_k: int = 2) -> List[dict]:
        query_words = set(re.findall(r'\w+', query.lower()))
        if not query_words:
            return []

        # Score chunks based on word overlap (TF-IDF simulation)
        scored_chunks = []
        for chunk in self.chunks:
            chunk_words = re.findall(r'\w+', chunk["text"].lower())
            overlap = len(query_words.intersection(chunk_words))
            
            # Simple scoring: overlap count / log of length
            score = overlap / (1 + len(chunk_words))**0.1 if overlap > 0 else 0
            if score > 0:
                scored_chunks.append((score, chunk))

        # Sort and return top_k
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for _, item in scored_chunks[:top_k]]

    def clear(self):
        self.documents.clear()
        self.chunks.clear()

vector_db = VectorStore()

# Load default plant documents to stand-by
vector_db.add_document(
    doc_id="doc-1",
    name="Standard Operating Procedure - Pump P101 Startup.pdf",
    text=(
        "Centrifugal Pump P101 Startup SOP Guidelines.\n"
        "Check mechanical alignment check. Deviation limit 0.05mm. Alignment must be checked weekly by the technician.\n"
        "Lockout/Tagout (LOTO) protocols must be cleared under OSHA 1910.147 requirements.\n"
        "Ensure fluid supply valve is open and lubricating level is inside target margins."
    )
)
vector_db.add_document(
    doc_id="doc-2",
    name="Boiler B202 Operating Manual.pdf",
    text=(
        "Steam Boiler B202 operating manual parameters.\n"
        "Maximum design pressure: 650 psi. Relief valve triggers at 600 psi. ASME Section I compliant.\n"
        "Water quality limits: pH must stay between 8.5 and 9.5. Purge lines must be verified.\n"
        "Warning: Flange leak indicates gasket degradation. Immediately inspect pressure gauge values."
    )
)
vector_db.add_document(
    doc_id="doc-3",
    name="Compressor C303 Maintenance Log - Q1 2026.xlsx",
    text=(
        "Compressor C303 quarterly maintenance activity logs.\n"
        "Piston ring wear rates checked by David Miller. Replacing oil filters.\n"
        "High temperatures of 145C trip shutoff. Blocked filters restrict lubricating oil flow.\n"
        "Recommend differential pressure gauge checks to evaluate clogging risks."
    )
)
vector_db.add_document(
    doc_id="doc-4",
    name="Inspection Report - Safety Valve Verification B202.pdf",
    text=(
        "Inspection report Safety Valve Recertification B202.\n"
        "Relief valve SV-B displays pressure drift. Leakage noted along valve seating.\n"
        "Validation expired on 2026-07-01. Inspection conducted by Sarah Jenkins. ASME Section I compliance review."
    )
)
vector_db.add_document(
    doc_id="doc-5",
    name="Factory Act 1948 - Chapter IV (Safety).pdf",
    text=(
        "Factory Act 1948 Chapter IV safety directives.\n"
        "Sec 21: Rotating machinery belts and gears must have physical mesh fencing guards.\n"
        "Sec 22: Young persons must not inspect moving components. Mandatory LOTO locks during PM checkouts."
    )
)
