# Skeptic Review — Feasibility för live-agentvisualisering

**Granskat:** Förslag att bygga lokal webbapp som live visualiserar Claude Codes agenter via hook-systemet.
**Datum:** 2026-05-11
**Granskare:** skeptic
**Slutsats i en mening:** Tekniskt görbart, men ett känt blockerande problem (subagent-identifiering) gör att den mest spännande funktionen — "se agent A starta agent B" — riskerar att bli en lögn på skärmen.

---

## Vad jag faktiskt kollade

Jag läste Claude Codes hook-dokumentation, settings.json-konfiguration, SubagentStop-payload-strukturen, kända observerbarhetsprojekt (disler/claude-code-hooks-multi-agent-observability, patoles/agent-flow, hoangsonww/Claude-Code-Agent-Monitor) och kända buggar/feature requests i anthropics/claude-code repot.

Det är goda nyheter: **vi är inte först.** Det betyder två saker:
1. Det går — flera publika projekt har redan ungefär det vi tänker bygga.
2. Vi måste fråga oss varför vi bygger det igen, och vad vi gör annorlunda.

---

## Topp 3 antaganden som planen vilar på

### Antagande 1: "Hooks ger oss tillräckligt rik agent-context för att rita en meningsfull visualisering"
**Konfidens: MEDEL-LÅG.**

Vad vi vet stämmer:
- Hook-payload innehåller `session_id`, `transcript_path`, `tool_name`, `tool_input`, `tool_response`, `hook_event_name`
- Enligt nyare dokumentation finns `agent_id` och `agent_type` i PreToolUse/PostToolUse-payload när hook fires inuti en subagent
- För Task-tool-anrop finns `subagent_type`, `prompt`, `description` i `tool_input`

Vad som är osäkert och skrämmer mig:
- **GitHub Issue #7881** (anthropics/claude-code): "SubagentStop hook cannot identify which specific subagent finished due to shared session IDs." Flera samtidiga subagenter delar `session_id`. SubagentStop får ingen unik identifierare. Det är en aktiv, öppen bugg.
- **GitHub Issue #19170**: SubagentStart-eventet är dokumenterat ofullständigt — vi vet inte ens säkert om det finns, eller med vilken payload.
- **GitHub Issue #16424**: "Expose Agent Context in Hook Event Payloads for Multi-Agent Observability" — ett öppet feature request. Det betyder: det vi vill ha är *inte fullt utbyggt än*.

Slutsats: I bästa fall får vi `agent_type` på PreToolUse. I värsta fall kan vi inte säkert säga vilken av tre parallella `market-researcher`-instanser som just gjorde en WebSearch.

### Antagande 2: "Async hooks gör att vi kan pusha events utan att sakta ner Claude Code"
**Konfidens: HÖG, med en stor varning.**

Async hooks (`"async": true`) lades till januari 2026 och löser blocking-problemet — Claude Code spawnar hook som bakgrundsprocess och fortsätter direkt. Bra.

