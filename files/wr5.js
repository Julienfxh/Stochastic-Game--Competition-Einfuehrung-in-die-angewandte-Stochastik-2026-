// ============================================================
// WR5 – Verteilungsmodelle, Kovarianz, Bedingte Dichten
// ============================================================

var wr5S = null;

function wr5Shuf(a) {
  var b = a.slice();
  for (var i = b.length - 1; i > 0; i--) {
    var j = 0 | (Math.random() * (i + 1));
    var t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}

function wr5Hdr(title) {
  var lv = G.selectedLevel;
  return '<div class="mini-header" style="border-color:' + lv.color + '">'
    + '<span style="font-size:18px">' + lv.icon + '</span>&nbsp;' + title
    + '<span class="coin-display">&#128176; ' + G.coins + '</span>'
    + '<button class="rbtn" onclick="openLevelSelect(G.selectedLevel)">Zurück</button>'
    + '</div>';
}

function wr5Reward() {
  var id = wr5S.id, r = 60;
  G.selectedLevel.games.forEach(function(g) { if (g.id === id) r = g.reward; });
  return r;
}

function wr5Open(id) {
  G.screen = 'minigame';
  wr5InitQuiz(id);
}

var WR5_DATA = {
  wr5q1: {
    name: 'Hypergeometrische Verteilung',
    qs: [
      {
        q: 'Was ist das Urnenmodell der hypergeometrischen Verteilung?',
        opts: [
          { t: 'N Kugeln (R rot, B=N−R blau), ziehe n ohne Zurücklegen — X = Anzahl roter', ok: true },
          { t: 'N Kugeln, ziehe n mit Zurücklegen — X = Anzahl roter Kugeln', ok: false },
          { t: 'Warte auf die erste rote Kugel beim sequentiellen Ziehen', ok: false },
          { t: 'N Kugeln, ziehe solange bis k rote gezogen wurden', ok: false }
        ]
      },
      {
        q: 'Wie lautet P(X = r) bei der hypergeometrischen Verteilung mit Parametern N, R, B=N−R, n?',
        opts: [
          { t: 'C(R,r) · C(B,n−r) / C(N,n)', ok: true },
          { t: 'C(N,r) · (R/N)ʳ · (B/N)^(n−r)', ok: false },
          { t: 'C(R,r) / C(N,n)', ok: false },
          { t: 'r/n · R/N', ok: false }
        ]
      },
      {
        q: 'N=10, R=4, Stichprobe n=3. Wie viele rote Kugeln können maximal in der Stichprobe sein?',
        opts: [
          { t: '4', ok: false },
          { t: '3', ok: true },
          { t: '10', ok: false },
          { t: '7', ok: false }
        ]
      },
      {
        q: 'Wann verwendet man die hypergeometrische statt der Binomialverteilung?',
        opts: [
          { t: 'Wenn n sehr groß ist', ok: false },
          { t: 'Wenn ohne Zurücklegen aus einer endlichen Grundgesamtheit gezogen wird', ok: true },
          { t: 'Wenn p unbekannt ist', ok: false },
          { t: 'Wenn die Zufallsvariable stetig ist', ok: false }
        ]
      },
      {
        q: 'Eine Lieferung hat N=100 Teile, davon R=10 defekt. Du ziehst n=5. Welche Verteilung passt für X = Anzahl defekter in der Stichprobe?',
        opts: [
          { t: 'Binomialverteilung B(5, 0,1)', ok: false },
          { t: 'Hypergeometrische Verteilung mit N=100, R=10, n=5', ok: true },
          { t: 'Poisson-Verteilung mit λ=0,5', ok: false },
          { t: 'Geometrische Verteilung mit p=0,1', ok: false }
        ]
      }
    ]
  },
  wr5q2: {
    name: 'Geometrische Verteilung',
    qs: [
      {
        q: 'Was modelliert die geometrische Verteilung T ~ Geo(p)?',
        opts: [
          { t: 'Anzahl der Erfolge in n unabhängigen Versuchen', ok: false },
          { t: 'Anzahl der Versuche bis zum ersten Erfolg in einer Bernoulli-Folge', ok: true },
          { t: 'Anzahl von Ereignissen in einem festen Zeitintervall', ok: false },
          { t: 'Wartezeit zwischen zwei aufeinanderfolgenden Ereignissen', ok: false }
        ]
      },
      {
        q: 'T ~ Geo(p). Wie lautet P(T = n) für n = 1, 2, 3, ...?',
        opts: [
          { t: 'p^(n−1) · (1−p)', ok: false },
          { t: '(1−p)^n · p', ok: false },
          { t: '(1−p)^(n−1) · p', ok: true },
          { t: 'C(n,1) · p · (1−p)^(n−1)', ok: false }
        ]
      },
      {
        q: 'T ~ Geo(p). Was ist E[T]?',
        opts: [
          { t: 'p', ok: false },
          { t: '(1−p)/p', ok: false },
          { t: '1/(1−p)', ok: false },
          { t: '1/p', ok: true }
        ]
      },
      {
        q: 'T ~ Geo(p). Was ist Var(T)?',
        opts: [
          { t: '1/p²', ok: false },
          { t: '(1−p)/p²', ok: true },
          { t: 'p/(1−p)²', ok: false },
          { t: '1/p', ok: false }
        ]
      },
      {
        q: 'Du wirfst einen fairen sechsseitigen Würfel. T = erster Wurf, bei dem eine 6 fällt. Wie groß ist P(T = 3)?',
        opts: [
          { t: '(1/6)³ = 1/216', ok: false },
          { t: '(5/6)² · (1/6) = 25/216 ≈ 0,116', ok: true },
          { t: '(5/6)³ ≈ 0,579', ok: false },
          { t: '3 · (1/6) · (5/6)² = 75/216', ok: false }
        ]
      }
    ]
  },
  wr5q3: {
    name: 'Poisson-Verteilung',
    qs: [
      {
        q: 'Welche Formel gilt für Y ~ Poi(λ)?',
        opts: [
          { t: 'P(Y = k) = λ^k/k! · e^(−λ) für k = 0, 1, 2, ...', ok: true },
          { t: 'P(Y = k) = C(n,k) · λ^k · (1−λ)^(n−k)', ok: false },
          { t: 'P(Y = k) = e^(−k) · λ^k / k!', ok: false },
          { t: 'P(Y = k) = (1−λ)^(k−1) · λ', ok: false }
        ]
      },
      {
        q: 'Y ~ Poi(λ). Was gilt für E[Y] und Var(Y)?',
        opts: [
          { t: 'E[Y] = λ, Var(Y) = λ²', ok: false },
          { t: 'E[Y] = 1/λ, Var(Y) = 1/λ²', ok: false },
          { t: 'E[Y] = λ, Var(Y) = λ', ok: true },
          { t: 'E[Y] = λ², Var(Y) = λ', ok: false }
        ]
      },
      {
        q: 'Y ~ Poi(3). Wie groß ist P(Y = 0)?',
        opts: [
          { t: '0 — bei λ=3 ist P(Y=0) ausgeschlossen', ok: false },
          { t: 'e^(−3) ≈ 0,0498', ok: true },
          { t: 'e^(−3) · 3 ≈ 0,149', ok: false },
          { t: '3 · e^3 ≈ 60,3', ok: false }
        ]
      },
      {
        q: 'Wann approximiert man Bin(n, p) durch Poi(λ)?',
        opts: [
          { t: 'Wenn n groß und p nahe 1 ist, mit λ = n/p', ok: false },
          { t: 'Wenn n groß und p sehr klein ist, mit λ = np', ok: true },
          { t: 'Wenn n = λ gilt', ok: false },
          { t: 'Wenn n und p beide klein sind', ok: false }
        ]
      },
      {
        q: 'X ~ Poi(λ) und Y ~ Poi(μ) sind unabhängig. Was gilt für X + Y?',
        opts: [
          { t: 'X + Y ~ Poi(λ · μ)', ok: false },
          { t: 'X + Y ~ Poi(max(λ, μ))', ok: false },
          { t: 'X + Y ~ Poi(λ + μ)', ok: true },
          { t: 'X + Y ~ Bin(2, λ)', ok: false }
        ]
      }
    ]
  },
  wr5q4: {
    name: 'Negative Binomialverteilung',
    qs: [
      {
        q: 'Was beschreibt die negative Binomialverteilung Sₖ?',
        opts: [
          { t: 'Anzahl der Erfolge in k Bernoulli-Versuchen', ok: false },
          { t: 'Anzahl erforderlicher Versuche, um k Erfolge zu beobachten (Summe von k Geo(p)-Variablen)', ok: true },
          { t: 'Differenz zweier Binomialverteilungen mit Parametern k und p', ok: false },
          { t: 'Anzahl der Misserfolge vor dem ersten Erfolg', ok: false }
        ]
      },
      {
        q: 'Wie hängt die geometrische mit der negativen Binomialverteilung zusammen?',
        opts: [
          { t: 'Geo(p) ist ein Spezialfall der negativen Binomialverteilung mit k = 1', ok: true },
          { t: 'Negative Binomialverteilung ist Spezialfall der geometrischen Verteilung', ok: false },
          { t: 'Es gibt keinen direkten Zusammenhang', ok: false },
          { t: 'Geo(p) entspricht dem Fall k = p', ok: false }
        ]
      },
      {
        q: 'S = T₁ + T₂ + T₃ + T₄ mit Tᵢ i.i.d. Geo(p). Was ist E[S]?',
        opts: [
          { t: '4/p', ok: true },
          { t: '1/p', ok: false },
          { t: '4p', ok: false },
          { t: '4 · p · (1−p)', ok: false }
        ]
      },
      {
        q: 'Du willst dreimal hintereinander eine 6 würfeln. Wie viele Würfe brauchst du im Erwartungswert?',
        opts: [
          { t: '6', ok: false },
          { t: '18', ok: true },
          { t: '36', ok: false },
          { t: '3', ok: false }
        ]
      },
      {
        q: 'S = T₁ + ... + Tₖ mit Tᵢ i.i.d. Geo(p). Was gilt für Var(S)?',
        opts: [
          { t: 'k · (1−p) / p²', ok: true },
          { t: 'k / p', ok: false },
          { t: 'k · p / (1−p)²', ok: false },
          { t: '(1−p) / p²', ok: false }
        ]
      }
    ]
  },
  wr5q5: {
    name: 'Stetige Gleichverteilung',
    qs: [
      {
        q: 'X ~ U[a, b]. Wie lautet die Dichtefunktion f(x)?',
        opts: [
          { t: 'f(x) = 1/(b²−a²) für x ∈ [a,b], sonst 0', ok: false },
          { t: 'f(x) = 1/(b−a) für x ∈ [a,b], sonst 0', ok: true },
          { t: 'f(x) = (x−a)/(b−a)² für x ∈ [a,b], sonst 0', ok: false },
          { t: 'f(x) = 1/2 für x ∈ [a,b], sonst 0', ok: false }
        ]
      },
      {
        q: 'X ~ U[a, b]. Was ist E[X]?',
        opts: [
          { t: '(b−a)/2', ok: false },
          { t: '(a+b)/2', ok: true },
          { t: 'a + b', ok: false },
          { t: 'b/a', ok: false }
        ]
      },
      {
        q: 'X ~ U[a, b]. Was ist Var(X)?',
        opts: [
          { t: '(b−a)/12', ok: false },
          { t: '(b−a)²/12', ok: true },
          { t: '(b−a)²/4', ok: false },
          { t: '(a+b)²/12', ok: false }
        ]
      },
      {
        q: 'X ~ U[2, 8]. Was ist P(X ≤ 5)?',
        opts: [
          { t: '5/8', ok: false },
          { t: '1/2', ok: true },
          { t: '5/6', ok: false },
          { t: '3/8', ok: false }
        ]
      },
      {
        q: 'X ~ U[0, 10]. Was sind E[X] und Var(X)?',
        opts: [
          { t: 'E[X] = 5, Var(X) = 100/12 ≈ 8,33', ok: true },
          { t: 'E[X] = 5, Var(X) = 10', ok: false },
          { t: 'E[X] = 10, Var(X) = 25', ok: false },
          { t: 'E[X] = 0, Var(X) = 100', ok: false }
        ]
      }
    ]
  },
  wr5q6: {
    name: 'Exponentialverteilung',
    qs: [
      {
        q: 'X ~ Exp(λ). Welche Dichtefunktion hat X?',
        opts: [
          { t: 'f(x) = e^(−λx) für x > 0', ok: false },
          { t: 'f(x) = λ · e^(−λx) für x > 0, sonst 0', ok: true },
          { t: 'f(x) = λ · e^(λx) für x > 0', ok: false },
          { t: 'f(x) = (1/λ) · e^(−x/λ²) für x > 0', ok: false }
        ]
      },
      {
        q: 'X ~ Exp(λ). Was ist E[X]?',
        opts: [
          { t: 'λ', ok: false },
          { t: 'λ²', ok: false },
          { t: '1/λ²', ok: false },
          { t: '1/λ', ok: true }
        ]
      },
      {
        q: 'X ~ Exp(λ). Wie lautet die Verteilungsfunktion F(x) für x > 0?',
        opts: [
          { t: 'F(x) = e^(−λx)', ok: false },
          { t: 'F(x) = 1 − e^(−λx)', ok: true },
          { t: 'F(x) = 1 − e^(λx)', ok: false },
          { t: 'F(x) = λ · e^(−λx)', ok: false }
        ]
      },
      {
        q: 'X ~ Exp(λ). Was ist Var(X)?',
        opts: [
          { t: '1/λ', ok: false },
          { t: '1/λ²', ok: true },
          { t: 'λ', ok: false },
          { t: 'λ²', ok: false }
        ]
      },
      {
        q: 'X ist die Wartezeit auf das erste Poisson-Ereignis, Yₜ ~ Poi(λt). Welche Verbindung gilt?',
        opts: [
          { t: 'P(X > t) = P(Yₜ = 0) = e^(−λt)', ok: true },
          { t: 'P(X > t) = λ · e^(−λt)', ok: false },
          { t: 'P(X > t) = 1 − e^(−λt)', ok: false },
          { t: 'P(X > t) = P(Yₜ > 0)', ok: false }
        ]
      }
    ]
  },
  wr5q7: {
    name: 'Normalverteilung',
    qs: [
      {
        q: 'X ~ N(μ, σ²). Wie lautet die Dichtefunktion?',
        opts: [
          { t: 'φ(x) = exp(−(x−μ)²) / (2σ²)', ok: false },
          { t: 'φ(x) = 1/√(2πσ²) · exp(−(x−μ)²/(2σ²))', ok: true },
          { t: 'φ(x) = σ/√(2π) · exp(−(x−μ)²/(2σ))', ok: false },
          { t: 'φ(x) = 1/(2πσ) · exp(−(x−μ)/σ²)', ok: false }
        ]
      },
      {
        q: 'X ~ N(μ, σ²). Was sind E[X] und Var(X)?',
        opts: [
          { t: 'E[X] = σ, Var(X) = μ', ok: false },
          { t: 'E[X] = 0, Var(X) = 1', ok: false },
          { t: 'E[X] = μ, Var(X) = σ', ok: false },
          { t: 'E[X] = μ, Var(X) = σ²', ok: true }
        ]
      },
      {
        q: 'Was ist die Standardnormalverteilung N(0, 1)?',
        opts: [
          { t: 'Eine Normalverteilung mit μ = 0 und σ² = 1', ok: true },
          { t: 'Eine Normalverteilung mit μ = 1 und σ² = 0', ok: false },
          { t: 'Eine Normalverteilung mit μ = σ', ok: false },
          { t: 'Nur definiert für positive Werte', ok: false }
        ]
      },
      {
        q: 'X ~ N(μ, σ²). Wie standardisiert man X zu Z ~ N(0, 1)?',
        opts: [
          { t: 'Z = X + μ/σ', ok: false },
          { t: 'Z = (X − μ) · σ', ok: false },
          { t: 'Z = (X − μ)/σ', ok: true },
          { t: 'Z = X/σ − μ', ok: false }
        ]
      },
      {
        q: 'Die Normalverteilung ist symmetrisch um μ. Was folgt für P(X < μ)?',
        opts: [
          { t: 'P(X < μ) = 0', ok: false },
          { t: 'P(X < μ) = 1/3', ok: false },
          { t: 'P(X < μ) = 3/4', ok: false },
          { t: 'P(X < μ) = 1/2', ok: true }
        ]
      }
    ]
  },
  wr5q8: {
    name: 'Kovarianz & Korrelation',
    qs: [
      {
        q: 'Wie ist die Kovarianz Cov(X, Y) definiert?',
        opts: [
          { t: 'Cov(X,Y) = E[X] · E[Y]', ok: false },
          { t: 'Cov(X,Y) = E[(X − μX)(Y − μY)]', ok: true },
          { t: 'Cov(X,Y) = Var(X + Y)', ok: false },
          { t: 'Cov(X,Y) = E[X · Y] − E[X] − E[Y]', ok: false }
        ]
      },
      {
        q: 'X und Y sind stochastisch unabhängig. Was gilt für Cov(X, Y)?',
        opts: [
          { t: 'Cov(X,Y) = 1', ok: false },
          { t: 'Cov(X,Y) = Var(X) + Var(Y)', ok: false },
          { t: 'Cov(X,Y) = 0', ok: true },
          { t: 'Cov(X,Y) = E[X] · E[Y]', ok: false }
        ]
      },
      {
        q: 'Was ist Cov(aX, bY) in Termen von Cov(X, Y)?',
        opts: [
          { t: '(a + b) · Cov(X,Y)', ok: false },
          { t: 'a · b · Cov(X,Y)', ok: true },
          { t: 'a/b · Cov(X,Y)', ok: false },
          { t: 'Cov(X,Y)', ok: false }
        ]
      },
      {
        q: 'Wie ist die Korrelation Cor(X, Y) definiert?',
        opts: [
          { t: 'Cor(X,Y) = Cov(X,Y) / (Var(X) + Var(Y))', ok: false },
          { t: 'Cor(X,Y) = Cov(X,Y) / (Var(X) · Var(Y))', ok: false },
          { t: 'Cor(X,Y) = Cov(X,Y) / (σX · σY)', ok: true },
          { t: 'Cor(X,Y) = (Cov(X,Y))²', ok: false }
        ]
      },
      {
        q: 'Welche Werte kann Cor(X, Y) annehmen (Cauchy-Schwarz)?',
        opts: [
          { t: '[0, 1]', ok: false },
          { t: '[0, ∞)', ok: false },
          { t: '[−1, 1]', ok: true },
          { t: '(−∞, ∞)', ok: false }
        ]
      }
    ]
  },
  wr5q9: {
    name: 'Bedingte Dichten & Simpsons Paradoxon',
    qs: [
      {
        q: 'X, Y stetig mit gemeinsamer Dichte f(x,y). Wie lautet die bedingte Dichte f(x|y) für f_Y(y) > 0?',
        opts: [
          { t: 'f(x|y) = f(x,y) · f_Y(y)', ok: false },
          { t: 'f(x|y) = f_Y(y) / f(x,y)', ok: false },
          { t: 'f(x|y) = f(x,y) / f_Y(y)', ok: true },
          { t: 'f(x|y) = f_X(x) / f_Y(y)', ok: false }
        ]
      },
      {
        q: 'Wann sind stetige X und Y stochastisch unabhängig?',
        opts: [
          { t: 'Wenn f(x,y) = f_X(x) + f_Y(y) für alle x, y', ok: false },
          { t: 'Wenn f(x,y) = f_X(x) · f_Y(y) für alle x, y', ok: true },
          { t: 'Wenn E[X] = E[Y]', ok: false },
          { t: 'Wenn Cov(X,Y) = 0 — das reicht für Unabhängigkeit', ok: false }
        ]
      },
      {
        q: 'Wie berechnet man E(X | Y = y) für stetige Zufallsvariablen?',
        opts: [
          { t: 'E(X|Y=y) = ∫ x · f_X(x) dx', ok: false },
          { t: 'E(X|Y=y) = ∫ x · f(x,y) dx', ok: false },
          { t: 'E(X|Y=y) = ∫ x · f(x|y) dx', ok: true },
          { t: 'E(X|Y=y) = f(x|y) / f_Y(y)', ok: false }
        ]
      },
      {
        q: 'Was beschreibt Simpsons Paradoxon?',
        opts: [
          { t: 'Ein Rechenfehler bei bedingten Wahrscheinlichkeiten', ok: false },
          { t: 'Ein Trend in Teilgruppen kann sich in der aggregierten Tabelle umkehren', ok: true },
          { t: 'Die Summe zweier Normalverteilungen ist immer normalverteilt', ok: false },
          { t: 'Bei großen Stichproben gilt das Gesetz der großen Zahlen', ok: false }
        ]
      },
      {
        q: 'Cov(X,Y) = 0 — folgt daraus stochastische Unabhängigkeit?',
        opts: [
          { t: 'Ja, Unkorreliertheit bedeutet immer Unabhängigkeit', ok: false },
          { t: 'Nein, Unabhängigkeit impliziert Cov=0, aber nicht umgekehrt', ok: true },
          { t: 'Ja, aber nur bei diskreten Zufallsvariablen', ok: false },
          { t: 'Ja, sofern zusätzlich E[X] = E[Y] gilt', ok: false }
        ]
      }
    ]
  }
};

function wr5InitQuiz(id) {
  var data = WR5_DATA[id];
  wr5S = {
    id: id,
    name: data.name,
    qs: data.qs.map(function(q) {
      return { q: q.q, opts: wr5Shuf(q.opts), chosen: -1 };
    }),
    idx: 0,
    done: false
  };
  wr5RenderQuiz();
}

function wr5RenderQuiz() {
  var s = wr5S, body = '';

  if (!s.done) {
    var q = s.qs[s.idx];
    var pct = Math.round((s.idx / s.qs.length) * 100);

    body += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">';
    body += '<span style="font-size:7px;color:#454575;letter-spacing:2px">' + (s.idx+1) + ' / ' + s.qs.length + '</span></div>';
    body += '<div style="height:3px;background:#111128;margin-bottom:0">'
          + '<div style="width:' + pct + '%;height:100%;background:#50b050"></div></div>';

    body += '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px 0">';
    body += '<div style="background:#08081a;border:2px solid #252560;padding:28px 24px;width:100%;text-align:center">';
    body += '<div style="font-size:24px;color:#ffd700;line-height:1.5;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:0.5px">' + q.q + '</div>';
    body += '</div></div>';

    body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">';
    q.opts.forEach(function(o, i) {
      var on = q.chosen === i;
      body += '<div onclick="wr5Pick(' + i + ')" style="cursor:pointer;padding:18px 12px;border:2px solid '
        + (on ? '#50b050' : '#1e1e4e') + ';background:' + (on ? '#001800' : '#08081e')
        + ';font-size:18px;color:' + (on ? '#ffffff' : '#d0d0f0') + ';text-align:center;line-height:1.6;min-height:62px;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif">'
        + o.t + '</div>';
    });
    body += '</div>';

    if (q.chosen >= 0) {
      body += '<button class="rbtn action-btn" onclick="wr5Next()" style="width:100%;padding:15px 0;font-size:8px">'
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

    body += '<button class="rbtn action-btn" onclick="completeMiniGame(\'' + s.id + '\',' + stars + ',' + wr5Reward() + ')" style="width:100%;margin-top:14px;padding:15px 0">Abschließen &#128176;</button>';
  }

  showMiniUI(
    '<div class="mini-screen">' + wr5Hdr(s.name)
    + '<div style="flex:1;display:flex;flex-direction:column;padding:22px 32px;overflow-y:auto">' + body + '</div></div>'
  );
}

function wr5Pick(i) { wr5S.qs[wr5S.idx].chosen = i; wr5RenderQuiz(); }
function wr5Next() {
  var s = wr5S;
  if (s.idx < s.qs.length - 1) s.idx++;
  else s.done = true;
  wr5RenderQuiz();
}
