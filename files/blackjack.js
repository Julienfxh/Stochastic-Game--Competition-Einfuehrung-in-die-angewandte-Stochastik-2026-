// ============================================================
// BLACKJACK — 6-Deck Shoe + Strategy Advisor
// ============================================================

var BJ_VALS  = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
var BJ_SUITS = ['♠','♥','♦','♣'];

var BJ = {
  shoe: [], player: [], dealer: [],
  bet: 25, phase: 'bet',
  msg: '', msgColor: '#ffd700',
  doubled: false,
  advice: null
};

// ── 6-Deck Shoe ──────────────────────────────────────────────
function bjMakeShoe() {
  var shoe = [];
  for (var d = 0; d < 6; d++) {
    BJ_SUITS.forEach(function(s) { BJ_VALS.forEach(function(v) { shoe.push({s:s,v:v}); }); });
  }
  for (var i = shoe.length-1; i > 0; i--) { var j = 0|Math.random()*(i+1); var t=shoe[i];shoe[i]=shoe[j];shoe[j]=t; }
  return shoe;
}

function bjDraw() {
  if (!BJ.shoe || BJ.shoe.length < 52) BJ.shoe = bjMakeShoe();
  return BJ.shoe.pop();
}

// ── Card Helpers ─────────────────────────────────────────────
function bjVal(card) {
  if (card.v === 'A') return 11;
  if (card.v === 'J' || card.v === 'Q' || card.v === 'K' || card.v === '10') return 10;
  return parseInt(card.v);
}

function bjTotal(hand) {
  var t = 0, aces = 0;
  hand.forEach(function(c) { t += bjVal(c); if (c.v==='A') aces++; });
  while (t > 21 && aces > 0) { t -= 10; aces--; }
  return t;
}

function bjIsSoft(hand) {
  var hard = 0, aces = 0;
  hand.forEach(function(c) { if (c.v === 'A') aces++; else hard += bjVal(c); });
  hard += aces;
  return aces > 0 && hard + 10 <= 21;
}

// ── Card / Chip HTML ─────────────────────────────────────────
function bjCardHTML(card, hidden) {
  if (hidden) {
    return '<div style="width:66px;height:98px;flex-shrink:0;border-radius:8px;border:2px solid rgba(255,215,0,0.4);background:linear-gradient(135deg,#102060 0%,#071030 100%);box-shadow:3px 4px 12px rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center">'
         + '<div style="width:52px;height:80px;border:1.5px solid rgba(255,215,0,0.2);border-radius:4px;background:repeating-linear-gradient(45deg,rgba(255,215,0,0.04),rgba(255,215,0,0.04) 2px,transparent 2px,transparent 8px)"></div>'
         + '</div>';
  }
  var red = card.s==='♥'||card.s==='♦';
  var col = red ? '#c0151a' : '#111';
  return '<div style="width:66px;height:98px;flex-shrink:0;border-radius:8px;border:1px solid #bbb;background:#fafaf6;box-shadow:3px 4px 12px rgba(0,0,0,0.6);display:flex;flex-direction:column;padding:5px 7px;position:relative">'
       + '<div style="font-size:17px;font-weight:900;color:' + col + ';font-family:Arial,sans-serif;line-height:1">' + card.v + '</div>'
       + '<div style="font-size:13px;color:' + col + ';font-family:Arial,sans-serif;line-height:1">' + card.s + '</div>'
       + '<div style="flex:1;display:flex;align-items:center;justify-content:center;font-size:32px;color:' + col + ';font-family:Arial,sans-serif">' + card.s + '</div>'
       + '</div>';
}

function bjChipHTML(v, active) {
  var cols = {5:'#888',10:'#4a90d9',25:'#228822',50:'#cc2222',100:'#9922bb'};
  var c = cols[v] || '#555';
  return '<div onclick="BJ.bet=' + v + ';bjRender()" style="cursor:pointer;width:46px;height:46px;border-radius:50%;background:' + (active?c:'rgba(0,0,0,0.35)') + ';border:3px solid ' + c + ';display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:' + (active?'#fff':'rgba(255,255,255,0.3)') + ';box-shadow:' + (active?'0 0 12px '+c+'88':'none') + '">' + v + '</div>';
}

