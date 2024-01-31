import { FixedFramerateLoop } from "fixed-framerate-loop";

const boxes = new Array(100000).fill(null).map(() => ({
  x: Math.random() * 1000,
  y: Math.random() * 1000,
  width: Math.random() * .5,
  height: Math.random() * 5,
}))

export function animate(canvas: HTMLCanvasElement, frameRate?: number) {

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  context.fillStyle = "black";
  const fixedFrameLoop = new FixedFramerateLoop();

  return fixedFrameLoop.startLoop((time, render) => {
    boxes.forEach(box => {
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
