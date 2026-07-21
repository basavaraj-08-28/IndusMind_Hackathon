import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStore, Document } from '../utils/mockData';
import { 
  FileText, Upload, Plus, Calendar, User, Scale, Tag, Trash2, 
  Eye, CheckCircle2, RefreshCw, Layers, ArrowLeftRight, HelpCircle
} from 'lucide-react';

export const Documents: React.FC = () => {
  const { isBackendConnected, backendUrl } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingState, setProcessingState] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Preview states
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Comparison states
  const [comparisonDocs, setComparisonDocs] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    setDocuments(mockStore.getDocuments());
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    triggerUpload();
  };

  const triggerUpload = () => {
    setUploading(true);
    setUploadProgress(10);
    setProcessingState('Reading binary stream...');

    // Phase 1: Upload progress
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          triggerOcrAndChunking();
          return 100;
        }
        if (p === 30) setProcessingState('Running OCR Layout analysis...');
        if (p === 60) setProcessingState('Extracting equipment and technician metadata...');
        if (p === 85) setProcessingState('Splitting text and generating vector embeddings...');
        return p + 15;
      });
    }, 400);
  };

  const triggerOcrAndChunking = () => {
    // Generate new mock doc
    const sampleNames = [
      'SOP-B202-Emergency-Purge.pdf',
      'P101-Impeller-Assembly-Drawing.pdf',
      'Inspection-Report-Compressor-Flange.pdf',
      'OISD-Standard-116-Fire-Safety.pdf'
    ];
    const categories = ['SOP', 'Drawing', 'Inspection Report', 'Compliance Standard'] as const;
    const randomIdx = Math.floor(Math.random() * sampleNames.length);
    
    const newDoc: Document = {
      id: 'doc-' + Math.random().toString(36).substr(2, 9),
      name: sampleNames[randomIdx],
      category: categories[randomIdx],
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Processed',
      extractedEntities: {
        equipment: randomIdx === 0 || randomIdx === 2 ? 'Steam Boiler B202' : randomIdx === 1 ? 'Centrifugal Pump P101' : undefined,
        technician: 'Sarah Jenkins',
        date: new Date().toISOString().split('T')[0],
        regulations: randomIdx === 3 ? 'OISD Standard 116' : undefined,
      },
      tags: ['Uploaded', categories[randomIdx]],
      size: '3.6 MB',
      contentSummary: 'Automatically extracted knowledge node representing operational procedures, parts layout or inspections. Context has been split into 15 overlap chunks and indexed in ChromaDB.'
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    mockStore.saveDocuments(updated);

    setUploading(false);
    setUploadProgress(0);
    setProcessingState('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    mockStore.saveDocuments(updated);
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const categories = ['All', 'SOP', 'Manual', 'Maintenance Log', 'Inspection Report', 'Compliance Standard', 'Drawing'];

  const filteredDocs = filterCategory === 'All' 
    ? documents 
    : documents.filter(d => d.category === filterCategory);

  const toggleSelectForComparison = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComparisonDocs(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id]; // keep only last two
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Upload Area */}
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerUpload}
        className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 bg-slate-900/30 backdrop-blur-sm transition-all text-center cursor-pointer flex flex-col items-center justify-center group"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-slate-200 font-semibold mb-1 text-sm">Drag and drop industrial documents here</h3>
        <p className="text-xs text-slate-500 max-w-md">Supports PDF blueprints, CSV maintenance sheets, Word manuals, Excel tables, and JPG inspection logs.</p>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded mt-3 font-semibold uppercase tracking-wider">
          Upload limit: 50MB
        </span>
      </div>

      {/* Ingestion Processing Bar */}
      {uploading && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl animate-pulse">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ingestion Pipeline: In progress
            </span>
            <span className="text-xs font-mono text-slate-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-2">{processingState}</p>
        </div>
      )}

      {/* Document Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Compare Trigger button */}
        {comparisonDocs.length > 0 && (
          <button
            onClick={() => setShowComparison(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/10"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Compare Selected ({comparisonDocs.length}/2)
          </button>
        )}
      </div>

      {/* Docs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const isSelectedForComp = comparisonDocs.includes(doc.id);
          return (
            <div 
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer group hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1">{doc.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{doc.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleSelectForComparison(doc.id, e)}
                    className={`p-1.5 rounded border text-[10px] font-bold ${
                      isSelectedForComp 
                        ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title="Select to compare side-by-side"
                  >
                    Compare
                  </button>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed line-clamp-2 mb-4">
                  {doc.contentSummary}
                </p>

                {/* Badges / Entities */}
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-850">
                  {doc.extractedEntities.equipment && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-medium truncate">{doc.extractedEntities.equipment}</span>
                    </div>
                  )}
                  {doc.extractedEntities.regulations && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Scale className="w-3.5 h-3.5 text-rose-450" />
                      <span className="font-medium truncate">{doc.extractedEntities.regulations}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[9px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {doc.uploadDate}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {doc.extractedEntities.technician || 'Admin'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-850">
                <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" /> Ingested
                </span>
                <button 
                  onClick={(e) => handleDelete(doc.id, e)}
                  className="p-1 text-slate-500 hover:text-rose-450 hover:bg-rose-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Comparison Drawer/Overlay */}
      {showComparison && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-indigo-400" /> Side-by-Side Document Comparison
              </h3>
              <button 
                onClick={() => {
                  setShowComparison(false);
                  setComparisonDocs([]);
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:text-white"
              >
                Close View
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-2 gap-6 divide-x divide-slate-800/80">
              {comparisonDocs.map((id, index) => {
                const compDoc = documents.find(d => d.id === id);
                if (!compDoc) return null;
                return (
                  <div key={id} className={`space-y-4 ${index === 1 ? 'md:pl-6' : ''}`}>
                    <div>
                      <span className="text-[10px] bg-indigo-600/25 text-indigo-400 font-bold px-2 py-0.5 rounded-full uppercase">Doc {index + 1}</span>
                      <h4 className="text-sm font-bold text-slate-200 mt-2">{compDoc.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{compDoc.category} • {compDoc.size}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-400 leading-relaxed min-h-40">
                      <span className="block font-semibold text-slate-200 uppercase mb-2">Content Indexing:</span>
                      {compDoc.contentSummary}
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase">Extracted Metadata</h5>
                      <table className="w-full text-xs text-left text-slate-400">
                        <tbody>
                          <tr className="border-b border-slate-850/50"><td className="py-2 text-[11px]">Associated Equipment:</td><td className="py-2 text-[11px] text-slate-200 font-medium">{compDoc.extractedEntities.equipment || 'N/A'}</td></tr>
                          <tr className="border-b border-slate-850/50"><td className="py-2 text-[11px]">Primary Regulations:</td><td className="py-2 text-[11px] text-slate-200 font-medium">{compDoc.extractedEntities.regulations || 'N/A'}</td></tr>
                          <tr className="border-b border-slate-850/50"><td className="py-2 text-[11px]">Ingestion Date:</td><td className="py-2 text-[11px] text-slate-200 font-medium">{compDoc.uploadDate}</td></tr>
                          <tr><td className="py-2 text-[11px]">Technician Assigned:</td><td className="py-2 text-[11px] text-slate-200 font-medium">{compDoc.extractedEntities.technician || 'N/A'}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
              {comparisonDocs.length < 2 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 col-span-2">
                  <HelpCircle className="w-10 h-10 opacity-30 mb-2" />
                  <p className="text-xs">Select two documents to view side-by-side differences.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Document Details Drawer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end">
          <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded-full uppercase">
                  {selectedDoc.category}
                </span>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="px-2.5 py-1 bg-slate-800 text-xs font-semibold text-slate-400 hover:text-white rounded-md"
                >
                  Close
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-100 mb-2">{selectedDoc.name}</h3>
              <p className="text-xs text-slate-500 font-mono mb-6">Uploaded: {selectedDoc.uploadDate} | Size: {selectedDoc.size}</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingestion Summary</h4>
                  <p className="text-xs text-slate-350 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850">
                    {selectedDoc.contentSummary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted Entity Context</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="block text-[10px] text-slate-500">Asset Target</span>
                      <span className="text-xs font-bold text-slate-200 mt-1 block truncate">
                        {selectedDoc.extractedEntities.equipment || 'No equipment tagged'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="block text-[10px] text-slate-500">Regulation Class</span>
                      <span className="text-xs font-bold text-rose-400 mt-1 block truncate">
                        {selectedDoc.extractedEntities.regulations || 'No standards tagged'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="block text-[10px] text-slate-500">Assigned Expert</span>
                      <span className="text-xs font-bold text-slate-200 mt-1 block truncate">
                        {selectedDoc.extractedEntities.technician || 'None'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="block text-[10px] text-slate-500">Entity Date</span>
                      <span className="text-xs font-bold text-slate-200 mt-1 block truncate font-mono">
                        {selectedDoc.extractedEntities.date || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Metadata Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.tags.map((t, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-slate-850 text-slate-400 text-xs rounded-full border border-slate-800">
                        <Tag className="w-3 h-3 text-indigo-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex gap-4 mt-8">
              <button 
                onClick={(e) => {
                  toggleSelectForComparison(selectedDoc.id, e);
                  setSelectedDoc(null);
                }}
                className="flex-1 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Select to Compare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
