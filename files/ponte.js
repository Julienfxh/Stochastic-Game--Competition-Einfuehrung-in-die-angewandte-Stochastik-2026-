// ============================================================
// PONTSTRASSE BAR
// ============================================================

var ponteBeers    = 0;
var barAnimId     = null;
var barAnimFrame  = 0;
var barCurrentMsg = "";

// ── Bar music (MP3) ──
var barAudio = null;

function startBarMusic() {
  if (barAudio) return;
  barAudio = new Audio("alex-morgan-smooth-jazz-lounge-relaxing-evening-537465.mp3");
  barAudio.loop = true;
  barAudio.volume = 0.5;
  barAudio.play().catch(function() {});
}

function stopBarMusic() {
  if (!barAudio) return;
  barAudio.pause();
  barAudio.currentTime = 0;
  barAudio = null;
}

var BAR_DIALOGS = [
  "Prost! P(Bier schmeckt) = 1. Sicheres Ereignis!",
  "Statistisch erhoehst du gerade E[Spass] deutlich.",
  "Ich bin hier rein zufaellig. Definitiv kein Professor.",
  "Jedes Bier ist ein unabhaengiges Bernoulli-Experiment.",
  "Nach dem Gesetz der grossen Zahlen gehst du irgendwann heim.",
  "Die Varianz deiner Klausurvorbereitung steigt messbar.",
  "E[Pontstrasse] ist signifikant hoeher als jede andere Location.",
  "Ich erkenne dich uebrigens auch nicht. Wirklich. Gar nicht.",
  "Ich bin unabhaengig von meiner Frau. Statistisch gesehen. Heute Abend.",
  "P(gute Klausur | kein Lernen) = P(gute Klausur). Das nennt man Unabhaengigkeit.",
  "Meine Frau sagt ich trinke zu viel. Ich sage, meine Stichprobe ist noch nicht gross genug.",
  "Wir sind beide Ereignisse im selben Wahrscheinlichkeitsraum. Das ist fast poetisch."
];

function openBar() {
  G.screen = "bar";
  barCurrentMsg = "";

  var html = '<div class="mini-screen" style="background:#07030f">';

  // ── Header ──────────────────────────────────────────────
  html += '<div class="mini-header" style="border-color:#6010800;flex-shrink:0">';
  html += '🍺 Pontstrasse';
  html += '<span class="coin-display">💰 <span id="bar-coins">' + G.coins + '</span></span>';
  html += '<button class="rbtn" onclick="closeBar()">← Campus</button>';
  html += '</div>';

  // ── Scene canvas ────────────────────────────────────────
  html += '<div style="flex:1;min-height:0;overflow:hidden">';
  html += '<canvas id="bar-scene" style="width:100%;height:100%;display:block"></canvas>';
  html += '</div>';

  // ── Bottom panel (always visible, fixed height) ─────────
  html += '<div style="flex-shrink:0;background:#060114;border-top:2px solid #4a0870;padding:20px 28px;display:flex;align-items:center;gap:24px;min-height:220px">';

  // Left: speech text + beer count
  html += '<div style="flex:1;min-width:0">';
  html += '<div style="font-size:8px;color:#a040c0;margin-bottom:6px;letter-spacing:1px">Unbekannter Professor St...</div>';
  html += '<div id="bar-speech-text" style="font-size:20px;color:#e8e8f8;line-height:1.8;margin-bottom:8px">Bestell ein Bier.</div>';
  html += '<div id="bar-beers" style="font-size:13px;letter-spacing:3px;min-height:16px">';
  for (var i = 0; i < Math.min(ponteBeers, 12); i++) html += '🍺';
  html += '</div></div>';

  // Right: order button (beer is free)
  html += '<button class="rbtn" id="bar-order-btn" onclick="buyBeer()" style="flex-shrink:0;background:#220a3a;border-color:#7010a0;padding:12px 20px;text-align:center">';
  html += '<div style="font-size:9px">🍺 BIER</div><div style="font-size:7px;color:#7010a0;margin-top:4px">GRATIS</div>';
  html += '</button>';

  html += '</div>';
  html += '</div>';

  showMiniUI(html);
  barAnimFrame = 0;
  barSceneLoop();
  startBarMusic();
}

function closeBar() {
  stopBarMusic();
  G.screen = "overworld";
  closeMiniUI();
}

