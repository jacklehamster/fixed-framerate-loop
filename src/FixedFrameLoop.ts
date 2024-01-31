// To recognize dom types (see https://bun.sh/docs/typescript#dom-types):
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { IFrameAnimationCallbacks } from "IFrameAnimationCallbacks";
import { LoopCallback } from "Loop";

export const DEFAULT_FRAME_PERIOD = 16.5;  //  base of 60fps
const MAX_LOOP_JUMP = 10;

interface Config {
  framePeriod: number;
  frameRate: number;
  maxLoopJump: number;
}

export class FixedFrameLoop {
  private readonly requestAnimationFrame;
  private readonly cancelAnimationFrame;
  private readonly framePeriod;
  private readonly maxLoopJump;

  constructor({
    requestAnimationFrame = globalThis.requestAnimationFrame.bind(globalThis),
    cancelAnimationFrame = globalThis.cancelAnimationFrame.bind(globalThis),
  }: Partial<IFrameAnimationCallbacks> = {}, {
    framePeriod, frameRate, maxLoopJump = MAX_LOOP_JUMP
  }: Partial<Config> = {}) {
    this.requestAnimationFrame = requestAnimationFrame;
    this.cancelAnimationFrame = cancelAnimationFrame;
    this.maxLoopJump = maxLoopJump;
    this.framePeriod = framePeriod ?? (frameRate ? 1000 / frameRate : undefined) ?? DEFAULT_FRAME_PERIOD;
  }

  startLoop(callback: LoopCallback) {
    let timeOffset = 0; //  used to offset the time, in case we paused for too long
    let gameTime: DOMHighResTimeStamp = 0;   //  the time the game think it is

    function limit(loopCount: number, maxLoopJump: number) {
      if (loopCount > maxLoopJump) {
        timeOffset -= framePeriod * (loopCount - maxLoopJump);
        return maxLoopJump;
      }
      return loopCount;
    }

    const { maxLoopJump, framePeriod, requestAnimationFrame, cancelAnimationFrame } = this;
    const loop: FrameRequestCallback = time => {
      handle = requestAnimationFrame(loop);
      const loopCount = limit(Math.round((time + timeOffset - gameTime) / framePeriod), maxLoopJump);

      for (let i = 0; i < loopCount; i++) {
        gameTime += framePeriod;
        callback(gameTime, i === loopCount - 1);
      }
    };
    let handle = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(handle);
    };
  }
}
