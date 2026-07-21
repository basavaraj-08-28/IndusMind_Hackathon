import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStore, Equipment, MaintenanceTask } from '../utils/mockData';
import { 
  Wrench, Activity, AlertTriangle, ShieldAlert, CheckCircle, 
  Calendar, User, Plus, CheckSquare, Sparkles, PlusCircle
} from 'lucide-react';

export const Maintenance: React.FC = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [selectedEqId, setSelectedEqId] = useState<string>('');
  
  // New PM Task Form State
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [cost, setCost] = useState('1000');

  useEffect(() => {
    setEquipment(mockStore.getEquipment());
    setTasks(mockStore.getMaintenanceTasks());
  }, []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId || !taskName || !dueDate) return;

    const matchedEq = equipment.find(eq => eq.id === selectedEqId);
    if (!matchedEq) return;

    const newTask: MaintenanceTask = {
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      equipmentId: selectedEqId,
      equipmentName: matchedEq.name,
      taskName,
      priority,
      status: 'Pending',
      dueDate,
      assignedTo: assignedTo || 'Marcus Vance',
      cost: parseFloat(cost) || 0,
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    mockStore.saveMaintenanceTasks(updated);

    // Reset Form
    setTaskName('');
    setDueDate('');
    setAssignedTo('');
    setCost('1000');
    setShowForm(false);
  };

  const handleToggleStatus = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus: 'Pending' | 'In Progress' | 'Completed' = 
          t.status === 'Pending' ? 'In Progress' :
          t.status === 'In Progress' ? 'Completed' : 'Pending';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    mockStore.saveMaintenanceTasks(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Asset summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((eq) => {
          const healthColor = 
            eq.status === 'Healthy' ? 'border-emerald-500/35 bg-emerald-500/5 text-emerald-450' :
            eq.status === 'Warning' ? 'border-amber-500/35 bg-amber-500/5 text-amber-400' :
            'border-rose-500/35 bg-rose-500/5 text-rose-400';

          return (
            <div key={eq.id} className={`p-5 rounded-2xl border ${healthColor} shadow-md`}>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{eq.category} Asset</span>
                  <h4 className="text-xs font-bold text-slate-200 mt-0.5">{eq.name}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  eq.status === 'Healthy' ? 'bg-emerald-500/10' :
                  eq.status === 'Warning' ? 'bg-amber-500/10' : 'bg-rose-500/10 text-rose-450 animate-pulse'
                }`}>
                  {eq.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-800/60">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Health</span>
                  <span className="text-sm font-extrabold text-slate-200 mt-0.5 block">{eq.healthScore}%</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-550 uppercase">RUL (Days)</span>
                  <span className={`text-sm font-extrabold mt-0.5 block ${eq.rul < 30 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {eq.rul}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-550 uppercase">Risk Level</span>
                  <span className="text-sm font-extrabold text-slate-200 mt-0.5 block">{eq.riskScore}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduler Form and PM Schedule timeline */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* PM checklist */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-indigo-400" /> Maintenance Schedule Operations
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-650/80 transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule PM Task</span>
            </button>
          </div>

          {/* New Task Inline Form Panel */}
          {showForm && (
            <form onSubmit={handleCreateTask} className="p-4 bg-slate-950/80 rounded-xl border border-slate-850 mb-6 space-y-4 animate-in slide-in-from-top duration-250">
              <h4 className="text-xs font-bold text-slate-200">New Preventive Schedule parameters</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Target Machinery</label>
                  <select
                    value={selectedEqId}
                    onChange={(e) => setSelectedEqId(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="">Select Equipment...</option>
                    {equipment.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Action Name</label>
                  <input
                    type="text"
                    required
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g. Flange Replacement"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-250 placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Priority Scale</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Timeline Due</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Lead Operator</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g., Sarah Jenkins"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Budget ($ Cost)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  />
                </div>
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
                  Save Schedule
                </button>
              </div>
            </form>
          )}

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-950 text-slate-450 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">SOP Task</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-300">{task.equipmentName}</td>
                    <td className="p-3 font-medium text-slate-350">{task.taskName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        task.priority === 'High' ? 'bg-rose-500/10 text-rose-405' :
                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleStatus(task.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-bold hover:underline transition-all ${
                          task.status === 'Completed' ? 'text-emerald-450' :
                          task.status === 'In Progress' ? 'text-indigo-400 animate-pulse' :
                          'text-slate-450'
                        }`}
                      >
                        {task.status === 'Completed' ? <CheckSquare className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                        {task.status}
                      </button>
                    </td>
                    <td className="p-3 font-mono">{task.dueDate}</td>
                    <td className="p-3 text-right font-mono font-semibold">${task.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: AI predictive analysis details */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> AI Prognostics Report
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              AI has analyzed vibrations telemetry and document logs:
            </p>
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-950 border border-rose-500/20 rounded-xl">
                <h4 className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> B202 Boiler Valve Defect
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Remaining Useful Life (RUL) of Boiler B202 safety valve drops below critical threshold (14 days left). Scheduled overhaul is highly recommended.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl">
                <h4 className="text-[11px] font-bold text-slate-200 uppercase">
                  Normal Operations
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Centrifugal Pump P101 telemetry signals steady alignment levels. Lubricant change completed. Wear indicator is in green bands.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
