/* week01 — Feld "listening". Teil des nach Aufgabentyp aufgeteilten Datenschemas,
   siehe CONTENT_GUIDE.md. Nur dieses eine Feld je Tag — andere Aufgabentypen
   dieser Woche liegen in den Nachbardateien im selben Ordner. */

defineWeekField('week01', "Ankommen & Small Talk", 1, 'listening', {
  "title": "Emma at the Conference",
  "sentences": ["Emma arrived at the conference a little nervous.", "She didn't know anyone in the room.", "A man near the coffee table smiled and said hello.", "His name was Daniel, and he worked in marketing.", "They started with some small talk about the traffic.", "Within a few minutes, they had hit it off.", "Daniel mentioned he had been to this conference twice before.", "He gave her his business card and suggested they get in touch next week.", "Emma left the event feeling proud of herself."],
  "questions": [
    { "prompt": "Why was Emma nervous at first?", "options": ["She didn't know anyone", "She was late", "She lost her ticket"], "answerIndex": 0, "explanation": "Im Text: 'She didn't know anyone in the room.'" },
    { "prompt": "What was the name of the man who spoke to her?", "options": ["Daniel", "Marco", "Tom"], "answerIndex": 0, "explanation": "Im Text: 'His name was Daniel.'" },
    { "prompt": "What was Daniel's job?", "options": ["Marketing", "Engineering", "Teaching"], "answerIndex": 0, "explanation": "Im Text: 'he worked in marketing.'" },
    { "prompt": "What did they talk about first?", "options": ["The weather", "The traffic", "Their jobs"], "answerIndex": 1, "explanation": "Im Text: 'small talk about the traffic.'" },
    { "prompt": "How quickly did they get along?", "options": ["Very quickly", "After a long, awkward conversation", "They never really did"], "answerIndex": 0, "explanation": "Im Text: 'Within a few minutes, they had hit it off.'" },
    { "prompt": "How many times had Daniel been to this conference before?", "options": ["Once", "Twice", "Three times"], "answerIndex": 1, "explanation": "Im Text: 'Daniel mentioned he had been to this conference twice before.'" },
    { "prompt": "What did Daniel give Emma?", "options": ["A coffee", "His business card", "A book"], "answerIndex": 1, "explanation": "Im Text: 'He gave her his business card.'" },
    { "prompt": "What did Daniel suggest?", "options": ["Getting in touch next week", "Meeting again tomorrow", "Never speaking again"], "answerIndex": 0, "explanation": "Im Text: 'suggested they get in touch next week.'" },
    { "prompt": "How did Emma feel when she left?", "options": ["Embarrassed", "Proud of herself", "Bored"], "answerIndex": 1, "explanation": "Im Text: 'Emma left the event feeling proud of herself.'" }
  ]
});

