# Lit Workspace

Lokal webbapp som live visualiserar Claude Codes agentteam medan de jobbar. Varje agent har en egen zon med distinkt accentfärg; kanter mellan dem lyser när de samarbetar; tool calls och leveranser syns i realtid. För personligt bruk — ett förståelse-verktyg, inte en dashboard.

## Stack

- **Hook script** (`scripts/log-hook.sh`) — async bash, POSTar hook-payload till local server
- **Server** (`server/`) — Node + Express + ws. Tar emot events, parsar `.claude/agents/*.md` för statisk graf, broadcastar via WebSocket
- **Web** (`web/`) — Vite + React + TypeScript + React Flow + Zustand

## Köra

### 1. Installera
```bash
npm run install:all
```

### 2. Starta server och frontend (två terminaler)
```bash
# terminal 1
npm run server          # http://127.0.0.1:7777

# terminal 2
npm run web             # http://127.0.0.1:5173
```

Öppna `http://127.0.0.1:5173` i browsern. Du ska se alla agenter ritade som dimmade noder med statiska samarbetskanter mellan dem. Status-baren längst ner visar "live" om servern är igång.

### 3. Koppla på hooks i Claude Code

Hooks är det som gör visualiseringen *live*. Lägg till i `.claude/settings.local.json` (projekt-lokalt — rekommenderas):

```jsonc
{
  "hooks": {
    "SessionStart":     [{ "matcher": "*", "hooks": [{ "type": "command", "command": "/ABS/PATH/scripts/log-hook.sh SessionStart",     "async": true }] }],
    "UserPromptSubmit": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "/ABS/PATH/scripts/log-hook.sh UserPromptSubmit", "async": true }] }],
    "PreToolUse":       [{ "matcher": "*", "hooks": [{ "type": "command", "command": "/ABS/PATH/scripts/log-hook.sh PreToolUse",       "async": true }] }],
    "PostToolUse":      [{ "matcher": "*", "hooks": [{ "type": "command", "command": "/ABS/PATH/scripts/log-hook.sh PostToolUse",      "async": true }] }],
    "SubagentStop":     [{ "matcher": "*", "hooks": [{ "type": "command", "command": "/ABS/PATH/scripts/log-hook.sh SubagentStop",     "async": true }] }],
    "Stop":             [{ "matcher": "*", "hooks": [{ "type": "command", "command": "/ABS/PATH/scripts/log-hook.sh Stop",             "async": true }] }]
  }
}
```

Byt `/ABS/PATH/` mot absolut sökväg till repot. **`async: true` är obligatoriskt** — annars saktar du ner Claude Code.

Starta om Claude Code så hookarna laddas. När du sedan kör subagenter (`/<agent-name>`, eller via Task-toolet) ska aktivitet börja blinka upp i Lit Workspace.

## Mappstruktur

```
fltman/
├─ .claude/
│  └─ agents/              ← agentdefinitioner (källan för statisk graf)
├─ docs/                   ← all research, strategi, design
│  ├─ data-model.md
│  ├─ ux-design.md
│  ├─ art-direction.md
│  ├─ skeptic-review-feasibility.md
│  └─ ...
├─ scripts/
│  ├─ log-hook.sh          ← hook → server bridge
│  └─ spike/               ← (oanvänt nu) verifieringsharness
├─ server/                 ← Node WebSocket-server
├─ web/                    ← React-frontend
└─ README.md
```

## Hur det fungerar

1. Claude Code triggar en hook (t.ex. `PreToolUse`)
2. `log-hook.sh` läser payload från stdin, POSTar JSON till `http://127.0.0.1:7777/events` (async, fail-open, ≤400ms timeout)
3. Servern normaliserar event mot datamodellen i `docs/data-model.md` och uppdaterar in-memory state
4. Servern broadcastar normaliserade events via WebSocket
5. Frontend uppdaterar Zustand-store, React Flow re-renderar grafen

## Kända begränsningar (medvetna val för v1)

- **Parallella subagenter med samma typ** korreleras heuristiskt (oldest-running ↔ inkommande SubagentStop). Issue [#7881](https://github.com/anthropics/claude-code/issues/7881). Visualisering: badge `×N` på noden.
- **Dead air**: agenter som tänker utan tool calls visas ändå med idle-puls — inga ambient-effekter, men de ser inte döda ut.
- **Restart = state reset**: ingen persistens i v1. Lägg till SQLite om/när det behövs.
- **En sessions vy åt gången**: multi-session lane är skippat tills behov uppstår.
- **Ingen scrubber än**: timeline-replay finns i UX-design men ej implementerat i v1 (bara live-vy).

## Designdokument

Allt strategi-/designtänk finns i `docs/`:
- `project-plan.md` — fasplan
- `data-model.md` — entiteter, relationer, states, wire-format
- `metaphor-decision.md` — varför Lit Workspace
- `ux-design.md` — jobs-to-be-done, interaktion, live-state
- `art-direction.md` — färgsystem, typografi, motion
- `skeptic-review-feasibility.md` — risker som styrt designen
- `ideas-visualization-metaphors.md` — 31 idéer från ideator

## Felsökning

**Banner "disconnected" i UI:** servern är inte igång eller lyssnar på fel port. Kör `npm run server`.

**Hooks tycks inte ge events:** kolla i `~/.claude/settings.json` att sökvägen är absolut. Testa hooken manuellt:
```bash
echo '{"session_id":"test"}' | ./scripts/log-hook.sh PreToolUse
curl http://127.0.0.1:7777/state
```

**Claude Code känns långsam efter install:** kontrollera att `"async": true` finns på varje hook-entry.