Varning: Det finns dokumenterade fall där synkrona hooks lade på **~20 sekunder** per CLI-interaktion (ruvnet/ruflo Issue #1530). Om vi någonsin glömmer `async: true` på fel hook förstör vi användarens utvecklingsupplevelse. Det är inte ett tekniskt problem — det är ett operativt risk-problem.

### Antagande 3: "Användaren faktiskt vill ha det här"
**Konfidens: LÅG (och det är det jag oroar mig mest för).**

Det här är inte ett tekniskt antagande. Det är produktantagandet. Frågor jag inte sett svar på:
- Vilket konkret beslut fattar användaren snabbare med visualiseringen?
- Är det här en debug-tool, en demo-tool eller en monitoring-tool? De har helt olika krav.
- Finns redan disler-projektet — vad gör vårt bättre? "Snyggare UI" är inte ett produktsvar.

---

## Topp 5 failure modes (konkret, inte abstrakt)

### 1. "Subagent-soppan" — vi kan inte skilja parallella agenter åt
Användaren kör `project-lead` som spawnar tre `market-researcher` parallellt. I dashboarden ser man tre identiska swimlanes — eller, värre, en enda swimlane där events från alla tre slås ihop kronologiskt. Visualiseringen blir aktivt vilseledande. (Direkt konsekvens av Issue #7881.)

### 2. "Vi ser tool calls, inte tänkande"
Hooks fires på *tool use*, inte på agentens resonemang. En agent som tänker i 90 sekunder utan att kalla ett verktyg syns inte alls. Skärmen ser död ut. Användaren tror appen är trasig. (Vi skulle behöva läsa transcript-JSONL för att kompensera — vilket är ett helt annat projekt.)

### 3. "Hook-skript kraschar tyst"
Bug dokumenterad i thedotmack/claude-mem Issue #2292: "Hooks silently block every Claude Code event with No stderr output once recordWorkerUnreachable threshold trips." Om vår lokala server går ner, eller en port är upptagen, kan hook-skript börja blocka *all Claude Code-aktivitet* utan synligt felmeddelande. Det här är värre än att ingen visualisering visas — det är att Claude Code slutar fungera.

### 4. "Race conditions i WebSocket-strömmen"
Async hooks spawnar bakgrundsprocesser som kan slutföras i fel ordning. En `PostToolUse` kan landa i browsern före motsvarande `PreToolUse`. Vi behöver händelsesekvensering på server-sidan med monotona timestamps från hook-payloaden — annars hoppar swimlanes.

### 5. "Anthropic ändrar payload-formatet"
Hook-systemet är fortfarande under aktiv utveckling (se SubagentStart-issue #19170, agent context-issue #16424). Vi bygger mot en API-yta som inte är frusen. En `claude-code` minor-bump kan tysta vår visualisering. Vi behöver versionsdetektering och defensiv parsing.

---

## Premortem — det är november 2026 och projektet är dött

> Vi byggde det. Det fungerade på demo. Sedan slutade vi använda det.
>
> Det första problemet kom efter en vecka. Vi körde tre parallella `market-researcher` och dashboarden visade dem som en sammanslagen swimlane. Det blev så förvirrande att vi avstängde den när vi körde verkligt arbete.
>
> Det andra problemet var "deadtime". Agenter som tänker länge utan tool calls syntes inte alls. Skärmen såg ut som om ingenting hände i 60 sekunder. Användaren öppnade terminalen för att kolla "är den ens igång?" — och då slutade dashboarden vara värdefull.
>
> Det tredje problemet var smygande: vi glömde `async: true` på en hook efter en refactor. Claude Code-svar gick från 5 till 25 sekunder. Vi förstod inte varför på flera dagar.
>
> När Claude Code 2.5 släpptes ändrades payload-formatet för Task. Vår parser bröt tyst. Ingen märkte på två veckor.
>
> Den sista dödsstöten var insikten att disler-projektet redan löste 80% av det vi byggde — men vi hade investerat så mycket att vi inte ville erkänna det.

---

## Röda flaggor som kräver omedelbart svar

1. **Hur hanterar vi parallella subagenter med delade session_ids?** (Issue #7881 är öppen — vi måste designa runt den, inte hoppas att den fixas.)
2. **Vad gör appen när Claude Code "tänker" utan tool calls?** Måste vi läsa transcript-JSONL parallellt med hooks?
3. **Vad är failsafe-beteendet när vår lokala server är nere?** Hooken FÅR ALDRIG blockera Claude Code. Skriptet måste timeout snabbt och returnera 0 oavsett.
4. **Varför bygger vi det här istället för att forka disler?** Konkret differentieringssvar krävs.
5. **Vem är användaren?** En utvecklare som debuggar agenter? En demonstratör som vill imponera? En produktägare som vill övervaka kostnad? Tre olika produkter.

---

## Vad jag tycker är starkt med förslaget (var rättvis)

- **Hook-API:t finns och är publikt.** Vi behöver inte hacka eller scrapa — det är en legitim integration.
- **Async hooks är en riktig lösning** på blocking-problemet, dokumenterad och fungerande sedan januari 2026.
- **Det finns precedens.** Flera publika projekt fungerar; vi kan stå på deras axlar och lära från deras misstag.
- **Lokalt-först är rätt val.** Inga GDPR-bekymmer, inga API-kostnader för observabilitet, ingen vendor-lock-in.
- **Pedagogiskt värde är reellt.** Även om det inte blir en produkt blir det en kraftfull demo av hur agentsystem faktiskt fungerar.

---

## Alternativa datakällor om hooks visar sig otillräckliga

| Källa | För | Mot |
|---|---|---|
| **Transcript-JSONL** (`~/.claude/projects/.../*.jsonl`) | Fullt resonemang inkl tankegångar; agent-{id}.jsonl per subagent löser identifieringsproblemet | Skrivs i efterhand, inte realtid (filsystem polling = latens); format är inte officiellt API och kan ändras |
| **OpenTelemetry** (claude-code stöder OTEL) | Officiellt övervakningsspår; tål versionsändringar bättre | Designat för metrics/traces, inte UI-visualisering; mer infra |
| **stdout/stderr-parsing av claude-cli** | Funkar i alla fall | Bräckligt, fult, brytande mellan versioner |
| **Claude Agent SDK** istället för CLI | SDK ger direkt programmatisk access till hooks och events | Vi bygger inte längre för "vanliga" Claude Code-användare — vi bygger ett separat program |

Min rekommendation: **Hooks som primär källa + transcript-JSONL som backup för agent-identifiering och tankegångar.** Kombinationen löser merparten av failure modes 1 och 2.

---

## Rekommendation: GÅ VIDARE MED VILLKOR

Det här är värt att bygga, men inte i den naiva formen "hooks → websocket → UI".

**Villkor som måste uppfyllas före kodning startar:**

1. **Skriv en 1-sidors produktbrief** som svarar: vem är användaren, vilket beslut fattar de snabbare, varför inte disler-projektet. Utan det här bygger vi i blindo.
2. **Bygg en 30-minuters spike först.** Skriv ett bash-hook som loggar all payload till en fil. Kör en session med parallella subagenter. Inspektera vad vi faktiskt får tillbaka. Hela arkitekturen vilar på den datan — verifiera den innan du designar för den.
3. **Designa runt subagent-identifieringsbuggen, inte runt en framtida fix.** Använd `tool_input.subagent_type` + monotona timestamp + heuristisk korrelation. Eller läs transcript-JSONL parallellt.
4. **Async hooks är obligatoriskt, dag ett.** Skriv en testsvit som mäter Claude Code-latens med och utan vår hook installerad. Om delta > 200ms är hooken trasig.
5. **Failsafe-beteende skrivs först.** Hook-skriptet ska aldrig blocka Claude Code. Timeout på 500ms, fail-open, exit 0 alltid.

**Vad skulle få mig att ändra åsikt till "GÅ VIDARE UTAN VILLKOR":**
- Bevis att Issue #7881 är löst eller har en känd workaround som faktiskt funkar i parallella scenarios.
- En produktbrief som tydligt skiljer projektet från existerande verktyg.
- En spike-rapport som visar att verklig hook-payload räcker för en meningsfull visualisering.

**Vad skulle få mig att säga "TÄNK OM":**
- Om spiken visar att parallella subagenter är omöjliga att skilja åt utan transcript-läsning. Då är "hooks → UI" fel arkitektur från början, och vi borde bygga "transcript-watcher → UI" istället.

---

## Källor

- [Hooks reference — Claude Code Docs](https://code.claude.com/docs/en/hooks)
- [Intercept and control agent behavior with hooks — Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/hooks)
- [SubagentStop hook cannot identify which specific subagent finished — Issue #7881](https://github.com/anthropics/claude-code/issues/7881)
- [Missing definition and input schema for SubagentStart hook event — Issue #19170](https://github.com/anthropics/claude-code/issues/19170)
- [Expose Agent Context in Hook Event Payloads for Multi-Agent Observability — Issue #16424](https://github.com/anthropics/claude-code/issues/16424)
- [Hooks causing ~20s latency on every Claude Code CLI interaction — ruvnet/ruflo Issue #1530](https://github.com/ruvnet/ruflo/issues/1530)
- [Hooks silently block every Claude Code event — thedotmack/claude-mem Issue #2292](https://github.com/thedotmack/claude-mem/issues/2292)
- [Claude Code async hooks: what they are and when to use them](https://reading.sh/claude-code-async-hooks-what-they-are-and-when-to-use-them-61b21cd71aad)
- [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability)
- [patoles/agent-flow — Real-time visualization of Claude Code agent orchestration](https://github.com/patoles/agent-flow)
- [hoangsonww/Claude-Code-Agent-Monitor](https://github.com/hoangsonww/Claude-Code-Agent-Monitor)
- [Create custom subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents)
