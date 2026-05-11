# Fas 1 — Syntes och beslutspunkter

## Vad teamet levererat

- `docs/data-model.md` — entiteter, relationer, states, wire-format (mål-skema, anpassas mot verklighet)
- `docs/ideas-visualization-metaphors.md` — 31 visualiseringsmetaforer i tre nivåer
- `docs/skeptic-review-feasibility.md` — feasibility-analys med 5 failure modes och 5 villkor

## Det viktigaste i ett stycke

Tekniskt görbart, men inte naivt. Claude Codes hook-system har en **dokumenterad bugg** (Issue #7881) som gör att vi inte säkert kan skilja parallella subagenter åt — den exakta funktion som är mest spännande att visa. Async hooks är obligatoriskt eller vi saboterar din Claude Code-prestanda. Och: **flera publika projekt finns redan** (disler, patoles, hoangsonww) som gör ungefär samma sak — så vi måste svara på "varför bygger vi det här?".

`ideator` levererar tre starka metaforspår: **Mission Control** (kraftfullt verktyg), **Staden växer** (artefakt över tid), **Levande partitur** (konst). Plus en outsider, **Hus med rum**, som ger varje agent en persona.

## Tre beslut som behöver tas innan Fas 2

### Beslut 1: Vad ÄR det här verktyget?
Skeptic flaggade detta som svagast antagande. Tre helt olika produkter:
- **Förståelse-verktyg** — "Jag vill se hur mitt team faktiskt fungerar"
- **Debug-verktyg** — "När något går snett vill jag förstå varför"
- **Demo/artefakt** — "Jag vill ha något snyggt att visa upp / spara"

Påverkar metafor, informationstäthet, hela UX.

### Beslut 2: Spike först eller bygga direkt?
Skeptic rekommenderar 30 minuters spike: skriv en bash-hook som loggar HELA payloaden vid en session med parallella subagenter, så vi vet vad vi faktiskt får.

- **Spike först** — verifierar antagandena innan vi designar mot dem. Kostar 30 min, sparar potentiellt dagar.
- **Bygga direkt** — snabbare start men risk att vi designar mot fel datamodell och måste göra om.

### Beslut 3: Huvudmetafor-riktning
Vi behöver inte låsa allt nu, men en riktning innan `ux-designer` och `art-director` börjar:

- **Mission Control** — multiskärm, telemetri, mörkt tema, kraftfullt. Risk: klyscha.
- **Staden växer** — byggnader som växer, skyline som artefakt över tid. Risk: SimCity-clown.
- **Levande partitur** — sessionen ritar sig själv som ett musikstycke. Risk: konst > verktyg.
- **Hus med rum** — agenterna har egna rum, du ser dem röra sig mellan. Risk: gimmick.
- **Hybrid / annat** — kombinera flera, eller välj något helt annat.

## Min rekommendation som project-lead

1. **Spike först.** 30 minuter sparar potentiellt en vecka. Det är `realtime-engineer`s första uppgift.
2. **Förståelse-verktyg** som primär identitet — det matchar "bara du själv"-scopet. Demo-aspekten kan komma som bonus.
3. **Hus med rum** som primärriktning, eventuellt med Mission Control-element för aktiv aktivitet. Varför: ger agenterna persona (matchar att de redan har distinkta roller), tål långsamma sessioner (du kan titta in i ett rum), och är ovanligt nog för att inte vara en till "dashboard".

Men det här är ditt beslut. Jag tar nästa fas oavsett vad du väljer.

## Risker som följer med oavsett val

- **Issue #7881** måste hanteras designmässigt (heuristisk korrelation eller transcript-JSONL som backup)
- **Async hooks obligatoriskt** med latensbudget
- **Failsafe-script** — hooks får aldrig blockera Claude Code
- **Differentiering vs disler** — kort produktbrief som svarar "varför inte forka deras"

Dessa bakas in i Fas 2-3 av `ux-designer` och `realtime-engineer`.
