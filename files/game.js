// ============================================================
// GAME ENGINE — State, Input, Loop, Rendering Dispatch
// ============================================================

var canvas, ctx, uiLayer;
var PROF_IMG = new Image();

var VW = 680, VH = 480;
var scaleX = 1, scaleY = 1;

function resizeCanvas() {
  var dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  scaleX = canvas.width / VW;
  scaleY = canvas.height / VH;
  ctx.imageSmoothingEnabled = false;
}

// Colors
var C = {
  bg:"#0f0e1a", grass1:"#2d5a2d", grass2:"#265226",
  path1:"#7a6e52", path2:"#6e634a",
  trunk:"#4a2e12", tree1:"#1a6a1a", tree2:"#1f7a1f",
  bld:"#5a5a7a", door:"#2a1a0a",
  uiD:"#08081a", uiM:"#141430", uiL:"#222250", uiB:"#4a4a8e",
  gold:"#ffd700", white:"#e0e0e0", gray:"#7a7a8e", dim:"#50506a",
  cBg:"#1a0808", cCarpet1:"#6a0f0f", cCarpet2:"#550c0c",
  cWall:"#3a1a1a", cGold:"#c8a800", cCol:"#5a4a20",
};

// Global Game State
var G = {
  screen: "title",
  player: { x:8, y:5, dir:"down", walking:false, frame:0 },
  casinoPlayer: { x:6, y:7, dir:"up", walking:false, frame:0 },
  coins: 100,
  progress: {},
  dialog: null,
  dialogQueue: [],
  selectedLevel: null,
  selectedGame: null,
  nearBuilding: null,
  nearStation: null,
  isNearExit: false,
  introShown: false,
  disclaimerShown: false,
  equippedSkin: 'ersti',
  ownedSkins: ['ersti'],
  moveTimer: 0,
  keys: {},
  lastMove: 0,
};

