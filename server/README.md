# Lit Workspace — server

Lokal HTTP + WebSocket-server som tar emot Claude Code hook-events, normaliserar dem mot datamodellen och broadcastar via WS till frontend.

## Endpoints

- `POST /events` — hook-skriptet POSTar hit
- `GET /agents` — statiska agent-definitioner från `.claude/agents/`
- `GET /events?since=N` — historiska events
- `GET /state` — initialt snapshot för anslutande klient
- `GET /health` — sanity check
- `ws://localhost:7777/ws` — live event-ström

## Köra

```bash
cd server
npm install
npm start
```

Default port: `7777`. Override med `PORT=8888 npm start`.

## Design

- In-memory events buffert (cap 5000)
- Sessions/invocations härleds från PreToolUse/SubagentStop
- Issue #7881-mitigation: parallella samma-typ-subagenter korreleras heuristiskt (oldest running matchar inkommande SubagentStop). Risk för missmatch dokumenterad i datamodellen.
- Inga writes till disk — restart = state reset (avsiktligt för v1)
