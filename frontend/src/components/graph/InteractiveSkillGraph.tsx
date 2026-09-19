import React, { useState, useEffect, useRef } from 'react';
import { GraphData, GraphNode, GraphLink } from '../../types';
import { Sparkles, Layers, Briefcase, FileText, UserCheck, Info } from 'lucide-react';

interface InteractiveSkillGraphProps {
  data: GraphData | null;
  onSelectNode?: (node: GraphNode) => void;
}

export const InteractiveSkillGraph: React.FC<InteractiveSkillGraphProps> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.nodes && data.nodes.length > 0 && !selectedNode) {
      // Default selection to center person or first inferred skill
      const inferred = data.nodes.find((n) => n.type === 'inferred_skill') || data.nodes[0];
      setSelectedNode(inferred);
    }
  }, [data]);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
        Loading Living Skills Graph...
      </div>
    );
  }

  // Node color mapping
  const getNodeColor = (type: string, isInferred?: boolean) => {
    switch (type) {
      case 'person':
        return '#10b981'; // Emerald
      case 'project':
        return '#3b82f6'; // Blue
      case 'core_skill':
        return '#059669'; // Teal/Green
      case 'inferred_skill':
        return '#f59e0b'; // Amber
      case 'role':
        return '#8b5cf6'; // Purple
      default:
        return '#64748b';
    }
  };

  // Fixed visual coordinate layout algorithm for aesthetic display
  const width = 850;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;

  const positionedNodes = data.nodes.map((node, index) => {
    let x = centerX;
    let y = centerY;

    if (node.type === 'person') {
      x = centerX;
      y = centerY;
    } else if (node.type === 'project') {
      // Left side orbit
      const projNodes = data.nodes.filter((n) => n.type === 'project');
      const idx = projNodes.findIndex((n) => n.id === node.id);
      const angle = Math.PI * 0.75 + (idx * 0.6) - ((projNodes.length - 1) * 0.3);
      x = centerX + Math.cos(angle) * 260;
      y = centerY + Math.sin(angle) * 160;
    } else if (node.type === 'core_skill' || node.type === 'inferred_skill') {
      // Middle orbit
      const skillNodes = data.nodes.filter((n) => n.type === 'core_skill' || n.type === 'inferred_skill');
      const idx = skillNodes.findIndex((n) => n.id === node.id);
      const angle = (idx / skillNodes.length) * (Math.PI * 2) - Math.PI / 2;
      const radius = node.type === 'inferred_skill' ? 170 : 140;
      x = centerX + Math.cos(angle) * radius;
      y = centerY + Math.sin(angle) * (radius * 0.85);
    } else if (node.type === 'role') {
      // Right side orbit
      const roleNodes = data.nodes.filter((n) => n.type === 'role');
      const idx = roleNodes.findIndex((n) => n.id === node.id);
      const angle = -Math.PI * 0.25 + (idx * 0.5) - ((roleNodes.length - 1) * 0.25);
      x = centerX + Math.cos(angle) * 280;
      y = centerY + Math.sin(angle) * 180;
    }

    return { ...node, x, y };
  });

  const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
      
      {/* Graph Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Living Skills Knowledge Graph</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Multi-entity network mapping Projects $\to$ Core & Hidden Skills $\to$ Target Role Pathways
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Person</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Project</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span>Verified Skill</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>AI-Inferred Skill</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Target Role</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6">
        
        {/* SVG Network Canvas */}
        <div className="lg:col-span-3 bg-slate-950/70 rounded-xl border border-slate-800/80 p-2 overflow-x-auto flex items-center justify-center relative min-h-[460px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[850px] h-auto select-none">
            <defs>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Links */}
            {data.links.map((link, idx) => {
              const src = nodeMap.get(link.source);
              const tgt = nodeMap.get(link.target);
              if (!src || !tgt) return null;

              const isConnected =
                selectedNode && (selectedNode.id === src.id || selectedNode.id === tgt.id);

              return (
                <g key={idx}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isConnected ? '#10b981' : 'rgba(148, 163, 184, 0.2)'}
                    strokeWidth={isConnected ? 2.5 : 1.2}
                    strokeDasharray={src.type === 'inferred_skill' || tgt.type === 'inferred_skill' ? '4 3' : 'none'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {positionedNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const color = getNodeColor(node.type, node.is_inferred);

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer Pulsing Aura if selected/inferred */}
                  {(isSelected || node.type === 'inferred_skill') && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size + (isSelected ? 8 : 4)}
                      fill={color}
                      opacity={isSelected ? 0.25 : 0.15}
                      className={node.type === 'inferred_skill' ? 'animate-ping' : ''}
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={color}
                    stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isSelected ? 2.5 : 1}
                    className="shadow-lg"
                  />

                  {/* Node Label */}
                  <text
                    x={node.x}
                    y={node.y + node.size + 14}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none drop-shadow"
                  >
                    {node.name}
                  </text>

                  {/* Inside Symbol / Initials */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="10"
                    fontWeight="black"
                    className="pointer-events-none uppercase"
                  >
                    {node.name.slice(0, 2)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Inspector Side Panel */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
              <Info className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Node Inspector</h3>
            </div>

            {selectedNode ? (
              <div className="space-y-4 pt-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {selectedNode.category || selectedNode.type}
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-0.5">{selectedNode.name}</h4>
                  {selectedNode.title && (
                    <p className="text-xs text-emerald-400 font-medium">{selectedNode.title}</p>
                  )}
                </div>

                {selectedNode.proficiency && (
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Proficiency:</span>
                      <span className="font-bold text-emerald-400">{selectedNode.proficiency}</span>
                    </div>
                    {selectedNode.confidence_pct && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="font-bold text-slate-200">{selectedNode.confidence_pct}%</span>
                      </div>
                    )}
                    {selectedNode.is_inferred && (
                      <div className="pt-1 flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>AI-Inferred from incident patterns</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.description && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                    {selectedNode.description}
                  </p>
                )}

                {selectedNode.evidence && selectedNode.evidence.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">Linked Evidence:</span>
                    <ul className="text-xs text-slate-300 space-y-1 pl-3 list-disc">
                      {selectedNode.evidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 pt-6 text-center">
                Click any node in the graph to inspect its capability lineage and evidence.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Living Sync</span>
            <span className="text-emerald-400 font-medium">Real-time DB Graph</span>
          </div>
        </div>

      </div>
    </div>
  );
};
