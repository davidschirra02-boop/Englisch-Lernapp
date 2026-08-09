# Content-Schema für neue Wochen

Kurzreferenz zum Ergänzen weiterer Wochen, ohne die App-Architektur erneut herleiten zu müssen. Eine neue Woche = eine neue Datei `data/weeks/weekNN.js`, zusätzlich in `index.html` per `<script src="data/weeks/weekNN.js"></script>` **nach** `data/weeks-index.js` einbinden.

Themen der 13 Wochen stehen bereits in `data/curriculum.js` (`WEEK_THEMES`). Woche 1 (`data/weeks/week01.js`) ist die Referenzimplementierung — beim Schreiben neuer Wochen einfach diese Datei kopieren und Inhalte austauschen. Woche 1 wurde bewusst sehr umfangreich angelegt (siehe unten), damit eine Lektion nicht 20-30, sondern eher 45-60 Minuten dauert und der Schwierigkeitsgrad hochbleibt — neue Wochen sollen denselben Umfang haben.

Es gibt **keinen Konversationstrainer** mehr (bewusst entfernt zugunsten von mehr Grammatik-/Vokabel-/Lückentextaufgaben) — nicht versehentlich wieder einführen.

## Grundgerüst

```js
WEEKS.weekNN = {
  key: 'weekNN',
  title: 'Wochenthema (aus WEEK_THEMES)',
  days: {
    1: { grammar, vocabulary, vocabPractice, listening, quiz },
    2: { ... }, 3: { ... }, 4: { ... }, 5: { ... }, 6: { ... },
    7: { review: true, summary, quiz }   // Tag 7 ist immer reiner Review-Tag
  }
};
```

## Feld-Schemas (Tag 1-6)

- **grammar**: `{ ruleTitle, explanation, contrast, examples: [{en, de}] (3x), exercises: [...] (18x) }`
  Ein C1-relevanter Grammatikpunkt pro Tag, `explanation` und `contrast` auf Deutsch, `examples` als Satzpaare, **18 Übungen** (Mischung choice/gap), die den Grammatikpunkt aus vielen verschiedenen Blickwinkeln testen (nicht 3x dieselbe Konstruktion umformuliert).
- **vocabulary**: Array von 8 `{ word, translation, example, mnemonic, category }` — `category` = Wochenthema in 1-2 Worten, `mnemonic` auf Deutsch. Die Wortanzahl bleibt bei 8 (nicht verdreifacht); stattdessen wird jedes Wort in `vocabPractice`/`quiz` aus mehreren Blickwinkeln abgefragt (Definition, Lückentext in neuem Kontext, Übersetzungsrichtung DE→EN und EN→DE, Odd-one-out, Kollokation).
- **vocabPractice**: Array von **24 Items** (choice/gap). Davon ca. 16-18 zu den 8 neuen Wörtern des Tages, der Rest (**ab Tag 2**) gezielte Wiederholung von Vokabeln aus vorherigen Tagen derselben Woche (kumulatives Interleaving — siehe unten).
- **listening**: `{ title, sentences: [8-9 Sätze], questions: [...] (9x) }`. Wird beim Betreten des Schritts **automatisch komplett vorgelesen** (Autoplay, siehe `js/render/lesson.js` `renderListening`/`playAll`) — einzelne Sätze bleiben per Klick oder ↓/↑+Enter erneut abspielbar, das bricht die Autoplay-Sequenz ab. Die Story darf entsprechend etwas mehr Substanz haben, um 9 unterschiedliche, nicht triviale Verständnisfragen zu tragen (Reihenfolge, Zahlen/Fakten, Inferenz, im Text verwendeter Wortschatz).
- **quiz**: Array von **24 Items**. Etwa die Hälfte zur Grammatik des Tages, die andere Hälfte zu den Vokabeln des Tages, **ab Tag 2** ergänzt um ca. 5-10 Items, die Grammatik/Vokabeln früherer Tage derselben Woche wiederholen (siehe Interleaving unten).

## Kumulatives Interleaving (ab Tag 2)

Jeder Tag ab Tag 2 muss einen Teil seiner `vocabPractice`- und `quiz`-Items der **vorherigen Tage derselben Woche** widmen, nicht nur dem eigenen neuen Stoff:

- Tag 2 wiederholt Tag 1, Tag 3 wiederholt Tag 1+2, Tag 4 wiederholt Tag 1-3, usw. — je weiter die Woche fortschreitet, desto breiter die Wiederholungsbasis.
- Faustregel: von 24 `vocabPractice`-Items ca. 6-8 Review-Items älterer Tage; von 24 `quiz`-Items ca. 5-10 Review-Items (Grammatik und Vokabeln gemischt).
- Wiederholungsfragen dürfen in einem neuen Satz/Kontext stehen, müssen aber inhaltlich klar erkennbar dieselbe Vokabel/Regel abfragen wie am Ursprungstag (kein Copy-Paste des exakten Prompts nötig, aber auch keine Verwässerung der Bedeutung).
- Tag 7 (Review) bündelt das Ganze in einem großen kumulativen Quiz von **~36 Items** (je Grammatikpunkt der Woche ca. 4 Items, je Vokabeltag ca. 2 Items) — kein `grammar`/`vocabulary`/`vocabPractice`/`listening`, nur `summary` + `quiz`.

