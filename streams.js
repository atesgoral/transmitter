class Stream {}

class PixelStream extends Stream {
  constructor(canvas, iterator) {
    super();
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    this.read = (count) => {
      const chunk = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        let coords = iterator.next();
        let offs = (coords.y * canvas.width + coords.x) * 4;
        chunk[i] = imgData.data[offs] / 255 * 2 - 1;
      }

      return chunk;
    };

    this.write = (chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        let coords = iterator.next();
        let offs = (coords.y * canvas.width + coords.x) * 4;
        let brightness = (chunk[i] + 1) / 2 * 255;
        imgData.data[offs] = brightness;
        imgData.data[offs + 1] = brightness;
        imgData.data[offs + 2] = brightness;
        imgData.data[offs + 3] = 255;
      }

      ctx.putImageData(imgData, 0, 0);
    };
  }
}

class AudioStream {
  constructor(ctx, bufferSize) {
    const processorNode = ctx.createScriptProcessor(bufferSize, 1, 1);

    let src = null;

    processorNode.onaudioprocess = (e) => {
      //const output = e.outputBuffer.getChannelData(0);

      if (src instanceof Stream) {
        const chunk = src.read(e.outputBuffer.length);
        e.outputBuffer.copyToChannel(Float32Array.from(chunk), 0);
        // for (let i = 0; i < output.lenght; i++) {
        //   // output[i] = Math.random;
        // }
      } else if (src instanceof AudioNode) {

      }
    };

    this.audioNode = processorNode;

    // @todo pipe on other end?
    this.pipeFrom = (stream) => {
      src = stream;
    };
  }
}
