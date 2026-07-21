import React, { useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Cpu, FileText, User, Settings, ShieldCheck, Hammer, Layers, AlertCircle } from 'lucide-react';

// Custom Node Types could be defined, but standard nodes with classNames look superb.
const initialNodes: Node[] = [
  // Equipment (Root Nodes)
  {
    id: 'P-101',
    data: { label: 'Centrifugal Pump P101' },
    position: { x: 250, y: 150 },
    className: 'bg-indigo-650 text-white font-semibold py-2.5 px-4 rounded-xl border-2 border-indigo-500/50 shadow-md text-xs',
  },
  {
    id: 'B-202',
    data: { label: 'Steam Boiler B202' },
    position: { x: 650, y: 150 },
    className: 'bg-rose-900 text-white font-semibold py-2.5 px-4 rounded-xl border-2 border-rose-500/50 shadow-md text-xs',
  },

  // Manuals
  {
    id: 'doc-2',
    data: { label: 'Manual: B202 Boiler Manual' },
    position: { x: 500, y: 300 },
    className: 'bg-slate-900 text-cyan-400 py-2.5 px-4 rounded-xl border border-cyan-500/40 shadow-sm text-xs',
  },

  // SOPs
  {
    id: 'doc-1',
    data: { label: 'SOP: Pump P101 Startup' },
    position: { x: 100, y: 300 },
    className: 'bg-slate-900 text-indigo-400 py-2.5 px-4 rounded-xl border border-indigo-400/40 shadow-sm text-xs',
  },

  // Technicians
  {
    id: 'tech-marcus',
    data: { label: 'Marcus Vance (Lead Tech)' },
    position: { x: 280, y: 300 },
    className: 'bg-slate-900 text-emerald-400 py-2.5 px-4 rounded-xl border border-emerald-400/40 shadow-sm text-xs',
  },
  {
    id: 'tech-sarah',
    data: { label: 'Sarah Jenkins (Maint Eng)' },
    position: { x: 780, y: 300 },
    className: 'bg-slate-900 text-emerald-400 py-2.5 px-4 rounded-xl border border-emerald-400/40 shadow-sm text-xs',
  },

  // Compliance
  {
    id: 'doc-5',
    data: { label: 'Act: Factory Act 1948' },
    position: { x: 920, y: 250 },
    className: 'bg-slate-900 text-amber-500 py-2.5 px-4 rounded-xl border border-amber-500/40 shadow-sm text-xs',
  },
  {
    id: 'doc-4',
    data: { label: 'Insp: Boiler Safety Valve verification' },
    position: { x: 640, y: 300 },
    className: 'bg-slate-900 text-rose-450 py-2.5 px-4 rounded-xl border border-rose-500/40 shadow-sm text-xs',
  },

  // Spare Parts
  {
    id: 'part-impeller',
    data: { label: 'Part: Pump Impeller' },
    position: { x: 150, y: 30 },
    className: 'bg-slate-900 text-slate-300 py-2 px-3 rounded-xl border border-slate-700 shadow-sm text-xs',
  },
  {
    id: 'part-valve',
    data: { label: 'Part: Overpressure Valve' },
    position: { x: 800, y: 30 },
    className: 'bg-slate-900 text-slate-300 py-2 px-3 rounded-xl border border-slate-700 shadow-sm text-xs',
  }
];

const initialEdges: Edge[] = [
  // Relationships
  { id: 'e-p101-sop', source: 'P-101', target: 'doc-1', animated: true, style: { stroke: '#6366f1' } },
  { id: 'e-p101-tech', source: 'P-101', target: 'tech-marcus', style: { stroke: '#10b981' } },
  { id: 'e-p101-part', source: 'P-101', target: 'part-impeller', style: { stroke: '#cbd5e1' } },
  
  { id: 'e-b202-manual', source: 'B-202', target: 'doc-2', animated: true, style: { stroke: '#06b6d4' } },
  { id: 'e-b202-tech', source: 'B-202', target: 'tech-sarah', style: { stroke: '#10b981' } },
  { id: 'e-b202-insp', source: 'B-202', target: 'doc-4', animated: true, style: { stroke: '#ef4444' } },
  { id: 'e-b202-part', source: 'B-202', target: 'part-valve', style: { stroke: '#cbd5e1' } },
  { id: 'e-b202-compliance', source: 'B-202', target: 'doc-5', style: { stroke: '#f59e0b' } },
];

