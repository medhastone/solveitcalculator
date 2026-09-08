import glob
import re

header_html = r'''
          <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-data-mono text-body-sm">
            <span className="text-primary font-bold">UTC:</span>
            <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface">
              {utcTime ? formatUtcTime(utcTime) : '00:00:00Z'}
            </span>
          </div>
'''

format_func = r'''
  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };
'''

for filepath in glob.glob("app/time-date/*/*Client.tsx"):
    if 'TimeZoneOverlapClient' in filepath:
        continue

    with open(filepath, 'r') as f:
        content = f.read()

    # Add utcTime state if it doesn't exist
    if 'const [utcTime, setUtcTime]' not in content:
        content = re.sub(
            r'const \[mounted, setMounted\] = useState\(false\);',
            r'const [mounted, setMounted] = useState(false);\n  const [utcTime, setUtcTime] = useState<Date | null>(null);\n' + format_func,
            content
        )
        
        # update useEffect if it doesn't have the timer
        content = re.sub(
            r'useEffect\(\(\) => \{\s+setMounted\(true\);\s+\}, \[\]\);',
            r'''useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);''',
            content
        )
    else:
        # It already has utcTime, just need format_func
        if 'const formatUtcTime' not in content:
            content = re.sub(
                r'const \[utcTime, setUtcTime\] = useState<Date \| null>\(null\);',
                r'const [utcTime, setUtcTime] = useState<Date | null>(null);\n' + format_func,
                content
            )

    # Insert the header HTML next to the Trust Telemetry Badges
    content = re.sub(
        r'<div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0\.5">',
        header_html + '\n          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

