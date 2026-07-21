import React from 'react';
import { 
  Download, FileText, Calendar, Wrench, ShieldAlert, Cpu, 
  Settings, CheckCircle, BarChart3, AlertCircle
} from 'lucide-react';
import { mockStore } from '../utils/mockData';

export const Reports: React.FC = () => {

  const handleDownload = (type: string) => {
    let title = '';
    let reportContent = '';
    const dateStr = new Date().toISOString().split('T')[0];

    const equipment = mockStore.getEquipment();
    const tasks = mockStore.getMaintenanceTasks();
    const compliance = mockStore.getComplianceGaps();
    const incidents = mockStore.getIncidents();

    switch (type) {
      case 'maintenance':
        title = `indusmind_maintenance_report_${dateStr}`;
        reportContent = `INDUSMIND AI - PREVENTIVE MAINTENANCE REPORT
Report Date: ${new Date().toLocaleDateString()}
Total Equipment Tracked: ${equipment.length}
Pending Preventive Actions: ${tasks.filter(t => t.status !== 'Completed').length}

EQUIPMENT HEALTH RATINGS:
${equipment.map(e => `- ${e.name} (${e.id}): Health: ${e.healthScore}% | RUL: ${e.rul} Days | Status: ${e.status}`).join('\n')}

ACTIVE PM TASKS LOGS:
${tasks.map(t => `- [${t.priority} PRIORITY] ${t.taskName} on ${t.equipmentName}\n  Assigned to: ${t.assignedTo} | Status: ${t.status} | Budget: $${t.cost}`).join('\n\n')}

System check verified. Report authorized for plant supervisor sign-off.`;
        break;

      case 'compliance':
        title = `indusmind_compliance_report_${dateStr}`;
        reportContent = `INDUSMIND AI - REGULATORY COMPLIANCE AUDIT
Report Date: ${new Date().toLocaleDateString()}
Checked standards: Factory Act 1948, OISD 177, ISO 14001

COMPLIANCE RISK GAP INVENTORY:
${compliance.map((g, i) => `${i+1}. [${g.riskLevel} RISK] Regulation: ${g.regulation}\n   Deviation details: ${g.deviation}\n   Status: ${g.status} | Due date: ${g.dueDate}`).join('\n\n')}

Overall statutory verification status: 84% Passed. Urgent action required on overpressure valves recertification.`;
        break;

      case 'incident':
        title = `indusmind_incident_investigation_${dateStr}`;
        reportContent = `INDUSMIND AI - INCIDENT FAILURE INVESTIGATION SUMMARY
Report Date: ${new Date().toLocaleDateString()}
Logged Near-Misses & Failures: ${incidents.length}

INCIDENT LOG DATABASE:
${incidents.map((inc, i) => `INCIDENT ${i+1}: ${inc.title} (${inc.type})\n- Date: ${inc.date} | Severity: ${inc.severity} | Location: ${inc.location}\n- Status: ${inc.status}\n- Summary: ${inc.description}\n- Root Cause (RCA): ${inc.rootCause}\n- Action: ${inc.preventiveAction}`).join('\n\n')}

End of incident report docket.`;
        break;

      default:
        title = `indusmind_executive_summary_${dateStr}`;
        reportContent = `INDUSMIND AI - PLANT EXECUTIVE SUMMARY
Report Date: ${new Date().toLocaleDateString()}
======================================================
Plant Health Rating: 78% Compliant
Active Maintenance Tickets: ${tasks.filter(t => t.status !== 'Completed').length}
Unresolved Regulatory Gaps: ${compliance.filter(c => c.status === 'Open').length}
Active Vector Ingestions count: 5 files

RECOMMENDED ACTION CHECKLIST:
1. Schedule Steam Boiler B202 overhaul before 2026-07-20.
2. Resolve fencing mesh guards deviation on Generator G501.
3. Conduct differential pressure check on Compressor C303.

Prepared and compiled by IndusMind AI Ingestion Engine.`;
    }

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.txt`;
    link.click();
  };

  const reportCards = [
    {
      id: 'exec',
      title: 'Executive Plant Summary',
      desc: 'High-level dashboard parameters, overall plant health index, and quick priority checklists.',
      type: 'executive',
      icon: BarChart3,
    },
    {
      id: 'maint',
      title: 'Preventive Maintenance Report',
      desc: 'Asset health score indices, remaining useful life predictions, and upcoming PM task logs.',
      type: 'maintenance',
      icon: Wrench,
    },
    {
      id: 'comp',
      title: 'Regulatory Compliance Audit',
      desc: 'ISO standards audit checklist, statutory deviations log, and compliance timeline checks.',
      type: 'compliance',
      icon: ShieldAlert,
    },
    {
      id: 'incident',
      title: 'Incident Failure Digest',
      desc: 'Historical failures log, near-miss summaries, and AI-generated Root Cause Analysis data.',
      type: 'incident',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Cards list */}
      <div className="grid md:grid-cols-2 gap-6">
        {reportCards.map((card) => (
          <div 
            key={card.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <card.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">{card.title}</h4>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed mb-6">
                {card.desc}
              </p>
            </div>

            <button
              onClick={() => handleDownload(card.type)}
              className="flex items-center justify-center gap-2 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-850 hover:text-white text-slate-350 text-xs font-semibold rounded-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download Report Summary (.TXT)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
