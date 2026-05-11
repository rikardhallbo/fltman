# UX Design — Lit Workspace

## Användarens jobs-to-be-done

1. **"Vad händer just nu?"** — Glance på 1 sekund: vilka agenter är aktiva?
2. **"Vem startade vem?"** — Se delegeringskedjan (project-lead → ideator + skeptic parallellt)
3. **"Vad gör de just nu?"** — Förstå aktuell aktivitet per agent utan att drukna i detalj
4. **"Vad har de levererat?"** — Se färdiga dokument som artefakter knutna till agenter
5. **"Vad hände nyss?"** — Scrubba bakåt genom sessionen för att förstå ett förlopp

Inte i scope: live token-streaming, kostnadsövervakning, multi-user — det är andra produkter.

## Vyer

| Vy | Primärt jobb | Användning |
|----|--------------|------------|
| **Canvas** | Jobb 1, 2, 3 — överblick + relationer | 95% av tiden här |
| **Agent-panel** (slidar in höger) | Jobb 3, 4 — drill-down per agent | Klick på zon |
| **Timeline-scrubber** (botten) | Jobb 5 — historik | När man är nyfiken på "när hände X" |
| **Dokumentviewer** | Jobb 4 — läsa leveransen | Klick på dokumentikon |
| **Sessions-lista** | Bytta mellan sessioner | Sekundärt, dropdown i topp |

En skärm = ett primärt jobb. Drill-down stör inte glance.

## Interaktionsmodell

| Element | Hover | Klick | Andra |
|---------|-------|-------|-------|
| Agent-zon | Tooltip: namn, status, aktuell aktivitet | Öppna agent-panel höger | Right-click: pin/unpin |
| Kant mellan agenter | Tooltip: "X startade Y kl HH:MM" | Popup med promptens sammanfattning | — |
| Tool call-token (i zon) | Tooltip: verktygsnamn + arg-sammanfattning | Expandera i agent-panel | — |
| Dokument-ikon | Tooltip: filnamn + senast ändrad | Öppna i dokumentviewer | Cmd-klick: öppna i editor |
| Canvas-tomyta | — | Stäng öppna paneler | Drag: panorera, scroll: zooma |
| Timeline | Hover: visa tid + aktivitetsdensitet | Klick: hoppa till tidpunkt | Drag scrubber: scrubba |

**Kortkommandon (få men kraftfulla):**
- `Space` — paus/återuppta live-uppdatering
- `Cmd/Ctrl + K` — quick search (agenter, dokument)
- `Esc` — stäng paneler
- `←` / `→` — stega bakåt/framåt i timeline
- `1`–`9` — fokusera N:te aktiva agenten

## Live-state-design

Hur agentens zon beter sig per status:

| Status | Visuellt | Övergång |
|--------|----------|----------|
| `idle` | 30% opacitet, mjuk puls var 3–4 s i accent-färg | Default vilotillstånd |
| `queued` | 60% opacitet, kant in från förälder lyser, "väntar"-prick | Före `running` |
| `running` | 100% opacitet, snabbare puls, tool calls flyger in/ut | Aktiv arbete |
| `waiting` | Gul accent, "..."-indikator | Blockerad (väntar på input) |
| `delivered` | Grön halo i 2 s → bleknar till "recently active" (50% opacitet, längre puls) | Vid leverans |
| `failed` | Röd kant, persistent tills användaren acknowledger (klickar) | Vid fel |

**Tool calls in/ut**: när en agent gör ett verktygsanrop visas en token som glider från zonens centrum mot kanten (Read/läs-tunga) eller från kanten in (Write/skriv-tunga). Token visar verktygsnamn vid hover. Vid avslut konsumeras token (fade).

**Kanter mellan agenter**: tunna grå statiska kanter (från `Samarbete`-sektionerna i agent-filerna) alltid synliga som svaga linjer. Vid faktisk delegering lyser kanten upp i barnets accent-färg och animerar en pil från förälder till barn. Stannar lysande tills barnet är `delivered`/`failed`.

## Dead-air-hantering (mitigation av skeptic flaggade risken)

Agenter som "tänker" utan tool calls får INTE se döda ut. Strategier:
- Idle-pulsen körs alltid (även om hooks tyst)
- När en agent är `running` men ingen tool call på 5 s: subtil "thinking..."-text i tooltipen
- När en agent är `running` men ingen tool call på 30 s: liten andningsanimation (zonen "andas")
- Aldrig en helt statisk skärm

## Parallella subagenter (mitigation av Issue #7881)

Om `project-lead` spawnar 3 × `market-researcher`:
- Tre instanser ritas i samma zon, men som **tre delcirklar** eller **tre satelliter** runt agentens centrum
- Suffix `market-researcher · #1`, `· #2`, `· #3` baserat på temporal ordning av PreToolUse(Task)
- Tool calls knyts till den instans som senast var PreToolUse — heuristisk korrelation
- Om vi inte kan skilja säkert: visa det öppet — en "ambiguous"-indikator (`?`-badge) hellre än lögn på skärmen

## Empty states

