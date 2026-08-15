# Content-Schema für neue Wochen

Kurzreferenz zum Ergänzen weiterer Wochen, ohne die App-Architektur erneut herleiten zu müssen. Eine neue Woche = eine neue Datei `data/weeks/weekNN.js`, zusätzlich in `index.html` per `<script src="data/weeks/weekNN.js"></script>` **nach** `data/weeks-index.js` einbinden.

Themen der 13 Wochen stehen bereits in `data/curriculum.js` (`WEEK_THEMES`). Woche 1+2 (`data/weeks/week01.js`, `week02.js`) sind die Referenzimplementierung — beim Schreiben neuer Wochen einfach eine dieser Dateien kopieren und Inhalte austauschen. **Stand 2026-08-14: beide Wochen wurden komplett auf das unten beschriebene, deutlich anspruchsvollere Schema überarbeitet** (schwierigere Grammatik, volle 20-Wörter-Abdeckung, neuer `translation`-Block, `topic`/Hinweis-Felder) — neue Wochen (3-13) müssen diesem aktuellen Schema folgen, nicht einer älteren, kürzeren Fassung.

Es gibt **keinen Konversationstrainer** mehr (bewusst entfernt zugunsten von mehr Grammatik-/Vokabel-/Lückentextaufgaben) — nicht versehentlich wieder einführen.

## Grundgerüst

```js
WEEKS.weekNN = {
  key: 'weekNN',
  title: 'Wochenthema (aus WEEK_THEMES)',
  days: {
    1: { grammar, vocabulary, vocabPractice, translation, listening, quiz },
    2: { ... }, 3: { ... }, 4: { ... }, 5: { ... }, 6: { ... },
    7: { review: true, summary, quiz }   // Tag 7 ist immer reiner Review-Tag
  }
};
```

## Feld-Schemas (Tag 1-6)

- **grammar**: `{ ruleTitle, explanation, contrast, examples: [{en, de}] (3x), exercises: [...] (18x) }`
  Ein C1-relevanter Grammatikpunkt pro Tag, `explanation`/`contrast` auf Deutsch, **18 Übungen**, die den Punkt aus vielen Blickwinkeln testen. **Schwierigkeitsanforderung (seit 2026-08-14):** keine plumpen Signalwörter, die die Antwort verraten (z. B. nicht ständig "for two hours!" als Continuous-Trigger) — stattdessen echte Verständnisfallen: Stativ-Verb-Fallen, Kontraste zwischen zwei ähnlich klingenden Strukturen im selben Satz, Fälle, in denen die naheliegende Antwort falsch ist, Register-/Formalitätsunterschiede, Alternativausdrücke zur Hauptregel (z. B. "unless"/"provided that" statt nur "if", "have got to" statt "have to").
- **vocabulary**: Array von **20** `{ word, translation, example, mnemonic, category }` — `category` = Wochenthema in 1-2 Worten, `mnemonic` auf Deutsch.
- **vocabPractice**: Array von **ca. 26-34 Items** (choice/gap). **Muss alle 20 Wörter des Tages mindestens einmal als `topic` abdecken** (nicht nur eine Auswahl!) — typischerweise 1-2 Items pro Wort. **Ab Tag 2** zusätzlich ca. 8 Interleaving-Items, die Vokabeln aus vorherigen Tagen derselben Woche wiederholen (siehe Interleaving unten).
- **translation**: **Neuer Block (seit 2026-08-14).** Array von **ca. 20-24 Items** vom Typ `'translate'` (siehe unten) — ganze Sätze Deutsch→Englisch, die **alle 20 Wörter des Tages** mindestens einmal abdecken, plus 2 Interleaving-Sätze mit Vokabeln vorheriger Tage und 2 "Combo"-Sätze, die die Grammatik des Tages mit einem Vokabelwort kombinieren. Wird als eigener Lektionsschritt ("Übersetzung") zwischen `vocabPractice` und `listening` angezeigt (siehe `js/render/lesson.js`).
- **listening**: `{ title, sentences: [8-9 Sätze], questions: [...] (9x) }`. Wird beim Betreten automatisch vorgelesen (Autoplay).
- **quiz**: Array von **ca. 29 Items**. Ca. 10 neue Grammatik-Items + ca. 14 neue Vokabel-Items (decken möglichst viele der 20 Tageswörter ab, nicht zwingend alle — `vocabPractice`/`translation` tragen die Vollabdeckungs-Pflicht) + 5 Interleaving-Items (Grammatik/Vokabeln früherer Tage **und** früherer Wochen).

## `topic`-Feld + `spaceOutTopics()` (wichtig, seit 2026-08-14)

**Jedes Item** (in `grammar.exercises`, `vocabPractice`, `translation`, `quiz`) bekommt ein `topic`-Feld: bei Vokabel-Items exakt der `word`-String (z. B. `topic: 'to break the ice'`), bei Grammatik-Items ein kurzer, eindeutiger Bezeichner des Szenarios (z. B. `topic: 'must-have-review'`). **Zweck:** `spaceOutTopics()` (in `js/quizEngine.js`) ordnet Items zur Laufzeit so um, dass zwei Items zum selben `topic` nie direkt aufeinanderfolgen — auch nach dem Mischen im Grammatik-Tab. Das verhindert, dass man aus der Reihenfolge erraten kann, dass die nächste Frage dasselbe Wort/denselben Punkt behandelt. Items ohne `topic` werden nie als Kollision gewertet (rückwärtskompatibel). **Beim Schreiben neuer Wochen: `topic` auf jedem Item nicht vergessen**, sonst verpufft der Schutz für diese Items.

## Hinweis-Felder (Hints, seit 2026-08-14)

