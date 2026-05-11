export type AgentStatus = 'idle' | 'queued' | 'running' | 'waiting' | 'delivered' | 'failed';

export interface Agent {
  name: string;
  description: string;
  model: string;
  tools: string[];
  collaborators: string[];
}

export interface ToolCall {
  id: string;
  tool: string;
  args_summary: string;
  started_at: string;
  ended_at: string | null;
  status: 'running' | 'delivered' | 'failed';
  agent_name: string | null;
}

export interface Invocation {
  id: string;
  agent_name: string | null;
  session_id: string;
  parent_invocation_id: string | null;
  started_at: string;
  ended_at: string | null;
  status: AgentStatus;
  prompt_summary: string;
  tool_calls: ToolCall[];
}

export interface Session {
  id: string;
  started_at: string;
  cwd: string;
}

export type WsMessage =
  | { type: 'hello'; data: { agents: Agent[]; sessions: Session[]; invocations: Invocation[] } }
  | { type: 'session.started'; data: Session }
  | { type: 'session.idle'; data: { session_id: string; ts: string } }
  | { type: 'invocation.started'; data: Invocation }
  | { type: 'invocation.delivered'; data: Invocation }
  | { type: 'toolcall.started'; data: ToolCall }
  | { type: 'toolcall.delivered'; data: ToolCall & { result_summary?: string } }
  | { type: 'userprompt.submitted'; data: { session_id: string; text: string; ts: string } };
