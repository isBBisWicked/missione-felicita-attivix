# Attivix — Missione Felicità

Piccolo gioco punta e clicca che racconta una cosa semplice: un gesto di volontariato non finisce quando hai completato un'attività. Genera benessere per chi riceve aiuto, rende più forte la comunità e restituisce qualcosa anche a chi si mette in gioco.

Nel gioco il volontario si muove nella piazza Attivix, risponde a quattro richieste e accumula due valori:

- **felicità diffusa**, cioè l'impatto nella comunità;
- **punti Attivix (PX)**, cioè la parte di valore che torna nel portafoglio del volontario.

Il portafoglio è una metafora ludica: non rappresenta denaro né una ricompensa economica reale. Serve a mostrare che l'impegno può essere riconosciuto, valorizzato e trasformato in appartenenza.

## Cosa fa

- Quattro missioni punta e clicca nella piazza della comunità
- Volontario animato che raggiunge ogni richiesta
- Barre di felicità per persone e luoghi
- Portafoglio Attivix con punti PX
- Diario degli ultimi gesti
- Salvataggio locale dei progressi con `localStorage`
- Reset della partita
- Layout responsive per desktop e smartphone

## Missioni

```text
Franco  — Lezione digitale
Anna    — Spesa solidale
Parco   — Cura condivisa
Lucia   — Un po' di compagnia
```

Ogni missione produce felicità e aggiunge punti al portafoglio Attivix. Il rapporto non è matematicamente “reale”: è una scelta narrativa per spiegare il principio di reciprocità tra volontario, persona e comunità.

## Tecnologie

- HTML
- CSS
- JavaScript
- LocalStorage del browser

Non usa backend, database, framework o servizi esterni. Può essere pubblicato direttamente su GitHub Pages, che ospita file statici HTML, CSS e JavaScript presi da un repository GitHub.

## Avvio

Clona il progetto:

```bash
git clone https://github.com/TUO-USERNAME/attivix-missione-felicita.git
```

Apri la cartella e avvia `index.html` nel browser.

## Struttura

```text
attivix-missione-felicita/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Nota sui dati

Il gioco salva punteggio, felicità e diario nel browser del visitatore. Se vengono cancellati i dati del sito o si usa un altro dispositivo, la partita ricomincia.

Per una futura versione collegata a veri account Attivix, i punti dovrebbero essere calcolati e convalidati lato server: un punteggio economico o premiale non va mai affidato soltanto al JavaScript visibile nel browser.

## Idee per evolverlo

- Avatar selezionabile e personalizzabile
- Più quartieri, più enti e più missioni
- Livelli e badge di comunità
- Missioni cooperative tra volontari
- Mini-quiz sulla cittadinanza attiva
- Collegamento a eventi o opportunità di volontariato reali
- Integrazione con un portafoglio Attivix autentico tramite backend protetto

## Licenza

Puoi usare, modificare e migliorare liberamente il progetto.

La cosa importante è non perdere il messaggio: i punti sono simpatici, ma il valore del volontariato resta nelle relazioni e nei cambiamenti concreti che mette in moto.
