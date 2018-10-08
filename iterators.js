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
    const radius = Math.max(w, h) / 2;

    let d = 0;
    let av = 1 / radius;

    // need r rotations

    //let a = 0;
    /*
    max av = 1 / r

    half av = 2 / r
    */

    this.next = () => {

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