defineWeekField('week01', "Ankommen & Small Talk", 2, 'listening', {
  "title": "Tom's Delayed Flight",
  "sentences": ["Tom's flight to New York was delayed by three hours.", "He decided to check in early anyway, just to be safe.", "While waiting, he made some small talk with a woman sitting nearby.", "At the gate, an announcement said the connecting flight might also be affected.", "Tom started to worry about his layover in Amsterdam.", "Luckily, the airline rebooked him onto an earlier connection.", "After landing, he collected his suitcase at the luggage claim.", "The customs officer asked him a few quick questions about his luggage.", "He was relieved to finally get through customs and start his trip."],
  "questions": [
    { "prompt": "How long was Tom's flight delayed?", "options": ["One hour", "Three hours", "All day"], "answerIndex": 1, "explanation": "Im Text: 'delayed by three hours.'" },
    { "prompt": "What did Tom do despite the delay?", "options": ["Checked in early", "Cancelled his ticket", "Went home"], "answerIndex": 0, "explanation": "Im Text: 'He decided to check in early anyway.'" },
    { "prompt": "What did Tom do while waiting?", "options": ["Fell asleep", "Made small talk with a woman nearby", "Called the airline"], "answerIndex": 1, "explanation": "Im Text: 'he made some small talk with a woman sitting nearby.'" },
    { "prompt": "What did the gate announcement warn about?", "options": ["A gate change", "The connecting flight might be affected", "A weather delay"], "answerIndex": 1, "explanation": "Im Text: 'the connecting flight might also be affected.'" },
    { "prompt": "What was Tom worried about?", "options": ["Missing his layover connection", "Losing his passport", "The weather"], "answerIndex": 0, "explanation": "Im Text: 'Tom started to worry about his layover in Amsterdam.'" },
    { "prompt": "What did the airline do?", "options": ["Cancelled his ticket", "Rebooked him onto an earlier connection", "Upgraded his seat"], "answerIndex": 1, "explanation": "Im Text: 'the airline rebooked him onto an earlier connection.'" },
    { "prompt": "What did Tom do first after landing?", "options": ["Went straight to customs", "Collected his luggage", "Called a taxi"], "answerIndex": 1, "explanation": "Im Text: 'he collected his suitcase at the luggage claim.'" },
    { "prompt": "What did the customs officer do?", "options": ["Confiscated his bag", "Asked him a few questions about his luggage", "Ignored him"], "answerIndex": 1, "explanation": "Im Text: 'The customs officer asked him a few quick questions.'" },
    { "prompt": "How did Tom feel at the end?", "options": ["Relieved", "Angry", "Confused"], "answerIndex": 0, "explanation": "Im Text: 'He was relieved to finally get through customs.'" }
  ]
});

defineWeekField('week01', "Ankommen & Small Talk", 3, 'listening', {
  "title": "Lisa's Faulty Jacket",
  "sentences": ["Lisa ordered a jacket online, but it arrived faulty.", "At first, she thought she might have ordered the wrong size.", "One of the zippers was completely broken.", "She contacted customer service and explained the problem.", "They asked her to send a photo of the damage.", "Luckily, the jacket was still covered by warranty.", "Lisa was offered a full refund or a free exchange.", "She kept the receipt safely in case anything else went wrong.", "She chose the exchange and received a new jacket within a week."],
  "questions": [
    { "prompt": "What was wrong with the jacket?", "options": ["Wrong colour", "Broken zipper", "Wrong size"], "answerIndex": 1, "explanation": "Im Text: 'One of the zippers was completely broken.'" },
    { "prompt": "What did Lisa think at first?", "options": ["She'd ordered the wrong size", "The jacket was stolen", "The shop was closed"], "answerIndex": 0, "explanation": "Im Text: 'she thought she might have ordered the wrong size.'" },
    { "prompt": "Who did Lisa contact?", "options": ["Customer service", "The delivery driver", "Her bank"], "answerIndex": 0, "explanation": "Im Text: 'She contacted customer service.'" },
    { "prompt": "What did customer service ask for?", "options": ["A receipt", "A photo", "A phone call"], "answerIndex": 1, "explanation": "Im Text: 'They asked her to send a photo of the damage.'" },
    { "prompt": "Why could Lisa get help so easily?", "options": ["It was expensive", "The jacket was covered by warranty", "She complained loudly"], "answerIndex": 1, "explanation": "Im Text: 'the jacket was still covered by warranty.'" },
    { "prompt": "What two options was Lisa offered?", "options": ["A refund or an exchange", "A discount or an apology", "Nothing"], "answerIndex": 0, "explanation": "Im Text: 'Lisa was offered a full refund or a free exchange.'" },
    { "prompt": "What did Lisa do with the receipt?", "options": ["Threw it away", "Kept it safely", "Gave it to the shop"], "answerIndex": 1, "explanation": "Im Text: 'She kept the receipt safely.'" },
    { "prompt": "What did Lisa choose?", "options": ["A refund", "An exchange", "Neither"], "answerIndex": 1, "explanation": "Im Text: 'She chose the exchange.'" },
    { "prompt": "How long did it take to receive the new jacket?", "options": ["Within a week", "The same day", "A month"], "answerIndex": 0, "explanation": "Im Text: 'received a new jacket within a week.'" }
  ]
});

