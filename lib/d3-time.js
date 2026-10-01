function interval(floori, offseti, count, field) {
  function newInterval(t) {
    return floori(t = new Date(+t)), t;
  }
  newInterval.floor = newInterval;
  newInterval.ceil = function(date) {
    return floori(date = new Date(+date - 1)), offseti(date, 1), floori(date), date;
  };
  newInterval.round = function(date) {
    var d0 = newInterval(date), d1 = newInterval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };
  newInterval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };
  newInterval.range = function(start, stop, step) {
    var range = [], previous;
    start = newInterval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range;
    do {
      range.push(previous = new Date(+start));
      offseti(start, step);
      floori(start);
    } while (previous < start && start < stop);
    return range;
  };
  newInterval.filter = function(test) {
    return interval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date.getTime() - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {}
        } else while (--step >= 0) {
          while (offseti(date, 1), !test(date)) {}
        }
      }
    });
  };
  if (count) {
    newInterval.count = function(start, end) {
      return count(new Date(+start), new Date(+end));
    };
    newInterval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? newInterval
          : newInterval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return newInterval.count(0, d) % step === 0; });
    };
  }
  return newInterval;
}

export var timeMillisecond = interval(function() {}, function(date, step) { date.setTime(+date + step); });
export var timeSecond = interval(function(date) { date.setMilliseconds(0); }, function(date, step) { date.setTime(+date + step * 1000); });
export var timeMinute = interval(function(date) { date.setSeconds(0, 0); }, function(date, step) { date.setTime(+date + step * 60000); });
export var timeHour = interval(function(date) { date.setMinutes(0, 0, 0); }, function(date, step) { date.setTime(+date + step * 3600000); });
export var timeDay = interval(function(date) { date.setHours(0, 0, 0, 0); }, function(date, step) { date.setDate(date.getDate() + step); });
export var timeMonth = interval(function(date) { date.setDate(1); date.setHours(0, 0, 0, 0); }, function(date, step) { date.setMonth(date.getMonth() + step); });
export var timeYear = interval(function(date) { date.setMonth(0, 1); date.setHours(0, 0, 0, 0); }, function(date, step) { date.setFullYear(date.getFullYear() + step); });
export var timeWeek = interval(function(date) { date.setDate(date.getDate() - date.getDay()); date.setHours(0, 0, 0, 0); }, function(date, step) { date.setDate(date.getDate() + step * 7); });

export var utcMillisecond = timeMillisecond;
export var utcSecond = timeSecond;
export var utcMinute = timeMinute;
export var utcHour = timeHour;
export var utcDay = timeDay;
export var utcMonth = timeMonth;
export var utcYear = timeYear;
export var utcWeek = timeWeek;

export var timeMilliseconds = timeMillisecond.range;
export var timeSeconds = timeSecond.range;
export var timeMinutes = timeMinute.range;
export var timeHours = timeHour.range;
export var timeDays = timeDay.range;
export var timeMonths = timeMonth.range;
export var timeYears = timeYear.range;
export var timeWeeks = timeWeek.range;

export var utcMilliseconds = utcMillisecond.range;
export var utcSeconds = utcSecond.range;
export var utcMinutes = utcMinute.range;
export var utcHours = utcHour.range;
export var utcDays = utcDay.range;
export var utcMonths = utcMonth.range;
export var utcYears = utcYear.range;
export var utcWeeks = utcWeek.range;

export var timeSunday = timeWeek;
export var timeMonday = timeWeek;
export var timeTuesday = timeWeek;
export var timeWednesday = timeWeek;
export var timeThursday = timeWeek;
export var timeFriday = timeWeek;
export var timeSaturday = timeWeek;

export var utcSunday = utcWeek;
export var utcMonday = utcWeek;
export var utcTuesday = utcWeek;
export var utcWednesday = utcWeek;
export var utcThursday = utcWeek;
export var utcFriday = utcWeek;
export var utcSaturday = utcWeek;

export var timeInterval = interval;

export var timeTicks = function(start, stop, count) {
  var d0 = new Date(+start), d1 = new Date(+stop);
  return timeDay.range(d0, d1);
};
export var timeTickInterval = function(start, stop, count) {
  return timeDay;
};
export var utcTicks = timeTicks;
export var utcTickInterval = timeTickInterval;

export default {
  timeMillisecond,
  timeSecond,
  timeMinute,
  timeHour,
  timeDay,
  timeMonth,
  timeYear,
  timeWeek,
  utcMillisecond,
  utcSecond,
  utcMinute,
  utcHour,
  utcDay,
  utcMonth,
  utcYear,
  utcWeek,
  timeTicks,
  timeTickInterval,
  utcTicks,
  utcTickInterval
};
