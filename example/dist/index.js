// /Users/vincent/fixed-framerate-loop/example/node_modules/fixed-frame-loop/dist/index.js
var S = 16.5;
var Y = 10;

class V {
  requestAnimationFrame;
  cancelAnimationFrame;
  framePeriod;
  maxLoopJump;
  constructor({ requestAnimationFrame: z = globalThis.requestAnimationFrame.bind(globalThis), cancelAnimationFrame: w = globalThis.cancelAnimationFrame.bind(globalThis) } = {}, { framePeriod: v, frameRate: y, maxLoopJump: B = Y } = {}) {
    this.requestAnimationFrame = z, this.cancelAnimationFrame = w, this.maxLoopJump = B, this.framePeriod = v ?? (y ? 1000 / y : undefined) ?? S;
  }
  startLoop(z) {
    let w = 0, v = 0;
    function y(j, h) {
      if (j > h)
        return w -= G * (j - h), h;
      return j;
    }
    const { maxLoopJump: B, framePeriod: G, requestAnimationFrame: K, cancelAnimationFrame: W } = this, N = (j) => {
      Q = K(N);
      const h = y(Math.round((j + w - v) / G), B);
      for (let H = 0;H < h; H++)
        v += G, z(v, H === h - 1);
    };
    let Q = K(N);
    return () => {
      W(Q);
    };
  }
}

// src/index.ts
var fixedFrameLoop = new V;
fixedFrameLoop.startLoop();
