// ============================================================
// HORSE RACING
// ============================================================

var HORSE_NAMES = ['Blitz','Donner','Stochasto','Bernoulli'];
var HORSE_COLS  = ['#e04040','#4080e0','#40b040','#d0a020'];
var hrHorses = [], hrBet = 0, hrPick = -1, hrRacing = false, hrResult = null;

function generateHorses() {
  var types = ['normal','exponential','uniform'];
  var horses = [];
  for (var i = 0; i < 4; i++) {
    var t = types[Math.floor(Math.random() * types.length)];
    var d = { type: t };
    if (t === 'normal') {
      d.mu    = Math.round((3 + Math.random()*5)*10)/10;
      d.sigma = Math.round((0.5 + Math.random()*2)*10)/10;
      d.label = 'N(μ=' + d.mu + ', σ=' + d.sigma + ')';
      d.ev    = d.mu;
    } else if (t === 'exponential') {
      d.lambda = Math.round((0.15 + Math.random()*0.85)*100)/100;
      d.label  = 'Exp(λ=' + d.lambda + ')';
      d.ev     = Math.round(1/d.lambda*10)/10;
    } else {
      d.a     = Math.round(Math.random()*4*10)/10;
      d.b     = Math.round((d.a + 2 + Math.random()*6)*10)/10;
      d.label = 'U(' + d.a + ', ' + d.b + ')';
      d.ev    = Math.round((d.a+d.b)/2*10)/10;
    }
    horses.push({ name: HORSE_NAMES[i], color: HORSE_COLS[i], dist: d, pos: 0 });
  }
  return horses;
}

function sampleDist(d) {
  if (d.type === 'normal') {
    var u1 = Math.random(), u2 = Math.random();
    return d.mu + d.sigma * Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2);
  } else if (d.type === 'exponential') {
    return -Math.log(Math.random()) / d.lambda;
  } else {
    return d.a + Math.random() * (d.b - d.a);
  }
}

function pdfVal(d, x) {
  if (d.type === 'normal') {
    var z = (x-d.mu)/d.sigma;
    return Math.exp(-0.5*z*z) / (d.sigma*Math.sqrt(2*Math.PI));
  } else if (d.type === 'exponential') {
    return x < 0 ? 0 : d.lambda * Math.exp(-d.lambda*x);
  } else {
    return (x >= d.a && x <= d.b) ? 1/(d.b-d.a) : 0;
  }
}

function drawDensitySVG(d, color, w, h) {
  var pts = 60;
  var xMin = 0, xMax = 12;
  if (d.type === 'uniform') { xMin = Math.max(0, d.a-0.5); xMax = d.b+0.5; }
  if (d.type === 'exponential') { xMax = Math.min(20, 6/d.lambda); }
  var maxY = 0, points = [];
  for (var i = 0; i <= pts; i++) {
    var x = xMin + (xMax-xMin)*i/pts;
    var y = pdfVal(d, x);
    if (y > maxY) maxY = y;
    points.push({x:x, y:y});
  }
  if (maxY === 0) maxY = 1;
  var pad = 4;
  var path = '', fill = '';
  points.forEach(function(p, j) {
    var px = pad + (p.x-xMin)/(xMax-xMin)*(w-2*pad);
    var py = h - pad - (p.y/maxY)*(h-2*pad-6);
    path += (j===0?'M ':'L ') + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
    fill += (j===0?'M ':'L ') + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
  });
  fill += 'L '+(w-pad)+' '+(h-pad)+' L '+pad+' '+(h-pad)+' Z';

  // EV line
  var evX = pad + (d.ev-xMin)/(xMax-xMin)*(w-2*pad);

  return '<svg width="'+w+'" height="'+h+'" style="display:block">'
    + '<path d="'+fill+'" fill="'+color+'25" stroke="none"/>'
    + '<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="2.5"/>'
    + '<line x1="'+pad+'" y1="'+(h-pad)+'" x2="'+(w-pad)+'" y2="'+(h-pad)+'" stroke="#333" stroke-width="1"/>'
    + (d.ev >= xMin && d.ev <= xMax
        ? '<line x1="'+evX.toFixed(1)+'" y1="6" x2="'+evX.toFixed(1)+'" y2="'+(h-pad)+'" stroke="'+color+'" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.7"/>'
        : '')
    + '</svg>';
}

