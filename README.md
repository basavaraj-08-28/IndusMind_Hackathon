# 🏭 IndusMind AI — Industrial Operations Co-pilot

**IndusMind AI** is a premium, state-of-the-art Industrial Operations Co-pilot and Knowledge Management Platform. Designed for modern manufacturing plants and industrial facilities, it empowers **Plant Managers, Maintenance Engineers, Safety Officers, and Quality Teams** to streamline compliance, diagnose equipment issues, predict remaining useful life (RUL), and query complex standard operating procedures (SOPs) through a Gemini-powered Retrieval-Augmented Generation (RAG) agent.

---

## 🚀 Key Features

### 1. 🤖 IndusMind AI RAG Chatbot
- **Interactive Operational Copilot**: An intelligent chat interface powered by **Gemini 1.5 Flash** to answer complex query-based operations.
- **Local Simulated Vector DB**: Splits documents into chunks and queries them using simulated TF-IDF term overlap scoring for immediate context retrieval.
- **Fail-Safe Simulation**: Works immediately without an API key by falling back to robust plant logs and operational simulations.

### 2. 📊 Equipment Health & Predictive Telemetry
- Real-time status tracking (**Healthy, Warning, Critical**) for core equipment categories like *Pumps, Boilers, Compressors, and Turbines*.
- AI-driven forecasting of **Remaining Useful Life (RUL)** in days, alongside customized plant risk scores.

### 3. 🕸️ System Topology Graph
- An interactive, fluid dependency topology map powered by **React Flow**.
- Clear visualization of upstream and downstream linkages between pumps, boilers, and turbine generator lines, identifying single points of failure instantly.

### 4. 🔧 Predictive Maintenance Tasks
- Complete tracking pipeline for scheduling and assigning maintenance runs.
- Tracks estimated costs, severity levels, technician allocations, and due dates.

### 5. ⚠️ Incident Management & Automated Root Cause Analysis (RCA)
- Log safety incidents, near-misses, and equipment failures.
- Auto-generate **RCA** drafts and preventive action plans leveraging the Gemini API.

### 6. 📜 Compliance Gap Monitoring
- Match plant behaviors against standard regulations (e.g., Factory Act 1948, ASME Section I, OSHA 1910.147).
- Track deviations, severity metrics, and rectification due dates.

### 7. 📁 Smart Document Repository
- Categorize drawings, SOPs, manual logs, and compliance standards.
- Tag extraction mapping for quick reference across equipment and technician databases.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React (v19), TypeScript, Vite (v8), Tailwind CSS (v4), Framer Motion, Recharts, React Flow |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, SQLite, Pydantic, Python-Jose |
| **AI / RAG** | Gemini 1.5 Flash (`google-generativeai`), Custom Simulated Vector DB, Cosine TF-IDF Overlap Engine |

---

## 📁 Repository Structure

```text
Indus Mind/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy Database Models
│   │   ├── routers/         # API Routers (Auth, Chat, Maintenance, etc.)
│   │   ├── schemas/         # Pydantic Schemas
│   │   ├── services/        # Gemini API & Vector DB Simulator Services
│   │   ├── database.py      # SQLite Database setup
│   │   ├── main.py          # FastAPI application initialization
│   │   └── config.py        # Environment Configuration
│   ├── requirements.txt     # Python Dependencies
│   └── run.py               # Backend entry script
├── frontend/
│   ├── src/
│   │   ├── components/      # Common components (Sidebar, Header, etc.)
│   │   ├── pages/           # Application views (Dashboard, Chat, Analytics)
│   │   ├── context/         # Auth & Global States
│   │   └── utils/           # Helper scripts & APIs
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.ts       # Vite Configuration
│   └── README.md            # React-specific README
└── README.md                # Project Root README
```

---

## ⚙️ Setup and Installation

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Gemini API Key** (optional, fallback simulator is active by default)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend/` directory (optional for live Gemini queries):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. Run the server:
   ```bash
   python run.py
   ```
   The backend API will start at **`http://localhost:8000`**. You can access interactive docs at `http://localhost:8000/api/docs`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will start running at **`http://localhost:5173`** (or the port specified in your console).

---

## 📈 Preview and Design Highlights
- **Vibrant Modern Dashboard**: Tailored HSL dark modes with premium glowing indicators.
- **Smooth Micro-animations**: Enhanced transition states with Framer Motion.
- **Topology visualization**: Complete graph controls allowing pan, zoom, and interactive status tracking.
