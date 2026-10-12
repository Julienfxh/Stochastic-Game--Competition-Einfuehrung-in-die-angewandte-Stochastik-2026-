// ============================================================
// CASINO INTERIOR
// ============================================================

var CASINO_MW = 13, CASINO_MH = 9, CTS = 50; // casino tile size

// 0=carpet, 1=marble, 2=wall, 3=column, 4=station(gen), 5=velvet, 6=light
var CASINO_MAP = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,1,1,1,0,0,0,0,2],
  [2,0,0,0,0,1,3,1,0,0,0,0,2],
  [2,0,0,0,0,1,1,1,0,0,0,0,2],
  [2,0,0,0,5,0,0,0,5,0,0,0,2],
  [2,0,0,0,5,0,6,0,5,0,0,0,2],
  [2,0,0,0,0,1,1,1,0,0,0,0,2],
  [2,0,0,0,0,1,3,1,0,0,0,0,2],
  [2,2,2,2,2,2,0,2,2,2,2,2,2],
];

function initCasinoMap() {
  CASINO_STATIONS.forEach(function(s) {
    CASINO_MAP[s.y][s.x] = 4;
  });
}

function drawCasinoTile(x, y, t) {
  var px = x * CTS, py = y * CTS;
  var alt = (x + y) % 2 === 0;

  if (t === 0 || t === 4) {
    ctx.fillStyle = alt ? C.cCarpet1 : C.cCarpet2;
    ctx.fillRect(px, py, CTS, CTS);
    if (alt && t === 0) {
      ctx.strokeStyle = "rgba(255,200,0,0.07)";
      ctx.beginPath(); ctx.arc(px+CTS/2, py+CTS/2, 8, 0, Math.PI*2); ctx.stroke();
    }
  }
  if (t === 1) {
    ctx.fillStyle = alt ? "#2e2e2e" : "#222";
    ctx.fillRect(px, py, CTS, CTS);
    ctx.strokeStyle = "#3a3a3a";
    ctx.strokeRect(px+6, py+6, CTS-12, CTS-12);
  }
  if (t === 2) {
    ctx.fillStyle = C.cWall;
    ctx.fillRect(px, py, CTS, CTS);
    ctx.fillStyle = "rgba(200,168,0,0.15)";
    ctx.fillRect(px+4, py+4, CTS-8, 4);
  }
  if (t === 3) {
    ctx.fillStyle = alt ? "#2e2e2e" : "#222";
    ctx.fillRect(px, py, CTS, CTS);
    ctx.fillStyle = C.cCol;
    ctx.fillRect(px+12, py+2, 26, 46);
    ctx.fillStyle = C.cGold;
    ctx.fillRect(px+10, py, 30, 8);
  }
  if (t === 5) {
    ctx.fillStyle = alt ? C.cCarpet1 : C.cCarpet2;
    ctx.fillRect(px, py, CTS, CTS);
    ctx.strokeStyle = "rgba(128,0,32,0.5)";
    ctx.strokeRect(px+8, py+8, CTS-16, CTS-16);
  }
  if (t === 6) {
    ctx.fillStyle = alt ? C.cCarpet1 : C.cCarpet2;
    ctx.fillRect(px, py, CTS, CTS);
    ctx.fillStyle = "#fffacd";
    ctx.shadowColor = "#fffacd";
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(px+CTS/2, py+10, 5, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawStation(x, y, st, isNear) {
  var px = x * CTS, py = y * CTS;
  var alt = (x + y) % 2 === 0;
  ctx.fillStyle = alt ? C.cCarpet1 : C.cCarpet2;
  ctx.fillRect(px, py, CTS, CTS);

  // Table
  var bg = st.id === "cbar" ? "#3a2010" : "#0a5a1a";
  ctx.fillStyle = bg;
  ctx.fillRect(px+4, py+4, CTS-8, CTS-8);
  ctx.strokeStyle = C.cGold;
  ctx.lineWidth = 3;
  ctx.strokeRect(px+4, py+4, CTS-8, CTS-8);
  ctx.lineWidth = 1;

  if (isNear) {
    ctx.shadowColor = st.color;
    ctx.shadowBlur = 16;
    ctx.strokeRect(px+4, py+4, CTS-8, CTS-8);
    ctx.shadowBlur = 0;
  }

  // Icon + name
  ctx.font = "16px serif";
  ctx.textAlign = "center";
  ctx.fillText(st.icon, px+CTS/2, py+CTS/2-2);
  ctx.textAlign = "left";
  drawText(st.name, px+CTS/2, py+CTS/2+12, C.cGold, 5, "center");

  if (isNear) {
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(px+2, py-18, CTS-4, 16);
    drawText("ENTER", px+CTS/2, py-6, C.gold, 5, "center");
  }
}

function drawExitTile(x, y, isNear) {
  var px = x * CTS, py = y * CTS;
  ctx.fillStyle = "#1a0a0a";
  ctx.fillRect(px, py, CTS, CTS);
  ctx.fillStyle = C.cGold;
  ctx.fillRect(px, py, CTS, 3);
  drawText("EXIT", px+CTS/2, py+CTS-8, C.gold, 6, "center");
  if (isNear) {
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(px+2, py-18, CTS-4, 16);
    drawText("ENTER", px+CTS/2, py-6, C.gold, 5, "center");
  }
}

function renderCasinoWorld() {
  var p = G.casinoPlayer;

  var camX = Math.min(0, Math.max(VW - CASINO_MW * CTS, VW/2 - p.x * CTS - CTS/2));
  var camY = Math.min(0, Math.max(VH - CASINO_MH * CTS - 28, (VH-28)/2 - p.y * CTS - CTS/2));

  drawCoinBar("🎰 Tivoli Casino");

  ctx.save();
  ctx.translate(camX, camY + 28);

  // Background
  ctx.fillStyle = C.cBg;
  ctx.fillRect(0, 0, CASINO_MW * CTS, CASINO_MH * CTS);

  for (var y = 0; y < CASINO_MH; y++) {
    for (var x = 0; x < CASINO_MW; x++) {
      var t = CASINO_MAP[y][x];
      var isExit = (y === CASINO_MH - 1 && x === 6);

      if (isExit) {
        drawExitTile(x, y, G.isNearExit);
      } else {
        // Station?
        var st = null;
        CASINO_STATIONS.forEach(function(s) { if (s.x === x && s.y === y) st = s; });
        if (st) {
          drawStation(x, y, st, G.nearStation && G.nearStation.id === st.id);
        } else {
          drawCasinoTile(x, y, t);
        }
      }
    }
  }

  // Player
  drawProf(p.x * CTS + 7, p.y * CTS - 4, p);

  // Atmospheric overlay
  var grad = ctx.createRadialGradient(CASINO_MW*CTS/2, CASINO_MH*CTS/2, 100, CASINO_MW*CTS/2, CASINO_MH*CTS/2, 350);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CASINO_MW*CTS, CASINO_MH*CTS);

  ctx.restore();

  // HUD
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(VW-160, 32, 155, 20);
  var label = G.isNearExit ? "🚪 Ausgang" : (G.nearStation ? G.nearStation.icon + " " + G.nearStation.name : "Waehle einen Tisch");
  drawText(label, VW-10, 47, C.gold, 6, "right");

  drawText("ESC = Campus", VW/2, VH-10, C.dim, 6, "center");
}
