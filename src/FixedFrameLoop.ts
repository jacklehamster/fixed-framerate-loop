// To recognize dom types (see https://bun.sh/docs/typescript#dom-types):
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { IFrameAnimationCallbacks } from "./IFrameAnimationCallbacks";
import { LoopCallback } from "./Loop";

const MILLIS_PER_SEC = 1000;
export const DEFAULT_FRAME_DURATION = 16.5;  //  base of 60fps
const MAX_LOOP_JUMP = 10;

interface Config {
  maxLoopJump?: number;
}

export class FixedFrameLoop {
  private readonly requestAnimationFrame;
  private readonly cancelAnimationFrame;
  private readonly maxLoopJump;

  constructor({
    requestAnimationFrame = globalThis.requestAnimationFrame.bind(globalThis),
    cancelAnimationFrame = globalThis.cancelAnimationFrame.bind(globalThis),
  }: Partial<IFrameAnimationCallbacks> = {}, {
    maxLoopJump = MAX_LOOP_JUMP
  }: Partial<Config> = {}) {
    this.requestAnimationFrame = requestAnimationFrame;
    this.cancelAnimationFrame = cancelAnimationFrame;
    this.maxLoopJump = maxLoopJump;
  }

  startLoop(callback: LoopCallback, options: {
    frameRate?: number,
    frameDuration?: number,
  } = {}) {
    const frameDuration = options.frameDuration ?? (options.frameRate ? MILLIS_PER_SEC / options.frameRate : undefined) ?? DEFAULT_FRAME_DURATION;
    let timeOffset = 0; //  used to offset the time, in case we paused for too long
    let gameTime: DOMHighResTimeStamp = 0;   //  the time the game think it is

    function limit(loopCount: number, maxLoopJump: number) {
      if (loopCount > maxLoopJump) {
        timeOffset -= frameDuration * (loopCount - maxLoopJump);
        return maxLoopJump;
      }
      return loopCount;
    }

    const { maxLoopJump, requestAnimationFrame, cancelAnimationFrame } = this;
    const loop: FrameRequestCallback = time => {
      handle = requestAnimationFrame(loop);
      const loopCount = limit(Math.round((time + timeOffset - gameTime) / frameDuration), maxLoopJump);

      for (let i = 0; i < loopCount; i++) {
        gameTime += frameDuration;
        callback(gameTime, i === loopCount - 1);
      }
    };
    let handle = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(handle);
    };
  }
}
