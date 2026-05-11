import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(PROJECT_ROOT, '.claude', 'agents');
const PORT = process.env.PORT || 7777;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const events = [];
const invocations = new Map();
const sessions = new Map();
let agentsCache = null;

function parseAgentFile(filename, content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : null;
  };
  const name = get('name') || filename.replace('.md', '');
  const description = get('description') || '';
  const model = get('model') || 'inherit';
  const toolsStr = get('tools') || '';
  const tools = toolsStr.split(',').map(t => t.trim()).filter(Boolean);

  const collabSection = content.match(/##\s*Samarbete[\s\S]*?(?=\n##|$)/i);
  const collaborators = new Set();
  if (collabSection) {
    const re = /`([a-z][a-z0-9-]+)`/g;
    let m;
    while ((m = re.exec(collabSection[0]))) {
      if (m[1] !== name) collaborators.add(m[1]);
    }
  }
  return { name, description, model, tools, collaborators: [...collaborators] };
}

function loadAgents() {
  if (!fs.existsSync(AGENTS_DIR)) return [];
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  return files.map(f => {
    const content = fs.readFileSync(path.join(AGENTS_DIR, f), 'utf8');
    return parseAgentFile(f, content);
  }).filter(Boolean);
}

function refreshAgents() {
  agentsCache = loadAgents();
  return agentsCache;
}

refreshAgents();
console.log(`Loaded ${agentsCache.length} agents from ${AGENTS_DIR}`);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(message) {
  const text = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      try { client.send(text); } catch {}
    }
  }
}

function deriveAgentName(payload) {
  if (!payload) return null;
  const ti = payload.tool_input || {};
  return payload.subagent_type || ti.subagent_type || payload.agent_type || ti.agent_type || null;
}

function normalizeEvent(envelope) {
  const { hook, ts, cwd, payload = {} } = envelope;
  const sessionId = payload.session_id || 'unknown';
  const event = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    hook,
    ts,
    cwd,
    sessionId,
    payload,
    derived: {}
  };

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { id: sessionId, started_at: ts, cwd });
    broadcast({ type: 'session.started', data: sessions.get(sessionId) });
  }

  if (hook === 'PreToolUse' && payload.tool_name === 'Task') {
    const agent_name = deriveAgentName(payload);
    const inv_id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const inv = {
      id: inv_id,
      agent_name,
      session_id: sessionId,
      parent_invocation_id: null,
      started_at: ts,
      ended_at: null,
      status: 'running',
      prompt_summary: (payload.tool_input?.prompt || payload.tool_input?.description || '').slice(0, 200),
      tool_calls: []
    };
    invocations.set(inv_id, inv);
    event.derived.invocation_id = inv_id;
    broadcast({ type: 'invocation.started', data: inv });
  }

  if (hook === 'PreToolUse' && payload.tool_name !== 'Task') {
    const tc = {
      id: `tc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tool: payload.tool_name,
      args_summary: JSON.stringify(payload.tool_input || {}).slice(0, 200),
      started_at: ts,
      ended_at: null,
      status: 'running',
      agent_name: deriveAgentName(payload)
    };
    event.derived.tool_call_id = tc.id;
    broadcast({ type: 'toolcall.started', data: tc });
  }

  if (hook === 'PostToolUse' && payload.tool_name !== 'Task') {
    broadcast({
      type: 'toolcall.delivered',
      data: {
        tool: payload.tool_name,
        ended_at: ts,
        agent_name: deriveAgentName(payload),
        result_summary: JSON.stringify(payload.tool_response || {}).slice(0, 200)
      }
    });
  }

  if (hook === 'SubagentStop') {
    const agent_name = deriveAgentName(payload);
    let inv = null;
    for (const v of invocations.values()) {
      if (v.status === 'running' && (!agent_name || v.agent_name === agent_name)) {
        inv = v; break;
      }
    }
    if (inv) {
      inv.status = 'delivered';
      inv.ended_at = ts;
      broadcast({ type: 'invocation.delivered', data: inv });
    }
  }

  if (hook === 'UserPromptSubmit') {
    broadcast({
      type: 'userprompt.submitted',
      data: { session_id: sessionId, text: payload.prompt || '', ts }
    });
  }

  if (hook === 'Stop') {
    broadcast({ type: 'session.idle', data: { session_id: sessionId, ts } });
  }

  events.push(event);
  if (events.length > 5000) events.shift();
  return event;
}

app.get('/health', (req, res) => res.json({ ok: true, agents: agentsCache.length, sessions: sessions.size }));

app.get('/agents', (req, res) => res.json(refreshAgents()));

app.get('/events', (req, res) => {
  const since = req.query.since ? Number(req.query.since) : 0;
  res.json(events.slice(since));
});

app.post('/events', (req, res) => {
  try {
    normalizeEvent(req.body);
    res.json({ ok: true });
  } catch (e) {
    console.error('event error', e);
    res.status(500).json({ ok: false });
  }
});

app.get('/state', (req, res) => {
  res.json({
    agents: agentsCache,
    sessions: [...sessions.values()],
    invocations: [...invocations.values()].slice(-50)
  });
});

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    type: 'hello',
    data: {
      agents: agentsCache,
      sessions: [...sessions.values()],
      invocations: [...invocations.values()].slice(-100)
    }
  }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Lit Workspace server listening at http://127.0.0.1:${PORT}`);
  console.log(`WebSocket at ws://127.0.0.1:${PORT}/ws`);
});