// Level config
var LEVELS = [
  { id:"vl01", name:"Audimax", vl:"WR4: Erwartungswert & Urnen", color:"#e8a835", icon:"🎲", label:"WR4", bx:10, by:4, type:"mg",
    games:[
      {id:"wr4q1", name:"Dichtetransformationssatz",  desc:"Dichten unter Transformation berechnen",          reward:80},
      {id:"wr4q2", name:"Unabhängige ZV",             desc:"Unabhängigkeit und Rechenregeln",                 reward:60},
      {id:"wr4q3", name:"Zufallsstichprobe",          desc:"i.i.d., Stichprobenmittel und seine Varianz",     reward:60},
      {id:"wr4q4", name:"Erwartungswert",             desc:"E[X] berechnen und Linearität",                  reward:60},
      {id:"wr4q5", name:"Bernoulli-Verteilung",       desc:"Das einfachste Modell der Wahrscheinlichkeit",   reward:60},
      {id:"wr4q6", name:"Varianz & Standardabweichung", desc:"Streuung einer Zufallsvariablen",              reward:60},
      {id:"wr4q7", name:"Binomialkoeffizient",        desc:"C(n,k) verstehen und berechnen",                 reward:60},
      {id:"wr4q8", name:"Urnenmodell 3",              desc:"Ohne Zurücklegen, ohne Reihenfolge",             reward:70},
      {id:"wr4q9", name:"Urnenmodell 4",              desc:"Mit Zurücklegen, ohne Reihenfolge",              reward:70},
    ]},
  { id:"vl03", name:"C.A.R.L.", vl:"WR2: Laplace & Urnen", color:"#d4a017", icon:"🪙", label:"WR2", bx:7, by:3, type:"mg",
    games:[
      {id:"wr2q1", name:"Laplace-Räume",               desc:"Gleichwahrscheinlichkeit und P(A)=|A|/|Ω|",      reward:60},
      {id:"wr2q2", name:"Urnenmodelle 1",               desc:"Ziehen mit Zurücklegen",                         reward:50},
      {id:"wr2q3", name:"Urnenmodelle 2",               desc:"Ziehen ohne Zurücklegen und Permutationen",      reward:50},
      {id:"wr2q4", name:"Urnenmodelle kombiniert",      desc:"Mit und ohne Zurücklegen im Vergleich",          reward:70},
      {id:"wr2q5", name:"Chancen & Bed. Wkeit",        desc:"Odds, P(A|B) und der Multiplikationssatz",       reward:80},
    ]},
  { id:"vl04", name:"Informatikzentrum", vl:"WR1: Grundbegriffe", color:"#4a90d9", icon:"📊", label:"WR1", bx:2, by:5, type:"mg",
    games:[
      {id:"wr1q1", name:"Kolmogorov-Axiome",         desc:"Kenne die Grundregeln der Wahrscheinlichkeit", reward:60},
      {id:"wr1q2", name:"Ergebnismenge & Ereignisse", desc:"Ladekabel, Ω und Elementarereignisse",         reward:50},
      {id:"wr1q3", name:"Mengenoperationen",          desc:"UND, ODER, NICHT am Würfel",                  reward:50},
      {id:"wr1q4", name:"De-Morgan-Regeln",           desc:"Die goldenen Formeln der Mengenlehre",         reward:50},
      {id:"wr1q5", name:"Additionsformel",            desc:"Berechne P(A∪B) und P(Aᶜ)",                   reward:70},
    ]},
  { id:"vl05", name:"Mensa Academica", vl:"WR3: Bayes & Zufallsvariablen", color:"#e05555", icon:"🍽️", label:"WR3", bx:10, by:1, type:"mg",
    games:[
      {id:"wr3q1", name:"Totale Wahrscheinlichkeit", desc:"P(A) über disjunkte Ursachen berechnen",          reward:60},
      {id:"wr3q2", name:"Satz von Bayes",            desc:"Von Ergebnis zur Ursache zurückrechnen",          reward:70},
      {id:"wr3q3", name:"Unabhängige Ereignisse",    desc:"Produktsatz und stochastische Unabhängigkeit",    reward:60},
      {id:"wr3q4", name:"Zufallsvariablen",          desc:"Funktionen auf dem Ergebnisraum",                 reward:60},
      {id:"wr3q5", name:"Verteilung von ZV",         desc:"Wahrscheinlichkeitsfunktion und Verteilungsfunktion", reward:70},
    ]},
  { id:"vl06", name:"Super C", vl:"WR5: Verteilungsmodelle & Kovarianz", color:"#50b050", icon:"📈", label:"WR5", bx:13, by:8, type:"mg",
    games:[
      {id:"wr5q1", name:"Hypergeometrische Verteilung", desc:"Ziehen ohne Zurücklegen aus endlicher Menge",  reward:70},
      {id:"wr5q2", name:"Geometrische Verteilung",      desc:"Wartezeit auf den ersten Erfolg",               reward:70},
      {id:"wr5q3", name:"Poisson-Verteilung",           desc:"Zählen seltener Ereignisse im Zeitintervall",   reward:70},
      {id:"wr5q4", name:"Negative Binomialverteilung",  desc:"Versuche bis k Erfolge beobachtet werden",      reward:70},
      {id:"wr5q5", name:"Stetige Gleichverteilung",     desc:"Gleichmäßig auf Intervall [a,b] verteilt",      reward:70},
      {id:"wr5q6", name:"Exponentialverteilung",        desc:"Wartezeit auf Poisson-Ereignisse",               reward:70},
      {id:"wr5q7", name:"Normalverteilung",             desc:"Die Gaußsche Glockenkurve",                     reward:70},
      {id:"wr5q8", name:"Kovarianz & Korrelation",      desc:"Zusammenhangsmaße für Zufallsvariablen",        reward:80},
      {id:"wr5q9", name:"Bedingte Dichten & Simpson",   desc:"Bedingte Dichten, Unabhängigkeit, Paradoxon",   reward:80},
    ]},
  { id:"casino", name:"Tivoli Casino", vl:"Glueck & Wk", color:"#ffd700", icon:"🎰", label:"Casino", bx:14, by:2, type:"casino", games:[]},
  { id:"ponte", name:"Pontstrasse", vl:"Studentenleben", color:"#c040c0", icon:"🍺", label:"Ponte", bx:14, by:5, type:"bar", games:[]},
  { id:"shop",  name:"RWTH Shop",  vl:"Skins & Style",  color:"#003f8a", icon:"🛍️", label:"Shop",  bx:5,  by:8,  type:"shop", games:[]},
  { id:"wr6",   name:"Hörsaal 1",  vl:"", color:"#8050d0", icon:"🎯", label:"WR6", bx:1, by:0, type:"soon", games:[]},
  { id:"wr7",   name:"Hörsaal 2",  vl:"", color:"#a04070", icon:"⚖️", label:"WR7", bx:3, by:0, type:"soon", games:[]},
  { id:"is1",   name:"Hörsaal 3",  vl:"", color:"#2090a0", icon:"💻", label:"IS1", bx:5, by:0, type:"soon", games:[]},
  { id:"is2",   name:"Hörsaal 4",  vl:"", color:"#304090", icon:"🔬", label:"IS2", bx:7, by:0, type:"soon", games:[]},
  { id:"bushof", name:"Bushof",    vl:"", color:"#f0b000", icon:"🚌", label:"Bushof", bx:4, by:10, type:"vote", games:[]},
];