defineWeekField('week01', "Ankommen & Small Talk", 4, 'listening', {
  "title": "Marco's Promotion",
  "sentences": ["After three years at the company, Marco finally got the promotion he wanted.", "He had applied for the position twice before finally succeeding.", "His new role came with a bigger workload, but also new challenges.", "His colleague, who had been there much longer, gave him some advice.", "She told him to negotiate his new salary before accepting.", "Marco felt nervous, but decided to ask for a fair raise.", "To his surprise, his manager agreed almost immediately.", "He immediately set a personal deadline to learn his new responsibilities within a month.", "Marco started his new position feeling confident about his skillset."],
  "questions": [
    { "prompt": "What happened to Marco after three years?", "options": ["He resigned", "He got a promotion", "He got fired"], "answerIndex": 1, "explanation": "Im Text: 'Marco finally got the promotion he wanted.'" },
    { "prompt": "How many times had Marco applied for this position before?", "options": ["Once", "Twice", "Three times"], "answerIndex": 1, "explanation": "Im Text: 'He had applied for the position twice before.'" },
    { "prompt": "What came with his new role?", "options": ["A pay cut", "A bigger workload", "Fewer responsibilities"], "answerIndex": 1, "explanation": "Im Text: 'His new role came with a bigger workload.'" },
    { "prompt": "Who gave Marco advice?", "options": ["His manager", "His colleague", "A stranger"], "answerIndex": 1, "explanation": "Im Text: 'His colleague ... gave him some advice.'" },
    { "prompt": "What did his colleague advise him to do?", "options": ["Quit", "Negotiate his salary", "Ignore the offer"], "answerIndex": 1, "explanation": "Im Text: 'She told him to negotiate his new salary.'" },
    { "prompt": "How did Marco feel before asking for a raise?", "options": ["Confident", "Nervous", "Angry"], "answerIndex": 1, "explanation": "Im Text: 'Marco felt nervous.'" },
    { "prompt": "How did his manager react to the raise request?", "options": ["Refused completely", "Agreed almost immediately", "Ignored it"], "answerIndex": 1, "explanation": "Im Text: 'his manager agreed almost immediately.'" },
    { "prompt": "What did Marco set for himself?", "options": ["A vacation", "A personal deadline", "A resignation date"], "answerIndex": 1, "explanation": "Im Text: 'He immediately set a personal deadline.'" },
    { "prompt": "How did Marco feel at the end?", "options": ["Confident", "Angry", "Confused"], "answerIndex": 0, "explanation": "Im Text: 'feeling confident about his skillset.'" }
  ]
});

