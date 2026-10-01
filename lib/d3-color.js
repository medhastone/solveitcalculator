export class Color {}

export function color(format) {
  var match;
  if (!format) return null;
  if (typeof format === "object") {
    if (format instanceof Color) return format;
    if ("r" in format && "g" in format && "b" in format) return rgb(format.r, format.g, format.b, format.opacity);
    return null;
  }
  format = format.trim().toLowerCase();
  if (format === "transparent") return rgb(0, 0, 0, 0);
  if (match = /^#([0-9a-f]{3,8})$/i.exec(format)) {
    var hex = match[1], len = hex.length;
    if (len === 3 || len === 4) {
      var r = parseInt(hex[0] + hex[0], 16),
          g = parseInt(hex[1] + hex[1], 16),
          b = parseInt(hex[2] + hex[2], 16),
          a = len === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1;
      return rgb(r, g, b, a);
    }
    if (len === 6 || len === 8) {
      var r = parseInt(hex.slice(0, 2), 16),
          g = parseInt(hex.slice(2, 4), 16),
          b = parseInt(hex.slice(4, 6), 16),
          a = len === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
      return rgb(r, g, b, a);
    }
  }
  if (match = /^rgba?\(\s*([0-9]+(?:\.[0-9]+)?%?)\s*,\s*([0-9]+(?:\.[0-9]+)?%?)\s*,\s*([0-9]+(?:\.[0-9]+)?%?)(?:\s*,\s*([0-9]+(?:\.[0-9]+)?%?))?\s*\)$/i.exec(format)) {
    var parseVal = function(v) { return v.endsWith("%") ? (parseFloat(v) * 255) / 100 : parseFloat(v); };
    var parseAlpha = function(v) { return v ? (v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v)) : 1; };
    return rgb(parseVal(match[1]), parseVal(match[2]), parseVal(match[3]), parseAlpha(match[4]));
  }
  return rgb(0, 0, 0, 1);
}

export class Rgb extends Color {
  constructor(r, g, b, opacity = 1) {
    super();
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }
  rgb() { return this; }
  formatRgb() { return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.opacity})`; }
  toString() { return this.formatRgb(); }
}

export function rgb(r, g, b, opacity) {
  return new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

export class Hsl extends Color {
  constructor(h, s, l, opacity = 1) {
    super();
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s,
        m1 = 2 * l - m2;
    var hue = function(h) {
      h = h < 0 ? h + 360 : h >= 360 ? h - 360 : h;
      return h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1;
    };
    return new Rgb(hue(h + 120) * 255, hue(h) * 255, hue(h - 120) * 255, this.opacity);
  }
  formatHsl() { return `hsla(${this.h}, ${this.s * 100}%, ${this.l * 100}%, ${this.opacity})`; }
  toString() { return this.formatHsl(); }
}

export function hsl(h, s, l, opacity) {
  return new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

export class Lab extends Color {
  constructor(l, a, b, opacity = 1) {
    super();
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }
  rgb() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = 0.95047 * (Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16 / 116) / 7.787);
    y = 1.00000 * (Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16 / 116) / 7.787);
    z = 1.08883 * (Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16 / 116) / 7.787);
    return new Rgb(
      (3.2406 * x - 1.5372 * y - 0.4986 * z) * 255,
      (-0.9689 * x + 1.8758 * y + 0.0415 * z) * 255,
      (0.0557 * x - 0.2040 * y + 1.0570 * z) * 255,
      this.opacity
    );
  }
}

export function lab(l, a, b, opacity) {
  return new Lab(l, a, b, opacity == null ? 1 : opacity);
}

export class Hcl extends Color {
  constructor(h, c, l, opacity = 1) {
    super();
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }
  rgb() {
    var rad = this.h * Math.PI / 180;
    return lab(this.l, Math.cos(rad) * this.c, Math.sin(rad) * this.c, this.opacity).rgb();
  }
}

export function hcl(h, c, l, opacity) {
  return new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

export class Cubehelix extends Color {
  constructor(h, s, l, opacity = 1) {
    super();
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }
  rgb() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * Math.PI / 180,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (-0.14861 * cosh + 1.78277 * sinh)),
      255 * (l + a * (-0.29227 * cosh - 0.90649 * sinh)),
      255 * (l + a * (1.97294 * cosh)),
      this.opacity
    );
  }
}

export function cubehelix(h, s, l, opacity) {
  return new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

export default { color, rgb, hsl, lab, hcl, cubehelix, Rgb, Hsl, Lab, Hcl, Cubehelix };
