import { LoopCallback } from ".";

export interface ILoopExecutor {
  startLoop(callback: LoopCallback, options: {
    frameRate?: number,
    frameDuration?: number,
  }): () => void;
}
