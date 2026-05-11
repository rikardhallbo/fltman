import { useStore } from '../store';
import { agentAccent } from '../lib/colors';

export default function AgentPanel() {
  const selectedAgent = useStore(s => s.selectedAgent);
  const agents = useStore(s => s.agents);
  const agentIndex = useStore(s => s.agentIndex);
  const agentRuntime = useStore(s => s.agentRuntime);
  const invocations = useStore(s => s.invocations);
  const selectAgent = useStore(s => s.selectAgent);

  if (!selectedAgent) return null;

  const agent = agents.find(a => a.name === selectedAgent);
  if (!agent) return null;
  const idx = agentIndex.get(selectedAgent) ?? 0;
  const rt = agentRuntime.get(selectedAgent);
  const accent = agentAccent(idx);
  const agentInvocations = invocations.filter(i => i.agent_name === selectedAgent).slice(-5).reverse();

  return (
    <aside className="agent-panel" style={{ ['--accent' as any]: accent }}>
      <header>
        <h2>{agent.name}</h2>
        <button className="close" onClick={() => selectAgent(null)}>×</button>
      </header>
      <div className="meta">
        <span className={`status status-${rt?.status ?? 'idle'}`}>{rt?.status ?? 'idle'}</span>
        <span className="model">{agent.model}</span>
      </div>

      <section>
        <h3>Description</h3>
        <p>{agent.description}</p>
      </section>

      {rt && rt.recentToolCalls.length > 0 && (
        <section>
          <h3>Recent tool calls</h3>
          <ul className="tools">
            {rt.recentToolCalls.map(tc => (
              <li key={tc.id} className={`status-${tc.status}`}>
                <span className="tool">{tc.tool}</span>
                <span className="args">{tc.args_summary}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {agentInvocations.length > 0 && (
        <section>
          <h3>Invocations</h3>
          <ul className="invocations">
            {agentInvocations.map(inv => (
              <li key={inv.id} className={`status-${inv.status}`}>
                <div className="row">
                  <span className="status-dot" />
                  <span className="time">{inv.started_at.slice(11, 19)}</span>
                  <span className="duration">
                    {inv.ended_at
                      ? `${Math.max(1, Math.round((new Date(inv.ended_at).getTime() - new Date(inv.started_at).getTime()) / 1000))}s`
                      : 'running'}
                  </span>
                </div>
                <p className="prompt">{inv.prompt_summary || '(no prompt summary)'}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3>Declared collaborators</h3>
        <ul className="collaborators">
          {agent.collaborators.map(c => (
            <li key={c} onClick={() => selectAgent(c)}>{c}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Tools</h3>
        <code className="toollist">{agent.tools.join(', ') || '(default)'}</code>
      </section>
    </aside>
  );
}
