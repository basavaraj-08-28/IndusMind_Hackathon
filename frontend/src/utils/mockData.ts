export interface Equipment {
  id: string;
  name: string;
  category: 'Pump' | 'Boiler' | 'Compressor' | 'Turbine' | 'Generator';
  location: string;
  healthScore: number; // 0-100
  rul: number; // Remaining Useful Life in days
  riskScore: number; // 0-100
  status: 'Healthy' | 'Warning' | 'Critical';
  lastMaintenance: string;
  nextMaintenance: string;
  technician: string;
  spareParts: string[];
}

export interface Document {
  id: string;
  name: string;
  category: 'SOP' | 'Manual' | 'Maintenance Log' | 'Inspection Report' | 'Compliance Standard' | 'Drawing';
  uploadDate: string;
  status: 'Processed' | 'Processing' | 'Failed';
  extractedEntities: {
    equipment?: string;
    technician?: string;
    date?: string;
    regulations?: string;
    criticality?: string;
  };
  tags: string[];
  size: string;
  contentSummary: string;
}

export interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  taskName: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  assignedTo: string;
  cost: number;
}

export interface Incident {
  id: string;
  title: string;
  equipmentId?: string;
  equipmentName?: string;
  date: string;
  type: 'Failure' | 'Near Miss' | 'Safety Violation' | 'Leak';
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  rootCause: string;
  preventiveAction: string;
  status: 'Resolved' | 'Investigating' | 'Open';
  location: string; // for heatmap simulation e.g., 'Zone A', 'Zone B', etc.
}

export interface ComplianceGap {
  id: string;
  regulation: string;
  deviation: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Addressed';
  equipmentId?: string;
  equipmentName?: string;
  dueDate: string;
}

// Initial Mock Datasets
export const initialEquipment: Equipment[] = [
  {
    id: 'P-101',
    name: 'Centrifugal Pump P101',
    category: 'Pump',
    location: 'Zone A - Fluid Processing',
    healthScore: 92,
    rul: 120,
    riskScore: 15,
    status: 'Healthy',
    lastMaintenance: '2026-05-10',
    nextMaintenance: '2026-09-10',
    technician: 'Marcus Vance',
    spareParts: ['Impeller', 'Mechanical Seal', 'Ball Bearings'],
  },
  {
    id: 'B-202',
    name: 'Steam Boiler B202',
    category: 'Boiler',
    location: 'Zone B - Steam Generation Unit',
    healthScore: 48,
    rul: 14,
    riskScore: 78,
    status: 'Critical',
    lastMaintenance: '2025-11-15',
    nextMaintenance: '2026-07-20',
    technician: 'Sarah Jenkins',
    spareParts: ['Pressure Valve', 'Gaskets', 'Water Level Indicator'],
  },
  {
    id: 'C-303',
    name: 'Reciprocating Compressor C303',
    category: 'Compressor',
    location: 'Zone C - Gas Compression Station',
    healthScore: 72,
    rul: 45,
    riskScore: 42,
    status: 'Warning',
    lastMaintenance: '2026-03-04',
    nextMaintenance: '2026-08-04',
    technician: 'David Miller',
    spareParts: ['Piston Rings', 'Suction Valve', 'Oil Filter'],
  },
  {
    id: 'T-401',
    name: 'Gas Turbine T401',
    category: 'Turbine',
    location: 'Zone D - Power Generator Area',
    healthScore: 89,
    rul: 95,
    riskScore: 20,
    status: 'Healthy',
    lastMaintenance: '2026-01-20',
    nextMaintenance: '2026-07-30',
    technician: 'Marcus Vance',
    spareParts: ['Rotor Blade', 'Combustion Liner', 'Thermal Couple'],
  },
  {
    id: 'G-501',
    name: 'Emergency Generator G501',
    category: 'Generator',
    location: 'Zone E - Back-up Power Plant',
    healthScore: 65,
    rul: 30,
    riskScore: 55,
    status: 'Warning',
    lastMaintenance: '2026-04-12',
    nextMaintenance: '2026-08-12',
    technician: 'Sarah Jenkins',
    spareParts: ['Fuel Injector', 'Alternator Belt', 'Spark Plugs'],
  }
];

