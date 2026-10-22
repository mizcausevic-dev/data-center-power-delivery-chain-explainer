const assert = require("assert");
const PC = require("../timeline.js");

function approx(a, b, eps) {
  assert.ok(Math.abs(a - b) <= (eps || 1e-9), a + " !~ " + b);
}

assert.strictEqual(PC.FPS, 30);
assert.strictEqual(PC.FRAME_COUNT, 1020);
assert.strictEqual(PC.LAST_FRAME, 1019);
assert.strictEqual(PC.HOLD_FRAME, 940);
assert.strictEqual(PC.sceneAt(600).bypassShare, 0);
assert.strictEqual(PC.sceneAt(600).bypassState, "Unselected");
assert.ok(PC.inputShare(600) + PC.dischargeShare(600) === 1);
assert.ok(PC.reservoir(749) < PC.reservoir(510));
assert.ok(PC.reservoir(1019) < PC.reservoir(0));
assert.strictEqual(PC.signature(940), PC.signature(1019));
console.log("timeline tests passed");
