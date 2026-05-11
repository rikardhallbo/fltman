# Art Direction — Lit Workspace

**Baserat på:** `docs/project-plan.md`, `docs/metaphor-decision.md`, `docs/data-model.md`, `docs/ideas-visualization-metaphors.md`, `docs/skeptic-review-feasibility.md`

---

## 1. Visuell positionering

Ett arbetsrum du gläntar på dörren till — inte en kontrollpanel du övervakar, utan ett mörkt rum med levande ljuskällor där du kan se vilka som är på plats och var det glöder just nu.

---

## 2. Tre moodboard-poler

### Pol A — Teenage Engineering OP-1 / OP-Z
Fysisk produkt, inte mjukvara. Välplanerat begränsat färgutrymme, liten kontrast-accentfärg per funktion, precisionskänsla i detaljerna. Varje knapp är en funktion, inte dekoration.
**Vi tar:** funktionsspecifika färger, restrained UI, känslan av att varje element förtjänar sin plats. Ingenting är ornamentalt.

### Pol B — Interstellar (2014) / Gravity — NASA HUD-sekvenserna
Mörkt, fokuserat, låg ambient belysning. Lysande datalinjer mot djup svart bakgrund. Känns viktigt utan att skrika. Rörelserna är precisa och meningsfulla — inte dekorativa partiklar.
**Vi tar:** mörkret som viloläge, glöd som signal snarare än estetik, känslan av att du tittar på något verkligt snarare än en infografik.

### Pol C — Linear.app / Raycast
Moderna pro-verktyg för solo-power-users. Extremt läsbar typografi i mörkt läge, tunna separatorer, inga onödiga ramar. Rörelse är subtil och purposeful. Känns som ett verktyg som respekterar dig.
**Vi tar:** den typografiska disciplinen, whitespace-hantingen, känslan av att detta är gjort för en person som kan sitt hantverk — inte en publik.

---

## 3. Färgsystem

### Bakgrund

Djupt, nästan asfärgat mörker — inte ren svart (för hård kant mot lysande element), utan ett varmt kol.

```
--bg-base:    hsl(225, 12%, 8%)    /* #111318 — arbetsrummet */
--bg-surface: hsl(225, 10%, 12%)   /* #191c24 — kort / zonytor */
--bg-overlay: hsl(225, 10%, 16%)   /* #222633 — paneler / drill-down */
```

### Idle — dimmade agenter

Agenter som inte är aktiva ska fortfarande kännas *på plats* — som figurer i ett mörkt rum. Inte osynliga. Inte prominenta.

```
--agent-idle-opacity: 0.28
--agent-idle-color:   hsl(225, 8%, 38%)  /* #565a6a — dimmat namntext */
--edge-static:        hsl(225, 8%, 22%)  /* #313546 — deklarerade kanter */
```

### Accent-färger per agent — roterande hue-system

Systemet: 16 nyanser fördelade jämnt runt färgcirkeln med fast saturation och lightness. Det ger konsistens (alla "lyser lika hårt") och distinktion (alla är tydligt olika).

**Formel:** `hsl(H, 72%, 62%)` där H är agentens index × 22.5°

| Index | Agent (exempel) | Hue | Hex-approximation |
|-------|----------------|-----|-------------------|
| 0  | project-lead        | 0°   | `#f0756e` — korall-röd |
| 1  | information-architect | 22.5° | `#f09a5a` — bränd orange |
| 2  | ideator             | 45°  | `#f0c96e` — gyllengul |
| 3  | skeptic             | 67.5° | `#c9e87a` — kalkgrön |
| 4  | brand-strategist    | 90°  | `#8de87a` — grön |
| 5  | art-director        | 112.5° | `#6ae8a0` — mintgrön |
| 6  | copywriter          | 135° | `#6ae8d4` — cyan-grön |
| 7  | ux-designer         | 157.5° | `#6ad4e8` — ljusblå |
| 8  | frontend-dev        | 180° | `#6aafe8` — himmelblå |
| 9  | backend-dev         | 202.5° | `#6a8af0` — mellanblå |
| 10 | market-researcher   | 225° | `#8a6af0` — viola |
| 11 | competitor-analyst  | 247.5° | `#b06af0` — lila |
| 12 | social-media-strategist | 270° | `#d46af0` — lila-rosa |
| 13 | realtime-engineer   | 292.5° | `#f06ad4` — magenta |
| 14 | marketer            | 315° | `#f06aaa` — rosa-röd |
| 15 | (ny agent)          | 337.5° | `#f06a80` — bläckrosa |

