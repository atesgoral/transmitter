class ScanlineIterator {
  constructor(w, h) {
    let y = 0;
    let x = 0;

    this.next = () => {
      const ret = { x, y };

      if (++x === w) {
        x = 0;

        if (++y === h) {
          y = 0;
        }
      }

      return ret;
    }
  }
}

class ZigzagIterator {
  constructor(w, h) {
    let y = 0;
    let x = 0;
    let vx = 1;

    this.next = () => {
      const ret = { x, y };

      x += vx;

      if (x === w || x < 0) {
        if (++y === h) {
          y = 0;
          x = 0;
          vx = 1;
        } else {
          vx = -vx;
          x += vx;
        }
      }

      return ret;
    }
  }
}

class RectangularSpiralIterator {
  constructor(w, h) {
    // Go right and down first since we're rounding down the starting point
    const runs = [
      { x: 1, y: 0, runLenInc: 0 },
      { x: 0, y: 1, runLenInc: 1 },
      { x: -1, y: 0, runLenInc: 0 },
      { x: 0, y: -1, runLenInc: 1 }
    ];

    const maxD = Math.max(w, h);

    let y = h >> 1;
    let x = w >> 1;
    let runIdx = 0;
    let runLen = 1;
    let d = 0;

    this.next = () => {
      const ret = { x, y };

      const run = runs[runIdx];
      x += run.x;
      y += run.y;
      d++;

      if (d === runLen) {
        d = 0;
        runIdx = runIdx + 1 & 3;
        runLen += run.runLenInc;
      }

      if (runLen > maxD + 1) {
        y = h >> 1;
        x = w >> 1;
        runIdx = 0;
        runLen = 1;
        d = 0;
      }

      return ret;
    }
  }
}

// @todo fixed av for now
// @todo https://gamedev.stackexchange.com/questions/16745/moving-a-particle-around-an-archimedean-spiral-at-a-constant-speed
class PolarSpiralIterator {
  constructor(w, h) {
    const maxR = Math.max(w, h) / 2;
    const v = Math.SQRT1_2;
    const k = 1 / Math.PI / 2;

    let t = 0;

    this.next = () => {
      let θ = Math.sqrt(t * v / k);
      let r = θ * k;

      if (r >= maxR) {
        t = 0;
      } else {
        t += 1;
      }

      return {
        x: Math.floor(Math.cos(θ) * r + w / 2),
        y: Math.floor(Math.sin(θ) * r + h / 2)
      };
    }
  }
}

class OverlayIterator {
  constructor(canvas, iterator) {
    this.next = () => {
      const coords = iterator.next();

      return coords;
    }
  }
}