var CASINO_STATIONS = [
  { id:"roulette", name:"Roulette", icon:"🎡", x:3, y:2, color:"#cc2222" },
  { id:"slots",    name:"Slots",    icon:"🎰", x:9, y:2, color:"#ffd700" },
  { id:"horses",   name:"Pferderennen", icon:"🐎", x:3, y:6, color:"#40a040" },
  { id:"blackjack",name:"Blackjack",icon:"🃏", x:9, y:6, color:"#4a90d9" },
];

var GAME_CONFIG = { beerCost: 15 };

var INTRO = [
  "Willkommen an der RWTH! Ich bin Professor Steland.",
  "Bestehe die Tests in den Gebäuden, um Coins zu verdienen. Die kannst du dann im Casino verzocken oder für neue Skins ausgeben.",
  "Viel Erfolg — und denk dran: P(Bestehen) steigt mit jedem Test den du machst.",
  "Und vergiss die Pontstrasse nicht... Viel Erfolg!"
];

var BEER_DIALOGS = [
  "Prost! P(Bier schmeckt) = 1. Sicheres Ereignis!",
  "Statistisch trinkt ein RWTH-Student 2,7 Bier/Woche. Du erhoehst E[X].",
  "Die Varianz deiner Klausurvorbereitung steigt gerade.",
  "Pontstrasse: E[gute Nacht] ist signifikant positiv!",
  "Das einzige Experiment bei dem mir das Ergebnis egal ist!"
];

// ===== INPUT =====
function initInput() {
  document.addEventListener("keydown", function(e) {
    G.keys[e.key.toLowerCase()] = true;
    if (["arrowup","arrowdown","arrowleft","arrowright"," "].indexOf(e.key.toLowerCase()) >= 0) e.preventDefault();

    // Single-press actions
    if (e.key === "Enter" || e.key === " ") handleAction();
    if (e.key === "Escape") handleEscape();
  });
  document.addEventListener("keyup", function(e) {
    G.keys[e.key.toLowerCase()] = false;
  });
}

function handleAction() {
  if (G.dialog) {
    advanceDialog();
    return;
  }
  if (G.screen === "title") {
    if (!G.disclaimerShown) {
      openDisclaimer();
    } else {
      startGame();
    }
    return;
  }
  if (G.screen === "disclaimer") {
    closeDisclaimer();
    return;
  }
  if (G.screen === "overworld" && G.nearBuilding) {
    var b = G.nearBuilding;
    G.selectedLevel = b;
    if (b.type === "casino") {
      G.casinoPlayer = {x:6,y:7,dir:"up",walking:false,frame:0};
      G.isNearExit = false;
      G.screen = "casino";
    } else if (b.type === "bar") {
      openBar();
    } else if (b.type === "shop") {
      openShop();
    } else if (b.type === "soon") {
      openComingSoon(b);
    } else if (b.type === "vote") {
      openVote(b);
    } else {
      openLevelSelect(b);
    }
  } else if (G.screen === "casino") {
    if (G.isNearExit) { G.screen = "overworld"; }
    else if (G.nearStation) {
      var sid = G.nearStation.id;
      if (sid === "roulette") openRoulette();
      else if (sid === "slots") openSlots();
      else if (sid === "horses") openHorses();
      else if (sid === "blackjack") openBlackjack();
    }
  }
}

