import { useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  NodeTypes,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store';
import AgentNode from './AgentNode';
import { agentAccent, agentAccentSoft, STATE } from '../lib/colors';

const nodeTypes: NodeTypes = { agent: AgentNode };

function layoutAgents(count: number) {
  const positions: Array<{ x: number; y: number }> = [];
  const cx = 0, cy = 0;
  if (count <= 1) {
    positions.push({ x: cx, y: cy });
    return positions;
  }
  const ring1Count = Math.min(6, count - 1);
  const ring2Count = count - 1 - ring1Count;
  positions.push({ x: cx, y: cy });
  const radius1 = 220;
  for (let i = 0; i < ring1Count; i++) {
    const angle = (i / ring1Count) * Math.PI * 2 - Math.PI / 2;
    positions.push({ x: cx + radius1 * Math.cos(angle), y: cy + radius1 * Math.sin(angle) });
  }
  const radius2 = 420;
  for (let i = 0; i < ring2Count; i++) {
    const angle = (i / ring2Count) * Math.PI * 2 - Math.PI / 2 + Math.PI / ring2Count;
    positions.push({ x: cx + radius2 * Math.cos(angle), y: cy + radius2 * Math.sin(angle) });
  }
  return positions;
}

export default function Workspace() {
  const agents = useStore(s => s.agents);
  const agentIndex = useStore(s => s.agentIndex);
  const agentRuntime = useStore(s => s.agentRuntime);
  const selectAgent = useStore(s => s.selectAgent);
  const selectedAgent = useStore(s => s.selectedAgent);

  const nodes: Node[] = useMemo(() => {
    const orderedAgents = [...agents].sort((a, b) => {
      if (a.name === 'project-lead') return -1;
      if (b.name === 'project-lead') return 1;
      return a.name.localeCompare(b.name);
    });
    const positions = layoutAgents(orderedAgents.length);
    return orderedAgents.map((a, i) => {
      const rt = agentRuntime.get(a.name);
      return {
        id: a.name,
        type: 'agent',
        position: positions[i],
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          name: a.name,
          index: agentIndex.get(a.name) ?? i,
          status: rt?.status ?? 'idle',
          activeInvocations: rt?.activeInvocations ?? 0,
          recentTools: rt?.recentToolCalls.filter(t => t.status === 'running').length ?? 0,
          selected: selectedAgent === a.name
        }
      } as Node;
    });
  }, [agents, agentIndex, agentRuntime, selectedAgent]);

  const edges: Edge[] = useMemo(() => {
    const out: Edge[] = [];
    const seen = new Set<string>();
    for (const a of agents) {
      const idx = agentIndex.get(a.name) ?? 0;
      const fromActive = agentRuntime.get(a.name)?.status === 'running';
      for (const c of a.collaborators) {
        if (!agentIndex.has(c)) continue;
        const key = [a.name, c].sort().join('::');
        if (seen.has(key)) continue;
        seen.add(key);
        const toActive = agentRuntime.get(c)?.status === 'running';
        const live = fromActive && toActive;
        out.push({
          id: `e-${a.name}-${c}`,
          source: a.name,
          target: c,
          style: {
            stroke: live ? agentAccent(idx) : STATE.edgeStatic,
            strokeWidth: live ? 2 : 1,
            opacity: live ? 0.9 : 0.5
          },
          animated: live
        });
      }
    }
    return out;
  }, [agents, agentIndex, agentRuntime]);

  const onNodeClick = useCallback((_e: any, node: Node) => {
    selectAgent(node.id);
  }, [selectAgent]);

  const onPaneClick = useCallback(() => {
    selectAgent(null);
  }, [selectAgent]);

  return (
    <div className="workspace">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.5, maxZoom: 1.2 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={1} color="hsl(225 8% 18%)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
