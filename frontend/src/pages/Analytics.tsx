import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid
} from 'recharts';
import { BarChart3, Activity, TrendingUp, Calendar, Zap } from 'lucide-react';

export const Analytics: React.FC = () => {
  
  // Chart 1: Equipment Failure Trend (Monthly)
  const failureTrendData = [
    { month: 'Jan', Failures: 1, NearMisses: 2 },
    { month: 'Feb', Failures: 0, NearMisses: 1 },
    { month: 'Mar', Failures: 3, NearMisses: 4 }, // Compressor breakdown
    { month: 'Apr', Failures: 1, NearMisses: 2 },
    { month: 'May', Failures: 0, NearMisses: 3 },
    { month: 'Jun', Failures: 1, NearMisses: 1 },
  ];

  // Chart 2: Compliance Trend (% Score over time)
  const complianceTrendData = [
    { quarter: 'Q1 2025', Score: 78 },
    { quarter: 'Q2 2025', Score: 80 },
    { quarter: 'Q3 2025', Score: 85 },
    { quarter: 'Q4 2025', Score: 82 },
    { quarter: 'Q1 2026', Score: 89 },
    { quarter: 'Q2 2026', Score: 84 },
  ];

  // Chart 3: AI Vector Store Growth (Chunks count)
  const docGrowthData = [
    { week: 'Wk 1', SOPs: 15, Drawings: 5, Regulations: 10 },
    { week: 'Wk 2', SOPs: 20, Drawings: 8, Regulations: 12 },
    { week: 'Wk 3', SOPs: 28, Drawings: 12, Regulations: 15 },
    { week: 'Wk 4', SOPs: 42, Drawings: 18, Regulations: 18 },
  ];

  // Chart 4: AI Queries vs Ingestion load
  const aiUsageData = [
    { day: '07/10', Queries: 120, FilesIngested: 2 },
    { day: '07/11', Queries: 135, FilesIngested: 5 },
    { day: '07/12', Queries: 98, FilesIngested: 1 },
    { day: '07/13', Queries: 154, FilesIngested: 8 },
    { day: '07/14', Queries: 142, FilesIngested: 3 },
  ];

  // Inspection status distribution
  const inspectionPie = [
    { name: 'Completed', value: 75, color: '#10b981' },
    { name: 'Overdue', value: 15, color: '#ef4444' },
    { name: 'Scheduled', value: 10, color: '#6366f1' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top statistics banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Total Computations</span>
          <span className="text-lg font-bold text-slate-200 block mt-1">12.4M Ops</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Mean Time to Resolve</span>
          <span className="text-lg font-bold text-slate-200 block mt-1">2.4 Hours</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Active Vector Nodes</span>
          <span className="text-lg font-bold text-slate-200 block mt-1">75 Chunks</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Gemini Inferences</span>
          <span className="text-lg font-bold text-slate-200 block mt-1">456 Queries</span>
        </div>
      </div>

      {/* Grid containing charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Failure vs Near Misses Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-350 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-455" /> Monthly Failure & Near Miss Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureTrendData} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Failures" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="NearMisses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Rating Line Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-350 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Compliance Rating History
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceTrendData} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Ingestion Growth stacked Area chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-350 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Vector Database Chunk Count Growth
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={docGrowthData} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="SOPs" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Drawings" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Regulations" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage stats Area chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-350 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> AI Queries vs Ingestions Volume
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiUsageData} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Queries" stroke="#a855f7" fill="rgba(168, 85, 247, 0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="FilesIngested" stroke="#14b8a6" fill="rgba(20, 184, 166, 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
