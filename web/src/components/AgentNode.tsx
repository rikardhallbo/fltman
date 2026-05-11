import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { agentAccent, agentAccentSoft } from '../lib/colors';

interface Data {
  name: string;
  index: number;
  status: 'idle' | 'running' | 'delivered' | 'failed' | 'waiting';
  activeInvocations: number;
  recentTools: number;
  selected?: boolean;
}

function AgentNode({ data }: { data: Data }) {
  const accent = agentAccent(data.index);
  const accentSoft = agentAccentSoft(data.index, 0.4);
  const active = data.status === 'running';

  const ringOpacity = active ? 1 : 0.35;
  const monogram = data.name.replace(/-/g, ' ').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={`agent-node status-${data.status} ${active ? 'active' : ''} ${data.selected ? 'selected' : ''}`}
      style={{
        ['--accent' as any]: accent,
        ['--accent-soft' as any]: accentSoft,
        ['--ring-opacity' as any]: ringOpacity
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="ring" />
      <div className="core">
        <div className="monogram">{monogram}</div>
      </div>
      {data.activeInvocations > 1 && (
        <div className="badge">×{data.activeInvocations}</div>
      )}
      {active && <div className="pulse" />}
      <div className="label">{data.name}</div>
      {data.recentTools > 0 && active && (
        <div className="tool-indicator">{data.recentTools} tools</div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export default memo(AgentNode);
