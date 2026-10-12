// ============================================================
// WR3 – Totale Wkeit, Bayes, Unabhängigkeit, Zufallsvariablen
// ============================================================

var wr3S = null;

function wr3Shuf(a) {
  var b = a.slice();
  for (var i = b.length - 1; i > 0; i--) {
    var j = 0 | (Math.random() * (i + 1));
    var t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}

function wr3Hdr(title) {
  var lv = G.selectedLevel;
  return '<div class="mini-header" style="border-color:' + lv.color + '">'
    + '<span style="font-size:18px">' + lv.icon + '</span>&nbsp;' + title
    + '<span class="coin-display">&#128176; ' + G.coins + '</span>'
    + '<button class="rbtn" onclick="openLevelSelect(G.selectedLevel)">Zurück</button>'
    + '</div>';
}

function wr3Reward() {
  var id = wr3S.id, r = 50;
  G.selectedLevel.games.forEach(function(g) { if (g.id === id) r = g.reward; });
  return r;
}

function wr3Open(id) {
  G.screen = 'minigame';
  wr3InitQuiz(id);
}

var WR3_DATA = {
  wr3q1: {
    name: 'Satz der totalen Wahrscheinlichkeit',
    qs: [
      {
        q: 'B₁, B₂, B₃ bilden eine Partition von Ω. Wie lautet der Satz der totalen Wahrscheinlichkeit für P(A)?',
        opts: [
          { t: 'P(A) = P(A|B₁) + P(A|B₂) + P(A|B₃)', ok: false },
          { t: 'P(A) = P(A|B₁)·P(B₁) + P(A|B₂)·P(B₂) + P(A|B₃)·P(B₃)', ok: true },
          { t: 'P(A) = P(A) · (P(B₁) + P(B₂) + P(B₃))', ok: false },
          { t: 'P(A) = P(B₁|A)·P(B₁) + P(B₂|A)·P(B₂) + P(B₃|A)·P(B₃)', ok: false }
        ]
      },
      {
        q: 'Welche Bedingung muss eine Partition B₁, B₂, …, Bₙ von Ω erfüllen?',
        opts: [
          { t: 'Alle Bᵢ sind disjunkt und ihre Vereinigung ergibt Ω', ok: true },
          { t: 'Alle Bᵢ haben dieselbe Wahrscheinlichkeit', ok: false },
          { t: 'Alle Bᵢ sind Teilmengen von A', ok: false },
          { t: 'Es gilt P(Bᵢ) = 1/n für alle i', ok: false }
        ]
      },
      {
        q: 'Eine Fabrik hat 2 Maschinen. Maschine 1 produziert 60% der Teile, Maschine 2 die restlichen 40%. P(defekt|M1) = 0,05 und P(defekt|M2) = 0,10. Wie groß ist P(defekt)?',
        opts: [
          { t: '0,15', ok: false },
          { t: '0,07', ok: true },
          { t: '0,05', ok: false },
          { t: '0,10', ok: false }
        ]
      },
      {
        q: 'Wann wendet man den Satz der totalen Wahrscheinlichkeit an?',
        opts: [
          { t: 'Wenn man P(A∩B) aus P(A) und P(B) berechnen will', ok: false },
          { t: 'Wenn man P(A) über mehrere disjunkte Ursachen B₁,…,Bₙ berechnen will', ok: true },
          { t: 'Wenn A und B unabhängig sind', ok: false },
          { t: 'Wenn man P(A|B) in P(B|A) umrechnen will', ok: false }
        ]
      },
      {
        q: 'P(B₁) = 0,3, P(B₂) = 0,7. P(A|B₁) = 0,4, P(A|B₂) = 0,2. Wie groß ist P(A)?',
        opts: [
          { t: '0,6', ok: false },
          { t: '0,3', ok: false },
          { t: '0,26', ok: true },
          { t: '0,14', ok: false }
        ]
      }
    ]
  },
  wr3q2: {
    name: 'Satz von Bayes',
    qs: [
      {
        q: 'Wie lautet der Satz von Bayes für P(Bᵢ|A)?',
        opts: [
          { t: 'P(Bᵢ|A) = P(A|Bᵢ) · P(A) / P(Bᵢ)', ok: false },
          { t: 'P(Bᵢ|A) = P(A|Bᵢ) · P(Bᵢ) / P(A)', ok: true },
          { t: 'P(Bᵢ|A) = P(Bᵢ) / P(A|Bᵢ)', ok: false },
          { t: 'P(Bᵢ|A) = P(A∩Bᵢ) · P(A)', ok: false }
        ]
      },
      {
        q: 'Was berechnet man mit dem Satz von Bayes?',
        opts: [
          { t: 'Die Wahrscheinlichkeit einer Ursache, nachdem man das Ergebnis kennt', ok: true },
          { t: 'Die Wahrscheinlichkeit eines Ergebnisses, wenn man die Ursache kennt', ok: false },
          { t: 'Die Vereinigung zweier unabhängiger Ereignisse', ok: false },
          { t: 'Den Erwartungswert einer Zufallsvariablen', ok: false }
        ]
      },
      {
        q: 'P(B₁) = 0,6, P(B₂) = 0,4. P(A|B₁) = 0,05, P(A|B₂) = 0,10. P(A) = 0,07. Wie groß ist P(B₁|A)?',
        opts: [
          { t: '0,43', ok: true },
          { t: '0,57', ok: false },
          { t: '0,30', ok: false },
          { t: '0,70', ok: false }
        ]
      },
      {
        q: 'Welche Formel steckt im Nenner von Bayes, wenn B₁,…,Bₙ eine Partition bilden?',
        opts: [
          { t: 'Die Additionsformel', ok: false },
          { t: 'Der Satz der totalen Wahrscheinlichkeit', ok: true },
          { t: 'Der Produktsatz', ok: false },
          { t: 'Die De-Morgan-Regel', ok: false }
        ]
      },
      {
        q: 'Ein Arzt testet auf eine Krankheit. P(krank) = 0,01, P(positiv|krank) = 0,95, P(positiv|gesund) = 0,05. Wie groß ist P(krank|positiv) ungefähr?',
        opts: [
          { t: '0,95', ok: false },
          { t: '0,50', ok: false },
          { t: '0,16', ok: true },
          { t: '0,01', ok: false }
        ]
      }
    ]
  },
  wr3q3: {
    name: 'Unabhängige Ereignisse & Produktsatz',
    qs: [
      {
        q: 'Wann heißen zwei Ereignisse A und B stochastisch unabhängig?',
        opts: [
          { t: 'Wenn A∩B = ∅', ok: false },
          { t: 'Wenn P(A∩B) = P(A) · P(B)', ok: true },
          { t: 'Wenn P(A|B) = P(B|A)', ok: false },
          { t: 'Wenn P(A∪B) = 1', ok: false }
        ]
      },
      {
        q: 'A und B sind unabhängig. Was gilt dann für P(A|B)?',
        opts: [
          { t: 'P(A|B) = 0', ok: false },
          { t: 'P(A|B) = P(B)', ok: false },
          { t: 'P(A|B) = P(A)', ok: true },
          { t: 'P(A|B) = P(A) + P(B)', ok: false }
        ]
      },
      {
        q: 'P(A) = 0,4 und P(B) = 0,5. A und B sind unabhängig. Wie groß ist P(A∩B)?',
        opts: [
          { t: '0,9', ok: false },
          { t: '0,1', ok: false },
          { t: '0,2', ok: true },
          { t: '0,45', ok: false }
        ]
      },
      {
        q: 'Was ist der Unterschied zwischen disjunkten und unabhängigen Ereignissen?',
        opts: [
          { t: 'Disjunkte Ereignisse können nicht gleichzeitig eintreten, unabhängige schon', ok: true },
          { t: 'Unabhängige Ereignisse können nicht gleichzeitig eintreten, disjunkte schon', ok: false },
          { t: 'Beides bedeutet dasselbe', ok: false },
          { t: 'Disjunkte Ereignisse haben immer gleiche Wahrscheinlichkeit', ok: false }
        ]
      },
      {
        q: 'Eine Münze wird 3 Mal geworfen. Die Würfe sind unabhängig. Wie groß ist P(dreimal Kopf)?',
        opts: [
          { t: '3 · (1/2) = 3/2', ok: false },
          { t: '1/4', ok: false },
          { t: '1/6', ok: false },
          { t: '1/8', ok: true }
        ]
      }
    ]
  },
  wr3q4: {
    name: 'Zufallsvariablen',
    qs: [
      {
        q: 'Was ist eine Zufallsvariable X?',
        opts: [
          { t: 'Eine feste Zahl, die das Ergebnis eines Experiments beschreibt', ok: false },
          { t: 'Eine Funktion, die jedem Ergebnis ω ∈ Ω einen reellen Wert zuordnet', ok: true },
          { t: 'Eine Menge aller möglichen Ereignisse', ok: false },
          { t: 'Der Erwartungswert eines Zufallsexperiments', ok: false }
        ]
      },
      {
        q: 'Ein fairer sechsseitiger Würfel wird geworfen. X sei die gewürfelte Augenzahl. Was ist X(ω) für ω = "es fällt eine 4"?',
        opts: [
          { t: 'X(ω) = {1,2,3,4,5,6}', ok: false },
          { t: 'X(ω) = 1/6', ok: false },
          { t: 'X(ω) = 4', ok: true },
          { t: 'X(ω) = Ω', ok: false }
        ]
      },
      {
        q: 'X zählt die Anzahl Köpfe bei 2 Münzwürfen. Was ist der Wertebereich von X?',
        opts: [
          { t: '{KK, KZ, ZK, ZZ}', ok: false },
          { t: '{0, 1, 2}', ok: true },
          { t: '{1, 2}', ok: false },
          { t: '{0, 1, 2, 3, 4}', ok: false }
        ]
      },
      {
        q: 'Welche Zufallsvariable ist stetig?',
        opts: [
          { t: 'Anzahl Defekte in einer Produktion', ok: false },
          { t: 'Augensumme zweier Würfel', ok: false },
          { t: 'Wartezeit an einer Bushaltestelle', ok: true },
          { t: 'Anzahl Köpfe bei 10 Münzwürfen', ok: false }
        ]
      },
      {
        q: 'Ein Spieler gewinnt 10€ bei einer 6, verliert 2€ sonst. Welche Zufallsvariable beschreibt den Gewinn X?',
        opts: [
          { t: 'X(ω) = 10 für alle ω ∈ Ω', ok: false },
          { t: 'X(ω) = 10 falls ω=6, X(ω) = −2 sonst', ok: true },
          { t: 'X(ω) = 6 falls ω=6, X(ω) = 0 sonst', ok: false },
          { t: 'X(ω) = 1/6 für alle ω ∈ Ω', ok: false }
        ]
      }
    ]
  },
  wr3q5: {
    name: 'Verteilung von Zufallsvariablen',
    qs: [
      {
        q: 'Was gibt die Wahrscheinlichkeitsfunktion p(x) einer diskreten Zufallsvariable an?',
        opts: [
          { t: 'Den Erwartungswert von X', ok: false },
          { t: 'P(X = x) für jeden möglichen Wert x', ok: true },
          { t: 'Die Summe aller möglichen Werte von X', ok: false },
          { t: 'P(X ≤ x) für jeden möglichen Wert x', ok: false }
        ]
      },
      {
        q: 'Was gibt die Verteilungsfunktion F(x) = P(X ≤ x) an?',
        opts: [
          { t: 'Die Wahrscheinlichkeit, dass X genau x annimmt', ok: false },
          { t: 'Die Wahrscheinlichkeit, dass X höchstens x annimmt', ok: true },
          { t: 'Den Erwartungswert bis zum Wert x', ok: false },
          { t: 'Die Anzahl der Werte kleiner als x', ok: false }
        ]
      },
      {
        q: 'Welche Aussage über die Verteilungsfunktion F(x) stimmt?',
        opts: [
          { t: 'F ist streng monoton steigend', ok: false },
          { t: 'F ist monoton nicht-fallend', ok: true },
          { t: 'F kann Werte größer als 1 annehmen', ok: false },
          { t: 'F ist immer stetig', ok: false }
        ]
      },
      {
        q: 'X hat die Verteilung: P(X=1)=0,2, P(X=2)=0,5, P(X=3)=0,3. Wie groß ist F(2) = P(X ≤ 2)?',
        opts: [
          { t: '0,5', ok: false },
          { t: '0,7', ok: true },
          { t: '0,2', ok: false },
          { t: '1,0', ok: false }
        ]
      },
      {
        q: 'X hat die Verteilung: P(X=1)=0,2, P(X=2)=0,5, P(X=3)=0,3. Wie berechnet man P(X=2) aus F?',
        opts: [
          { t: 'F(2) − F(1)', ok: true },
          { t: 'F(2) + F(1)', ok: false },
          { t: 'F(3) − F(2)', ok: false },
          { t: '1 − F(2)', ok: false }
        ]
      }
    ]
  }
};

function wr3InitQuiz(id) {
  var data = WR3_DATA[id];
  wr3S = {
    id: id,
    name: data.name,
    qs: data.qs.map(function(q) {
      return { q: q.q, opts: wr3Shuf(q.opts), chosen: -1 };
    }),
    idx: 0,
    done: false
  };
  wr3RenderQuiz();
}

function wr3RenderQuiz() {
  var s = wr3S, body = '';

  if (!s.done) {
    var q = s.qs[s.idx];
    var pct = Math.round((s.idx / s.qs.length) * 100);

    body += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">';
    body += '<span style="font-size:7px;color:#454575;letter-spacing:2px">' + (s.idx+1) + ' / ' + s.qs.length + '</span></div>';
    body += '<div style="height:3px;background:#111128;margin-bottom:0">'
          + '<div style="width:' + pct + '%;height:100%;background:#e05555"></div></div>';

    body += '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px 0">';
    body += '<div style="background:#08081a;border:2px solid #252560;padding:28px 24px;width:100%;text-align:center">';
    body += '<div style="font-size:24px;color:#ffd700;line-height:1.5;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:0.5px">' + q.q + '</div>';
    body += '</div></div>';

    body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">';
    q.opts.forEach(function(o, i) {
      var on = q.chosen === i;
      body += '<div onclick="wr3Pick(' + i + ')" style="cursor:pointer;padding:18px 12px;border:2px solid '
        + (on ? '#e05555' : '#1e1e4e') + ';background:' + (on ? '#1a0808' : '#08081e')
        + ';font-size:18px;color:' + (on ? '#ffffff' : '#d0d0f0') + ';text-align:center;line-height:1.6;min-height:62px;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif">'
        + o.t + '</div>';
    });
    body += '</div>';

    if (q.chosen >= 0) {
      body += '<button class="rbtn action-btn" onclick="wr3Next()" style="width:100%;padding:15px 0;font-size:8px">'
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

    body += '<button class="rbtn action-btn" onclick="completeMiniGame(\'' + s.id + '\',' + stars + ',' + wr3Reward() + ')" style="width:100%;margin-top:14px;padding:15px 0">Abschließen &#128176;</button>';
  }

  showMiniUI(
    '<div class="mini-screen">' + wr3Hdr(s.name)
    + '<div style="flex:1;display:flex;flex-direction:column;padding:22px 32px;overflow-y:auto">' + body + '</div></div>'
  );
}

function wr3Pick(i) { wr3S.qs[wr3S.idx].chosen = i; wr3RenderQuiz(); }
function wr3Next() {
  var s = wr3S;
  if (s.idx < s.qs.length - 1) s.idx++;
  else s.done = true;
  wr3RenderQuiz();
}