export const Graph: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const handleNodeClick = (_: any, node: Node) => {
    // Populate descriptive text based on node ID/category
    const id = node.id;
    let details: any = {
      title: node.data.label,
      type: 'Asset Dependency Node',
      description: 'Dynamic graph resource linked to plant operations.',
      meta: []
    };

    if (id === 'P-101') {
      details = {
        title: 'Centrifugal Pump P101',
        type: 'Equipment Asset',
        description: 'Zone A Fluid Processing. Crucial asset handling feed lines. Health Score is 92%. Under lock and key LOTO requirements.',
        meta: [
          { key: 'Model', value: 'FloMax 900' },
          { key: 'Last PM Check', value: '2026-05-10' },
          { key: 'Assigned Tech', value: 'Marcus Vance' }
        ]
      };
    } else if (id === 'B-202') {
      details = {
        title: 'Steam Boiler B202',
        type: 'Critical Equipment Asset',
        description: 'Zone B Steam Generator. High-temperature operation. Current Health Score is 48% (Critical) due to safety valve seal leaks.',
        meta: [
          { key: 'Design Pressure', value: '650 psi' },
          { key: 'Next PM Check', value: '2026-07-20' },
          { key: 'Risk Score', value: '78/100' }
        ]
      };
    } else if (id.startsWith('doc-')) {
      details = {
        title: node.data.label,
        type: 'Plant Document Resource',
        description: 'Ingested document split, chunked, and parsed in Vector DB. Used for RAG retrieval during AI inquiries.',
        meta: [
          { key: 'Type', value: id === 'doc-1' ? 'SOP Guidelines' : id === 'doc-2' ? 'Equipment Manual' : 'Safety Standard' },
          { key: 'Compliance', value: id === 'doc-5' ? 'Factory Act Sec 21' : 'OISD standard' }
        ]
      };
    } else if (id.startsWith('tech-')) {
      details = {
        title: node.data.label,
        type: 'Maintenance Technician',
        description: 'Licensed plant operations engineer authorized for mechanical checkups, welding LOTO, and instrument calibration.',
        meta: [
          { key: 'Affiliation', value: id === 'tech-marcus' ? 'Internal Operations' : 'Safety Specialist' }
        ]
      };
    } else if (id.startsWith('part-')) {
      details = {
        title: node.data.label,
        type: 'Spare Parts Inventory',
        description: 'Critical mechanical spares stocked in Warehouse C. Necessary for scheduled maintenance replacements.',
        meta: [
          { key: 'In Stock', value: id === 'part-valve' ? '2 units' : '4 units' },
          { key: 'Warehouse Location', value: 'Bin A-14' }
        ]
      };
    }

    setSelectedNode(details);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
      {/* React Flow Canvas */}
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          fitView
          className="bg-slate-900/40"
        >
          <Background color="#334155" gap={16} size={1} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              if (node.id === 'P-101' || node.id === 'B-202') return '#6366f1';
              if (node.id.startsWith('doc-')) return '#06b6d4';
              if (node.id.startsWith('tech-')) return '#10b981';
              return '#64748b';
            }}
            maskColor="rgba(15, 23, 42, 0.7)"
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
          />
        </ReactFlow>
      </div>

      {/* Floating Control Banner */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl max-w-xs backdrop-blur-md">
        <h4 className="text-xs font-bold text-slate-200 mb-1">Industrial Dependency Graph</h4>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Displays relations between machinery assets, engineers, manuals, and statutory regulations. Click nodes for detailed telemetry properties.
        </p>
      </div>

      {/* Slide-out details drawer on right */}
      {selectedNode && (
        <div className="w-80 h-full bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between z-20 animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded-full uppercase">
                {selectedNode.type}
              </span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-450 hover:text-slate-200 font-semibold"
              >
                Clear Node
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-100 mb-3">{selectedNode.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-850 mb-6">
              {selectedNode.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Node Metadata</h4>
              <div className="space-y-2">
                {selectedNode.meta.map((m: any, idx: number) => (
                  <div key={idx} className="flex justify-between border-b border-slate-850 pb-1.5 text-xs">
                    <span className="text-slate-500">{m.key}</span>
                    <span className="font-semibold text-slate-250">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-850">
            <span className="text-[9px] text-slate-600 font-mono">ID ref: {selectedNode.title.split(' ').pop()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
