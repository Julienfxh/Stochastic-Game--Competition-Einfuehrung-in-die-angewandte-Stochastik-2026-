// ============================================================
// RWTH SHOP
// ============================================================

var SHOP_SKINS = [
  { id:'default', name:'Professor',    desc:'Der Klassiker. Unverkennbar.',              price:200,
    colors:{ hair:'#8a8a8a', beard:'#909090', jacket:'#6b5a42', shirt:'#e8dcc8', pants:'#2a2a3a' } },
  { id:'ersti',   name:'Ersti-Hoodie', desc:'Frisch immatrikuliert. Man sieht\'s.',      price:0,
    colors:{ hair:'#7a5230', beard:'#8a6240', jacket:'#3a6a3a', shirt:'#c8e8c8', pants:'#2a3a5a' } },
  { id:'rwth',    name:'Laplace',      desc:'Elegant. Klassisch. Pie mal Daumen.',       price:200,
    colors:{ hair:'#8a8a8a', beard:'#909090', jacket:'#003f8a', shirt:'#dde8f8', pants:'#001f55' } },
  { id:'boss',    name:'Bernoulli',    desc:'P(gut aussehen) = 1. Nachgewiesen.',        price:200,
    colors:{ hair:'#c8a800', beard:'#b09000', jacket:'#111111', shirt:'#f0e8d0', pants:'#080808' } },
  { id:'vip',     name:'Monte Carlo',  desc:'Simulation laeuft. Budget konvergiert gegen 0.', price:600,
    colors:{ hair:'#c8a800', beard:'#b09000', jacket:'#6a1a8a', shirt:'#f0d8f8', pants:'#2a0a4a' } },
];

function openShop() {
  G.screen = 'shop';
  shopRender();
}

function shopRender() {
  var html = '<div class="mini-screen" style="background:#04040e">';

  html += '<div class="mini-header" style="border-color:#003f8a;background:linear-gradient(180deg,rgba(0,63,138,0.12),transparent)">'
        + '🎓 RWTH Shop'
        + '<span class="coin-display">💰 <span id="shop-coins">' + G.coins + '</span></span>'
        + '<button class="rbtn" onclick="G.screen=\'overworld\';closeMiniUI()">← Campus</button>'
        + '</div>';

  html += '<div style="flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:10px">';

  SHOP_SKINS.forEach(function(skin) {
    var owned    = G.ownedSkins.indexOf(skin.id) >= 0;
    var equipped = G.equippedSkin === skin.id;
    var canAfford = G.coins >= skin.price;

    var borderL = skin.colors.jacket;
    var borderC = equipped ? '#ffd700' : owned ? '#003f8a55' : canAfford ? '#1a1a3a' : '#111120';
    var bg      = equipped ? '#080818' : '#06060e';

    html += '<div style="display:flex;align-items:center;gap:20px;padding:14px 18px;background:' + bg
          + ';border:2px solid ' + borderC + ';border-left:5px solid ' + borderL + '">';

    html += '<canvas id="shoppreview-' + skin.id + '" width="36" height="44" style="flex-shrink:0;image-rendering:pixelated;image-rendering:crisp-edges"></canvas>';

    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-size:9px;color:' + (equipped ? '#ffd700' : '#e0e0e0') + ';margin-bottom:5px;letter-spacing:1px">'
          + skin.name + (equipped ? ' <span style="color:#ffd700">✓</span>' : '') + '</div>';
    html += '<div style="font-size:7px;color:#40405a;line-height:1.6">' + skin.desc + '</div>';
    html += '</div>';

    html += '<div style="flex-shrink:0">';
    if (equipped) {
      html += '<div style="font-size:7px;color:#ffd700;padding:8px 16px;border:2px solid #ffd70055;background:#0a0a00;letter-spacing:2px">AKTIV</div>';
    } else if (owned) {
      html += '<button onclick="shopEquip(\'' + skin.id + '\')" style="font-family:inherit;font-size:7px;padding:8px 16px;background:#00102a;border:2px solid #003f8a;color:#6a9fe8;cursor:pointer;letter-spacing:1px">ANLEGEN</button>';
    } else if (skin.price === 0) {
      html += '<button onclick="shopEquip(\'' + skin.id + '\')" style="font-family:inherit;font-size:7px;padding:8px 16px;background:#001f00;border:2px solid #2a6a2a;color:#70d070;cursor:pointer;letter-spacing:1px">GRATIS</button>';
    } else if (canAfford) {
      html += '<button onclick="shopBuy(\'' + skin.id + '\')" style="font-family:inherit;font-size:7px;padding:8px 16px;background:#0a1a00;border:2px solid #3a8a2a;color:#90e060;cursor:pointer;letter-spacing:1px">💰 ' + skin.price + '</button>';
    } else {
      html += '<div style="font-size:7px;color:#2a2a40;padding:8px 16px;border:2px solid #111120;letter-spacing:1px">💰 ' + skin.price + '</div>';
    }
    html += '</div>';

    html += '</div>';
  });

  html += '</div></div>';
  showMiniUI(html);
  shopDrawPreviews();
}

function shopDrawPreviews() {
  SHOP_SKINS.forEach(function(skin) {
    var cv = document.getElementById('shoppreview-' + skin.id);
    if (!cv) return;
    shopDrawMiniProf(cv.getContext('2d'), skin.colors);
  });
}

function shopDrawMiniProf(c, sc) {
  function F(ox, oy, fw, fh, col) {
    c.fillStyle = col;
    c.fillRect(ox, oy, fw, fh);
  }
  F(6,  0,  24, 8,  sc.hair);
  F(4,  3,  6,  7,  sc.hair);
  F(26, 3,  6,  7,  sc.hair);
  F(8,  4,  20, 16, '#e8b888');
  c.strokeStyle = '#2a2a2a'; c.lineWidth = 2;
  c.strokeRect(8.5, 8.5, 9, 5);
  c.strokeRect(19.5, 8.5, 9, 5);
  c.lineWidth = 1;
  F(10, 15, 16, 8,  sc.beard);
  F(4,  22, 28, 14, sc.jacket);
  F(12, 22, 12, 6,  sc.shirt);
  F(14, 27, 8,  5,  '#1a1a1a');
  F(9,  36, 7,  8,  sc.pants);
  F(20, 36, 7,  8,  sc.pants);
}

function shopBuy(id) {
  var skin = null;
  SHOP_SKINS.forEach(function(s) { if (s.id === id) skin = s; });
  if (!skin || G.ownedSkins.indexOf(id) >= 0 || G.coins < skin.price) return;
  G.coins -= skin.price;
  G.ownedSkins.push(id);
  G.equippedSkin = id;
  shopRender();
}

function shopEquip(id) {
  if (G.ownedSkins.indexOf(id) < 0) G.ownedSkins.push(id);
  G.equippedSkin = id;
  shopRender();
}
