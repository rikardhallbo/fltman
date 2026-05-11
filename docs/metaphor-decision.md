# Metaforbeslut — Lit Workspace

**Beslut av:** project-lead (med användarens delegerade mandat)
**Datum:** 2026-05-11

## Vald riktning: Lit Workspace

En hybrid mellan **Hus med rum** (#21) och **Force-directed graph** (#1):

- Varje agent har en egen visuell **zon** på canvas — egen färgaccent, egen liten illustration eller monogram. Persona via plats.
- Mellan zonerna ritas **kanter** — tunna grå (statiska, deklarerade samarbeten) eller lysande (aktiva kommunikationer just nu).
- **Tool calls** syns som glödande markörer/tokens som flyger ut från agentens zon och tillbaka (Read = inkommande, Write = utgående).
- **Dokumentleveranser** materialiseras som ikoner som lägger sig i zonen och kan klickas för att öppna.
- Inaktiva agenter är dimmade men närvarande — alltid synliga så du minns teamet.

## Varför inte de andra

| Metafor | Varför inte |
|---------|-------------|
| Mission Control | För klyschig (alla "agent observability"-verktyg ser likadana ut). Saknar persona. |
| Staden växer | För artefakt-fokuserad — vi vill förståelse, inte minnesmärken. |
| Levande partitur | För mycket konst, för lite verktyg. Lämna som drömprojekt. |
| Ren force-directed graph | För generisk, "AI dashboard"-Twitter. Ingen persona. |
| Swimlanes/Gantt | Förlorar relationer, blir statiskt över tid. |

## Vad det här ÄR och INTE ÄR

**Är**: Ett förståelse-verktyg där du kan glance och se vem som jobbar med vem, glance vid och förstå "ah, ideator har lämnat över till skeptic, skeptic gör web searches nu", och drill-down när nyfiken.

**Inte**: En kontrollpanel för flygledare. Inte ett spel. Inte en artefakt-galleri. Inte heller en realtidsgraf av varje token-flöde.

## Risker som designteamet ska hantera

- **Issue #7881** (parallella subagenter): två `market-researcher` samtidigt → två separata zoner med suffix? Eller en zon med två "instanser" inom? `ux-designer` löser detta.
- **Dead air** (agenter som tänker utan tool calls): zonen visar idle-puls i sin accent-färg så det aldrig ser dött ut. Subtilt, inte distraherande.
- **16+ agenter på en skärm**: alla syns alltid? Eller bara aktiva + nyligen aktiva? `ux-designer` löser detta (default: alla synliga, idle dimmade till 30% opacitet).

## Vad designteamet ska leverera

- `ux-designer` → `docs/ux-design.md`: interaktionsmodell, live-state, drill-down, scrubbing, layout-logik, edge cases
- `art-director` → `docs/art-direction.md`: visuell ton, färgsystem, typografi, motion-språk, ikonografi för agenter