// ── Strategy Advisor ─────────────────────────────────────────
function bjDealerFaceVal(card) {
  if (card.v === 'A') return 11;
  if (card.v === 'J' || card.v === 'Q' || card.v === 'K' || card.v === '10') return 10;
  return parseInt(card.v);
}

function bjGetAdvice(hand, dealerCard) {
  var total    = bjTotal(hand);
  var soft     = bjIsSoft(hand);
  var twoCards = hand.length === 2;
  var dv       = bjDealerFaceVal(dealerCard);

  var hp, sp, dp = null, best;

  if (total >= 21) {
    return { optimal:'stand', pcts:{hit:4,stand:96}, handTotal:total, isSoft:soft, dealerFace:dealerCard.v };
  }

  if (soft) {
    if (total <= 17) {
      if (twoCards && total >= 15 && dv >= 4 && dv <= 6) {
        dp = 58; hp = 50; sp = 38; best = 'double';
      } else if (twoCards && total >= 13 && dv >= 5 && dv <= 6) {
        dp = 55; hp = 49; sp = 36; best = 'double';
      } else {
        hp = 52; sp = 36; best = 'hit';
      }
    } else if (total === 18) {
      if (dv >= 3 && dv <= 6) {
        dp = twoCards ? 62 : null; sp = 57; hp = 49;
        best = twoCards ? 'double' : 'stand';
      } else if (dv === 2 || dv === 7 || dv === 8) {
        sp = 61; hp = 52; best = 'stand';
      } else {
        hp = 53; sp = 52; best = 'hit';
      }
    } else {
      sp = Math.min(95, 72 + (total - 19) * 10); hp = 22; best = 'stand';
    }
  } else {
    if (total <= 8) {
      hp = 46; sp = 18; best = 'hit';
    } else if (total === 9) {
      if (twoCards && dv >= 3 && dv <= 6) {
        dp = 54; hp = 47; sp = 22; best = 'double';
      } else {
        hp = 47; sp = 22; best = 'hit';
      }
    } else if (total === 10) {
      if (twoCards && dv <= 9) {
        dp = 55 + Math.max(0, 7 - dv); hp = 50; sp = 24; best = 'double';
      } else {
        hp = dv <= 9 ? 50 : 46; sp = 24; best = 'hit';
      }
    } else if (total === 11) {
      if (twoCards && dv <= 10) {
        dp = 64; hp = 54; sp = 26; best = 'double';
      } else {
        hp = 54; sp = 26; best = 'hit';
      }
    } else if (total === 12) {
      if (dv >= 4 && dv <= 6) {
        sp = 44; hp = 39; best = 'stand';
      } else {
        hp = 43; sp = 36; best = 'hit';
      }
    } else if (total >= 13 && total <= 16) {
      if (dv >= 2 && dv <= 6) {
        var dBonus = [0,0,8,10,12,14,14][dv] || 0;
        sp = 40 + dBonus - (16 - total) * 2;
        hp = sp - 9;
        best = 'stand';
      } else {
        var dPen = dv >= 10 ? 8 : dv === 11 ? 10 : 4;
        hp = 44 - dPen + (total - 13) * 2;
        sp = hp - 11;
        best = 'hit';
      }
    } else if (total === 17) {
      sp = 67; hp = 34; best = 'stand';
    } else {
      sp = Math.min(94, 73 + (total - 18) * 9);
      hp = Math.max(5,  28 - (total - 18) * 10);
      best = 'stand';
    }
  }

  var pcts = { hit: Math.round(Math.max(1, hp)), stand: Math.round(Math.max(1, sp)) };
  if (dp !== null) pcts.double = Math.round(dp);

  return { optimal: best, pcts: pcts, handTotal: total, isSoft: soft, dealerFace: dealerCard.v };
}

