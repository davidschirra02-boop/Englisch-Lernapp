# Content-Schema für neue Wochen

Kurzreferenz zum Ergänzen weiterer Wochen, ohne die App-Architektur erneut herleiten zu müssen. Eine neue Woche = eine neue Datei `data/weeks/weekNN.js`, zusätzlich in `index.html` per `<script src="data/weeks/weekNN.js"></script>` **nach** `data/weeks-index.js` einbinden.

Themen der 13 Wochen stehen bereits in `data/curriculum.js` (`WEEK_THEMES`). Woche 1 (`data/weeks/week01.js`) ist die Referenzimplementierung — beim Schreiben neuer Wochen einfach diese Datei kopieren und Inhalte austauschen. Woche 1 wurde bewusst vertieft (siehe unten), damit eine Lektion nicht 5-10, sondern eher 20-30 Minuten dauert — neue Wochen sollen densselben Umfang haben.

## Grundgerüst

```js
WEEKS.weekNN = {
  key: 'weekNN',
  title: 'Wochenthema (aus WEEK_THEMES)',
  days: {
    1: { grammar, vocabulary, vocabPractice, listening, conversation, quiz },
    2: { ... }, 3: { ... }, 4: { ... }, 5: { ... }, 6: { ... },
    7: { review: true, summary, quiz }   // Tag 7 ist immer reiner Review-Tag
  }
};
```

## Feld-Schemas (Tag 1-6)

- **grammar**: `{ ruleTitle, explanation, contrast, examples: [{en, de}] (3x), exercises: [...] (6x) }`
  Ein C1-relevanter Grammatikpunkt pro Tag, `explanation` und `contrast` auf Deutsch, `examples` als Satzpaare, **6 Übungen** (Mischung choice/gap).
- **vocabulary**: Array von 8 `{ word, translation, example, mnemonic, category }` — `category` = Wochenthema in 1-2 Worten, `mnemonic` auf Deutsch.
- **vocabPractice**: Array von **6 Items** (choice/gap), die genau die 8 Wörter aus `vocabulary` abfragen — eigener Lektionsschritt direkt nach den Flashcards, damit die Wörter aktiv statt nur passiv gelernt werden.
- **listening**: `{ title, sentences: [6-8 Sätze], questions: [...] (3x) }`
- **conversation**: `{ situation, start: 'n1', nodes: { n1: {...}, ..., end: { them, end:true } } }`
  **5 Knoten tief** (`n1`-`n5` + `end`). Jeder Knoten: `{ them, next: 'nX', choices: [...] }` mit **3 Choices**: genau 1x `{text, correct:true}`, 2x `{text, correct:false, feedback:'...'}`. Die beiden Falsch-Antworten müssen **plausibel und subtil falsch** sein (z. B. leicht zu förmlich/zu informell, ein typischer deutscher Interferenzfehler wie "since three years", eine falsche Zeitform, ein unpassender Ton) — **nicht** offensichtlich unhöflich oder absurd, sonst ist die richtige Antwort zu leicht erkennbar. Jede falsche Antwort braucht ein eigenes, kurzes deutsches Feedback, das erklärt, warum sie falsch ist und wie es richtig heißt. Die Anzeige-Reihenfolge der Choices wird vom Renderer automatisch zufällig gemischt — die Reihenfolge in den Daten spielt keine Rolle.
- **quiz**: Array von **8 Items**, Mischung aus Grammatik und Vokabeln des Tages.

## Exercise/Quiz-Item-Typen (von `QuizEngine` genutzt)

```js
{ type: 'choice', prompt: '...', options: ['a','b','c'], answerIndex: 0 }
{ type: 'gap',    prompt: '... ___ ...', answer: 'text' }          // oder answer: ['text','alt']
```
`QuizEngine` bietet automatisch eine "← Zurück"-Navigation zu bereits beantworteten Fragen (Review-Ansicht) sowie Enter-Taste zum Bestätigen/Weiterspringen — dafür ist in den Daten nichts weiter nötig.

### Eindeutigkeit von Prompts (wichtig!)

- **Klammer-Hinweise bei Modalverb-/Wahlmöglichkeiten-Lücken müssen ALLE Optionen zeigen, nie nur die richtige.** Falsch: `'The plane ___ (must/land) already.'` (verrät sofort "must"). Richtig: `"The plane ___ (must/might/can't – land) already."` — der Nutzer muss selbst herausfinden, welches Modalverb passt, das Verb in Klammern dient nur als Infinitiv-Hinweis.
- **Prompts müssen eindeutig sein, welcher Referent gemeint ist.** Beispiel für einen Fehler: "The seats are empty. The passengers ___ already boarded." — unklar, ob "seats" sich auf Flugzeugsitze oder Wartebereich-Sitze bezieht. Immer genug Kontext liefern, damit nur eine Lesart plausibel ist (z. B. Ort/Situation explizit nennen: "You are standing at the empty departure gate...").
- **Gap-Prompts, die eine feste Redewendung abfragen, sollten nicht auf ein thematisch naheliegendes, aber falsches Wort hinlenken.** Beispiel: `'I almost ___ ___ ___ because the taxi arrived late.'` an einem Tag mit Fokus auf "connecting flight" führt dazu, dass Nutzer "missed my connecting flight" statt der erwarteten Antwort "missed my flight" eingeben. Kontext so gestalten, dass die Zielredewendung eindeutig die einzig plausible Antwort ist (z. B. explizit erwähnen, dass es kein Anschlussflug ist).

## Tag 7 (Review)

```js
7: {
  review: true,
  summary: { intro, grammarPoints: [6 Stichpunkte, je 1 Zeile], encouragement },
  quiz: [ ... 14 Items, gemischt aus der ganzen Woche ... ]
}
```

## Baby-Schritte für Folge-Sessions

1. Nach `/compact`: kurz diese Datei lesen, dann direkt `data/weeks/week02.js` nach obigem Schema schreiben (Thema aus `WEEK_THEMES[1]`).
2. `<script>`-Tag in `index.html` ergänzen.
3. Kein Refactoring an Engine-Code (`js/*`) nötig — die Engine ist bewusst datengetrieben und braucht keine Änderung für neue Wochen.
4. Im Browser kurz Tag 8 (erster Tag der neuen Woche) durchklicken, dann `/compact` vor der nächsten Woche.
