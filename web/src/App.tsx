import { useEffect } from 'react';
import Workspace from './components/Workspace';
import AgentPanel from './components/AgentPanel';
import StatusBar from './components/StatusBar';
import { connect, fetchInitialState } from './ws';

export default function App() {
  useEffect(() => {
    fetchInitialState();
    connect();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lit Workspace</h1>
        <span className="subtitle">claude code agent visualization</span>
      </header>
      <main className="app-main">
        <Workspace />
        <AgentPanel />
      </main>
      <StatusBar />
    </div>
  );
}