## Exercise/Quiz-Item-Typen (von `QuizEngine` genutzt)

```js
{ type: 'choice', prompt: '...', options: ['a','b','c'], answerIndex: 0, explanation: '...' }
{ type: 'gap',    prompt: '... ___ ...', answer: 'text', explanation: '...' }   // answer auch als ['text','alt']
```
`QuizEngine` bietet automatisch eine "← Zurück"-Navigation zu bereits beantworteten Fragen (Review-Ansicht) sowie Enter-Taste zum Bestätigen/Weiterspringen — dafür ist in den Daten nichts weiter nötig.

### `explanation` (Pflichtfeld auf JEDEM Item, jede Kategorie)

Bei einer falschen Antwort zeigt `QuizEngine` automatisch unter "Richtige Antwort: ..." einen zusätzlichen Erklärungsblock (`💡 ...`) mit dem Text aus `explanation`, sofern vorhanden. **Jedes Item — Grammatik-Übung, Wortschatz-Vertiefung, Hörverständnisfrage, Quiz — braucht ein `explanation`-Feld**, das kurz (1 Satz, max. 2) erklärt:
1. warum die richtige Antwort richtig ist (meist: die zugrundeliegende Regel/Bedeutung in einem halben Satz), und
2. wenn es bei einer `choice`-Frage naheliegend ist, warum die typischste falsche Option nicht passt.

Beispiele:
- Grammatik (choice, must vs. can't): `"'Can't have' drückt eine starke Vermutung aus, dass etwas NICHT passiert ist — passend, da er gerade anruft. 'Must have' würde das Gegenteil behaupten."`
- Vokabel (choice, faulty vs. new/expensive): `"'Faulty' = defekt/fehlerhaft. 'New' und 'expensive' beschreiben keinen Mangel."`
- Lücke (gap, since vs. for): `"Mit einem festen Zeitpunkt (2015) steht 'since', nicht 'for' (das für eine Zeitdauer wie 'for five years' steht)."`

Kurz halten — kein ganzer Absatz, ein prägnanter Merksatz reicht. Bei Hörverständnisfragen genügt ein Verweis auf die Textstelle (`"Im Text heißt es explizit: '...'"`).

### Eindeutigkeit von Prompts (wichtig!)

- **Klammer-Hinweise bei Modalverb-/Wahlmöglichkeiten-Lücken müssen ALLE Optionen zeigen, nie nur die richtige.** Falsch: `'The plane ___ (must/land) already.'` (verrät sofort "must"). Richtig: `"The plane ___ (must/might/can't – land) already."` — der Nutzer muss selbst herausfinden, welches Modalverb passt, das Verb in Klammern dient nur als Infinitiv-Hinweis.
- **Prompts müssen eindeutig sein, welcher Referent gemeint ist.** Beispiel für einen Fehler: "The seats are empty. The passengers ___ already boarded." — unklar, ob "seats" sich auf Flugzeugsitze oder Wartebereich-Sitze bezieht. Immer genug Kontext liefern, damit nur eine Lesart plausibel ist (z. B. Ort/Situation explizit nennen: "You are standing at the empty departure gate...").
- **Gap-Prompts, die eine feste Redewendung abfragen, sollten nicht auf ein thematisch naheliegendes, aber falsches Wort hinlenken.** Beispiel: `'I almost ___ ___ ___ because the taxi arrived late.'` an einem Tag mit Fokus auf "connecting flight" führt dazu, dass Nutzer "missed my connecting flight" statt der erwarteten Antwort "missed my flight" eingeben. Kontext so gestalten, dass die Zielredewendung eindeutig die einzig plausible Antwort ist (z. B. explizit erwähnen, dass es kein Anschlussflug ist).

## Tag 7 (Review)

```js
7: {
  review: true,
  summary: { intro, grammarPoints: [6 Stichpunkte, je 1 Zeile], encouragement },
  quiz: [ ... ~36 Items, gemischt aus der ganzen Woche (siehe Interleaving oben) ... ]
}
```

## Baby-Schritte für Folge-Sessions

1. Nach `/compact`: kurz diese Datei lesen, dann direkt `data/weeks/week02.js` nach obigem Schema schreiben (Thema aus `WEEK_THEMES[1]`).
2. `<script>`-Tag in `index.html` ergänzen.
3. Kein Refactoring an Engine-Code (`js/*`) nötig — die Engine ist bewusst datengetrieben und braucht keine Änderung für neue Wochen.
4. Im Browser kurz Tag 8 (erster Tag der neuen Woche) durchklicken, dann `/compact` vor der nächsten Woche.
