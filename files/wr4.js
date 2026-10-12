// ============================================================
// WR4 – Dichte, Erwartungswert, Varianz, Urnenmodelle 3+4
// ============================================================

var wr4S = null;

function wr4Shuf(a) {
  var b = a.slice();
  for (var i = b.length - 1; i > 0; i--) {
    var j = 0 | (Math.random() * (i + 1));
    var t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}

function wr4Hdr(title) {
  var lv = G.selectedLevel;
  return '<div class="mini-header" style="border-color:' + lv.color + '">'
    + '<span style="font-size:18px">' + lv.icon + '</span>&nbsp;' + title
    + '<span class="coin-display">&#128176; ' + G.coins + '</span>'
    + '<button class="rbtn" onclick="openLevelSelect(G.selectedLevel)">Zurück</button>'
    + '</div>';
}

function wr4Reward() {
  var id = wr4S.id, r = 60;
  G.selectedLevel.games.forEach(function(g) { if (g.id === id) r = g.reward; });
  return r;
}

function wr4Open(id) {
  G.screen = 'minigame';
  wr4InitQuiz(id);
}

var WR4_DATA = {
  wr4q1: {
    name: 'Dichtetransformationssatz',
    qs: [
      {
        q: 'Was beschreibt der Dichtetransformationssatz?',
        opts: [
          { t: 'Die Dichte von Y = g(X), wenn die Dichte von X bekannt ist', ok: true },
          { t: 'Den Erwartungswert einer transformierten Zufallsvariable', ok: false },
          { t: 'Die Verteilungsfunktion einer diskreten Zufallsvariable', ok: false },
          { t: 'Die Summe zweier unabhängiger Dichten', ok: false }
        ]
      },
      {
        q: 'X hat Dichte f_X, Y = g(X) mit g streng monoton. Wie lautet f_Y(y)?',
        opts: [
          { t: 'f_X(g(y)) · |g\'(y)|', ok: false },
          { t: 'f_X(g⁻¹(y)) · |(g⁻¹)\'(y)|', ok: true },
          { t: 'f_X(y) / |g\'(y)|', ok: false },
          { t: 'f_X(g(y)) / |g\'(g(y))|', ok: false }
        ]
      },
      {
        q: 'X hat Dichte f_X, Y = 2X + 3. Wie lautet f_Y(y)?',
        opts: [
          { t: '2 · f_X(2y + 3)', ok: false },
          { t: 'f_X((y−3)/2) · 2', ok: false },
          { t: 'f_X((y−3)/2) · 1/2', ok: true },
          { t: 'f_X(2y − 3) · 1/2', ok: false }
        ]
      },
      {
        q: 'Wann kann man den Dichtetransformationssatz direkt anwenden?',
        opts: [
          { t: 'Wenn g linear ist', ok: false },
          { t: 'Wenn g streng monoton und differenzierbar ist', ok: true },
          { t: 'Wenn X diskret ist', ok: false },
          { t: 'Wenn f_X = 1 auf dem Träger', ok: false }
        ]
      },
      {
        q: 'X ~ U(0,1), Y = X². Welche Aussage stimmt für f_Y?',
        opts: [
          { t: 'f_Y(y) = 1 für y ∈ (0,1)', ok: false },
          { t: 'f_Y(y) = 1/(2√y) für y ∈ (0,1)', ok: true },
          { t: 'f_Y(y) = 2√y für y ∈ (0,1)', ok: false },
          { t: 'f_Y(y) = y² für y ∈ (0,1)', ok: false }
        ]
      }
    ]
  },
  wr4q2: {
    name: 'Unabhängige Zufallsvariablen',
    qs: [
      {
        q: 'Wann heißen zwei Zufallsvariablen X und Y unabhängig?',
        opts: [
          { t: 'Wenn E[X] = E[Y]', ok: false },
          { t: 'Wenn die gemeinsame Dichte f_{X,Y}(x,y) = f_X(x) · f_Y(y) gilt', ok: true },
          { t: 'Wenn X + Y = konst.', ok: false },
          { t: 'Wenn Var(X) = Var(Y)', ok: false }
        ]
      },
      {
        q: 'X und Y sind unabhängig. Was gilt für E[X · Y]?',
        opts: [
          { t: 'E[X · Y] = E[X] + E[Y]', ok: false },
          { t: 'E[X · Y] = E[X] · E[Y]', ok: true },
          { t: 'E[X · Y] = 0', ok: false },
          { t: 'E[X · Y] = Var(X)', ok: false }
        ]
      },
      {
        q: 'X und Y sind unabhängig. Was gilt für Var(X + Y)?',
        opts: [
          { t: 'Var(X + Y) = Var(X) · Var(Y)', ok: false },
          { t: 'Var(X + Y) = Var(X) − Var(Y)', ok: false },
          { t: 'Var(X + Y) = Var(X) + Var(Y)', ok: true },
          { t: 'Var(X + Y) = (Var(X) + Var(Y))²', ok: false }
        ]
      },
      {
        q: 'Wie prüft man bei diskreten X, Y ob sie unabhängig sind?',
        opts: [
          { t: 'P(X=x, Y=y) = P(X=x) + P(Y=y) für alle x, y', ok: false },
          { t: 'P(X=x, Y=y) = P(X=x) · P(Y=y) für alle x, y', ok: true },
          { t: 'E[X] = E[Y]', ok: false },
          { t: 'P(X=x) = P(Y=x) für alle x', ok: false }
        ]
      },
      {
        q: 'X = Augenzahl eines Würfels, Y = X². Sind X und Y unabhängig?',
        opts: [
          { t: 'Ja, da beide vom selben Würfel kommen', ok: false },
          { t: 'Nein, da Y vollständig durch X bestimmt ist', ok: true },
          { t: 'Ja, da E[XY] = E[X] · E[Y]', ok: false },
          { t: 'Nein, da Var(X) ≠ Var(Y)', ok: false }
        ]
      }
    ]
  },
  wr4q3: {
    name: 'Zufallsstichprobe',
    qs: [
      {
        q: 'Was ist eine Zufallsstichprobe vom Umfang n?',
        opts: [
          { t: 'n beliebig ausgewählte, abhängige Zufallsvariablen', ok: false },
          { t: 'n unabhängige, identisch verteilte Zufallsvariablen X₁,…,Xₙ', ok: true },
          { t: 'Der Mittelwert von n Beobachtungen', ok: false },
          { t: 'Eine Teilmenge von Ω mit n Elementen', ok: false }
        ]
      },
      {
        q: 'Was bedeutet "i.i.d." bei einer Zufallsstichprobe?',
        opts: [
          { t: 'identisch und invariant definiert', ok: false },
          { t: 'independent and identically distributed', ok: true },
          { t: 'integrierbar im direkten Definitionsbereich', ok: false },
          { t: 'invers und indefinit diskret', ok: false }
        ]
      },
      {
        q: 'X₁,…,Xₙ i.i.d. mit E[Xᵢ] = μ. Wie lautet der Stichprobenmittelwert X̄ₙ?',
        opts: [
          { t: 'X̄ₙ = n · Σ Xᵢ', ok: false },
          { t: 'X̄ₙ = (X₁ + Xₙ) / 2', ok: false },
          { t: 'X̄ₙ = (1/n) · Σ Xᵢ', ok: true },
          { t: 'X̄ₙ = max(X₁,…,Xₙ)', ok: false }
        ]
      },
      {
        q: 'X₁,…,Xₙ i.i.d. mit E[Xᵢ] = μ. Was ist E[X̄ₙ]?',
        opts: [
          { t: 'n · μ', ok: false },
          { t: 'μ / n', ok: false },
          { t: 'μ²', ok: false },
          { t: 'μ', ok: true }
        ]
      },
      {
        q: 'X₁,…,Xₙ i.i.d. mit Var(Xᵢ) = σ². Was ist Var(X̄ₙ)?',
        opts: [
          { t: 'σ²', ok: false },
          { t: 'n · σ²', ok: false },
          { t: 'σ² / n', ok: true },
          { t: 'σ / n', ok: false }
        ]
      }
    ]
  },
  wr4q4: {
    name: 'Erwartungswert',
    qs: [
      {
        q: 'Wie berechnet man den Erwartungswert einer diskreten Zufallsvariable X?',
        opts: [
          { t: 'E[X] = max(xᵢ)', ok: false },
          { t: 'E[X] = Σ xᵢ · P(X = xᵢ)', ok: true },
          { t: 'E[X] = Σ P(X = xᵢ)', ok: false },
          { t: 'E[X] = (1/n) · Σ xᵢ', ok: false }
        ]
      },
      {
        q: 'Ein fairer sechsseitiger Würfel wird geworfen. Wie groß ist E[X]?',
        opts: [
          { t: '3', ok: false },
          { t: '3,5', ok: true },
          { t: '4', ok: false },
          { t: '21', ok: false }
        ]
      },
      {
        q: 'E[X] = 4. Wie groß ist E[2X + 3]?',
        opts: [
          { t: '9', ok: false },
          { t: '11', ok: true },
          { t: '8', ok: false },
          { t: '14', ok: false }
        ]
      },
      {
        q: 'Welche Aussage über E[X²] und (E[X])² stimmt im Allgemeinen?',
        opts: [
          { t: 'E[X²] = (E[X])²', ok: false },
          { t: 'E[X²] ≥ (E[X])²', ok: true },
          { t: 'E[X²] ≤ (E[X])²', ok: false },
          { t: 'E[X²] = E[X] + 1', ok: false }
        ]
      },
      {
        q: 'Ein Spieler gewinnt 5€ mit P=0,4 und verliert 2€ mit P=0,6. Was ist E[Gewinn]?',
        opts: [
          { t: '0,80€', ok: true },
          { t: '1,50€', ok: false },
          { t: '−0,20€', ok: false },
          { t: '3€', ok: false }
        ]
      }
    ]
  },
  wr4q5: {
    name: 'Bernoulli-Verteilung',
    qs: [
      {
        q: 'X ~ Ber(p). Welche Werte kann X annehmen und mit welcher Wahrscheinlichkeit?',
        opts: [
          { t: 'P(X=1) = p, P(X=0) = 1−p', ok: true },
          { t: 'P(X=1) = 1−p, P(X=0) = p', ok: false },
          { t: 'P(X=p) = 1', ok: false },
          { t: 'P(X=0) = p, P(X=1) = p', ok: false }
        ]
      },
      {
        q: 'X ~ Ber(p). Was ist E[X]?',
        opts: [
          { t: '1 − p', ok: false },
          { t: 'p(1−p)', ok: false },
          { t: 'p²', ok: false },
          { t: 'p', ok: true }
        ]
      },
      {
        q: 'X ~ Ber(p). Was ist Var(X)?',
        opts: [
          { t: 'p', ok: false },
          { t: 'p²', ok: false },
          { t: 'p · (1−p)', ok: true },
          { t: '1 − p', ok: false }
        ]
      },
      {
        q: 'Eine faire Münze wird geworfen, X = 1 bei Kopf, X = 0 bei Zahl. Was ist Var(X)?',
        opts: [
          { t: '1/2', ok: false },
          { t: '1/4', ok: true },
          { t: '1/8', ok: false },
          { t: '1', ok: false }
        ]
      },
      {
        q: 'Wie hängt die Bernoulli-Verteilung mit der Binomialverteilung zusammen?',
        opts: [
          { t: 'Eine Binomialverteilung B(n,p) ist die Summe von n unabhängigen Ber(p)-Variablen', ok: true },
          { t: 'Ber(p) ist ein Spezialfall der Normalverteilung', ok: false },
          { t: 'Ber(p) = B(p, p)', ok: false },
          { t: 'Es gibt keinen Zusammenhang', ok: false }
        ]
      }
    ]
  },
  wr4q6: {
    name: 'Varianz & Standardabweichung',
    qs: [
      {
        q: 'Wie ist die Varianz Var(X) definiert?',
        opts: [
          { t: 'Var(X) = E[X]²', ok: false },
          { t: 'Var(X) = E[(X − E[X])²]', ok: true },
          { t: 'Var(X) = E[X] − (E[X])²', ok: false },
          { t: 'Var(X) = E[X²] + (E[X])²', ok: false }
        ]
      },
      {
        q: 'Welche Rechenformel gilt für die Varianz?',
        opts: [
          { t: 'Var(X) = E[X²] + (E[X])²', ok: false },
          { t: 'Var(X) = E[X²] − (E[X])²', ok: true },
          { t: 'Var(X) = (E[X])² − E[X²]', ok: false },
          { t: 'Var(X) = E[X] · E[X²]', ok: false }
        ]
      },
      {
        q: 'Wie ist die Standardabweichung σ definiert?',
        opts: [
          { t: 'σ = Var(X)²', ok: false },
          { t: 'σ = Var(X) / E[X]', ok: false },
          { t: 'σ = √Var(X)', ok: true },
          { t: 'σ = E[X] − Var(X)', ok: false }
        ]
      },
      {
        q: 'Was gilt für Var(aX + b)?',
        opts: [
          { t: 'Var(aX + b) = a · Var(X) + b', ok: false },
          { t: 'Var(aX + b) = a² · Var(X)', ok: true },
          { t: 'Var(aX + b) = a² · Var(X) + b²', ok: false },
          { t: 'Var(aX + b) = Var(X)', ok: false }
        ]
      },
      {
        q: 'E[X] = 3, E[X²] = 13. Was ist Var(X)?',
        opts: [
          { t: '4', ok: true },
          { t: '10', ok: false },
          { t: '22', ok: false },
          { t: '9', ok: false }
        ]
      }
    ]
  },
  wr4q7: {
    name: 'Binomialkoeffizient',
    qs: [
      {
        q: 'Wie lautet die Formel für den Binomialkoeffizienten C(n,k)?',
        opts: [
          { t: 'n! · k!', ok: false },
          { t: 'n! / (k! · (n−k)!)', ok: true },
          { t: 'n / (k · (n−k))', ok: false },
          { t: '(n−k)! / (n! · k!)', ok: false }
        ]
      },
      {
        q: 'Wie groß ist C(5, 2)?',
        opts: [
          { t: '20', ok: false },
          { t: '5', ok: false },
          { t: '10', ok: true },
          { t: '25', ok: false }
        ]
      },
      {
        q: 'Was gilt für C(n, k) und C(n, n−k)?',
        opts: [
          { t: 'C(n,k) = 2 · C(n, n−k)', ok: false },
          { t: 'C(n,k) = C(n, n−k)', ok: true },
          { t: 'C(n,k) + C(n, n−k) = n', ok: false },
          { t: 'C(n,k) · C(n, n−k) = n!', ok: false }
        ]
      },
      {
        q: 'Was ist C(n, 0) für beliebiges n ≥ 0?',
        opts: [
          { t: '0', ok: false },
          { t: 'n', ok: false },
          { t: 'n!', ok: false },
          { t: '1', ok: true }
        ]
      },
      {
        q: 'Wofür steht C(n,k) kombinatorisch?',
        opts: [
          { t: 'Anzahl geordneter k-Tupel aus n Elementen ohne Zurücklegen', ok: false },
          { t: 'Anzahl ungeordneter k-elementiger Teilmengen aus n Elementen', ok: true },
          { t: 'Anzahl Permutationen von n Elementen', ok: false },
          { t: 'Anzahl geordneter k-Tupel aus n Elementen mit Zurücklegen', ok: false }
        ]
      }
    ]
  },
  wr4q8: {
    name: 'Urnenmodell 3 — ohne Zurücklegen, ohne Reihenfolge',
    qs: [
      {
        q: 'Du ziehst k Kugeln aus einer Urne mit n Kugeln, ohne Zurücklegen, Reihenfolge egal. Wie viele Möglichkeiten gibt es?',
        opts: [
          { t: 'nᵏ', ok: false },
          { t: 'n! / (n−k)!', ok: false },
          { t: 'C(n, k) = n! / (k! · (n−k)!)', ok: true },
          { t: 'C(n+k−1, k)', ok: false }
        ]
      },
      {
        q: 'Wie viele Möglichkeiten gibt es, 3 Kugeln aus 8 zu ziehen (ohne Zurücklegen, ohne Reihenfolge)?',
        opts: [
          { t: '8 · 7 · 6 = 336', ok: false },
          { t: 'C(8,3) = 56', ok: true },
          { t: '8³ = 512', ok: false },
          { t: '3! = 6', ok: false }
        ]
      },
      {
        q: 'Beim Lotto zieht man 6 aus 49, Reihenfolge egal. Wie viele Tipps gibt es?',
        opts: [
          { t: '49 · 48 · 47 · 46 · 45 · 44', ok: false },
          { t: 'C(49,6) = 13.983.816', ok: true },
          { t: '49⁶', ok: false },
          { t: '6!', ok: false }
        ]
      },
      {
        q: 'Aus 5 Kugeln wird eine ungeordnete Stichprobe von 2 gezogen (ohne Zurücklegen). Wie groß ist P(genau Kugel 1 und 2 gezogen)?',
        opts: [
          { t: '1/25', ok: false },
          { t: '1/20', ok: false },
          { t: '1/10', ok: true },
          { t: '2/5', ok: false }
        ]
      },
      {
        q: 'Was ist der Unterschied zwischen Urnenmodell 2 und 3?',
        opts: [
          { t: 'Modell 2 ist mit Zurücklegen, Modell 3 ohne', ok: false },
          { t: 'Modell 2 zählt geordnete, Modell 3 ungeordnete Ergebnisse', ok: true },
          { t: 'Modell 3 erlaubt Wiederholungen, Modell 2 nicht', ok: false },
          { t: 'Es gibt keinen Unterschied', ok: false }
        ]
      }
    ]
  },
  wr4q9: {
    name: 'Urnenmodell 4 — mit Zurücklegen, ohne Reihenfolge',
    qs: [
      {
        q: 'Du ziehst k-mal aus einer Urne mit n Kugeln, mit Zurücklegen, Reihenfolge egal. Wie viele Möglichkeiten gibt es?',
        opts: [
          { t: 'nᵏ', ok: false },
          { t: 'C(n, k)', ok: false },
          { t: 'C(n+k−1, k)', ok: true },
          { t: 'n! / (n−k)!', ok: false }
        ]
      },
      {
        q: 'Du wählst 2 Mal aus {A, B, C} mit Zurücklegen, Reihenfolge egal. Wie viele Möglichkeiten gibt es?',
        opts: [
          { t: '3² = 9', ok: false },
          { t: 'C(3,2) = 3', ok: false },
          { t: 'C(4,2) = 6', ok: true },
          { t: '3 · 2 = 6 — aber anderer Grund', ok: false }
        ]
      },
      {
        q: 'Was ist der Unterschied zwischen Urnenmodell 1 und 4?',
        opts: [
          { t: 'Modell 1 ist ohne, Modell 4 mit Zurücklegen', ok: false },
          { t: 'Modell 1 zählt geordnete, Modell 4 ungeordnete Ergebnisse', ok: true },
          { t: 'In Modell 4 sind Wiederholungen verboten', ok: false },
          { t: 'Es gibt keinen Unterschied', ok: false }
        ]
      },
      {
        q: 'Warum gibt es bei Modell 4 weniger Ergebnisse als bei Modell 1?',
        opts: [
          { t: 'Weil man weniger oft zieht', ok: false },
          { t: 'Weil ohne Reihenfolge mehrere geordnete Ergebnisse zu einem zusammenfallen', ok: true },
          { t: 'Weil Zurücklegen die Auswahl einschränkt', ok: false },
          { t: 'Das stimmt nicht — Modell 4 hat mehr Ergebnisse', ok: false }
        ]
      },
      {
        q: 'Überblick: Welches Modell passt zu "3 Kugeln aus 5, mit Zurücklegen, Reihenfolge egal"?',
        opts: [
          { t: 'Urnenmodell 1 — nᵏ', ok: false },
          { t: 'Urnenmodell 2 — n·(n−1)·…', ok: false },
          { t: 'Urnenmodell 3 — C(n,k)', ok: false },
          { t: 'Urnenmodell 4 — C(n+k−1,k)', ok: true }
        ]
      }
    ]
  }
};

function wr4InitQuiz(id) {
  var data = WR4_DATA[id];
  wr4S = {
    id: id,
    name: data.name,
    qs: data.qs.map(function(q) {
      return { q: q.q, opts: wr4Shuf(q.opts), chosen: -1 };
    }),
    idx: 0,
    done: false
  };
  wr4RenderQuiz();
}

function wr4RenderQuiz() {
  var s = wr4S, body = '';

  if (!s.done) {
    var q = s.qs[s.idx];
    var pct = Math.round((s.idx / s.qs.length) * 100);

    body += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">';
    body += '<span style="font-size:7px;color:#454575;letter-spacing:2px">' + (s.idx+1) + ' / ' + s.qs.length + '</span></div>';
    body += '<div style="height:3px;background:#111128;margin-bottom:0">'
          + '<div style="width:' + pct + '%;height:100%;background:#e8a835"></div></div>';

    body += '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px 0">';
    body += '<div style="background:#08081a;border:2px solid #252560;padding:28px 24px;width:100%;text-align:center">';
    body += '<div style="font-size:24px;color:#ffd700;line-height:1.5;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:0.5px">' + q.q + '</div>';
    body += '</div></div>';

    body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">';
    q.opts.forEach(function(o, i) {
      var on = q.chosen === i;
      body += '<div onclick="wr4Pick(' + i + ')" style="cursor:pointer;padding:18px 12px;border:2px solid '
        + (on ? '#e8a835' : '#1e1e4e') + ';background:' + (on ? '#1a1000' : '#08081e')
        + ';font-size:18px;color:' + (on ? '#ffffff' : '#d0d0f0') + ';text-align:center;line-height:1.6;min-height:62px;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif">'
        + o.t + '</div>';
    });
    body += '</div>';

    if (q.chosen >= 0) {
      body += '<button class="rbtn action-btn" onclick="wr4Next()" style="width:100%;padding:15px 0;font-size:8px">'
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

    body += '<button class="rbtn action-btn" onclick="completeMiniGame(\'' + s.id + '\',' + stars + ',' + wr4Reward() + ')" style="width:100%;margin-top:14px;padding:15px 0">Abschließen &#128176;</button>';
  }

  showMiniUI(
    '<div class="mini-screen">' + wr4Hdr(s.name)
    + '<div style="flex:1;display:flex;flex-direction:column;padding:22px 32px;overflow-y:auto">' + body + '</div></div>'
  );
}

function wr4Pick(i) { wr4S.qs[wr4S.idx].chosen = i; wr4RenderQuiz(); }
function wr4Next() {
  var s = wr4S;
  if (s.idx < s.qs.length - 1) s.idx++;
  else s.done = true;
  wr4RenderQuiz();
}
