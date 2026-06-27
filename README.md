# Attivix — Missione Felicità

Un piccolo gioco punta e clicca sul valore concreto del volontariato.

La città presenta quattro richieste: accompagnare Franco nella sua autonomia digitale, aiutare Anna con la spesa, prendersi cura di un luogo condiviso e dedicare tempo all'ascolto di Lucia. Ogni gesto aumenta la felicità in circolo e riconosce al volontario alcuni PX nel portafoglio Attivix.

Non è un simulatore di economia. È un modo semplice per raccontare una cosa più vera: il volontariato genera impatto per chi riceve aiuto, per il contesto e anche per chi sceglie di esserci.

## Cosa fa

- Mappa interattiva con quattro missioni;
- movimento del volontario verso il punto scelto;
- indicatore della felicità diffusa nella comunità;
- PX riconosciuti nel portafoglio Attivix;
- diario dei gesti conclusi;
- salvataggio automatico tramite `localStorage`;
- interfaccia responsive, senza framework.

## Avvio

Apri `index.html` nel browser oppure pubblica la cartella direttamente con GitHub Pages.

```text
attivix-missione-felicita/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Nota tecnica

I progressi restano nel browser dell'utente. Il pulsante “Azzera partita” rimuove punti, missioni completate e diario locale.

## Idea visiva

L'interfaccia usa una mappa illustrata e un linguaggio grafico da manifesto di quartiere, evitando dashboard generiche e carte arrotondate da applicazione SaaS.

## Licenza

Puoi usare e modificare il progetto liberamente. Per un'integrazione reale con Attivix, i PX dovrebbero essere poi gestiti lato server con regole, autenticazione e antifrode.
