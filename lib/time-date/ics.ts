/**
 * RFC 5545 iCalendar (.ics) Generator
 * Generates valid iCalendar files for browser download and calendar import
 */

export function generateIcsFile({
  title,
  description,
  startDate,
  endDate,
  location = '',
  url = 'https://solveitcalculator.com/time-date',
}: {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  url?: string;
}): void {
  if (typeof window === 'undefined') return;

  const formatDate = (date: Date): string => {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  };

  const finalEndDate = endDate || new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hr default

  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@solveitcalculator.com`;
  const nowStr = formatDate(new Date());
  const startStr = formatDate(startDate);
  const endStr = formatDate(finalEndDate);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SolveItCalculator//Time & Date Suite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${title.replace(/[,\n\r]/g, ' ')}`,
    `DESCRIPTION:${description.replace(/[,\n\r]/g, ' ')}`,
    location ? `LOCATION:${location.replace(/[,\n\r]/g, ' ')}` : '',
    `URL:${url}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'DESCRIPTION:Reminder',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
