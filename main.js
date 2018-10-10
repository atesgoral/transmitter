function documentReady() {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', () => resolve(window.document))
  });
}

function loadImage() {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'Anonymous';
    img.src = 'lenna.png';
    img.addEventListener('load', () => resolve(img));
  });
}

class Progress {
  constructor(canvas, srcCanvas, iterator) {
    const ctx = canvas.getContext('2d');

    const overlayCanvas = document.createElement('canvas'); // use doc
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;

    const overlayCtx = overlayCanvas.getContext('2d');

    overlayCtx.fillStyle = 'black';
    overlayCtx.fillRect(0, 0, canvas.width, canvas.height);
    overlayCtx.fillStyle = 'white';

    this.iterator = {
      next() {
        const coords = iterator.next();
        overlayCtx.fillRect(coords.x, coords.y, 1, 1);
        return coords;
      }
    };

    function draw() {
      requestAnimationFrame(draw);

      canvas.width |= 0;
      ctx.drawImage(srcCanvas,
        0, 0,
        srcCanvas.width, srcCanvas.height,
        0, 0,
        canvas.width, canvas.height
      );
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(overlayCanvas, 0, 0);

      overlayCtx.fillStyle = 'black';
      overlayCtx.globalAlpha = 0.25;
      overlayCtx.fillRect(0, 0, canvas.width, canvas.height);
      overlayCtx.fillStyle = 'white';
      overlayCtx.globalAlpha = 1;
    }

    requestAnimationFrame(draw);
  }
}

(async () => {
  const [ doc, img ] = await Promise.all([ documentReady(), loadImage() ]);

  const srcCanvas = doc.getElementById('src');
  const progCanvas = doc.getElementById('prog');
  const destCanvas = doc.getElementById('dest');

  const srcCtx = srcCanvas.getContext('2d');

  srcCtx.filter = 'grayscale(100%)';
  srcCtx.drawImage(img, 0, 0, srcCanvas.width, srcCanvas.height);

  // const srcIterator = new ScanlineIterator(srcCanvas.width, srcCanvas.height);
  const srcIterator = new PolarSpiralIterator(srcCanvas.width, srcCanvas.height);
  const progress = new Progress(progCanvas, srcCanvas, srcIterator);
  const srcStream = new PixelStream(srcCanvas, progress.iterator);
  // const destIterator = new ScanlineIterator(destCanvas.width, destCanvas.height);
  const destIterator = new PolarSpiralIterator(destCanvas.width, destCanvas.height);
  const destStream = new PixelStream(destCanvas, destIterator);

  const audioCtx = new AudioContext();

  const audioSrcStream = new AudioStream(audioCtx, 1 << 10);
  //const audioDestStream

  audioSrcStream.pipeFrom(srcStream);
  //audioSrcStream.audioNode.connect(audioCtx.destination);

  // processorNode.onaudioprocess = (e) => {
  //   const output = e.outputBuffer.getChannelData(0);
  //   const chunk = srcStream.read(output.length);
    // destStream.write(chunk);
    // for (let i = 0; i < output.lenght; i++) {
    //   // output[i] = Math.random;
    // }
  // };

    // processorNode.connect(audioCtx.destination);

  setInterval(() => {
    const chunk = srcStream.read(2048);
    destStream.write(chunk);
  }, 100);
})();