function barSceneLoop() {
  if (G.screen !== "bar") { stopBarMusic(); barAnimId = null; return; }
  var cv = document.getElementById("bar-scene");
  if (!cv) { barAnimId = null; return; }
  var ow = cv.offsetWidth, oh = cv.offsetHeight;
  if (ow > 0 && oh > 0 && (cv.width !== ow || cv.height !== oh)) {
    cv.width = ow; cv.height = oh;
  }
  barAnimFrame++;
  if (cv.width > 0 && cv.height > 0) drawBarScene(cv);
  barAnimId = requestAnimationFrame(barSceneLoop);
}

// ── Scene ─────────────────────────────────────────────────

function drawBarScene(cv) {
  var c = cv.getContext("2d");
  var W = cv.width, H = cv.height;

  // Counter sits low so professor fills the frame
  var cY = Math.round(H * 0.68);

  // Character scale: fits width and height
  var charH = Math.min(Math.round(H * 0.88), Math.round(W * 0.52));
  var s     = charH / 72;
  // Professor centered, top half visible above counter
  var charCX  = Math.round(W * 0.60);
  var charTop = cY - Math.round(charH * 0.50);

  // ── Background ──
  c.fillStyle = "#06020c";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#0a0318";
  c.fillRect(0, 0, W, cY);

  // Subtle wall panels
  c.strokeStyle = "#100628"; c.lineWidth = Math.max(1, Math.round(W * 0.002));
  for (var p = 0; p < W; p += Math.round(W * 0.14)) {
    c.beginPath(); c.moveTo(p, 0); c.lineTo(p, cY); c.stroke();
  }
  c.lineWidth = 1;

  // Light cones
  [0.12, 0.5, 0.88].forEach(function(lf) {
    var lx = Math.round(W * lf);
    var lg = c.createRadialGradient(lx, 0, 0, lx, 0, H * 0.85);
    lg.addColorStop(0, "rgba(255,200,80,0.14)");
    lg.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = lg;
    c.fillRect(lx - Math.round(W*0.24), 0, Math.round(W*0.48), Math.round(H*0.72));
    c.fillStyle = "#907800";
    c.fillRect(lx - Math.round(W*0.018), 0, Math.round(W*0.036), Math.round(H*0.018));
    c.fillStyle = "#ffe850";
    c.shadowColor = "#ffe050"; c.shadowBlur = Math.round(H*0.03);
    c.fillRect(lx - Math.round(W*0.012), Math.round(H*0.017), Math.round(W*0.024), Math.round(H*0.022));
    c.shadowBlur = 0;
  });

  // Shelves + bottles
  var bc = ["#881010","#105a28","#102060","#987010","#601080","#b05010"];
  [H * 0.07, H * 0.23].forEach(function(sy, ri) {
    sy = Math.round(sy);
    c.fillStyle = "#241006";
    c.fillRect(Math.round(W*0.02), sy, Math.round(W*0.96), Math.round(H*0.022));
    c.fillStyle = "#180c04";
    c.fillRect(Math.round(W*0.02), sy+Math.round(H*0.022), Math.round(W*0.96), Math.round(H*0.009));
    var bh = H * 0.095, cols = ri === 0 ? 14 : 11;
    var spacing = (W * 0.94) / cols;
    for (var b = 0; b < cols; b++) {
      barBottle(c, W*0.03 + b*spacing, sy - bh, bh, bc[(b + ri*3) % 6]);
    }
  });

  // Neon sign
  var nf = barAnimFrame;
  var fl = 1 - (nf%120===0?0.85:0) - (nf%120===2?0.4:0);
  var na = (0.82 + Math.sin(nf*0.032)*0.16) * fl;
  c.save();
  c.shadowColor = "rgba(170,45,195,"+na+")"; c.shadowBlur = Math.round(H*0.055);
  c.fillStyle   = "rgba(215,75,235,"+Math.max(0.15,na)+")";
  c.font        = "bold " + Math.round(H*0.062) + "px 'Press Start 2P',monospace";
  c.textAlign   = "center";
  c.fillText("★  PONTE  ★", W/2, Math.round(H*0.185));
  c.textAlign = "left"; c.shadowBlur = 0;
  c.restore();

  // ── Professor (drawn first, counter masks lower body) ──
  barProf(c, charCX, charTop, s);

  // ── Counter (drawn on top) ──────────────────────────────
  var c1 = Math.round(H*0.013), c2 = Math.round(H*0.025), c3 = Math.round(H*0.14);
  // Top highlight strip
  c.fillStyle = "#7a4020"; c.fillRect(0, cY,    W, c1);
  // Main top surface
  c.fillStyle = "#562a10"; c.fillRect(0, cY+c1, W, c2);
  // Counter face (dark wood)
  c.fillStyle = "#160804"; c.fillRect(0, cY+c1+c2, W, c3);
  // Wood grain on top surface
  c.strokeStyle = "rgba(100,55,18,0.3)"; c.lineWidth = 1;
  for (var g = 0; g < 7; g++) {
    c.beginPath();
    c.moveTo(0,   cY+c1+g*2);
    c.bezierCurveTo(W*0.3, cY+c1+g*2-1, W*0.65, cY+c1+g*2+2, W, cY+c1+g*2);
    c.stroke();
  }
  // Edge glow
  var eg = c.createLinearGradient(0, cY-H*0.04, 0, cY+H*0.04);
  eg.addColorStop(0, "rgba(0,0,0,0)");
  eg.addColorStop(0.5, "rgba(220,120,40,0.1)");
  eg.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = eg; c.fillRect(0, cY-H*0.04, W, H*0.08);

  // Beer mugs on counter
  var mugH = Math.round(H * 0.11), mugW = Math.round(mugH * 0.72);
  barMug(c, Math.round(W/2 - mugW*1.5), cY - mugH + Math.round(H*0.01), mugW, mugH, ponteBeers>=1, nf);
  barMug(c, Math.round(W/2 + mugW*0.5), cY - mugH + Math.round(H*0.01), mugW, mugH, ponteBeers>=2, nf+30);

  // Floor strip below counter
  var flY = cY + c1 + c2 + c3;
  c.fillStyle = "#0c0512";
  c.fillRect(0, flY, W, H - flY);

  // Vignette
  var v = c.createRadialGradient(W/2, H, 0, W/2, H*0.4, W*0.75);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.52)");
  c.fillStyle = v; c.fillRect(0, 0, W, H);
}

