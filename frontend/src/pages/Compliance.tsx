import React, { useState, useEffect } from 'react';
import { mockStore, ComplianceGap } from '../utils/mockData';
import { 
  ShieldCheck, AlertTriangle, FileText, CheckCircle2, 
  ArrowDownToLine, Plus, AlertCircle, TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const Compliance: React.FC = () => {
  const [gaps, setGaps] = useState<ComplianceGap[]>([]);
  const [newGapText, setNewGapText] = useState('');
  const [newRegulation, setNewRegulation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setGaps(mockStore.getComplianceGaps());
  }, []);

  const totalChecks = 25;
  const passedChecks = totalChecks - gaps.filter(g => g.status === 'Open').length;
  const scorePercent = Math.round((passedChecks / totalChecks) * 100);

  const pieData = [
    { name: 'Compliant', value: passedChecks },
    { name: 'Deviations', value: gaps.filter(g => g.status === 'Open').length }
  ];

  const handleResolveGap = (id: string) => {
    const updated = gaps.map(g => g.id === id ? { ...g, status: 'Addressed' as const } : g);
    setGaps(updated);
    mockStore.saveComplianceGaps(updated);
  };

  const handleAddGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGapText || !newRegulation) return;

    const newGap: ComplianceGap = {
      id: 'gap-' + Math.random().toString(36).substr(2, 9),
      regulation: newRegulation,
      deviation: newGapText,
      riskLevel: 'Medium',
      status: 'Open',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    const updated = [newGap, ...gaps];
    setGaps(updated);
    mockStore.saveComplianceGaps(updated);
    
    setNewGapText('');
    setNewRegulation('');
    setShowAddForm(false);
  };

  const handleDownloadAudit = () => {
    const content = `INDUSMIND AI - COMPLIANCE AUDIT EXPORTER
Generated: ${new Date().toISOString()}
Compliance Score: ${scorePercent}% (${passedChecks} of ${totalChecks} rules validated)

CURRENT AUDIT DEVIATIONS:
${gaps.map((g, i) => `${i+1}. [${g.riskLevel} RISK] Regulation: ${g.regulation}\n   Deviation: ${g.deviation}\n   Status: ${g.status.toUpperCase()}\n   Deadline: ${g.dueDate}`).join('\n\n')}

End of Report. Authenticated under ISO 14001 regulations.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `indusmind_compliance_audit_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Score Header Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">Statutory Score</span>
            <h3 className="text-3xl font-extrabold text-slate-100">{scorePercent}%</h3>
            <p className="text-xs text-slate-450">Facility operations comply with safety codes.</p>
          </div>
          <div className="w-24 h-24 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute font-semibold text-xs text-slate-350">{scorePercent}%</div>
          </div>
        </div>

        {/* Audit Status Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Statutory Audits</span>
              <h4 className="text-sm font-bold text-slate-200 mt-1">ISO 14001 & Factory Act</h4>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">Active Validation</span>
          </div>
          <p className="text-xs text-slate-450 mt-2">Checked 5 documents containing LOTO checklists, safety valve ratings, and machinery fencing guards.</p>
        </div>

        {/* Action Panel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-300">Audit Export Logs</h4>
            <p className="text-xs text-slate-400 mt-1">Generate a comprehensive legal audit report detailing all current deviation records.</p>
          </div>
          <button
            onClick={handleDownloadAudit}
            className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-650 hover:bg-indigo-650/80 text-white rounded-lg text-xs font-semibold shadow-md transition-all mt-4"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Generate Compliance Audit Report
          </button>
        </div>
      </div>

      {/* Main Checklist */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-indigo-400" /> Compliance Deviation Records
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-750 transition-all border border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gap Record</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddGap} className="p-4 bg-slate-950 rounded-xl border border-slate-850 mb-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-250">File New Compliance Deviation</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Regulation Code</label>
                <input
                  type="text"
                  required
                  value={newRegulation}
                  onChange={(e) => setNewRegulation(e.target.value)}
                  placeholder="e.g. ISO 9001 Clause 4.2"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Deviation Details</label>
                <input
                  type="text"
                  required
                  value={newGapText}
                  onChange={(e) => setNewGapText(e.target.value)}
                  placeholder="e.g. Missing calibration report for valve..."
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-3 py-1.5 text-[10px] font-bold text-white bg-indigo-650 hover:bg-indigo-650/80 rounded"
              >
                Save Gap Record
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {gaps.map((gap) => (
            <div 
              key={gap.id}
              className={`p-4 rounded-xl bg-slate-950 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors ${
                gap.status === 'Addressed' 
                  ? 'border-emerald-500/25 bg-emerald-500/2' 
                  : 'border-rose-500/25 bg-rose-500/2'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-200">{gap.regulation}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    gap.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-455' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {gap.riskLevel} Risk
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{gap.deviation}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Deadline: {gap.dueDate} {gap.equipmentName && `• Associated Asset: ${gap.equipmentName}`}
                </div>
              </div>

              <div className="flex-shrink-0">
                {gap.status === 'Open' ? (
                  <button
                    onClick={() => handleResolveGap(gap.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Resolved
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolved check
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
