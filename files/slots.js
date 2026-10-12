// ============================================================
// SLOT MACHINE
// ============================================================

var SLOT_SYMS = ['🍒','🍋','🍇','⭐','💎','7️⃣'];

var SL = {
  reels: [0, 0, 0],
  spinning: false,
  bet: 10,
  showStats: true,
  spinCount: 0,
  balance: 0,
  msg: '',
  msgColor: '#c05050',
};

function openSlots() {
  G.screen = 'slots';
  SL.reels = [0, 0, 0];
  SL.spinning = false;
  SL.spinCount = 0;
  SL.balance = 0;
  SL.msg = '';
  slRender();
}

function slRender() {
  var s = SL;

  // Probabilities
  // 3x7: 1/216 | 3x💎: 1/216 | 3x other: 4/216 | 2 same: 90/216 | nothing: 120/216
  var pWin = (96 / 216 * 100).toFixed(1);
  // E[X net]: +50B(1/216) +20B(1/216) +10B(4/216) +2B(90/216) -B(120/216)
  var ev = s.bet * 170 / 216;
  var evStr = (ev >= 0 ? '+' : '') + ev.toFixed(1);
  var balStr = (s.balance >= 0 ? '+' : '') + s.balance;

  var html = '<div class="mini-screen" style="background:#07030e">';

  // Header
  html += '<div class="mini-header" style="border-color:#ffd700">🎰 Slot Machine'
        + '<span class="coin-display">💰 <span id="sl-coins">' + G.coins + '</span></span>'
        + '<button class="rbtn" onclick="G.screen=\'casino\';closeMiniUI()">Zurück</button>'
        + '</div>';

  html += '<div style="flex:1;display:flex;flex-direction:column;padding:20px 36px;gap:0">';

  // ── Machine ──────────────────────────────────────────────────
  html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">';

  // Reels
  html += '<div style="background:#110622;border:4px solid #ffd700;padding:22px 28px;box-shadow:0 0 40px rgba(255,215,0,0.15)">';
  html += '<div style="display:flex;gap:12px;margin-bottom:20px">';
  for (var i = 0; i < 3; i++) {
    html += '<div id="sl-reel-' + i + '" style="width:84px;height:84px;background:#05010a;border:3px solid #2a1050;display:flex;align-items:center;justify-content:center;font-size:44px">'
          + SLOT_SYMS[s.reels[i]] + '</div>';
  }
  html += '</div>';

  // Bet chips
  html += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px">';
  [5, 10, 25, 50].forEach(function(v) {
    var on = s.bet === v;
    html += '<div onclick="slSetBet(' + v + ')" style="cursor:pointer;padding:8px 16px;border:2px solid '
          + (on ? '#ffd700' : '#2a1050') + ';background:' + (on ? '#1e1200' : '#0a0416')
          + ';color:' + (on ? '#ffd700' : '#604080') + ';font-family:inherit;font-size:7px;letter-spacing:1px">'
          + v + '</div>';
  });
  html += '</div>';

  // Spin button
  html += '<button id="sl-spin-btn" onclick="slSpin()" style="width:100%;padding:15px 0;font-size:9px;cursor:'
        + (s.spinning ? 'default' : 'pointer') + ';background:' + (s.spinning ? '#0c0418' : '#1a0a3a')
        + ';border:3px solid ' + (s.spinning ? '#2a1050' : '#ffd700')
        + ';color:' + (s.spinning ? '#3a2060' : '#ffd700')
        + ';font-family:inherit;letter-spacing:4px">'
        + (s.spinning ? '· · ·' : 'DREHEN') + '</button>';
  html += '</div>'; // machine frame

  // Message
  html += '<div style="height:32px;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:Arial,sans-serif;letter-spacing:1px;color:' + s.msgColor + '">'
        + s.msg + '</div>';

  html += '</div>'; // machine + msg center

  // ── Stats panel ───────────────────────────────────────────────
  html += '<div>';

  // Toggle row
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
  html += '<span style="font-size:7px;color:#6040a0;letter-spacing:3px">STOCHASTIK-INFO</span>';
  var on = s.showStats;
  html += '<div onclick="slToggleStats()" style="cursor:pointer;width:50px;height:26px;background:'
        + (on ? '#2a1050' : '#120820') + ';border:2px solid ' + (on ? '#8040c0' : '#2a1050')
        + ';border-radius:13px;position:relative">'
        + '<div style="position:absolute;top:3px;' + (on ? 'right:3px' : 'left:3px')
        + ';width:16px;height:16px;background:' + (on ? '#c080ff' : '#302050') + ';border-radius:50%"></div>'
        + '</div>';
  html += '</div>';

  if (s.showStats) {
    html += '<div style="background:#0c0520;border:2px solid #2a1050;padding:18px 24px;display:grid;grid-template-columns:1fr 1fr;gap:18px 32px">';
    var cells = [
      { lbl: 'P(GEWINN)',              val: pWin + '%' },
      { lbl: 'E[X] BEI EINSATZ ' + s.bet, val: evStr + ' Coins' },
      { lbl: 'P(JACKPOT 777)',         val: '1/216 ≈ 0.46%' },
      { lbl: 'SESSION-BILANZ',         val: balStr + ' (' + s.spinCount + ' Spins)' },
    ];
    cells.forEach(function(c) {
      html += '<div>'
            + '<div style="font-size:7px;color:#6040a0;letter-spacing:2px;margin-bottom:6px">' + c.lbl + '</div>'
            + '<div style="font-size:18px;color:#d090ff;font-family:Arial,sans-serif;font-weight:bold">' + c.val + '</div>'
            + '</div>';
    });
    html += '</div>';
  }

  html += '</div>'; // stats
  html += '</div></div>';

  showMiniUI(html);
}

