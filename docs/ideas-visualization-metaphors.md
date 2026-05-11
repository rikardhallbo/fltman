# Visualiseringsmetaforer — Live Agent Team

**Brief**: Lokal webbapp som live speglar Claude Codes agenter (16+ st i `.claude/agents/`). Det ska synas när en agent startar, gör tool calls, levererar dokument, och anropar en annan agent. Användaren är ensam tittare — verktyg för att förstå sitt eget team.

**Antaganden jag jobbar mot**:
- Få samtidiga agenter (1–6 aktiva åt gången, resten idle)
- Händelsetyper: start, tool call, fil-leverans, agent-handoff, slut, fel
- Kort till medellång session (minuter till någon timme)
- En användare, en skärm

Nedan: 28 metaforer, från säkrast till galnaste.

---

## Säkra grundkoncept (10)

### 1. Force-directed agent graph
Klassiska noder och kantar: en cirkel per agent, linjer som pulserar när två agenter pratar. Aktiva noder växer, idle noder är dimmade. Tool calls syns som små satelliter som snurrar runt noden.
- **Varför det kan funka**: Universellt begripligt, skalar till 20+ agenter, lätt att implementera med d3-force eller cytoscape.
- **Varför det kan flopa**: Trist, ser ut som vilken "AI agent dashboard" som helst på Twitter. Säger inget om *vad* agenterna faktiskt gör.

### 2. Swimlane / Gantt-tidslinje
Varje agent är en horisontell lane. Aktivitet ritas som block längs tidsaxeln, tool calls som ikoner inuti blocken, handoffs som diagonala pilar mellan lanes. Spelhuvudet vandrar åt höger live.
- **Varför det kan funka**: Tidsdimensionen är central i agent-arbete. Lätt att se vem som flaskhalsar. Bra för post-mortem.
- **Varför det kan flopa**: Statisk känsla — "live" blir bara en linje som kryper. Inte särskilt vackert.

### 3. Kanban-board som pulserar
Tre kolumner: Idle / Working / Done. Agentkort glider mellan kolumner i realtid. Working-kolumnen har subaktivitet (tool calls listas under kortet).
- **Varför det kan funka**: Bekant från Trello/Jira, kräver nästan ingen förklaring. Bra översikt över "vad händer just nu".
- **Varför det kan flopa**: Förlorar relationerna mellan agenter — vem anropade vem? Och det är för "kontorigt" för ett kreativt projekt.

### 4. Stafett-loppspår
Cirkulär eller oval bana med agenterna som löpare. Stafettpinnen (kontexten) skickas vidare när en handoff sker. Aktiv löpare lyser, andra står still på banan.
- **Varför det kan funka**: Intuitiv metafor för sekventiellt arbete med överlämningar. Lekfull.
- **Varför det kan flopa**: Förutsätter linjär ordning — i verkligheten kör flera agenter parallellt och project-lead pratar med alla.

### 5. Org-chart / hierarkiskt träd
Project-lead i toppen, andra agenter under, grupperade i faser. Lyser upp när aktiva, animerade pilar visar kommunikation.
- **Varför det kan funka**: Speglar faktiska rapporteringsstrukturen i CLAUDE.md. Tydligt för någon som tänker i organisationer.
- **Varför det kan flopa**: Statisk struktur döljer den faktiska dynamiken — i praktiken är samarbetet mer av ett nät än ett träd.

### 6. Sequence diagram (live UML)
Som ett UML sequence-diagram som ritas ut i realtid. Vertikala lifelines per agent, horisontella pilar för meddelanden, aktiveringsboxar för pågående arbete.
- **Varför det kan funka**: Programmerare älskar det. Ger exakt teknisk insyn. Bra för debug.
- **Varför det kan flopa**: Torrt och tekniskt. Skalar inte när sessionen blir lång — diagrammet blir oändligt högt.

### 7. Pipeline med rörflöden
Industriellt rörsystem där "kontext" och "dokument" flödar mellan agent-stationer. Tjockare rör = mer trafik. Tool calls är ventiler som öppnas/stängs.
- **Varför det kan funka**: Visuellt rikt, känns levande, passar metaforen "produktionslinje".
- **Varför det kan flopa**: Lätt att överarbeta visuellt och dölja informationen. Och agenterna är inte deterministiska som en pipeline.

### 8. Galaxkarta / star map
Varje agent är en stjärna. Tool calls är planeter i omloppsbana. När två agenter kommunicerar lyser en linje upp som en ljusbåge mellan stjärnorna. Hela kosmos är "ditt team".
- **Varför det kan funka**: Snyggt, lugnt, skalbart, tål att tittas på över tid.
- **Varför det kan flopa**: Klyscha i AI-världen ("AI som rymd"). Lätt att avstånd och position blir godtyckliga och därför meningslösa.

### 9. Card-deck / spelarmöte
Varje agent är ett spelkort i en grid. Aktiva kort vänds upp och visar sitt nuvarande arbete (tool call, fil), inaktiva är baksidor. Som ett tableau i ett tableau-spel.
- **Varför det kan funka**: Kompakt, ren, lätt att se alla 16 samtidigt. Lättimplementerat som CSS-grid.
- **Varför det kan flopa**: Relationerna försvinner — du ser status men inte flödet mellan agenter.

