// ============================================================
// CAMPUS OVERWORLD
// ============================================================

var CAMPUS_W = 17, CAMPUS_H = 11, TS = 40; // tile size

// 0=grass, 1=path, 2=tree, 4=building(gen), 5=flowers, 6=bench
var CAMPUS_MAP = [
  [2,0,5,0,0,2,0,0,0,1,0,0,2,0,0,5,2],
  [0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0],
  [0,5,0,0,6,0,0,1,0,1,0,1,0,0,0,0,2],
  [0,0,0,0,1,1,1,1,0,1,0,1,0,5,0,0,0],
  [0,0,1,1,1,0,0,0,0,1,0,1,1,1,1,0,0],
  [0,0,1,0,0,0,5,0,1,1,0,0,0,1,0,0,0],
  [2,0,1,0,0,0,0,0,1,0,6,0,0,1,0,0,2],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,5,0],
  [0,5,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
  [0,0,0,2,0,5,0,0,1,0,0,5,0,0,0,0,2],
  [2,0,0,0,0,0,2,0,1,0,2,0,0,2,0,0,2],
];

function initCampusMap() {
  LEVELS.forEach(function(l) {
    if (l.by >= 0 && l.by < CAMPUS_H) CAMPUS_MAP[l.by][l.bx] = 4;
  });
}

function drawCampusTile(x, y, t) {
  var px = x * TS, py = y * TS;
  var alt = (x + y) % 2 === 0;
  var g = alt ? C.grass1 : C.grass2;

  if (t === 0 || t === 4 || t === 5 || t === 6) {
    ctx.fillStyle = g;
    ctx.fillRect(px, py, TS, TS);
  }

  if (t === 1) {
    ctx.fillStyle = alt ? C.path1 : C.path2;
    ctx.fillRect(px, py, TS, TS);
  }

  if (t === 2) {
    ctx.fillStyle = g;
    ctx.fillRect(px, py, TS, TS);
    ctx.fillStyle = C.trunk;
    ctx.fillRect(px+16, py+20, 8, 16);
    ctx.fillStyle = alt ? C.tree1 : C.tree2;
    ctx.beginPath(); ctx.arc(px+20, py+14, 14, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#1d7d1d";
    ctx.beginPath(); ctx.arc(px+20, py+8, 10, 0, Math.PI*2); ctx.fill();
  }

  if (t === 5) {
    ctx.fillStyle = "#e04040";
    ctx.beginPath(); ctx.arc(px+10, py+14, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#e0c040";
    ctx.beginPath(); ctx.arc(px+24, py+22, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#d050d0";
    ctx.beginPath(); ctx.arc(px+16, py+30, 3, 0, Math.PI*2); ctx.fill();
  }

  if (t === 6) {
    ctx.fillStyle = "#5a3a1a";
    ctx.fillRect(px+6, py+18, 28, 5);
    ctx.fillStyle = "#3a2a0a";
    ctx.fillRect(px+9, py+23, 3, 8);
    ctx.fillRect(px+28, py+23, 3, 8);
  }
}

function drawBuilding(x, y, lvl, isNear) {
  var px = x * TS, py = y * TS;
  // Roof
  ctx.fillStyle = lvl.color;
  ctx.fillRect(px+2, py+2, 36, 8);
  if (isNear) {
    ctx.shadowColor = lvl.color;
    ctx.shadowBlur = 14;
    ctx.fillRect(px+2, py+2, 36, 8);
    ctx.shadowBlur = 0;
  }
  // Wall
  ctx.fillStyle = C.bld;
  ctx.fillRect(px+4, py+10, 32, 22);
  // Door
  ctx.fillStyle = C.door;
  ctx.fillRect(px+15, py+20, 10, 12);
  // Windows
  ctx.fillStyle = "#8a8aaa";
  ctx.fillRect(px+8, py+12, 5, 5);
  ctx.fillRect(px+27, py+12, 5, 5);
  // WR-Gebäude: Label mit dunklem Hintergrund auf dem Dach
  // Andere Gebäude (Casino, Ponte): Emoji über dem Dach
  if (lvl.label) {
    // Fixes Layout: [4px Tab][28px Dark Box][4px Tab] = 36px = Dachbreite
    ctx.fillStyle = lvl.color;
    ctx.fillRect(px + 2, py + 2, 4, 10);
    ctx.fillRect(px + 34, py + 2, 4, 10);
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(px + 6, py + 2, 28, 10);
    ctx.font = "7px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    var tw = ctx.measureText(lvl.label).width;
    ctx.fillStyle = "#ffffff";
    if (tw > 24) {
      ctx.save();
      ctx.translate(px + 20, 0);
      ctx.scale(24 / tw, 1);
      ctx.fillText(lvl.label, 0, py + 10);
      ctx.restore();
    } else {
      ctx.fillText(lvl.label, px + 20, py + 10);
    }
    ctx.textAlign = "left";
  } else {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(px + 4, py + 2, 32, 10);
    ctx.font = "10px serif";
    ctx.fillText(lvl.icon, px + 20, py + 10);
    ctx.textAlign = "left";
  }
  // Near label
  if (isNear) {
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(px-10, py-22, 60, 16);
    drawText("ENTER", px+20, py-10, C.gold, 6, "center");
  }
}

function renderCampus() {
  var p = G.player;

  // Camera
  var camX = Math.min(0, Math.max(VW - CAMPUS_W * TS, VW/2 - p.x * TS - TS/2));
  var camY = Math.min(0, Math.max(VH - CAMPUS_H * TS - 28, (VH-28)/2 - p.y * TS - TS/2));

  // Coin bar
  drawCoinBar();

  ctx.save();
  ctx.translate(camX, camY + 28);

  // Draw tiles
  for (var y = 0; y < CAMPUS_H; y++) {
    for (var x = 0; x < CAMPUS_W; x++) {
      var t = CAMPUS_MAP[y][x];
      drawCampusTile(x, y, t);

      // Building?
      var lvl = null;
      LEVELS.forEach(function(l) { if (l.bx === x && l.by === y) lvl = l; });
      if (lvl) {
        drawBuilding(x, y, lvl, G.nearBuilding && G.nearBuilding.id === lvl.id);
      }
    }
  }

  // Player
  drawProf(p.x * TS + 2, p.y * TS - 4, p);

  ctx.restore();

  // HUD
  if (!G.dialog) {
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(VW-180, 32, 175, 20);
    if (G.nearBuilding) {
      drawText(G.nearBuilding.icon + " " + G.nearBuilding.name, VW-10, 47, C.gold, 6, "right");
    } else {
      drawText("Erkunde den Campus!", VW-10, 47, C.dim, 6, "right");
    }
  }

  // Dialog
  drawDialog();
}
