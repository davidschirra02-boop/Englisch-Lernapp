/* Bewertung von Satzübersetzungs-Antworten (type: 'translate' in js/quizEngine.js).
   Eigenständiges Modul ohne Abhängigkeiten zu anderen js/*-Dateien, damit
   künftige Änderungen an der Übersetzungs-Bewertung nur diese eine Datei
   betreffen. Toleriert Tippfehler (kleine Zeichen-Abweichung an höchstens
   2 Wörtern) als richtig und liefert bei echten Fehlern eine konkrete
   Wort-Diff-Erklärung statt nur die Musterlösung zu wiederholen. */

const TranslationCheck = (function () {
  function normalize(s) {
    return s.trim().toLowerCase().replace(/[.!?]+$/, '').replace(/\s+/g, ' ');
  }

  function tokenize(s) {
    return normalize(s)
      .split(' ')
      .filter(Boolean)
      .map(w => w.replace(/^["',.!?;:()]+|["',.!?;:()]+$/g, ''));
  }

  function charLevenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m][n];
  }

  // Kleine Zeichen-Abweichung relativ zur Wortlänge = wahrscheinlich Tippfehler,
  // kein falsches Wort.
  function isTypo(userWord, targetWord) {
    const d = charLevenshtein(userWord, targetWord);
    if (d === 0) return false;
    // Reine An-/Abwesenheit einer Flexionsendung (-s/-es/-ed/-ing) ist ein
    // Grammatikfehler, kein Tippfehler, und soll nicht stillschweigend als
    // richtig durchgehen, sondern eine echte Erklärung bekommen.
    const [shorter, longer] = userWord.length <= targetWord.length ? [userWord, targetWord] : [targetWord, userWord];
    if (longer.startsWith(shorter) && ['s', 'es', 'd', 'ed', 'ing'].includes(longer.slice(shorter.length))) {
      return false;
    }
    return d <= Math.max(1, Math.ceil(targetWord.length * 0.3));
  }

  // Wort-Ebene Edit-Distanz (klassisches Levenshtein-DP) mit Backtrace, damit
  // genau erkennbar ist, welche Wörter ersetzt/eingefügt/weggelassen wurden.
  function alignTokens(userTokens, targetTokens) {
    const m = userTokens.length, n = targetTokens.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = userTokens[i - 1] === targetTokens[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    const ops = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && userTokens[i - 1] === targetTokens[j - 1]) {
        ops.push({ type: 'match', user: userTokens[i - 1], target: targetTokens[j - 1] });
        i--; j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        ops.push({ type: 'sub', user: userTokens[i - 1], target: targetTokens[j - 1] });
        i--; j--;
      } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        ops.push({ type: 'ins', user: userTokens[i - 1], target: null });
        i--;
      } else {
        ops.push({ type: 'del', user: null, target: targetTokens[j - 1] });
        j--;
      }
    }
    ops.reverse();
    return { distance: dp[m][n], ops };
  }

  // Kleine Formentabelle häufiger (meist unregelmäßiger) Verben, damit bei
  // falschen Antworten die Zeitform benannt werden kann statt nur "anders".
  const VERB_FORMS = {
    be: { present: ['am', 'is', 'are'], past: ['was', 'were'], perfect: ['been'] },
    have: { present: ['have', 'has'], past: ['had'], perfect: ['had'] },
    do: { present: ['do', 'does'], past: ['did'], perfect: ['done'] },
    go: { present: ['go', 'goes'], past: ['went'], perfect: ['gone'] },
    see: { present: ['see', 'sees'], past: ['saw'], perfect: ['seen'] },
    eat: { present: ['eat', 'eats'], past: ['ate'], perfect: ['eaten'] },
    take: { present: ['take', 'takes'], past: ['took'], perfect: ['taken'] },
    write: { present: ['write', 'writes'], past: ['wrote'], perfect: ['written'] },
    come: { present: ['come', 'comes'], past: ['came'], perfect: ['come'] },
    give: { present: ['give', 'gives'], past: ['gave'], perfect: ['given'] },
    get: { present: ['get', 'gets'], past: ['got'], perfect: ['gotten', 'got'] },
    make: { present: ['make', 'makes'], past: ['made'], perfect: ['made'] },
    say: { present: ['say', 'says'], past: ['said'], perfect: ['said'] },
    know: { present: ['know', 'knows'], past: ['knew'], perfect: ['known'] },
    think: { present: ['think', 'thinks'], past: ['thought'], perfect: ['thought'] },
    find: { present: ['find', 'finds'], past: ['found'], perfect: ['found'] },
    tell: { present: ['tell', 'tells'], past: ['told'], perfect: ['told'] },
    become: { present: ['become', 'becomes'], past: ['became'], perfect: ['become'] },
    leave: { present: ['leave', 'leaves'], past: ['left'], perfect: ['left'] },
    feel: { present: ['feel', 'feels'], past: ['felt'], perfect: ['felt'] },
    bring: { present: ['bring', 'brings'], past: ['brought'], perfect: ['brought'] },
    buy: { present: ['buy', 'buys'], past: ['bought'], perfect: ['bought'] },
    catch: { present: ['catch', 'catches'], past: ['caught'], perfect: ['caught'] },
    teach: { present: ['teach', 'teaches'], past: ['taught'], perfect: ['taught'] },
    meet: { present: ['meet', 'meets'], past: ['met'], perfect: ['met'] },
    keep: { present: ['keep', 'keeps'], past: ['kept'], perfect: ['kept'] },
    hold: { present: ['hold', 'holds'], past: ['held'], perfect: ['held'] },
    run: { present: ['run', 'runs'], past: ['ran'], perfect: ['run'] },
    break: { present: ['break', 'breaks'], past: ['broke'], perfect: ['broken'] },
    speak: { present: ['speak', 'speaks'], past: ['spoke'], perfect: ['spoken'] },
    drive: { present: ['drive', 'drives'], past: ['drove'], perfect: ['driven'] },
    begin: { present: ['begin', 'begins'], past: ['began'], perfect: ['begun'] },
    fall: { present: ['fall', 'falls'], past: ['fell'], perfect: ['fallen'] },
    grow: { present: ['grow', 'grows'], past: ['grew'], perfect: ['grown'] },
    hear: { present: ['hear', 'hears'], past: ['heard'], perfect: ['heard'] },
    lose: { present: ['lose', 'loses'], past: ['lost'], perfect: ['lost'] },
    sell: { present: ['sell', 'sells'], past: ['sold'], perfect: ['sold'] },
    send: { present: ['send', 'sends'], past: ['sent'], perfect: ['sent'] },
    spend: { present: ['spend', 'spends'], past: ['spent'], perfect: ['spent'] },
    understand: { present: ['understand', 'understands'], past: ['understood'], perfect: ['understood'] },
    stand: { present: ['stand', 'stands'], past: ['stood'], perfect: ['stood'] },
    sit: { present: ['sit', 'sits'], past: ['sat'], perfect: ['sat'] },
    win: { present: ['win', 'wins'], past: ['won'], perfect: ['won'] },
    build: { present: ['build', 'builds'], past: ['built'], perfect: ['built'] }
  };
  const FORM_INDEX = {};
  // Reihenfolge bewusst present, perfect, past: bei vielen unregelmäßigen
  // Verben ist die Partizip-Perfekt-Form mit dem Präteritum identisch (z.B.
  // "told"); da einfache Vergangenheit in den Übungssätzen weit häufiger
  // vorkommt als Perfektzeiten, soll bei einer Doppel-Form "past" gewinnen.
  Object.keys(VERB_FORMS).forEach(base => {
    const forms = VERB_FORMS[base];
    ['present', 'perfect', 'past'].forEach(tense => {
      (forms[tense] || []).forEach(form => { FORM_INDEX[form] = { base, tense }; });
    });
  });
  // verneinte/kontrahierte Hilfsverbformen gehören zu keiner der obigen Listen,
  // tauchen aber häufig als falsche Zeitform auf
  Object.assign(FORM_INDEX, {
    "isn't": { base: 'be', tense: 'present' }, "aren't": { base: 'be', tense: 'present' },
    "wasn't": { base: 'be', tense: 'past' }, "weren't": { base: 'be', tense: 'past' },
    "don't": { base: 'do', tense: 'present' }, "doesn't": { base: 'do', tense: 'present' },
    "didn't": { base: 'do', tense: 'past' },
    "haven't": { base: 'have', tense: 'present' }, "hasn't": { base: 'have', tense: 'present' },
    "hadn't": { base: 'have', tense: 'past' }
  });

  const PREPOSITIONS = new Set(['in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'into', 'onto', 'about', 'under', 'over', 'between', 'among', 'during', 'since', 'through', 'across', 'against', 'along', 'around', 'before', 'after', 'behind', 'below', 'beneath', 'beside', 'beyond', 'despite', 'except', 'inside', 'near', 'outside', 'past', 'than', 'toward', 'towards', 'upon', 'within', 'without']);
  const ARTICLES = new Set(['a', 'an', 'the']);

  // Erklärt in Alltagssprache, WARUM eine Verbform an dieser Stelle richtig
  // ist - bewusst OHNE grammatikalische Fachbegriffe (keine Namen wie
  // "Präteritum"/"Partizip Perfekt"/"3. Person Singular"), sondern über den
  // eigentlichen Grund (wann/wie die Handlung passiert bzw. wer sie tut).
  function tenseReason(userTense, targetTense) {
    if (targetTense === 'past' && userTense !== 'past') {
      return 'weil das, wovon hier die Rede ist, schon abgeschlossen in der Vergangenheit passiert ist, nicht gerade jetzt oder allgemein';
    }
    if (targetTense === 'present' && userTense !== 'present') {
      return 'weil hier nicht von etwas bereits Abgeschlossenem die Rede ist, sondern von etwas, das gerade oder generell der Fall ist';
    }
    if (targetTense === 'perfect') {
      return 'weil hier eine Handlung gemeint ist, die zu einem bestimmten Zeitpunkt schon erledigt war - dafür braucht man diese Verbform, meist zusammen mit einem kleinen Wort wie "have"/"has"/"had" davor';
    }
    return 'weil der Satz zeitlich etwas anderes ausdrückt, als du geschrieben hast';
  }

  // Liefert für einen einzelnen sub-Diff (falsches statt richtiges Wort)
  // nicht nur, WAS anders ist, sondern möglichst WARUM - Zeitbezug,
  // Endung, Präposition oder Artikel statt reiner Wortnennung.
  function explainSub(o) {
    const u = o.user, t = o.target;
    if (isTypo(u, t)) return `'${u}' → '${t}'`;

    const ui = FORM_INDEX[u], ti = FORM_INDEX[t];
    if (ti && (ui ? ui.base === ti.base : u === ti.base)) {
      if (ui && ui.tense === ti.tense) {
        return `statt "${t}" hast du "${u}" geschrieben – bei diesem Verb ändert sich die Form je nachdem, wer die Handlung ausführt: nach "er/sie/es" kommt am Ende ein zusätzliches -s dazu.`;
      }
      return `statt "${t}" hast du "${u}" geschrieben – ${tenseReason(ui ? ui.tense : null, ti.tense)}.`;
    }
    if (/ed$/.test(t) && !/ed$/.test(u) && t.slice(0, -2) === u) {
      return `statt "${t}" hast du "${u}" geschrieben – am Ende fehlt -ed, weil das, wovon hier die Rede ist, schon abgeschlossen in der Vergangenheit passiert ist, nicht gerade jetzt.`;
    }
    if (t.endsWith('s') && t.slice(0, -1) === u) {
      return `statt "${t}" hast du "${u}" geschrieben – am Ende fehlt ein -s: bei Verben passiert das, wenn "er/sie/es" die Handlung ausführt, bei anderen Wörtern zeigt ein -s die Mehrzahl an.`;
    }
    if (u.endsWith('s') && u.slice(0, -1) === t) {
      return `statt "${t}" hast du "${u}" geschrieben – hier braucht es kein -s am Ende, weil weder "er/sie/es" die Handlung ausführt noch die Mehrzahl gemeint ist.`;
    }
    if (/ing$/.test(t) && !/ing$/.test(u) && (t.slice(0, -3) === u || t.slice(0, -3) === u.replace(/e$/, ''))) {
      return `statt "${t}" hast du "${u}" geschrieben – am Ende fehlt -ing, weil hier eine Handlung gemeint ist, die gerade läuft bzw. läuft, während etwas anderes passiert - nicht eine einmalige, abgeschlossene Handlung.`;
    }
    if ((u === 'a' && t === 'an') || (u === 'an' && t === 'a')) {
      return `statt "${t}" hast du "${u}" geschrieben – "an" benutzt man vor einem Wort, das mit einem gesprochenen Vokal beginnt (a/e/i/o/u-Laut), "a" vor allen anderen.`;
    }
    if (ARTICLES.has(u) && ARTICLES.has(t)) {
      return t === 'the'
        ? `statt "${t}" hast du "${u}" geschrieben – "the" braucht es hier, weil von einer bestimmten, bereits bekannten Sache die Rede ist.`
        : `statt "${t}" hast du "${u}" geschrieben – hier ist von einer unbestimmten Sache die Rede, deshalb "${t}" statt "the".`;
    }
    if (PREPOSITIONS.has(u) && PREPOSITIONS.has(t)) {
      return `statt "${t}" hast du "${u}" geschrieben – diese Wendung braucht im Englischen fest das Wort "${t}" an dieser Stelle. Das folgt keiner festen Regel, sondern muss als feste Verbindung gelernt werden.`;
    }
    return `statt "${t}" hast du "${u}" geschrieben – das ist ein anderes Wort mit anderer Bedeutung, inhaltlich passt hier nur "${t}".`;
  }

  function explainDel(o) {
    const t = o.target;
    if (ARTICLES.has(t)) return `"${t}" fehlt in deinem Satz – den Artikel "${t}" darfst du hier nicht weglassen.`;
    if (t === 'to') return `"${t}" fehlt in deinem Satz – vor der Grundform eines Verbs (z. B. "to go", "to see") braucht es im Englischen oft dieses "to" davor.`;
    return `"${t}" fehlt in deinem Satz – ohne dieses Wort ist der Satz unvollständig bzw. nicht korrekt.`;
  }

  function explainIns(o) {
    return `"${o.user}" ist zu viel – dieses Wort passt hier nicht in den Satz, streiche es.`;
  }

  function describeDiff(ops) {
    const parts = [];
    ops.forEach(o => {
      if (o.type === 'sub') parts.push(explainSub(o));
      else if (o.type === 'del') parts.push(explainDel(o));
      else if (o.type === 'ins') parts.push(explainIns(o));
    });
    return parts.join(' ');
  }

  // Bewertet userText gegen alle akzeptierten Formulierungen aus item.answer
  // und liefert die Einstufung samt Diagnose zur nächstliegenden Variante.
  function classify(userText, item) {
    const userTokens = tokenize(userText);
    const variants = Array.isArray(item.answer) ? item.answer : [item.answer];

    let best = null;
    variants.forEach(variant => {
      const targetTokens = tokenize(variant);
      const { distance, ops } = alignTokens(userTokens, targetTokens);
      if (!best || distance < best.distance) best = { distance, ops, closest: variant };
    });

    if (best.distance === 0) {
      return { tier: 'exact', closest: best.closest, ops: best.ops };
    }

    const subs = best.ops.filter(o => o.type === 'sub');
    const insDel = best.ops.filter(o => o.type === 'ins' || o.type === 'del');
    const allTypos = subs.length > 0 && subs.every(o => isTypo(o.user, o.target));

    if (insDel.length === 0 && subs.length > 0 && subs.length <= 2 && allTypos) {
      return { tier: 'close-typo', closest: best.closest, ops: best.ops };
    }
    return { tier: 'wrong', closest: best.closest, ops: best.ops };
  }

  return { classify, describeDiff };
})();
