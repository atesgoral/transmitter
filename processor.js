class BufferConsumer extends AudioWorkletProcessor {
  constructor(options) {
    super(options);

    this.buffers = [];

    // this.port.onmessage = (message) => {
    //   this.buffers.push(message.data[0]);
    // }

    this.t = 0;
  }

  process(inputs, outputs) {
    if (this.buffers.length) {
      const buffer = this.buffers.shift();
      // @todo force to be mono with options?
      outputs[0][0].set(buffer);
      this.port.postMessage('consumed');
      // console.log(this.buffers.length);
    } else {
      // console.log('no buffers');
    }

    for (let i = 0; i < outputs[0][0].length; i++) {
      outputs[0][0][i] = Math.sin(t);
      t += 0.01;
    }

    return true;
  }
}

registerProcessor('buffer-consumer', BufferConsumer);
