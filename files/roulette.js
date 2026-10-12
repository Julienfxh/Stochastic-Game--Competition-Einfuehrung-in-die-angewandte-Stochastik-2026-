// ============================================================
// ROULETTE
// ============================================================

var RED_NUMS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
function getNumColor(n) { return n===0?'green':RED_NUMS.indexOf(n)>=0?'red':'black'; }

var RL = {
  bets: {},        // key -> amount  (e.g. 'red':25, '14':50, 'even':10)
  chip: 25,        // selected chip value
  angle: 0,
  spinning: false,
  lastNum: null,
  msg: '',
  msgColor: '#888',
};

var RL_WHEEL = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];

function openRoulette() {
  G.screen = 'roulette';
  RL.bets = {};
  RL.spinning = false;
  RL.lastNum = null;
  RL.msg = '';
  rlRender();
}

function rlTotalBet() {
  return Object.keys(RL.bets).reduce(function(s,k){ return s + RL.bets[k]; }, 0);
}

function rlToggleBet(key) {
  if (RL.spinning) return;
  if (RL.bets[key]) {
    delete RL.bets[key];
  } else {
    var total = rlTotalBet();
    if (total + RL.chip > G.coins) return;
    RL.bets[key] = RL.chip;
  }
  rlRender();
}

function rlSetChip(v) { RL.chip = v; rlRender(); }

// small chip badge HTML
function rlChipBadge(key) {
  var amt = RL.bets[key];
  if (!amt) return '';
  return '<div style="position:absolute;bottom:2px;right:2px;background:#ffd700;color:#000;font-size:8px;font-family:Arial,sans-serif;font-weight:bold;border-radius:2px;padding:1px 3px;line-height:1.3;pointer-events:none">' + amt + '</div>';
}

