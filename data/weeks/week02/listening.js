/* week02 — Feld "listening". Teil des nach Aufgabentyp aufgeteilten Datenschemas,
   siehe CONTENT_GUIDE.md. Nur dieses eine Feld je Tag — andere Aufgabentypen
   dieser Woche liegen in den Nachbardateien im selben Ordner. */

defineWeekField('week02', "Reisen & Unterwegs", 1, 'listening', {
  "title": "Maya's First Solo Trip",
  "sentences": ["Maya had never travelled alone before, so she planned everything carefully.", "She spent a whole evening putting together a detailed itinerary.", "She decided to book her flights and hotels well in advance to save money.", "Her friend suggested budget travel to make the trip last longer.", "Maya packed light, taking only one small suitcase.", "At the last minute, she also bought travel insurance, just in case.", "On the morning of the trip, she set off before sunrise to catch her flight.", "She felt nervous but excited as the taxi arrived.", "By the time she landed, all her worries had disappeared."],
  "questions": [
    { "prompt": "Had Maya travelled alone before?", "options": ["No, never", "Yes, many times", "She wasn't sure"], "answerIndex": 0, "explanation": "Im Text: 'Maya had never travelled alone before.'" },
    { "prompt": "What did Maya spend a whole evening doing?", "options": ["Packing her suitcase", "Putting together an itinerary", "Calling her friend"], "answerIndex": 1, "explanation": "Im Text: 'She spent a whole evening putting together a detailed itinerary.'" },
    { "prompt": "Why did Maya book early?", "options": ["To save money", "Because there were no seats left", "Her friend told her to"], "answerIndex": 0, "explanation": "Im Text: 'book her flights and hotels well in advance to save money.'" },
    { "prompt": "What did her friend suggest?", "options": ["Budget travel", "Flying first class", "Staying home"], "answerIndex": 0, "explanation": "Im Text: 'Her friend suggested budget travel.'" },
    { "prompt": "How did Maya pack?", "options": ["Light, one small suitcase", "Two huge suitcases", "She forgot to pack"], "answerIndex": 0, "explanation": "Im Text: 'Maya packed light, taking only one small suitcase.'" },
    { "prompt": "What did she buy at the last minute?", "options": ["A new suitcase", "Travel insurance", "A better ticket"], "answerIndex": 1, "explanation": "Im Text: 'she also bought travel insurance.'" },
    { "prompt": "When did she set off?", "options": ["Before sunrise", "At midday", "Late at night"], "answerIndex": 0, "explanation": "Im Text: 'she set off before sunrise.'" },
    { "prompt": "How did Maya feel as the taxi arrived?", "options": ["Nervous but excited", "Completely calm", "Angry"], "answerIndex": 0, "explanation": "Im Text: 'She felt nervous but excited.'" },
    { "prompt": "How did she feel after landing?", "options": ["Still very nervous", "Her worries had disappeared", "She wanted to go home"], "answerIndex": 1, "explanation": "Im Text: 'all her worries had disappeared.'" }
  ]
});

