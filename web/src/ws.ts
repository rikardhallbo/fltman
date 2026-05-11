import { useStore } from './store';
import type { WsMessage } from './types';

let ws: WebSocket | null = null;
let retryCount = 0;
let retryTimer: number | null = null;

export function connect() {
  const url = `ws://${window.location.hostname}:${window.location.port}/ws`;
  useStore.getState().setConnection('connecting');
  try {
    ws = new WebSocket(url);
  } catch {
    schedule();
    return;
  }

  ws.onopen = () => {
    retryCount = 0;
    useStore.getState().setConnection('open');
  };

  ws.onmessage = (event) => {
    try {
      const msg: WsMessage = JSON.parse(event.data);
      useStore.getState().apply(msg);
    } catch (e) {
      console.error('ws parse error', e);
    }
  };

  ws.onclose = () => {
    useStore.getState().setConnection('closed');
    schedule();
  };

  ws.onerror = () => {
    try { ws?.close(); } catch {}
  };
}

function schedule() {
  if (retryTimer != null) return;
  const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
  retryCount += 1;
  retryTimer = window.setTimeout(() => {
    retryTimer = null;
    connect();
  }, delay);
}

export async function fetchInitialState() {
  try {
    const r = await fetch('/api/agents');
    const agents = await r.json();
    useStore.getState().setAgents(agents);
  } catch (e) {
    console.warn('initial agents fetch failed', e);
  }
}
