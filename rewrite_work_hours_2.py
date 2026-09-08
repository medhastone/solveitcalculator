import re

def process_file():
    with open('app/time-date/work-hours/WorkHoursClient.tsx', 'r') as f:
        content = f.read()

    # Insert state
    state_code = """
  const [currency, setCurrency] = useState('USD');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  const getSymbol = () => currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  const displayTime = (time24: string) => {
    if (!time24) return '--:--';
    if (timeFormat === '24h') return time24;
    const parts = time24.split(':');
    if (parts.length !== 2) return time24;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const setToday = () => {
    setWorkDate(new Date().toISOString().split('T')[0]);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Clock In', 'Clock Out', 'Break (m)', 'Net Dec Hrs', 'Reg Hrs', 'OT Hrs', 'Pay'];
    const rows = processedLedger.map(s => 
      [s.dateStr, s.type, s.clockIn, s.clockOut, s.breakMins, s.decHrs.toFixed(2), s.reg.toFixed(2), s.ot.toFixed(2), s.pay.toFixed(2)].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "timesheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printSheet = () => {
    window.print();
  };

  const copySheet = () => {
    const text = processedLedger.map(s => `${s.dateStr} | ${s.type} | ${s.clockIn}-${s.clockOut} | ${s.decHrs.toFixed(2)} hrs | Pay: ${getSymbol()}${s.pay.toFixed(2)}`).join('\\n');
    navigator.clipboard.writeText(`Timesheet:\\n${text}\\nTotal Reg: ${totals.regHrs.toFixed(2)}h | Total OT: ${totals.otHrs.toFixed(2)}h | Total Pay: ${getSymbol()}${totals.grossPay.toFixed(2)}`);
    alert('Timesheet copied to clipboard!');
  };

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
"""
    
    # We find where `const addShiftToLedger = () => {` is and append these below it
    content = content.replace("const addShiftToLedger = () => {", state_code + "\n  const addShiftToLedger = () => {")

    # 1. Update Today button
    content = re.sub(
        r'<button className="([^"]*?)" type="button">Today</button>',
        r'<button className="\1" type="button" onClick={setToday}>Today</button>',
        content
    )

    # 2. Update Currency Selectors
    content = re.sub(
        r'<span className="font-bold text-primary">USD \(\$\)</span>',
        r'<span className={currency === "USD" ? "font-bold text-primary cursor-pointer" : "text-on-surface-variant hover:text-on-surface cursor-pointer"} onClick={() => setCurrency("USD")}>USD ($)</span>',
        content
    )
    content = re.sub(
        r'<span className="text-on-surface-variant hover:text-on-surface cursor-pointer">EUR \(€\)</span>',
        r'<span className={currency === "EUR" ? "font-bold text-primary cursor-pointer" : "text-on-surface-variant hover:text-on-surface cursor-pointer"} onClick={() => setCurrency("EUR")}>EUR (€)</span>',
        content
    )
    content = re.sub(
        r'<span className="text-on-surface-variant hover:text-on-surface cursor-pointer">GBP \(£\)</span>',
        r'<span className={currency === "GBP" ? "font-bold text-primary cursor-pointer" : "text-on-surface-variant hover:text-on-surface cursor-pointer"} onClick={() => setCurrency("GBP")}>GBP (£)</span>',
        content
    )
    # The currency sign inside the input relative wrapper
    content = re.sub(
        r'<span className="absolute left-3 text-on-surface-variant font-data-mono">\$</span>',
        r'<span className="absolute left-3 text-on-surface-variant font-data-mono">{getSymbol()}</span>',
        content
    )

    # Replace hardcoded `$` before {} with `{getSymbol()}`. e.g. `${totals.grossPay}` -> `{getSymbol()}{totals.grossPay}`
    # Note: Javascript/React uses `$` literally, so regex is: \$\{
    # Let's replace `$340.00 base` which is now `${(liveShift.reg * (parseFloat(hourlyRate)||0)).toFixed(2)} base`
    content = re.sub(r'\$\{', r'{getSymbol()}{', content)

    # 3. TimeFormat 12h/24h toggle buttons
    content = re.sub(
        r'<button className="px-2.5 py-1 rounded bg-surface text-primary font-medium shadow-sm" type="button">12-Hour</button>',
        r'<button className={`px-2.5 py-1 rounded ${timeFormat === "12h" ? "bg-surface text-primary font-medium shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} type="button" onClick={() => setTimeFormat("12h")}>12-Hour</button>',
        content
    )
    content = re.sub(
        r'<button className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface" type="button">24-Hour Military</button>',
        r'<button className={`px-2.5 py-1 rounded ${timeFormat === "24h" ? "bg-surface text-primary font-medium shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} type="button" onClick={() => setTimeFormat("24h")}>24-Hour Military</button>',
        content
    )
    
    # 4. Modify shift.clockIn / shift.clockOut rendering in the table
    content = content.replace('{shift.clockIn}', '{displayTime(shift.clockIn)}')
    content = content.replace('{shift.clockOut}', '{displayTime(shift.clockOut)}')

    # 5. Quick Save Shift button
    content = re.sub(
        r'<button([^>]*?)>(\s*<span[^>]*?>bookmark_add</span>\s*Quick Save Shift\s*)</button>',
        r'<button\1 onClick={addShiftToLedger}>\2</button>',
        content
    )

    # 6. Top Table Buttons: Add Shift Row, Export CSV, Print Sheet, Copy
    content = re.sub(
        r'<button([^>]*?)>(\s*<span[^>]*?>add_circle</span>\s*Add Shift Row\s*)</button>',
        r'<button\1 onClick={scrollToForm}>\2</button>',
        content
    )
    content = re.sub(
        r'<button([^>]*?)>(\s*<span[^>]*?>download</span>\s*Export CSV\s*)</button>',
        r'<button\1 onClick={exportCSV}>\2</button>',
        content
    )
    content = re.sub(
        r'<button([^>]*?)>(\s*<span[^>]*?>print</span>\s*Print Sheet\s*)</button>',
        r'<button\1 onClick={printSheet}>\2</button>',
        content
    )
    content = re.sub(
        r'<button([^>]*?)>(\s*<span[^>]*?>content_copy</span>\s*Copy\s*)</button>',
        r'<button\1 onClick={copySheet}>\2</button>',
        content
    )

    with open('app/time-date/work-hours/WorkHoursClient.tsx', 'w') as f:
        f.write(content)

process_file()