function bjAdviceHTML(adv) {
  if (!adv) return '';
  var chosen  = adv.chosen;
  var optimal = adv.optimal;
  var correct = chosen === optimal;
  var accent  = correct ? '#50c050' : '#e06060';
  var lbl     = { hit:'HIT', stand:'STAND', double:'DOUBLE' };

  var html = '<div style="margin-bottom:12px;padding:10px 14px;background:rgba(0,0,0,0.38);border-left:3px solid ' + accent + '">';

  // Header row
  html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;flex-wrap:wrap">';
  html += '<span style="font-size:6px;color:rgba(255,255,255,0.28)">ANALYSE · Hand '
        + (adv.isSoft ? 'Soft ' : '') + adv.handTotal + ' vs Dealer ' + adv.dealerFace + '</span>';
  html += '<span style="font-size:8px;font-family:Arial,sans-serif;font-weight:bold;color:' + accent + '">'
        + lbl[chosen] + ' ' + (correct ? '✓' : '✗') + '</span>';
  if (!correct) {
    html += '<span style="font-size:6px;color:#9090a0">Optimal: ' + lbl[optimal] + '</span>';
  }
  html += '</div>';

  // Bars
  ['hit','stand','double'].forEach(function(act) {
    if (adv.pcts[act] === undefined) return;
    var pct       = adv.pcts[act];
    var isOpt     = act === optimal;
    var isChos    = act === chosen;
    var barColor  = isOpt  ? '#50c050' : (isChos ? '#5080d0' : '#2a2a4a');
    var txtColor  = isOpt  ? '#80e080' : (isChos ? '#a0c0ff' : '#505070');
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">';
    html += '<span style="font-size:6px;width:44px;color:' + txtColor + ';text-align:right;letter-spacing:1px">' + lbl[act] + '</span>';
    html += '<div style="flex:1;height:8px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden">';
    html += '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';border-radius:2px"></div>';
    html += '</div>';
    html += '<span style="font-size:6px;color:' + txtColor + ';width:26px">' + pct + '%</span>';
    html += '</div>';
  });

  html += '</div>';
  return html;
}

// ── Open / Render ─────────────────────────────────────────────
function openBlackjack() {
  G.screen = 'blackjack';
  if (!BJ.shoe || BJ.shoe.length < 52) BJ.shoe = bjMakeShoe();
  BJ.player = []; BJ.dealer = [];
  BJ.phase = 'bet'; BJ.msg = ''; BJ.doubled = false; BJ.advice = null;
  bjRender();
}

