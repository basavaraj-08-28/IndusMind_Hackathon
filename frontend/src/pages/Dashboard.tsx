import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Cpu, MessageSquare, ShieldAlert, Wrench, CheckSquare, AlertCircle, Heart,
  TrendingUp, ArrowRight, ShieldCheck, UserCheck, Play, AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { mockStore } from '../utils/mockData';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const docs = mockStore.getDocuments();
  const equipment = mockStore.getEquipment();
  const tasks = mockStore.getMaintenanceTasks();
  const incidents = mockStore.getIncidents();
  const compliance = mockStore.getComplianceGaps();

  // Metrics Calculations
  const totalDocs = docs.length;
  const totalEquip = equipment.length;
  const aiQueriesToday = 142; // static/stateful
  const complianceScore = 84; // 84%
  const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
  const pendingInspections = compliance.filter(c => c.status === 'Open').length;
  const criticalAssets = equipment.filter(e => e.status === 'Critical').length;
  const overallPlantHealth = 78; // average of health scores

  // 1. Chart Data: Equipment Health Trend
  const healthTrendData = [
    { name: 'Mon', B202: 50, P101: 90, C303: 75 },
    { name: 'Tue', B202: 49, P101: 91, C303: 74 },
    { name: 'Wed', B202: 48, P101: 92, C303: 72 },
    { name: 'Thu', B202: 48, P101: 92, C303: 72 },
    { name: 'Fri', B202: 47, P101: 93, C303: 73 },
    { name: 'Sat', B202: 47, P101: 92, C303: 72 },
    { name: 'Sun', B202: 48, P101: 92, C303: 72 },
  ];

  // 2. Chart Data: Maintenance Cost (Monthly)
  const maintenanceCostData = [
    { month: 'Jan', Preventive: 4500, Reactive: 2000 },
    { month: 'Feb', Preventive: 5100, Reactive: 1500 },
    { month: 'Mar', Preventive: 4800, Reactive: 6500 }, // reactive spike C303 fail
    { month: 'Apr', Preventive: 5200, Reactive: 1200 },
    { month: 'May', Preventive: 5800, Reactive: 800 },
    { month: 'Jun', Preventive: 6200, Reactive: 2400 },
  ];

  // 3. Chart Data: Document Categories
  const docCategoriesData = [
    { name: 'SOPs', value: docs.filter(d => d.category === 'SOP').length },
    { name: 'Manuals', value: docs.filter(d => d.category === 'Manual').length },
    { name: 'Maint. Logs', value: docs.filter(d => d.category === 'Maintenance Log').length },
    { name: 'Inspections', value: docs.filter(d => d.category === 'Inspection Report').length },
    { name: 'Regulations', value: docs.filter(d => d.category === 'Compliance Standard').length },
  ];
  const COLORS = ['#6366f1', '#06b6d4', '#14b8a6', '#f59e0b', '#ef4444'];

  // 4. Chart Data: Equipment Downtime (Hours)
  const downtimeData = [
    { name: 'Boiler B202', hours: 18 },
    { name: 'Compress C303', hours: 4 },
    { name: 'Generator G501', hours: 2 },
    { name: 'Pump P101', hours: 0 },
    { name: 'Turbine T401', hours: 0 },
  ];

  const recentActivities = [
    { id: '1', type: 'upload', user: 'David Miller', detail: 'Uploaded Compressor C303 log sheet', time: '1h ago' },
    { id: '2', type: 'compliance', user: 'Sarah Jenkins', detail: 'Triggered inspection on Overpressure Valve SV-B', time: '3h ago' },
    { id: '3', type: 'incident', user: 'System Agent', detail: 'Flagged steam flange leak near Boiler B202', time: '12h ago' },
    { id: '4', type: 'maint', user: 'Marcus Vance', detail: 'Completed preventive lubrication on Pump P101', time: '1d ago' },
  ];

  const aiRecommendations = [
    { id: 'rec-1', title: 'Schedule Steam Valve B202 PM', desc: 'Boiler B202 pressure levels show valve seating wear. Schedule replacement before 2026-07-20 to avoid regulatory downtime.', priority: 'High', type: 'maintenance' },
    { id: 'rec-2', title: 'Install Mesh Guard on Generator G501', desc: 'Safety audit scan flags missing protective mesh guards on G501 belts, violating Factory Act Sec 21.', priority: 'Medium', type: 'compliance' },
    { id: 'rec-3', title: 'Compressor C303 RCA checklist', desc: 'RCA models suggest adding dual pressure gauges on Compressor C303 oil filter to prevent future overheating shutoffs.', priority: 'Medium', type: 'safety' },
  ];

  return (
    <div className="space-y-6">
      {/* 8 Top KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/documents')}>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">Total Documents</span>
            <span className="text-xl font-bold text-slate-200">{totalDocs}</span>
          </div>
        </div>

        {/* Total Equipment */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/maintenance')}>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">Plant Assets</span>
            <span className="text-xl font-bold text-slate-200">{totalEquip}</span>
          </div>
        </div>

        {/* AI Queries Today */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/chat')}>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">AI Queries Today</span>
            <span className="text-xl font-bold text-slate-200">{aiQueriesToday}</span>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/compliance')}>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">Compliance Score</span>
            <span className="text-xl font-bold text-emerald-400">{complianceScore}%</span>
          </div>
        </div>

        {/* Active Maintenance Tasks */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/maintenance')}>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">Active Tasks</span>
            <span className="text-xl font-bold text-slate-200">{activeTasks}</span>
          </div>
        </div>

        {/* Pending Inspections */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/compliance')}>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">Pending Audits</span>
            <span className="text-xl font-bold text-slate-200">{pendingInspections}</span>
          </div>
        </div>

        {/* Critical Assets */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-rose-500/30 transition-colors cursor-pointer" onClick={() => navigate('/maintenance')}>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">Critical Assets</span>
            <span className="text-xl font-bold text-rose-400">{criticalAssets}</span>
          </div>
        </div>

        {/* Overall Plant Health */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/analytics')}>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Heart className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="block text-slate-500 text-xs font-semibold uppercase">Overall Health</span>
            <span className="text-xl font-bold text-indigo-400">{overallPlantHealth}%</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Side Columns Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Side: 4 Core Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Section 1 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Equipment Health Trend Area Chart */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <h3 className="text-sm font-semibold text-slate-350 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Asset Health Trend (7 days)
              </h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthTrendData} margin={{ left: -25, right: 10, top: 10 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                    <Area type="monotone" dataKey="P101" name="Pump P101" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" strokeWidth={2} />
                    <Area type="monotone" dataKey="C303" name="Compressor C303" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.05)" strokeWidth={2} />
                    <Area type="monotone" dataKey="B202" name="Boiler B202" stroke="#ef4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Maintenance Cost Stacked Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <h3 className="text-sm font-semibold text-slate-350 mb-4">Maintenance Spend ($ Monthly)</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceCostData} margin={{ left: -15, right: 10, top: 10 }}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Preventive" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Reactive" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart Section 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Document Categories Pie Chart */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-slate-350 mb-2">Ingested Knowledge Base Categories</h3>
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={docCategoriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {docCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="text-xs space-y-1.5 ml-4 flex-shrink-0 pr-4">
                  {docCategoriesData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-slate-400 font-medium truncate w-24">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment Downtime Chart */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <h3 className="text-sm font-semibold text-slate-350 mb-4">Equipment Monthly Downtime (Hours)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={downtimeData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                    <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Bar dataKey="hours" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: AI Recommendations & Recent Activities */}
        <div className="space-y-6">
          
          {/* AI Recommendations Panel */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 animate-pulse" /> AI Preventive Actions
              </h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">GenAI</span>
            </div>
            
            <div className="space-y-3.5">
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-indigo-500/35 transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="font-semibold text-xs text-slate-200">{rec.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      rec.priority === 'High' ? 'bg-rose-500/15 text-rose-450' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-450 leading-relaxed">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Plant Site Handover Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((act, actIdx) => (
                  <li key={act.id}>
                    <div className="relative pb-6">
                      {actIdx !== recentActivities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-800" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-slate-900 ${
                            act.type === 'upload' ? 'bg-indigo-500/10 text-indigo-400' :
                            act.type === 'compliance' ? 'bg-amber-500/10 text-amber-400' :
                            act.type === 'incident' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            <TrendingUp className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-xs text-slate-350 font-medium">
                              {act.detail} <span className="text-[10px] text-slate-500 font-mono">by {act.user}</span>
                            </p>
                          </div>
                          <div className="text-right text-[10px] whitespace-nowrap text-slate-500 font-mono">
                            {act.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
