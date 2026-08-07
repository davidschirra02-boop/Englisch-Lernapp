/* Konversationstrainer: verzweigter Dialog mit Korrektur bei Fehlwahl.
   Antwortoptionen werden bei jeder Anzeige neu gemischt, damit die
   richtige Antwort nicht an einer vorhersehbaren Position steht. */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const RenderConversation = {
  run(container, conv, onComplete) {
    const log = [];
    let nodeKey = conv.start;

    function draw() {
      const node = conv.nodes[nodeKey];
      const logHtml = log.map(entry => `<div class="bubble ${entry.cls}">${entry.text}</div>`).join('');

      if (node.end) {
        container.innerHTML = `
          <p class="muted" style="margin-bottom:12px;">${conv.situation}</p>
          <div class="chat-log">${logHtml}<div class="bubble them">${node.them}</div></div>
          <button class="btn" id="conv-continue">Weiter →</button>
        `;
        container.querySelector('#conv-continue').addEventListener('click', onComplete);
        return;
      }

      const shuffled = shuffle(node.choices);

      container.innerHTML = `
        <p class="muted" style="margin-bottom:12px;">${conv.situation}</p>
        <div class="chat-log">${logHtml}<div class="bubble them">${node.them}</div></div>
        <div class="choice-list" id="conv-choices">
          ${shuffled.map((c, i) => `<button class="choice" data-i="${i}">${c.text}</button>`).join('')}
        </div>
      `;

      container.querySelectorAll('#conv-choices .choice').forEach(btn => {
        btn.addEventListener('click', () => {
          const choice = shuffled[Number(btn.dataset.i)];
          if (choice.correct) {
            log.push({ cls: 'them', text: node.them });
            log.push({ cls: 'me', text: choice.text });
            nodeKey = node.next;
            draw();
          } else {
            btn.classList.add('incorrect');
            container.querySelectorAll('#conv-choices .choice').forEach(b => b.disabled = true);
            const feedback = document.createElement('div');
            feedback.className = 'bubble hint';
            feedback.textContent = '💡 ' + choice.feedback;
            container.querySelector('#conv-choices').after(feedback);
            const retry = document.createElement('button');
            retry.className = 'btn ghost';
            retry.style.marginTop = '14px';
            retry.textContent = 'Nochmal versuchen';
            retry.addEventListener('click', draw);
            feedback.after(retry);
          }
        });
      });
    }

    draw();
  }
};