function handleEscape() {
  if (G.screen === "levelselect") { G.screen = "overworld"; closeMiniUI(); }
  else if (G.screen === "minigame") { openLevelSelect(G.selectedLevel); }
  else if (G.screen === "casino") { G.screen = "overworld"; }
  else if (G.screen === "roulette" || G.screen === "slots" || G.screen === "horses" || G.screen === "blackjack") { G.screen = "casino"; closeMiniUI(); }
  else if (G.screen === "bar")  { G.screen = "overworld"; closeMiniUI(); }
  else if (G.screen === "shop") { G.screen = "overworld"; closeMiniUI(); }
  else if (G.screen === "soon") { G.screen = "overworld"; closeMiniUI(); }
  else if (G.screen === "vote") { G.screen = "overworld"; closeMiniUI(); }
}

function openDisclaimer() {
  G.screen = "disclaimer";
  G.disclaimerShown = true;
  var html = '<div class="mini-screen" style="background:#080810">';
  html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;padding:48px 80px">';
  html += '<div style="font-size:9px;color:#888899;letter-spacing:4px">HINWEIS</div>';
  html += '<div style="width:100%;height:1px;background:#222240"></div>';
  html += '<div style="font-size:11px;color:#c0c0d8;line-height:2.6;text-align:center;max-width:560px">';
  html += 'Der in diesem Spiel dargestellte Professor Steland ist eine fiktive Figur.<br>';
  html += 'Die reale Person Professor Dr. Steland an der RWTH Aachen ist nicht verantwortlich für dessen Inhalte.';
  html += '</div>';
  html += '<div style="width:100%;height:1px;background:#222240"></div>';
  html += '<button onclick="closeDisclaimer()" style="margin-top:8px;padding:14px 40px;background:#141430;border:2px solid #4a4a8e;color:#e0e0e0;font-family:\'Press Start 2P\',monospace;font-size:8px;cursor:pointer;letter-spacing:2px">VERSTANDEN</button>';
  html += '<div style="font-size:6px;color:#333355">[ oder Enter drücken ]</div>';
  html += '</div></div>';
  showMiniUI(html);
}

function closeDisclaimer() {
  closeMiniUI();
  startGame();
}

function openVote(b) {
  G.screen = "vote";
  G.selectedLevel = b;
  var html = '<div class="mini-screen" style="background:#0a0a18">';
  html += '<div class="mini-header" style="border-color:#f0b000">'
        + '<span style="font-size:18px">🚌</span>&nbsp;Bushof'
        + '<span class="coin-display">&#128176; ' + G.coins + '</span>'
        + '<button class="rbtn" onclick="G.screen=\'overworld\';closeMiniUI()">Zurück</button>'
        + '</div>';
  html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:30px">';
  html += '<div style="font-size:11px;color:#f0b000;letter-spacing:3px;text-align:center">VOTET FÜR DAS</div>';
  html += '<div style="font-size:14px;color:#ffffff;letter-spacing:2px;text-align:center">ULTIMATIVE BUSHOF UPDATE</div>';
  html += '<canvas id="bushof-scene" width="160" height="110" style="image-rendering:pixelated"></canvas>';
  html += '<div style="padding:12px 32px;border:1px solid #3a3010;background:#12100a;text-align:center">';
  html += '<div style="font-size:7px;color:#706040;line-height:2.2">Der Bushof verdient mehr.<br>Sprecht mit eurer Stimme.</div>';
  html += '</div>';
  html += '</div></div>';
  showMiniUI(html);
  drawBushofScene('bushof-scene');
}