function bjRender() {
  var s = BJ;
  var pTot = s.player.length ? bjTotal(s.player) : 0;
  var dTotVisible = s.dealer.length ? bjTotal([s.dealer[0]]) : 0;
  var dTotFull    = s.dealer.length ? bjTotal(s.dealer)     : 0;
  var showFull    = s.phase === 'dealer' || s.phase === 'result';

  var html = '<div class="mini-screen" style="background:radial-gradient(ellipse at 50% 40%,#0b6824 0%,#054a16 55%,#022d0a 100%)">';

  // Header
  html += '<div class="mini-header" style="border-color:#1a8a30;background:rgba(0,0,0,0.35)">🃏 Blackjack'
        + '<span class="coin-display">💰 <span id="bj-coins">' + G.coins + '</span></span>'
        + '<button class="rbtn" onclick="G.screen=\'casino\';closeMiniUI()">Zurück</button>'
        + '</div>';

  html += '<div style="flex:1;display:flex;flex-direction:column;padding:14px 40px 10px">';

  // ── Dealer ────────────────────────────────────────────────────
  html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">';
  html += '<div style="display:flex;align-items:center;gap:10px">';
  html += '<span style="font-size:6px;color:rgba(255,255,255,0.45);letter-spacing:3px">DEALER</span>';
  if (s.dealer.length) {
    var dDisp = showFull ? dTotFull : dTotVisible;
    var dCol  = showFull && dTotFull > 21 ? '#ff7070' : '#fff';
    html += '<span style="font-size:15px;font-family:Arial,sans-serif;font-weight:bold;color:' + dCol + ';background:rgba(0,0,0,0.3);padding:2px 12px;border-radius:20px">'
          + dDisp + (showFull && dTotFull > 21 ? ' BUST' : (!showFull ? ' +?' : '')) + '</span>';
  }
  html += '</div>';
  html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">';
  if (s.dealer.length) {
    s.dealer.forEach(function(c,i){ html += bjCardHTML(c, i===1 && !showFull); });
  } else {
    html += bjCardHTML(null,true) + bjCardHTML(null,true);
  }
  html += '</div></div>';

  // ── Center divider ────────────────────────────────────────────
  html += '<div style="display:flex;align-items:center;gap:0;margin:0 -40px">';
  html += '<div style="flex:1;height:1px;background:rgba(255,255,255,0.12)"></div>';
  html += '<div style="padding:4px 20px;border:1px solid rgba(255,255,255,0.15);border-radius:20px;font-size:6px;color:rgba(255,255,255,0.25);letter-spacing:3px">BLACKJACK · 6 Decks</div>';
  html += '<div style="flex:1;height:1px;background:rgba(255,255,255,0.12)"></div>';
  html += '</div>';

  // ── Player ────────────────────────────────────────────────────
  html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">';
  html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">';
  if (s.player.length) {
    s.player.forEach(function(c){ html += bjCardHTML(c, false); });
  } else {
    html += bjCardHTML(null,true) + bjCardHTML(null,true);
  }
  html += '</div>';
  if (s.player.length) {
    var pCol = pTot > 21 ? '#ff7070' : pTot === 21 ? '#ffd700' : '#fff';
    html += '<div style="display:flex;align-items:center;gap:10px">';
    html += '<span style="font-size:6px;color:rgba(255,255,255,0.45);letter-spacing:3px">SIE</span>';
    html += '<span style="font-size:15px;font-family:Arial,sans-serif;font-weight:bold;color:' + pCol
          + ';background:rgba(0,0,0,0.3);padding:2px 12px;border-radius:20px">'
          + pTot + (pTot > 21 ? ' BUST' : pTot === 21 ? ' ✨' : '') + '</span>';
    html += '</div>';
  }
  html += '</div>';

  // ── Controls ──────────────────────────────────────────────────
  html += '<div style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.1)">';

  if (s.phase === 'bet') {
    html += '<div style="display:flex;align-items:center;gap:10px">';
    [5,10,25,50,100].forEach(function(v){ html += bjChipHTML(v, s.bet===v); });
    html += '<div style="flex:1"></div>';
    html += '<div style="font-size:11px;font-family:Arial,sans-serif;color:rgba(255,255,255,0.5)">Einsatz&nbsp;<span style="color:#ffd700;font-size:14px;font-weight:bold">' + s.bet + '</span></div>';
    var canDeal = s.bet <= G.coins;
    html += '<button onclick="bjDeal()" style="padding:13px 28px;background:' + (canDeal?'#155a20':'#0a2010') + ';border:3px solid ' + (canDeal?'#3aaa4a':'#1a3a20') + ';color:' + (canDeal?'#fff':'#2a5030') + ';font-family:inherit;font-size:9px;cursor:' + (canDeal?'pointer':'default') + ';letter-spacing:3px">DEAL</button>';
    html += '</div>';

  } else if (s.phase === 'play') {
    html += bjAdviceHTML(s.advice);
    html += '<div style="display:flex;gap:10px;justify-content:center">';
    html += '<button onclick="bjHit()"   style="flex:1;max-width:160px;padding:15px 0;background:#102855;border:3px solid #3a70cc;color:#fff;font-family:inherit;font-size:9px;cursor:pointer;letter-spacing:3px">HIT</button>';
    html += '<button onclick="bjStand()" style="flex:1;max-width:160px;padding:15px 0;background:#551010;border:3px solid #cc3a3a;color:#fff;font-family:inherit;font-size:9px;cursor:pointer;letter-spacing:3px">STAND</button>';
    if (s.player.length === 2 && s.bet <= G.coins) {
      html += '<button onclick="bjDouble()" style="flex:1;max-width:160px;padding:15px 0;background:#402a00;border:3px solid #cc9a20;color:#ffd700;font-family:inherit;font-size:9px;cursor:pointer;letter-spacing:2px">DOUBLE</button>';
    }
    html += '</div>';

  } else if (s.phase === 'dealer') {
    html += bjAdviceHTML(s.advice);
    html += '<div style="text-align:center;font-size:12px;font-family:Arial,sans-serif;color:rgba(255,255,255,0.5);padding:8px 0">Dealer zieht · · ·</div>';

  } else if (s.phase === 'result') {
    html += bjAdviceHTML(s.advice);
    html += '<div style="display:flex;align-items:center;gap:16px">';
    html += '<div style="font-size:18px;font-family:Arial,sans-serif;font-weight:bold;color:' + s.msgColor + '">' + s.msg + '</div>';
    html += '<div style="flex:1"></div>';
    html += '<button onclick="bjNewRound()" style="padding:13px 24px;background:#155a20;border:3px solid #3aaa4a;color:#fff;font-family:inherit;font-size:8px;cursor:pointer;letter-spacing:2px">NEUE RUNDE</button>';
    html += '</div>';
  }

  html += '</div>'; // controls
  html += '</div></div>';
  showMiniUI(html);
}

