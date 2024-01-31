# fixed-framerate-loop
[![npm version](https://badge.fury.io/js/fixed-framerate-loop.svg)](https://www.npmjs.com/package/fixed-framerate-loop)

A simple TypeScript class that runs requestAnimationFrame at fixed frameRate, adapting to screen refresh rate by calling the loop more or less multiple times per frame.

This is used by [motor-loop](https://github.com/jacklehamster/motor-loop), which is a more elaborate game event scheduler.

![](https://jacklehamster.github.io/bun-template/icon.png)
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

[https://jacklehamster.github.io/fixed-frame-loop/example/](https://jacklehamster.github.io/fixed-frame-loop/example/)

## Github Source

[https://github.com/jacklehamster/fixed-frame-loop/](https://github.com/jacklehamster/fixed-frame-loop/)