function drawBushofScene(canvasId) {
  var el = document.getElementById(canvasId);
  if (!el) return;
  var c = el.getContext('2d');
  var W = el.width, H = el.height;
  c.clearRect(0, 0, W, H);

  var sc = { hair:'#8a8a8a', beard:'#909090', jacket:'#6b5a42', shirt:'#e8dcc8', pants:'#2a2a3a' };
  if (typeof SHOP_SKINS !== 'undefined' && G.equippedSkin) {
    for (var si = 0; si < SHOP_SKINS.length; si++) {
      if (SHOP_SKINS[si].id === G.equippedSkin) { sc = SHOP_SKINS[si].colors; break; }
    }
  }

  // Ground
  c.fillStyle = '#1c1606';
  c.fillRect(0, H-14, W, 14);
  c.fillStyle = '#2a2008';
  c.fillRect(0, H-14, W, 2);

  // Professor sitting — anchor top-left of head at (bx, by)
  var bx = 46, by = 8;

  // Hair
  c.fillStyle = sc.hair;
  c.fillRect(bx+6, by,    24, 8);
  c.fillRect(bx+4, by+3,   6, 7);
  c.fillRect(bx+26,by+3,   6, 7);
  // Face
  c.fillStyle = '#e8b888';
  c.fillRect(bx+8, by+4,  20, 16);
  // Eyes — half-closed (tipsy)
  c.fillStyle = '#2a2a2a';
  c.fillRect(bx+10,by+10,  8, 2);
  c.fillRect(bx+21,by+10,  7, 2);
  // Rosy cheeks
  c.fillStyle = 'rgba(210,70,70,0.28)';
  c.fillRect(bx+9, by+14,  5, 4);
  c.fillRect(bx+23,by+14,  5, 4);
  // Beard
  c.fillStyle = sc.beard;
  c.fillRect(bx+10,by+15, 16, 8);
  // Body/jacket
  c.fillStyle = sc.jacket;
  c.fillRect(bx+2, by+22, 32, 18);
  // Shirt
  c.fillStyle = sc.shirt;
  c.fillRect(bx+12,by+22, 12, 7);
  // Tie
  c.fillStyle = '#1a1a1a';
  c.fillRect(bx+15,by+28,  6, 6);
  // Left arm down
  c.fillStyle = sc.jacket;
  c.fillRect(bx-4, by+24,  8, 24);
  // Right arm — elbow bent, forearm going right holding beer
  c.fillRect(bx+30,by+24,  8, 14);
  c.fillRect(bx+30,by+36, 22,  8);
  // Sitting legs
  c.fillStyle = sc.pants;
  c.fillRect(bx+4, by+40, 28,  8); // lap/seat
  c.fillRect(bx+4, by+48, 12, 24); // left thigh down
  c.fillRect(bx+18,by+50, 12, 22); // right thigh
  c.fillRect(bx+2, by+70, 16,  8); // left shoe area
  c.fillRect(bx+16,by+70, 16,  8); // right shoe area
  // Shoes
  c.fillStyle = '#1a1210';
  c.fillRect(bx,   by+76, 18,  6);
  c.fillRect(bx+15,by+76, 18,  6);

  // Beer mug in right hand
  var mx = bx+52, my = by+32;
  c.fillStyle = '#c8940a';   // mug body
  c.fillRect(mx,   my,    12, 16);
  c.fillStyle = '#a87800';   // mug handle
  c.fillRect(mx+12,my+2,   6, 11);
  c.fillStyle = '#f0ece0';   // foam
  c.fillRect(mx-1, my-5,  14,  7);
  c.fillStyle = 'rgba(255,255,255,0.5)';
  c.fillRect(mx+1, my-7,   4,  4);
  c.fillRect(mx+7, my-8,   3,  4);

  // z z Z (tipsy snooze)
  c.fillStyle = 'rgba(140,210,140,0.75)';
  c.font = 'bold 9px Arial';  c.fillText('z', bx+36, by+2);
  c.font = 'bold 11px Arial'; c.fillText('z', bx+44, by-5);
  c.font = 'bold 14px Arial'; c.fillText('Z', bx+54, by-12);
}

