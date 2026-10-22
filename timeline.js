/* Deterministic film state for the data-center power plate.
   Every value is a function of the frame index. No clocks, no randomness.
   Conceptual only: not a certified design and not an operating procedure. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.PowerChain = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const FPS = 30;
  const FRAME_COUNT = 1020;
  const LAST_FRAME = 1019;
  const HOLD_FRAME = 940;

  const CHAPTERS = [
    { id: "reveal", start: 0, end: 149, label: "Reveal", span: "0-5 s" },
    { id: "path", start: 150, end: 299, label: "Double conversion", span: "5-10 s" },
    { id: "battery", start: 300, end: 509, label: "Battery interface", span: "10-17 s" },
    { id: "outage", start: 510, end: 749, label: "Stored-energy support", span: "17-25 s" },
    { id: "restore", start: 750, end: 1019, label: "Restore and overview", span: "25-34 s" }
  ];

  const LAYOUT = {
    world: { w: 1680, h: 1020 },
    flowY: 400,
    utility: { x: 36, y: 250, w: 188, h: 290 },
    gear: { x: 268, y: 236, w: 210, h: 318 },
    ups: { x: 560, y: 128, w: 600, h: 470 },
    rectifier: { x: 588, y: 292, w: 150, h: 196 },
    dclink: { x: 770, y: 348, w: 160, h: 104 },
    inverter: { x: 968, y: 292, w: 156, h: 196 },
    bypass: { x: 596, y: 176, w: 500, h: 62, gap: 44 },
    converter: { x: 772, y: 628, w: 156, h: 78 },
    battery: { x: 625, y: 724, w: 450, h: 210 },
    pdu: { x: 1228, y: 262, w: 170, h: 286 },
    rack: { x: 1448, y: 176, w: 200, h: 470 }
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function clamp01(t) { return clamp(t, 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(frame, a, b) {
    if (b <= a) return frame >= b ? 1 : 0;
    const t = clamp01((frame - a) / (b - a));
    return t * t * (3 - 2 * t);
  }
  function visualFrame(frame) { return Math.min(clamp(Math.round(frame), 0, LAST_FRAME), HOLD_FRAME); }
  function chapterAt(frame) {
    const f = clamp(Math.round(frame), 0, LAST_FRAME);
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (f >= CHAPTERS[i].start && f <= CHAPTERS[i].end) return CHAPTERS[i];
    }
    return CHAPTERS[CHAPTERS.length - 1];
  }
  function contactorOpen(frame) {
    const vf = visualFrame(frame);
    if (vf < 510) return 0;
    if (vf < 545) return ease(vf, 510, 545);
    if (vf < 750) return 1;
    if (vf < 800) return 1 - ease(vf, 750, 800);
    return 0;
  }
  function inputShare(frame) { return 1 - contactorOpen(frame); }
  function dischargeShare(frame) { return contactorOpen(frame); }
  function rechargeShare(frame) {
    const vf = visualFrame(frame);
    return inputShare(frame) * ease(vf, 810, 900);
  }
  function reservoir(frame) {
    const vf = visualFrame(frame);
    const ready = 0.84;
    if (vf <= 510) return ready;
    if (vf < 750) return lerp(ready, 0.46, ease(vf, 510, 749));
    if (vf < 810) return 0.46;
    return lerp(0.46, 0.72, ease(vf, 810, 930));
  }
  function revealOf(frame) {
    const vf = visualFrame(frame);
    return {
      utility: lerp(0.4, 1, ease(vf, 0, 32)),
      gear: ease(vf, 16, 64),
      ups: ease(vf, 40, 108),
      rack: ease(vf, 78, 140),
      battery: ease(vf, 300, 430),
      converter: ease(vf, 330, 460),
      losses: ease(vf, 880, 930),
      monitor: ease(vf, 890, 935)
    };
  }
  function lerpRect(a, b, t) {
    return { cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) };
  }
  function cameraRect(frame) {
    const vf = visualFrame(frame);
    const chain = { cx: 850, cy: 400, w: 1720, h: 760 };
    const overview = { cx: 850, cy: 500, w: 1760, h: 1080 };
    const ups = { cx: 850, cy: 360, w: 980, h: 640 };
    const battery = { cx: 820, cy: 500, w: 1080, h: 920 };
    const event = { cx: 860, cy: 480, w: 1240, h: 1000 };
    if (vf < 150) return chain;
    if (vf < 300) return lerpRect(chain, ups, ease(vf, 150, 220));
    if (vf < 510) return lerpRect(ups, battery, ease(vf, 300, 390));
    if (vf < 750) return lerpRect(battery, event, ease(vf, 510, 560));
    return lerpRect(event, overview, ease(vf, 760, 910));
  }
  function captionFor(frame) {
    const vf = visualFrame(frame);
    if (vf >= 940) return "Held overview. Heat marks are qualitative and have no magnitude. Monitoring tags are film state, not meter readings. Static bypass stays unselected. Maintenance bypass is a separate state and is not entered. The store is still finite, and recharge is not shown as complete.";
    if (vf >= 880) return "The view pulls back. Losses sit on the conversions, without a claimed efficiency. Monitoring is a state overlay. Static bypass and maintenance bypass remain separate and inactive.";
    if (vf >= 810) return "Controlled recharge is shown as its own behavior on the converter, fed from the restored input. No current, voltage, rate, or end point is specified. The trace is qualitative and time-compressed.";
    if (vf >= 750) return "Input supply returns and again supports the inverter through the rectifier. This is a depicted restoration, not a switching procedure. The bypass stays open.";
    if (vf >= 510) return "Depicted input interruption. Battery energy supports the DC link through the converter, and the inverter continues inside a conceptual envelope. The store falls because it is finite. The bypass does not close. On this plate the bypass entrance uses the same input, so that input is not a suitable bypass source while it is interrupted.";
    if (vf >= 300) return "The plate opens the battery interior. It does not perform a connection. Chosen concept: a bidirectional converter between the battery and the DC link. Some products connect the battery directly instead. Chemistry, string arrangement, and autonomy are not specified.";
    if (vf >= 150) return "In the chosen mode, energy goes through the rectifier, the DC link, and the inverter. The static bypass is a separate path and stays open. Markers show energy flow, not electron direction. Waveforms are schematic slow motion, not grid frequency and not a scope capture.";
    return "The plate opens on a system already in normal double-conversion service. Incoming AC, distribution, the UPS, rack distribution, server power supplies, and computing loads come into view. Enlarged section. Not a startup procedure and not to scale.";
  }
  function inputWord(frame) {
    const vf = visualFrame(frame);
    if (vf < 510) return "Present";
    if (vf < 545) return "Interrupting, depicted";
    if (vf < 750) return "Absent";
    if (vf < 800) return "Restoring, depicted";
    return "Present";
  }
  function batteryWord(frame) {
    const vf = visualFrame(frame);
    if (vf < 300) return "Conceptually already interfaced. Interior not yet open on the plate.";
    if (vf < 510) return "Interior open. Converter interface. Ready, not discharging.";
    if (vf < 750) return "Discharging through the converter. Finite store. Envelope still depicted.";
    if (vf < 810) return "Input has returned. Discharge depicted as ended.";
    if (vf < 940) return "Recharging through the converter. No rate is specified.";
    return "Recharge depicted and held. Not a completed charge.";
  }
  function dcLinkWord(frame) {
    const vf = visualFrame(frame);
    if (vf >= 510 && vf < 800) return "Supported from the battery path";
    if (vf >= 810) return "Supported from the rectifier, recharge branch depicted";
    return "Supported from the rectifier";
  }
  function sceneAt(frame) {
    const f = clamp(Math.round(frame), 0, LAST_FRAME);
    const vf = visualFrame(f);
    const open = contactorOpen(f);
    return {
      frame: f, visualFrame: vf, held: f >= HOLD_FRAME, fps: FPS, chapter: chapterAt(f),
      caption: captionFor(f), camera: cameraRect(f), reveal: revealOf(f), contactorOpen: open,
      inputShare: inputShare(f), dischargeShare: dischargeShare(f), rechargeShare: rechargeShare(f),
      bypassShare: 0, maintenanceActive: false, bypassState: "Unselected", maintenanceState: "Not entered",
      reservoir: reservoir(f), outputSupported: true, waveformPhase: vf * 0.055, inputAmp: inputShare(f), outputAmp: 1,
      inputWord: inputWord(f), batteryWord: batteryWord(f), dcLinkWord: dcLinkWord(f),
      inverterWord: "Conceptual continuity while the envelope is depicted",
      plateWord: vf < 140 ? "Opening. The system is already in service." : "Section open"
    };
  }
  function signature(frame) {
    const s = sceneAt(frame);
    const r = s.reveal;
    const c = s.camera;
    const nums = [s.visualFrame, s.held ? 1 : 0, s.contactorOpen, s.inputShare, s.dischargeShare, s.rechargeShare, s.bypassShare, s.reservoir, s.outputAmp, s.inputAmp, s.waveformPhase, r.utility, r.gear, r.ups, r.rack, r.battery, r.converter, r.losses, r.monitor, c.cx, c.cy, c.w, c.h].map(function (n) { return Math.round(n * 10000) / 10000; });
    return nums.join("|") + "|" + s.caption + "|" + s.bypassState + "|" + s.maintenanceState;
  }
  return {
    FPS: FPS, FRAME_COUNT: FRAME_COUNT, LAST_FRAME: LAST_FRAME, HOLD_FRAME: HOLD_FRAME, CHAPTERS: CHAPTERS, LAYOUT: LAYOUT,
    sceneAt: sceneAt, signature: signature, reservoir: reservoir, cameraRect: cameraRect, contactorOpen: contactorOpen,
    inputShare: inputShare, dischargeShare: dischargeShare, rechargeShare: rechargeShare, captionFor: captionFor, ease: ease
  };
});
