# Spike — Verifiera Claude Code hook-payload

**Syfte:** Innan vi designar visualiseringen runt en datamodell vill vi se VAD Claude Codes hook-system faktiskt levererar — särskilt med parallella subagenter (Issue #7881).

**Tidsåtgång:** 30 minuter inklusive analys.

## Vad det gör

- En liten bash-hook (`log-hook.sh`) loggar varje hook-event till JSONL
- Async så Claude Code aldrig blockeras
- Failsafe: 500ms timeout, fail-open, exit 0 alltid
- Loggar hamnar i `~/.claude/spike-logs/YYYYMMDD.jsonl`

## Installation (5 min)

### Steg 1 — Gör scriptet körbart
```bash
chmod +x /home/user/fltman/scripts/spike/log-hook.sh
```

### Steg 2 — Lägg till hooks i din Claude Code-config

Öppna en av följande:
- `.claude/settings.local.json` i det här projektet (endast för det här repot — **rekommenderas**)
- `~/.claude/settings.json` (för alla projekt — bara om du vill spika brett)

Lägg till `hooks`-blocket från `settings.snippet.json`. Byt ut `HOOK_PATH` mot den absoluta sökvägen `/home/user/fltman/scripts/spike/log-hook.sh`.

Om du redan har en `hooks`-sektion: slå ihop, addera inte dubbla matchers för samma event.

### Steg 3 — Starta om Claude Code
Hooks läses vid session-start. Stäng och öppna en ny session.

## Köra spiken (15 min)

Mål: generera så varierad event-trafik som möjligt, särskilt med parallella subagenter.

I en ny Claude Code-session i det här repot, prompta något i den här stilen:

> Kör tre parallella subagenter (ideator, skeptic, market-researcher) på olika ämnen samtidigt. Låt varje göra minst 2 web-sökningar och en filskrivning. När de är klara, kör en ny subagent (copywriter) som läser deras output.

Det här triggar:
- SessionStart
- UserPromptSubmit
- Flera parallella PreToolUse(tool=Task) — vi vill se om `subagent_type` syns
- PostToolUse / SubagentStop för var och en — kan vi skilja dem åt?
- En sekventiell efterträdare som läser deras filer

Låt det köra. Avbryt inte halvvägs.

## Analys (10 min)

Logg-fil finns på `~/.claude/spike-logs/YYYYMMDD.jsonl`. Kör:

```bash
wc -l ~/.claude/spike-logs/$(date +%Y%m%d).jsonl
```

För att se en sammanfattning per event-typ:
```bash
jq -r '._hook' ~/.claude/spike-logs/$(date +%Y%m%d).jsonl | sort | uniq -c
```

Kopiera filen hit för analys:
```bash
cp ~/.claude/spike-logs/$(date +%Y%m%d).jsonl /home/user/fltman/docs/spike-raw.jsonl
```

Säg sedan till mig — jag analyserar mot vår datamodell och svarar:
1. Får vi `agent_type` / `subagent_type` på PreToolUse(Task)? ✅/❌
2. Kan vi skilja parallella subagenter åt på SubagentStop? ✅/❌
3. Hur ser tidssekvensen ut — är events i ordning?
4. Volym (events/min)?
5. Vad saknas som datamodellen antar?

Baserat på det uppdaterar vi `docs/data-model.md` och kör Fas 2.

## Avinstallation

Ta bort `hooks`-blocket från settings-filen och starta om Claude Code. Filerna i `scripts/spike/` kan ligga kvar — de gör inget om de inte refereras.
