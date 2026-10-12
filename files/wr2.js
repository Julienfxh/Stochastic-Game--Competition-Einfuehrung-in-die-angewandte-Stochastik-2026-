// ============================================================
// WR2 – Laplace, Urnenmodelle, Chancen, Bed. Wahrscheinlichkeit
// ============================================================

var wr2S = null;

function wr2Shuf(a) {
  var b = a.slice();
  for (var i = b.length - 1; i > 0; i--) {
    var j = 0 | (Math.random() * (i + 1));
    var t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}

function wr2Hdr(title) {
  var lv = G.selectedLevel;
  return '<div class="mini-header" style="border-color:' + lv.color + '">'
    + '<span style="font-size:18px">' + lv.icon + '</span>&nbsp;' + title
    + '<span class="coin-display">&#128176; ' + G.coins + '</span>'
    + '<button class="rbtn" onclick="openLevelSelect(G.selectedLevel)">Zurück</button>'
    + '</div>';
}

function wr2Reward() {
  var id = wr2S.id, r = 50;
  G.selectedLevel.games.forEach(function(g) { if (g.id === id) r = g.reward; });
  return r;
}

function wr2Open(id) {
  G.screen = 'minigame';
  wr2InitQuiz(id);
}

var WR2_DATA = {
  wr2q1: {
    name: 'Laplace-Räume',
    qs: [
      {
        q: 'Was charakterisiert einen Laplace-Raum?',
        opts: [
          { t: 'Alle Elementarereignisse haben dieselbe Wahrscheinlichkeit', ok: true },
          { t: 'Der Ergebnisraum Ω ist immer unendlich groß', ok: false },
          { t: 'Es gibt genau zwei mögliche Ausgänge', ok: false },
          { t: 'P(A) ist immer größer als 0,5', ok: false }
        ]
      },
      {
        q: 'Wie berechnet man P(A) in einem Laplace-Raum?',
        opts: [
          { t: 'P(A) = |Ω| / |A|', ok: false },
          { t: 'P(A) = |A| · |Ω|', ok: false },
          { t: 'P(A) = |A| / |Ω|', ok: true },
          { t: 'P(A) = 1 − |A|', ok: false }
        ]
      },
      {
        q: 'Ein fairer sechsseitiger Würfel wird geworfen. Wie groß ist P({2, 4, 6})?',
        opts: [
          { t: '1/6', ok: false },
          { t: '1/3', ok: false },
          { t: '2/3', ok: false },
          { t: '1/2', ok: true }
        ]
      },
      {
        q: 'Aus einem Skatblatt (32 Karten) wird eine Karte zufällig gezogen. Wie groß ist P(Kreuz)?',
        opts: [
          { t: '1/32', ok: false },
          { t: '1/8', ok: false },
          { t: '1/4', ok: true },
          { t: '1/16', ok: false }
        ]
      },
      {
        q: 'Welches Experiment lässt sich nicht als Laplace-Raum modellieren?',
        opts: [
          { t: 'Wurf einer fairen Münze', ok: false },
          { t: 'Ziehen einer Karte aus einem gemischten Deck', ok: false },
          { t: 'Augensumme zweier fairer sechsseitiger Würfel', ok: true },
          { t: 'Würfeln mit einem fairen sechsseitigen Würfel', ok: false }
        ]
      }
    ]
  },
  wr2q2: {
    name: 'Urnenmodelle 1 — mit Zurücklegen',
    qs: [
      {
        q: 'Eine Urne enthält 6 Kugeln. Du ziehst 3 Mal mit Zurücklegen. Wie viele geordnete Ergebnisse gibt es?',
        opts: [
          { t: '6 · 5 · 4 = 120', ok: false },
          { t: '6³ = 216', ok: true },
          { t: '6 + 3 = 9', ok: false },
          { t: '3! = 6', ok: false }
        ]
      },
      {
        q: 'Du ziehst k-mal aus einer Urne mit n Kugeln, mit Zurücklegen, Reihenfolge spielt eine Rolle. Welche Formel gilt?',
        opts: [
          { t: 'n! / (n−k)!', ok: false },
          { t: 'n · (n−1) · … · (n−k+1)', ok: false },
          { t: 'nᵏ', ok: true },
          { t: 'n! / (k! · (n−k)!)', ok: false }
        ]
      },
      {
        q: 'Eine Urne hat 4 Kugeln (rot, blau, grün, gelb). Du ziehst 2 Mal mit Zurücklegen. Wie groß ist P(beide Male rot)?',
        opts: [
          { t: '1/16', ok: true },
          { t: '1/12', ok: false },
          { t: '1/8', ok: false },
          { t: '1/4', ok: false }
        ]
      },
      {
        q: 'Ein PIN-Code besteht aus 4 Ziffern (0–9), Wiederholungen erlaubt. Wie viele PINs gibt es?',
        opts: [
          { t: '10 · 9 · 8 · 7 = 5040', ok: false },
          { t: '10⁴ = 10000', ok: true },
          { t: '10 + 4 = 14', ok: false },
          { t: '4! = 24', ok: false }
        ]
      },
      {
        q: 'Ein Buchstabe wird 3 Mal zufällig aus {A, B, C} gezogen, mit Zurücklegen. Wie groß ist P(dreimal derselbe Buchstabe)?',
        opts: [
          { t: '1/27', ok: false },
          { t: '1/9', ok: false },
          { t: '3/27', ok: true },
          { t: '1/3', ok: false }
        ]
      }
    ]
  },
  wr2q3: {
    name: 'Urnenmodelle 2 — ohne Zurücklegen',
    qs: [
      {
        q: 'Eine Urne hat 6 Kugeln. Du ziehst 3 Mal ohne Zurücklegen, Reihenfolge zählt. Wie viele geordnete Ergebnisse gibt es?',
        opts: [
          { t: '6³ = 216', ok: false },
          { t: '6 · 5 · 4 = 120', ok: true },
          { t: '6 · 5 · 4 · 3 = 360', ok: false },
          { t: '3! = 6', ok: false }
        ]
      },
      {
        q: 'Auf wie viele Arten können 5 Personen auf 5 Stühle verteilt werden?',
        opts: [
          { t: '5² = 25', ok: false },
          { t: '5 + 4 + 3 + 2 + 1 = 15', ok: false },
          { t: '5! = 120', ok: true },
          { t: '5 · 4 = 20', ok: false }
        ]
      },
      {
        q: 'Aus 8 Läufern belegen die ersten 3 Plätze Gold, Silber, Bronze. Wie viele geordnete Ergebnisse gibt es?',
        opts: [
          { t: '8! = 40320', ok: false },
          { t: '8 · 7 · 6 = 336', ok: true },
          { t: '3! = 6', ok: false },
          { t: '8 · 3 = 24', ok: false }
        ]
      },
      {
        q: '4 Kugeln (1, 2, 3, 4) in einer Urne. Du ziehst 2 Mal ohne Zurücklegen. Wie groß ist P(zuerst 1, dann 2)?',
        opts: [
          { t: '1/16', ok: false },
          { t: '1/12', ok: true },
          { t: '1/8', ok: false },
          { t: '1/4', ok: false }
        ]
      },
      {
        q: 'Eine Urne hat 5 Kugeln. Du ziehst 2 Mal. Welche Aussage stimmt?',
        opts: [
          { t: 'Mit Zurücklegen gibt es weniger Ergebnisse als ohne', ok: false },
          { t: 'Mit Zurücklegen gibt es gleich viele Ergebnisse wie ohne', ok: false },
          { t: 'Mit Zurücklegen gibt es mehr Ergebnisse als ohne', ok: true },
          { t: 'Die Anzahl hängt nur von k ab, nicht von n', ok: false }
        ]
      }
    ]
  },
  wr2q4: {
    name: 'Urnenmodelle — kombiniert',
    qs: [
      {
        q: 'Du würfelst 3 Mal mit einem sechsseitigen Würfel und notierst die Reihenfolge. Welches Modell passt?',
        opts: [
          { t: 'Ohne Zurücklegen', ok: false },
          { t: 'Mit Zurücklegen', ok: true },
          { t: 'Keines — Würfeln ist kein Urnenmodell', ok: false },
          { t: 'Permutation', ok: false }
        ]
      },
      {
        q: 'In einem Rennen starten 10 Fahrer. Die Plätze 1–3 werden vergeben, kein Fahrer kann zwei Plätze belegen. Welches Modell passt?',
        opts: [
          { t: 'Mit Zurücklegen', ok: false },
          { t: 'Ohne Zurücklegen', ok: true },
          { t: 'Permutation aller 10 Fahrer', ok: false },
          { t: 'Keines der beiden Modelle', ok: false }
        ]
      },
      {
        q: 'Ein Zahlencode hat 3 Stellen aus {1,2,3,4,5}. Einmal mit, einmal ohne Zurücklegen. Wie viele Codes gibt es jeweils?',
        opts: [
          { t: 'Mit: 125 / Ohne: 60', ok: true },
          { t: 'Mit: 60 / Ohne: 125', ok: false },
          { t: 'Mit: 125 / Ohne: 125', ok: false },
          { t: 'Mit: 60 / Ohne: 60', ok: false }
        ]
      },
      {
        q: 'Welche Situation passt zu welchem Modell?  1. Lotto: 6 aus 49  2. PIN: 4 Ziffern, Wiederholung erlaubt  3. Staffel: 3 von 8 Läufern in fester Reihenfolge',
        opts: [
          { t: '1→ohne Zurücklegen, 2→mit Zurücklegen, 3→ohne Zurücklegen', ok: true },
          { t: '1→mit Zurücklegen, 2→ohne Zurücklegen, 3→mit Zurücklegen', ok: false },
          { t: '1→ohne Zurücklegen, 2→ohne Zurücklegen, 3→mit Zurücklegen', ok: false },
          { t: '1→mit Zurücklegen, 2→mit Zurücklegen, 3→ohne Zurücklegen', ok: false }
        ]
      },
      {
        q: 'Eine Urne hat 3 rote und 2 blaue Kugeln. Du ziehst 2 Mal ohne Zurücklegen. Wie groß ist P(beide rot)?',
        opts: [
          { t: '9/25', ok: false },
          { t: '3/10', ok: true },
          { t: '1/5', ok: false },
          { t: '1/10', ok: false }
        ]
      }
    ]
  },
  wr2q5: {
    name: 'Chancen & Bedingte Wahrscheinlichkeiten',
    qs: [
      {
        q: 'P(A) = 1/4. Wie groß ist die Chance (Odds) für A?',
        opts: [
          { t: '1/4', ok: false },
          { t: '1/3', ok: true },
          { t: '3/4', ok: false },
          { t: '4', ok: false }
        ]
      },
      {
        q: 'Ein fairer sechsseitiger Würfel wird geworfen. Wie groß ist die Chance, eine 6 zu würfeln?',
        opts: [
          { t: '1/6', ok: false },
          { t: '1/5', ok: true },
          { t: '5/6', ok: false },
          { t: '6', ok: false }
        ]
      },
      {
        q: 'Wie berechnet man P(A|B)?',
        opts: [
          { t: 'P(A∩B) · P(B)', ok: false },
          { t: 'P(A∩B) / P(B)', ok: true },
          { t: 'P(A) / P(B)', ok: false },
          { t: 'P(A) · P(B)', ok: false }
        ]
      },
      {
        q: 'P(A∩B) = 0,2 und P(B) = 0,5. Wie groß ist P(A|B)?',
        opts: [
          { t: '0,1', ok: false },
          { t: '0,7', ok: false },
          { t: '0,4', ok: true },
          { t: '0,25', ok: false }
        ]
      },
      {
        q: 'Eine Urne hat 4 rote und 6 blaue Kugeln. Du ziehst 2 Mal ohne Zurücklegen. Wie groß ist P(erste rot, zweite blau)?',
        opts: [
          { t: '24/100', ok: false },
          { t: '24/90', ok: true },
          { t: '18/90', ok: false },
          { t: '12/90', ok: false }
        ]
      },
      {
        q: 'Die Chance für Ereignis A beträgt 2/3. Wie groß ist P(A)?',
        opts: [
          { t: '2/3', ok: false },
          { t: '2/5', ok: true },
          { t: '3/5', ok: false },
          { t: '2/4', ok: false }
        ]
      }
    ]
  }
};

function wr2InitQuiz(id) {
  var data = WR2_DATA[id];
  wr2S = {
    id: id,
    name: data.name,
    qs: data.qs.map(function(q) {
      return { q: q.q, opts: wr2Shuf(q.opts), chosen: -1 };
    }),
    idx: 0,
    done: false
  };
  wr2RenderQuiz();
}

function wr2RenderQuiz() {
  var s = wr2S, body = '';

  if (!s.done) {
    var q = s.qs[s.idx];
    var pct = Math.round((s.idx / s.qs.length) * 100);

    body += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">';
    body += '<span style="font-size:7px;color:#454575;letter-spacing:2px">' + (s.idx+1) + ' / ' + s.qs.length + '</span></div>';
    body += '<div style="height:3px;background:#111128;margin-bottom:0">'
          + '<div style="width:' + pct + '%;height:100%;background:#d4a017"></div></div>';

    body += '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px 0">';
    body += '<div style="background:#08081a;border:2px solid #252560;padding:28px 24px;width:100%;text-align:center">';
    body += '<div style="font-size:24px;color:#ffd700;line-height:1.5;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:0.5px">' + q.q + '</div>';
    body += '</div></div>';

    body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">';
    q.opts.forEach(function(o, i) {
      var on = q.chosen === i;
      body += '<div onclick="wr2Pick(' + i + ')" style="cursor:pointer;padding:18px 12px;border:2px solid '
        + (on ? '#d4a017' : '#1e1e4e') + ';background:' + (on ? '#1a1200' : '#08081e')
        + ';font-size:18px;color:' + (on ? '#ffffff' : '#d0d0f0') + ';text-align:center;line-height:1.6;min-height:62px;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif">'
        + o.t + '</div>';
    });
    body += '</div>';

    if (q.chosen >= 0) {
      body += '<button class="rbtn action-btn" onclick="wr2Next()" style="width:100%;padding:15px 0;font-size:8px">'
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

    body += '<button class="rbtn action-btn" onclick="completeMiniGame(\'' + s.id + '\',' + stars + ',' + wr2Reward() + ')" style="width:100%;margin-top:14px;padding:15px 0">Abschließen &#128176;</button>';
  }

  showMiniUI(
    '<div class="mini-screen">' + wr2Hdr(s.name)
    + '<div style="flex:1;display:flex;flex-direction:column;padding:22px 32px;overflow-y:auto">' + body + '</div></div>'
  );
}

function wr2Pick(i) { wr2S.qs[wr2S.idx].chosen = i; wr2RenderQuiz(); }
function wr2Next() {
  var s = wr2S;
  if (s.idx < s.qs.length - 1) s.idx++;
  else s.done = true;
  wr2RenderQuiz();
}
