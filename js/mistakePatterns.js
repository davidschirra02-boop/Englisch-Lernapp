/* Kuratierte Wissens-Datenbank für besonders lehrreiche, wiederkehrende
   Fehlertypen (False Friends, unzählbare Nomen, Zeit-Präpositionen,
   Gerundium/Infinitiv-Verben). Eigenständig und ohne Abhängigkeit zu
   translationCheck.js/quizEngine.js - reine Text-Erkennung auf Basis von
   "was hat der Nutzer geschrieben" vs. "was ist die richtige Lösung".

   Bewusst NUR eine kuratierte, gut belegte Auswahl klassischer
   ESL-Stolperfallen, kein Versuch, jeden denkbaren Fehler abzudecken -
   erkennt detect() kein bekanntes Muster, liefert es null zurück, und der
   Aufrufer fällt auf die allgemeine Diff-Erklärung zurück, statt sich
   Merkregeln/Beispiele auszudenken. */

const MistakePatterns = (function () {
  const FALSE_FRIENDS = [
    {
      userForms: ['become', 'becomes', 'became', 'becoming'],
      targetForms: ['suit', 'suits', 'suited', 'suiting'],
      title: 'become vs. suit',
      explanation: '"To become" heißt "werden" (She became a manager). Im heutigen Alltagsenglisch nutzt man für Kleidung, die jemandem optisch steht, ausschließlich "suit". Für passende Größen nutzt man "fit".',
      ruleBullets: [
        'suit = Es steht dir optisch gut (The color suits you).',
        'fit = Es passt von der Größe/Form (The shoes fit perfectly).',
        'become = werden (to become successful).'
      ],
      example: { en: 'That haircut really suits him.', de: 'Dieser Haarschnitt steht ihm wirklich gut.' }
    },
    {
      userForms: ['sensible'],
      targetForms: ['sensitive', 'sensitively'],
      title: 'sensible vs. sensitive',
      explanation: '"Sensible" bedeutet auf Englisch "vernünftig" (a sensible decision = eine vernünftige Entscheidung), nicht "sensibel/empfindlich". Dafür brauchst du "sensitive".',
      ruleBullets: ['sensible = vernünftig (a sensible choice)', 'sensitive = empfindlich/feinfühlig (a sensitive topic)'],
      example: { en: "She's very sensitive about her weight.", de: 'Sie ist sehr empfindlich, was ihr Gewicht angeht.' }
    },
    {
      userForms: ['actual'],
      targetForms: ['current'],
      title: 'actual vs. current',
      explanation: '"Actual" heißt "tatsächlich/wirklich" (the actual cost = die tatsächlichen Kosten), nicht "aktuell". Für "aktuell/gegenwärtig" nutzt du "current".',
      ruleBullets: ['actual = tatsächlich (the actual price)', 'current = aktuell/gegenwärtig (the current situation)'],
      example: { en: "What's the current exchange rate?", de: 'Wie ist der aktuelle Wechselkurs?' }
    },
    {
      userForms: ['eventually'],
      targetForms: ['possibly', 'maybe', 'perhaps'],
      title: 'eventually vs. possibly',
      explanation: '"Eventually" heißt "schließlich/am Ende" (He eventually agreed = Er stimmte schließlich zu), nicht "eventuell". Für "eventuell/vielleicht" nutzt du "possibly", "maybe" oder "perhaps".',
      ruleBullets: ['eventually = schließlich, am Ende', 'possibly / maybe / perhaps = eventuell, vielleicht'],
      example: { en: 'We might possibly need more time.', de: 'Wir brauchen eventuell mehr Zeit.' }
    },
    {
      userForms: ['gift', 'gifts'],
      targetForms: ['poison', 'poisonous'],
      title: 'gift vs. poison',
      explanation: '"Gift" heißt auf Englisch "Geschenk", nicht "Gift" im Sinne von Toxin. Dafür nutzt du "poison".',
      ruleBullets: ['gift = Geschenk (a birthday gift)', 'poison = Gift/Toxin (rat poison)'],
      example: { en: 'The mushroom was poisonous.', de: 'Der Pilz war giftig.' }
    },
    {
      userForms: ['chef', 'chefs'],
      targetForms: ['boss', 'bosses', 'manager', 'managers'],
      title: 'chef vs. boss',
      explanation: '"Chef" bedeutet auf Englisch "Küchenchef", nicht "Chef" im Sinne von Vorgesetztem. Dafür nutzt du "boss" oder "manager".',
      ruleBullets: ['chef = Küchenchef (the head chef)', 'boss / manager = Vorgesetzter'],
      example: { en: 'I need to ask my boss for a day off.', de: 'Ich muss meinen Chef nach einem freien Tag fragen.' }
    },
    {
      userForms: ['handy'],
      targetForms: ['mobile', 'phone', 'cellphone'],
      title: 'handy vs. mobile phone',
      explanation: '"Handy" heißt auf Englisch "praktisch/griffig" (a handy tool), nicht "Mobiltelefon". Dafür nutzt du "mobile phone" (britisch) oder "cell phone" (amerikanisch).',
      ruleBullets: ['handy = praktisch (a handy gadget)', 'mobile phone / cell phone = Handy'],
      example: { en: 'I forgot my mobile phone at home.', de: 'Ich habe mein Handy zuhause vergessen.' }
    },
    {
      userForms: ['brave', 'bravely'],
      targetForms: ['well-behaved', 'obedient', 'good'],
      title: 'brave vs. well-behaved',
      explanation: '"Brave" heißt auf Englisch "mutig", nicht "brav" im Sinne von wohlerzogen. Dafür nutzt du "well-behaved" oder "good".',
      ruleBullets: ['brave = mutig (a brave firefighter)', 'well-behaved / good = brav (a well-behaved child)'],
      example: { en: 'The children were very well-behaved during the flight.', de: 'Die Kinder waren während des Flugs sehr brav.' }
    },
    {
      userForms: ['irritate', 'irritated', 'irritates', 'irritating'],
      targetForms: ['confuse', 'confused', 'confuses', 'confusing', 'puzzle', 'puzzled'],
      title: 'irritate vs. confuse',
      explanation: '"Irritate" heißt auf Englisch "verärgern/reizen", nicht "verwirren". Für "irritieren" im Sinne von verwirren nutzt du "confuse" oder "puzzle".',
      ruleBullets: ['irritate = verärgern, reizen (loud noises irritate me)', 'confuse / puzzle = verwirren, irritieren'],
      example: { en: 'His strange answer confused everyone.', de: 'Seine seltsame Antwort irritierte alle.' }
    },
    {
      userForms: ['art'],
      targetForms: ['kind', 'sort', 'type'],
      title: 'art vs. kind/sort/type',
      explanation: '"Art" heißt auf Englisch "Kunst". Wenn im Deutschen "Art" im Sinne von "Sorte" gemeint ist, brauchst du im Englischen "kind", "sort" oder "type".',
      ruleBullets: ['art = Kunst (modern art)', 'kind / sort / type = Art/Sorte (this kind of problem)'],
      example: { en: 'What kind of music do you like?', de: 'Welche Art von Musik magst du?' }
    }
  ];

  const UNCOUNTABLE_NOUNS = [
    {
      noun: 'advice',
      title: 'Unzählbare Nomen: advice',
      explanation: 'Im Deutschen sagen wir "viele Ratschläge". Im Englischen ist "advice" ein unzählbares Substantiv (wie water oder money). Es bekommt niemals ein Plural-s und steht nicht mit "many". Wenn du einzelne Einheiten zählen möchtest, nutzt du "a piece of advice".',
      ruleBullets: ['Kein Plural: advice, nicht advices.', 'Nutze "a lot of" oder "some", wenn du "viel/viele" ausdrücken willst.'],
      example: { en: 'Let me give you a piece of advice.', de: 'Lass mich dir einen Ratschlag geben.' }
    },
    {
      noun: 'information',
      title: 'Unzählbare Nomen: information',
      explanation: '"Information" ist im Englischen unzählbar, obwohl wir im Deutschen oft "Informationen" (Plural) sagen. Kein Plural-s, kein "many" - für "viel/viele" nutzt du "a lot of" oder "some".',
      ruleBullets: ['Kein Plural: information, nicht informations.', '"eine Information" = a piece of information.'],
      example: { en: 'Can you give me some information about the hotel?', de: 'Kannst du mir ein paar Informationen zum Hotel geben?' }
    },
    {
      noun: 'furniture',
      title: 'Unzählbare Nomen: furniture',
      explanation: '"Furniture" (Möbel) ist unzählbar, auch wenn "Möbel" im Deutschen wie ein Plural klingt. Kein Plural-s, kein "many".',
      ruleBullets: ['Kein Plural: furniture, nicht furnitures.', '"ein Möbelstück" = a piece of furniture.'],
      example: { en: 'We need to buy some new furniture for the living room.', de: 'Wir müssen neue Möbel fürs Wohnzimmer kaufen.' }
    },
    {
      noun: 'feedback',
      title: 'Unzählbare Nomen: feedback',
      explanation: '"Feedback" ist im Englischen unzählbar. Kein Plural-s, kein "many".',
      ruleBullets: ['Kein Plural: feedback, nicht feedbacks.', '"ein Feedback" = a piece of feedback.'],
      example: { en: 'Thank you for your valuable feedback.', de: 'Danke für dein wertvolles Feedback.' }
    },
    {
      noun: 'news',
      title: 'Unzählbare Nomen: news',
      explanation: '"News" sieht aus wie ein Plural (endet auf -s), wird aber wie ein unzählbares Substantiv im Singular behandelt: "The news is good", nicht "are good".',
      ruleBullets: ['news + Singular-Verb: The news is surprising.', '"eine Nachricht" = a piece of news.'],
      example: { en: 'The news was shocking.', de: 'Die Nachricht war schockierend.' }
    },
    {
      noun: 'luggage',
      title: 'Unzählbare Nomen: luggage',
      explanation: '"Luggage" (Gepäck) ist unzählbar. Kein Plural-s, kein "many".',
      ruleBullets: ['Kein Plural: luggage, nicht luggages.', '"ein Gepäckstück" = a piece of luggage.'],
      example: { en: 'She only had one piece of luggage.', de: 'Sie hatte nur ein Gepäckstück dabei.' }
    },
    {
      noun: 'equipment',
      title: 'Unzählbare Nomen: equipment',
      explanation: '"Equipment" (Ausrüstung) ist unzählbar. Kein Plural-s, kein "many".',
      ruleBullets: ['Kein Plural: equipment, nicht equipments.', '"ein Ausrüstungsgegenstand" = a piece of equipment.'],
      example: { en: 'The gym has modern equipment.', de: 'Das Fitnessstudio hat moderne Ausrüstung.' }
    },
    {
      noun: 'homework',
      title: 'Unzählbare Nomen: homework',
      explanation: '"Homework" (Hausaufgaben) ist unzählbar, obwohl wir im Deutschen den Plural "Hausaufgaben" nutzen. Kein Plural-s, kein "many".',
      ruleBullets: ['Kein Plural: homework, nicht homeworks.', '"eine Hausaufgabe" = a piece of homework / an assignment.'],
      example: { en: 'I still have a lot of homework to do.', de: 'Ich habe noch viele Hausaufgaben zu machen.' }
    },
    {
      noun: 'traffic',
      title: 'Unzählbare Nomen: traffic',
      explanation: '"Traffic" (Verkehr) ist unzählbar. Kein Plural-s, kein "many".',
      ruleBullets: ['Kein Plural: traffic, nicht traffics.', 'Für "viel Verkehr" nutzt du "heavy traffic" oder "a lot of traffic".'],
      example: { en: 'There was a lot of traffic this morning.', de: 'Heute Morgen war viel Verkehr.' }
    }
  ];

  const GERUND_INFINITIVE_VERBS = [
    {
      verb: 'stop',
      forms: ['stop', 'stops', 'stopped'],
      title: 'stop doing vs. stop to do',
      explanation: '"He stopped to smoke" bedeutet auf Englisch: Er hat seine aktuelle Tätigkeit unterbrochen, um eine Zigarette zu rauchen. Wenn eine Gewohnheit komplett aufgegeben oder beendet wird, folgt das Verb mit -ing (Gerund).',
      ruleBullets: ['stop + -ing = eine Handlung aufgeben/beenden (stop talking = aufhören zu reden).', 'stop + to [Verb] = anhalten, um etwas anderes zu tun (stopped to check his phone).'],
      example: { en: 'Please stop interrupting me.', de: 'Bitte hör auf, mich zu unterbrechen.' }
    },
    {
      verb: 'remember',
      forms: ['remember', 'remembers', 'remembered'],
      title: 'remember doing vs. remember to do',
      explanation: '"Remember" + -ing bezieht sich auf eine Erinnerung an etwas, das bereits passiert ist (I remember locking the door). "Remember" + to [Verb] heißt, nicht zu vergessen, etwas noch zu tun (Remember to lock the door).',
      ruleBullets: ['remember + -ing = sich an Vergangenes erinnern (I remember meeting her.)', 'remember + to [Verb] = nicht vergessen, etwas zu tun (Remember to call me.)'],
      example: { en: 'Did you remember to buy milk?', de: 'Hast du daran gedacht, Milch zu kaufen?' }
    },
    {
      verb: 'forget',
      forms: ['forget', 'forgets', 'forgot', 'forgotten'],
      title: 'forget doing vs. forget to do',
      explanation: '"Forget" + -ing heißt, ein Erlebnis zu vergessen (I\'ll never forget seeing that). "Forget" + to [Verb] heißt, etwas Anstehendes zu vergessen zu tun (I forgot to call her).',
      ruleBullets: ['forget + -ing = ein Erlebnis vergessen (I\'ll never forget seeing...)', 'forget + to [Verb] = vergessen, etwas zu tun (I forgot to lock the door.)'],
      example: { en: 'I forgot to send the email.', de: 'Ich habe vergessen, die E-Mail zu senden.' }
    },
    {
      verb: 'try',
      forms: ['try', 'tries', 'tried'],
      title: 'try doing vs. try to do',
      explanation: '"Try" + -ing heißt, etwas auszuprobieren, um zu sehen, ob es funktioniert (Try restarting the computer). "Try" + to [Verb] heißt, sich anzustrengen, etwas zu schaffen, oft gegen Widerstand (I tried to open the door, but it was locked).',
      ruleBullets: ['try + -ing = etwas ausprobieren (Try turning it off and on again.)', 'try + to [Verb] = sich bemühen, etwas zu schaffen (I tried to explain it.)'],
      example: { en: 'She tried to fix the bike herself.', de: 'Sie versuchte, das Fahrrad selbst zu reparieren.' }
    },
    {
      verb: 'regret',
      forms: ['regret', 'regrets', 'regretted'],
      title: 'regret doing vs. regret to do',
      explanation: '"Regret" + -ing bezieht sich auf Bedauern über etwas bereits Geschehenes (I regret saying that). "Regret" + to [Verb] wird für formelle Ankündigungen unangenehmer Nachrichten genutzt (We regret to inform you that...).',
      ruleBullets: ['regret + -ing = etwas Vergangenes bereuen (I regret not studying harder.)', 'regret + to [Verb] = formell eine unangenehme Nachricht ankündigen (We regret to inform you...)'],
      example: { en: 'I regret not speaking up earlier.', de: 'Ich bereue, mich nicht früher zu Wort gemeldet zu haben.' }
    },
    {
      verb: 'mean',
      forms: ['mean', 'means', 'meant'],
      title: 'mean doing vs. mean to do',
      explanation: '"Mean" + -ing heißt, dass etwas eine bestimmte Konsequenz mit sich bringt (Losing this job would mean moving). "Mean" + to [Verb] heißt, etwas zu beabsichtigen (I meant to call you).',
      ruleBullets: ['mean + -ing = etwas bedeutet/hat zur Folge (Success means working hard.)', 'mean + to [Verb] = etwas beabsichtigen (I didn\'t mean to interrupt.)'],
      example: { en: "I didn't mean to upset you.", de: 'Ich wollte dich nicht verärgern.' }
    }
  ];

  const TIME_PREPOSITIONS = {
    title: 'Präpositionen bei Zeiten (in vs. at vs. on)',
    explanation: 'Im Deutschen sagst du "am Montag" und "um 9 Uhr". Im Englischen gibt es eine feste Staffelung: AT für exakte Uhrzeiten, ON für konkrete Tage/Daten und IN für längere Zeiträume (Monate, Jahre).',
    ruleBullets: [
      '🎯 AT = Punktgenau (at 5 PM, at midnight)',
      '📅 ON = Ganze Tage & Daten (on Monday, on July 4th)',
      '⏳ IN = Längere Abschnitte (in the morning, in summer, in 2026)'
    ],
    example: { en: 'The workshop starts on Friday at 10 AM.', de: 'Der Workshop beginnt am Freitag um 10:00 Uhr.' }
  };

  function normalize(s) {
    return (s || '').toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function words(s) {
    return normalize(s).split(' ').filter(Boolean);
  }

  function detectGerundInfinitive(normUser, normTarget) {
    for (const entry of GERUND_INFINITIVE_VERBS) {
      const formGroup = entry.forms.join('|');
      const gerundRe = new RegExp(`\\b(${formGroup})\\b\\s+\\w+ing\\b`);
      const infinitiveRe = new RegExp(`\\b(${formGroup})\\b\\s+to\\s+\\w+\\b`);
      const targetGerund = gerundRe.test(normTarget);
      const targetInfinitive = infinitiveRe.test(normTarget);
      const userGerund = gerundRe.test(normUser);
      const userInfinitive = infinitiveRe.test(normUser);
      if (targetGerund && userInfinitive && !userGerund) return entry;
      if (targetInfinitive && userGerund && !userInfinitive) return entry;
    }
    return null;
  }

  function detectFalseFriend(userTokens, targetTokens) {
    for (const entry of FALSE_FRIENDS) {
      const targetHit = targetTokens.some(t => entry.targetForms.includes(t));
      const userHit = userTokens.some(t => entry.userForms.includes(t));
      if (targetHit && userHit) return entry;
    }
    return null;
  }

  function detectUncountable(userTokens, targetTokens) {
    for (const entry of UNCOUNTABLE_NOUNS) {
      const targetHasSingular = targetTokens.includes(entry.noun);
      const userHasPlural = userTokens.includes(entry.noun + 's') || userTokens.includes(entry.noun + 'es');
      if (targetHasSingular && userHasPlural) return entry;
    }
    return null;
  }

  function detectTimePreposition(userTokens, targetTokens) {
    const PREPS = ['at', 'on', 'in'];
    const targetPreps = targetTokens.filter(t => PREPS.includes(t));
    const userPreps = userTokens.filter(t => PREPS.includes(t));
    if (targetPreps.length === 0) return null;
    const mismatch = targetPreps.some((p, i) => userPreps[i] && userPreps[i] !== p);
    return mismatch ? TIME_PREPOSITIONS : null;
  }

  function detect(userText, targetText) {
    if (!userText || !targetText) return null;
    const normUser = normalize(userText);
    const normTarget = normalize(targetText);
    const userTokens = words(userText);
    const targetTokens = words(targetText);

    return detectGerundInfinitive(normUser, normTarget)
      || detectFalseFriend(userTokens, targetTokens)
      || detectUncountable(userTokens, targetTokens)
      || detectTimePreposition(userTokens, targetTokens)
      || null;
  }

  return { detect };
})();
