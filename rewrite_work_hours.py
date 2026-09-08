import re

def process_file():
    with open('/tmp/WorkHoursClient_backup.tsx', 'r') as f:
        content = f.read()

    # We need to find the start of the component body to insert state
    state_code = """
  const [workDate, setWorkDate] = useState('2025-03-03');
  const [shiftCategory, setShiftCategory] = useState('Standard Day Shift (8:30 AM - 5:30 PM)');
  const [clockIn, setClockIn] = useState('08:30');
  const [clockOut, setClockOut] = useState('17:45');
  const [breakDuration, setBreakDuration] = useState('45');
  const [hourlyRate, setHourlyRate] = useState('42.50');
  const [otRule, setOtRule] = useState<'flsa' | 'ca'>('ca');

  const [ledger, setLedger] = useState([
    { id: '1', dateStr: '2025-03-03', type: 'Day Shift', clockIn: '08:30', clockOut: '17:30', breakMins: 45, rate: 42.50, otRule: 'ca' },
    { id: '2', dateStr: '2025-03-04', type: 'Day Shift', clockIn: '08:45', clockOut: '17:15', breakMins: 30, rate: 42.50, otRule: 'ca' },
    { id: '3', dateStr: '2025-03-05', type: 'Extended', clockIn: '08:00', clockOut: '18:30', breakMins: 60, rate: 42.50, otRule: 'ca' },
    { id: '4', dateStr: '2025-03-06', type: 'Day Shift', clockIn: '09:00', clockOut: '17:30', breakMins: 30, rate: 42.50, otRule: 'ca' },
    { id: '5', dateStr: '2025-03-07', type: 'Friday Sprint', clockIn: '08:30', clockOut: '17:00', breakMins: 45, rate: 42.50, otRule: 'ca' },
    { id: '6', dateStr: '2025-03-08', type: 'On-Call', clockIn: '10:00', clockOut: '14:00', breakMins: 0, rate: 42.50, otRule: 'ca', forceOT: true }
  ]);

  const parseTime = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const formatMins = (totalMins: number) => {
    const isNeg = totalMins < 0;
    const absM = Math.abs(totalMins);
    const h = Math.floor(absM / 60);
    const m = absM % 60;
    return `${isNeg ? '-' : ''}${h}h ${String(m).padStart(2, '0')}m`;
  };

  const calcShift = (cIn: string, cOut: string, bMins: number, rule: string, rate: number, forceOT: boolean = false, accumWeeklyHrs: number = 0) => {
    const inMins = parseTime(cIn);
    let outMins = parseTime(cOut);
    if (outMins < inMins) outMins += 24 * 60;
    const grossMins = outMins - inMins;
    const netMins = Math.max(0, grossMins - bMins);
    const decHrs = netMins / 60;
    
    let reg = 0;
    let ot = 0;

    if (forceOT) {
      ot = decHrs;
    } else if (rule === 'ca') {
      reg = Math.min(8, decHrs);
      ot = Math.max(0, decHrs - 8);
    } else {
      // FLSA
      if (accumWeeklyHrs + decHrs > 40) {
        if (accumWeeklyHrs >= 40) {
          ot = decHrs;
        } else {
          reg = 40 - accumWeeklyHrs;
          ot = decHrs - reg;
        }
      } else {
        reg = decHrs;
      }
    }

    const pay = (reg * rate) + (ot * rate * 1.5);
    return { grossMins, netMins, decHrs, reg, ot, pay };
  };

  // Live Shift Preview
  const liveShift = calcShift(clockIn, clockOut, parseInt(breakDuration) || 0, otRule, parseFloat(hourlyRate) || 0);

  // Ledger Calculations
  let weeklyAccum = 0;
  const processedLedger = ledger.map(shift => {
    const res = calcShift(shift.clockIn, shift.clockOut, shift.breakMins, shift.otRule, shift.rate, (shift as any).forceOT, weeklyAccum);
    weeklyAccum += res.decHrs;
    return { ...shift, ...res };
  });

  const totals = processedLedger.reduce((acc, curr) => {
    acc.grossPay += curr.pay;
    acc.regHrs += curr.reg;
    acc.otHrs += curr.ot;
    acc.decHrs += curr.decHrs;
    acc.netMins += curr.netMins;
    return acc;
  }, { grossPay: 0, regHrs: 0, otHrs: 0, decHrs: 0, netMins: 0 });

  const addShiftToLedger = () => {
    setLedger([...ledger, {
      id: Date.now().toString(),
      dateStr: workDate,
      type: shiftCategory.split(' ')[0],
      clockIn,
      clockOut,
      breakMins: parseInt(breakDuration) || 0,
      rate: parseFloat(hourlyRate) || 0,
      otRule
    }]);
  };
"""
    
    content = content.replace("const [mounted, setMounted] = useState(false);", "const [mounted, setMounted] = useState(false);\n" + state_code)

    # 1. Update Shift Configuration Workbench inputs
    content = content.replace('defaultValue="2025-03-03"', 'value={workDate} onChange={(e) => setWorkDate(e.target.value)}')
    content = content.replace('defaultValue="Standard Day Shift (8:30 AM - 5:30 PM)"', 'value={shiftCategory} onChange={(e) => setShiftCategory(e.target.value)}')
    content = content.replace('defaultValue="08:30"', 'value={clockIn} onChange={(e) => setClockIn(e.target.value)}')
    content = content.replace('defaultValue="17:45"', 'value={clockOut} onChange={(e) => setClockOut(e.target.value)}')
    content = content.replace('defaultValue="45 Minutes (Enterprise lunch deduction)"', 'value={breakDuration} onChange={(e) => setBreakDuration(e.target.value)}')
    content = content.replace('defaultValue="42.50"', 'value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)}')
    
    content = content.replace('defaultChecked className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio"', 'checked={otRule === "flsa"} onChange={() => setOtRule("flsa")} className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio"')
    content = content.replace('className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio"', 'checked={otRule === "ca"} onChange={() => setOtRule("ca")} className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio"')

    # 2. Update button actions
    content = re.sub(r'<button([^>]*?)>(\s*<span[^>]*?>bolt</span>\s*Compute Shift &amp; Add to Ledger\s*)</button>', r'<button\1 onClick={addShiftToLedger}>\2</button>', content)
    content = re.sub(r'<button([^>]*?)>(\s*<span[^>]*?>restart_alt</span>\s*Reset Times\s*)</button>', r'<button\1 onClick={() => setLedger([])}>\2</button>', content)

    # 3. Update LIVE METRIC RESULT TILES
    content = re.sub(r'<span className="font-numerical-display text-numerical-display text-primary">8h 30m</span>', r'<span className="font-numerical-display text-numerical-display text-primary">{formatMins(liveShift.netMins)}</span>', content)
    content = content.replace('(8.50 Dec)', '({liveShift.decHrs.toFixed(2)} Dec)')
    content = re.sub(r'<span>Gross Span: <strong className="text-on-surface">9h 15m</strong></span>', r'<span>Gross Span: <strong className="text-on-surface">{formatMins(liveShift.grossMins)}</strong></span>', content)
    content = re.sub(r'<span>Unpaid Break: <strong className="text-error">-45m</strong></span>', r'<span>Unpaid Break: <strong className="text-error">-{breakDuration}m</strong></span>', content)
    
    content = re.sub(r'<span className="font-headline-md text-headline-md text-on-surface">8\.00 hrs</span>', r'<span className="font-headline-md text-headline-md text-on-surface">{liveShift.reg.toFixed(2)} hrs</span>', content)
    content = re.sub(r'<span className="font-data-mono text-body-sm text-secondary font-medium">\$340\.00 base</span>', r'<span className="font-data-mono text-body-sm text-secondary font-medium">${(liveShift.reg * (parseFloat(hourlyRate)||0)).toFixed(2)} base</span>', content)
    content = re.sub(r'<span className="font-headline-md text-headline-md text-tertiary">0\.50 hrs</span>', r'<span className="font-headline-md text-headline-md text-tertiary">{liveShift.ot.toFixed(2)} hrs</span>', content)
    content = re.sub(r'<span className="font-data-mono text-body-sm text-tertiary font-medium">\$31\.88 @ \$63\.75/hr</span>', r'<span className="font-data-mono text-body-sm text-tertiary font-medium">${(liveShift.ot * (parseFloat(hourlyRate)||0) * 1.5).toFixed(2)} @ ${(parseFloat(hourlyRate) * 1.5 || 0).toFixed(2)}/hr</span>', content)

    content = re.sub(r'<span className="font-numerical-display text-numerical-display text-on-surface">\$371\.88</span>', r'<span className="font-numerical-display text-numerical-display text-on-surface">${liveShift.pay.toFixed(2)}</span>', content)
    content = re.sub(r'Effective Blended Rate: <span className="font-data-mono font-medium text-on-surface">\$43\.75 / hr</span> across 8\.50 billed hours', r'Effective Blended Rate: <span className="font-data-mono font-medium text-on-surface">${liveShift.decHrs > 0 ? (liveShift.pay / liveShift.decHrs).toFixed(2) : "0.00"} / hr</span> across {liveShift.decHrs.toFixed(2)} billed hours', content)

    content = re.sub(r'<span className="font-data-mono text-body-sm text-primary font-semibold">38\.50 / 40\.00 hrs</span>', r'<span className="font-data-mono text-body-sm text-primary font-semibold">{totals.decHrs.toFixed(2)} / 40.00 hrs</span>', content)

    content = re.sub(r'96\.2% of regular week reached', r'{Math.min(100, (totals.decHrs / 40) * 100).toFixed(1)}% of regular week reached', content)
    content = re.sub(r'<span className="text-tertiary font-medium">1\.50 hrs to weekly OT trigger</span>', r'<span className="text-tertiary font-medium">{Math.max(0, 40 - totals.decHrs).toFixed(2)} hrs to weekly OT trigger</span>', content)

    # 4. Update the table to map over `processedLedger`
    table_body = """
                  <tbody className="divide-y divide-surface-container">
                    {processedLedger.map((shift, idx) => (
                      <tr key={shift.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-on-surface">{new Date(shift.dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}</td>
                        <td className="py-3.5 px-3"><span className={`px-2 py-0.5 rounded text-label-caps ${shift.ot > 0 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold' : 'bg-surface-container text-on-surface-variant'}`}>{shift.type}</span></td>
                        <td className="py-3.5 px-3 font-data-mono">{shift.clockIn}</td>
                        <td className="py-3.5 px-3 font-data-mono">{shift.clockOut}</td>
                        <td className="py-3.5 px-3 text-on-surface-variant">{shift.breakMins}m</td>
                        <td className="py-3.5 px-3 text-on-surface-variant">{formatMins(shift.grossMins)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono font-semibold text-primary">{shift.decHrs.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono">{shift.reg.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono text-tertiary">{shift.ot.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right font-data-mono font-semibold text-on-surface">${shift.pay.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-center">
                          <button onClick={() => setLedger(ledger.filter(s => s.id !== shift.id))} className="text-outline hover:text-error" type="button"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      </tr>
                    ))}
                    {processedLedger.length === 0 && (
                      <tr className="text-on-surface-variant/70">
                        <td colSpan={11} className="py-8 text-center">No shifts logged in the ledger.</td>
                      </tr>
                    )}
                  </tbody>
"""
    # Use regex to replace the old tbody
    content = re.sub(r'<tbody className="divide-y divide-surface-container">.*?</tbody>', table_body, content, flags=re.DOTALL)

    # Update summary footer
    content = re.sub(r'<td className="py-4 px-4 text-body-md" colSpan=\{6\}>.*?</td>', r'<td className="py-4 px-4 text-body-md" colSpan={6}>Weekly Gross Summary</td>', content, flags=re.DOTALL)
    content = re.sub(r'<td className="py-4 px-3 text-right font-data-mono text-primary text-body-md">\s*45\.50 h\s*</td>', r'<td className="py-4 px-3 text-right font-data-mono text-primary text-body-md">{totals.decHrs.toFixed(2)} h</td>', content)
    content = re.sub(r'<td className="py-4 px-3 text-right font-data-mono text-body-md">\s*39\.75 h\s*</td>', r'<td className="py-4 px-3 text-right font-data-mono text-body-md">{totals.regHrs.toFixed(2)} h</td>', content)
    content = re.sub(r'<td className="py-4 px-3 text-right font-data-mono text-tertiary text-body-md">\s*5\.75 h\s*</td>', r'<td className="py-4 px-3 text-right font-data-mono text-tertiary text-body-md">{totals.otHrs.toFixed(2)} h</td>', content)
    content = re.sub(r'<td className="py-4 px-4 text-right font-data-mono text-headline-md text-on-surface">\s*\$2,055\.94\s*</td>', r'<td className="py-4 px-4 text-right font-data-mono text-headline-md text-on-surface">${totals.grossPay.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>', content)

    content = re.sub(r'<button className="text-error hover:opacity-80" title="Clear All Rows" type="button">', r'<button onClick={() => setLedger([])} className="text-error hover:opacity-80" title="Clear All Rows" type="button">', content)
    
    # Update Footer Micro-Breakdown
    content = content.replace('$1,689.38 (39.75 hrs)', '${totals.regHrs > 0 ? (totals.grossPay - (totals.otHrs * (parseFloat(hourlyRate)||0) * 1.5)).toFixed(2) : "0.00"} ({totals.regHrs.toFixed(2)} hrs)')
    content = content.replace('+$366.56 (5.75 hrs @ 1.5x)', '+${(totals.otHrs * (parseFloat(hourlyRate)||0) * 1.5).toFixed(2)} ({totals.otHrs.toFixed(2)} hrs @ 1.5x)')
    content = content.replace('45h 30m', '{formatMins(totals.netMins)}')

    # Add select options values correctly
    content = content.replace('<option>None (0 Minutes)</option>', '<option value="0">None (0 Minutes)</option>')
    content = content.replace('<option>15 Minutes (Short rest - paid in some states)</option>', '<option value="15">15 Minutes (Short rest - paid in some states)</option>')
    content = content.replace('<option>30 Minutes (Standard meal break)</option>', '<option value="30">30 Minutes (Standard meal break)</option>')
    content = content.replace('<option value="45 Minutes (Enterprise lunch deduction)">45 Minutes (Enterprise lunch deduction)</option>', '<option value="45">45 Minutes (Enterprise lunch deduction)</option>')
    content = content.replace('<option>60 Minutes (Full hour break)</option>', '<option value="60">60 Minutes (Full hour break)</option>')
    content = content.replace('<option>Custom Minute Duration</option>', '<option value="0">Custom Minute Duration</option>')

    with open('/tmp/WorkHoursClient_new.tsx', 'w') as f:
        f.write(content)

process_file()
