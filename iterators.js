class ScanlineIterator {
  constructor(w, h) {
    let y = 0;
    let x = 0;

    this.next = () => {
      const ret = { x, y };

      if (++x === w) {
        x = 0;

        if (++y == h) {
          y = 0;
        }
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
