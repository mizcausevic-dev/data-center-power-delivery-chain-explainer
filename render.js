/* Orthographic sectional plate. Hardware is steel and copper.
   Cyan, gold, and violet are explanatory overlays, not literal emission. */
(function (root, factory) {
  root.PowerChainRender = factory(root.PowerChain);
})(typeof globalThis !== "undefined" ? globalThis : this, function (PC) {
  const C = {
    bg: "#0B1019", steel: "#344257", steelHi: "#51627A", steelLo: "#1A2331",
    well: "#101722", copper: "#8C5A3C", copperHi: "#C4896A", cyan: "#00E5FF",
    gold: "#FFD166", violet: "#9D4EDD", text: "#D5DCEA", dim: "#93A0B5",
    bone: "#E7E1D5", ink: "#0B1019"
  };
  const L = PC.LAYOUT;
  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }
  function metal(ctx, x, y, w, h, r) {
    roundRect(ctx, x, y, w, h, r == null ? 8 : r);
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, "#44556C");
    g.addColorStop(0.18, C.steel);
    g.addColorStop(1, "#232C3C");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = C.steelHi;
    ctx.stroke();
    ctx.save();
    roundRect(ctx, x, y, w, h, r == null ? 8 : r);
    ctx.clip();
    ctx.strokeStyle = "rgba(231,225,213,0.22)";
    ctx.lineWidth = 1;
    for (let i = -8; i < w + 8; i += 6) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i - 8, y + 8);
      ctx.stroke();
    }
    ctx.restore();
  }
  function well(ctx, x, y, w, h) {
    roundRect(ctx, x, y, w, h, 4);
    ctx.fillStyle = C.well;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#2A384C";
    ctx.stroke();
  }
  function label(ctx, text, x, y, opt) {
    const o = opt || {};
    ctx.save();
    ctx.font = (o.weight || "600") + " " + (o.size || 14) + "px " + (o.mono ? "ui-monospace, monospace" : "system-ui, sans-serif");
    ctx.fillStyle = o.color || C.text;
    ctx.textAlign = o.align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function fade(ctx, alpha, draw) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    draw();
    ctx.restore();
  }
  function poly(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  }
  function tube(ctx, pts, amount, color, frame) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#243044";
    ctx.lineWidth = 16;
    poly(ctx, pts);
    ctx.stroke();
    ctx.strokeStyle = C.copper;
    ctx.lineWidth = 7;
    poly(ctx, pts);
    ctx.stroke();
    if (amount > 0.02) {
      ctx.globalAlpha *= 0.35 + 0.65 * amount;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      poly(ctx, pts);
      ctx.stroke();
      ctx.setLineDash([2, 16]);
      ctx.lineDashOffset = -frame * 1.4;
      ctx.strokeStyle = "rgba(11,16,25,0.75)";
      ctx.lineWidth = 3;
      poly(ctx, pts);
      ctx.stroke();
    }
    ctx.restore();
  }
  function node(ctx, x, y, hot) {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = hot > 0.4 ? C.cyan : C.copper;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = C.bone;
    ctx.stroke();
  }
  function sine(ctx, x, y, w, h, phase, amp, color, offset) {
    ctx.beginPath();
    const mid = y + h / 2;
    for (let i = 0; i <= 48; i++) {
      const u = i / 48;
      const yy = mid - Math.sin(u * Math.PI * 4 + phase + offset) * (h * 0.36) * amp;
      if (i === 0) ctx.moveTo(x + u * w, yy);
      else ctx.lineTo(x + u * w, yy);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  function diode(ctx, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(-7, -6);
    ctx.lineTo(7, 0);
    ctx.lineTo(-7, 6);
    ctx.closePath();
    ctx.fillStyle = C.bone;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(7, -7);
    ctx.lineTo(7, 7);
    ctx.strokeStyle = C.bone;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
  function contactor(ctx, x, y, openAmount) {
    const ang = -0.05 - openAmount * 1.05;
    ctx.save();
    roundRect(ctx, x - 34, y - 36, 68, 78, 6);
    ctx.fillStyle = "#101722";
    ctx.fill();
    ctx.strokeStyle = C.steelHi;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.strokeStyle = C.gold;
    ctx.fillStyle = C.gold;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 24, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 16, y);
    ctx.lineTo(x + 26, y);
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x - 6 + Math.cos(ang) * 24, y + Math.sin(ang) * 24);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - 6, y, 2.6, 0, Math.PI * 2);
    ctx.fill();
    label(ctx, openAmount > 0.65 ? "OPEN" : "SHUT", x, y + 28, { size: 11, color: openAmount > 0.65 ? C.gold : C.cyan, align: "center", mono: true });
    ctx.restore();
  }
  function openSwitch(ctx, x, y) {
    ctx.save();
    ctx.strokeStyle = C.violet;
    ctx.fillStyle = C.violet;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 22, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 14, y);
    ctx.lineTo(x + 28, y);
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x + 6, y - 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - 6, y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, "GAP", x, y + 18, { size: 11, color: "#D4B4F5", align: "center", mono: true });
  }
  function wisp(ctx, x, y, alpha) {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = 0.55 * alpha;
    ctx.strokeStyle = C.copperHi;
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y - i * 7);
      ctx.bezierCurveTo(x + 12, y - 14 - i * 8, x - 10, y - 22 - i * 8, x + 6, y - 34 - i * 8);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawUtility(ctx, scene) {
    const b = L.utility;
    metal(ctx, b.x, b.y, b.w, b.h, 8);
    label(ctx, "UTILITY AC", b.x + 16, b.y + 26, { size: 16 });
    label(ctx, "SCHEMATIC", b.x + 16, b.y + 46, { size: 11, color: C.dim, mono: true });
    well(ctx, b.x + 16, b.y + 66, b.w - 32, 150);
    const amp = scene.inputAmp;
    sine(ctx, b.x + 28, b.y + 78, b.w - 56, 40, scene.waveformPhase, amp, C.cyan, 0);
    sine(ctx, b.x + 28, b.y + 118, b.w - 56, 40, scene.waveformPhase, amp, "#7EE8F2", 2.094);
    sine(ctx, b.x + 28, b.y + 158, b.w - 56, 40, scene.waveformPhase, amp, "#B8F6FF", 4.189);
    label(ctx, amp > 0.2 ? "THREE LINES, SLOW MOTION" : "INPUT ABSENT", b.x + 16, b.y + 240, { size: 11, color: C.dim, mono: true });
    label(ctx, "NOT A CAPTURE", b.x + 16, b.y + 258, { size: 11, color: C.dim, mono: true });
  }
  function drawGear(ctx) {
    const b = L.gear;
    metal(ctx, b.x, b.y, b.w, b.h, 8);
    label(ctx, "DISTRIBUTION", b.x + 16, b.y + 26, { size: 16 });
    well(ctx, b.x + 18, b.y + 52, 36, b.h - 80);
    well(ctx, b.x + 64, b.y + 52, 36, b.h - 80);
    ctx.fillStyle = C.copper;
    ctx.fillRect(b.x + 30, b.y + 70, 12, b.h - 130);
    ctx.fillRect(b.x + 76, b.y + 70, 12, b.h - 130);
    label(ctx, "BUSES", b.x + 118, b.y + 78, { size: 12, color: C.dim, mono: true });
  }
  function drawUps(ctx, scene) {
    const b = L.ups;
    metal(ctx, b.x, b.y, b.w, b.h, 10);
    label(ctx, "ONLINE DOUBLE-CONVERSION UPS", b.x + 18, b.y + 24, { size: 16 });
    label(ctx, "CHOSEN MODE  \u00b7  SECTION", b.x + 18, b.y + 44, { size: 11, color: C.dim, mono: true });
    const by = L.bypass;
    well(ctx, by.x, by.y, by.w, by.h);
    const mid = by.x + by.w / 2;
    const y = by.y + by.h / 2 - 6;
    ctx.save();
    ctx.strokeStyle = "#4A3D66";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(by.x + 12, y);
    ctx.lineTo(mid - by.gap / 2 - 8, y);
    ctx.moveTo(mid + by.gap / 2 + 8, y);
    ctx.lineTo(by.x + by.w - 12, y);
    ctx.stroke();
    ctx.restore();
    openSwitch(ctx, mid, y);
    label(ctx, "STATIC BYPASS  \u00b7  UNSELECTED", by.x + 12, by.y + 16, { size: 12, color: "#D4B4F5", mono: true });
    const r = L.rectifier;
    well(ctx, r.x, r.y, r.w, r.h);
    label(ctx, "RECTIFIER", r.x + r.w / 2, r.y + 28, { size: 14, align: "center" });
    label(ctx, "AC TO DC", r.x + r.w / 2, r.y + 50, { size: 12, color: C.cyan, align: "center", mono: true });
    diode(ctx, r.x + r.w / 2, r.y + 92, 0);
    label(ctx, "SYMBOL", r.x + r.w / 2, r.y + r.h - 28, { size: 11, color: C.dim, align: "center", mono: true });
    const d = L.dclink;
    well(ctx, d.x, d.y, d.w, d.h);
    label(ctx, "DC LINK", d.x + d.w / 2, d.y + 22, { size: 14, align: "center" });
    ctx.save();
    ctx.globalAlpha *= 0.9;
    ctx.fillStyle = scene.outputSupported ? C.cyan : C.dim;
    ctx.fillRect(d.x + 16, d.y + 48, d.w - 32, 8);
    ctx.fillRect(d.x + 16, d.y + 68, d.w - 32, 8);
    ctx.restore();
    label(ctx, "NO VOLTAGE SHOWN", d.x + d.w / 2, d.y + 96, { size: 10, color: C.dim, align: "center", mono: true });
    const inv = L.inverter;
    well(ctx, inv.x, inv.y, inv.w, inv.h);
    label(ctx, "INVERTER", inv.x + inv.w / 2, inv.y + 28, { size: 14, align: "center" });
    label(ctx, "DC TO AC", inv.x + inv.w / 2, inv.y + 50, { size: 12, color: C.cyan, align: "center", mono: true });
    sine(ctx, inv.x + 28, inv.y + 78, inv.w - 56, 52, scene.waveformPhase, scene.outputAmp, C.cyan, 0);
    label(ctx, "BLOCK, NOT PWM", inv.x + inv.w / 2, inv.y + inv.h - 28, { size: 11, color: C.dim, align: "center", mono: true });
  }
  function drawConverter(ctx, scene) {
    const b = L.converter;
    metal(ctx, b.x, b.y, b.w, b.h, 6);
    label(ctx, "CONVERTER", b.x + b.w / 2, b.y + 20, { size: 13, align: "center" });
    label(ctx, "BIDIRECTIONAL", b.x + b.w / 2, b.y + 38, { size: 11, color: C.dim, align: "center", mono: true });
    ctx.save();
    ctx.strokeStyle = scene.dischargeShare > 0.2 ? C.gold : C.dim;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(b.x + 40, b.y + 64);
    ctx.lineTo(b.x + 70, b.y + 52);
    ctx.lineTo(b.x + 70, b.y + 60);
    ctx.stroke();
    ctx.strokeStyle = scene.rechargeShare > 0.2 ? C.gold : C.dim;
    ctx.beginPath();
    ctx.moveTo(b.x + b.w - 40, b.y + 52);
    ctx.lineTo(b.x + b.w - 70, b.y + 64);
    ctx.lineTo(b.x + b.w - 70, b.y + 56);
    ctx.stroke();
    ctx.restore();
  }
  function drawBattery(ctx, scene) {
    const b = L.battery;
    metal(ctx, b.x, b.y, b.w, b.h, 8);
    label(ctx, "BATTERY  \u00b7  FINITE STORE", b.x + 16, b.y + 24, { size: 16 });
    label(ctx, "CHEMISTRY NOT SPECIFIED", b.x + 16, b.y + 44, { size: 11, color: C.dim, mono: true });
    const n = 6;
    const gap = 10;
    const cw = (b.w - 32 - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const x = b.x + 16 + i * (cw + gap);
      const y = b.y + 68;
      const h = 120;
      well(ctx, x, y, cw, h);
      const fill = scene.reservoir;
      ctx.fillStyle = "rgba(255,209,102,0.85)";
      ctx.fillRect(x + 4, y + h - 8 - (h - 16) * fill, cw - 8, (h - 16) * fill);
      ctx.fillStyle = C.copperHi;
      ctx.fillRect(x + cw / 2 - 8, y - 6, 16, 6);
    }
    label(ctx, "QUALITATIVE LEVEL", b.x + 16, b.y + b.h - 22, { size: 11, color: C.gold, mono: true });
  }
  function drawPdu(ctx) {
    const b = L.pdu;
    metal(ctx, b.x, b.y, b.w, b.h, 8);
    label(ctx, "PDU", b.x + 16, b.y + 24, { size: 16 });
    label(ctx, "DISTRIBUTION", b.x + 16, b.y + 44, { size: 11, color: C.dim, mono: true });
    ctx.fillStyle = C.copper;
    ctx.fillRect(b.x + 28, b.y + 70, 14, b.h - 100);
    for (let i = 0; i < 4; i++) {
      const y = b.y + 90 + i * 48;
      ctx.fillStyle = C.copper;
      ctx.fillRect(b.x + 42, y, 70, 6);
      well(ctx, b.x + 120, y - 10, 70, 26);
    }
    label(ctx, "NO TRANSFORMER ASSUMED", b.x + 16, b.y + b.h - 22, { size: 10, color: C.dim, mono: true });
  }
  function drawRack(ctx, scene) {
    const b = L.rack;
    metal(ctx, b.x, b.y, b.w, b.h, 8);
    label(ctx, "RACK SECTION", b.x + 16, b.y + 24, { size: 16 });
    label(ctx, "ILLUSTRATIVE COUNT", b.x + 16, b.y + 44, { size: 11, color: C.dim, mono: true });
    const n = 4;
    const top = b.y + 64;
    const sh = 100;
    for (let i = 0; i < n; i++) {
      const y = top + i * (sh + 10);
      well(ctx, b.x + 16, y, b.w - 32, sh);
      well(ctx, b.x + 26, y + 16, 70, sh - 32);
      label(ctx, "PSU", b.x + 40, y + sh / 2, { size: 12, color: C.cyan, mono: true });
      ctx.strokeStyle = scene.outputAmp > 0.5 ? C.cyan : C.dim;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x + 104, y + sh / 2);
      ctx.lineTo(b.x + 150, y + sh / 2);
      ctx.stroke();
      roundRect(ctx, b.x + 156, y + 30, 70, 40, 3);
      ctx.fillStyle = "#182232";
      ctx.fill();
      ctx.strokeStyle = C.steelHi;
      ctx.stroke();
      label(ctx, "LOAD", b.x + 168, y + 50, { size: 11, color: C.bone, mono: true });
    }
  }
  function paths() {
    const y = L.flowY;
    const gearRight = L.gear.x + L.gear.w;
    const upsIn = L.ups.x + 24;
    const rectIn = L.rectifier.x;
    const rectOut = L.rectifier.x + L.rectifier.w;
    const dcIn = L.dclink.x;
    const dcOut = L.dclink.x + L.dclink.w;
    const invIn = L.inverter.x;
    const invOut = L.inverter.x + L.inverter.w;
    const pduIn = L.pdu.x;
    const pduOut = L.pdu.x + L.pdu.w;
    const rackIn = L.rack.x + 40;
    return {
      ac: [{ x: L.utility.x + L.utility.w, y: y }, { x: L.gear.x, y: y }, { x: gearRight, y: y }],
      afterDevice: [{ x: gearRight + 78, y: y }, { x: upsIn, y: y }, { x: rectIn, y: y }],
      rectDc: [{ x: rectOut, y: y }, { x: dcIn, y: y }],
      dcInv: [{ x: dcOut, y: y }, { x: invIn, y: y }],
      out: [{ x: invOut, y: y }, { x: L.ups.x + L.ups.w, y: y }, { x: pduIn, y: y }, { x: pduOut, y: y }, { x: rackIn, y: y }],
      down: [{ x: L.dclink.x + L.dclink.w / 2, y: L.dclink.y + L.dclink.h }, { x: L.dclink.x + L.dclink.w / 2, y: L.converter.y }],
      store: [{ x: L.converter.x + L.converter.w / 2, y: L.converter.y + L.converter.h }, { x: L.converter.x + L.converter.w / 2, y: L.battery.y }]
    };
  }
  function drawFlows(ctx, scene) {
    const p = paths();
    const f = scene.visualFrame;
    const through = Math.max(scene.inputShare, scene.dischargeShare);
    fade(ctx, scene.reveal.utility, function () { tube(ctx, p.ac, scene.inputShare, C.cyan, f); });
    fade(ctx, scene.reveal.ups, function () {
      tube(ctx, p.afterDevice, scene.inputShare, C.cyan, f);
      tube(ctx, p.rectDc, scene.inputShare, C.cyan, f);
      tube(ctx, p.dcInv, through, C.cyan, f);
    });
    fade(ctx, scene.reveal.rack, function () { tube(ctx, p.out, scene.outputAmp, C.cyan, f); });
    const branch = Math.max(scene.dischargeShare, scene.rechargeShare);
    fade(ctx, scene.reveal.converter, function () {
      tube(ctx, p.down, branch, C.gold, f);
      tube(ctx, p.store, branch, C.gold, f);
    });
  }
  function drawLosses(ctx, scene) {
    const a = scene.reveal.losses;
    wisp(ctx, L.rectifier.x + L.rectifier.w - 30, L.rectifier.y + 20, a);
    wisp(ctx, L.inverter.x + L.inverter.w - 30, L.inverter.y + 20, a);
    wisp(ctx, L.pdu.x + 40, L.pdu.y + 20, a * 0.7);
    wisp(ctx, L.rack.x + 70, L.rack.y + 80, a);
    if (a > 0.4) label(ctx, "HEAT  \u00b7  QUALITATIVE", L.rectifier.x, L.rectifier.y - 16, { size: 12, color: C.copperHi, mono: true });
  }
  function drawStamp(ctx) {
    const x = 36, y = 28;
    roundRect(ctx, x, y, 420, 78, 6);
    ctx.fillStyle = "rgba(18,25,36,0.92)";
    ctx.fill();
    ctx.strokeStyle = C.steel;
    ctx.stroke();
    label(ctx, "PLATE 01  \u00b7  NO SCALE  \u00b7  ENLARGED", x + 14, y + 22, { size: 13, mono: true });
    label(ctx, "NOT FOR CONSTRUCTION OR OPERATION", x + 14, y + 44, { size: 12, color: C.gold, mono: true });
    label(ctx, "TIME COMPRESSED  \u00b7  SLOW MOTION", x + 14, y + 62, { size: 11, color: C.dim, mono: true });
  }
  function drawBoundary(ctx, scene) {
    if (scene.reveal.monitor < 0.3) return;
    fade(ctx, scene.reveal.monitor, function () {
      const x = 36, y = 575;
      roundRect(ctx, x, y, 500, 112, 6);
      ctx.fillStyle = "rgba(18,25,36,0.92)";
      ctx.fill();
      ctx.strokeStyle = C.violet;
      ctx.stroke();
      label(ctx, "OUTSIDE THIS BOUNDARY", x + 14, y + 22, { size: 12, color: "#D4B4F5", mono: true });
      label(ctx, "Standby generation, parallel modules, and a", x + 14, y + 48, { size: 13 });
      label(ctx, "separate bypass feeder are not on this plate.", x + 14, y + 68, { size: 13 });
      label(ctx, "Maintenance bypass is not wired in.", x + 14, y + 90, { size: 13, color: C.dim });
    });
  }
  function renderStage(ctx, viewW, viewH, frame) {
    const scene = PC.sceneAt(frame);
    ctx.clearRect(0, 0, viewW, viewH);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.save();
    ctx.strokeStyle = "rgba(52,66,87,0.16)";
    ctx.lineWidth = 1;
    for (let x = 0; x < viewW; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, viewH); ctx.stroke(); }
    for (let y = 0; y < viewH; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(viewW, y); ctx.stroke(); }
    ctx.restore();
    const cam = scene.camera;
    const zoom = Math.min(viewW / cam.w, viewH / cam.h);
    ctx.save();
    ctx.translate(viewW / 2, viewH / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-cam.cx, -cam.cy);
    drawStamp(ctx);
    drawBoundary(ctx, scene);
    fade(ctx, scene.reveal.utility, function () { drawUtility(ctx, scene); });
    fade(ctx, scene.reveal.gear, function () {
      drawGear(ctx);
      contactor(ctx, L.gear.x + L.gear.w + 36, L.flowY, scene.contactorOpen);
    });
    fade(ctx, scene.reveal.ups, function () { drawUps(ctx, scene); });
    fade(ctx, scene.reveal.converter, function () { drawConverter(ctx, scene); });
    fade(ctx, scene.reveal.battery, function () { drawBattery(ctx, scene); });
    fade(ctx, scene.reveal.rack, function () { drawPdu(ctx); drawRack(ctx, scene); });
    drawFlows(ctx, scene);
    drawLosses(ctx, scene);
    const y = L.flowY;
    fade(ctx, scene.reveal.ups, function () {
      node(ctx, L.ups.x + 30, y, scene.inputShare);
      node(ctx, L.ups.x + L.ups.w - 16, y, scene.outputAmp);
    });
    ctx.restore();
    const vg = ctx.createRadialGradient(viewW / 2, viewH / 2, viewW * 0.2, viewW / 2, viewH / 2, viewW * 0.72);
    vg.addColorStop(0, "rgba(11,16,25,0)");
    vg.addColorStop(1, "rgba(11,16,25,0.45)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, viewW, viewH);
    return scene;
  }
  function drawChart(ctx, viewW, viewH, frame) {
    const scene = PC.sceneAt(frame);
    ctx.clearRect(0, 0, viewW, viewH);
    ctx.fillStyle = "#101722";
    ctx.fillRect(0, 0, viewW, viewH);
    const pad = { l: 16, r: 10, t: 22, b: 22 };
    const w = viewW - pad.l - pad.r;
    const h = viewH - pad.t - pad.b;
    ctx.strokeStyle = "#2A384C";
    ctx.strokeRect(pad.l, pad.t, w, h);
    label(ctx, "AUTHORED TRACE  \u00b7  QUALITATIVE", pad.l, 12, { size: 10, color: C.dim, mono: true });
    function xOf(f) { return pad.l + (f / 30 / 34) * w; }
    function yOf(v) { const u = v < 0 ? 0 : v > 1 ? 1 : v; return pad.t + h - u * h; }
    const end = scene.visualFrame;
    function strokeSeries(reader, color, width) {
      ctx.beginPath();
      for (let f = 0; f <= end; f += 2) {
        const x = xOf(f);
        const y = yOf(reader(f));
        if (f === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }
    ctx.save();
    strokeSeries(PC.reservoir, C.gold, 2.5);
    strokeSeries(PC.inputShare, C.cyan, 2);
    ctx.setLineDash([4, 4]);
    strokeSeries(PC.dischargeShare, "#E2B15A", 1.5);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(0));
    ctx.lineTo(xOf(end), yOf(0));
    ctx.strokeStyle = C.violet;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = C.bone;
    ctx.beginPath();
    ctx.arc(xOf(end), yOf(scene.reservoir), 3, 0, Math.PI * 2);
    ctx.fill();
    label(ctx, "0", pad.l, viewH - 8, { size: 10, color: C.dim, mono: true });
    label(ctx, "film seconds", pad.l + w / 2, viewH - 8, { size: 10, color: C.dim, align: "center", mono: true });
    label(ctx, "34", pad.l + w, viewH - 8, { size: 10, color: C.dim, align: "right", mono: true });
    return scene;
  }
  return { renderStage: renderStage, drawChart: drawChart, colors: C };
});