Nya agenter utöver 16 wrappar runt hue-cirkeln — distinktionen minskar marginellt men systemet håller.

### Glow / active-state

Aktiva agenter lyser i sin accentfärg. Glöden är ett box-shadow + svag radial gradient bakom noden, inte ett filter på hela zonen. Intensitet: `0 0 0 1px [accent/40%], 0 0 12px [accent/30%], 0 0 32px [accent/15%]`.

Kanter som är live (aktiv kommunikation) ritas i den anropande agentens accentfärg, ej den mottagande. Kantbredden är 1.5px i vila, 2.5px vid aktivitet.

### Error / waiting

```
--state-error:   hsl(0, 85%, 58%)     /* #f04444 — failed, ingen glow */
--state-waiting: hsl(45, 90%, 55%)    /* #f0c030 — amber, pulserande */
--state-queued:  hsl(225, 20%, 45%)   /* #616b94 — dimmad blå */
--state-success: hsl(140, 60%, 52%)   /* #3dc97a — grön, tonar ner efter 2s */
```

Error-agenter har INGEN glow. De lyser inte — de blöder. Färgen är solid röd, opacity 100%, ingen animation. Tystnad är fel.

Waiting är amber och pulsar med 2s period — den enda tillståndsanimation som är avsiktligt distraherande (du ska se att någon väntar).

---

## 4. Typografi

### Rationale

Tre nivåer: ett lättläst sans-serif för UI-struktur, ett monospace för all data och agent-output, och ett tight-weight sans för rubriker. Vi vill inte ha "tech-typografi" som ett grepp — vi vill ha läsbarhet i mörkt läge under långa sessioner.

### Fonter

**UI / agentnamn / etiketter:**
`Inter` — 14px/400 för labels, 13px/500 för sekundär text.
Alternativ om Inter känns för generisk: `DM Sans` (mer karaktär, fortfarande neutral).

**Monospace (tool calls, filvägar, event-log, prompts):**
`JetBrains Mono` — 12px/400. Ligatur av → och ≠ är tillåten. Hög x-höjd, läsbar i mörkt läge.
Alternativ: `Berkeley Mono` (mer personlighet, men betallicens).

**Session-titel / fas-rubrik:**
`Inter` 700, letter-spacing: -0.02em, 18–22px. Sparsmakat — bara en rubrik synlig åt gången.

### Skalsteg

```
--text-xs:  11px / 1.4 — tidsstämplar, sekundär meta
--text-sm:  13px / 1.5 — labels, tool call-namn
--text-base: 14px / 1.6 — brödtext, event-feed
--text-lg:  16px / 1.4 — agentnamn i nod
--text-xl:  20px / 1.2 — session-rubrik
```

---

## 5. Motion-språk

### Princip

Rörelse ska berätta något. Ingen rörelse utan informationsinnehåll. Om det rör sig utan att tala om vad som händer — ta bort det.

### Idle-puls (dead air-lösning)

Agenter i `running`-status men utan aktiva tool calls ska inte se döda ut. En mycket subtil puls i agentens glow: `opacity` oscillerar 0.6 → 1.0 med period 3.5s, easing `ease-in-out` (sinusvåg). Inte distraherande i periferin men synlig vid direkt tittande. Berättar "jag lever, jag tänker".

### Tool call — token-flykt

När ett tool call startar, flyger en liten glödande markör ut från agentens nod i verktygets riktning (mot "filsystemet" om det är Read/Write, mot "internet" om det är WebSearch). Vid PostToolUse flyger den tillbaka. Rörelseekurva: `cubic-bezier(0.25, 0, 0.1, 1)` — snabb start, mjuk landning. Duration: 400ms ut, 300ms in.

Markörer är inte sfärer — de är korta streck som lämnar ett svagt spår (motion blur via box-shadow i rörelseriktning). Storleken beror på verktyg: Write är lite större än Read.

### Kant-aktivering (agent A pratar med agent B)

