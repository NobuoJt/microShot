const fs = require("fs");
const { Monitor } = require("node-screenshots");

let monitor = Monitor.fromPoint(100, 100);

console.log(monitor, monitor.id);

let image = monitor.captureImageSync();
fs.writeFileSync(`${monitor.id}-sync.png`, image.toPngSync());

monitor.captureImage().then((data:any) => {
    console.log(data);
    fs.writeFileSync(`${monitor.id}.jpeg`, data.toJpegSync());
});

let monitors = Monitor.all();

monitors.forEach((capturer:any) => {
    console.log({
    id: capturer.id,
    x: capturer.x,
    y: capturer.y,
    width: capturer.width,
    height: capturer.height,
    rotation: capturer.rotation,
    scaleFactor: capturer.scaleFactor,
    isPrimary: capturer.isPrimary,
    });
});