function openHorses() {
  G.screen = 'horses';
  hrHorses = generateHorses();
  // pre-generate 5 sample past times per horse
  hrHorses.forEach(function(h) {
    h.samples = [];
    for (var i = 0; i < 5; i++) h.samples.push(Math.round(Math.max(0.1, sampleDist(h.dist))*10)/10);
  });
  hrBet = 0; hrPick = -1; hrRacing = false; hrResult = null;
  renderHorseUI();
}

function renderHorseUI() {
  var html = '<div class="mini-screen" style="background:#060d03">';

  // Header
  html += '<div class="mini-header" style="border-color:#7a5a1a">🐎 Pferderennen'
        + '<span class="coin-display">💰 <span id="hr-coins">' + G.coins + '</span></span>'
        + '<button class="rbtn" onclick="G.screen=\'casino\';closeMiniUI()">Zurück</button>'
        + '</div>';

  html += '<div style="flex:1;display:flex;flex-direction:column;padding:12px 16px;gap:10px">';

  // ── Horse cards row ───────────────────────────────────────────
  html += '<div style="display:flex;gap:8px">';
  hrHorses.forEach(function(h, i) {
    var sel = hrPick === i;
    var showEV = !!hrResult;
    html += '<div onclick="hrSelectHorse(' + i + ')" style="flex:1;cursor:pointer;border:2px solid '
          + (sel ? '#ffd700' : h.color + '55') + ';background:' + (sel ? '#0e0e04' : '#080d04')
          + ';padding:10px 8px;border-left:4px solid ' + h.color + '">';

    // Name
    html += '<div style="font-size:8px;color:' + h.color + ';letter-spacing:1px;margin-bottom:6px;font-family:inherit">'
          + (sel ? '▶ ' : '') + h.name + '</div>';

    // SVG density
    html += drawDensitySVG(h.dist, h.color, 148, 68);

    // Distribution label
    html += '<div style="font-size:11px;color:#c0c0c0;font-family:Arial,sans-serif;margin-top:6px;line-height:1.4">X ~ ' + h.dist.label + '</div>';

    // E[X]
    html += '<div style="font-size:10px;font-family:Arial,sans-serif;margin-top:4px;color:' + (showEV ? h.color : '#404040') + '">'
          + (showEV ? 'E[X] = ' + h.dist.ev : 'E[X] = ?') + '</div>';

    html += '</div>';
  });
  html += '</div>'; // horse cards

  // ── Track ─────────────────────────────────────────────────────
  html += '<div style="flex:1;background:#0a1405;border:2px solid #2a4010;padding:10px 12px;display:flex;flex-direction:column;justify-content:space-around">';
  hrHorses.forEach(function(h, i) {
    var leftPct = Math.round(h.pos * 88);
    html += '<div style="display:flex;align-items:center;gap:8px">';
    html += '<div style="width:60px;font-size:7px;color:' + h.color + ';letter-spacing:1px">' + h.name + '</div>';
    html += '<div style="flex:1;height:26px;background:#060e02;border:1px solid #1a3008;position:relative;overflow:hidden">';
    html += '<div id="hr-horse-' + i + '" style="position:absolute;left:' + leftPct + '%;top:1px;font-size:18px;line-height:24px;transition:left 0.07s">🐎</div>';
    html += '<div style="position:absolute;right:0;top:0;bottom:0;width:4px;background:#ffd700;opacity:0.8"></div>';
    html += '</div>';
    if (hrResult) {
      var spd = hrResult.speeds[i];
      var isWinner = hrResult.winner === i;
      html += '<div style="width:48px;font-size:9px;font-family:Arial,sans-serif;color:' + (isWinner ? '#ffd700' : '#506040') + ';text-align:right">'
            + (isWinner ? '🏆 ' : '') + spd + '</div>';
    }
    html += '</div>';
  });
  html += '</div>'; // track

  // ── Controls ──────────────────────────────────────────────────
  html += '<div style="display:flex;align-items:center;gap:10px">';

  if (!hrResult) {
    // Horse pick
    html += '<div style="display:flex;gap:5px">';
    hrHorses.forEach(function(h, i) {
      var sel = hrPick === i;
      html += '<div onclick="hrSelectHorse(' + i + ')" style="cursor:pointer;padding:7px 10px;border:2px solid ' + h.color
            + ';background:' + (sel ? h.color + '33' : 'transparent') + ';font-size:7px;color:' + (sel ? '#fff' : h.color) + '">'
            + h.name + '</div>';
    });
    html += '</div>';

    html += '<div style="width:2px;height:30px;background:#1a2a10"></div>';

    // Bet chips
    html += '<div style="display:flex;gap:5px">';
    [10, 25, 50, 100].forEach(function(v) {
      var act = hrBet === v;
      html += '<div onclick="hrSetBet(' + v + ')" style="cursor:pointer;width:34px;height:34px;border-radius:50%;background:' + (act?'#4a3000':'#1a2a10') + ';border:2px solid ' + (act?'#ffd700':'#3a5020') + ';display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;color:' + (act?'#ffd700':'#506040') + '">' + v + '</div>';
    });
    html += '</div>';

    html += '<div style="flex:1"></div>';

    if (hrPick >= 0 && hrBet > 0) {
      html += '<div style="font-size:8px;font-family:Arial,sans-serif;text-align:right;color:#506040;line-height:1.8">'
            + hrHorses[hrPick].name + '<br><span style="color:#ffd700">' + hrBet + ' Coins</span></div>';
    }

    html += '<button onclick="hrStartRace()" style="padding:10px 20px;background:' + (hrPick>=0&&hrBet>0&&!hrRacing?'#2a5010':'#0a1205') + ';border:3px solid ' + (hrPick>=0&&hrBet>0&&!hrRacing?'#5a9020':'#1a2a10') + ';color:' + (hrPick>=0&&hrBet>0&&!hrRacing?'#a0d040':'#2a4010') + ';font-family:inherit;font-size:8px;cursor:' + (hrPick>=0&&hrBet>0&&!hrRacing?'pointer':'default') + ';letter-spacing:3px">'
          + (hrRacing ? '· · ·' : 'START') + '</button>';

  } else {
    if (hrResult.won) {
      html += '<div style="font-size:14px;font-family:Arial,sans-serif;color:#80d040">Gewonnen! +' + hrResult.payout + ' Coins! 🏆</div>';
    } else {
      html += '<div style="font-size:14px;font-family:Arial,sans-serif;color:#c05050">Verloren! -' + hrBet + ' Coins.</div>';
    }
    html += '<div style="flex:1"></div>';
    html += '<button onclick="openHorses()" style="padding:10px 18px;background:#1a3008;border:2px solid #4a7010;color:#a0d040;font-family:inherit;font-size:8px;cursor:pointer;letter-spacing:2px">NEUES RENNEN</button>';
  }

  html += '</div>'; // controls
  html += '</div></div>';
  showMiniUI(html);
}