function openComingSoon(b) {
  G.screen = "soon";
  G.selectedLevel = b;
  var html = '<div class="mini-screen" style="background:#0a0a18">';
  html += '<div class="mini-header" style="border-color:' + b.color + '">'
        + '<span style="font-size:18px">' + b.icon + '</span>&nbsp;' + b.name
        + '<span class="coin-display">&#128176; ' + G.coins + '</span>'
        + '<button class="rbtn" onclick="G.screen=\'overworld\';closeMiniUI()">Zurück</button>'
        + '</div>';
  html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:40px">';
  html += '<div style="font-size:52px">🔒</div>';
  html += '<div style="font-size:13px;color:' + b.color + ';letter-spacing:4px">COMING SOON</div>';
  html += '<div style="margin-top:12px;padding:16px 28px;border:1px solid #252545;background:#0e0e20;text-align:center">';
  html += '<div style="font-size:7px;color:#505068;line-height:2.2">Dieses Modul ist noch in Entwicklung.<br>Schau später nochmal vorbei!</div>';
  html += '</div>';
  html += '</div></div>';
  showMiniUI(html);
}

function advanceDialog() {
  if (G.dialogQueue.length > 0) {
    G.dialog = G.dialogQueue.shift();
  } else {
    G.dialog = null;
  }
}

function showDialog(msgs) {
  G.dialog = msgs[0];
  G.dialogQueue = msgs.slice(1);
}

function startGame() {
  G.screen = "overworld";
  if (!G.introShown) {
    showDialog(INTRO);
    G.introShown = true;
  }
}

// ===== STARS & PROGRESS =====
function getTotalStars() {
  var t = 0;
  LEVELS.forEach(function(l) { if (l.games) l.games.forEach(function() { t += 3; }); });
  return t;
}
function getEarnedStars() {
  var t = 0;
  Object.keys(G.progress).forEach(function(k) { t += (G.progress[k].stars || 0); });
  return t;
}

// ===== MOVEMENT =====
function tryMove(px, py, dx, dy, map, mapW, mapH) {
  var nx = px + dx, ny = py + dy;
  if (nx < 0 || nx >= mapW || ny < 0 || ny >= mapH) return null;
  var tile = map[ny][nx];
  if (tile === 2) return null; // wall/tree
  return {x:nx, y:ny};
}

function updateMovement(dt) {
  if (G.dialog) return;
  if (G.screen !== "overworld" && G.screen !== "casino") return;

  G.moveTimer -= dt;
  if (G.moveTimer > 0) return;

  var dx = 0, dy = 0;
  if (G.keys["arrowup"] || G.keys["w"]) dy = -1;
  else if (G.keys["arrowdown"] || G.keys["s"]) dy = 1;
  else if (G.keys["arrowleft"] || G.keys["a"]) dx = -1;
  else if (G.keys["arrowright"] || G.keys["d"]) dx = 1;

  if (dx === 0 && dy === 0) {
    if (G.screen === "overworld") G.player.walking = false;
    else G.casinoPlayer.walking = false;
    return;
  }

  var dir = dx < 0 ? "left" : dx > 0 ? "right" : dy < 0 ? "up" : "down";

  if (G.screen === "overworld") {
    G.player.dir = dir;
    var result = tryMove(G.player.x, G.player.y, dx, dy, CAMPUS_MAP, CAMPUS_W, CAMPUS_H);
    if (result) { G.player.x = result.x; G.player.y = result.y; }
    G.player.walking = true;
    G.player.frame++;
  } else {
    G.casinoPlayer.dir = dir;
    var result2 = tryMove(G.casinoPlayer.x, G.casinoPlayer.y, dx, dy, CASINO_MAP, CASINO_MW, CASINO_MH);
    if (result2) { G.casinoPlayer.x = result2.x; G.casinoPlayer.y = result2.y; }
    G.casinoPlayer.walking = true;
    G.casinoPlayer.frame++;
  }
  G.moveTimer = 0.14; // seconds between moves
}

