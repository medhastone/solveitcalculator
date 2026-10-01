export function path() {
  return new Path();
}

export class Path {
  constructor() {
    this._ = [];
  }
  moveTo(x, y) {
    this._.push("M", +x, ",", +y);
  }
  closePath() {
    this._.push("Z");
  }
  lineTo(x, y) {
    this._.push("L", +x, ",", +y);
  }
  quadraticCurveTo(x1, y1, x, y) {
    this._.push("Q", +x1, ",", +y1, ",", +x, ",", +y);
  }
  bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._.push("C", +x1, ",", +y1, ",", +x2, ",", +y2, ",", +x, ",", +y);
  }
  arcTo(x1, y1, x2, y2, r) {
    this._.push("A", +r, ",", +r, " 0 0,1 ", +x2, ",", +y2);
  }
  arc(x, y, r, a0, a1, ccw) {
    this._.push("A", +r, ",", +r, " 0 0,", ccw ? 0 : 1, " ", +x, ",", +y);
  }
  rect(x, y, w, h) {
    this._.push("M", +x, ",", +y, "h", +w, "v", +h, "h", -w, "Z");
  }
  toString() {
    return this._.join("");
  }
}

export default { path, Path };