| Situation | Vad användaren ser |
|-----------|-------------------|
| Ingen session aktiv | Alla agenter visas dimmade i sin canvas-position. Subtil text: "Ingen aktiv Claude Code-session. Starta en så vaknar teamet." |
| Session aktiv, ingen aktivitet än | Alla agenter på idle, dimmad text: "Väntar på aktivitet..." |
| Hooks ej installerade | Banner: "Hooks är inte konfigurerade. Visualiseringen kan inte ta emot events. [Setup-instruktion]" |
| Förbindelse förlorad | Liten röd indikator högst upp: "Lost connection · reconnecting (try 2)" |
| Okänd agent (i `.claude/agents/` ej hittad) | Anonym grå zon, namn på agenten, "Agent definition not found" på hover |

## Layout-logik

- Default: force-directed layout (svag kraft) så alla 16+ agenter syns någorlunda
- Statiska samarbetskanter påverkar layout (relaterade agenter naturligt nära)
- Aktiva agenter får liten **gravitations-boost** — andra zoner viker undan, aktiva grupperar i mitten
- Användaren kan **pinna** agentpositioner (right-click → pin)
- Layout sparas i localStorage så det inte hoppar mellan sessioner

## Scrubber-design

Timeline längst ner, ~60px hög:
- Tidsaxel med tickmärken
- En tunn aktivitetstäthet-graf ovanpå (mer aktivitet = högre)
- Färgade markörer för viktiga events (start, deliveries, failures)
- Scrubber-handle som flyttbar
- Vid scrubbing: canvas-vyn återrenderar tillstånd vid den tiden, inkl. aktiva agenter just då
- "GÅ TILL LIVE"-knapp till höger när man scrubbat bakåt

## Skärmens informationshierarki (vad ögat ska gå till först)

1. Aktiva agenter med lysande kanter (mitten/färg/rörelse)
2. Senast levererade dokument (gröna halos)
3. Failures (röda kanter, drar uppmärksamhet)
4. Idle teamet runtom (kontext, ej fokus)
5. Timeline (referens vid behov, inte primärt)

## Edge cases att hantera

- **6+ samtidigt aktiva agenter**: zoner krymper, layout omarrangerar, om >8 aktiva flytta dimmade ner i en kollapsbar "Idle (12)"-pool
- **Mycket lång session (>1 timme, 1000+ events)**: timeline aggregerar (bins per minut), canvas visar bara senaste 5 min av tool call-tokens
- **Snabb burst (50 events/sek)**: token-animationer rate-limit:as till max 5 samtidigt per zon
- **Liten skärm (<1024px)**: agent-panel går full-screen istället för slide-in, canvas zoomar in

## Do / Don't för UX

**Do**
- Idle är aktiv, inte frånvarande — alltid något subtilt i rörelse
- Live > replay: live-vyn är default, replay är ett verktyg
- En klick till detalj — aldrig två
- Spara layout, sparat val överlever omstart
- Visa osäkerhet (ambiguous-badge) hellre än hitta på

**Don't**
- Inga "modal popups" som blockerar — alltid slide-in eller inline
- Inga animationsfeststormar som distraherar — varje rörelse ska betyda något
- Inga ikoner utan label på hover
- Inga "rapport-vyer" — det är inte vad det här är till för
- Aldrig dölja en aktiv agent helt — minst en idle-puls måste alltid synas

## Wireframe — huvudcanvas

```
+----------------------------------------------------------+
|  Lit Workspace            session: 2026-05-11 14:32    ▼ |
+----------------------------------------------------------+
|                                                          |
|             [ideator]●                                   |
|                  \                                       |
|                   \                                      |
|         [project-lead]●─────●[skeptic]                   |
|                   /              \                       |
|                  /                \                      |
|             [market-researcher]●   ●[finance-analyst]    |
|                                                          |
|                                                          |
|         · · idle zone · · · idle zone · · idle zone · ·  |
|                                                          |
+----------------------------------------------------------+
| 14:30 ▲▁▁▁▁▂▃▅▇█▆▄▂▁ ─────●───── 14:35       [● LIVE]   |
+----------------------------------------------------------+
```

● = lysande aktiv. Tunn linje = statisk samarbetskant. Tjock lysande linje = aktiv delegering.

## Wireframe — med agent-panel öppen

```
+--------------------------------------+-------------------+
|  [canvas, samma som ovan, men        | ideator           |
|   ideator-zon är highlightad]        | running · 1m 14s  |
|                                      |                   |
|             [ideator]★               | NU:               |
|                  \                   | WebSearch         |
|                   \                  | "data viz tools"  |
|         [project-lead]●──●[skeptic]  |                   |
|                                      | NYLIGEN:          |
|                                      | • Read brief.md   |
|                                      | • Read references |
|                                      |                   |
|                                      | LEVERANSER:       |
|                                      | (inga ännu)       |
|                                      |                   |
|                                      | PROMPT FRÅN:      |
|                                      | project-lead      |
|                                      | "Generera viz-    |
|                                      |  metaforer..."    |
|                                      |          [Close × |
+--------------------------------------+-------------------+
| 14:30 ▲▁▂▃▅▇█▆▄▂▁ ─────●───── 14:35       [● LIVE]      |
+--------------------------------------------------------+
```

## Öppna frågor inför `art-director`

- Exakt visuell gestaltning per agent (monogram? symbol? karaktär?)
- Färgsystem för 16+ accent-färger
- Motion-språk: hur ska puls / glow / token-flyg ser ut?
- Mörkt eller ljust tema (lutar mörkt)

Dessa svarar `art-direction.md` på.