// ===== PROXIMITY =====
function updateProximity() {
  if (G.screen === "overworld") {
    G.nearBuilding = null;
    LEVELS.forEach(function(l) {
      if (Math.abs(l.bx - G.player.x) <= 1 && Math.abs(l.by - G.player.y) <= 1) {
        G.nearBuilding = l;
      }
    });
  }
  if (G.screen === "casino") {
    G.nearStation = null;
    CASINO_STATIONS.forEach(function(s) {
      if (Math.abs(s.x - G.casinoPlayer.x) <= 1 && Math.abs(s.y - G.casinoPlayer.y) <= 1) {
        G.nearStation = s;
      }
    });
    G.isNearExit = G.casinoPlayer.y >= CASINO_MH - 2 && Math.abs(G.casinoPlayer.x - 6) <= 1;
  }
}

// ===== DRAWING HELPERS =====
function drawProf(x, y, p) {
  var sc = { hair:'#8a8a8a', beard:'#909090', jacket:'#6b5a42', shirt:'#e8dcc8', pants:'#2a2a3a' };
  if (typeof SHOP_SKINS !== 'undefined' && G.equippedSkin) {
    for (var _si = 0; _si < SHOP_SKINS.length; _si++) {
      if (SHOP_SKINS[_si].id === G.equippedSkin) { sc = SHOP_SKINS[_si].colors; break; }
    }
  }
  var w = p.walking, f = p.frame || 0;
  ctx.fillStyle = sc.hair;
  ctx.fillRect(x+6, y, 24, 8);
  ctx.fillRect(x+4, y+3, 6, 7);
  ctx.fillRect(x+26, y+3, 6, 7);
  ctx.fillStyle = "#e8b888";
  ctx.fillRect(x+8, y+4, 20, 16);
  ctx.strokeStyle = "#2a2a2a"; ctx.lineWidth = 2;
  ctx.strokeRect(x+8, y+8, 9, 5);
  ctx.strokeRect(x+19, y+8, 9, 5);
  ctx.lineWidth = 1;
  ctx.fillStyle = sc.beard;
  ctx.fillRect(x+10, y+15, 16, 8);
  ctx.fillStyle = sc.jacket;
  ctx.fillRect(x+4, y+22, 28, 14);
  ctx.fillStyle = sc.shirt;
  ctx.fillRect(x+12, y+22, 12, 6);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(x+14, y+27, 8, 5);
  ctx.fillStyle = sc.pants;
  var lOff = w ? (f % 2 === 0 ? -3 : 3) : 0;
  var rOff = w ? (f % 2 === 0 ? 3 : -3) : 0;
  ctx.fillRect(x+9+lOff, y+36, 7, 8);
  ctx.fillRect(x+20+rOff, y+36, 7, 8);
}

function drawText(text, x, y, color, size, align) {
  ctx.fillStyle = color || C.white;
  ctx.font = (size || 10) + "px 'Press Start 2P', monospace";
  ctx.textAlign = align || "left";
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
}

function drawBox(x, y, w, h, fill, border) {
  ctx.fillStyle = fill || C.uiD;
  ctx.fillRect(x, y, w, h);
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 1;
  }
}

function drawCoinBar(location) {
  drawBox(0, 0, VW, 28, C.uiD, null);
  ctx.fillStyle = C.uiB; ctx.fillRect(0, 26, VW, 2);
  drawText("💰 " + G.coins, 14, 18, C.gold, 8);
  drawText(location || "RWTH Campus", VW/2, 18, C.gold, 7, "center");
  drawText("⭐ " + getEarnedStars() + "/" + getTotalStars(), VW - 14, 18, C.white, 8, "right");
}

var DIALOG_IMG_W = 130;