defineWeekField('week01', "Ankommen & Small Talk", 5, 'listening', {
  "title": "Nina's Birthday Dinner",
  "sentences": ["Nina booked a table at a popular restaurant for her birthday.", "When they arrived, the restaurant said they had no reservation on record.", "One of Nina's friends mentioned she was allergic to shellfish, just in case.", "If she had brought her confirmation email, it would have solved the problem instantly.", "Luckily, the waiter found a table for them after a short wait.", "The waiter recommended the signature dish, a slow-cooked duck.", "Everyone loved the food, especially the starter.", "Nina thanked the waiter warmly for finding them a table on such a busy night.", "At the end, they decided to split the bill and leave a good tip."],
  "questions": [
    { "prompt": "What problem did Nina have at the restaurant?", "options": ["No reservation found", "Restaurant closed", "Wrong address"], "answerIndex": 0, "explanation": "Im Text: 'the restaurant said they had no reservation on record.'" },
    { "prompt": "What did one of Nina's friends mention?", "options": ["She was allergic to shellfish", "She didn't like duck", "She had to leave early"], "answerIndex": 0, "explanation": "Im Text: 'she was allergic to shellfish.'" },
    { "prompt": "What would have solved the problem instantly?", "options": ["Bringing the confirmation email", "Calling ahead", "Paying extra"], "answerIndex": 0, "explanation": "Im Text: 'If she had brought her confirmation email, it would have solved the problem instantly.'" },
    { "prompt": "Who found them a table?", "options": ["The waiter", "The manager", "A different customer"], "answerIndex": 0, "explanation": "Im Text: 'the waiter found a table for them.'" },
    { "prompt": "What did the waiter recommend?", "options": ["A drink", "The signature dish", "A dessert"], "answerIndex": 1, "explanation": "Im Text: 'The waiter recommended the signature dish.'" },
    { "prompt": "What was the signature dish?", "options": ["Slow-cooked duck", "Grilled fish", "Vegetable soup"], "answerIndex": 0, "explanation": "Im Text: 'a slow-cooked duck.'" },
    { "prompt": "What did everyone especially love?", "options": ["The starter", "The dessert", "The drinks"], "answerIndex": 0, "explanation": "Im Text: 'Everyone loved the food, especially the starter.'" },
    { "prompt": "What did Nina do for the waiter?", "options": ["Complained", "Thanked him warmly", "Ignored him"], "answerIndex": 1, "explanation": "Im Text: 'Nina thanked the waiter warmly.'" },
    { "prompt": "How did they pay?", "options": ["Nina paid alone", "They split the bill", "They didn't pay"], "answerIndex": 1, "explanation": "Im Text: 'they decided to split the bill.'" }
  ]
});

defineWeekField('week01', "Ankommen & Small Talk", 6, 'listening', {
  "title": "James' Dizzy Spell",
  "sentences": ["During lunch, James suddenly felt dizzy and short of breath.", "A colleague quickly gave him some first aid and called an ambulance.", "Paramedics arrived within minutes and checked his blood pressure.", "At the hospital, the doctor asked him about his symptoms.", "James told the doctor he had felt this way once before.", "The doctor said it was probably just low blood pressure.", "She gave him a prescription and told him to rest for two days.", "He also promised to drink more water and eat more regularly.", "By the weekend, James had fully recovered."],
  "questions": [
    { "prompt": "What happened to James at lunch?", "options": ["He felt dizzy", "He broke his arm", "He fell asleep"], "answerIndex": 0, "explanation": "Im Text: 'James suddenly felt dizzy and short of breath.'" },
    { "prompt": "What did his colleague do?", "options": ["Ignored it", "Gave first aid and called an ambulance", "Drove him home"], "answerIndex": 1, "explanation": "Im Text: 'A colleague quickly gave him some first aid and called an ambulance.'" },
    { "prompt": "Who arrived within minutes?", "options": ["Paramedics", "His family", "The police"], "answerIndex": 0, "explanation": "Im Text: 'Paramedics arrived within minutes.'" },
    { "prompt": "What did the paramedics check?", "options": ["His temperature", "His blood pressure", "His eyesight"], "answerIndex": 1, "explanation": "Im Text: 'checked his blood pressure.'" },
    { "prompt": "What did the doctor ask about?", "options": ["His job", "His symptoms", "His diet"], "answerIndex": 1, "explanation": "Im Text: 'the doctor asked him about his symptoms.'" },
    { "prompt": "Had James felt this way before?", "options": ["Yes, once before", "No, never", "He wasn't sure"], "answerIndex": 0, "explanation": "Im Text: 'he had felt this way once before.'" },
    { "prompt": "What did the doctor say caused it?", "options": ["A serious illness", "Low blood pressure", "Nothing, it was fine"], "answerIndex": 1, "explanation": "Im Text: 'it was probably just low blood pressure.'" },
    { "prompt": "What did James promise to do?", "options": ["Exercise more", "Drink more water and eat more regularly", "See a specialist"], "answerIndex": 1, "explanation": "Im Text: 'he also promised to drink more water and eat more regularly.'" },
    { "prompt": "How was James by the weekend?", "options": ["Fully recovered", "Still dizzy", "In hospital"], "answerIndex": 0, "explanation": "Im Text: 'James had fully recovered.'" }
  ]
});