function hrSelectHorse(i) {
  if (hrRacing || hrResult) return;
  hrPick = i;
  renderHorseUI();
}

function hrSetBet(v) {
  hrBet = Math.min(v, G.coins);
  renderHorseUI();
}

function hrStartRace() {
  if (hrPick < 0 || hrBet <= 0 || hrBet > G.coins || hrRacing) return;
  hrRacing = true;
  renderHorseUI();

  var speeds = [];
  for (var i = 0; i < 4; i++) speeds.push(Math.max(0.5, sampleDist(hrHorses[i].dist)));
  var maxSpd = Math.max.apply(null, speeds);
  var finalPos = speeds.map(function(s) { return s / maxSpd; });

  var step = 0, maxSteps = 45;
  var interval = setInterval(function() {
    step++;
    var t = step / maxSteps;
    var ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    for (var j = 0; j < 4; j++) {
      hrHorses[j].pos = finalPos[j] * ease;
      var el = document.getElementById('hr-horse-' + j);
      if (el) el.style.left = Math.round(hrHorses[j].pos * 88) + '%';
    }
    if (step >= maxSteps) {
      clearInterval(interval);
      hrRacing = false;
      var winner = 0;
      for (var w = 1; w < 4; w++) { if (speeds[w] > speeds[winner]) winner = w; }
      var won = winner === hrPick;
      var payout = won ? hrBet * 3 : 0;
      if (won) { G.coins += payout; } else { G.coins -= hrBet; }
      hrResult = {
        winner: winner,
        speeds: speeds.map(function(s){ return Math.round(s*100)/100; }),
        won: won,
        payout: payout
      };
      document.getElementById('hr-coins').textContent = G.coins;
      renderHorseUI();
    }
  }, 55);
}
