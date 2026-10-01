'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How is running pace calculated?',
    a: 'Running pace is calculated by dividing total running time (in minutes and seconds) by the total distance covered. For example, running 10 kilometers in 50 minutes yields a pace of 5:00 minutes per kilometer (50 min ÷ 10 km = 5 min/km).',
  },
  {
    q: 'How do I convert pace from min/km to min/mile?',
    a: 'To convert minutes per kilometer to minutes per mile, multiply your pace in total seconds by 1.609344. For instance, a 5:00 min/km pace is 300 seconds × 1.609344 = 482.8 seconds, which equals 8 minutes and 3 seconds per mile (8:03 min/mi).',
  },
  {
    q: 'What is a good 5K pace for beginners?',
    a: 'A healthy and achievable 5K pace for beginner runners typically ranges between 6:00 to 7:30 minutes per kilometer (9:40 to 12:00 minutes per mile), corresponding to a total finish time between 30 and 38 minutes.',
  },
  {
    q: 'What pace is required to run a sub-20 minute 5K?',
    a: 'To break 20 minutes in a 5K race, you must sustain a precise pace of 4:00 minutes per kilometer (6:26 minutes per mile) or faster throughout the entire 5,000-meter course.',
  },
  {
    q: 'What is the required pace for a sub-4 hour marathon?',
    a: 'Breaking 4 hours in a full marathon (42.195 km / 26.219 miles) requires holding an average pace of 5:41 minutes per kilometer (9:09 minutes per mile) for a final clock time of 3:59:54.',
  },
  {
    q: 'What is a negative split and why is it recommended?',
    a: 'A negative split means running the second half of a race faster than the first half. Most world records in endurance events (from 10K to the marathon) are set with negative splits because starting conservatively preserves glycogen and avoids premature lactic acid buildup.',
  },
  {
    q: 'What is a positive split?',
    a: 'A positive split occurs when a runner runs the first half of a race faster than the second half. This usually results from starting too fast due to race-day adrenaline, leading to neuromuscular fatigue and slowing down in the final miles.',
  },
  {
    q: 'How does elevation gain impact running pace?',
    a: 'Every 100 meters of vertical elevation gain on a standard road course typically adds 30 to 45 seconds to your overall completion time depending on slope gradient and cardiovascular conditioning.',
  },
  {
    q: 'How does running cadence affect pace and efficiency?',
    a: 'Cadence is the number of steps taken per minute (spm). An optimal cadence of 170-185 spm minimizes braking forces upon footstrike, reduces ground contact time, and lessens the impact stress transmitted through knees and hips.',
  },
  {
    q: 'What is the Jack Daniels VDOT formula?',
    a: 'The VDOT system, developed by exercise physiologist Dr. Jack Daniels, calculates an athlete’s effective VO2 max and running economy from any recent race time, producing scientifically calibrated paces for Easy, Marathon, Threshold, Interval, and Repetition workouts.',
  },
  {
    q: 'What is the difference between speed and pace?',
    a: 'Speed measures distance traveled per unit of time (e.g., kilometers per hour or miles per hour), while pace measures the time taken to travel a specific unit of distance (e.g., minutes per kilometer or minutes per mile). Running predominantly uses pace because it directly predicts finish times.',
  },
  {
    q: 'How accurate is Peter Riegel’s race prediction formula?',
    a: 'Riegel’s formula (T2 = T1 × (D2/D1)^1.06) is highly accurate for predicting race times between 5K and marathon distances for runners with adequate aerobic endurance training. If an athlete has low weekly mileage, the fatigue exponent may increase to 1.08–1.12.',
  },
  {
    q: 'Why is a 400m track lap split useful for road racers?',
    a: '400m track laps allow athletes to calibrate their internal pacing rhythm with millisecond precision without relying on GPS watch lag. A 4:00/km pace translates to exactly 96 seconds per 400m track lap.',
  },
  {
    q: 'How many calories do you burn per kilometer of running?',
    a: 'On average, a runner burns approximately 1.036 kilocalories per kilogram of body weight per kilometer run. A 70 kg (154 lb) runner will burn approximately 72.5 kcal per kilometer or roughly 116 kcal per mile.',
  },
  {
    q: 'How does temperature affect marathon pacing?',
    a: 'Optimal marathon racing temperature is between 8°C and 11°C (46°F to 52°F). For every 5°C (9°F) increase above this range, finishing times tend to slow by 1.5% to 3% due to cardiac drift and peripheral vasodilation for thermoregulation.',
  },
  {
    q: 'What pace do I need to qualify for the Boston Marathon?',
    a: 'Boston Marathon qualifying standards vary by age group and gender, ranging from 3:00:00 (4:15/km or 6:52/mi) for men aged 18-34 to 3:30:00 (4:58/km or 8:00/mi) for women aged 18-34, with buffer times usually needed.',
  },
  {
    q: 'How do treadmill paces translate to outdoor road running?',
    a: 'Due to the lack of wind resistance on a treadmill, running at 0% incline is energetically slightly easier than running outdoors. Setting a treadmill to a 1.0% incline closely mimics outdoor aerobic expenditure at paces faster than 5:00/km (8:00/mi).',
  },
  {
    q: 'What is lactate threshold pace?',
    a: 'Lactate threshold pace is the highest running speed an athlete can sustain for roughly 45 to 60 minutes without blood lactate accumulating exponentially. For trained runners, this corresponds closely to 15K to Half Marathon race pace.',
  },
  {
    q: 'How do you print a race-day pace wristband with this tool?',
    a: 'Click the "Print Wristband" button in the workbench header. The page dynamically formats the split checkpoint table into a compact printable strip suitable for wearing during races.',
  },
  {
    q: 'Can I export my split strategy to my GPS smartwatch or spreadsheet?',
    a: 'Yes, click "Export CSV" to download the complete kilometer or mile split matrix with interval paces and cumulative elapsed checkpoints directly into Excel, Google Sheets, or Garmin Connect.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">quiz</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Frequently Asked Questions (Running Pace &amp; Splits)
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Answers to key training, biomechanical, pacing, and marathon preparation queries.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs divide-y divide-surface-container overflow-hidden">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-3 text-on-surface hover:bg-surface-container/40 transition-colors cursor-pointer"
                >
                  <span className="font-title-sm text-title-sm font-semibold">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-body-sm text-on-surface-variant leading-relaxed animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