function rlRender() {
  var s = RL;
  var total = rlTotalBet();
  var canSpin = !s.spinning && total > 0 && total <= G.coins;

  var html = '<div class="mini-screen" style="background:#080202">';

  // Header
  html += '<div class="mini-header" style="border-color:#cc2222">🎡 Roulette'
        + '<span class="coin-display">💰 <span id="rl-coins">' + G.coins + '</span></span>'
        + '<button class="rbtn" onclick="G.screen=\'casino\';closeMiniUI()">Zurück</button>'
        + '</div>';

  html += '<div style="flex:1;display:flex">';

  // ── LEFT: Wheel ───────────────────────────────────────────────
  html += '<div style="width:220px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border-right:2px solid #2a0606;padding:14px">';

  html += '<div style="position:relative">'
        + '<canvas id="rl-wheel" width="180" height="180"></canvas>'
        + '<div style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-size:20px;color:#ffd700;text-shadow:0 0 8px #ffd700">▼</div>'
        + '</div>';

  // Result
  if (s.lastNum !== null) {
    var rc = getNumColor(s.lastNum);
    var rbg = rc==='red'?'#aa1a1a':rc==='black'?'#0e0e0e':'#156615';
    html += '<div style="width:64px;height:64px;background:' + rbg + ';border:3px solid #ffd700;display:flex;align-items:center;justify-content:center;font-size:28px;font-family:Arial,sans-serif;font-weight:bold;color:#fff">' + s.lastNum + '</div>';
  } else {
    html += '<div style="width:64px;height:64px;background:#110404;border:3px solid #2a0606;display:flex;align-items:center;justify-content:center;font-size:22px;color:#3a1010">?</div>';
  }

  html += '<div style="font-size:11px;font-family:Arial,sans-serif;text-align:center;color:' + s.msgColor + ';min-height:18px">' + s.msg + '</div>';

  html += '</div>'; // left

  // ── RIGHT: Betting ────────────────────────────────────────────
  html += '<div style="flex:1;display:flex;flex-direction:column;padding:12px 16px;gap:8px">';

  // Bet type row
  var betOpts = [
    { k:'red',   l:'ROT',      bg:'#6a0a0a', hi:'#cc2222' },
    { k:'black', l:'SCHWARZ',  bg:'#111',    hi:'#444'    },
    { k:'green', l:'NULL',     bg:'#082808', hi:'#228822' },
    { k:'even',  l:'GERADE',   bg:'#0a0a2a', hi:'#4040a0' },
    { k:'odd',   l:'UNGERADE', bg:'#0a0a2a', hi:'#4040a0' },
  ];
  html += '<div style="display:flex;gap:4px">';
  betOpts.forEach(function(o) {
    var isBet = !!s.bets[o.k];
    html += '<div onclick="rlToggleBet(\'' + o.k + '\')" style="position:relative;flex:1;cursor:pointer;padding:6px 2px;background:' + (isBet ? o.hi : o.bg)
          + ';border:2px solid ' + (isBet ? '#ffd700' : o.hi) + ';text-align:center">'
          + '<div style="font-size:6px;color:' + (isBet ? '#ffd700' : '#aaa') + ';letter-spacing:1px">' + o.l + '</div>'
          + rlChipBadge(o.k)
          + '</div>';
  });
  html += '</div>';

  // Number table
  html += '<div style="flex:1;display:flex;flex-direction:column;gap:2px">';

  var z = !!s.bets['0'];
  html += '<div style="display:flex;gap:2px">'
        + '<div onclick="rlToggleBet(\'0\')" style="position:relative;flex:1;cursor:pointer;display:flex;align-items:center;justify-content:center;background:' + (z?'#228822':'#082808') + ';border:2px solid ' + (z?'#ffd700':'#228822') + ';font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#fff">0'
        + rlChipBadge('0')
        + '</div>'
        + '</div>';

  var rows = [
    [3,6,9,12,15,18,21,24,27,30,33,36],
    [2,5,8,11,14,17,20,23,26,29,32,35],
    [1,4,7,10,13,16,19,22,25,28,31,34],
  ];
  rows.forEach(function(row) {
    html += '<div style="flex:1;display:flex;gap:2px">';
    row.forEach(function(n) {
      var nc = getNumColor(n);
      var bg   = nc==='red'?'#4a0808':'#0e0e0e';
      var hiBg = nc==='red'?'#cc2222':'#444';
      var isAct = !!s.bets[String(n)];
      html += '<div onclick="rlToggleBet(\'' + n + '\')" style="position:relative;flex:1;cursor:pointer;display:flex;align-items:center;justify-content:center;background:' + (isAct?hiBg:bg)
            + ';border:2px solid ' + (isAct?'#ffd700':(nc==='red'?'#660a0a':'#1a1a1a'))
            + ';font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:' + (isAct?'#fff':'#ccc') + '">'
            + n + rlChipBadge(String(n))
            + '</div>';
    });
    html += '</div>';
  });
  html += '</div>'; // number grid

  // Chip selector + total + spin
  html += '<div style="display:flex;align-items:center;gap:8px">';
  [5,10,25,50,100].forEach(function(v) {
    var active = s.chip === v;
    html += '<div onclick="rlSetChip(' + v + ')" style="cursor:pointer;width:36px;height:36px;border-radius:50%;background:' + (active?'#aa1a1a':'#2a0606') + ';border:3px solid ' + (active?'#ffd700':'#550a0a') + ';display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-size:9px;font-weight:bold;color:' + (active?'#fff':'#884444') + '">' + v + '</div>';
  });
  html += '<div style="flex:1"></div>';

  if (total > 0) {
    html += '<div style="text-align:right;font-size:8px;font-family:Arial,sans-serif;color:#884444;line-height:1.8">'
          + Object.keys(s.bets).length + ' Einsatz' + (Object.keys(s.bets).length>1?'e':'')
          + '<br><span style="color:#ffd700">' + total + ' Coins</span></div>';
  }

  html += '<button onclick="rlSpin()" style="padding:10px 18px;background:' + (canSpin?'#880e0e':'#150303') + ';border:3px solid ' + (canSpin?'#ff3333':'#330505') + ';color:' + (canSpin?'#fff':'#440000') + ';font-family:inherit;font-size:8px;cursor:' + (canSpin?'pointer':'default') + ';letter-spacing:3px">'
        + (s.spinning?'· · ·':'SPIN') + '</button>';

  if (total > 0) {
    html += '<button onclick="RL.bets={};rlRender()" style="padding:10px 10px;background:#150303;border:2px solid #330505;color:#663333;font-family:inherit;font-size:7px;cursor:pointer">✕</button>';
  }

  html += '</div>'; // bottom row
  html += '</div>'; // right
  html += '</div></div>';

  showMiniUI(html);
  rlDrawWheel(RL.angle);
}