### 10. Activity feed / Twitter timeline
Vertikal feed där agenterna "postar" vad de gör i realtid: "ideator: skapade `ideas-visualization-metaphors.md`", "skeptic: läser dokumentet". Avatar-bilder per agent.
- **Varför det kan funka**: Format alla förstår från sociala medier. Lätt att skanna, lätt att scrolla tillbaka.
- **Varför det kan flopa**: Textigt och platt — använder inte skärmens visuella potential. Säger inget om struktur.

---

## Strecher (10)

### 11. Symfoniorkester
Agenterna sitter i en orkester-uppställning. Project-lead är dirigent. När en agent "spelar" lyfter den instrumentet och toner kommer ut (visuellt eller även auditivt). Olika sektioner = olika faser (stråk = research, blås = design, slagverk = bygge).
- **Varför det kan funka**: Vacker och poetisk metafor — och *passar*, för agenter spelar olika roller i en helhet. Kan ha riktigt ljud.
- **Varför det kan flopa**: Svår att göra utan att bli kitschig. Statisk uppställning säger lite om realtidsflöden. Mycket designarbete.

### 12. Väderkarta över teamet
Som SVT:s väderkarta men kartan är ditt agent-landskap. Aktivitet ritas som väderfronter: ett lågtryck rör sig från `market-researcher` mot `brand-strategist`. Stormar = höga aktivitetsnivåer. Soligt = idle.
- **Varför det kan funka**: Otippad metafor som ger en *känsla* för "vart pekar arbetet just nu". Bra för intuition snarare än precision.
- **Varför det kan flopa**: Inte exakt nog — du kan inte se *vilket* dokument som levererades. Bättre som komplement än huvudvy.

### 13. Mission control / NASA-kontrollrum
Multiskärms-look. En huvudskärm visar "uppdraget" (vilken fas, vilken deliverable), sidoskärmar visar agent-telemetri (CPU-liknande stapeldiagram av aktivitet), och en logg-feed kör i botten. Mörkt tema, grönt och bärnstensfärgat.
- **Varför det kan funka**: Får dig att känna dig som flygledare över ditt team. Tillåter mycket information samtidigt. Kraftfullt visuellt.
- **Varför det kan flopa**: Risk för UI-fetisch som ser cool ut men inte hjälper förståelse. Klyscha (alla "agent observability"-verktyg gör det här).

### 14. Roman/manus som skrivs ut i realtid
Hela sessionen renderas som ett pjäsmanus eller en roman: "INTERIÖR. PROJEKT-RUMMET. KVÄLL. — *project-lead vänder sig till ideator:* 'Generera 20 visualiseringskoncept.' — *ideator börjar bläddra i docs/...*". Texten skrivs ut bokstav för bokstav.
- **Varför det kan funka**: Litterärt, känns som narrativ snarare än telemetri. Helt unikt och delningsvärt.
- **Varför det kan flopa**: Försvinner vid hög aktivitet — du kan inte parallellt-läsa fyra trådar. Och text för ett "visuellt tilltalande" projekt är kontroversiellt.

### 15. Byggarbetsplats / staden växer
Varje agent är en byggnad som byggs våning för våning när den jobbar. Dokument som levereras = nya våningar. Tool calls = arbetare som springer fram och tillbaka. Vid slutet av sessionen har du en skyline.
- **Varför det kan funka**: Tillfredsställande progression över tid. Slutresultatet (skylinen) är en artefakt i sig. Lekfull.
- **Varför det kan flopa**: Lätt att bli SimCity-clown istället för informativt verktyg. Skala kan bli stökig efter en längre session.

### 16. Akvarium / ekosystem
Agenterna är fiskar eller kreatur i ett akvarium. Storlek och simhastighet reflekterar aktivitet. När två agenter pratar simmar de bredvid varandra. Vid leverans släpper de en glödande "ägg-fil" som flyter upp.
- **Varför det kan funka**: Lugn, levande, vacker att titta på i bakgrunden. Anti-dashboard.
- **Varför det kan flopa**: För abstrakt — svårt att veta *vilken* fisk som är vem och vad de gör. Stannar i estetik, lämnar funktion.

### 17. Subway/tunnelbanekarta
Varje agent är en linje med stationer (= deliverables, milstolpar). Ett "tåg" rör sig längs linjen när agenten arbetar. Bytespunkter är där agenter samarbetar. Bygg som Beck-map med raka 45-gradersvinklar.
- **Varför det kan funka**: Subway-maps är geniala för att kommunicera komplex topologi enkelt. Estetiskt klassiskt. Fast struktur per agent.
- **Varför det kan flopa**: Statiska linjer matchar inte agenternas faktiska improvisation. Kräver att stationerna är förutbestämda.