function barBottle(c, x, topY, bh, col) {
  var bw = Math.round(bh * 0.27), nx = Math.round(x), ny = Math.round(topY);
  c.fillStyle = col;
  c.fillRect(nx,                     ny+Math.round(bh*0.28), bw,                   Math.round(bh*0.56));
  c.fillRect(nx+Math.round(bw*0.18), ny+Math.round(bh*0.08), Math.round(bw*0.64), Math.round(bh*0.22));
  c.fillRect(nx+Math.round(bw*0.27), ny,                     Math.round(bw*0.45), Math.round(bh*0.1));
  c.fillStyle = "#b89800";
  c.fillRect(nx+Math.round(bw*0.18), ny-Math.round(bh*0.05), Math.round(bw*0.64), Math.round(bh*0.07));
  c.fillStyle = "rgba(255,255,255,0.11)";
  c.fillRect(nx+1, ny+Math.round(bh*0.3), bw-2, Math.round(bh*0.36));
  c.fillStyle = "rgba(255,255,255,0.2)";
  c.fillRect(nx+Math.round(bw*0.15), ny+Math.round(bh*0.28), Math.round(bw*0.18), Math.round(bh*0.5));
}

function barMug(c, x, y, mw, mh, full, fr) {
  c.fillStyle = full ? "#1a1000" : "#101010";
  c.fillRect(x, y, mw, mh);
  if (full) {
    c.fillStyle = "#b88808";
    c.fillRect(x+Math.round(mw*0.07), y+Math.round(mh*0.2), Math.round(mw*0.86), Math.round(mh*0.74));
    c.fillStyle = "rgba(255,210,60,0.35)";
    var bub = (fr*0.35) % (mh*0.65);
    c.fillRect(x+Math.round(mw*0.25), y+mh-Math.round(mh*0.22)-Math.round(bub), 2, 2);
    c.fillRect(x+Math.round(mw*0.6),  y+mh-Math.round(mh*0.28)-Math.round(bub*0.6), 2, 2);
    c.fillStyle = "rgba(255,235,160,0.14)";
    c.fillRect(x+Math.round(mw*0.14), y+Math.round(mh*0.28), Math.round(mw*0.14), Math.round(mh*0.5));
    var fb = Math.sin(fr*0.04) * Math.round(mh*0.028);
    c.fillStyle = "#fffbd0";
    c.fillRect(x-Math.round(mw*0.07), y+Math.round(fb), Math.round(mw*1.14), Math.round(mh*0.19));
    c.fillStyle = "#fff8e0";
    c.beginPath();
    c.arc(x+Math.round(mw*0.13), y+Math.round(mh*0.04)+Math.round(fb), Math.round(mw*0.13), 0, Math.PI*2);
    c.arc(x+Math.round(mw*0.45), y+Math.round(fb),                     Math.round(mw*0.17), 0, Math.PI*2);
    c.arc(x+Math.round(mw*0.8),  y+Math.round(mh*0.04)+Math.round(fb), Math.round(mw*0.13), 0, Math.PI*2);
    c.fill();
  }
  c.strokeStyle = full ? "#c8a010" : "#282820";
  c.lineWidth = Math.max(1, Math.round(mw*0.07));
  c.strokeRect(x, y, mw, mh);
  c.lineWidth = Math.max(2, Math.round(mw*0.16));
  c.beginPath();
  c.arc(x+mw+Math.round(mw*0.26), y+Math.round(mh*0.5), Math.round(mh*0.26), -0.6*Math.PI, 0.6*Math.PI);
  c.stroke(); c.lineWidth = 1;
}

