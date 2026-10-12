// ============================================================
// WR1 – Grundbegriffe der Wahrscheinlichkeitsrechnung
// ============================================================

var wr1S = null;

function wr1Shuf(a) {
  var b = a.slice();
  for (var i = b.length - 1; i > 0; i--) {
    var j = 0 | (Math.random() * (i + 1));
    var t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}

function wr1Hdr(title) {
  var lv = G.selectedLevel;
  return '<div class="mini-header" style="border-color:' + lv.color + '">'
    + '<span style="font-size:18px">' + lv.icon + '</span>&nbsp;' + title
    + '<span class="coin-display">&#128176; ' + G.coins + '</span>'
    + '<button class="rbtn" onclick="openLevelSelect(G.selectedLevel)">Zurück</button>'
    + '</div>';
}

function wr1Reward() {
  var id = wr1S.id, r = 50;
  G.selectedLevel.games.forEach(function(g) { if (g.id === id) r = g.reward; });
  return r;
}

function wr1Open(id) {
  G.screen = 'minigame';
  if (id === 'wr1q1') wr1InitQ1();
  else wr1InitQuiz(id);
}

// ── Q1: Kolmogorov (2-teilig) ─────────────────────────────────

function wr1InitQ1() {
  wr1S = {
    id: 'wr1q1',
    step: 1,
    axioms: wr1Shuf([
      { t: '0 ≤ P(A) ≤ 1 für alle Ereignisse A',                           ok: true  },
      { t: 'P(Ω) = 1',                                                                ok: true  },
      { t: 'Sind A₁, A₂, … paarweise disjunkt, dann gilt P(A₁∪A₂∪…) = P(A₁)+P(A₂)+… = Σ P(Aₖ)', ok: true  },
      { t: 'P(A∩B) = P(A)·P(B) für alle Ereignisse A, B',                  ok: false },
      { t: 'P(Aᶜ) = 1 − P(A) für alle Ereignisse A',                       ok: false },
    ]),
    dists: wr1Shuf([
      { lbl: 'V1', p: [ 0.5,  0.3,  0.2], ok: true  },
      { lbl: 'V2', p: [ 0.6,  0.5,  0.1], ok: false },
      { lbl: 'V3', p: [ 0.7,  0.4, -0.1], ok: false },
    ]),
  };
  wr1S.axiomSel = wr1S.axioms.map(function() { return false; });
  wr1S.distSel  = wr1S.dists.map(function()  { return null;  });
  wr1RenderQ1();
}

function wr1RenderQ1() {
  var s = wr1S, body = '';

  if (s.step === 1) {
    body += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
    body += '<span style="font-size:8px;color:#ffd700">Kolmogorov-Axiome</span>';
    body += '<span style="font-size:7px;color:#454575;letter-spacing:2px">1 / 2</span></div>';
    body += '<div style="height:3px;background:#111128;margin-bottom:16px">'
          + '<div style="width:50%;height:100%;background:#4a90d9"></div></div>';

    body += '<div style="background:#08081a;border:2px solid #252560;padding:18px 20px;margin-bottom:16px;text-align:center">';
    body += '<div style="font-size:24px;color:#ffd700;line-height:1.5;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:0.5px">Gehören zu den Kolmogorov-Axiomen?</div>';
    body += '<div style="font-size:13px;color:#6060a8;margin-top:10px;font-family:Arial,sans-serif">Mehrere Antworten möglich</div>';
    body += '</div>';

    body += '<div style="flex:1;display:flex;flex-direction:column;gap:8px;margin-bottom:16px">';
    s.axioms.forEach(function(o, i) {
      var on = s.axiomSel[i];
      body += '<div onclick="wr1TogAxiom(' + i + ')" style="flex:1;cursor:pointer;padding:0 20px;border:2px solid '
        + (on ? '#4a90d9' : '#252550') + ';background:' + (on ? '#091828' : '#0b0b1e')
        + ';font-size:8px;color:' + (on ? '#ffffff' : '#d0d0f0') + ';display:flex;align-items:center;gap:18px">'
        + '<div style="width:18px;height:18px;flex-shrink:0;border:2px solid '
        + (on ? '#4a90d9' : '#4040a0') + ';background:' + (on ? '#4a90d9' : 'transparent')
        + ';display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff">'
        + (on ? '✓' : '') + '</div>'
        + '<span style="font-family:Arial,sans-serif;font-size:18px">' + o.t + '</span></div>';
    });
    body += '</div>';

    body += '<button class="rbtn action-btn" onclick="wr1S.step=2;wr1RenderQ1()" style="width:100%;padding:15px 0;font-size:8px">Weiter →</button>';

  } else if (s.step === 2) {
    body += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">';
    body += '<span style="font-size:7px;color:#454575;letter-spacing:2px">2 / 2</span></div>';
    body += '<div style="height:3px;background:#111128;margin-bottom:28px">'
          + '<div style="width:100%;height:100%;background:#4a90d9"></div></div>';

    body += '<div style="background:#08081a;border:2px solid #252560;padding:18px 20px;margin-bottom:16px;text-align:center">';
    body += '<div style="font-size:24px;color:#ffd700;line-height:1.5;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:0.5px">Welche Verteilungen erfüllen die Kolmogorov-Axiome?</div>';
    body += '<div style="font-size:13px;color:#6060a8;margin-top:10px;font-family:Arial,sans-serif">Wähle ✓ oder ✗ für jede Verteilung</div>';
    body += '</div>';

    body += '<div style="flex:1;display:flex;flex-direction:column;gap:10px;margin-bottom:16px">';
    s.dists.forEach(function(d, i) {
      var v = s.distSel[i];
      body += '<div style="flex:1;border:2px solid #252550;padding:0 20px;background:#0b0b1e;display:flex;align-items:center;gap:18px">';
      body += '<span style="font-size:16px;color:#ffd700;min-width:36px;font-family:Arial,sans-serif;font-weight:bold">' + d.lbl + '</span>';
      body += '<div style="flex:1;font-size:16px;font-family:Arial,sans-serif">';
      d.p.forEach(function(val, j) {
        body += '<span style="color:#c0c0e8;margin-right:20px">ω' + (j+1) + ' = ' + val + '</span>';
      });
      body += '</div>';
      body += '<div style="display:flex;gap:8px">';
      body += '<button onclick="wr1SelDist(' + i + ',1)" style="width:42px;height:42px;cursor:pointer;font-family:inherit;font-size:18px;border:2px solid '
        + (v === 1 ? '#50c050' : '#1a3a1a') + ';background:' + (v === 1 ? '#0c260c' : '#090d09')
        + ';color:' + (v === 1 ? '#50c050' : '#254025') + '">✓</button>';
      body += '<button onclick="wr1SelDist(' + i + ',0)" style="width:42px;height:42px;cursor:pointer;font-family:inherit;font-size:18px;border:2px solid '
        + (v === 0 ? '#c05050' : '#3a1a1a') + ';background:' + (v === 0 ? '#260c0c' : '#0d0909')
        + ';color:' + (v === 0 ? '#c05050' : '#402525') + '">✗</button>';
      body += '</div></div>';
    });
    body += '</div>';

    var allDone = s.distSel.every(function(v) { return v !== null; });
    body += '<div style="display:flex;gap:10px">';
    body += '<button class="rbtn" onclick="wr1S.step=1;wr1RenderQ1()" style="flex:1;padding:15px 0">← Zurück</button>';
    if (allDone) body += '<button class="rbtn action-btn" onclick="wr1S.step=3;wr1RenderQ1()" style="flex:2;padding:15px 0">Auswerten</button>';
    body += '</div>';

  } else {
    var axScore = s.axioms.reduce(function(n, o, i) { return n + (s.axiomSel[i] === o.ok ? 1 : 0); }, 0);
    var dtScore = s.dists.reduce(function(n, d, i)  { return n + ((s.distSel[i] === 1) === d.ok ? 1 : 0); }, 0);
    var total = axScore + dtScore, max = s.axioms.length + s.dists.length;
    var stars = total >= max ? 3 : total >= Math.ceil(max * 0.6) ? 2 : total >= 1 ? 1 : 0;

    body += '<div style="text-align:center;padding:28px 0 32px">';
    body += '<div style="font-size:44px;margin-bottom:16px">' + ['❌', '⭐', '⭐⭐', '⭐⭐⭐'][stars] + '</div>';
    body += '<div style="font-size:13px;color:#ffd700">' + total + ' / ' + max + ' richtig</div>';
    body += '</div>';

    body += '<div style="font-size:7px;color:#404070;letter-spacing:2px;margin-bottom:10px">AXIOME</div>';
    s.axioms.forEach(function(o, i) {
      var hit = s.axiomSel[i] === o.ok;
      body += '<div style="border-left:3px solid ' + (hit ? '#50c050' : '#c05050') + ';padding:10px 16px;margin-bottom:8px;background:' + (hit ? '#060e06' : '#0e0606') + '">';
      body += '<div style="font-size:7px;color:' + (hit ? '#50c050' : '#c05050') + ';line-height:1.9">' + (hit ? '✓ ' : '✗ ') + o.t + '</div>';
      body += '</div>';
    });

    body += '<div style="font-size:7px;color:#404070;letter-spacing:2px;margin:18px 0 10px">VERTEILUNGEN</div>';
    s.dists.forEach(function(d, i) {
      var hit = (s.distSel[i] === 1) === d.ok;
      var sum = d.p.reduce(function(a, b) { return a + b; }, 0);
      var hasNeg = d.p.some(function(v) { return v < 0; });
      var why = d.ok ? 'Summe = 1, alle ≥ 0' : hasNeg ? 'Neg. Wkeit!' : 'Summe = ' + Math.round(sum*10)/10 + ' ≠ 1';
      body += '<div style="border-left:3px solid ' + (hit ? '#50c050' : '#c05050') + ';padding:10px 16px;margin-bottom:8px;background:' + (hit ? '#060e06' : '#0e0606') + '">';
      body += '<div style="font-size:7px;color:' + (hit ? '#50c050' : '#c05050') + ';line-height:1.9">' + (hit ? '✓ ' : '✗ ') + d.lbl + ': ' + why + '</div>';
      body += '</div>';
    });

    body += '<button class="rbtn action-btn" onclick="completeMiniGame(\'wr1q1\',' + stars + ',' + wr1Reward() + ')" style="width:100%;margin-top:18px;padding:15px 0">Abschließen &#128176;</button>';
  }

  showMiniUI(
    '<div class="mini-screen">' + wr1Hdr('Kolmogorov-Axiome')
    + '<div style="flex:1;display:flex;flex-direction:column;padding:22px 32px;overflow-y:auto">' + body + '</div></div>'
  );
}

function wr1TogAxiom(i) { wr1S.axiomSel[i] = !wr1S.axiomSel[i]; wr1RenderQ1(); }
function wr1SelDist(i, v) { wr1S.distSel[i] = v; wr1RenderQ1(); }

// ── Q2–Q5: Sequenzielles Quiz ─────────────────────────────────

var WR1_DATA = {
  wr1q2: {
    name: 'Ergebnismenge & Ereignisse',
    qs: [
      {
        q: 'Was ist die Ergebnismenge Ω eines Zufallsexperiments?',
        opts: [
          { t: 'Menge aller möglichen Versuchsausgänge ω', ok: true },
          { t: 'Menge aller bereits eingetretenen Ergebnisse', ok: false },
          { t: 'Die Wahrscheinlichkeit des sicheren Ereignisses', ok: false },
          { t: 'Eine Teilmenge eines Ereignisses A', ok: false }
        ]
      },
      {
        q: '50 Ladekabel, 1 defekt. Was ist das Ereignis A = "Kabel mit gerader Seriennummer"?',
        opts: [
          { t: 'A = {2, 4, 6, …, 50}, P(A) = 1/2', ok: true },
          { t: 'A = {1}, P(A) = 1/50', ok: false },
          { t: 'A = Ω = {1, …, 50}, P(A) = 1', ok: false },
          { t: 'A = ∅, P(A) = 0', ok: false }
        ]
      },
      {
        q: 'Welche Aussage über das "sichere Ereignis" und das "unmögliche Ereignis" stimmt?',
        opts: [
          { t: 'Sicheres Ereignis: A = Ω, P(Ω) = 1 — Unmögliches: A = ∅, P(∅) = 0', ok: true },
          { t: 'Sicheres Ereignis: A = ∅, P(∅) = 0 — Unmögliches: A = Ω, P(Ω) = 1', ok: false },
          { t: 'Beide haben Wahrscheinlichkeit 0.5', ok: false },
          { t: 'Das sichere Ereignis ist immer ein Elementarereignis {ω}', ok: false }
        ]
      }
    ]
  },
  wr1q3: {
    name: 'Mengenoperationen',
    qs: [
      {
        q: 'Ω = {1,2,3,4,5,6} (Würfel), A = {2,4,6}, B = {3,4,5,6}. Was ist A∩B?',
        opts: [
          { t: '{4, 6}', ok: true },
          { t: '{2, 3, 4, 5, 6}', ok: false },
          { t: '{2, 4, 6}', ok: false },
          { t: '{3, 4, 5, 6}', ok: false }
        ]
      },
      {
        q: 'Ω = {1,2,3,4,5,6}, A = {2,4,6}. Was ist das NICHT-Ereignis Aᶜ?',
        opts: [
          { t: 'Aᶜ = {1, 3, 5}', ok: true },
          { t: 'Aᶜ = {2, 4, 6}', ok: false },
          { t: 'Aᶜ = ∅', ok: false },
          { t: 'Aᶜ = {1, 2, 3, 4, 5, 6} = Ω', ok: false }
        ]
      },
      {
        q: 'Zwei Ereignisse A und B heißen disjunkt, wenn ...',
        opts: [
          { t: 'A∩B = ∅', ok: true },
          { t: 'A∪B = ∅', ok: false },
          { t: 'P(A) = P(B) (gleiche Wahrscheinlichkeit)', ok: false },
          { t: 'A = Bᶜ (Komplement voneinander)', ok: false }
        ]
      }
    ]
  },
  wr1q4: {
    name: 'De-Morgan-Regeln',
    qs: [
      {
        q: 'De Morgan (1): Das Komplement der Vereinigung (A∪B)ᶜ = ?',
        opts: [
          { t: 'Aᶜ ∩ Bᶜ', ok: true },
          { t: 'Aᶜ ∪ Bᶜ', ok: false },
          { t: 'A ∩ B', ok: false },
          { t: 'A ∪ B', ok: false }
        ]
      },
      {
        q: 'De Morgan (2): Das Komplement des Schnitts (A∩B)ᶜ = ?',
        opts: [
          { t: 'Aᶜ ∪ Bᶜ', ok: true },
          { t: 'Aᶜ ∩ Bᶜ', ok: false },
          { t: 'A ∪ B', ok: false },
          { t: 'A ∩ B', ok: false }
        ]
      },
      {
        q: 'A = "es regnet", B = "es ist kalt". Was bedeutet (A∪B)ᶜ nach De Morgan?',
        opts: [
          { t: '"Kein Regen" UND "nicht kalt"', ok: true },
          { t: '"Kein Regen" ODER "nicht kalt"', ok: false },
          { t: '"Es regnet" UND "es ist kalt"', ok: false },
          { t: '"Kein Regen" UND "es ist kalt"', ok: false }
        ]
      }
    ]
  },
  wr1q5: {
    name: 'Additionsformel',
    qs: [
      {
        q: 'Wie lautet die allgemeine Additionsformel für P(A∪B)?',
        opts: [
          { t: 'P(A) + P(B) − P(A∩B)', ok: true },
          { t: 'P(A) + P(B)', ok: false },
          { t: 'P(A) · P(B)', ok: false },
          { t: 'P(A) + P(B) + P(A∩B)', ok: false }
        ]
      },
      {
        q: 'P(A) = 0.5, P(B) = 0.4, P(A∩B) = 0.2. Wie groß ist P(A∪B)?',
        opts: [
          { t: '0.7', ok: true },
          { t: '0.9', ok: false },
          { t: '0.6', ok: false },
          { t: '0.1', ok: false }
        ]
      },
      {
        q: 'Wann vereinfacht sich P(A∪B) = P(A) + P(B) (ohne Subtraktion)?',
        opts: [
          { t: 'Wenn A und B disjunkt sind: A∩B = ∅', ok: true },
          { t: 'Wenn A und B stochastisch unabhängig sind', ok: false },
          { t: 'Immer — die Formel stimmt auch ohne Subtraktion', ok: false },
          { t: 'Wenn P(A) = P(B)', ok: false }
        ]
      }
    ]
  },
};

function wr1InitQuiz(id) {
  var data = WR1_DATA[id];
  wr1S = {
    id: id,
    name: data.name,
    qs: data.qs.map(function(q) {
      return { q: q.q, opts: wr1Shuf(q.opts), chosen: -1 };
    }),
    idx: 0,
    done: false
  };
  wr1RenderQuiz();
}

function wr1RenderQuiz() {
  var s = wr1S, body = '';

  if (!s.done) {
    var q = s.qs[s.idx];
    var pct = Math.round((s.idx / s.qs.length) * 100);

    // Progress
    body += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">';
    body += '<span style="font-size:7px;color:#454575;letter-spacing:2px">' + (s.idx+1) + ' / ' + s.qs.length + '</span></div>';
    body += '<div style="height:3px;background:#111128;margin-bottom:0">'
          + '<div style="width:' + pct + '%;height:100%;background:#4a90d9"></div></div>';

    // Question card — flex:1 so it fills the middle
    body += '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px 0">';
    body += '<div style="background:#08081a;border:2px solid #252560;padding:28px 24px;width:100%;text-align:center">';
    body += '<div style="font-size:24px;color:#ffd700;line-height:1.5;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:0.5px">' + q.q + '</div>';
    body += '</div></div>';

    // 2x2 answer grid
    body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">';
    q.opts.forEach(function(o, i) {
      var on = q.chosen === i;
      body += '<div onclick="wr1Pick(' + i + ')" style="cursor:pointer;padding:18px 12px;border:2px solid '
        + (on ? '#4a90d9' : '#1e1e4e') + ';background:' + (on ? '#091828' : '#08081e')
        + ';font-size:18px;color:' + (on ? '#ffffff' : '#d0d0f0') + ';text-align:center;line-height:1.6;min-height:62px;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif">'
        + o.t + '</div>';
    });
    body += '</div>';

    if (q.chosen >= 0) {
      body += '<button class="rbtn action-btn" onclick="wr1Next()" style="width:100%;padding:15px 0;font-size:8px">'
        + (s.idx < s.qs.length - 1 ? 'Weiter →' : 'Auswerten') + '</button>';
    } else {
      body += '<div style="height:49px"></div>';
    }

  } else {
    var score = s.qs.reduce(function(n, q) { return n + (q.chosen >= 0 && q.opts[q.chosen].ok ? 1 : 0); }, 0);
    var max = s.qs.length;
    var stars = score === max ? 3 : score >= Math.ceil(max * 0.5) ? 2 : score >= 1 ? 1 : 0;

    body += '<div style="text-align:center;padding:28px 0 32px">';
    body += '<div style="font-size:44px;margin-bottom:16px">' + ['❌', '⭐', '⭐⭐', '⭐⭐⭐'][stars] + '</div>';
    body += '<div style="font-size:13px;color:#ffd700">' + score + ' / ' + max + ' richtig</div>';
    body += '</div>';

    s.qs.forEach(function(q) {
      var hit = q.chosen >= 0 && q.opts[q.chosen].ok;
      var correct = q.opts.filter(function(o) { return o.ok; })[0];
      body += '<div style="border-left:3px solid ' + (hit ? '#50c050' : '#c05050') + ';padding:12px 16px;margin-bottom:10px;background:' + (hit ? '#060e06' : '#0e0606') + '">';
      body += '<div style="font-size:7px;color:#7070a0;line-height:1.9;margin-bottom:5px">' + q.q + '</div>';
      body += '<div style="font-size:7px;color:' + (hit ? '#50c050' : '#c05050') + '">'
        + (hit ? '✓ ' + q.opts[q.chosen].t : '✗ Richtig: ' + correct.t) + '</div>';
      body += '</div>';
    });

    body += '<button class="rbtn action-btn" onclick="completeMiniGame(\'' + s.id + '\',' + stars + ',' + wr1Reward() + ')" style="width:100%;margin-top:14px;padding:15px 0">Abschließen &#128176;</button>';
  }

  showMiniUI(
    '<div class="mini-screen">' + wr1Hdr(s.name)
    + '<div style="flex:1;display:flex;flex-direction:column;padding:22px 32px;overflow-y:auto">' + body + '</div></div>'
  );
}

function wr1Pick(i) { wr1S.qs[wr1S.idx].chosen = i; wr1RenderQuiz(); }
function wr1Next() {
  var s = wr1S;
  if (s.idx < s.qs.length - 1) s.idx++;
  else s.done = true;
  wr1RenderQuiz();
}