### 18. Lava lamp / partikelflöden
Sömlös animerad blob där varje agent är en färgad strömning av partiklar. När agenter kommunicerar smälter deras färger temporärt. Hög aktivitet = mer rörelse, lugn = sakta seg lava.
- **Varför det kan funka**: Skitvackert, kan köras som ambient background hela dagen. Estetiskt unikt.
- **Varför det kan flopa**: Nästan ingen praktisk information utvinns. Bra som hjärtslag, dåligt som verktyg. Men: kanske räcker det?

### 19. Kakelugn / ugn med rum
Sett ovanifrån: ett byggnadssnitt av ett hus med ett rum per agent. Du ser dem röra sig mellan rum, ljuset tänds när någon är där, rök stiger från skorstenen när det levereras något. The Sims möter status dashboard.
- **Varför det kan funka**: Förvånansvärt fysiskt och rumsligt — ger agenter ett "hem", vilket gör dem mer karaktärsfulla. Konkret.
- **Varför det kan flopa**: 16 rum blir trångt. Behöver karaktärsdesign per agent (mycket initialt jobb). Risk för gimmick.

### 20. Tarot-spread som drar sig själv
Sessionen ritas som en Tarot-spread där varje agents arbete avslöjas som ett kort som vänds. Korten har symboler för agentens roll (svärd = skeptic, mynt = finance-analyst, etc.).
- **Varför det kan funka**: Mystiskt, vackert, ger en känsla av att "läsa ödet" av sin produkt. Unik atmosfär.
- **Varför det kan flopa**: Lite för "spiritualistisk" för ett tekniskt verktyg. Kortet-vänds-en-gång passar inte iterativt arbete.

---

## Vilda kort (5)

### 21. Live Mariokart-bana / agentrace
Det är ett race. Agenterna kör go-karts på en bana där varje "varv" är ett deliverable. De krockar, åker av banan (= fel), tar power-ups (= tool calls). Project-lead är race-marshallen som viftar med flaggor.
- **Varför det kan funka**: Roligt! Gör monitorering till underhållning. Du kommer titta på det.
- **Varför det kan flopa**: Racingmetaforen suggererar konkurrens mellan agenter — de samarbetar ju. Och hela tonen blir fånig.

### 22. Levande partitur som komponeras
Sessionen ritar sig själv som ett musikaliskt partitur. Varje agent är ett instrumentstämme. Tool calls är noter, handoffs är fermat-tecken, fel är pauser. Du kan klicka för att höra partituret hittills.
- **Varför det kan funka**: Förenar idé 11 (orkester) med konkret notation. Sparbart som artefakt. Sjukt unikt.
- **Varför det kan flopa**: Kräver komposition i realtid som faktiskt låter bra (svårt!). Notläsning är inte universell. Förmodligen mer konst än verktyg.

### 23. Ouija-board
Ett ouija-board där en planchette glider mellan agent-namnen tryckta på brädet. När en agent jobbar pekar plancheten på den. Vid handoff glider den. Bokstäver runtom används för att stava ut tool calls bokstav-för-bokstav. Pure spookiness.
- **Varför det kan funka**: Otippat, lite obehagligt, oförglömligt. Konceptet "AI-agent som anda" är poetiskt rätt.
- **Varför det kan flopa**: Begränsad informationstäthet — en planchette i taget, en bokstav i taget. Och möjligen smaklöst beroende på publik.

### 24. Köket på en stjärnkrog
Ett 3D-kök sett uppifrån. Agenter är kockar vid olika stationer (sauce, grill, dessert, pass). Dokument är talrikar som skickas mellan stationer. Project-lead är head chef som ropar order ("ORDER UP — copy för LinkedIn!"). Ljudet av ringklocka vid leverans.
- **Varför det kan funka**: Kitchen-confidential-vibe är passande för ett kreativt team under press. Kan ha riktigt ljud (Gordon Ramsay-energi).
- **Varför det kan flopa**: Helt fel ton för ett lugnt soloprojekt. Och svår att göra utan att bli pixelart-clown.

### 25. Tamagotchi-farm av agenter
Varje agent är en liten varelse i en burk. De blir glada (jobbar), trötta (idle länge), hungriga (väntar på input). Du måste mata, klappa, uppmuntra. Mängden känslosvar styrs av hur ofta de används.
- **Varför det kan funka**: Skapar emotionell relation till agenterna. Förvandlar verktyget till sällskap. Mycket personligt.
- **Varför det kan flopa**: Antropomorfiseringen kan stå i vägen för faktisk förståelse. Och: vill du ta hand om dem? Antagligen inte.

---

## Mina topp-3 hetspots (rekommenderas till avstämning)

Inte beslut — men de jag tycker man bör reagera på först:

- **#13 Mission Control** — om vi vill ha *kraft* och insyn för debug och översikt
- **#15 Byggarbetsplats / staden växer** — om vi vill att resultatet ska *kännas som något som byggs*
- **#22 Levande partitur** — om vi vågar gå från verktyg till artefakt

Och en outsider: **#19 Kakelugn / hus med rum** — för att den ger agenterna persona på ett sätt inget annat gör.
