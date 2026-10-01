export function timeFormatLocale(locale) {
  return {
    format: function(specifier) {
      return function(date) {
        if (!date) return "";
        var d = new Date(date);
        return d.toLocaleDateString();
      };
    },
    parse: function(specifier) {
      return function(str) {
        return new Date(str);
      };
    }
  };
}

var defaultLocale = timeFormatLocale({});
export var timeFormat = defaultLocale.format;
export var timeParse = defaultLocale.parse;
export var utcFormat = defaultLocale.format;
export var utcParse = defaultLocale.parse;
export var isoFormat = function(date) { return new Date(date).toISOString(); };
export var isoParse = function(str) { return new Date(str); };
export var timeFormatDefaultLocale = timeFormatLocale;

export default {
  timeFormat,
  timeParse,
  utcFormat,
  utcParse,
  isoFormat,
  isoParse,
  timeFormatLocale,
  timeFormatDefaultLocale
};