export const initialDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Standard Operating Procedure - Pump P101 Startup.pdf',
    category: 'SOP',
    uploadDate: '2026-06-01',
    status: 'Processed',
    extractedEntities: {
      equipment: 'Centrifugal Pump P101',
      technician: 'Marcus Vance',
      date: '2026-05-10',
      regulations: 'OSHA 1910.147 (LOTO)',
      criticality: 'High',
    },
    tags: ['SOP', 'Fluid Processing', 'LOTO', 'Pump P101'],
    size: '2.4 MB',
    contentSummary: 'This document details the startup procedures and sequence for the Centrifugal Pump P101, including pre-checks, alignment verification, lubrication monitoring, and Lockout/Tagout (LOTO) protocols according to OSHA standards.',
  },
  {
    id: 'doc-2',
    name: 'Boiler B202 Operating Manual.pdf',
    category: 'Manual',
    uploadDate: '2026-06-10',
    status: 'Processed',
    extractedEntities: {
      equipment: 'Steam Boiler B202',
      date: '2024-10-15',
      regulations: 'ASME Section I (Boilers)',
      criticality: 'Critical',
    },
    tags: ['Manual', 'Steam Unit', 'ASME', 'Boiler B202'],
    size: '12.8 MB',
    contentSummary: 'Manufacturer operation manual for the high-pressure Steam Boiler B202. Outlines technical specs, maximum design pressure (650 psi), water quality requirements, purge cycles, burner ignition, and emergency shutdown thresholds.',
  },
  {
    id: 'doc-3',
    name: 'Compressor C303 Maintenance Log - Q1 2026.xlsx',
    category: 'Maintenance Log',
    uploadDate: '2026-07-02',
    status: 'Processed',
    extractedEntities: {
      equipment: 'Reciprocating Compressor C303',
      technician: 'David Miller',
      date: '2026-03-04',
      criticality: 'Medium',
    },
    tags: ['Maintenance Log', 'Gas Station', 'Compressor C303', 'Q1'],
    size: '1.2 MB',
    contentSummary: 'Quarterly maintenance logging for Reciprocating Compressor C303. Details replacement of suction valves, piston ring wear inspections, oil changes, vibration analysis reports, and technician feedback.',
  },
  {
    id: 'doc-4',
    name: 'Inspection Report - Safety Valve Verification B202.pdf',
    category: 'Inspection Report',
    uploadDate: '2026-07-10',
    status: 'Processed',
    extractedEntities: {
      equipment: 'Steam Boiler B202',
      technician: 'Sarah Jenkins',
      date: '2026-07-05',
      regulations: 'OISD Standard 177',
      criticality: 'High',
    },
    tags: ['Inspection Report', 'Safety Valve', 'Boiler B202', 'OISD'],
    size: '3.1 MB',
    contentSummary: 'Annual safety relief valve inspection for Steam Boiler B202. Valves were bench-tested at set pressure of 600 psi. Valve B202-SV-A passed, but Valve B202-SV-B showed minor seat leakage and pressure drift.',
  },
  {
    id: 'doc-5',
    name: 'Factory Act 1948 - Chapter IV (Safety).pdf',
    category: 'Compliance Standard',
    uploadDate: '2026-05-20',
    status: 'Processed',
    extractedEntities: {
      regulations: 'Factory Act 1948',
      criticality: 'Critical',
    },
    tags: ['Regulation', 'Factory Act', 'Compliance', 'Legal'],
    size: '8.4 MB',
    contentSummary: 'Statutory compliance document from the Factory Act 1948, Chapter IV, outlining regulations regarding fencing of machinery, work on or near machinery in motion, employment of young persons on dangerous machines, and lifting tackles.',
  }
];

