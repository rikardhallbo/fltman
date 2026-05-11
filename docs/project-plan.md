# Projektplan — Live Agent Visualization

## Vad vi bygger
En lokal webbapp som live speglar hur Claude Codes agenter (definierade i `.claude/agents/`) jobbar och interagerar. Visuellt tilltalande, intuitivt, för personligt bruk.

## Scope (låst)
- **Form factor**: Lokal webbapp (lokal server + browser)
- **Liveness**: Live under körning (Claude Code hook-integration)
- **Målgrupp**: Bara användaren själv — pragmatik före polering

## Faser

### Fas 1 — Modell & koncept (parallellt)
| Agent | Leverans | Fil |
|-------|----------|-----|
| `information-architect` | Datamodell, event-schema, states | `docs/data-model.md` |
| `ideator` | Visualiseringsmetaforer (20–30 idéer) | `docs/ideas-visualization-metaphors.md` |
| `skeptic` | Feasibility-analys av live-hooks | `docs/skeptic-review-feasibility.md` |

**Beslutspunkt**: avstämning med användaren om huvudmetafor + datamodell + tekniska antaganden.

### Fas 2 — Design
| Agent | Leverans | Fil |
|-------|----------|-----|
| `ux-designer` | Interaktionsmodell, live-state-design, wireframes | `docs/ux-design.md` |
| `art-director` | Visuellt språk (färg, typografi, motion) | `docs/art-direction.md` |

**Beslutspunkt**: avstämning om hur det ska se ut och kännas.

### Fas 3 — Bygge
| Agent | Leverans | Plats |
|-------|----------|-------|
| `realtime-engineer` | Hookskript + WebSocket/SSE-server | `scripts/`, `server/` |
| `frontend-dev` | React-app, grafrendering, live-uppdatering | `web/` |

**Leverans**: körbar lokal app + setup-instruktion.

## Principer
- Pragmatik > perfektion (det är för dig själv)
- Ship något körbart tidigt, iterera
- Varje agent läser `docs/references/` först om relevant
- Vid blockerare: eskalera till användaren, inte fortsätta gissa

## Status
- Fas 1: pågår