En ljuspuls reser längs kanten från källa till mål. Duration: proportionell mot verklig invocation-tid, men aldrig under 800ms (annars hinner ögat inte se) och aldrig över 4s (annars tröttande). Pulsen är en gradient-punkt i källagentens färg som tonar in/ut.

### Nod-tillståndsövergångar

`queued → running`: noden fyller upp sin accent-färg under 600ms med `ease-out`. Ljust till fullt.
`running → delivered`: noden blinkar grönt en gång (200ms flash, `ease-out`), tonar sedan tillbaka till idle på 1.2s.
`running → failed`: noden skiftar direkt till röd utan transition (abrupt, intentionellt — fel är fel, inte en smooth upplevelse).
`waiting`: amber-färgen pulsar med 2s, ingenting annat rör sig.

### Canvas-layout

Noder ska inte hoppa runt. Force-directed graph med låg fjäderkonstant — låt det stabilisera sig vid sessionsstart och håll sig fast. Ny nod interpoleras in med `spring(stiffness: 80, damping: 15)`. Ingen re-layout under pågående session om inte ny agent tillkommer.

### Vad som ska vara tyst

Kantmarkering (statiska collaborations) rör sig aldrig. Session-tidslinje längst ner rör sig inte — bara spelhuvudet.

---

## 6. Ikonografi per agent

### System: initialism + rollsymbol

Varje agent-nod är en cirkel med två lager:
1. **Yttre ring** i agentens accentfärg (1.5px, opacity 40% vid idle, 100% vid active)
2. **Inre yta** i `--bg-surface`
3. **Centralt monogram**: de två första bokstäverna i agentnamnet, sans-serif 700, 14px, i accentfärgen

Ovanpå monogrammet, i nedre högra hörnet av cirkeln: en **rollikon** (12×12px, linjär). Ikonen beskriver agentens funktion, inte identitet.

### Rollikonkategorier (förslag, inte låst lista)

| Roll-typ | Ikon | Agenter |
|----------|------|---------|
| Strateg / beslutsfattare | Kompass-pil | project-lead, brand-strategist |
| Analytiker / granskare | Förstoringsglas | skeptic, competitor-analyst, market-researcher |
| Skapare / skribent | Penna | copywriter, ideator |
| Tekniker | Krets-fragment | frontend-dev, backend-dev, realtime-engineer |
| Visuell / design | Pensel | art-director, ux-designer |
| Distributions / spridning | Utsändning-pil | social-media-strategist, marketer |
| Arkivarie / struktur | Mapp | information-architect |

Ikonerna är linjeikoner, 1px stroke, samma accentfärg som monogrammet, opacity 70%. Aldrig fyllda ikoner — de ska inte konkurrera med monogrammet.

### Parallella instanser (Issue #7881-designlösning)

Om samma agent körs i flera simultana instanser: behåll en nod, lägg till en liten räknare (badge) i övre vänstra hörnet: `×2`, `×3`. Badge är i accentfärgen, 10px, halvtransparent bakgrund i `--bg-overlay`. Pulsen på noden intensifieras proportionellt (upp till 2× glow-intensitet vid 3+ instanser). Förlorar du instans-distinktionen? Ja — men det är bättre än att rita tre identiska noder som förvirrar snarare än informerar.

---

## 7. Do / Don't

### Do

1. **Låt mörkret vara grundläge** — bakgrunden är aktivt tystad, inte ett "dark mode" som är vitt med inverterade färger. Det ska kännas som ett rum på kvällen.
2. **Accentfärg som signal** — om något lyser finns det en anledning. Håll glöd och färg reserverat för tillståndsdata, aldrig för UI-chrome.
3. **Monospace för allt som är data** — filvägar, tool call-argument, event-log, timestamps. Det markerar gränsen mellan UI och innehåll.
4. **Stillhet är ett tillstånd** — en session som inte rör sig ska se intentionellt ut, inte trasig. Idle-noder är tydliga, placerade, dimmade med precision.
5. **Kanter berättar riktning** — animerade kanter har alltid en tydlig källa och ett mål. Aldrig dubbelriktad animation på en kant.

### Don't

