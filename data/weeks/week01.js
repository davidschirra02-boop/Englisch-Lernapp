/* Woche 1 — Ankommen & Small Talk.
   Schema: siehe CONTENT_GUIDE.md. Jeder Tag (1-6) hat grammar, vocabulary,
   vocabPractice, listening, conversation, quiz. Tag 7 ist ein reiner Review-Tag.
   Konversationsknoten haben 3 Antworten (1 richtig, 2 subtile Fehler) und
   werden vom Renderer bei jeder Anzeige neu gemischt. */

WEEKS.week01 = {
  key: 'week01',
  title: 'Ankommen & Small Talk',
  days: {

    1: {
      grammar: {
        ruleTitle: 'Present Perfect Simple vs. Continuous',
        explanation: 'Present Perfect Simple betont das Ergebnis oder die abgeschlossene Handlung ("I\'ve written the email" – die E-Mail ist fertig). Present Perfect Continuous betont die Dauer oder dass die Handlung gerade eben aufgehört hat bzw. noch andauert ("I\'ve been writing emails all morning" – der Fokus liegt auf dem Vorgang, nicht auf dem Ergebnis).',
        contrast: 'Im Deutschen übersetzen wir beides oft einfach mit Perfekt ("Ich habe geschrieben"). Achte im Englischen auf den Fokus: Ergebnis vs. Verlauf.',
        examples: [
          { en: "I've finished the report.", de: 'Ich habe den Bericht fertiggestellt. (Ergebnis zählt)' },
          { en: "I've been working on the report all day.", de: 'Ich arbeite den ganzen Tag am Bericht. (Dauer zählt)' },
          { en: "She's read three books this month.", de: 'Sie hat diesen Monat drei Bücher gelesen. (Anzahl/Ergebnis)' }
        ],
        exercises: [
          { type: 'gap', prompt: 'I ___ (wait) for you for two hours!', answer: 'have been waiting' },
          { type: 'choice', prompt: 'Look! Someone ___ the window.', options: ['has broken', 'has been breaking'], answerIndex: 0 },
          { type: 'gap', prompt: 'How long ___ you ___ (learn) English?', answer: 'have you been learning' },
          { type: 'choice', prompt: 'She ___ the report, so she can leave now.', options: ['has finished', 'has been finishing'], answerIndex: 0 },
          { type: 'gap', prompt: "They ___ (build) that bridge for over a year now — it's still not done.", answer: 'have been building' },
          { type: 'choice', prompt: 'I ___ three cups of coffee already this morning!', options: ['have had', 'have been having'], answerIndex: 0 }
        ]
      },
      vocabulary: [
        { word: 'to break the ice', translation: 'das Eis brechen / ein Gespräch eröffnen', example: 'He told a joke to break the ice.', mnemonic: 'Stell dir Eis vor, das zerbricht, bevor ein Gespräch "fließen" kann.', category: 'Small Talk' },
        { word: 'small talk', translation: 'belangloses Gespräch', example: 'We made small talk about the weather.', mnemonic: '"Klein" + Talk = ein leichtes, kurzes Gespräch.', category: 'Small Talk' },
        { word: 'to get in touch', translation: 'in Kontakt treten', example: "Let's get in touch next week.", mnemonic: '"Touch" = Berührung, also Kontakt aufnehmen.', category: 'Small Talk' },
        { word: 'acquaintance', translation: 'Bekannte(r)', example: "She's just an acquaintance, not a close friend.", mnemonic: 'Klingt wie "acquire" – jemand, den man "erworben", aber nicht vertieft kennt.', category: 'Small Talk' },
        { word: 'to hit it off', translation: 'sich auf Anhieb gut verstehen', example: 'We hit it off immediately at the conference.', mnemonic: '"Hit off" wie ein guter erster Treffer – sofortiger Erfolg.', category: 'Small Talk' },
        { word: 'networking event', translation: 'Netzwerkveranstaltung', example: 'I met my business partner at a networking event.', mnemonic: 'Direkt verwandt mit dem deutschen Wort "Netzwerk".', category: 'Small Talk' },
        { word: 'to introduce oneself', translation: 'sich vorstellen', example: 'Let me introduce myself.', mnemonic: '"Introduce" = ein-"führen", sich vorstellen.', category: 'Small Talk' },
        { word: 'icebreaker', translation: 'Auflockerungsfrage', example: 'The host used a fun icebreaker question.', mnemonic: 'Verwandt mit "break the ice".', category: 'Small Talk' }
      ],
      vocabPractice: [
        { type: 'choice', prompt: "Which phrase means 'to start a conversation comfortably'?", options: ['small talk', 'to break the ice', 'an acquaintance'], answerIndex: 1 },
        { type: 'gap', prompt: 'We really ___ ___ ___ at the party — we talked for hours.', answer: 'hit it off' },
        { type: 'choice', prompt: 'A person you know only slightly is called a/an ___.', options: ['acquaintance', 'icebreaker', 'colleague'], answerIndex: 0 },
        { type: 'gap', prompt: "Let's ___ ___ ___ after the conference.", answer: 'get in touch' },
        { type: 'choice', prompt: "What is 'small talk'?", options: ['a serious business negotiation', 'a light, casual conversation', 'a formal presentation'], answerIndex: 1 },
        { type: 'gap', prompt: 'At the start of the meeting, she used a fun ___ to relax everyone.', answer: 'icebreaker' }
      ],
      listening: {
        title: 'Emma at the Conference',
        sentences: [
          'Emma arrived at the conference a little nervous.',
          "She didn't know anyone in the room.",
          'A man near the coffee table smiled and said hello.',
          'They started with some small talk about the traffic.',
          'Within a few minutes, they had hit it off.',
          'He gave her his business card and suggested they get in touch next week.',
          'Emma left the event feeling proud of herself.'
        ],
        questions: [
          { prompt: 'Why was Emma nervous at first?', options: ["She didn't know anyone", 'She was late', 'She lost her ticket'], answerIndex: 0 },
          { prompt: 'What did they talk about first?', options: ['The weather', 'The traffic', 'Their jobs'], answerIndex: 1 },
          { prompt: 'What did the man give Emma?', options: ['A coffee', 'His business card', 'A book'], answerIndex: 1 }
        ]
      },
      conversation: {
        situation: "You're at a networking event and someone new introduces themselves.",
        start: 'n1',
        nodes: {
          n1: { them: "Hi there! I don't think we've met yet. I'm Daniel.", next: 'n2', choices: [
            { text: "Hi Daniel, nice to meet you. I'm Alex.", correct: true },
            { text: 'Good afternoon Daniel. It is a pleasure to make your acquaintance.', correct: false, feedback: 'Grammatisch korrekt, aber für ein lockeres Networking-Event zu förmlich/steif. Natürlicher: "Hi Daniel, nice to meet you. I\'m Alex."' },
            { text: 'Hi, nice to meet you too!', correct: false, feedback: 'Fast richtig, aber du hast vergessen, deinen eigenen Namen zu nennen — das gehört bei einer Vorstellung dazu: "Hi Daniel, nice to meet you. I\'m Alex."' }
          ]},
          n2: { them: 'So, what brings you to this event?', next: 'n3', choices: [
            { text: "I'm here to meet new people in the industry.", correct: true },
            { text: 'I come here for networking.', correct: false, feedback: '"I come here" klingt nach einer Gewohnheit (Simple Present). Für diesen einmaligen Anlass passt: "I\'m here to meet new people in the industry."' },
            { text: 'Just for the free food, to be honest.', correct: false, feedback: 'Ehrlich, aber in einem professionellen Erstgespräch wirkt das zu flapsig. Nenne besser eine berufliche Motivation.' }
          ]},
          n3: { them: 'That\'s great. Have you been to one of these events before?', next: 'n4', choices: [
            { text: "Yes, I've been to a few. They're great for making contacts.", correct: true },
            { text: 'Yes, I go to a few before.', correct: false, feedback: 'Falsche Zeitform — für eine Erfahrung bis jetzt braucht man Present Perfect: "I\'ve been to a few", nicht Simple Present + "before".' },
            { text: 'No, this is my first time, and I hate it.', correct: false, feedback: 'Grammatisch fein, aber so negativ zu antworten wirkt unhöflich im Small Talk. Bleib positiv.' }
          ]},
          n4: { them: "What industry are you in, if you don't mind me asking?", next: 'n5', choices: [
            { text: 'Not at all — I work in marketing, mostly for tech startups.', correct: true },
            { text: "I don't like to talk about my job.", correct: false, feedback: 'Auf eine höfliche Frage wirkt das abweisend. Antworte offen und freundlich.' },
            { text: 'I am working in marketing since three years.', correct: false, feedback: '"since three years" ist ein typischer deutscher Fehler — richtig: "for three years" (Dauer), und mit Present Perfect: "I\'ve been working in marketing for three years."' }
          ]},
          n5: { them: "Well, it was great chatting. Here's my card — let's get in touch.", next: 'end', choices: [
            { text: "Thanks, Daniel! I'll drop you a message next week.", correct: true },
            { text: 'Thanks, I will maybe write you sometime.', correct: false, feedback: 'Klingt unverbindlich ("maybe", "sometime"). Verbindlicher: "I\'ll drop you a message next week."' },
            { text: 'Thank you, I give you my card too.', correct: false, feedback: 'Für eine spontane Zusage fehlt "will": besser "I\'ll give you my card too" — oder ein klarer Abschluss wie "I\'ll drop you a message next week."' }
          ]},
          end: { them: 'Great talking to you! Enjoy the rest of the event.', end: true }
        }
      },
      quiz: [
        { type: 'choice', prompt: 'Choose the correct form: I ___ this book three times.', options: ['have read', 'have been reading'], answerIndex: 0 },
        { type: 'choice', prompt: '"To break the ice" means...', options: ['to be very cold', 'to start a conversation comfortably', 'to end a friendship'], answerIndex: 1 },
        { type: 'gap', prompt: 'How long ___ you ___ (work) here?', answer: 'have you been working' },
        { type: 'choice', prompt: 'An "acquaintance" is...', options: ['a close friend', 'someone you know slightly', 'a family member'], answerIndex: 1 },
        { type: 'choice', prompt: '"We hit it off" means...', options: ['we argued', 'we got along well immediately', 'we left early'], answerIndex: 1 },
        { type: 'gap', prompt: "She ___ (finish) all her work, so she's free now.", answer: 'has finished' },
        { type: 'choice', prompt: '"Networking event" means...', options: ['a casual dinner with friends', 'a professional gathering to meet contacts', 'a job interview'], answerIndex: 1 },
        { type: 'choice', prompt: '"To introduce oneself" means...', options: ['to say who you are to someone new', 'to leave a conversation', 'to argue with someone'], answerIndex: 0 }
      ]
    },

    2: {
      grammar: {
        ruleTitle: 'Modalverben der Vermutung (must/might/can\'t + have)',
        explanation: 'Für Vermutungen über die Vergangenheit nutzt man Modalverb + have + Partizip II. "Must have" = starke positive Vermutung, "might/could have" = mögliche Vermutung, "can\'t have" = starke Vermutung, dass etwas NICHT der Fall war.',
        contrast: 'Deutsch: "Er muss den Zug verpasst haben" – ähnliche Struktur, aber Englisch braucht immer "have" + Partizip II, nie den Infinitiv.',
        examples: [
          { en: 'The flight must have been delayed – look at all these people waiting.', de: 'Der Flug muss verspätet gewesen sein.' },
          { en: 'She might have missed her connection.', de: 'Sie hat vielleicht ihren Anschlussflug verpasst.' },
          { en: "He can't have left already – his bag is still here.", de: 'Er kann nicht schon gegangen sein – seine Tasche ist noch hier.' }
        ],
        exercises: [
          { type: 'gap', prompt: "The plane ___ (must/might/can't – land) already – I can see it at the gate.", answer: 'must have landed' },
          { type: 'gap', prompt: "Her suitcase is missing. She ___ (must/might/can't – leave) it on the plane.", answer: 'must have left' },
          { type: 'choice', prompt: 'He answered the phone immediately, so he ___ have been asleep.', options: ["can't", 'must'], answerIndex: 0 },
          { type: 'choice', prompt: 'You are standing at the empty departure gate — the screen says "Boarding complete." The passengers ___ already boarded the plane.', options: ['must have', "can't have"], answerIndex: 0 },
          { type: 'gap', prompt: "She's not answering her phone. She ___ (must/might/can't – lose) signal in the tunnel.", answer: 'might have lost' },
          { type: 'choice', prompt: "He can't have missed the flight —", options: ["he's calling from the gate right now", 'the gate closed five minutes ago', 'nobody has seen him today'], answerIndex: 0 }
        ]
      },
      vocabulary: [
        { word: 'connecting flight', translation: 'Anschlussflug', example: 'I have a two-hour layover before my connecting flight.', mnemonic: '"Connect" = verbinden.', category: 'Reisen' },
        { word: 'to check in', translation: 'einchecken', example: 'We need to check in two hours before departure.', mnemonic: 'Direkt aus dem Deutschen bekannt.', category: 'Reisen' },
        { word: 'boarding pass', translation: 'Bordkarte', example: 'Please have your boarding pass ready.', mnemonic: '"Board" = an Bord gehen.', category: 'Reisen' },
        { word: 'delayed', translation: 'verspätet', example: 'Our flight was delayed by three hours.', mnemonic: 'Klingt wie "verzögert".', category: 'Reisen' },
        { word: 'layover', translation: 'Zwischenstopp', example: 'We have a short layover in Amsterdam.', mnemonic: '"Lay over" = eine Pause zwischen Flügen einlegen.', category: 'Reisen' },
        { word: 'to miss a flight', translation: 'einen Flug verpassen', example: 'I nearly missed my flight because of traffic.', mnemonic: 'Wie "einen Ball verpassen" – nicht rechtzeitig da sein.', category: 'Reisen' },
        { word: 'luggage claim', translation: 'Gepäckausgabe', example: 'Meet me at the luggage claim.', mnemonic: 'Dort "claimst" (forderst) du dein Gepäck ein.', category: 'Reisen' },
        { word: 'customs', translation: 'Zoll', example: 'We had to go through customs before leaving the airport.', mnemonic: 'Achtung: nicht "costume" (Kostüm)!', category: 'Reisen' }
      ],
      vocabPractice: [
        { type: 'choice', prompt: 'Where do you collect your suitcase after landing?', options: ['Customs', 'Luggage claim', 'Boarding gate'], answerIndex: 1 },
        { type: 'gap', prompt: 'You need your ___ ___ to board the plane.', answer: 'boarding pass' },
        { type: 'choice', prompt: 'A short stop between two flights is called a...', options: ['layover', 'delay', 'connection fee'], answerIndex: 0 },
        { type: 'gap', prompt: 'Our flight was ___ by two hours because of the storm.', answer: 'delayed' },
        { type: 'choice', prompt: 'What do you do at customs?', options: ['Buy duty-free perfume', 'Declare goods when entering a country', 'Check in your luggage'], answerIndex: 1 },
        { type: 'gap', prompt: "I was already through security, but I almost ___ ___ ___ because the taxi arrived late and I had to run to the gate.", answer: ['missed my flight', 'missed the flight'] }
      ],
      listening: {
        title: "Tom's Delayed Flight",
        sentences: [
          "Tom's flight to New York was delayed by three hours.",
          'He decided to check in early anyway, just to be safe.',
          'At the gate, an announcement said the connecting flight might also be affected.',
          'Tom started to worry about his layover in Amsterdam.',
          'Luckily, the airline rebooked him onto an earlier connection.',
          'After landing, he collected his suitcase at the luggage claim.',
          'He was relieved to finally get through customs and start his trip.'
        ],
        questions: [
          { prompt: "How long was Tom's flight delayed?", options: ['One hour', 'Three hours', 'All day'], answerIndex: 1 },
          { prompt: 'What was Tom worried about?', options: ['Missing his layover connection', 'Losing his passport', 'The weather'], answerIndex: 0 },
          { prompt: 'What did Tom do first after landing?', options: ['Went straight to customs', 'Collected his luggage', 'Called a taxi'], answerIndex: 1 }
        ]
      },
      conversation: {
        situation: 'Your flight has been delayed and you speak to an airline staff member.',
        start: 'n1',
        nodes: {
          n1: { them: 'Good afternoon, how can I help you today?', next: 'n2', choices: [
            { text: 'Hi, I just found out my flight has been delayed. Could you tell me more?', correct: true },
            { text: 'My flight is late, I need answers now.', correct: false, feedback: 'Klingt fordernd und dringlich statt höflich-fragend. Besser: "Could you tell me more about the delay, please?"' },
            { text: 'Something about my flight, I think?', correct: false, feedback: 'Zu vage — sag konkret, worum es geht: "I just found out my flight has been delayed. Could you tell me more?"' }
          ]},
          n2: { them: 'I\'m sorry about that. Your flight to Amsterdam will now depart at 6 PM.', next: 'n3', choices: [
            { text: 'I see. Will I still make my connecting flight?', correct: true },
            { text: 'I see. Do I still catch my connecting flight?', correct: false, feedback: '"Do I catch" klingt nach einer Gewohnheit. Für eine konkrete Zukunftsfrage: "Will I still make my connecting flight?"' },
            { text: 'This is a disaster, my whole trip is ruined!', correct: false, feedback: 'Verständliche Frustration, aber das hilft nicht weiter und wirkt unprofessionell. Frag konkret nach.' }
          ]},
          n3: { them: 'Let me check... Unfortunately, you might miss it. I can rebook you onto a later flight.', next: 'n4', choices: [
            { text: 'That would be great, thank you very much.', correct: true },
            { text: 'That would be great, thanks a lot for it.', correct: false, feedback: '"Thanks a lot for it" klingt unnatürlich holprig. Natürlicher: "That would be great, thank you very much."' },
            { text: "Are you sure that's the best you can do?", correct: false, feedback: 'Das wirkt misstrauisch gegenüber einer hilfsbereiten Lösung. Freundlicher zustimmen.' }
          ]},
          n4: { them: 'Great, I\'ve rebooked you. Would you like a meal voucher for the wait?', next: 'n5', choices: [
            { text: 'Yes, please, that would be very kind of you.', correct: true },
            { text: "No, I don't need charity.", correct: false, feedback: '"Charity" ist unpassend — ein Gutschein bei Verspätung ist normaler Kundenservice. Höflich annehmen.' },
            { text: 'Yes please, I am appreciating that.', correct: false, feedback: '"Appreciate" steht meist nicht im Continuous. Richtig: "I would appreciate that" bzw. "that would be very kind of you."' }
          ]},
          n5: { them: "Perfect, here's your new boarding pass. Your gate closes at 5:30.", next: 'end', choices: [
            { text: 'Thank you so much for your help!', correct: true },
            { text: 'Thanks, finally some good news.', correct: false, feedback: 'Klingt leicht sarkastisch gegenüber der Verspätung. Freundlich abschließen ohne Seitenhieb.' },
            { text: 'Thank you for you help.', correct: false, feedback: 'Typischer Fehler: "you" statt "your". Richtig: "Thank you for your help!"' }
          ]},
          end: { them: 'You\'re welcome, have a safe flight!', end: true }
        }
      },
      quiz: [
        { type: 'gap', prompt: "The lights are off. They ___ (must/might/can't – leave) already.", answer: 'must have left' },
        { type: 'choice', prompt: '"Layover" means...', options: ['a type of luggage', 'a stop between flights', 'a delayed flight'], answerIndex: 1 },
        { type: 'choice', prompt: 'He can\'t have missed the flight because...', options: ['he is calling from the gate right now', 'he left home late', 'his bag is heavy'], answerIndex: 0 },
        { type: 'choice', prompt: 'Where do you collect your suitcase?', options: ['Customs', 'Boarding gate', 'Luggage claim'], answerIndex: 2 },
        { type: 'choice', prompt: 'She ___ forgotten her passport – she\'s calling the airline in a panic.', options: ['must have', "can't have"], answerIndex: 0 },
        { type: 'gap', prompt: "They ___ (must/might/can't – board) already — the gate is empty.", answer: 'must have boarded' },
        { type: 'choice', prompt: '"To check in" means...', options: ['to register for your flight', 'to collect your luggage', 'to go through security'], answerIndex: 0 },
        { type: 'choice', prompt: '"Connecting flight" means...', options: ['your first flight of the day', 'a flight that continues your journey after a layover', 'a cancelled flight'], answerIndex: 1 }
      ]
    },

    3: {
      grammar: {
        ruleTitle: 'Passiv für neutrale, formelle Aussagen',
        explanation: 'Das Passiv (be + Partizip II) rückt die Handlung oder das Objekt in den Fokus, nicht die handelnde Person. Das klingt neutraler und formeller – ideal für Beschwerden, Berichte oder wenn der Verursacher unbekannt/unwichtig ist.',
        contrast: 'Deutsch bildet das Passiv ähnlich ("werden" + Partizip II), aber im Englischen wird es beim Reklamieren noch häufiger verwendet als im Deutschen.',
        examples: [
          { en: 'My order was cancelled without any notice.', de: 'Meine Bestellung wurde ohne Ankündigung storniert.' },
          { en: 'I was overcharged for this item.', de: 'Mir wurde für diesen Artikel zu viel berechnet.' },
          { en: 'The package was delivered to the wrong address.', de: 'Das Paket wurde an die falsche Adresse geliefert.' }
        ],
        exercises: [
          { type: 'gap', prompt: 'My refund ___ (not/process) yet.', answer: "hasn't been processed" },
          { type: 'choice', prompt: 'The item ___ damaged during shipping.', options: ['was', 'were'], answerIndex: 0 },
          { type: 'gap', prompt: 'I ___ (charge) twice for the same order.', answer: 'was charged' },
          { type: 'choice', prompt: 'This laptop ___ repaired under warranty last month.', options: ['was', 'did'], answerIndex: 0 },
          { type: 'gap', prompt: 'The wrong item ___ (send) to my address.', answer: 'was sent' },
          { type: 'choice', prompt: 'All complaints ___ within 48 hours.', options: ['are answered', 'answer'], answerIndex: 0 }
        ]
      },
      vocabulary: [
        { word: 'refund', translation: 'Rückerstattung', example: "I'd like to request a refund.", mnemonic: '"Re-fund" = Geld zurückfließen lassen.', category: 'Shopping' },
        { word: 'faulty', translation: 'defekt/fehlerhaft', example: 'The product arrived faulty.', mnemonic: 'Verwandt mit "fault" = Fehler.', category: 'Shopping' },
        { word: 'receipt', translation: 'Kassenbon/Beleg', example: 'Keep your receipt in case you need to return the item.', mnemonic: 'Klingt wie "receive" – du erhältst einen Nachweis.', category: 'Shopping' },
        { word: 'to overcharge', translation: 'zu viel berechnen', example: 'I was overcharged by ten euros.', mnemonic: '"Over" + charge = zu viel verlangen.', category: 'Shopping' },
        { word: 'warranty', translation: 'Garantie', example: 'This laptop comes with a two-year warranty.', mnemonic: 'Klingt wie "Gewährleistung".', category: 'Shopping' },
        { word: 'to return an item', translation: 'Ware zurückgeben', example: 'I want to return these shoes.', mnemonic: 'Direkt verständlich: "zurück-geben".', category: 'Shopping' },
        { word: 'consumer rights', translation: 'Verbraucherrechte', example: 'Consumer rights protect you when a product is faulty.', mnemonic: '"Consumer" = Verbraucher.', category: 'Shopping' },
        { word: 'to exchange', translation: 'umtauschen', example: 'Can I exchange this for a different size?', mnemonic: '"Ex-change" = etwas gegen etwas anderes tauschen.', category: 'Shopping' }
      ],
      vocabPractice: [
        { type: 'choice', prompt: "A product that doesn't work properly is...", options: ['faulty', 'refunded', 'exchanged'], answerIndex: 0 },
        { type: 'gap', prompt: 'Please keep your ___ in case you need to return the item.', answer: 'receipt' },
        { type: 'choice', prompt: 'If a shop charges you too much, they ___ you.', options: ['overcharge', 'exchange', 'refund'], answerIndex: 0 },
        { type: 'gap', prompt: 'This phone comes with a two-year ___.', answer: 'warranty' },
        { type: 'choice', prompt: "What does 'to exchange an item' mean?", options: ['to throw it away', 'to swap it for a different one', 'to pay for it twice'], answerIndex: 1 },
        { type: 'gap', prompt: "___ ___ protect you when a product doesn't work as promised.", answer: 'consumer rights' }
      ],
      listening: {
        title: "Lisa's Faulty Jacket",
        sentences: [
          'Lisa ordered a jacket online, but it arrived faulty.',
          'One of the zippers was completely broken.',
          'She contacted customer service and explained the problem.',
          'They asked her to send a photo of the damage.',
          'Luckily, the jacket was still covered by warranty.',
          'Lisa was offered a full refund or a free exchange.',
          'She chose the exchange and received a new jacket within a week.'
        ],
        questions: [
          { prompt: 'What was wrong with the jacket?', options: ['Wrong colour', 'Broken zipper', 'Wrong size'], answerIndex: 1 },
          { prompt: 'What did customer service ask for?', options: ['A receipt', 'A photo', 'A phone call'], answerIndex: 1 },
          { prompt: 'What did Lisa choose?', options: ['A refund', 'An exchange', 'Nothing'], answerIndex: 1 }
        ]
      },
      conversation: {
        situation: 'You contact customer service about a faulty item you received.',
        start: 'n1',
        nodes: {
          n1: { them: 'Hello, thank you for contacting us. How can I help?', next: 'n2', choices: [
            { text: "Hi, I received a faulty item and I'd like to sort it out.", correct: true },
            { text: 'Hi, your products are always breaking.', correct: false, feedback: 'Eine pauschale Beschwerde über "immer" hilft nicht und klingt unfair. Beschreibe den konkreten Fall.' },
            { text: 'Hi, I have received a faulty item last week.', correct: false, feedback: 'Present Perfect passt nicht mit einer genauen Zeitangabe wie "last week" — dafür braucht man Simple Past: "I received a faulty item last week."' }
          ]},
          n2: { them: "I'm sorry to hear that. Could you tell me what's wrong with it?", next: 'n3', choices: [
            { text: "Sure, the zipper is broken and it can't be closed.", correct: true },
            { text: "It's broken, obviously.", correct: false, feedback: 'Das beantwortet die Frage nicht wirklich und klingt leicht genervt. Beschreibe das Problem konkret.' },
            { text: "The zipper is breaked and can't close.", correct: false, feedback: '"Breaked" ist kein Wort — "break" ist unregelmäßig: broken. Richtig: "The zipper is broken and it can\'t be closed."' }
          ]},
          n3: { them: 'I see. Would you prefer a refund or an exchange?', next: 'n4', choices: [
            { text: "I'd prefer an exchange, if that's possible.", correct: true },
            { text: 'Whatever is easiest for you.', correct: false, feedback: 'Höflich gemeint, aber der Kundenservice braucht eine klare Entscheidung von dir.' },
            { text: 'I prefer an exchange than a refund.', correct: false, feedback: 'Nach "prefer" folgt "to", nicht "than": "I prefer an exchange to a refund" — einfacher: "I\'d prefer an exchange, if that\'s possible."' }
          ]},
          n4: { them: 'No problem. Could you send us a photo of the damage first?', next: 'n5', choices: [
            { text: "Of course, I'll take one right now and email it over.", correct: true },
            { text: "Why, don't you believe me?", correct: false, feedback: 'Das wirkt misstrauisch — ein Foto anzufordern ist normale Praxis. Kooperativ antworten.' },
            { text: 'Of course, I send it now.', correct: false, feedback: 'Für eine spontane Zusage in dem Moment braucht man "will": "I\'ll send it now."' }
          ]},
          n5: { them: "No problem, we'll send a new one right away. Anything else?", next: 'end', choices: [
            { text: "No, that's everything. Thank you for your help!", correct: true },
            { text: "No, that's it, bye.", correct: false, feedback: 'Sehr knapp/abrupt zum Abschluss. Ein Dankeschön wirkt freundlicher.' },
            { text: "No, that's all, thanks for you help.", correct: false, feedback: 'Wieder der "you/your"-Fehler: richtig ist "thanks for your help."' }
          ]},
          end: { them: 'You\'re welcome! Have a great day.', end: true }
        }
      },
      quiz: [
        { type: 'gap', prompt: 'My package ___ (deliver) to the wrong house.', answer: 'was delivered' },
        { type: 'choice', prompt: '"Faulty" means...', options: ['expensive', 'broken/defective', 'new'], answerIndex: 1 },
        { type: 'choice', prompt: 'A document proving your purchase is called a...', options: ['warranty', 'receipt', 'refund'], answerIndex: 1 },
        { type: 'choice', prompt: 'Choose correct passive: I ___ overcharged for my order.', options: ['was', 'did'], answerIndex: 0 },
        { type: 'choice', prompt: '"To exchange an item" means...', options: ['to throw it away', 'to swap it for another one', 'to pay more for it'], answerIndex: 1 },
        { type: 'gap', prompt: 'The company ___ (contact) me about the refund yesterday.', answer: 'contacted' },
        { type: 'choice', prompt: '"Warranty" means...', options: ['a discount code', 'a guarantee that covers repairs', 'a delivery fee'], answerIndex: 1 },
        { type: 'choice', prompt: '"Consumer rights" protect you when...', options: ['you want a discount', 'a product is faulty or misdescribed', 'you are late for a delivery'], answerIndex: 1 }
      ]
    },

    4: {
      grammar: {
        ruleTitle: 'Relativsätze: definierend vs. nicht-definierend',
        explanation: 'Definierende Relativsätze (ohne Komma) liefern notwendige Informationen, um zu wissen, von wem/was die Rede ist ("The manager who hired me is on leave"). Nicht-definierende Relativsätze (mit Komma) liefern zusätzliche, nicht notwendige Informationen ("My manager, who is very experienced, is on leave").',
        contrast: 'Im Deutschen werden Relativsätze immer mit Komma abgetrennt – im Englischen zeigt das Komma (oder dessen Fehlen) einen echten Bedeutungsunterschied!',
        examples: [
          { en: 'The colleague who sits next to me is from Spain.', de: 'Der Kollege, der neben mir sitzt, kommt aus Spanien. (notwendig)' },
          { en: 'My colleague, who is from Spain, just got promoted.', de: 'Mein Kollege, der aus Spanien kommt, wurde befördert. (Zusatzinfo)' },
          { en: 'This is the project that changed my career.', de: 'Das ist das Projekt, das meine Karriere veränderte.' }
        ],
        exercises: [
          { type: 'choice', prompt: 'The report ___ I sent yesterday still needs approval.', options: ['which', 'who'], answerIndex: 0 },
          { type: 'gap', prompt: 'My boss, ___ has worked here for 20 years, is retiring.', answer: 'who' },
          { type: 'gap', prompt: 'The candidate ___ we interviewed yesterday seemed very confident.', answer: ['who', 'that'] },
          { type: 'choice', prompt: 'Choose the defining clause:', options: ['My colleague, who lives nearby, gave me a lift.', 'The colleague who lives nearby gave me a lift.'], answerIndex: 1 },
          { type: 'gap', prompt: 'The email ___ you sent me yesterday had the wrong attachment.', answer: ['which', 'that'] },
          { type: 'choice', prompt: 'This is the office ___ I work.', options: ['where', 'who'], answerIndex: 0 }
        ]
      },
      vocabulary: [
        { word: 'promotion', translation: 'Beförderung', example: 'She got a promotion after two years.', mnemonic: '"Pro-motion" = nach vorne bewegt werden.', category: 'Arbeit' },
        { word: 'deadline', translation: 'Frist/Abgabetermin', example: 'The deadline for this project is Friday.', mnemonic: 'Wörtlich "Todeslinie" – die man nicht überschreiten sollte.', category: 'Arbeit' },
        { word: 'colleague', translation: 'Kollege/Kollegin', example: 'My colleague helped me finish the report.', mnemonic: 'Ähnlich zum deutschen "Kollege".', category: 'Arbeit' },
        { word: 'to apply for a job', translation: 'sich auf einen Job bewerben', example: 'I applied for a job at that company.', mnemonic: '"Apply" = sich anwenden/bewerben.', category: 'Arbeit' },
        { word: 'workload', translation: 'Arbeitsbelastung', example: 'My workload has increased this month.', mnemonic: 'Work + Load = die "Last" der Arbeit.', category: 'Arbeit' },
        { word: 'to negotiate', translation: 'verhandeln', example: 'You should negotiate your salary.', mnemonic: 'Klingt wie "negoziieren".', category: 'Arbeit' },
        { word: 'resignation', translation: 'Kündigung', example: 'He handed in his resignation yesterday.', mnemonic: '"Re-sign" = seine Unterschrift/Position zurückziehen.', category: 'Arbeit' },
        { word: 'skillset', translation: 'Kompetenzprofil', example: 'Her skillset is perfect for this role.', mnemonic: 'Skill + Set = ein "Satz" an Fähigkeiten.', category: 'Arbeit' }
      ],
      vocabPractice: [
        { type: 'choice', prompt: 'The date by which work must be finished is the...', options: ['deadline', 'workload', 'resignation'], answerIndex: 0 },
        { type: 'gap', prompt: 'She got a ___ after two great years at the company.', answer: 'promotion' },
        { type: 'choice', prompt: "What does 'to negotiate' mean?", options: ['to refuse completely', 'to discuss and reach an agreement', 'to quit a job'], answerIndex: 1 },
        { type: 'gap', prompt: 'He handed in his ___ after finding a new job.', answer: 'resignation' },
        { type: 'choice', prompt: 'Your combination of professional abilities is your...', options: ['skillset', 'workload', 'deadline'], answerIndex: 0 },
        { type: 'gap', prompt: 'I ___ ___ ___ ___ at three different companies this month.', answer: ['applied for a job', 'applied for jobs'] }
      ],
      listening: {
        title: "Marco's Promotion",
        sentences: [
          'After three years at the company, Marco finally got the promotion he wanted.',
          'His new role came with a bigger workload, but also new challenges.',
          'His colleague, who had been there much longer, gave him some advice.',
          'She told him to negotiate his new salary before accepting.',
          'Marco felt nervous, but decided to ask for a fair raise.',
          'To his surprise, his manager agreed almost immediately.',
          'Marco started his new position feeling confident about his skillset.'
        ],
        questions: [
          { prompt: 'What happened to Marco after three years?', options: ['He resigned', 'He got a promotion', 'He got fired'], answerIndex: 1 },
          { prompt: 'What did his colleague advise him to do?', options: ['Quit', 'Negotiate his salary', 'Ignore the offer'], answerIndex: 1 },
          { prompt: 'How did Marco feel at the end?', options: ['Confident', 'Angry', 'Confused'], answerIndex: 0 }
        ]
      },
      conversation: {
        situation: 'You just got a promotion and now discuss your new salary with your manager.',
        start: 'n1',
        nodes: {
          n1: { them: "So, congratulations on the promotion. Let's talk about your new salary.", next: 'n2', choices: [
            { text: 'Thank you! I was hoping we could discuss a raise that reflects the new responsibilities.', correct: true },
            { text: 'Thank you, I already know I deserve much more.', correct: false, feedback: 'Klingt anspruchsvoll/überheblich statt kooperativ. Diplomatischer formulieren.' },
            { text: 'Thank you, I was hoping we could discuss a raise who reflects the new responsibilities.', correct: false, feedback: '"Who" bezieht sich auf Personen, nicht auf Dinge wie "a raise". Richtig: "...a raise that reflects the new responsibilities."' }
          ]},
          n2: { them: 'That\'s fair. What figure did you have in mind?', next: 'n3', choices: [
            { text: 'Based on my research, I think a 10% increase would be appropriate.', correct: true },
            { text: 'As much as possible, obviously.', correct: false, feedback: 'Zu vage und wenig professionell für eine Gehaltsverhandlung. Nenne eine konkrete, begründete Zahl.' },
            { text: 'Based on my research, I think a 10% increase would be appropriate since long time.', correct: false, feedback: '"Since long time" ist ein typischer Übersetzungsfehler aus dem Deutschen und passt inhaltlich nicht — lass den Zusatz einfach weg.' }
          ]},
          n3: { them: 'That sounds reasonable given your new workload.', next: 'n4', choices: [
            { text: 'I really appreciate that. Thank you for considering it.', correct: true },
            { text: "I knew you'd agree eventually.", correct: false, feedback: 'Klingt selbstgefällig gegenüber einem Entgegenkommen. Dankbarer formulieren.' },
            { text: 'I am appreciate that a lot.', correct: false, feedback: '"Appreciate" ist ein Vollverb, kein "be + appreciate" nötig: "I really appreciate that."' }
          ]},
          n4: { them: "Let's also talk about your new responsibilities going forward.", next: 'n5', choices: [
            { text: "Sure, I'd love to understand what's expected of me in this new role.", correct: true },
            { text: "I already know everything, don't worry.", correct: false, feedback: 'Wirkt überheblich gegenüber dem Vorgesetzten. Zeig dich offen für Erwartungen.' },
            { text: "Sure, I would love to understand what it's expected from me.", correct: false, feedback: 'Doppelte Passiv-Konstruktion ist unnötig verschachtelt. Einfacher: "what\'s expected of me."' }
          ]},
          n5: { them: "We'll get the paperwork sorted this week.", next: 'end', choices: [
            { text: 'Great, thank you so much for your support!', correct: true },
            { text: 'Finally, took you long enough.', correct: false, feedback: 'Klingt undankbar/passiv-aggressiv nach einer positiven Nachricht. Freundlicher abschließen.' },
            { text: 'Great, thanks so much for you support.', correct: false, feedback: 'Wieder "you" statt "your" — richtig: "thank you so much for your support!"' }
          ]},
          end: { them: "You've earned it. Welcome to the new role!", end: true }
        }
      },
      quiz: [
        { type: 'gap', prompt: 'The employee ___ I mentioned earlier just resigned.', answer: ['who', 'that'] },
        { type: 'choice', prompt: '"Deadline" means...', options: ['a type of meeting', 'the date something is due', 'a job title'], answerIndex: 1 },
        { type: 'choice', prompt: 'Choose the non-defining clause:', options: ['My sister who lives in Rome is visiting.', 'My sister, who lives in Rome, is visiting.'], answerIndex: 1 },
        { type: 'choice', prompt: '"To negotiate" means...', options: ['to argue angrily', 'to discuss and reach an agreement', 'to refuse'], answerIndex: 1 },
        { type: 'choice', prompt: '"Workload" refers to...', options: ['your salary', 'the amount of work you have', 'your job title'], answerIndex: 1 },
        { type: 'gap', prompt: 'By next year, she ___ (work) here for a decade.', answer: 'will have worked' },
        { type: 'choice', prompt: '"Deadline" is closest in meaning to...', options: ['a type of contract', 'the date something is due', 'a job title'], answerIndex: 1 },
        { type: 'choice', prompt: '"To apply for a job" means...', options: ['to quit your job', 'to submit a request to be considered for a position', 'to get promoted'], answerIndex: 1 }
      ]
    },

    5: {
      grammar: {
        ruleTitle: 'Gemischte Konditionalsätze',
        explanation: 'Der 2. Konditionalsatz beschreibt unwahrscheinliche/hypothetische Situationen in Gegenwart/Zukunft (If + Simple Past, would + Infinitiv). Der 3. Konditionalsatz beschreibt Situationen in der Vergangenheit, die nicht eingetreten sind (If + Past Perfect, would have + Partizip II). Gemischte Konditionalsätze verbinden eine vergangene Bedingung mit einer gegenwärtigen Konsequenz (oder umgekehrt).',
        contrast: 'Deutsch nutzt oft den Konjunktiv II für beides ("Wenn ich das gewusst hätte, würde ich..."), Englisch unterscheidet klar durch die Zeitform im if-Satz.',
        examples: [
          { en: 'If we had arrived earlier, we wouldn\'t be waiting now.', de: 'Wenn wir früher angekommen wären, würden wir jetzt nicht warten. (gemischt)' },
          { en: 'If I had known about the allergy, I wouldn\'t have ordered peanuts.', de: 'Wenn ich von der Allergie gewusst hätte, hätte ich keine Erdnüsse bestellt.' },
          { en: "If I were you, I'd try the seafood.", de: 'An deiner Stelle würde ich das Meeresfrüchte-Gericht probieren.' }
        ],
        exercises: [
          { type: 'gap', prompt: 'If I ___ (know) about the allergy, I wouldn\'t have ordered peanuts.', answer: 'had known' },
          { type: 'choice', prompt: 'If I were you, I ___ ask for a table by the window.', options: ['would', 'will'], answerIndex: 0 },
          { type: 'gap', prompt: 'If we had booked a table, we ___ (not/wait) now.', answer: "wouldn't be waiting" },
          { type: 'choice', prompt: 'If she ___ more time, she would have cooked dinner herself.', options: ['had had', 'has'], answerIndex: 0 },
          { type: 'gap', prompt: "If he wasn't so busy at work, he ___ (join) us for dinner tonight.", answer: 'would join' },
          { type: 'choice', prompt: 'We wouldn\'t be so full now if we ___ dessert.', options: ["hadn't ordered", "didn't order"], answerIndex: 0 }
        ]
      },
      vocabulary: [
        { word: 'reservation', translation: 'Reservierung', example: 'I made a reservation for two at 8 PM.', mnemonic: 'Klingt wie "reservieren".', category: 'Restaurant' },
        { word: 'to recommend', translation: 'empfehlen', example: 'What would you recommend from the menu?', mnemonic: '"Re-commend" = etwas gut bewerten.', category: 'Restaurant' },
        { word: 'starter', translation: 'Vorspeise', example: "We'll start with the soup as a starter.", mnemonic: 'Womit man "startet" – die Vorspeise.', category: 'Restaurant' },
        { word: 'to be allergic to', translation: 'allergisch sein gegen', example: "I'm allergic to shellfish.", mnemonic: 'Ähnlich zum deutschen "allergisch".', category: 'Restaurant' },
        { word: 'bill / check', translation: 'Rechnung', example: 'Could we have the bill, please?', mnemonic: 'US-Englisch: "check", UK-Englisch: "bill".', category: 'Restaurant' },
        { word: 'to split the bill', translation: 'die Rechnung teilen', example: 'Shall we split the bill?', mnemonic: '"Split" = auseinanderteilen.', category: 'Restaurant' },
        { word: 'tip', translation: 'Trinkgeld', example: 'We left a generous tip.', mnemonic: 'Direkt aus dem Englischen übernommen.', category: 'Restaurant' },
        { word: 'signature dish', translation: 'Spezialität des Hauses', example: "The chef's signature dish is the duck.", mnemonic: '"Signature" = die "Unterschrift" des Kochs, sein Markenzeichen.', category: 'Restaurant' }
      ],
      vocabPractice: [
        { type: 'choice', prompt: 'A small dish served before the main course is a...', options: ['starter', 'signature dish', 'tip'], answerIndex: 0 },
        { type: 'gap', prompt: 'Could we have the ___, please?', answer: ['bill', 'check'] },
        { type: 'choice', prompt: "'To split the bill' means...", options: ['one person pays for everyone', 'everyone pays their own share', 'the restaurant pays'], answerIndex: 1 },
        { type: 'gap', prompt: "I'm ___ ___ shellfish, so I can't eat this dish.", answer: 'allergic to' },
        { type: 'choice', prompt: "The chef's speciality is called the...", options: ['signature dish', 'starter', 'reservation'], answerIndex: 0 },
        { type: 'gap', prompt: 'We left a generous ___ for the waiter.', answer: 'tip' }
      ],
      listening: {
        title: "Nina's Birthday Dinner",
        sentences: [
          'Nina booked a table at a popular restaurant for her birthday.',
          'When they arrived, the restaurant said they had no reservation on record.',
          'If she had brought her confirmation email, it would have solved the problem instantly.',
          'Luckily, the waiter found a table for them after a short wait.',
          'The waiter recommended the signature dish, a slow-cooked duck.',
          'Everyone loved the food, especially the starter.',
          'At the end, they decided to split the bill and leave a good tip.'
        ],
        questions: [
          { prompt: 'What problem did Nina have at the restaurant?', options: ['No reservation found', 'Restaurant closed', 'Wrong address'], answerIndex: 0 },
          { prompt: 'What did the waiter recommend?', options: ['A drink', 'The signature dish', 'A dessert'], answerIndex: 1 },
          { prompt: 'How did they pay?', options: ['Nina paid alone', 'They split the bill', "They didn't pay"], answerIndex: 1 }
        ]
      },
      conversation: {
        situation: 'You arrive at a restaurant and order dinner.',
        start: 'n1',
        nodes: {
          n1: { them: 'Good evening, do you have a reservation?', next: 'n2', choices: [
            { text: "Yes, it's under the name Schmidt, for two people.", correct: true },
            { text: 'Yes, obviously, we booked days ago.', correct: false, feedback: 'Klingt leicht gereizt gegenüber einer Standardfrage. Sachlich antworten.' },
            { text: "Yes, it's on name Schmidt, for two peoples.", correct: false, feedback: 'Zwei Fehler: "under the name" statt "on name", und "people" ist bereits Plural (kein "s"). Richtig: "under the name Schmidt, for two people."' }
          ]},
          n2: { them: 'Perfect, right this way. Can I get you something to drink?', next: 'n3', choices: [
            { text: 'Could we see the wine list, please?', correct: true },
            { text: 'Bring us your best wine, now.', correct: false, feedback: 'Klingt sehr befehlend für einen Restaurantbesuch. Höflicher formulieren.' },
            { text: 'Can we to see the wine list?', correct: false, feedback: 'Nach Modalverben wie "can" folgt der Infinitiv ohne "to": "Can we see the wine list?"' }
          ]},
          n3: { them: 'Of course. Are you ready to order, or do you need a few more minutes?', next: 'n4', choices: [
            { text: "We're ready. I'd like the signature dish, please.", correct: true },
            { text: "Just bring whatever's fastest.", correct: false, feedback: 'Wirkt gehetzt/unhöflich gegenüber der Speisekarte. Besser konkret bestellen.' },
            { text: 'We are ready, I would like the signature dish, please, since a long time.', correct: false, feedback: '"Since a long time" ist falsch übersetzt aus dem Deutschen und passt inhaltlich nicht zur Bestellung. Einfach weglassen.' }
          ]},
          n4: { them: 'Excellent choice. And for you — anything to start?', next: 'n5', choices: [
            { text: "I'll have the soup as a starter, thank you.", correct: true },
            { text: "I don't really do starters.", correct: false, feedback: 'Klingt etwas abweisend gegenüber einer freundlichen Nachfrage. Konkreter antworten.' },
            { text: 'I will have the soup for starter.', correct: false, feedback: 'Es heißt "as a starter", nicht "for starter". Richtig: "I\'ll have the soup as a starter."' }
          ]},
          n5: { them: "I'll bring that right out. Anything else?", next: 'end', choices: [
            { text: "That's all for now, thank you.", correct: true },
            { text: 'No, hurry up though.', correct: false, feedback: 'Klingt ungeduldig/unfreundlich. Freundlich abschließen.' },
            { text: "That's all for now, thanks for you service.", correct: false, feedback: 'Wieder "you" statt "your": "thanks for your service" — oder einfach "That\'s all for now, thank you."' }
          ]},
          end: { them: "Great, I'll be right back with your order.", end: true }
        }
      },
      quiz: [
        { type: 'gap', prompt: 'If I ___ (know) about the allergy, I wouldn\'t have ordered peanuts.', answer: 'had known' },
        { type: 'choice', prompt: '"To split the bill" means...', options: ['one person pays everything', 'everyone pays their share', 'no one pays'], answerIndex: 1 },
        { type: 'choice', prompt: 'A "starter" is...', options: ['the main course', 'a small dish before the main course', 'a dessert'], answerIndex: 1 },
        { type: 'choice', prompt: 'If I were you, I ___ try the fish.', options: ['would', 'would have'], answerIndex: 0 },
        { type: 'choice', prompt: '"Signature dish" means...', options: ['the cheapest dish', "the chef's speciality", 'a vegetarian dish'], answerIndex: 1 },
        { type: 'gap', prompt: "If the restaurant ___ (be) less busy, we wouldn't have waited so long.", answer: 'had been' },
        { type: 'choice', prompt: '"Reservation" means...', options: ['a booking for a table', 'a type of dish', 'a complaint'], answerIndex: 0 },
        { type: 'choice', prompt: '"To recommend" means...', options: ['to suggest something good', 'to complain about something', 'to cancel an order'], answerIndex: 0 }
      ]
    },

    6: {
      grammar: {
        ruleTitle: 'Indirekte Rede (Backshift)',
        explanation: 'In der indirekten Rede verschieben sich Zeitformen meist eine Stufe zurück (Present → Past, Present Perfect → Past Perfect), und Zeit-/Ortsangaben passen sich an ("now" → "then"). Aufforderungen werden mit "told someone to" + Infinitiv wiedergegeben.',
        contrast: 'Im Deutschen nutzt man oft den Konjunktiv I ("Er sagte, er sei krank"), Englisch verschiebt stattdessen die Zeitform (Backshift).',
        examples: [
          { en: "'I feel dizzy,' she said. → She said she felt dizzy.", de: '"Mir ist schwindlig", sagte sie. → Sie sagte, ihr sei schwindlig.' },
          { en: "'Take this medicine twice a day,' the doctor said. → The doctor told me to take the medicine twice a day.", de: 'Der Arzt sagte mir, ich solle die Medizin zweimal täglich nehmen.' },
          { en: "'I have a headache,' Tom said. → Tom said he had a headache.", de: '"Ich habe Kopfschmerzen", sagte Tom. → Tom sagte, er habe Kopfschmerzen.' }
        ],
        exercises: [
          { type: 'gap', prompt: "'I feel sick,' she said. → She said she ___ sick.", answer: 'felt' },
          { type: 'gap', prompt: "'Call an ambulance!' he shouted. → He told us ___ an ambulance.", answer: 'to call' },
          { type: 'choice', prompt: "'I have a headache,' Tom said. → Tom said he ___ a headache.", options: ['has', 'had'], answerIndex: 1 },
          { type: 'choice', prompt: "'I will see a doctor tomorrow,' she said. → She said she ___ a doctor the next day.", options: ['would see', 'will see'], answerIndex: 0 },
          { type: 'gap', prompt: "'Don't move,' the paramedic said. → The paramedic told him ___.", answer: 'not to move' },
          { type: 'choice', prompt: "'I have been feeling dizzy,' he said. → He said he ___ feeling dizzy.", options: ['had been', 'has been'], answerIndex: 0 }
        ]
      },
      vocabulary: [
        { word: 'ambulance', translation: 'Krankenwagen', example: 'They called an ambulance immediately.', mnemonic: 'Fast identisch zum deutschen Wort.', category: 'Gesundheit' },
        { word: 'to feel dizzy', translation: 'schwindlig sein', example: 'I suddenly felt dizzy and had to sit down.', mnemonic: '"Dizzy" klingt wie ein drehender Kopf.', category: 'Gesundheit' },
        { word: 'prescription', translation: 'Rezept (Medikament)', example: 'The doctor gave me a prescription.', mnemonic: '"Pre-scribe" = etwas vorher aufschreiben/verordnen.', category: 'Gesundheit' },
        { word: 'emergency room', translation: 'Notaufnahme', example: 'We rushed him to the emergency room.', mnemonic: 'Kurz: "ER" – wie in der TV-Serie.', category: 'Gesundheit' },
        { word: 'symptom', translation: 'Symptom', example: 'Fever is a common symptom of the flu.', mnemonic: 'Fast identisch zum deutschen Wort.', category: 'Gesundheit' },
        { word: 'to recover', translation: 'sich erholen', example: 'She recovered quickly after the surgery.', mnemonic: '"Re-cover" = sich wieder "zudecken"/erholen.', category: 'Gesundheit' },
        { word: 'painkiller', translation: 'Schmerzmittel', example: 'Take a painkiller if the pain gets worse.', mnemonic: 'Pain + Killer = "Schmerz-Töter".', category: 'Gesundheit' },
        { word: 'first aid', translation: 'Erste Hilfe', example: 'He knew basic first aid and helped immediately.', mnemonic: 'Direkt übersetzbar: "erste Hilfe".', category: 'Gesundheit' }
      ],
      vocabPractice: [
        { type: 'choice', prompt: 'A sign that shows you might be ill is a...', options: ['symptom', 'prescription', 'painkiller'], answerIndex: 0 },
        { type: 'gap', prompt: 'After the accident, he had to sit down because he ___ ___.', answer: 'felt dizzy' },
        { type: 'choice', prompt: "What is 'first aid'?", options: ['a hospital department', 'immediate help given to an injured person', 'a type of medicine'], answerIndex: 1 },
        { type: 'gap', prompt: 'The doctor wrote her a ___ for painkillers.', answer: 'prescription' },
        { type: 'choice', prompt: "'To recover' means...", options: ['to get worse', 'to get better', 'to feel pain'], answerIndex: 1 },
        { type: 'gap', prompt: 'They rushed him to the ___ ___ after the fall.', answer: 'emergency room' }
      ],
      listening: {
        title: "James' Dizzy Spell",
        sentences: [
          'During lunch, James suddenly felt dizzy and short of breath.',
          'A colleague quickly gave him some first aid and called an ambulance.',
          'At the hospital, the doctor asked him about his symptoms.',
          'James told the doctor he had felt this way once before.',
          'The doctor said it was probably just low blood pressure.',
          'She gave him a prescription and told him to rest for two days.',
          'By the weekend, James had fully recovered.'
        ],
        questions: [
          { prompt: 'What happened to James at lunch?', options: ['He felt dizzy', 'He broke his arm', 'He fell asleep'], answerIndex: 0 },
          { prompt: 'What did his colleague do?', options: ['Ignored it', 'Gave first aid and called an ambulance', 'Drove him home'], answerIndex: 1 },
          { prompt: 'What did the doctor say caused it?', options: ['A serious illness', 'Low blood pressure', 'Nothing, it was fine'], answerIndex: 1 }
        ]
      },
      conversation: {
        situation: "You're at the doctor's office describing your symptoms.",
        start: 'n1',
        nodes: {
          n1: { them: 'Good morning, what seems to be the problem today?', next: 'n2', choices: [
            { text: "I've been feeling dizzy and tired for the past two days.", correct: true },
            { text: 'Everything, I feel terrible in general.', correct: false, feedback: 'Zu unspezifisch für eine medizinische Diagnose. Beschreibe konkrete Symptome.' },
            { text: 'I feel dizzy and tired since two days.', correct: false, feedback: '"Since two days" ist falsch — mit einer Zeitdauer nutzt man "for": "I\'ve been feeling dizzy and tired for two days."' }
          ]},
          n2: { them: 'I see. Have you had any other symptoms, like headaches or fever?', next: 'n3', choices: [
            { text: "Yes, I've also had a mild headache since yesterday.", correct: true },
            { text: "Maybe, I don't really pay attention to that.", correct: false, feedback: 'Das hilft dem Arzt nicht bei der Diagnose. Sei konkreter.' },
            { text: 'Yes, I have also a mild headache since yesterday.', correct: false, feedback: 'Im Present Perfect gehört "also" zwischen Hilfsverb und Partizip: "I\'ve also had a mild headache."' }
          ]},
          n3: { them: "Alright, it sounds like low blood pressure. I'll write you a prescription.", next: 'n4', choices: [
            { text: 'Thank you, doctor. Should I take the medicine with food?', correct: true },
            { text: "Are you sure it's nothing serious?", correct: false, feedback: 'Verständliche Sorge, aber wirkt misstrauisch gegenüber der Diagnose. Sachlicher nachfragen.' },
            { text: 'Thank you, should I take the medicine with the food?', correct: false, feedback: 'Bei einer allgemeinen Aussage über Mahlzeiten braucht man keinen bestimmten Artikel: "with food", nicht "with the food."' }
          ]},
          n4: { them: 'Yes, take it after meals. Do you have any allergies I should know about?', next: 'n5', choices: [
            { text: "No, I don't have any allergies that I know of.", correct: true },
            { text: "I don't know, I never checked.", correct: false, feedback: 'Etwas unbestimmt für eine medizinisch wichtige Frage. Klarer antworten.' },
            { text: 'No, I have no allergies since born.', correct: false, feedback: '"Since born" ist keine natürliche englische Wendung. Besser: "No, I don\'t have any allergies that I know of."' }
          ]},
          n5: { them: 'Perfect. Rest for a couple of days and you should feel better soon.', next: 'end', choices: [
            { text: 'Understood. Thank you so much for your help.', correct: true },
            { text: 'Fine, whatever you say.', correct: false, feedback: 'Klingt widerwillig/desinteressiert. Dankbar abschließen.' },
            { text: 'Understood, thank you so much for you help.', correct: false, feedback: 'Wieder "you" statt "your" — "thank you so much for your help."' }
          ]},
          end: { them: 'You\'re welcome. Take care and rest well.', end: true }
        }
      },
      quiz: [
        { type: 'gap', prompt: "'I feel dizzy,' she said. → She said she ___ dizzy.", answer: 'felt' },
        { type: 'choice', prompt: '"First aid" means...', options: ['a type of medicine', 'immediate help given to someone injured', 'a hospital department'], answerIndex: 1 },
        { type: 'gap', prompt: "'Rest for two days,' the doctor said. → The doctor told me ___ for two days.", answer: 'to rest' },
        { type: 'choice', prompt: '"To recover" means...', options: ['to get worse', 'to get better/heal', 'to feel pain'], answerIndex: 1 },
        { type: 'choice', prompt: 'A "symptom" is...', options: ['a type of treatment', 'a sign of illness', 'a hospital room'], answerIndex: 1 },
        { type: 'gap', prompt: "'I need to rest,' he said. → He said he ___ to rest.", answer: 'needed' },
        { type: 'choice', prompt: '"Painkiller" means...', options: ['a type of injury', 'medicine that reduces pain', 'a hospital department'], answerIndex: 1 },
        { type: 'choice', prompt: '"Emergency room" means...', options: ['a waiting room for appointments', 'the hospital department for urgent cases', 'a pharmacy'], answerIndex: 1 }
      ]
    },

    7: {
      review: true,
      summary: {
        intro: 'Starke erste Woche! Hier ist ein kompakter Überblick über alles, was du gelernt hast.',
        grammarPoints: [
          'Present Perfect Simple vs. Continuous – Ergebnis vs. Verlauf',
          'Modalverben der Vermutung – must/might/can\'t + have + Partizip II',
          'Passiv für neutrale, formelle Aussagen (Beschwerden, Berichte)',
          'Relativsätze – definierend (ohne Komma) vs. nicht-definierend (mit Komma)',
          'Gemischte Konditionalsätze – vergangene Bedingung, gegenwärtige Folge',
          'Indirekte Rede – Backshift der Zeitformen'
        ],
        encouragement: 'Wiederhole diese Wörter in ein paar Tagen im Vokabeltrainer noch einmal – Wiederholung mit Abstand ist der Schlüssel zum Langzeitgedächtnis.'
      },
      quiz: [
        { type: 'choice', prompt: 'Choose correct: I ___ this article twice already.', options: ['have read', 'have been reading'], answerIndex: 0 },
        { type: 'gap', prompt: 'The lights are off, they ___ (must/leave).', answer: 'must have left' },
        { type: 'choice', prompt: 'My order ___ cancelled. (passive)', options: ['was', 'were'], answerIndex: 0 },
        { type: 'gap', prompt: 'The manager ___ hired me left the company.', answer: ['who', 'that'] },
        { type: 'gap', prompt: 'If I ___ (know) earlier, I would have helped.', answer: 'had known' },
        { type: 'gap', prompt: "'I am tired,' he said. → He said he ___ tired.", answer: 'was' },
        { type: 'choice', prompt: '"Layover" means...', options: ['a stop between flights', 'a delayed flight', 'a type of ticket'], answerIndex: 0 },
        { type: 'choice', prompt: '"Faulty" means...', options: ['broken', 'new', 'expensive'], answerIndex: 0 },
        { type: 'choice', prompt: '"To negotiate" means...', options: ['to argue', 'to discuss to reach agreement', 'to ignore'], answerIndex: 1 },
        { type: 'choice', prompt: '"Symptom" means...', options: ['a sign of illness', 'a treatment', 'a hospital'], answerIndex: 0 },
        { type: 'choice', prompt: '"Icebreaker" means...', options: ['a cold drink', 'a question or activity to start a conversation', 'an argument'], answerIndex: 1 },
        { type: 'gap', prompt: 'The candidate ___ we hired starts on Monday.', answer: ['who', 'that'] },
        { type: 'choice', prompt: '"To split the bill" means...', options: ['one person pays for all', 'everyone pays their own share', 'the meal is free'], answerIndex: 1 },
        { type: 'gap', prompt: "'I feel great today,' she said. → She said she ___ great that day.", answer: 'felt' }
      ]
    }
  }
};