function updateDialogPortrait() {
  var el = document.getElementById("dialog-portrait");
  if (!el) return;
  if (G.dialog) {
    var dh = 150, dx = 10, dy = VH - dh - 10;
    var imgH = dh - 20, imgW = DIALOG_IMG_W;
    var imgX = dx + 14;
    var imgY = dy + Math.round((dh - imgH) / 2);
    el.style.left   = (imgX / VW * 100) + "%";
    el.style.top    = (imgY / VH * 100) + "%";
    el.style.width  = (imgW / VW * 100) + "%";
    el.style.height = (imgH / VH * 100) + "%";
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

function drawDialog() {
  if (!G.dialog) return;
  var dh = 150, dx = 10, dw = VW - 20, dy = VH - dh - 10;
  drawBox(dx, dy, dw, dh, C.uiD, C.uiB);

  var textX = dx + DIALOG_IMG_W + 28;
  var maxW = dw - DIALOG_IMG_W - 40;
  drawText("Prof. Steland:", textX, dy + 26, C.gold, 8);

  var words = G.dialog.split(" ");
  var line = "", lineY = dy + 50;
  ctx.font = "8px 'Press Start 2P', monospace";
  for (var i = 0; i < words.length; i++) {
    var test = line + (line ? " " : "") + words[i];
    if (ctx.measureText(test).width > maxW && line) {
      drawText(line, textX, lineY, C.white, 8);
      lineY += 18;
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line) drawText(line, textX, lineY, C.white, 8);
  drawText("> Weiter [SPACE]", dx + dw - 16, dy + dh - 12, C.gold, 6, "right");
}

// ===== MAIN LOOP =====
var lastTime = 0;

function gameLoop(time) {
  var dt = (time - lastTime) / 1000;
  lastTime = time;
  if (dt > 0.1) dt = 0.1;

  // Update
  updateMovement(dt);
  updateProximity();

  // Clear
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render based on screen
  ctx.save();
  ctx.scale(scaleX, scaleY);
  if (G.screen === "title") renderTitle();
  else if (G.screen === "overworld") renderCampus();
  else if (G.screen === "casino") renderCasinoWorld();
  ctx.restore();

  updateDialogPortrait();

  requestAnimationFrame(gameLoop);
}

// ===== INIT =====
function initGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  uiLayer = document.getElementById("uiLayer");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  PROF_IMG.src = "prof.jpg";
  initInput();
  initCampusMap();
  initCasinoMap();

  requestAnimationFrame(gameLoop);
}

// ===== TITLE SCREEN =====
function renderTitle() {
  // Stars
  for (var i = 0; i < 40; i++) {
    var sx = ((i * 41 + 7) % 100) / 100 * VW;
    var sy = ((i * 59 + 13) % 100) / 100 * VH;
    var a = 0.1 + (i % 4) * 0.1 + Math.sin(Date.now()/1000 + i) * 0.1;
    ctx.fillStyle = "rgba(255,255,255," + a + ")";
    ctx.fillRect(sx, sy, 2, 2);
  }
  // Silhouette
  ctx.fillStyle = "rgba(30,30,30,0.5)";
  ctx.fillRect(VW*0.1, VH-50, 60, 50);
  ctx.fillRect(VW*0.25, VH-70, 80, 70);
  ctx.fillRect(VW*0.45, VH-55, 100, 55);
  ctx.fillRect(VW*0.65, VH-65, 70, 65);
  ctx.fillRect(VW*0.8, VH-45, 90, 45);

  drawText("🎓", VW/2-12, VH/2-80, C.white, 40, "center");
  drawText("Prof. Stelands", VW/2, VH/2-30, C.gold, 14, "center");
  drawText("Stochastik-Abenteuer", VW/2, VH/2, C.gold, 14, "center");
  drawText("Ein EAS-Abenteuer an der RWTH Aachen", VW/2, VH/2+30, C.gray, 7, "center");

  // Blinking start
  if (Math.floor(Date.now()/600) % 2 === 0) {
    drawText(">> ENTER / SPACE zum Starten <<", VW/2, VH/2+80, C.gold, 8, "center");
  }

  drawText("WASD / Pfeiltasten = Bewegen", VW/2, VH-50, C.dim, 7, "center");
  drawText("ENTER = Betreten | ESC = Zurueck", VW/2, VH-34, C.dim, 7, "center");
}

// ===== UI LAYER (HTML overlays for mini-games) =====
function closeMiniUI() {
  uiLayer.innerHTML = "";
  uiLayer.style.display = "none";
}

function showMiniUI(html) {
  uiLayer.innerHTML = html;
  uiLayer.style.display = "flex";
}

window.addEventListener("load", initGame);
