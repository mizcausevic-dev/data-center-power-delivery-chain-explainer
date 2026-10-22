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
  return { FPS: FPS, FRAME_COUNT: FRAME_COUNT, LAST_FRAME: LAST_FRAME, HOLD_FRAME: HOLD_FRAME, CHAPTERS: CHAPTERS };
});
