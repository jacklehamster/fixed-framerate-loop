// /Users/vincent/fixed-framerate-loop/example/node_modules/fixed-framerate-loop/dist/index.js
var $ = 1000;
var Q = 16.5;
var N = 10;

class V {
  requestAnimationFrame;
  cancelAnimationFrame;
  maxLoopJump;
  constructor({ requestAnimationFrame: j = globalThis.requestAnimationFrame.bind(globalThis), cancelAnimationFrame: w = globalThis.cancelAnimationFrame.bind(globalThis) } = {}, { maxLoopJump: d = N } = {}) {
    this.requestAnimationFrame = j, this.cancelAnimationFrame = w, this.maxLoopJump = d;
  }
  startLoop(j, w = {}) {
    const d = w.frameDuration ?? (w.frameRate ? $ / w.frameRate : undefined) ?? Q;
    let B = 0;
    function W(h, v) {
      if (h > v)
        return B -= d * (h - v), v;
      return h;
    }
    const { maxLoopJump: Y, requestAnimationFrame: G, cancelAnimationFrame: Z } = this;
    let y = 0;
    const H = (h) => {
      K = G(H);
      const v = W(Math.round((h + B - y) / d), Y);
      for (let z = 0;z < v; z++)
        y += d, j(y, z === v - 1);
    };
    let K = G(H);
    return () => {
      Z(K);
    };
  }
}

// src/index.ts
function animate(canvas, frameRate) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  context.fillStyle = "black";
  const fixedFrameLoop = new V;
  return fixedFrameLoop.startLoop((time, render) => {
    boxes.forEach((box) => {
      box.y = (box.y + box.height / 2) % canvas.height;
    });
    if (render) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      boxes.forEach(({ x, y, width, height }) => {
        context.fillRect(x, y, width, height);
      });
    }
  }, { frameRate });
}
var boxes = new Array(1e5).fill(null).map(() => ({
  x: Math.random() * 1000,
  y: Math.random() * 1000,
  width: Math.random() * 0.5,
  height: Math.random() * 5
}));
export {
  animate
};