defineWeekField('week02', "Reisen & Unterwegs", 2, 'listening', {
  "title": "Ben Explores the Old Town",
  "sentences": ["Ben decided to explore the old town on foot instead of taking a taxi.", "He didn't have a map, so he asked a local for directions.", "She kindly told him to head towards the church and then turn left.", "Ben tried to follow her directions, but he got lost almost immediately.", "He noticed a signpost pointing towards the pedestrian zone.", "Instead of the main road, he decided to take a shortcut through a quiet alley.", "Unfortunately, he missed a turn and ended up at a busy roundabout.", "Feeling frustrated, he used public transport to finally reach the old town.", "Despite the detour, he still had time to enjoy the afternoon."],
  "questions": [
    { "prompt": "How did Ben decide to explore the old town?", "options": ["On foot", "By taxi", "By bicycle"], "answerIndex": 0, "explanation": "Im Text: 'Ben decided to explore the old town on foot.'" },
    { "prompt": "Why did he ask a local for directions?", "options": ["He didn't have a map", "He was late", "He was lost already"], "answerIndex": 0, "explanation": "Im Text: 'He didn't have a map.'" },
    { "prompt": "What did the local tell him to do first?", "options": ["Head towards the church", "Take a bus", "Turn right immediately"], "answerIndex": 0, "explanation": "Im Text: 'told him to head towards the church.'" },
    { "prompt": "What happened after he followed her directions?", "options": ["He arrived quickly", "He got lost almost immediately", "He found a shortcut"], "answerIndex": 1, "explanation": "Im Text: 'he got lost almost immediately.'" },
    { "prompt": "What did the signpost point towards?", "options": ["The pedestrian zone", "The train station", "The roundabout"], "answerIndex": 0, "explanation": "Im Text: 'a signpost pointing towards the pedestrian zone.'" },
    { "prompt": "What did Ben decide to take instead of the main road?", "options": ["A taxi", "A shortcut through a quiet alley", "A bus"], "answerIndex": 1, "explanation": "Im Text: 'he decided to take a shortcut through a quiet alley.'" },
    { "prompt": "What happened because he missed a turn?", "options": ["He ended up at a busy roundabout", "He arrived early", "He found the old town"], "answerIndex": 0, "explanation": "Im Text: 'he missed a turn and ended up at a busy roundabout.'" },
    { "prompt": "How did Ben finally reach the old town?", "options": ["By walking further", "By using public transport", "By calling a friend"], "answerIndex": 1, "explanation": "Im Text: 'he used public transport to finally reach the old town.'" },
    { "prompt": "How did Ben feel despite the detour?", "options": ["Too tired to continue", "He still had time to enjoy the afternoon", "He gave up and went home"], "answerIndex": 1, "explanation": "Im Text: 'he still had time to enjoy the afternoon.'" }
  ]
});

defineWeekField('week02', "Reisen & Unterwegs", 3, 'listening', {
  "title": "The Overbooked Hotel",
  "sentences": ["When Anna and Ravi arrived at the hotel, they discovered it had been overbooked.", "The manager explained that a computer error had caused the problem.", "Anna had already paid a deposit weeks earlier, so she was very frustrated.", "Luckily, the hotel had a similar room available at a partner hotel nearby.", "They accepted the offer once the manager promised to upgrade them for free.", "Their new room turned out to be en-suite with a beautiful view.", "That evening, they ordered room service instead of going out.", "The next morning, they requested a wake-up call for six o'clock.", "Despite the rocky start, they really enjoyed the hotel's amenities."],
  "questions": [
    { "prompt": "What did Anna and Ravi discover when they arrived?", "options": ["The hotel had closed", "The hotel had been overbooked", "Their room was ready early"], "answerIndex": 1, "explanation": "Im Text: 'they discovered it had been overbooked.'" },
    { "prompt": "What had caused the problem, according to the manager?", "options": ["A computer error", "A staff mistake", "Bad weather"], "answerIndex": 0, "explanation": "Im Text: 'a computer error had caused the problem.'" },
    { "prompt": "Why was Anna especially frustrated?", "options": ["She had already paid a deposit", "She had travelled a long way", "She had complained before"], "answerIndex": 0, "explanation": "Im Text: 'Anna had already paid a deposit weeks earlier.'" },
    { "prompt": "What did the hotel have available?", "options": ["A similar room at a partner hotel", "No solution at all", "A refund only"], "answerIndex": 0, "explanation": "Im Text: 'the hotel had a similar room available at a partner hotel.'" },
    { "prompt": "What convinced them to accept the offer?", "options": ["A free upgrade", "A discount voucher", "A free dinner"], "answerIndex": 0, "explanation": "Im Text: 'the manager promised to upgrade them for free.'" },
    { "prompt": "What was special about their new room?", "options": ["It was very small", "It was en-suite with a beautiful view", "It had no windows"], "answerIndex": 1, "explanation": "Im Text: 'their new room turned out to be en-suite with a beautiful view.'" },
    { "prompt": "What did they do that evening?", "options": ["Went out to a restaurant", "Ordered room service", "Went straight to bed"], "answerIndex": 1, "explanation": "Im Text: 'they ordered room service instead of going out.'" },
    { "prompt": "What did they request for the next morning?", "options": ["Breakfast in bed", "A wake-up call for six oclock", "A late check-out"], "answerIndex": 1, "explanation": "Im Text: 'they requested a wake-up call for six o'clock.'" },
    { "prompt": "How did they feel about the hotel overall?", "options": ["They regretted staying there", "They really enjoyed the amenities", "They wanted a refund"], "answerIndex": 1, "explanation": "Im Text: 'they really enjoyed the hotel's amenities.'" }
  ]
});