// Professor — centered at cx, topY = top of full character, s = scale (charH/72)
function barProf(c, cx, topY, s) {
  var x = Math.round(cx - 24*s);

  function F(ox, oy, fw, fh) {
    c.fillRect(Math.round(x+ox*s), Math.round(topY+oy*s), Math.max(1,Math.round(fw*s)), Math.max(1,Math.round(fh*s)));
  }

  // Trousers + shoes (hidden by counter)
  c.fillStyle = "#1e1e2e"; F(4,44,16,21); F(28,44,16,21);
  c.fillStyle = "#0c0608"; F(2,65,20,7);  F(26,65,20,7);
  // Brown jacket
  c.fillStyle = "#6a5840"; F(2,30,44,15);
  c.fillStyle = "#5e4e38"; F(-6,31,10,11); F(44,31,10,11);
  // Lapels
  c.fillStyle = "#4e3e2c"; F(2,30,13,14); F(33,30,13,14);
  // Shirt
  c.fillStyle = "#ddd0b8"; F(15,30,18,10);
  c.fillStyle = "#181818"; F(19,38,10,7);
  // Neck
  c.fillStyle = "#d8a070"; F(18,26,12,5);
  // Head
  c.fillStyle = "#d8a070"; F(10,8,28,20);
  // GREY HAIR
  c.fillStyle = "#909090"; F(8,4,32,10); F(4,5,7,14); F(37,5,7,14);
  // GLASSES
  var lw = Math.max(1.5, s*2);
  c.strokeStyle = "#181818"; c.lineWidth = lw;
  c.strokeRect(Math.round(x+12*s)+0.5, Math.round(topY+15*s)+0.5, Math.max(1,Math.round(12*s)), Math.max(1,Math.round(8*s)));
  c.strokeRect(Math.round(x+26*s)+0.5, Math.round(topY+15*s)+0.5, Math.max(1,Math.round(12*s)), Math.max(1,Math.round(8*s)));
  c.beginPath();
  c.moveTo(Math.round(x+24*s), Math.round(topY+19*s));
  c.lineTo(Math.round(x+26*s), Math.round(topY+19*s));
  c.stroke(); c.lineWidth = 1;
  // Eyes
  c.fillStyle = "#1e1e1e"; F(15,17,5,5); F(28,17,5,5);
  // GREY BEARD
  c.fillStyle = "#909090"; F(14,22,20,9);
  c.fillStyle = "#787878"; F(14,24,4,4); F(22,25,4,3); F(30,24,4,4);
}

// ── Beer purchase ─────────────────────────────────────────

function buyBeer() {
  barCurrentMsg = BAR_DIALOGS[Math.floor(Math.random() * BAR_DIALOGS.length)];
  ponteBeers++;

  var textEl = document.getElementById("bar-speech-text");
  if (textEl) textEl.textContent = barCurrentMsg;

  var beersEl = document.getElementById("bar-beers");
  if (beersEl) {
    var s = "";
    for (var i = 0; i < Math.min(ponteBeers, 12); i++) s += "🍺";
    beersEl.textContent = s;
  }
}

// ============================================================
// LEVEL SELECT
// ============================================================

