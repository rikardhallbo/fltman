import { useEffect, useState } from 'react';
import { useStore } from '../store';

export default function StatusBar() {
  const connection = useStore(s => s.connection);
  const lastEventAt = useStore(s => s.lastEventAt);
  const sessions = useStore(s => s.sessions);
  const agentRuntime = useStore(s => s.agentRuntime);

  const activeCount = [...agentRuntime.values()].filter(r => r.status === 'running').length;
  const totalCount = agentRuntime.size;

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const secondsSinceLast = lastEventAt ? Math.floor((now - new Date(lastEventAt).getTime()) / 1000) : null;
  const stale = secondsSinceLast != null && secondsSinceLast > 60;

  return (
    <div className="status-bar">
      <div className="left">
        <span className={`dot conn-${connection} ${stale ? 'stale' : ''}`} />
        <span className="status-text">
          {connection === 'open' ? (stale ? 'idle' : 'live') : connection === 'connecting' ? 'connecting' : 'disconnected'}
        </span>
        {sessions.length > 0 && (
          <span className="session-info">{sessions.length} session{sessions.length === 1 ? '' : 's'}</span>
        )}
        <span className="agents-info">{activeCount} of {totalCount} active</span>
      </div>
      <div className="right">
        {lastEventAt && (
          <span className="last-event">last event {secondsSinceLast}s ago</span>
        )}
      </div>
    </div>
  );
}
