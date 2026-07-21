import React, { useState, useEffect } from 'react';
import { mockStore, Incident } from '../utils/mockData';
import { 
  Skull, AlertTriangle, ShieldCheck, Hammer, Activity, 
  HelpCircle, Layers, CheckSquare, Plus, PlusCircle, Sparkles
} from 'lucide-react';

export const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeRca, setActiveRca] = useState<Incident | null>(null);
  
  // Heatmap highlights
  const [zoneIncidents, setZoneIncidents] = useState<Record<string, number>>({
    'Zone A': 1,
    'Zone B': 3,
    'Zone C': 4,
    'Zone D': 0,
    'Zone E': 1
  });

  // New Incident Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Failure' | 'Near Miss' | 'Safety Violation' | 'Leak'>('Failure');
  const [severity, setSeverity] = useState<'Critical' | 'Major' | 'Minor'>('Major');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Zone B');

  useEffect(() => {
    setIncidents(mockStore.getIncidents());
  }, []);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newInc: Incident = {
      id: 'inc-' + Math.random().toString(36).substr(2, 9),
      title,
      type,
      severity,
      date: new Date().toISOString().split('T')[0],
      description,
      rootCause: 'Extracting factors via Gemini...',
      preventiveAction: 'Generate preventive actions...',
      status: 'Open',
      location,
    };

    // Update heatmap
    setZoneIncidents(prev => ({
      ...prev,
      [location]: (prev[location] || 0) + 1
    }));

    const updated = [newInc, ...incidents];
    setIncidents(updated);
    mockStore.saveIncidents(updated);

    // Reset Form
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  const handleResolveIncident = (id: string) => {
    const updated = incidents.map(inc => {
      if (inc.id === id) {
        return { 
          ...inc, 
          status: 'Resolved' as const,
          rootCause: inc.rootCause === 'Extracting factors via Gemini...' 
            ? 'Blocked or misaligned flow causing mechanical shear and component failure.' 
            : inc.rootCause,
          preventiveAction: inc.preventiveAction === 'Generate preventive actions...' 
            ? 'Scheduled recurring weekly inspect loops.' 
            : inc.preventiveAction
        };
      }
      return inc;
    });
    setIncidents(updated);
    mockStore.saveIncidents(updated);
    if (activeRca?.id === id) {
      setActiveRca(updated.find(i => i.id === id) || null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Heatmap Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-indigo-400" /> Plant Hotspot Risk Heatmap
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Aggregates incident coordinates across plant sectors. Darker zones represent higher frequencies of near-misses and equipment failures.
        </p>

        {/* Heatmap representation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(zoneIncidents).map(([zone, count]) => {
            const heatColor = 
              count === 0 ? 'bg-slate-950 border-slate-850 text-slate-500' :
              count <= 1 ? 'bg-amber-500/10 border-amber-500/35 text-amber-400' :
              count <= 3 ? 'bg-orange-500/20 border-orange-500/35 text-orange-400' :
              'bg-rose-500/35 border-rose-500/40 text-rose-400 animate-pulse';

            return (
              <div key={zone} className={`p-4 rounded-xl border ${heatColor} text-center flex flex-col justify-center`}>
                <span className="text-xs font-semibold block">{zone}</span>
                <span className="text-lg font-extrabold block mt-1.5">{count} Incident{count !== 1 ? 's' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Failures List & Form */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Failures Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Skull className="w-4.5 h-4.5 text-rose-450" /> Plant Failure Reports
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-650/80 transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Incident</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreateIncident} className="p-4 bg-slate-950/85 rounded-xl border border-slate-850 mb-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-200">Log Plant Failure or Near Miss</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Incident Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Pump P101 Seal Leak"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-650"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Plant Area</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="Zone A">Zone A (Fluid)</option>
                    <option value="Zone B">Zone B (Steam)</option>
                    <option value="Zone C">Zone C (Gas)</option>
                    <option value="Zone D">Zone D (Power)</option>
                    <option value="Zone E">Zone E (Back-up)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Incident Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="Failure">Equipment Failure</option>
                    <option value="Near Miss">Near Miss Event</option>
                    <option value="Safety Violation">Safety Protocol Deviation</option>
                    <option value="Leak">Material Leak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Severity Rating</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="Critical">Critical (Immediate Hazard)</option>
                    <option value="Major">Major (Ops Restrained)</option>
                    <option value="Minor">Minor (Routine)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Incident Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail operational indicators, temperatures or deviations noted."
                  className="w-full h-20 px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-655 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3 py-1.5 text-[10px] font-bold text-white bg-indigo-650 hover:bg-indigo-650/80 rounded"
                >
                  File Report
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="space-y-4">
            {incidents.map((inc) => (
              <div 
                key={inc.id}
                onClick={() => setActiveRca(inc)}
                className="p-4 rounded-xl bg-slate-950 border border-slate-850 hover:border-indigo-500/25 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      inc.severity === 'Critical' ? 'bg-rose-500/10 text-rose-455 animate-pulse' :
                      inc.severity === 'Major' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-slate-850 text-slate-400'
                    }`}>
                      {inc.severity} Severity
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{inc.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors mt-2">{inc.title}</h4>
                  <p className="text-[11px] text-slate-450 line-clamp-1 mt-1">{inc.description}</p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRca(inc);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-indigo-550 text-[10px] font-bold text-indigo-400 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    RCA Solver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: RCA Details Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg min-h-64 flex flex-col justify-between">
            {activeRca ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Root Cause Analysis</span>
                    <h4 className="text-xs font-bold text-slate-200 mt-1">{activeRca.title}</h4>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeRca.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-455 animate-pulse'
                  }`}>
                    {activeRca.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-400 space-y-3.5">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">RCA Incident Description:</span>
                    <p className="leading-relaxed">{activeRca.description}</p>
                  </div>
                  
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Isolated Root Cause (5 Whys):</span>
                    <p className="leading-relaxed text-slate-300 font-mono text-[11px]">{activeRca.rootCause}</p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Action Recommendations:</span>
                    <p className="leading-relaxed text-slate-350">{activeRca.preventiveAction}</p>
                  </div>
                </div>

                {activeRca.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolveIncident(activeRca.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
                  >
                    Resolve Incident Case & Save RCA
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <Sparkles className="w-10 h-10 mx-auto opacity-30 mb-3 animate-pulse" />
                <h4 className="text-xs font-bold">Select a failure record</h4>
                <p className="text-[10px] text-slate-600 mt-1">AI will isolate causes using plant telemetry models.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