// ── Game Actions ─────────────────────────────────────────────
function bjDeal() {
  if (BJ.bet > G.coins) return;
  BJ.advice = null;
  G.coins -= BJ.bet;
  BJ.player = [bjDraw(), bjDraw()];
  BJ.dealer = [bjDraw(), bjDraw()];
  BJ.doubled = false;

  var pTot = bjTotal(BJ.player);
  var dTot = bjTotal(BJ.dealer);

  if (pTot === 21 && dTot === 21) {
    G.coins += BJ.bet;
    BJ.msg = 'Beide Blackjack — Unentschieden!'; BJ.msgColor = '#ffd700'; BJ.phase = 'result';
  } else if (pTot === 21) {
    var bj = Math.floor(BJ.bet * 1.5);
    G.coins += BJ.bet + bj;
    BJ.msg = '🎉 BLACKJACK! +' + bj; BJ.msgColor = '#ffd700'; BJ.phase = 'result';
  } else {
    BJ.phase = 'play';
  }
  bjRender();
}

function bjHit() {
  if (BJ.phase !== 'play') return;
  var adv = bjGetAdvice(BJ.player.slice(), BJ.dealer[0]);
  adv.chosen = 'hit';
  BJ.advice = adv;

  BJ.player.push(bjDraw());
  var t = bjTotal(BJ.player);
  if (t > 21) {
    BJ.msg = 'Bust! −' + BJ.bet; BJ.msgColor = '#ff7070'; BJ.phase = 'result';
    bjRender();
  } else if (t === 21) {
    bjStandInternal();
  } else {
    bjRender();
  }
}

function bjDouble() {
  if (BJ.phase !== 'play' || BJ.player.length !== 2 || BJ.bet > G.coins) return;
  var adv = bjGetAdvice(BJ.player.slice(), BJ.dealer[0]);
  adv.chosen = 'double';
  BJ.advice = adv;

  G.coins -= BJ.bet;
  BJ.bet *= 2;
  BJ.doubled = true;
  BJ.player.push(bjDraw());
  var t = bjTotal(BJ.player);
  if (t > 21) {
    BJ.msg = 'Bust! −' + BJ.bet; BJ.msgColor = '#ff7070'; BJ.phase = 'result';
    bjRender();
  } else {
    bjStandInternal();
  }
}

function bjStand() {
  if (BJ.phase !== 'play') return;
  var adv = bjGetAdvice(BJ.player.slice(), BJ.dealer[0]);
  adv.chosen = 'stand';
  BJ.advice = adv;
  bjStandInternal();
}

function bjStandInternal() {
  BJ.phase = 'dealer';
  bjRender();
  bjDealerTurn();
}

function bjDealerTurn() {
  if (bjTotal(BJ.dealer) < 17) {
    setTimeout(function() {
      BJ.dealer.push(bjDraw());
      bjRender();
      bjDealerTurn();
    }, 650);
  } else {
    setTimeout(bjResolve, 500);
  }
}

function bjResolve() {
  var p = bjTotal(BJ.player);
  var d = bjTotal(BJ.dealer);
  if (d > 21 || p > d) {
    G.coins += BJ.bet * 2;
    BJ.msg = 'Gewonnen! +' + BJ.bet; BJ.msgColor = '#60e060';
  } else if (p === d) {
    G.coins += BJ.bet;
    BJ.msg = 'Unentschieden — Einsatz zurück'; BJ.msgColor = '#ffd700';
  } else {
    BJ.msg = 'Verloren! −' + BJ.bet; BJ.msgColor = '#ff7070';
  }
  BJ.phase = 'result';
  bjRender();
}

function bjNewRound() {
  if (BJ.doubled) BJ.bet = Math.floor(BJ.bet / 2);
  BJ.player = []; BJ.dealer = [];
  BJ.phase = 'bet'; BJ.msg = ''; BJ.doubled = false; BJ.advice = null;
  bjRender();
}