function openLevelSelect(lvl) {
  G.screen = "levelselect";
  G.selectedLevel = lvl;
  var html = '<div class="mini-screen" style="background:#06060f">';

  // Kompakter Header
  html += '<div class="mini-header" style="border-color:' + lvl.color + ';padding:8px 16px">';
  html += '<span style="font-size:18px">' + lvl.icon + '</span>&nbsp;' + lvl.name;
  html += '<span class="coin-display">&#128176; ' + G.coins + '</span>';
  html += '<button class="rbtn" onclick="G.screen=\'overworld\';closeMiniUI()">Zurueck</button>';
  html += '</div>';

  // Kacheln füllen den Rest gleichmäßig
  html += '<div style="flex:1;display:flex;flex-direction:column;gap:0">';
  lvl.games.forEach(function(mg, i) {
    var done = G.progress[mg.id] && G.progress[mg.id].completed;
    var accent = done ? lvl.color : '#3a3a80';

    html += '<div onclick="openMiniGame(\'' + mg.id + '\')" style="flex:1;display:flex;align-items:center;gap:22px;padding:0 28px;cursor:pointer;border-bottom:1px solid #0d0d20;border-left:4px solid ' + accent + ';background:#08081a" '
          + 'onmouseover="this.style.background=\'#0e0e28\'" onmouseout="this.style.background=\'#08081a\'">';

    // Nummer — deutlich sichtbar
    var numColor = done ? lvl.color : '#ffd700';
    var numBorder = done ? lvl.color : '#5050a0';
    var numBg = done ? lvl.color + '18' : '#12122e';
    html += '<div style="width:46px;height:46px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:2px solid ' + numBorder + ';background:' + numBg + ';font-size:18px;color:' + numColor + '">' + (i+1) + '</div>';

    // Name + Beschreibung
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-size:9px;color:' + (done ? '#ffffff' : '#c0c0d8') + ';margin-bottom:6px">' + mg.name + '</div>';
    html += '<div style="font-size:7px;color:#40405e">' + mg.desc + '</div>';
    html += '</div>';

    // Rechts: abgeholt oder offen
    html += '<div style="text-align:right;flex-shrink:0">';
    if (done) {
      html += '<div style="font-size:8px;color:#404060;letter-spacing:1px">&#10003; abgeholt</div>';
    } else {
      html += '<div style="font-size:12px;color:#ffd700;letter-spacing:1px">&#128176; +' + mg.reward + '</div>';
    }
    html += '</div>';

    html += '</div>';
  });
  html += '</div></div>';
  showMiniUI(html);
}

function openMiniGame(gameId) {
  if (gameId.substr(0, 3) === 'wr1') { wr1Open(gameId); return; }
  if (gameId.substr(0, 3) === 'wr2') { wr2Open(gameId); return; }
  if (gameId.substr(0, 3) === 'wr3') { wr3Open(gameId); return; }
  if (gameId.substr(0, 3) === 'wr4') { wr4Open(gameId); return; }
  if (gameId.substr(0, 3) === 'wr5') { wr5Open(gameId); return; }
  G.screen = "minigame";
  var lvl = G.selectedLevel;
  var mg = null;
  lvl.games.forEach(function(g) { if (g.id === gameId) mg = g; });
  if (!mg) return;
  G.selectedGame = mg;

  var html = '<div class="mini-screen">';
  html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">';
  html += '<div style="font-size:36px">' + lvl.icon + '</div>';
  html += '<div style="font-size:11px;color:#ffd700">' + mg.name + '</div>';
  html += '<div style="font-size:7px;color:#7a7a8e;max-width:400px;text-align:center;line-height:1.8">' + mg.desc + '</div>';
  html += '<div style="padding:24px;background:#141430;border:2px solid #4a4a8e;text-align:center">';
  html += '<div style="font-size:28px;margin-bottom:12px">🚧</div>';
  html += '<div style="font-size:8px;color:#50506a;line-height:2">Coming soon...</div>';
  html += '<div style="font-size:7px;color:#ffd700;margin-top:8px">Belohnung: 💰 ' + mg.reward + '</div>';
  html += '</div>';
  html += '<div style="display:flex;gap:12px">';
  html += '<button class="rbtn" onclick="openLevelSelect(G.selectedLevel)">Zurueck</button>';
  html += '<button class="rbtn action-btn" onclick="completeMiniGame(\'' + mg.id + '\',3,' + mg.reward + ')">(Test ✓)</button>';
  html += '</div>';
  html += '</div></div>';
  showMiniUI(html);
}

function completeMiniGame(id, stars, reward) {
  var prev = (G.progress[id] && G.progress[id].stars) || 0;
  var newS = Math.max(stars, prev);
  var gain = newS > prev ? Math.round(reward * (newS-prev) / 3) : 0;
  G.progress[id] = { completed: true, stars: newS };
  G.coins += gain;
  openLevelSelect(G.selectedLevel);
}