1. **Inga dashboard-grids** — inga raka rader av identiska kort, inga lika stora kolumner, ingenting som ser ut som Grafana. Grafen är organisk, inte tabellformad.
2. **Inga bakgrundspartiklar eller ambient-flöden** — rörelser som inte är kopplade till specifika events (slumpmässiga partiklar, ambient "data-strömmar") är förbjudna. Varje pixel som rör sig ska vara svar på ett faktiskt event.
3. **Inga färg-gradients på zonytor** — solid `--bg-surface`, ingen gradient-fills på noder eller bakgrundspaneler. Gradients reserveras för glow-effekter (ljusspridning är korrekt fysik, gradientfills är dekoration).
4. **Ingen "AI-estetik"** — inga hexagonala grid-mönster, inga circuit board-texturer, inga artificiella hologram-ramar. Det är ett arbetsrum, inte en sci-fi-rekvisita.
5. **Ingen ögonblicklig feedback på allt** — inte varje klick behöver en animation. Hover-states är subtila (opacity +0.15), inte dramatiska.

---

## 8. Edge cases

### 6 agenter aktiva samtidigt

Grafen komprimerar inte — noderna behåller sina positioner men de aktiva lyser tydligare mot de dimmade idlers. Om 6 agenter är aktiva och alla har aktiva tool calls (upp till ~30 rörliga element) ska de aldrig krocka visuellt. Lösning: token-markörer som flyger mot "periferin" (utanför nodcirkeln, inte mot grannar) och återvänder. Kantar som är aktiva simultaneously ritas i ordning top-to-bottom i z-index baserat på när de aktiverades — senast aktiverad överst.

Perceptuellt: 6 aktiva glow-noder ska inte läsa som kaos. Begränsa max glow-radius till 24px — annars börjar de överlappa. Test: ta en skärmdump av max-load-state och squint-testa om du fortfarande kan skilja noder åt.

### En agent har failat

Noden är fast röd, ingen animation, ingen puls. Övriga agenter fortsätter normalt. En liten error-ikon (utropstecken i cirkel) ersätter rollsymbolen i det nedre högra hörnet. Kanten från den failade agentens förälder-invocation ritas i rött med dashed stroke.

I event-loggen (om drill-down är öppet) visas `failed` i `--state-error`-färg med felmeddelande i monospace. Det ska vara jobbigt att titta på en failad nod — tillräckligt jobbigt att du märker det, inte tillräckligt jobbigt att det saboterar hela bilden.

### Sessionen står still (dead air — inget händer)

Aktiva agenter (status `running`) pulsar svagt med idle-pulsen. Inget annat rör sig. Session-tidslinjens spelhuvud fortsätter krypa. Det ska gå att skilja "appen fungerar, agenten tänker" från "appen är trasig" — löst med: en liten alive-indikator i statusbaren (svagt pulserande grön punkt med texten "live") och timestamp på senast mottaget event.

Om inget event har kommit in på >60s: alive-indikatorn byter till amber. Det är inte ett fel — det är information.

### Okänd agent (event från agent som inte finns i `.claude/agents/`)

En placeholder-nod i `--agent-idle-color` med monogram `?` och en generisk "nod"-ikon. Placeras i periferin av grafen. Berättar att systemet mottog data men kan inte identifiera källan — viktigt för felsökning utan att bryta visualiseringen.

### Hook-server nere / event-ström bruten

Hela canvas-ytan får en tunn amber-ram (1px, `--state-waiting`). Overlay-text centrerat: "Väntar på hook-events" i `--text-sm`, monospace. Noderna och grafen visas fortfarande i sitt senaste kända tillstånd, dimmade till 50% opacity. Ger användaren max information: "jag ser teamet, men strömmen är bruten".

---

## Tekniska noteringar till frontend-dev

- Alla accentfärger genereras dynamiskt: `hsl(agentIndex * 22.5, 72%, 62%)` — ingen statisk färglista behövs i kod, bara formeln
- Glow implementeras som `box-shadow` på SVG-element via `filter: drop-shadow()`, inte CSS `box-shadow` direkt (SVG-noder kräver filter-approach)
- Token-markörer är absolut-positionerade div:ar med CSS-transition, inte canvas-renders — enklare att debugga och tillräckligt performant för frekvensen vi förväntar oss
- Font-loading: Inter via Google Fonts (eller self-hosted), JetBrains Mono via JetBrains CDN eller npm package `@fontsource/jetbrains-mono`
- Alla tidsstämplar i UI: `HH:MM:SS` i monospace, 11px, `--text-xs` — aldrig relativa tider ("2 minuter sedan") i live-läge