defineWeekField('week02', "Reisen & Unterwegs", 4, 'listening', {
  "title": "Leo's Road Trip Mishap",
  "sentences": ["Leo rented a car for a week-long road trip through the mountains.", "At the counter, he had to show his driving licence and a credit card.", "The clerk reminded him about the insurance excess before he signed anything.", "On the second day, Leo forgot to fill up the tank before a long stretch of road.", "Halfway through the mountains, the car suddenly had a breakdown.", "Luckily, another driver stopped and gave way so Leo could pull over safely.", "A mechanic arrived within an hour and fixed the problem quickly.", "Leo later admitted he had also ignored the speed limit earlier that day.", "From then on, he checked the fuel and the signs much more carefully."],
  "questions": [
    { "prompt": "What kind of trip was Leo planning?", "options": ["A week-long road trip through the mountains", "A short city break", "A train journey"], "answerIndex": 0, "explanation": "Im Text: 'Leo rented a car for a week-long road trip through the mountains.'" },
    { "prompt": "What did Leo have to show at the counter?", "options": ["His passport only", "His driving licence and a credit card", "His hotel booking"], "answerIndex": 1, "explanation": "Im Text: 'he had to show his driving licence and a credit card.'" },
    { "prompt": "What did the clerk remind him about?", "options": ["The insurance excess", "The toll roads", "The speed limit"], "answerIndex": 0, "explanation": "Im Text: 'The clerk reminded him about the insurance excess.'" },
    { "prompt": "What did Leo forget to do on the second day?", "options": ["Lock the car", "Fill up the tank", "Check the mirrors"], "answerIndex": 1, "explanation": "Im Text: 'Leo forgot to fill up the tank.'" },
    { "prompt": "What happened halfway through the mountains?", "options": ["The car had a breakdown", "He got lost", "He ran out of money"], "answerIndex": 0, "explanation": "Im Text: 'the car suddenly had a breakdown.'" },
    { "prompt": "How did Leo manage to pull over safely?", "options": ["Another driver gave way", "The police stopped traffic", "He drove very slowly"], "answerIndex": 0, "explanation": "Im Text: 'another driver stopped and gave way.'" },
    { "prompt": "How long did it take the mechanic to arrive?", "options": ["Within an hour", "The whole day", "He never came"], "answerIndex": 0, "explanation": "Im Text: 'A mechanic arrived within an hour.'" },
    { "prompt": "What did Leo admit he had also done?", "options": ["Forgotten his licence", "Ignored the speed limit", "Missed a toll payment"], "answerIndex": 1, "explanation": "Im Text: 'he had also ignored the speed limit.'" },
    { "prompt": "What did Leo do differently afterwards?", "options": ["He stopped driving completely", "He checked the fuel and signs more carefully", "He returned the car early"], "answerIndex": 1, "explanation": "Im Text: 'he checked the fuel and the signs much more carefully.'" }
  ]
});

