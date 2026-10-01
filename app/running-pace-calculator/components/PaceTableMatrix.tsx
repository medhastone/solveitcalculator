import React from 'react';

const PACE_DATA = [
  { paceKm: '3:30', paceMile: '5:38', speedKmh: '17.14', fiveK: '17:30', tenK: '35:00', half: '1:13:50', full: '2:27:41' },
  { paceKm: '3:45', paceMile: '6:02', speedKmh: '16.00', fiveK: '18:45', tenK: '37:30', half: '1:19:07', full: '2:38:14' },
  { paceKm: '4:00', paceMile: '6:26', speedKmh: '15.00', fiveK: '20:00', tenK: '40:00', half: '1:24:23', full: '2:48:47' },
  { paceKm: '4:15', paceMile: '6:50', speedKmh: '14.12', fiveK: '21:15', tenK: '42:30', half: '1:29:40', full: '2:59:19' },
  { paceKm: '4:30', paceMile: '7:15', speedKmh: '13.33', fiveK: '22:30', tenK: '45:00', half: '1:34:56', full: '3:09:53' },
  { paceKm: '4:45', paceMile: '7:39', speedKmh: '12.63', fiveK: '23:45', tenK: '47:30', half: '1:40:13', full: '3:20:26' },
  { paceKm: '5:00', paceMile: '8:03', speedKmh: '12.00', fiveK: '25:00', tenK: '50:00', half: '1:45:29', full: '3:30:59' },
  { paceKm: '5:15', paceMile: '8:27', speedKmh: '11.43', fiveK: '26:15', tenK: '52:30', half: '1:50:46', full: '3:41:32' },
  { paceKm: '5:30', paceMile: '8:51', speedKmh: '10.91', fiveK: '27:30', tenK: '55:00', half: '1:56:02', full: '3:52:04' },
  { paceKm: '5:45', paceMile: '9:15', speedKmh: '10.43', fiveK: '28:45', tenK: '57:30', half: '2:01:19', full: '4:02:37' },
  { paceKm: '6:00', paceMile: '9:39', speedKmh: '10.00', fiveK: '30:00', tenK: '1:00:00', half: '2:06:35', full: '4:13:10' },
  { paceKm: '6:15', paceMile: '10:04', speedKmh: '9.60', fiveK: '31:15', tenK: '1:02:30', half: '2:11:52', full: '4:23:43' },
  { paceKm: '6:30', paceMile: '10:28', speedKmh: '9.23', fiveK: '32:30', tenK: '1:05:00', half: '2:17:08', full: '4:34:16' },
  { paceKm: '6:45', paceMile: '10:52', speedKmh: '8.89', fiveK: '33:45', tenK: '1:07:30', half: '2:22:25', full: '4:44:49' },
  { paceKm: '7:00', paceMile: '11:16', speedKmh: '8.57', fiveK: '35:00', tenK: '1:10:00', half: '2:27:41', full: '4:55:22' },
  { paceKm: '7:30', paceMile: '12:04', speedKmh: '8.00', fiveK: '37:30', tenK: '1:15:00', half: '2:38:14', full: '5:16:28' },
  { paceKm: '8:00', paceMile: '12:52', speedKmh: '7.50', series: 'Walk/Run', fiveK: '40:00', tenK: '1:20:00', half: '2:48:47', full: '5:37:34' },
];

export default function PaceTableMatrix() {
  return (
    <section className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">table_chart</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Comprehensive Master Running Pace Chart
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Universal pace conversions between kilometer, mile, speed, and canonical race finish times.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container sticky top-0 z-10 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Pace /km</th>
                  <th className="py-2.5 px-4 font-semibold">Pace /mile</th>
                  <th className="py-2.5 px-4 font-semibold">Speed (km/h)</th>
                  <th className="py-2.5 px-4 font-semibold">5K Time</th>
                  <th className="py-2.5 px-4 font-semibold">10K Time</th>
                  <th className="py-2.5 px-4 font-semibold">Half Marathon</th>
                  <th className="py-2.5 px-4 font-semibold">Full Marathon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-body-sm font-body-sm">
                {PACE_DATA.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container/20'}
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-primary">{row.paceKm}</td>
                    <td className="py-2.5 px-4 font-mono text-on-surface">{row.paceMile}</td>
                    <td className="py-2.5 px-4 font-mono text-on-surface-variant">{row.speedKmh}</td>
                    <td className="py-2.5 px-4 font-mono text-on-surface">{row.fiveK}</td>
                    <td className="py-2.5 px-4 font-mono text-on-surface">{row.tenK}</td>
                    <td className="py-2.5 px-4 font-mono text-on-surface">{row.half}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-on-surface">{row.full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
