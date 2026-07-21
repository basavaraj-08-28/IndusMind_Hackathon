import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Settings, ShieldAlert, Cpu, Activity, LogOut, Terminal, Keyboard } from 'lucide-react';
import { mockStore } from '../utils/mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const documents = mockStore.getDocuments();
  const equipment = mockStore.getEquipment();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const filteredCommands = [
    { name: 'Go to Dashboard', icon: Activity, action: () => handleNavigate('/dashboard'), category: 'Navigation' },
    { name: 'Go to Document Intelligence', icon: FileText, action: () => handleNavigate('/documents'), category: 'Navigation' },
    { name: 'Open Industrial AI Chat', icon: Terminal, action: () => handleNavigate('/chat'), category: 'Navigation' },
    { name: 'Check Maintenance Intelligence', icon: Cpu, action: () => handleNavigate('/maintenance'), category: 'Navigation' },
    { name: 'View Compliance Gaps', icon: ShieldAlert, action: () => handleNavigate('/compliance'), category: 'Navigation' },
    { name: 'Open Settings', icon: Settings, action: () => handleNavigate('/settings'), category: 'System' },
  ].filter(cmd => cmd.name.toLowerCase().includes(query.toLowerCase()));

  const filteredEquipment = equipment.filter(eq => 
    eq.name.toLowerCase().includes(query.toLowerCase()) || 
    eq.id.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(query.toLowerCase()) || 
    doc.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-2xl glass-panel-dark border border-slate-700/50 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 mr-3 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, document, or equipment ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-slate-100 bg-transparent outline-none placeholder-slate-500 text-base"
          />
          <button 
            onClick={onClose}
            className="px-1.5 py-0.5 rounded border border-slate-700 text-xs text-slate-400 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {filteredCommands.length > 0 && (
            <div>
              <h3 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commands</h3>
              <div className="mt-1 space-y-1">
                {filteredCommands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={cmd.action}
                    className="flex items-center w-full px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
                  >
                    <cmd.icon className="w-4 h-4 mr-3 text-slate-400" />
                    <span>{cmd.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredEquipment.length > 0 && (
            <div>
              <h3 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment</h3>
              <div className="mt-1 space-y-1">
                {filteredEquipment.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => handleNavigate(`/maintenance?search=${eq.id}`)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
                  >
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-3 text-slate-400" />
                      <span>{eq.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      eq.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                      eq.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {eq.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredDocs.length > 0 && (
            <div>
              <h3 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents</h3>
              <div className="mt-1 space-y-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleNavigate(`/documents?id=${doc.id}`)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
                  >
                    <div className="flex items-center overflow-hidden">
                      <FileText className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{doc.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCommands.length === 0 && filteredEquipment.length === 0 && filteredDocs.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              <Keyboard className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