function slSetBet(v) { SL.bet = v; slRender(); }
function slToggleStats() { SL.showStats = !SL.showStats; slRender(); }

function slSpin() {
  var s = SL;
  if (s.spinning || s.bet > G.coins) return;
  s.spinning = true;
  s.msg = '';
  slRender();

  var final3 = [
    Math.floor(Math.random() * 6),
    Math.floor(Math.random() * 6),
    Math.floor(Math.random() * 6),
  ];

  // Animate each reel stopping sequentially
  var stopAt = [600, 1000, 1400];
  for (var i = 0; i < 3; i++) {
    (function(idx) {
      var tick = 0;
      var interval = setInterval(function() {
        var el = document.getElementById('sl-reel-' + idx);
        if (el) el.textContent = SLOT_SYMS[tick % 6];
        tick++;
      }, 80);
      setTimeout(function() {
        clearInterval(interval);
        var el = document.getElementById('sl-reel-' + idx);
        if (el) el.textContent = SLOT_SYMS[final3[idx]];
      }, stopAt[idx]);
    })(i);
  }

  setTimeout(function() {
    s.spinning = false;
    s.reels = final3;
    s.spinCount++;

    var a = final3[0], b = final3[1], c = final3[2];
    var net = 0;

    if (a === b && b === c) {
      if (a === 5)      { net = s.bet * 50; s.msg = '🎉 JACKPOT 777!  +' + net; s.msgColor = '#ffd700'; }
      else if (a === 4) { net = s.bet * 20; s.msg = '💎 DREIFACH!  +' + net;     s.msgColor = '#ffd700'; }
      else              { net = s.bet * 10; s.msg = '✨ DREI GLEICHE  +' + net;   s.msgColor = '#a0d080'; }
    } else if (a === b || b === c || a === c) {
      net = s.bet * 2;
      s.msg = 'Zwei gleiche  +' + net;
      s.msgColor = '#80b060';
    } else {
      net = -s.bet;
      s.msg = 'Kein Glück  -' + s.bet;
      s.msgColor = '#c05050';
    }

    G.coins += net;
    s.balance += net;
    slRender();
  }, 1700);
}