defineWeekField('week02', "Reisen & Unterwegs", 5, 'listening', {
  "title": "The Overrated Landmark",
  "sentences": ["Sofia had read that the city's most famous landmark was breathtaking.", "When she arrived, however, she found it surrounded by crowds and tourist traps.", "A local suggested she visit a quieter spot slightly off the beaten track instead.", "Sofia decided it was worth trying, even though she had little time left.", "The hidden gem turned out to be a small hill with an incredible view.", "She joined a short guided tour that explained the area's history.", "The guide explained that the famous landmark was actually quite overrated.", "Sofia agreed that the quieter spot had been far more impressive.", "She left the city convinced that the best places aren't always the most famous ones."],
  "questions": [
    { "prompt": "What had Sofia read about the famous landmark?", "options": ["It was breathtaking", "It was closed", "It was free"], "answerIndex": 0, "explanation": "Im Text: 'the city's most famous landmark was breathtaking.'" },
    { "prompt": "What did she find when she arrived?", "options": ["An empty square", "Crowds and tourist traps", "A guided tour"], "answerIndex": 1, "explanation": "Im Text: 'she found it surrounded by crowds and tourist traps.'" },
    { "prompt": "What did a local suggest?", "options": ["Skipping the city", "A quieter spot off the beaten track", "Visiting another city"], "answerIndex": 1, "explanation": "Im Text: 'A local suggested she visit a quieter spot slightly off the beaten track.'" },
    { "prompt": "Why did Sofia decide to try it?", "options": ["She had plenty of time", "She thought it was worth it despite little time", "A friend forced her"], "answerIndex": 1, "explanation": "Im Text: 'Sofia decided it was worth trying, even though she had little time left.'" },
    { "prompt": "What was the hidden gem?", "options": ["A museum", "A small hill with an incredible view", "A famous cathedral"], "answerIndex": 1, "explanation": "Im Text: 'The hidden gem turned out to be a small hill with an incredible view.'" },
    { "prompt": "What did Sofia join?", "options": ["A short guided tour", "A boat trip", "A cooking class"], "answerIndex": 0, "explanation": "Im Text: 'She joined a short guided tour.'" },
    { "prompt": "What did the guide say about the famous landmark?", "options": ["It was the best in the country", "It was actually quite overrated", "It was recently rebuilt"], "answerIndex": 1, "explanation": "Im Text: 'the famous landmark was actually quite overrated.'" },
    { "prompt": "What did Sofia think about the quieter spot?", "options": ["It was disappointing", "It was far more impressive", "It was too far away"], "answerIndex": 1, "explanation": "Im Text: 'the quieter spot had been far more impressive.'" },
    { "prompt": "What was Sofia convinced of when she left?", "options": ["The famous landmark was worth the crowds", "The best places aren't always the most famous", "She should never travel alone"], "answerIndex": 1, "explanation": "Im Text: 'the best places aren't always the most famous ones.'" }
  ]
});

defineWeekField('week02', "Reisen & Unterwegs", 6, 'listening', {
  "title": "Stranded in a Storm",
  "sentences": ["Chloe's flight home was suddenly cancelled because of a severe storm.", "She quickly realised she was going to be stranded at the airport overnight.", "To make things worse, she noticed her wallet was missing from her bag.", "She reported the theft to airport security straight away.", "A stranger then offered to help her find a cheap hotel nearby.", "Chloe later discovered the whole offer had been a clever scam.", "Luckily, she contacted her embassy, who helped her get replacement documents.", "The airline eventually agreed to reimburse her for the extra hotel costs.", "Despite the chaos, Chloe made it home safely two days later."],
  "questions": [
    { "prompt": "Why was Chloe's flight cancelled?", "options": ["A severe storm", "A technical fault", "A strike"], "answerIndex": 0, "explanation": "Im Text: 'suddenly cancelled because of a severe storm.'" },
    { "prompt": "What did Chloe realise she would have to do?", "options": ["Fly the next morning", "Be stranded at the airport overnight", "Take a train instead"], "answerIndex": 1, "explanation": "Im Text: 'she was going to be stranded at the airport overnight.'" },
    { "prompt": "What did Chloe notice was missing?", "options": ["Her wallet", "Her passport", "Her phone"], "answerIndex": 0, "explanation": "Im Text: 'she noticed her wallet was missing.'" },
    { "prompt": "What did she do about the theft?", "options": ["Ignored it", "Reported it to airport security", "Called her bank only"], "answerIndex": 1, "explanation": "Im Text: 'She reported the theft to airport security.'" },
    { "prompt": "What did a stranger offer to help with?", "options": ["Finding a cheap hotel", "Fixing her flight", "Lending her money"], "answerIndex": 0, "explanation": "Im Text: 'A stranger then offered to help her find a cheap hotel.'" },
    { "prompt": "What did Chloe later discover about the offer?", "options": ["It was genuine", "It was a scam", "It was too expensive"], "answerIndex": 1, "explanation": "Im Text: 'the whole offer had been a clever scam.'" },
    { "prompt": "Who helped Chloe get replacement documents?", "options": ["Her embassy", "The airline", "A stranger"], "answerIndex": 0, "explanation": "Im Text: 'she contacted her embassy, who helped her get replacement documents.'" },
    { "prompt": "What did the airline eventually agree to do?", "options": ["Refuse to help", "Reimburse her for extra hotel costs", "Cancel her ticket"], "answerIndex": 1, "explanation": "Im Text: 'The airline eventually agreed to reimburse her.'" },
    { "prompt": "When did Chloe make it home?", "options": ["The same day", "Two days later", "A week later"], "answerIndex": 1, "explanation": "Im Text: 'Chloe made it home safely two days later.'" }
  ]
});

