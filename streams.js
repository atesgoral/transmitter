class PixelStream {
  constructor(canvas, iterator) {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    this.read = (count) => {
      const chunk = new Array(count);

      for (let i = 0; i < count; i++) {
        let coords = iterator.next();
        let offs = (coords.y * canvas.width + coords.x) * 4;
        chunk[i] = imgData.data[offs];
      }

      return chunk;
    };

    this.write = (chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        let coords = iterator.next();
        let offs = (coords.y * canvas.width + coords.x) * 4;
        imgData.data[offs] = chunk[i];
        imgData.data[offs + 1] = chunk[i];
        imgData.data[offs + 2] = chunk[i];
        imgData.data[offs + 3] = 255;
      }

      ctx.putImageData(imgData, 0, 0);
    };
  }
}
