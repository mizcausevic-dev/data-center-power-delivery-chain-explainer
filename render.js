/* Orthographic sectional plate. See the main-branch renderer, republished here for Pages. */
(function (root, factory) {
  root.PowerChainRender = factory(root.PowerChain);
})(typeof globalThis !== "undefined" ? globalThis : this, function (PC) {
  const C = { bg: "#0B1019", steel: "#344257", steelHi: "#51627A", well: "#101722", copper: "#8C5A3C", copperHi: "#C4896A", cyan: "#00E5FF", gold: "#FFD166", violet: "#9D4EDD", text: "#D5DCEA", dim: "#93A0B5", bone: "#E7E1D5" };
  const L = PC.LAYOUT;
  function roundRect(ctx, x, y, w, h, r) { const rr = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + rr, y); ctx.arcTo(x + w, y, x + w, y + h, rr); ctx.arcTo(x + w, y + h, x, y + h, rr); ctx.arcTo(x, y + h, x, y, rr); ctx.arcTo(x, y, x + w, y, rr); ctx.closePath(); }
  function metal(ctx, x, y, w, h, r) { roundRect(ctx, x, y, w, h, r == null ? 8 : r); const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, "#44556C"); g.addColorStop(0.18, C.steel); g.addColorStop(1, "#232C3C"); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = C.steelHi; ctx.stroke(); }
  function well(ctx, x, y, w, h) { roundRect(ctx, x, y, w, h, 4); ctx.fillStyle = C.well; ctx.fill(); ctx.strokeStyle = "#2A384C"; ctx.stroke(); }
  function label(ctx, text, x, y, opt) { const o = opt || {}; ctx.save(); ctx.font = (o.weight || "600") + " " + (o.size || 14) + "px " + (o.mono ? "ui-monospace, monospace" : "system-ui, sans-serif"); ctx.fillStyle = o.color || C.text; ctx.textAlign = o.align || "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x, y); ctx.restore(); }
  function fade(ctx, alpha, draw) { if (alpha <= 0.01) return; ctx.save(); ctx.globalAlpha = alpha; draw(); ctx.restore(); }
  function poly(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y); }
  function tube(ctx, pts, amount, color, frame) { ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#243044"; ctx.lineWidth = 16; poly(ctx, pts); ctx.stroke(); ctx.strokeStyle = C.copper; ctx.lineWidth = 7; poly(ctx, pts); ctx.stroke(); if (amount > 0.02) { ctx.globalAlpha *= 0.35 + 0.65 * amount; ctx.strokeStyle = color; ctx.lineWidth = 3.5; poly(ctx, pts); ctx.stroke(); ctx.setLineDash([2, 16]); ctx.lineDashOffset = -frame * 1.4; ctx.strokeStyle = "rgba(11,16,25,0.75)"; ctx.lineWidth = 3; poly(ctx, pts); ctx.stroke(); } ctx.restore(); }
  function node(ctx, x, y, hot) { ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fillStyle = hot > 0.4 ? C.cyan : C.copper; ctx.fill(); }
  function sine(ctx, x, y, w, h, phase, amp, color, offset) { ctx.beginPath(); const mid = y + h / 2; for (let i = 0; i <= 48; i++) { const u = i / 48; const yy = mid - Math.sin(u * Math.PI * 4 + phase + offset) * (h * 0.36) * amp; if (i === 0) ctx.moveTo(x + u * w, yy); else ctx.lineTo(x + u * w, yy); } ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke(); }
  function contactor(ctx, x, y, openAmount) { const ang = -0.05 - openAmount * 1.05; ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x - 6, y); ctx.moveTo(x + 14, y); ctx.lineTo(x + 24, y); ctx.moveTo(x - 4, y); ctx.lineTo(x - 4 + Math.cos(ang) * 20, y + Math.sin(ang) * 20); ctx.stroke(); label(ctx, openAmount > 0.65 ? "OPEN" : "SHUT", x, y + 26, { size: 11, color: openAmount > 0.65 ? C.gold : C.cyan, align: "center", mono: true }); ctx.restore(); }
  function openSwitch(ctx, x, y) { ctx.save(); ctx.strokeStyle = C.violet; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x - 6, y); ctx.moveTo(x + 12, y); ctx.lineTo(x + 24, y); ctx.moveTo(x - 4, y); ctx.lineTo(x + 8, y - 16); ctx.stroke(); ctx.restore(); label(ctx, "GAP", x, y + 16, { size: 11, color: "#D4B4F5", align: "center", mono: true }); }
  function drawUtility(ctx, scene) { const b = L.utility; metal(ctx, b.x, b.y, b.w, b.h, 8); label(ctx, "UTILITY AC", b.x + 16, b.y + 28, { size: 16 }); well(ctx, b.x + 16, b.y + 66, b.w - 32, 120); sine(ctx, b.x + 24, b.y + 78, b.w - 48, 36, scene.waveformPhase, scene.inputAmp, C.cyan, 0); sine(ctx, b.x + 24, b.y + 112, b.w - 48, 36, scene.waveformPhase, scene.inputAmp, "#7EE8F2", 2.094); label(ctx, scene.inputAmp > 0.2 ? "SLOW MOTION" : "INPUT ABSENT", b.x + 16, b.y + 210, { size: 11, color: C.dim, mono: true }); }
  function drawGear(ctx) { const b = L.gear; metal(ctx, b.x, b.y, b.w, b.h, 8); label(ctx, "DISTRIBUTION", b.x + 16, b.y + 28, { size: 16 }); ctx.fillStyle = C.copper; ctx.fillRect(b.x + 30, b.y + 70, 12, b.h - 130); }
  function drawUps(ctx, scene) { const b = L.ups; metal(ctx, b.x, b.y, b.w, b.h, 10); label(ctx, "ONLINE DOUBLE-CONVERSION UPS", b.x + 18, b.y + 28, { size: 16 }); const by = L.bypass; well(ctx, by.x, by.y, by.w, by.h); const mid = by.x + by.w / 2; const y = by.y + 28; ctx.strokeStyle = "#4A3D66"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(by.x + 12, y); ctx.lineTo(mid - 24, y); ctx.moveTo(mid + 24, y); ctx.lineTo(by.x + by.w - 12, y); ctx.stroke(); openSwitch(ctx, mid, y); label(ctx, "STATIC BYPASS UNSELECTED", by.x + 12, by.y + 16, { size: 12, color: "#D4B4F5", mono: true }); const r = L.rectifier; well(ctx, r.x, r.y, r.w, r.h); label(ctx, "RECTIFIER", r.x + r.w / 2, r.y + 36, { size: 14, align: "center" }); label(ctx, "AC TO DC", r.x + r.w / 2, r.y + 58, { size: 12, color: C.cyan, align: "center", mono: true }); const d = L.dclink; well(ctx, d.x, d.y, d.w, d.h); label(ctx, "DC LINK", d.x + d.w / 2, d.y + 28, { size: 14, align: "center" }); ctx.fillStyle = C.cyan; ctx.fillRect(d.x + 16, d.y + 52, d.w - 32, 8); label(ctx, "NO VOLTAGE SHOWN", d.x + d.w / 2, d.y + 84, { size: 10, color: C.dim, align: "center", mono: true }); const inv = L.inverter; well(ctx, inv.x, inv.y, inv.w, inv.h); label(ctx, "INVERTER", inv.x + inv.w / 2, inv.y + 36, { size: 14, align: "center" }); label(ctx, "DC TO AC", inv.x + inv.w / 2, inv.y + 58, { size: 12, color: C.cyan, align: "center", mono: true }); sine(ctx, inv.x + 20, inv.y + 90, inv.w - 40, 50, scene.waveformPhase, scene.outputAmp, C.cyan, 0); }
  function drawConverter(ctx, scene) { const b = L.converter; metal(ctx, b.x, b.y, b.w, b.h, 6); label(ctx, "CONVERTER", b.x + b.w / 2, b.y + 28, { size: 13, align: "center" }); label(ctx, scene.dischargeShare > 0.2 ? "DISCHARGE" : scene.rechargeShare > 0.2 ? "RECHARGE" : "READY", b.x + b.w / 2, b.y + 52, { size: 11, color: C.gold, align: "center", mono: true }); }
  function drawBattery(ctx, scene) { const b = L.battery; metal(ctx, b.x, b.y, b.w, b.h, 8); label(ctx, "BATTERY  FINITE STORE", b.x + 16, b.y + 28, { size: 16 }); const n = 6, gap = 10, cw = (b.w - 32 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = b.x + 16 + i * (cw + gap), y = b.y + 64, h = 110; well(ctx, x, y, cw, h); ctx.fillStyle = "rgba(255,209,102,0.85)"; ctx.fillRect(x + 4, y + h - 8 - (h - 16) * scene.reservoir, cw - 8, (h - 16) * scene.reservoir); } }
  function drawPdu(ctx) { const b = L.pdu; metal(ctx, b.x, b.y, b.w, b.h, 8); label(ctx, "PDU", b.x + 16, b.y + 28, { size: 16 }); ctx.fillStyle = C.copper; ctx.fillRect(b.x + 28, b.y + 70, 14, b.h - 110); }
  function drawRack(ctx, scene) { const b = L.rack; metal(ctx, b.x, b.y, b.w, b.h, 8); label(ctx, "RACK SECTION", b.x + 16, b.y + 28, { size: 16 }); for (let i = 0; i < 4; i++) { const y = b.y + 64 + i * 96; well(ctx, b.x + 16, y, b.w - 32, 86); label(ctx, "PSU", b.x + 28, y + 30, { size: 12, color: C.cyan, mono: true }); label(ctx, "LOAD", b.x + 100, y + 30, { size: 12, color: C.bone, mono: true }); } }
  function paths() { const y = L.flowY; const gearRight = L.gear.x + L.gear.w; return { ac: [{ x: L.utility.x + L.utility.w, y: y }, { x: gearRight, y: y }], afterDevice: [{ x: gearRight + 78, y: y }, { x: L.rectifier.x, y: y }], rectDc: [{ x: L.rectifier.x + L.rectifier.w, y: y }, { x: L.dclink.x, y: y }], dcInv: [{ x: L.dclink.x + L.dclink.w, y: y }, { x: L.inverter.x, y: y }], out: [{ x: L.inverter.x + L.inverter.w, y: y }, { x: L.rack.x + 40, y: y }], down: [{ x: L.dclink.x + L.dclink.w / 2, y: L.dclink.y + L.dclink.h }, { x: L.converter.x + L.converter.w / 2, y: L.converter.y }], store: [{ x: L.converter.x + L.converter.w / 2, y: L.converter.y + L.converter.h }, { x: L.converter.x + L.converter.w / 2, y: L.battery.y }] }; }
  function drawFlows(ctx, scene) { const p = paths(); const f = scene.visualFrame; const through = Math.max(scene.inputShare, scene.dischargeShare); fade(ctx, scene.reveal.utility, function () { tube(ctx, p.ac, scene.inputShare, C.cyan, f); }); fade(ctx, scene.reveal.ups, function () { tube(ctx, p.afterDevice, scene.inputShare, C.cyan, f); tube(ctx, p.rectDc, scene.inputShare, C.cyan, f); tube(ctx, p.dcInv, through, C.cyan, f); }); fade(ctx, scene.reveal.rack, function () { tube(ctx, p.out, scene.outputAmp, C.cyan, f); }); const branch = Math.max(scene.dischargeShare, scene.rechargeShare); fade(ctx, scene.reveal.converter, function () { tube(ctx, p.down, branch, C.gold, f); tube(ctx, p.store, branch, C.gold, f); }); }
  function drawStamp(ctx) { label(ctx, "NO SCALE  ENLARGED  TIME COMPRESSED  SLOW MOTION", 40, 48, { size: 13, color: C.gold, mono: true }); label(ctx, "NOT FOR CONSTRUCTION OR OPERATION", 40, 70, { size: 12, color: C.dim, mono: true }); }
  function renderStage(ctx, viewW, viewH, frame) {
    const scene = PC.sceneAt(frame);
    ctx.clearRect(0, 0, viewW, viewH);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, viewW, viewH);
    const cam = scene.camera; const zoom = Math.min(viewW / cam.w, viewH / cam.h);
    ctx.save(); ctx.translate(viewW / 2, viewH / 2); ctx.scale(zoom, zoom); ctx.translate(-cam.cx, -cam.cy);
    drawStamp(ctx);
    fade(ctx, scene.reveal.utility, function () { drawUtility(ctx, scene); });
    fade(ctx, scene.reveal.gear, function () { drawGear(ctx); contactor(ctx, L.gear.x + L.gear.w + 36, L.flowY, scene.contactorOpen); });
    fade(ctx, scene.reveal.ups, function () { drawUps(ctx, scene); });
    fade(ctx, scene.reveal.converter, function () { drawConverter(ctx, scene); });
    fade(ctx, scene.reveal.battery, function () { drawBattery(ctx, scene); });
    fade(ctx, scene.reveal.rack, function () { drawPdu(ctx); drawRack(ctx, scene); });
    drawFlows(ctx, scene);
    ctx.restore();
    return scene;
  }
  function drawChart(ctx, viewW, viewH, frame) {
    const scene = PC.sceneAt(frame);
    ctx.clearRect(0, 0, viewW, viewH); ctx.fillStyle = "#101722"; ctx.fillRect(0, 0, viewW, viewH);
    const padL = 12, padT = 16, w = viewW - 24, h = viewH - 36;
    function xOf(f) { return padL + (f / 30 / 34) * w; }
    function yOf(v) { const u = v < 0 ? 0 : v > 1 ? 1 : v; return padT + h - u * h; }
    const end = scene.visualFrame;
    function series(reader, color) { ctx.beginPath(); for (let f = 0; f <= end; f += 2) { const x = xOf(f), y = yOf(reader(f)); if (f === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); }
    series(PC.reservoir, C.gold); series(PC.inputShare, C.cyan); series(PC.dischargeShare, "#E2B15A");
    ctx.beginPath(); ctx.moveTo(xOf(0), yOf(0)); ctx.lineTo(xOf(end), yOf(0)); ctx.strokeStyle = C.violet; ctx.stroke();
    label(ctx, "QUALITATIVE  FILM SECONDS", padL, viewH - 8, { size: 10, color: C.dim, mono: true });
    return scene;
  }
  return { renderStage: renderStage, drawChart: drawChart, colors: C };
});
