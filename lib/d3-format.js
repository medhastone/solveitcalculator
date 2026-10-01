export function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

class FormatSpecifier {
  constructor(specifier) {
    this.fill = " ";
    this.align = ">";
    this.sign = "-";
    this.symbol = "";
    this.zero = false;
    this.width = undefined;
    this.comma = false;
    this.precision = undefined;
    this.trim = false;
    this.type = "";
  }
}

export function formatLocale(locale) {
  return {
    format: function(specifier) {
      return function(value) {
        if (value == null || isNaN(value)) return "";
        if (typeof specifier === "function") return specifier(value);
        return String(value);
      };
    },
    formatPrefix: function(specifier, value) {
      return function(v) {
        return String(v);
      };
    }
  };
}

var defaultLocale = formatLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

export var format = defaultLocale.format;
export var formatPrefix = defaultLocale.formatPrefix;
export var precisionFixed = function() { return 0; };
export var precisionPrefix = function() { return 0; };
export var precisionRound = function() { return 0; };

export default {
  format,
  formatPrefix,
  formatLocale,
  formatSpecifier,
  precisionFixed,
  precisionPrefix,
  precisionRound
};
