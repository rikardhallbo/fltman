# Data Model — Live Agent Visualization

## Syfte
Definiera vilka entiteter, relationer och tillstånd som visualiseringen bygger på. Allt UI och alla events tolkas mot den här modellen.

> **Anm:** Punkter markerade `[verifieras]` ska bekräftas av `skeptic`/`realtime-engineer` mot Claude Codes faktiska hook-payload innan implementation. Modellen är ett mål-skema — vi anpassar om verkligheten skiljer sig.

## Entiteter

| Entitet | Beskrivning | Nyckelattribut | Exempel |
|---------|-------------|----------------|---------|
| **Agent** | En agentdefinition i `.claude/agents/*.md` | `name`, `description`, `tools[]`, `model`, `collaborators[]` | `project-lead`, `ideator`, `skeptic` |
| **Session** | En Claude Code-körning från start till slut | `id`, `started_at`, `ended_at`, `cwd` | "Session från 2026-05-11 14:30" |
| **Invocation** | En konkret körning av en agent inom en session | `id`, `agent_name`, `session_id`, `parent_invocation_id`, `started_at`, `ended_at`, `status`, `prompt`, `result_summary` | "ideator @ 14:32 inom session X" |
| **ToolCall** | Ett verktygsanrop inom en invocation | `id`, `invocation_id`, `tool_name`, `args_summary`, `started_at`, `ended_at`, `status` | "Read .claude/agents/copywriter.md" |
| **Document** | En fil som lästs eller skrivits | `path`, `kind` (agent / doc / asset / code), `last_touched_by` | `docs/data-model.md` |
| **UserPrompt** | Användarens input | `id`, `session_id`, `text`, `timestamp` | "Kör igång" |

## Relationer

| Från | Kant | Till | Kardinalitet | Betyder |
|------|------|------|--------------|---------|
| Invocation | `instance-of` | Agent | N→1 | Den här körningen är en instans av den här agenten |
| Invocation | `spawned-by` | Invocation | N→0..1 | Förälder-barn-delegering (agent A startade agent B) |
| Invocation | `in-session` | Session | N→1 | Hör hemma i den här sessionen |
| Invocation | `made` | ToolCall | 1→N | Körningen gjorde de här tool calls |
| ToolCall | `reads` | Document | N→N | Verktyget läste den här filen |
| ToolCall | `writes` | Document | N→N | Verktyget skrev den här filen |
| Agent | `declares-collaboration` | Agent | N→N | **Statisk** kant från "Samarbete"-sektionen i agentens .md |
| UserPrompt | `in-session` | Session | N→1 | Användarens prompt i sessionen |
| UserPrompt | `triggered` | Invocation | 1→N | Promptens första invocation(s) |

**Två klasser av kanter:**
- **Statiska** (från `.claude/agents/`-filerna) — beskriver POTENTIELLT samarbete. Ritas svagt/grått.
- **Dynamiska** (från events) — beskriver FAKTISKT samarbete just nu eller historiskt. Ritas starkt/färgat.

## Tillstånd för Invocation

```
queued → running → delivered
                ↘ failed
                ↘ waiting → running (när blockeringen löst)
```

| Status | Visuellt | Trigger |
|--------|----------|---------|
| `queued` | dimmad nod, pulserande kant in | Agent-tool anropad men ej startad |
| `running` | lysande nod, animerade tool calls | PreToolUse / SubagentStart [verifieras] |
| `waiting` | gul nod, "väntar på X" | AskUserQuestion / blockerad |
| `delivered` | grön nod, fast | SubagentStop med success |
| `failed` | röd nod | SubagentStop med error / Stop med error |

## Event-typer (från Claude Codes hooks) [verifieras]

| Event | Trigger | Skapar/uppdaterar |
|-------|---------|-------------------|
| `SessionStart` | Session börjar | Ny Session |
| `UserPromptSubmit` | Användaren skickar prompt | Ny UserPrompt |
| `PreToolUse` (tool=`Agent`) | Subagent ska startas | Ny Invocation, status=queued→running |
| `PreToolUse` (tool=annat) | Verktyg ska köra | Ny ToolCall, status=running |
| `PostToolUse` | Verktyg klart | Uppdatera ToolCall, status=delivered/failed |
| `SubagentStop` | Subagent klar | Uppdatera Invocation, status=delivered/failed |
| `Stop` | Main agent klar | Stäng eventuell aktiv invocation |
| `Notification` | Allmänna events | (loggas, kanske inte visualiseras) |

> **Kritiskt antagande:** att hooks får tillräcklig kontext för att veta VILKEN subagent som startar/stoppar. `skeptic` ska bekräfta detta. Om inte: vi behöver härleda det från transkript-filer eller lägga till Claude Code en query.

## Wire-format (event → server → frontend)

JSONL-events över WebSocket. Minsta gemensamma struktur:

```json
{
  "event_id": "evt_01H...",
  "session_id": "sess_01H...",
  "timestamp": "2026-05-11T14:32:01.234Z",
  "type": "invocation.started" | "invocation.delivered" | "invocation.failed"
        | "toolcall.started" | "toolcall.delivered" | "toolcall.failed"
        | "userprompt.submitted"
        | "session.started" | "session.ended",
  "payload": {
    /* typspecifikt */
  }
}
```

Exempel — invocation startas:
```json
{
  "event_id": "evt_01H7...",
  "session_id": "sess_01H7...",
  "timestamp": "2026-05-11T14:32:01.234Z",
  "type": "invocation.started",
  "payload": {
    "invocation_id": "inv_01H7...",
    "agent_name": "ideator",
    "parent_invocation_id": "inv_01H7Z...",
    "prompt_summary": "Generera visualiseringsmetaforer..."
  }
}
```

## Designkonsekvenser för UI
- **Statisk graf alltid synlig**: alla agenter som noder, declared collaborations som tunna grå kanter — så användaren ser teamet även när inget händer
- **Dynamiska kanter ovanpå**: aktiva invocations lyser, spawned-by-kanter ritas som riktade pilar i färg
- **Tool calls som sub-element**: per aktiv invocation visas pågående tool calls (snabb info, ej egna noder)
- **Filer som relaterad panel**: vilka dokument som rörs i realtid, klickbara
- **Session-tidslinje längst ner**: scrubba bakåt för replay

## Öppna frågor
1. **Hook-fidelity**: får vi tillräckligt från PreToolUse(Agent) för att veta VILKEN subagent som startar? → `skeptic`
2. **Spawned-by-kedjan**: kan vi rekonstruera fullständigt agent A → B → C? → `skeptic`
3. **Tool-call-volym**: hur många events/sek vid intensiv session? → `realtime-engineer`
4. **Persistens**: ska vi spara sessions för replay, eller bara live? Förslag: lokal SQLite, men prio 2.
5. **Multi-session**: en användare kan ha flera Claude Code-fönster öppna samtidigt. Hur skiljer vi? → session_id från SessionStart-hook, en lane per session i UI.