function rlDrawWheel(angleDeg) {
  var cv = document.getElementById('rl-wheel');
  if (!cv) return;
  var c = cv.getContext('2d');
  var cx = 90, cy = 90, r = 84;
  c.clearRect(0, 0, 180, 180);
  c.save();
  c.translate(cx, cy);
  c.rotate(angleDeg * Math.PI / 180);
  for (var i = 0; i < 37; i++) {
    var n = RL_WHEEL[i];
    var a1 = (i/37)*Math.PI*2 - Math.PI/2;
    var a2 = ((i+1)/37)*Math.PI*2 - Math.PI/2;
    var nc = getNumColor(n);
    c.beginPath(); c.moveTo(0,0); c.arc(0,0,r,a1,a2); c.closePath();
    c.fillStyle = nc==='red'?'#bb1a1a':nc==='black'?'#0e0e0e':'#1a6a1a';
    c.fill(); c.strokeStyle='#2a0808'; c.lineWidth=1; c.stroke();
    c.save();
    c.rotate((a1+a2)/2); c.translate(r*0.70,0); c.rotate(Math.PI/2);
    c.fillStyle='#fff'; c.font='bold 7px Arial'; c.textAlign='center';
    c.fillText(n,0,2.5);
    c.restore();
  }
  c.restore();
  c.strokeStyle='#5a3000'; c.lineWidth=4;
  c.beginPath(); c.arc(cx,cy,r+2,0,Math.PI*2); c.stroke();
  c.strokeStyle='#ffd700'; c.lineWidth=3;
  c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.stroke();
  c.fillStyle='#110202';
  c.beginPath(); c.arc(cx,cy,12,0,Math.PI*2); c.fill();
  c.strokeStyle='#ffd700'; c.lineWidth=2;
  c.beginPath(); c.arc(cx,cy,12,0,Math.PI*2); c.stroke();
}

function rlSpin() {
  var s = RL;
  var total = rlTotalBet();
  if (s.spinning || total<=0 || total>G.coins) return;
  s.spinning = true;
  s.msg = '';
  rlRender();

  var slotIdx = Math.floor(Math.random()*37);
  var num = RL_WHEEL[slotIdx];
  var targetAngle = s.angle + (8+Math.random()*4)*360 + slotIdx*(360/37);
  var startAngle = s.angle, startTime = null, duration = 3600;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var t = Math.min(1,(ts-startTime)/duration);
    rlDrawWheel(startAngle+(targetAngle-startAngle)*(1-Math.pow(1-t,3)));
    if (t<1) { requestAnimationFrame(animate); }
    else {
      s.angle = targetAngle%360;
      s.spinning = false;
      s.lastNum = num;
      rlResolve(num);
    }
  }
  requestAnimationFrame(animate);
}

function rlResolve(num) {
  var s = RL;
  var col = getNumColor(num);
  var netChange = 0;

  Object.keys(s.bets).forEach(function(key) {
    var amt = s.bets[key];
    var win = false;
    var mult = 1;
    if      (key==='red'   && col==='red')              { win=true; mult=1; }
    else if (key==='black' && col==='black')            { win=true; mult=1; }
    else if (key==='green' && col==='green')            { win=true; mult=35; }
    else if (key==='even'  && num>0 && num%2===0)       { win=true; mult=1; }
    else if (key==='odd'   && num%2===1)                { win=true; mult=1; }
    else if (!isNaN(parseInt(key)) && parseInt(key)===num) { win=true; mult=35; }

    netChange += win ? amt*mult : -amt;
  });

  G.coins += netChange;
  s.msg = netChange>=0 ? 'Gewonnen! +'+netChange : 'Verloren! '+netChange;
  s.msgColor = netChange>=0 ? '#50c050' : '#c05050';
  s.bets = {};
  rlRender();
}
