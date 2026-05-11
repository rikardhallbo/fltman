import { create } from 'zustand';
import type { Agent, Invocation, Session, ToolCall, WsMessage } from './types';

interface AgentRuntime {
  status: 'idle' | 'running' | 'delivered' | 'failed' | 'waiting';
  activeInvocations: number;
  lastActivityAt: string | null;
  recentToolCalls: ToolCall[];
}

interface Store {
  agents: Agent[];
  agentIndex: Map<string, number>;
  agentRuntime: Map<string, AgentRuntime>;
  sessions: Session[];
  invocations: Invocation[];
  selectedAgent: string | null;
  connection: 'connecting' | 'open' | 'closed';
  lastEventAt: string | null;
  setAgents: (agents: Agent[]) => void;
  apply: (msg: WsMessage) => void;
  setConnection: (s: Store['connection']) => void;
  selectAgent: (name: string | null) => void;
}

function emptyRuntime(): AgentRuntime {
  return { status: 'idle', activeInvocations: 0, lastActivityAt: null, recentToolCalls: [] };
}

export const useStore = create<Store>((set, get) => ({
  agents: [],
  agentIndex: new Map(),
  agentRuntime: new Map(),
  sessions: [],
  invocations: [],
  selectedAgent: null,
  connection: 'connecting',
  lastEventAt: null,

  setAgents: (agents) => {
    const idx = new Map<string, number>();
    const runtime = new Map<string, AgentRuntime>();
    agents.forEach((a, i) => {
      idx.set(a.name, i);
      runtime.set(a.name, emptyRuntime());
    });
    set({ agents, agentIndex: idx, agentRuntime: runtime });
  },

  setConnection: (s) => set({ connection: s }),
  selectAgent: (name) => set({ selectedAgent: name }),

  apply: (msg) => {
    const state = get();
    const now = new Date().toISOString();
    set({ lastEventAt: now });

    if (msg.type === 'hello') {
      get().setAgents(msg.data.agents);
      set({ sessions: msg.data.sessions, invocations: msg.data.invocations });
      const rt = new Map(get().agentRuntime);
      for (const inv of msg.data.invocations) {
        if (inv.agent_name) {
          const r = rt.get(inv.agent_name) || emptyRuntime();
          if (inv.status === 'running') {
            r.status = 'running';
            r.activeInvocations += 1;
          } else if (inv.status === 'delivered') {
            r.status = r.activeInvocations > 0 ? 'running' : 'delivered';
          }
          r.lastActivityAt = inv.ended_at || inv.started_at;
          rt.set(inv.agent_name, r);
        }
      }
      set({ agentRuntime: rt });
      return;
    }

    if (msg.type === 'session.started') {
      set({ sessions: [...state.sessions.filter(s => s.id !== msg.data.id), msg.data] });
      return;
    }

    if (msg.type === 'invocation.started' && msg.data.agent_name) {
      const rt = new Map(state.agentRuntime);
      const r = { ...(rt.get(msg.data.agent_name) || emptyRuntime()) };
      r.status = 'running';
      r.activeInvocations += 1;
      r.lastActivityAt = msg.data.started_at;
      rt.set(msg.data.agent_name, r);
      set({ agentRuntime: rt, invocations: [...state.invocations, msg.data] });
      return;
    }

    if (msg.type === 'invocation.delivered' && msg.data.agent_name) {
      const rt = new Map(state.agentRuntime);
      const r = { ...(rt.get(msg.data.agent_name) || emptyRuntime()) };
      r.activeInvocations = Math.max(0, r.activeInvocations - 1);
      r.status = r.activeInvocations > 0 ? 'running' : 'delivered';
      r.lastActivityAt = msg.data.ended_at || now;
      rt.set(msg.data.agent_name, r);
      set({
        agentRuntime: rt,
        invocations: state.invocations.map(i => i.id === msg.data.id ? msg.data : i)
      });
      return;
    }

    if (msg.type === 'toolcall.started' && msg.data.agent_name) {
      const rt = new Map(state.agentRuntime);
      const r = { ...(rt.get(msg.data.agent_name) || emptyRuntime()) };
      r.recentToolCalls = [msg.data, ...r.recentToolCalls].slice(0, 6);
      r.lastActivityAt = msg.data.started_at;
      rt.set(msg.data.agent_name, r);
      set({ agentRuntime: rt });
      return;
    }

    if (msg.type === 'toolcall.delivered' && msg.data.agent_name) {
      const rt = new Map(state.agentRuntime);
      const r = { ...(rt.get(msg.data.agent_name) || emptyRuntime()) };
      r.recentToolCalls = r.recentToolCalls.map(tc =>
        tc.tool === msg.data.tool && tc.status === 'running'
          ? { ...tc, status: 'delivered', ended_at: msg.data.ended_at }
          : tc
      );
      r.lastActivityAt = msg.data.ended_at || now;
      rt.set(msg.data.agent_name, r);
      set({ agentRuntime: rt });
      return;
    }
  }
}));