export const initialMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'task-101',
    equipmentId: 'B-202',
    equipmentName: 'Steam Boiler B202',
    taskName: 'Replace Overpressure Valve SV-B',
    priority: 'High',
    status: 'Pending',
    dueDate: '2026-07-20',
    assignedTo: 'Sarah Jenkins',
    cost: 4500,
  },
  {
    id: 'task-102',
    equipmentId: 'C-303',
    equipmentName: 'Reciprocating Compressor C303',
    taskName: 'Oil Filter and Gasket Replacement',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2026-08-04',
    assignedTo: 'David Miller',
    cost: 1200,
  },
  {
    id: 'task-103',
    equipmentId: 'G-501',
    equipmentName: 'Emergency Generator G501',
    taskName: 'Replace Alternator Belt',
    priority: 'Low',
    status: 'Pending',
    dueDate: '2026-08-12',
    assignedTo: 'Sarah Jenkins',
    cost: 450,
  },
  {
    id: 'task-104',
    equipmentId: 'P-101',
    equipmentName: 'Centrifugal Pump P101',
    taskName: 'Vibration Analysis & Bearing Lubrication',
    priority: 'Low',
    status: 'Completed',
    dueDate: '2026-05-10',
    assignedTo: 'Marcus Vance',
    cost: 300,
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'inc-901',
    title: 'Compressor C303 Overheating & Shutdown',
    equipmentId: 'C-303',
    equipmentName: 'Reciprocating Compressor C303',
    date: '2026-03-02',
    type: 'Failure',
    severity: 'Major',
    description: 'Compressor experienced sudden discharge temperature spike reaching 145°C. Built-in thermal trip sensor activated and shut down the machinery, halting production in Gas Station 1 for 4 hours.',
    rootCause: 'Lack of lubricating oil flow due to an oil filter blockage. This restricted heat dissipation and led to piston cylinder friction overheating.',
    preventiveAction: 'Incorporate differential pressure gauges across the oil filter to flag clogging. Update PM schedule to perform oil filter inspection every 90 days instead of 180 days.',
    status: 'Resolved',
    location: 'Zone C - Gas Compression',
  },
  {
    id: 'inc-902',
    title: 'Boiler Steam Pipe Near Miss Valve Leak',
    equipmentId: 'B-202',
    equipmentName: 'Steam Boiler B202',
    date: '2026-07-05',
    type: 'Near Miss',
    severity: 'Critical',
    description: 'Inspection engineer noted hissing sound from high-pressure superheater steam pipe connection. Thermal imaging cameras revealed steam micro-leakage around gasket flange at 520°C.',
    rootCause: 'Thermal stress fatigue of the gasket flange from excessive thermal cycling during peak production hours.',
    preventiveAction: 'Immediate deployment of lockouts. Replacing flange gasket with standard high-strength graphite composite gasket. Install permanent continuous thermal scanning monitors.',
    status: 'Investigating',
    location: 'Zone B - Steam Generation',
  },
  {
    id: 'inc-903',
    title: 'Near Miss: Improper LOTO on Turbine T401',
    equipmentId: 'T-401',
    equipmentName: 'Gas Turbine T401',
    date: '2026-06-25',
    type: 'Safety Violation',
    severity: 'Major',
    description: 'Subcontractor technician attempted to inspect the exhaust cowling of T401 without verifying that the main electrical control valve was physically locked out in the control room.',
    rootCause: 'Communication failure between the supervisor shift handover and the subcontractor crew. SOP checklist was signed off but lock not physically placed.',
    preventiveAction: 'Retrain all technicians on absolute Lockout/Tagout (LOTO) protocols. Implement digital safety-tag validation system via mobile tablets before physical access is granted.',
    status: 'Resolved',
    location: 'Zone D - Power Generator',
  }
];

export const initialComplianceGaps: ComplianceGap[] = [
  {
    id: 'gap-301',
    regulation: 'Factory Act 1948 Sec 21 (Machinery Fencing)',
    deviation: 'Belts and gears on Emergency Generator G501 lack permanent physical protective guard mesh.',
    riskLevel: 'High',
    status: 'Open',
    equipmentId: 'G-501',
    equipmentName: 'Emergency Generator G501',
    dueDate: '2026-07-31',
  },
  {
    id: 'gap-302',
    regulation: 'ASME Section I / OISD Standard 177',
    deviation: 'Steam Boiler B202 safety relief valve SV-B seat leakage exceeding limits. Recertification documentation expired on 2026-07-01.',
    riskLevel: 'High',
    status: 'Open',
    equipmentId: 'B-202',
    equipmentName: 'Steam Boiler B202',
    dueDate: '2026-07-20',
  },
  {
    id: 'gap-303',
    regulation: 'OSHA 1910.303 (Electrical Safety)',
    deviation: 'Control Panel terminal box wiring for Centrifugal Pump P101 has minor insulation wear exposing internal conductor.',
    riskLevel: 'Medium',
    status: 'Open',
    equipmentId: 'P-101',
    equipmentName: 'Centrifugal Pump P101',
    dueDate: '2026-08-15',
  }
];

// In-memory data store with localStorage sync
class IndusMindMockStore {
  private getStoreItem<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    try {
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private setStoreItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getEquipment(): Equipment[] {
    return this.getStoreItem('im_equipment', initialEquipment);
  }

  saveEquipment(eq: Equipment[]) {
    this.setStoreItem('im_equipment', eq);
  }

  getDocuments(): Document[] {
    return this.getStoreItem('im_documents', initialDocuments);
  }

  saveDocuments(docs: Document[]) {
    this.setStoreItem('im_documents', docs);
  }

  getMaintenanceTasks(): MaintenanceTask[] {
    return this.getStoreItem('im_maintenance', initialMaintenanceTasks);
  }

  saveMaintenanceTasks(tasks: MaintenanceTask[]) {
    this.setStoreItem('im_maintenance', tasks);
  }

  getIncidents(): Incident[] {
    return this.getStoreItem('im_incidents', initialIncidents);
  }

  saveIncidents(inc: Incident[]) {
    this.setStoreItem('im_incidents', inc);
  }

  getComplianceGaps(): ComplianceGap[] {
    return this.getStoreItem('im_compliance', initialComplianceGaps);
  }

  saveComplianceGaps(gaps: ComplianceGap[]) {
    this.setStoreItem('im_compliance', gaps);
  }

  resetAll() {
    localStorage.removeItem('im_equipment');
    localStorage.removeItem('im_documents');
    localStorage.removeItem('im_maintenance');
    localStorage.removeItem('im_incidents');
    localStorage.removeItem('im_compliance');
  }
}

export const mockStore = new IndusMindMockStore();
