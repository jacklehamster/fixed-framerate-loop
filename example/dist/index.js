// /Users/vincent/fixed-framerate-loop/example/node_modules/fixed-framerate-loop/dist/index.js
var X = 1000;
var W = 16.5;
var b = 10;

class Y {
  requestAnimationFrame;
  cancelAnimationFrame;
  maxLoopJump;
  constructor({ requestAnimationFrame: z = globalThis.requestAnimationFrame.bind(globalThis), cancelAnimationFrame: j = globalThis.cancelAnimationFrame.bind(globalThis) } = {}, { maxLoopJump: w = b } = {}) {
    this.requestAnimationFrame = z, this.cancelAnimationFrame = j, this.maxLoopJump = w;
  }
  startLoop(z, j = {}) {
    const w = j.frameDuration ?? (j.frameRate ? X / j.frameRate : undefined) ?? W;
    let H = 0, B = 0;
    function Z(y, v) {
      if (y > v)
        return H -= w * (y - v), v;
      return y;
    }
    const { maxLoopJump: $, requestAnimationFrame: K, cancelAnimationFrame: d } = this, Q = (y) => {
      V = K(Q);
      const v = Z(Math.round((y + H - B) / w), $);
      for (let G = 0;G < v; G++)
        B += w, z(B, G === v - 1);
    };
    let V = K(Q);
    return () => {
      d(V);
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
  const fixedFrameLoop = new Y;
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
