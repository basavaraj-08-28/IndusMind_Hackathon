from fastapi import APIRouter, HTTPException, Depends
from ..schemas import schemas
from ..services.vector_store import vector_db
from ..services.gemini_service import gemini_client

router = APIRouter(prefix="/chat", tags=["Industrial RAG Chatbot"])

@router.post("/query", response_model=schemas.QueryResponse)
def query_rag(payload: schemas.QueryInput):
    user_query = payload.query
    if not user_query.strip():
        raise HTTPException(status_code=400, detail="Query string is empty")

    # 1. Retrieve relevant chunks from our local simulator index
    matched_chunks = vector_db.retrieve_context(user_query, top_k=2)
    
    citations = list(set([chunk["doc_id"] for chunk in matched_chunks]))
    context_str = "\n\n".join([f"[Source: {c['doc_name']}] {c['text']}" for c in matched_chunks])

    # 2. Build detailed prompt with contexts
    prompt = (
        f"You are an expert industrial operations engineer copilot called IndusMind AI.\n"
        f"Answer the user's operational inquiry using the context snippets provided below. "
        f"If the context does not contain relevant details, answer based on industrial best practices, "
        f"but clearly state that it is based on general engineering standards rather than specific plant logs.\n\n"
        f"Context Snippets:\n{context_str}\n\n"
        f"User Inquiry: {user_query}\n\n"
        f"Provide a clear, detailed, formatted answer with specific actionable steps."
    )

    # 3. Request completion from Gemini client
    answer = gemini_client.query_gemini(prompt)

    # Fallback to citations if list is empty
    if not citations:
        citations = ["doc-5"] # Default regulation standard citation

    return {
        "answer": answer,
        "citations": citations
    }
