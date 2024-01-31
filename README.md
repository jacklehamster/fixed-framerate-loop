# fixed-framerate-loop
[![npm version](https://badge.fury.io/js/fixed-framerate-loop.svg)](https://www.npmjs.com/package/fixed-framerate-loop)

A simple TypeScript class that runs requestAnimationFrame at fixed frameRate, adapting to screen refresh rate by calling the loop more or less multiple times per frame.

This is used by [motor-loop](https://github.com/jacklehamster/motor-loop), which is a more elaborate game event scheduler.

## The problem

The problem this package is trying to solve, is having variable frame rates in games, depending on the screen refresh rate.
- Depending on the screen refresh rate, the game might suddenly go faster or slower, because your test assumed 60fps but some screens execute "requestAnimationFrame" at 120fps, others at 30fps (A macbook air about to run out of battery drops to 30fps).
- This could be solved by accounting for the variable frame duration in your movement calculation. `body.x += speed * deltaTime * dx`. But the problem with that is that on low frameRate, your deltaTime can be large, and suddenly your body is moving so fast that it passes through walls. Another problem with variable frame duration is that your game isn't running reliabily. If for instance you wanted to "replay" a game session by replicating all user actions, you would not game the same result simply because the frame duration is a bit random.

To address that, we use the method below:

## Method

Every frame, we calculate the number of loops to run during that frame so that the game catches up with the actual time.

Let's say the game runs at 60fps.
- If the screen refresh rate is 30zhz, the game might execute ~2 loops per frame.
- If the refresh rate is 120hz, the game will run ~1 loop every two frames.

Every loop, you can execute game logic with the time that is passed. The last loop of the frame, the "render" flag is true, so you should also render the scene. (That way you don't render the scene multiple times per frame, which is a waste of computation).

```es6
    let gameTime: DOMHighResTimeStamp = 0;   //  the time the game think it is
    const loop: FrameRequestCallback = time => {
      handle = requestAnimationFrame(loop);
      const loopCount = limit(
        Math.round((time + timeOffset - gameTime) / frameDuration),
        maxLoopJump);

      for (let i = 0; i < loopCount; i++) {
        gameTime += frameDuration;
        callback(gameTime, i === loopCount - 1);
      }
    };
```

This ensures that no matter what, the game's internal logic can always assume the same frame duration, regardless of the screen refresh rate.

### Game pause

We also use a timeOffset and maxLoopJump to ensure we don't advance the game too quickly:
For instance, let's say you took a 5 min break. requestAnimationFrame paused for that amount of time, and when you come back to the game, it would have to catch up 3600 frames. By that time, your player got overrun by enemies.

To avoid that weird situation, we only catch up by 10 frames (maxLoopJump). But this means the game's time doesn't match the actual time anymore, so timeOffset is used to account for that.

## Usage

```es6
const fixedFrameRateLoop = new FixedFrameRateLoop();

fixedFrameRateLoop.startLoop((time, render) => {
  //  perform some action
  if (render) {
    //  do rendering
  }
}, {
  frameRate: 60,  //  optional, default is ~60fps (frame duration: 16.5ms)
})
```

![](https://jacklehamster.github.io/fixed-framerate-loop/icon.png)
## Install bun

https://bun.sh/

```bash
curl -fsSL https://bun.sh/install | bash
```

## Commands

- **start**: "bun run index.ts",
- **bundle**: "bun run bundler/bundler.ts",
- **list**: "bun run samples/list-scripts.tsx",
- **example**: "cd example && bun start && cd ..",
- **fileSample**: "bun run samples/file.tsx && cat samples/data/test.json",
- **httpSample**: "bun run samples/server.tsx"

## Run example

[https://jacklehamster.github.io/fixed-framerate-loop/example/](https://jacklehamster.github.io/fixed-framerate-loop/example/)

## Github Source

[https://github.com/jacklehamster/fixed-framerate-loop/](https://github.com/jacklehamster/fixed-framerate-loop/)