Bei `type: 'gap'`-Items können optional zwei Hinweis-Buttons angezeigt werden:
- `hintWord`: deutsche Übersetzung des gesuchten Worts/der Wendung (Button "🔤 Nur das gesuchte Wort").
- `hintSentence`: deutsche Übersetzung des ganzen Satzes (Button "📝 Ganzen Satz übersetzen").

Bei `type: 'translate'`-Items (siehe unten) gibt es stattdessen `hintTargetWord`: das gesuchte Wort auf Englisch (Button "🔤 Gesuchtes Wort (Englisch)") — sinnvoll, weil bei `translate` der ganze Satz ja bereits die Aufgabe ist.

**Beide Felder sind optional** — ohne sie erscheint einfach kein Hinweis-Button. Bei neuem Content aber grundsätzlich mitschreiben (kostet nur 1-2 zusätzliche kurze Strings pro Item).

## Kumulatives Interleaving (ab Tag 2)

Jeder Tag ab Tag 2 muss `vocabPractice`, `translation` und `quiz` teilweise den **vorherigen Tagen derselben Woche** widmen:

- Tag 2 wiederholt Tag 1, Tag 3 wiederholt Tag 1+2, Tag 4 wiederholt Tag 1-3, usw.
- Faustregel: `vocabPractice` +8 Interleaving-Items, `translation` +2, `quiz` +5 (davon auch 1-2 aus **früheren Wochen**, nicht nur derselben Woche — hält älteren Stoff wach).
- Wiederholungsfragen dürfen einen neuen Satz/Kontext nutzen, müssen aber klar dieselbe Vokabel/Regel abfragen wie am Ursprungstag.
- Tag 7 (Review) bündelt das Ganze in einem großen kumulativen Quiz von **~36 Items** (kein `grammar`/`vocabulary`/`vocabPractice`/`translation`/`listening`, nur `summary` + `quiz`).

## Exercise/Quiz-Item-Typen (von `QuizEngine` genutzt)

```js
{ type: 'choice',   prompt: '...', options: ['a','b','c'], answerIndex: 0, explanation: '...', topic: '...' }
{ type: 'gap',      prompt: '... ___ ...', answer: 'text', explanation: '...', topic: '...', hintWord: '...', hintSentence: '...' }   // answer auch als ['text','alt']
{ type: 'translate', prompt: 'Deutscher Satz.', answer: ['English sentence.', 'Accepted variant.'], explanation: '...', topic: '...', hintTargetWord: '...' }
```
`QuizEngine` bietet automatisch "← Zurück"-Navigation und Enter-Bestätigung. Bei `translate` wird die Antwort **tolerant** verglichen (`normalizeSentence()`: Groß-/Kleinschreibung, Satzzeichen am Ende, doppelte Leerzeichen egal) — bei mehreren natürlichen Formulierungen (Kontraktion vs. ausgeschrieben) mehrere Strings in `answer` angeben.

### `explanation` (Pflichtfeld auf JEDEM Item, jede Kategorie)

Bei einer falschen Antwort zeigt `QuizEngine` automatisch einen Erklärungsblock (`💡 ...`) mit `explanation`. Kurz halten (1-2 Sätze): warum die richtige Antwort richtig ist, ggf. warum die naheliegendste falsche Option nicht passt.

### Eindeutigkeit von Prompts (wichtig!)

- **Klammer-Hinweise bei Modalverb-/Wahlmöglichkeiten-Lücken müssen ALLE Optionen zeigen, nie nur die richtige.** Falsch: `'The plane ___ (must/land) already.'` Richtig: `"The plane ___ (must/might/can't – land) already."`
- **Prompts müssen eindeutig sein, welcher Referent gemeint ist.** Genug Kontext liefern, damit nur eine Lesart plausibel ist.
- **Gap-Prompts, die eine feste Redewendung abfragen, sollten nicht auf ein thematisch naheliegendes, aber falsches Wort hinlenken.**

## Tag 7 (Review)

```js
7: {
  review: true,
  summary: { intro, grammarPoints: [6 Stichpunkte, je 1 Zeile], encouragement },
  quiz: [ ... ~36 Items, gemischt aus der ganzen Woche (siehe Interleaving oben) ... ]
}
```
Tag 7 wurde in der Überarbeitung vom 2026-08-14 **nicht** angefasst (kein `topic`/Hint-Feld, altes 8-Wörter-Format) — beim Schreiben neuer Wochen ist das kein Problem (Tag 7 testet ohnehin nur Auswahl-Items aus den Vortagen), aber bei Gelegenheit könnte auch hier `topic` ergänzt werden, um `spaceOutTopics()` zu nutzen.

## Baby-Schritte für Folge-Sessions (z. B. Woche 3)

1. Nach `/compact`: kurz diese Datei lesen, dann `data/weeks/week01.js` Tag 1 als Vorlage für Struktur/Stil ansehen (harte Grammatik, `topic`/Hint-Felder, `translation`-Block).
2. `data/weeks/weekNN.js` nach obigem Schema schreiben (Thema aus `WEEK_THEMES[N-1]`), Tag für Tag (6 Tage + Review-Tag 7 im alten, einfacheren Format).
3. `<script>`-Tag in `index.html` ergänzen.
4. Node-Strukturcheck: pro Tag `vocabulary.length===20`, `grammar.exercises.length===18`, jedes `vocabulary`-Wort kommt in `vocabPractice` UND `translation` als `topic` vor, `spaceOutTopics()` liefert 0 Kollisionen auf allen vier Arrays (Skript siehe Muster in den vorherigen Sessions).
5. Im Browser kurz Tag testen (automatisierter Playwright-Durchlauf: Prompt→Item-Lookup, richtige Antworten eingeben, bis "Tag X abgeschlossen!" erscheint), dann `/compact` vor dem nächsten Tag/der nächsten Woche.
