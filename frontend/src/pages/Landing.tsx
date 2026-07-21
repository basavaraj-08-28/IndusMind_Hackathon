import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Database, Terminal, Users, Play, HelpCircle, ArrowRight, GitFork } from 'lucide-react';

export const Landing: React.FC = () => {
  const features = [
    {
      title: 'Multimodal Document Parsing',
      desc: 'Ingests complex blueprints, P&ID drawings, SOP manuals, scanned logs, and invoices using advanced OCR and layout analyzers.',
      icon: Database,
    },
    {
      title: 'Knowledge Graph Visualization',
      desc: 'Dynamically maps equipment parts to technicians, historical logs, safety protocols, and standard specifications using React Flow.',
      icon: GitFork,
    },
    {
      title: 'RAG AI Industrial Chatbot',
      desc: 'Retrieves contextual answers with source citations, providing instant plant operations support and procedural guides.',
      icon: Terminal,
    },
    {
      title: 'Predictive RUL Forecaster',
      desc: 'Analyzes telemetry triggers, calculating Remaining Useful Life (RUL) and risk probabilities for critical machinery.',
      icon: Cpu,
    },
    {
      title: 'Statutory Compliance Audits',
      desc: 'Scans facility operations against standard Factory Acts and ISO certificates, highlighting deviations and compliance scores.',
      icon: ShieldCheck,
    },
    {
      title: 'Root Cause Investigator',
      desc: 'Runs failure logs through AI solvers to isolate root causes (RCA) and generate action guides for engineers.',
      icon: Zap,
    },
  ];

  const workflowSteps = [
    { step: '01', title: 'Data Ingestion', desc: 'Drag-and-drop SOPs, drawings, maintenance sheets, or compliance standards.' },
    { step: '02', title: 'OCR & Chunking', desc: 'Documents are processed, text extracted, and split into semantically sound chunks.' },
    { step: '03', title: 'Vector Embedding', desc: 'Chunks are vectorized and stored securely inside FAISS/ChromaDB databases.' },
    { step: '04', title: 'RAG Retrieval', desc: 'Queries extract closest text context to feed into Gemini LLM for precise citations.' }
  ];

  const faqs = [
    { q: 'How does IndusMind AI handle scanned legacy drawing blueprints?', a: 'The ingestion module integrates EasyOCR alongside Gemini Vision analysis to extract alphanumeric legends, parts tables, and equipment IDs straight from scanned sheets.' },
    { q: 'Can we host the vector database locally on-premise?', a: 'Yes. The backend supports standalone local SQLite/FAISS file structures, ensuring absolute regulatory compliance and data boundary control.' },
    { q: 'What AI LLMs does the platform utilize?', a: 'It utilizes Google Gemini 1.5 Flash/Pro models via the API for advanced contextual understanding, structured schema outputs, and industrial RAG.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
            IM
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-100">INDUSMIND AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
          >
            Sign In
          </Link>
          <Link 
            to="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/25 transition-all"
          >
            Deploy Sandbox
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5" />
          Enterprise Industrial Knowledge Intelligence Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-200 to-indigo-400 leading-[1.1] max-w-4xl mx-auto">
          Transform Industrial Knowledge Into Plant Actionable Intelligence
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Ingest legacy drawings, maintenance logs, SOP manuals, and compliance acts. Instantly query operations data, map dependency vectors, and resolve failures with RAG AI.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link 
            to="/login"
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all group"
          >
            Access Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#tour"
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          >
            <Play className="w-4 h-4 fill-slate-300" />
            Watch Product Tour
          </a>
        </div>

        {/* Hero Interactive Frame Mockup */}
        <div className="mt-16 relative rounded-2xl border border-slate-800 bg-slate-900/50 p-3 shadow-2xl backdrop-blur-sm max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 px-3 pb-3 border-b border-slate-800/80">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[10px] text-slate-500 ml-2 font-mono">indusmind-dashboard-terminal.local</span>
          </div>
          <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-900/40 relative flex flex-col justify-center items-center p-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950 to-indigo-950/20" />
            <div className="z-10 text-center space-y-4 max-w-lg">
              <Cpu className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
              <h4 className="font-mono text-sm text-indigo-300">SYSTEM HEALTH CHECK: RUNNING</h4>
              <p className="text-xs text-slate-400 font-mono">
                [OK] Ingested 5 regulatory standards. <br/>
                [OK] Identified 12 critical industrial assets (Centrifugal Pumps, Steam Boilers, Gas Turbines). <br/>
                [RCA] Gemini AI standby on incident logs.
              </p>
              <div className="pt-2">
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono font-semibold">
                  API Connected: FAISS Vector DB Standing By
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Matrix */}
      <section id="tour" className="py-20 max-w-7xl mx-auto px-6 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Supercharged AI Features Built for Heavy Industry</h2>
          <p className="mt-4 text-sm text-slate-400">
            A complete industrial operations co-pilot designed to improve plant uptime, secure safety verification, and automate routine checklist verification.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works RAG Flow */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">How The Ingestion Pipeline Works</h2>
            <p className="mt-4 text-sm text-slate-400">
              Go from messy PDFs, Excel tables, and scanned maintenance manuals to structured vector embeddings and expert LLM responses.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {workflowSteps.map((step, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-950 border border-slate-900 flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-indigo-500/20 font-mono">{step.step}</span>
                  <h4 className="text-sm font-bold text-slate-200 mt-2 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-slate-100">Built With Leading Enterprise Engineering Tech</h2>
          <p className="text-xs text-slate-400 mt-2">Engineered for security, high-scale queries, and high uptime.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
          {[
            { name: 'Vite + React', category: 'Frontend framework' },
            { name: 'Tailwind CSS', category: 'Responsive v4 CSS' },
            { name: 'FastAPI', category: 'Python server framework' },
            { name: 'Google Gemini', category: 'Large Language Model' },
            { name: 'PostgreSQL', category: 'Structured storage' },
            { name: 'FAISS / Chroma', category: 'Vector vector embeddings' }
          ].map((tech, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/40">
              <span className="block text-sm font-semibold text-slate-200">{tech.name}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">{tech.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-indigo-950/10 border-t border-slate-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-4">Plant Testimonials</span>
          <p className="text-lg md:text-xl font-medium text-slate-300 italic leading-relaxed">
            "With IndusMind AI, our maintenance crews recovered structural alignment diagrams for Boiler 2 in under 30 seconds. We've slashed routine investigation times by 65% and prevented critical safety valves drift deviations."
          </p>
          <div className="mt-6">
            <span className="block font-semibold text-slate-200 text-sm">H. R. Vance</span>
            <span className="text-[11px] text-slate-500 font-mono uppercase mt-0.5 block">Lead Operations Manager, Fluid Generation Plant</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-100">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-12 border-t border-slate-900 text-center max-w-7xl mx-auto px-6">
        <h3 className="text-xl font-bold text-slate-200 mb-2">Ready to digitize plant knowledge?</h3>
        <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">Get started with our preloaded sandbox mode featuring Centrifugal Pumps, SOP catalogs, and compliance deviations.</p>
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all"
        >
          Enter Admin Portal
        </Link>
        <div className="mt-12 text-[10px] text-slate-600 font-mono">
          © 2026 IndusMind AI Inc. All rights reserved. Platform licensed under ISO 27001 industrial regulations.
        </div>
      </footer>
    </div>
  );
};
