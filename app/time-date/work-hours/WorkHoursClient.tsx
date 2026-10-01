'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import JSZip from 'jszip';

const CURRENCIES = [
  { symbol: '$', code: 'USD', label: 'USD ($)' },
  { symbol: '€', code: 'EUR', label: 'EUR (€)' },
  { symbol: '£', code: 'GBP', label: 'GBP (£)' },
  { symbol: 'CA$', code: 'CAD', label: 'CAD ($)' },
  { symbol: 'A$', code: 'AUD', label: 'AUD ($)' },
  { symbol: '₹', code: 'INR', label: 'INR (₹)' },
];

export default function WorkHoursClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };


  const [workDate, setWorkDate] = useState('2025-03-03');
  const [shiftCategory, setShiftCategory] = useState('Standard Day Shift (8:30 AM - 5:30 PM)');
  const [clockIn, setClockIn] = useState('08:30');
  const [clockOut, setClockOut] = useState('17:45');
  const [breakDuration, setBreakDuration] = useState('45');
  const [hourlyRate, setHourlyRate] = useState('42.50');
  const [otRule, setOtRule] = useState<'flsa' | 'ca'>('ca');
  const [activeTab, setActiveTab] = useState<'single' | 'ledger' | 'overtime' | 'payroll' | 'night' | 'freelance'>('ledger');

  const scrollToTab = (tab: 'single' | 'ledger' | 'overtime' | 'payroll' | 'night' | 'freelance') => {
    setActiveTab(tab);
    const elementId = `tab-section-${tab}`;
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  
  const [currency, setCurrency] = useState('USD');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  const getSymbol = () => {
    const found = CURRENCIES.find((c) => c.code === currency || c.symbol === currency);
    return found ? found.symbol : '$';
  };

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
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
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
    const text = processedLedger.map(s => `${s.dateStr} | ${s.type} | ${s.clockIn}-${s.clockOut} | ${s.decHrs.toFixed(2)} hrs | Pay: ${getSymbol()}${s.pay.toFixed(2)}`).join('\n');
    navigator.clipboard.writeText(`Timesheet:\n${text}\nTotal Reg: ${totals.regHrs.toFixed(2)}h | Total OT: ${totals.otHrs.toFixed(2)}h | Total Pay: ${getSymbol()}${totals.grossPay.toFixed(2)}`);
    alert('Timesheet copied to clipboard!');
  };

  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const showDownloadNotice = (msg: string) => {
    setDownloadNotification(msg);
    setTimeout(() => setDownloadNotification(null), 4000);
  };

  const downloadWeeklyTemplate = () => {
    const sym = getSymbol();
    const headers = [
      'Day',
      'Date',
      'Shift Description',
      'Clock In',
      'Clock Out',
      'Meal Break (Mins)',
      'Total Net Hours',
      'Regular Hours (Base)',
      'Overtime Hours (1.5x)',
      `Hourly Rate (${sym})`,
      `Gross Pay (${sym})`,
    ];
    const sampleRows = [
      ['Monday', '2025-03-03', 'Standard Day Shift', '08:30', '17:00', '30', '8.00', '8.00', '0.00', '42.50', '340.00'],
      ['Tuesday', '2025-03-04', 'Standard Day Shift', '08:30', '17:00', '30', '8.00', '8.00', '0.00', '42.50', '340.00'],
      ['Wednesday', '2025-03-05', 'Extended Overtime Shift', '08:00', '18:30', '60', '9.50', '8.00', '1.50', '42.50', '435.63'],
      ['Thursday', '2025-03-06', 'Standard Day Shift', '08:30', '17:00', '30', '8.00', '8.00', '0.00', '42.50', '340.00'],
      ['Friday', '2025-03-07', 'Standard Day Shift', '08:00', '16:30', '30', '8.00', '8.00', '0.00', '42.50', '340.00'],
      ['Saturday', '2025-03-08', 'Weekend Shift (All OT)', '09:00', '13:00', '0', '4.00', '0.00', '4.00', '42.50', '255.00'],
      ['Sunday', '2025-03-09', 'Scheduled Off', '-', '-', '0', '0.00', '0.00', '0.00', '42.50', '0.00'],
    ];

    const lines = [
      'SOLVEIT CALCULATOR - WEEKLY BI-FOLD TIMESHEET TEMPLATE',
      'Employee Name: _______________________, Employee ID: __________, Department: ____________________',
      `Pay Period: Monday to Sunday, Standard Workweek: 40.00 hrs, Overtime Standard: 1.5x Over 8h Daily / 40h Weekly, Currency: ${currency}`,
      '',
      headers.join(','),
      ...sampleRows.map(r => r.join(',')),
      '',
      'WEEKLY TOTALS,,,,,,,,,,',
      'Total Elapsed Hours: 45.50',
      'Regular Base Hours: 40.00',
      'Overtime Hours: 5.50',
      `Regular Gross Compensation: ${sym}1700.00`,
      `Overtime Gross Compensation: ${sym}350.63`,
      `TOTAL GROSS PAY: ${sym}2050.63`,
      '',
      'SIGN-OFF & VERIFICATION',
      'Employee Signature: ____________________________________ Date: ______________',
      'Supervisor Signature: __________________________________ Date: ______________',
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Weekly_BiFold_Timesheet_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showDownloadNotice('Weekly Bi-Fold Timesheet (.CSV) downloaded successfully!');
  };

  const generateBiweeklyHtml = () => {
    const sym = getSymbol();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Biweekly 80-Hour Corporate Timesheet & Audit Ledger</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.4; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    h1 { margin: 0; font-size: 22px; color: #0f172a; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; font-size: 13px; }
    .meta-box { background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    th { background: #f1f5f9; color: #334155; font-weight: 600; text-align: left; padding: 7px 10px; border: 1px solid #cbd5e1; }
    td { padding: 6px 10px; border: 1px solid #e2e8f0; }
    .text-right { text-align: right; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .summary-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin-bottom: 25px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .summary-item { font-size: 13px; }
    .summary-item strong { display: block; font-size: 16px; color: #0f172a; margin-top: 4px; }
    .signoff { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; font-size: 13px; }
    .sign-line { border-top: 1px solid #64748b; margin-top: 40px; padding-top: 5px; }
    @media print {
      body { margin: 15px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Biweekly 80-Hour Corporate Timesheet & Audit Ledger</h1>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">SolveIt Automated Payroll & Compliance Engine</div>
    </div>
    <div style="text-align: right; font-size: 12px;">
      <div><strong>Status:</strong> Verification Ready</div>
      <div><strong>Currency:</strong> ${currency} (${sym})</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-box"><strong>Employee Name:</strong> John Doe<br><strong>ID:</strong> EMP-84920<br><strong>Title:</strong> Senior Specialist</div>
    <div class="meta-box"><strong>Pay Period:</strong> 14 Days (80.00h Std)<br><strong>Start Date:</strong> 2025-03-03<br><strong>End Date:</strong> 2025-03-16</div>
    <div class="meta-box"><strong>Department:</strong> Operations & Tech<br><strong>Supervisor:</strong> S. Mitchell<br><strong>Base Rate:</strong> ${sym}42.50 / hr</div>
  </div>

  <h3 style="font-size: 14px; margin-bottom: 8px;">Week 1 Log</h3>
  <table>
    <thead>
      <tr>
        <th>Day</th><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Meal Break</th><th>Total Hrs</th><th>Reg Hrs</th><th>OT Hrs</th><th class="text-right">Pay (${sym})</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Mon</td><td>2025-03-03</td><td class="font-mono">08:30</td><td class="font-mono">17:00</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr><td>Tue</td><td>2025-03-04</td><td class="font-mono">08:30</td><td class="font-mono">17:00</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr><td>Wed</td><td>2025-03-05</td><td class="font-mono">08:00</td><td class="font-mono">18:30</td><td>60m</td><td class="font-mono">9.50</td><td class="font-mono">8.00</td><td class="font-mono">1.50</td><td class="text-right font-mono">${sym}435.63</td></tr>
      <tr><td>Thu</td><td>2025-03-06</td><td class="font-mono">08:30</td><td class="font-mono">17:00</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr><td>Fri</td><td>2025-03-07</td><td class="font-mono">08:00</td><td class="font-mono">16:30</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr style="color: #64748b;"><td>Sat</td><td>2025-03-08</td><td>—</td><td>—</td><td>0m</td><td>0.00</td><td>0.00</td><td>0.00</td><td class="text-right font-mono">${sym}0.00</td></tr>
      <tr style="color: #64748b;"><td>Sun</td><td>2025-03-09</td><td>—</td><td>—</td><td>0m</td><td>0.00</td><td>0.00</td><td>0.00</td><td class="text-right font-mono">${sym}0.00</td></tr>
    </tbody>
  </table>

  <h3 style="font-size: 14px; margin-bottom: 8px;">Week 2 Log</h3>
  <table>
    <thead>
      <tr>
        <th>Day</th><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Meal Break</th><th>Total Hrs</th><th>Reg Hrs</th><th>OT Hrs</th><th class="text-right">Pay (${sym})</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Mon</td><td>2025-03-10</td><td class="font-mono">08:30</td><td class="font-mono">17:00</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr><td>Tue</td><td>2025-03-11</td><td class="font-mono">08:30</td><td class="font-mono">17:00</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr><td>Wed</td><td>2025-03-12</td><td class="font-mono">08:30</td><td class="font-mono">17:30</td><td>30m</td><td class="font-mono">8.50</td><td class="font-mono">8.00</td><td class="font-mono">0.50</td><td class="text-right font-mono">${sym}371.88</td></tr>
      <tr><td>Thu</td><td>2025-03-13</td><td class="font-mono">08:30</td><td class="font-mono">17:00</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr><td>Fri</td><td>2025-03-14</td><td class="font-mono">08:00</td><td class="font-mono">16:30</td><td>30m</td><td class="font-mono">8.00</td><td class="font-mono">8.00</td><td class="font-mono">0.00</td><td class="text-right font-mono">${sym}340.00</td></tr>
      <tr style="color: #64748b;"><td>Sat</td><td>2025-03-15</td><td>—</td><td>—</td><td>0m</td><td>0.00</td><td>0.00</td><td>0.00</td><td class="text-right font-mono">${sym}0.00</td></tr>
      <tr style="color: #64748b;"><td>Sun</td><td>2025-03-16</td><td>—</td><td>—</td><td>0m</td><td>0.00</td><td>0.00</td><td>0.00</td><td class="text-right font-mono">${sym}0.00</td></tr>
    </tbody>
  </table>

  <div class="summary-box">
    <div class="summary-grid">
      <div class="summary-item">Total Biweekly Hours:<strong>82.00 hrs</strong></div>
      <div class="summary-item">Regular Base Hours:<strong>80.00 hrs</strong></div>
      <div class="summary-item">Overtime Hours (1.5x):<strong>2.00 hrs</strong></div>
      <div class="summary-item">Gross Pay:<strong>${sym}3,527.50</strong></div>
    </div>
  </div>

  <div class="signoff">
    <div>
      <div>Employee Affirmation: <em>I certify that the hours recorded above reflect all working time performed.</em></div>
      <div class="sign-line">Employee Signature & Date</div>
    </div>
    <div>
      <div>Supervisor Authorization: <em>I certify that all work was authorized and recorded per FLSA standards.</em></div>
      <div class="sign-line">Supervisor Signature & Date</div>
    </div>
  </div>
</body>
</html>`;
  };

  const downloadBiweeklyTemplate = () => {
    const htmlContent = generateBiweeklyHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Biweekly_80Hour_Corporate_Ledger.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showDownloadNotice('Biweekly 80-Hour Corporate Ledger (Printable HTML/PDF) downloaded!');
  };

  const downloadMonthlyInvoiceTemplate = () => {
    const sym = getSymbol();
    const headers = [
      'Line #',
      'Date',
      'Project Code',
      'Client Account',
      'Task / Milestone Scope',
      'Start Time',
      'End Time',
      'Duration (Decimal Hours)',
      `Hourly Rate (${sym})`,
      `Reimbursable Expenses (${sym})`,
      `Line Total (${sym})`,
    ];
    const sampleRows = [
      ['1', '2025-03-03', 'PRJ-ALPHA', 'Acme Global Corp', 'Initial Architecture Planning & Sprint Setup', '09:00', '12:30', '3.50', '85.00', '0.00', '297.50'],
      ['2', '2025-03-05', 'PRJ-ALPHA', 'Acme Global Corp', 'Core API Development & Database Setup', '10:00', '17:00', '6.00', '85.00', '25.00', '535.00'],
      ['3', '2025-03-10', 'PRJ-BETA', 'Starlight Logistics', 'Schema Migration & High-Density Indexing', '13:00', '17:30', '4.50', '95.00', '0.00', '427.50'],
      ['4', '2025-03-15', 'PRJ-BETA', 'Starlight Logistics', 'Performance Optimization & Benchmarking', '08:30', '16:30', '7.00', '95.00', '50.00', '715.00'],
      ['5', '2025-03-22', 'PRJ-GAMMA', 'Nova Healthcare Labs', 'Security Audit & Compliance Verification', '09:00', '15:00', '5.50', '110.00', '0.00', '605.00'],
      ['6', '2025-03-28', 'PRJ-GAMMA', 'Nova Healthcare Labs', 'Final Production Handover & QA Review', '10:00', '14:00', '4.00', '110.00', '0.00', '440.00'],
    ];

    const lines = [
      'SOLVEIT CONSULTING & FREELANCE INVOICING LEDGER (GOOGLE SHEETS / EXCEL COMPATIBLE)',
      'Consultant / Contractor: _______________________, Invoice ID: INV-2025-001, Invoice Date: 2025-03-31',
      `Client / Company: ______________________, Payment Terms: Net 30, Currency: ${currency}`,
      '',
      headers.join(','),
      ...sampleRows.map(r => r.join(',')),
      '',
      'FINANCIAL INVOICE SUMMARY,,,,,,,,,,',
      'Total Billable Hours: 30.50',
      `Total Consulting Services: ${sym}2944.50`,
      `Total Reimbursable Expenses: ${sym}75.00`,
      `Taxes / Deductions (0%): ${sym}0.00`,
      `TOTAL BALANCE DUE: ${sym}3019.50`,
      '',
      'Payment Remittance Instructions: Wire / Direct ACH due within 30 days of invoice date.',
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Monthly_Project_Invoicing_Ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showDownloadNotice('Monthly Project Invoicing Ledger (.CSV / Google Sheets) downloaded!');
  };

  const downloadAllTemplatesZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const sym = getSymbol();

      // 1. Weekly template
      const weeklyCsv = [
        'SOLVEIT CALCULATOR - WEEKLY BI-FOLD TIMESHEET TEMPLATE',
        'Employee Name: _______________________, Employee ID: __________, Department: ____________________',
        `Pay Period: Monday to Sunday, Standard Workweek: 40.00 hrs, Overtime Standard: 1.5x Over 8h Daily / 40h Weekly, Currency: ${currency}`,
        '',
        'Day,Date,Shift Description,Clock In,Clock Out,Meal Break (Mins),Total Net Hours,Regular Hours (Base),Overtime Hours (1.5x),Hourly Rate (' + sym + '),Gross Pay (' + sym + ')',
        'Monday,2025-03-03,Standard Day Shift,08:30,17:00,30,8.00,8.00,0.00,42.50,340.00',
        'Tuesday,2025-03-04,Standard Day Shift,08:30,17:00,30,8.00,8.00,0.00,42.50,340.00',
        'Wednesday,2025-03-05,Extended Overtime Shift,08:00,18:30,60,9.50,8.00,1.50,42.50,435.63',
        'Thursday,2025-03-06,Standard Day Shift,08:30,17:00,30,8.00,8.00,0.00,42.50,340.00',
        'Friday,2025-03-07,Standard Day Shift,08:00,16:30,30,8.00,8.00,0.00,42.50,340.00',
        'Saturday,2025-03-08,Weekend Shift (All OT),09:00,13:00,0,4.00,0.00,4.00,42.50,255.00',
        'Sunday,2025-03-09,Scheduled Off,-,-,0,0.00,0.00,0.00,42.50,0.00',
        '',
        'WEEKLY TOTALS,,,,,,,,,,',
        'Total Elapsed Hours: 45.50',
        'Regular Base Hours: 40.00',
        'Overtime Hours: 5.50',
        `Regular Gross Compensation: ${sym}1700.00`,
        `Overtime Gross Compensation: ${sym}350.63`,
        `TOTAL GROSS PAY: ${sym}2050.63`,
        '',
        'Employee Signature: ____________________________________ Date: ______________',
        'Supervisor Signature: __________________________________ Date: ______________',
      ].join('\r\n');
      zip.file('Weekly_BiFold_Timesheet_Template.csv', weeklyCsv);

      // 2. Biweekly HTML/PDF template
      const biweeklyHtml = generateBiweeklyHtml();
      zip.file('Biweekly_80Hour_Corporate_Ledger.html', biweeklyHtml);

      // 3. Monthly Invoice CSV
      const monthlyCsv = [
        'SOLVEIT CONSULTING & FREELANCE INVOICING LEDGER',
        'Consultant / Contractor: _______________________, Invoice ID: INV-2025-001, Invoice Date: 2025-03-31',
        `Client / Company: ______________________, Payment Terms: Net 30, Currency: ${currency}`,
        '',
        'Line #,Date,Project Code,Client Account,Task / Milestone Scope,Start Time,End Time,Duration (Decimal Hours),Hourly Rate (' + sym + '),Reimbursable Expenses (' + sym + '),Line Total (' + sym + ')',
        '1,2025-03-03,PRJ-ALPHA,Acme Global Corp,Initial Architecture Planning & Sprint Setup,09:00,12:30,3.50,85.00,0.00,297.50',
        '2,2025-03-05,PRJ-ALPHA,Acme Global Corp,Core API Development & Database Setup,10:00,17:00,6.00,85.00,25.00,535.00',
        '3,2025-03-10,PRJ-BETA,Starlight Logistics,Schema Migration & High-Density Indexing,13:00,17:30,4.50,95.00,0.00,427.50',
        '4,2025-03-15,PRJ-BETA,Starlight Logistics,Performance Optimization & Benchmarking,08:30,16:30,7.00,95.00,50.00,715.00',
        '5,2025-03-22,PRJ-GAMMA,Nova Healthcare Labs,Security Audit & Compliance Verification,09:00,15:00,5.50,110.00,0.00,605.00',
        '6,2025-03-28,PRJ-GAMMA,Nova Healthcare Labs,Final Production Handover & QA Review,10:00,14:00,4.00,110.00,0.00,440.00',
        '',
        'FINANCIAL INVOICE SUMMARY,,,,,,,,,,',
        'Total Billable Hours: 30.50',
        `Total Consulting Services: ${sym}2944.50`,
        `Total Reimbursable Expenses: ${sym}75.00`,
        `TOTAL BALANCE DUE: ${sym}3019.50`,
      ].join('\r\n');
      zip.file('Monthly_Project_Invoicing_Ledger.csv', monthlyCsv);

      // 4. Compliance guide
      const complianceGuide = `SOLVEIT PAYROLL & TIMESHEET AUDIT COMPLIANCE GUIDE
======================================================
1. FLSA Standard (29 U.S.C. § 207):
   - Overtime of at least 1.5x regular pay required for non-exempt hours worked over 40.0 in a 7-day workweek.
2. California Daily Overtime (CA Labor Code § 510):
   - 1.5x for hours worked beyond 8.0 up to 12.0 in a workday.
   - 2.0x (double time) for hours worked beyond 12.0 in a workday or after 8.0 on the 7th consecutive day.
3. Meal & Rest Break Deductions:
   - Rest periods under 20 minutes are compensable (paid).
   - Bona fide meal breaks (30+ minutes, relieved of all duties) are non-compensable (unpaid).
4. Decimal Hours Conversion Formula:
   - Decimal Hours = Hours + (Minutes / 60)
   - e.g., 8 hours 45 minutes = 8 + 0.75 = 8.75 decimal hours.
`;
      zip.file('Timesheet_Audit_Compliance_Guide.txt', complianceGuide);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SolveIt_Timesheet_Templates_Bundle.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showDownloadNotice('Complete Timesheet Templates ZIP package downloaded!');
    } catch (err) {
      console.error('Failed to create ZIP package', err);
      showDownloadNotice('Failed to generate ZIP package. Please download individual templates.');
    } finally {
      setIsZipping(false);
    }
  };

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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


  useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface">
      <main className="w-full pt-0 bg-surface min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-full">
          {/* SECTION 1: HERO & METROLOGY TELEMETRY */}
          <section className="w-full bg-surface-container-low/40 pb-space-2xl pt-space-lg border-b border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs font-body-sm text-body-sm text-on-surface-variant">
                  <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                  <span className="text-outline-variant">/</span>
                  <Link className="hover:text-primary transition-colors" href="/time-date">Time &amp; Date</Link>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface font-medium">Work Hours Calculator</span>
                </nav>
                <div className="flex items-center gap-space-xs font-data-mono text-[11px] text-on-surface-variant bg-surface-container px-3 py-1 rounded-full shadow-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                  <span>CALIBRATED: MAR 2025</span>
                  <span className="text-outline-variant">|</span>
                  <span>AUDIT: 100% DETERMINISTIC</span>
                  <span className="text-outline-variant">|</span>
                  <span>FLSA &amp; CA COMPLIANT</span>
                </div>
              </div>
              <div className="max-w-4xl mb-space-lg">
                <div className="inline-flex items-center gap-space-xs bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-2.5 py-1 rounded-full uppercase tracking-wider mb-space-sm">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  Precision Work Hours &amp; Timesheet Telemetry Workbench
                </div>
                <h1 className="font-headline-lg text-headline-lg md:text-[44px] md:leading-[52px] text-on-surface tracking-tight font-bold mb-space-sm">
                  Work Hours &amp; Timesheet Calculator
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                  Calculate exact regular work hours, overtime, gross earnings, itemized meal deductions, and take-home pay. Features weekly timesheet logs, night shift modulo math, and instant CSV export.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-xl">
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">shield</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">Private &amp; Secure</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Runs in Browser</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">bedtime</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">Overnight Modulo</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Cross-Midnight Safe</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[24px]">gavel</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">FLSA &amp; CA 8/12</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Overtime Standard</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[24px]">description</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">CSV &amp; PDF Export</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">One-Click Ledgers</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
                <button onClick={() => scrollToTab('single')} className={`font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${activeTab === 'single' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-[16px]">schedule</span> Single Shift
                </button>
                <button onClick={() => scrollToTab('ledger')} className={`font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${activeTab === 'ledger' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-[16px]">calendar_view_week</span> Weekly Timesheet
                </button>
                <button onClick={() => scrollToTab('payroll')} className={`font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${activeTab === 'payroll' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-[16px]">analytics</span> Visual Analytics
                </button>
                <button onClick={() => scrollToTab('night')} className={`font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${activeTab === 'night' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-[16px]">bedtime</span> Night Shifts
                </button>
                <button onClick={() => scrollToTab('overtime')} className={`font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${activeTab === 'overtime' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-[16px]">gavel</span> Overtime Rules
                </button>
                <button onClick={() => scrollToTab('freelance')} className={`font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${activeTab === 'freelance' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-[16px]">description</span> Templates
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2 & 3: ERGONOMIC SHIFT CALCULATOR + FOCAL LIVE METRICS */}
          <section id="tab-section-single" className="w-full py-space-2xl bg-surface scroll-mt-28">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              {/* LEFT WORKBENCH: QUICK LOG PANEL (7 COLS) */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                <div className="flex items-center justify-between pb-space-sm">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Shift Configuration Workbench</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Configure parameters to calculate immediate hours and append to the ledger.</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-surface-container p-1 text-label-caps hidden sm:flex">
                    <button className={`px-2.5 py-1 rounded ${timeFormat === "12h" ? "bg-surface text-primary font-medium shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} type="button" onClick={() => setTimeFormat("12h")}>12-Hour</button>
                    <button className={`px-2.5 py-1 rounded ${timeFormat === "24h" ? "bg-surface text-primary font-medium shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} type="button" onClick={() => setTimeFormat("24h")}>24-Hour Military</button>
                  </div>
                </div>
                {/* Shift form grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Work Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Work Date</label>
                    <div className="flex items-center gap-2">
                      <input className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface" type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
                      <button className="px-2.5 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-primary hover:bg-surface-container-high" type="button" onClick={setToday}>Today</button>
                    </div>
                  </div>
                  {/* Shift Pattern Preset */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Shift Category</label>
                    <select className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface" value={shiftCategory} onChange={(e) => setShiftCategory(e.target.value)}>
                      <option value="Standard Day Shift (8:30 AM - 5:30 PM)">Standard Day Shift (8:30 AM - 5:30 PM)</option>
                      <option value="Night / Graveyard (Overnight 10 PM - 6:30 AM)">Night / Graveyard (Overnight 10 PM - 6:30 AM)</option>
                      <option value="2-2-3 Compressed Workweek (12-hr)">2-2-3 Compressed Workweek (12-hr)</option>
                      <option value="Split Shift (Dual clock-in morning/evening)">Split Shift (Dual clock-in morning/evening)</option>
                    </select>
                  </div>
                  {/* Clock In */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Clock In Time</label>
                      <span className="text-label-caps text-secondary font-medium">Session Start</span>
                    </div>
                    <div className="relative">
                      <input className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-data-mono text-on-surface focus:outline-none focus:bg-surface" type="time" value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
                    </div>
                  </div>
                  {/* Clock Out */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Clock Out Time</label>
                      <span className="inline-flex items-center gap-1 text-label-caps text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                        +9h 15m gross
                      </span>
                    </div>
                    <div className="relative">
                      <input className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-data-mono text-on-surface focus:outline-none focus:bg-surface" type="time" value={clockOut} onChange={(e) => setClockOut(e.target.value)} />
                    </div>
                  </div>
                  {/* Break Duration Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Unpaid Meal Deduction</label>
                      <span className="text-label-caps text-on-surface-variant">FLSA &gt;20m Unpaid</span>
                    </div>
                    <select className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface" value={breakDuration} onChange={(e) => setBreakDuration(e.target.value)}>
                      <option value="None (0 Minutes)">None (0 Minutes)</option>
                      <option value="15 Minutes (Short rest - paid in some states)">15 Minutes (Short rest - paid in some states)</option>
                      <option value="30 Minutes (Standard meal break)">30 Minutes (Standard meal break)</option>
                      <option value="45">45 Minutes (Enterprise lunch deduction)</option>
                      <option value="60 Minutes (Full hour break)">60 Minutes (Full hour break)</option>
                      <option value="Custom Minute Duration">Custom Minute Duration</option>
                    </select>
                  </div>
                  {/* Hourly Pay Rate */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Base Hourly Rate</label>
                      <select
                        id="currency-selector"
                        aria-label="Currency Selector"
                        className="bg-surface-container-low text-on-surface font-label-caps text-label-caps px-2 py-1 rounded cursor-pointer border border-outline-variant/30 focus:outline-none focus:bg-surface"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-on-surface-variant font-data-mono">{getSymbol()}</span>
                      <input className="w-full pl-7 pr-12 bg-surface-container-low rounded-lg py-2 text-body-md font-data-mono text-on-surface focus:outline-none focus:bg-surface" step="0.50" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                      <span className="absolute right-3 text-on-surface-variant font-body-sm">/ hr</span>
                    </div>
                  </div>
                  {/* Overtime Rule Multiplier */}
                  <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Overtime Regulatory Standard</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all">
                        <input checked={otRule === "flsa"} onChange={() => setOtRule("flsa")} className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio" />
                        <div className="flex flex-col">
                          <span className="font-body-sm font-semibold text-on-surface">Standard Federal FLSA</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">1.5x pay on hours in excess of 40 hrs / workweek</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all">
                        <input checked={otRule === "ca"} onChange={() => setOtRule("ca")} className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio" />
                        <div className="flex flex-col">
                          <span className="font-body-sm font-semibold text-on-surface">California Daily Rule</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">1.5x after 8 hrs/day; 2.0x double-time after 12 hrs/day</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* Quick Actions Button Row */}
                <div className="pt-space-sm flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-body-md font-medium shadow-sm hover:opacity-95 transition-all" type="button" onClick={addShiftToLedger}>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    Compute Shift &amp; Add to Ledger
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-body-sm" type="button" onClick={() => { setWorkDate(new Date().toISOString().split('T')[0]); setClockIn("08:30"); setClockOut("17:45"); setBreakDuration("45"); setHourlyRate("42.50"); setShiftCategory("Standard Day Shift (8:30 AM - 5:30 PM)"); }}>
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    Reset Times
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-body-sm" type="button" onClick={addShiftToLedger}>
                    <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                    Quick Save Shift
                  </button>
                </div>
              </div>
              {/* RIGHT DASHBOARD: LIVE METRIC RESULT TILES (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col gap-space-md justify-between">
                {/* CARD 1: FOCAL TOTAL PAID HOURS */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Total Paid Hours Today</span>
                    <span className="inline-flex items-center gap-1 text-label-caps px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Live Shift Result
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-numerical-display text-numerical-display text-primary">{formatMins(liveShift.netMins)}</span>
                    <span className="font-data-mono text-body-lg text-on-surface-variant font-medium">({liveShift.decHrs.toFixed(2)} Dec)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-body-sm text-on-surface-variant">
                    <span>Gross Span: <strong className="text-on-surface">{formatMins(liveShift.grossMins)}</strong></span>
                    <span>Unpaid Break: <strong className="text-error">-{breakDuration}m</strong></span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                {/* CARD 2: REGULAR VS OVERTIME SPLIT */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm grid grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Regular Hours (1.0x)</span>
                    <span className="font-headline-md text-headline-md text-on-surface">{liveShift.reg.toFixed(2)} hrs</span>
                    <span className="font-data-mono text-body-sm text-secondary font-medium">{getSymbol()}{(liveShift.reg * (parseFloat(hourlyRate)||0)).toFixed(2)} base</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Daily Overtime (1.5x)</span>
                    <span className="font-headline-md text-headline-md text-tertiary">{liveShift.ot.toFixed(2)} hrs</span>
                    <span className="font-data-mono text-body-sm text-tertiary font-medium">{getSymbol()}{(liveShift.ot * (parseFloat(hourlyRate)||0) * 1.5).toFixed(2)} @ {getSymbol()}{(parseFloat(hourlyRate) * 1.5 || 0).toFixed(2)}/hr</span>
                  </div>
                </div>
                {/* CARD 3: GROSS EARNINGS COMPUTATION */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Estimated Daily Gross Payout</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Net of 45m Break</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-numerical-display text-numerical-display text-on-surface">{getSymbol()}{liveShift.pay.toFixed(2)}</span>
                    <span className="font-body-sm text-on-surface-variant font-medium">gross total</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Effective Blended Rate: <span className="font-data-mono font-medium text-on-surface">{getSymbol()}{liveShift.decHrs > 0 ? (liveShift.pay / liveShift.decHrs).toFixed(2) : "0.00"} / hr</span> across {liveShift.decHrs.toFixed(2)} billed hours
                  </p>
                </div>
                {/* CARD 4: WEEKLY ACCUMULATOR STATUS */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Weekly Standard Accumulator</span>
                    <span className="font-data-mono text-body-sm text-primary font-semibold">{totals.decHrs.toFixed(2)} / 40.00 hrs</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full rounded-l-full" style={{ width: '96.2%' }}></div>
                    <div className="bg-surface-container h-full" style={{ width: '3.8%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">{Math.min(100, (totals.decHrs / 40) * 100).toFixed(1)}% of regular week reached</span>
                    <span className="text-tertiary font-medium">{Math.max(0, 40 - totals.decHrs).toFixed(2)} hrs to weekly OT trigger</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* SECTION 4: INTERACTIVE WEEKLY TIMESHEET LEDGER TABLE */}
          <section id="tab-section-ledger" className="w-full py-space-2xl bg-surface-container-low/40 scroll-mt-28 border-t border-b border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              {/* Table Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Weekly Timesheet Ledger</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps">Week 10 • March 2025</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Standard engineering shift log with automatic deduction, overtime stratification, and total billable pay calculation.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-on-surface hover:bg-surface-container-high transition-all" type="button" onClick={scrollToForm}>
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Add Shift Row
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-body-sm font-medium text-on-primary hover:opacity-95 shadow-sm transition-all" type="button" onClick={exportCSV}>
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Export CSV
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-on-surface hover:bg-surface-container-high transition-all" type="button" onClick={printSheet}>
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    Print Sheet
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-on-surface hover:bg-surface-container-high transition-all" type="button" onClick={copySheet}>
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>
              {/* Ledger Table */}
              <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Day &amp; Date</th>
                      <th className="py-3.5 px-3">Shift Type</th>
                      <th className="py-3.5 px-3">Clock In</th>
                      <th className="py-3.5 px-3">Clock Out</th>
                      <th className="py-3.5 px-3">Break</th>
                      <th className="py-3.5 px-3">Elapsed</th>
                      <th className="py-3.5 px-3 text-right">Paid (Dec)</th>
                      <th className="py-3.5 px-3 text-right">Reg Hrs</th>
                      <th className="py-3.5 px-3 text-right">OT Hrs</th>
                      <th className="py-3.5 px-4 text-right">Gross Pay</th>
                      <th className="py-3.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-surface-container">
                    {processedLedger.map((shift, idx) => (
                      <tr key={shift.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-on-surface">{new Date(shift.dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}</td>
                        <td className="py-3.5 px-3"><span className={`px-2 py-0.5 rounded text-label-caps ${shift.ot > 0 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold' : 'bg-surface-container text-on-surface-variant'}`}>{shift.type}</span></td>
                        <td className="py-3.5 px-3 font-data-mono">{displayTime(shift.clockIn)}</td>
                        <td className="py-3.5 px-3 font-data-mono">{displayTime(shift.clockOut)}</td>
                        <td className="py-3.5 px-3 text-on-surface-variant">{shift.breakMins}m</td>
                        <td className="py-3.5 px-3 text-on-surface-variant">{formatMins(shift.grossMins)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono font-semibold text-primary">{shift.decHrs.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono">{shift.reg.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono text-tertiary">{shift.ot.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right font-data-mono font-semibold text-on-surface">{getSymbol()}{shift.pay.toFixed(2)}</td>
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

                  {/* Summary Footers */}
                  <tfoot className="bg-surface-container-high font-semibold text-on-surface">
                    <tr>
                      <td className="py-4 px-4 text-body-md" colSpan={6}>Weekly Gross Summary</td>
                      <td className="py-4 px-3 text-right font-data-mono text-primary text-body-md">{totals.decHrs.toFixed(2)} h</td>
                      <td className="py-4 px-3 text-right font-data-mono text-body-md">{totals.regHrs.toFixed(2)} h</td>
                      <td className="py-4 px-3 text-right font-data-mono text-tertiary text-body-md">{totals.otHrs.toFixed(2)} h</td>
                      <td className="py-4 px-4 text-right font-data-mono text-headline-md text-on-surface">{getSymbol()}{totals.grossPay.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="py-4 px-3 text-center">
                        <button onClick={() => setLedger([])} className="text-error hover:opacity-80" title="Clear All Rows" type="button">
                          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* Footer Micro-Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="p-3.5 rounded-lg bg-surface-container-lowest flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Regular Pay Allocation:</span>
                  <span className="font-data-mono font-semibold text-on-surface">{getSymbol()}{totals.regHrs > 0 ? (totals.grossPay - (totals.otHrs * (parseFloat(hourlyRate)||0) * 1.5)).toFixed(2) : "0.00"} ({totals.regHrs.toFixed(2)} hrs)</span>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-lowest flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Overtime Pay Bonus:</span>
                  <span className="font-data-mono font-semibold text-tertiary">+{getSymbol()}{(totals.otHrs * (parseFloat(hourlyRate)||0) * 1.5).toFixed(2)} ({totals.otHrs.toFixed(2)} hrs @ 1.5x)</span>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-lowest flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Total Billable Time:</span>
                  <span className="font-data-mono font-semibold text-primary">{formatMins(totals.netMins)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 & 6: ADVANCED VISUAL WORKFORCE ANALYTICS & PRODUCTIVITY HEATMAP */}
          <section id="tab-section-payroll" className="w-full py-space-2xl bg-surface scroll-mt-28">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-xl">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">analytics</span>
                  DYNAMIC WORKFORCE AUDIT
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Weekly Visual Analytics &amp; Temporal Distribution</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Instant graphical telemetry of daily effort thresholds, overtime triggers, and working session clusters.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* VISUAL 1: Daily Working Hours vs 8h Target (Stacked Bar Chart SVG) - 7 cols */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Daily Work Hours vs 8.0h Baseline</span>
                      <span className="font-headline-md text-headline-md text-on-surface">Daily Capacity Stack</span>
                    </div>
                    <div className="flex items-center gap-3 text-body-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-primary"></span> Regular (≤8h)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-tertiary"></span> Overtime (&gt;8h / Weekend)
                      </span>
                    </div>
                  </div>
                  {/* Inline SVG Bar Chart */}
                  <div className="w-full pt-4">
                    <svg className="w-full h-52 text-on-surface" fill="none" preserveAspectRatio="none" viewBox="0 0 540 180">
                      {/* Target 8h horizontal guideline */}
                      <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.2" strokeWidth="1.5" x1="30" x2="520" y1="65" y2="65"></line>
                      <text fill="currentColor" fillOpacity="0.5" fontFamily="Inter" fontSize="11" fontWeight="600" x="475" y="60">8.0h Standard</text>
                      {/* Mon (8.25h: 8.0 reg + 0.25 OT) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="50" y="65"></rect>
                      <rect className="fill-tertiary" height="5" rx="2" width="40" x="50" y="60"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="60" y="175">Mon</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="56" y="52">8.25h</text>
                      {/* Tue (8.00h: 8.0 reg) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="125" y="65"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="135" y="175">Tue</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="131" y="56">8.00h</text>
                      {/* Wed (9.50h: 8.0 reg + 1.5 OT) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="200" y="65"></rect>
                      <rect className="fill-tertiary" height="30" rx="4" width="40" x="200" y="35"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="207" y="175">Wed</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="204" y="27">9.50h</text>
                      {/* Thu (8.00h: 8.0 reg) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="275" y="65"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="285" y="175">Thu</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="281" y="56">8.00h</text>
                      {/* Fri (7.75h: 7.75 reg) */}
                      <rect className="fill-primary" height="90" rx="4" width="40" x="350" y="70"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="363" y="175">Fri</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="356" y="60">7.75h</text>
                      {/* Sat (4.00h: all OT) */}
                      <rect className="fill-tertiary" height="48" rx="4" width="40" x="425" y="112"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="437" y="175">Sat</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="431" y="103">4.00h</text>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container text-body-sm text-on-surface-variant">
                    <span>Weekly standard target: <strong>40.00h</strong></span>
                    <span>Recorded paid hours: <strong className="text-primary">45.50h (+13.7%)</strong></span>
                  </div>
                </div>
                {/* VISUAL 2: Weekly Time Allocation Donut Chart & Productivity Split - 5 cols */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">7-Day Gross Span Allocation</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Time Allocation Ratio</h3>
                  </div>
                  <div className="flex items-center justify-center gap-6 py-2">
                    {/* Inline SVG Donut Chart */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#eaedff" strokeWidth="12"></circle>
                        {/* Productive Billable: 82% (circumference ~ 238.76) => 195.8 stroke */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#004ac6" strokeDasharray="195.8 238.76" strokeDashoffset="0" strokeLinecap="round" strokeWidth="12"></circle>
                        {/* Overtime Sprint: 11% => 26.2 stroke */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#943700" strokeDasharray="26.2 238.76" strokeDashoffset="-195.8" strokeWidth="12"></circle>
                        {/* Meal Deductions: 7% => 16.7 stroke */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#737686" strokeDasharray="16.7 238.76" strokeDashoffset="-222.0" strokeWidth="12"></circle>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface">82%</span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Billable</span>
                      </div>
                    </div>
                    {/* Legend breakdown */}
                    <div className="flex flex-col gap-2.5 font-body-sm text-body-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                        <span className="text-on-surface font-medium">Regular: 39.75h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                        <span className="text-on-surface font-medium">Overtime: 5.75h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                        <span className="text-on-surface font-medium">Meal Deduct: 3.50h</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container text-body-sm text-on-surface">
                    <span className="font-semibold text-primary">High Efficiency Score:</span> 93% of clocked on-site duration constituted directly compensated engineering output.
                  </div>
                </div>
                {/* VISUAL 4: Shift Clock Heatmap across 24 hours of the day (12 cols) */}
                <div className="lg:col-span-12 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Temporal Intensity Matrix</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Daily Shift Coverage Heatmap (24-Hour Distribution)</h3>
                    </div>
                    <div className="flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
                      <span>Low</span>
                      <span className="w-3 h-3 rounded-sm bg-surface-container"></span>
                      <span className="w-3 h-3 rounded-sm bg-primary-fixed"></span>
                      <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
                      <span className="w-3 h-3 rounded-sm bg-primary"></span>
                      <span>High Intensity (Peak: 10:00 - 15:00)</span>
                    </div>
                  </div>
                  {/* Heatmap 24h Blocks */}
                  <div className="grid grid-cols-12 md:grid-cols-24 gap-1 pt-2">
                    {/* 00 to 05 AM */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">00</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">01</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">02</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">03</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">04</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">05</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">06</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">07</span>
                    </div>
                    {/* 08 to 17 PM (Core Working Hours) */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-fixed"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">08</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">09</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">10</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">11</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">12</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">13</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">14</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">15</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">16</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-fixed"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">17</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-tertiary-fixed"></div>
                      <span className="font-data-mono text-[10px] text-tertiary font-bold">18</span>
                    </div>
                    {/* 19 to 23 PM */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">19</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">20</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">21</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">22</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: CROSS-MIDNIGHT & COMPLEX SHIFT ENGINE (ALGORITHM DEMO) */}
          <section id="tab-section-night" className="w-full py-space-2xl bg-surface-container-low/40 scroll-mt-28 border-t border-b border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              <div className="p-space-lg rounded-xl bg-surface-container-highest/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">nightlight_round</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Algorithmic Innovation</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Automated Cross-Midnight &amp; Graveyard Shift Modulo Math</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                      Traditional spreadsheets fail when clock-out times precede clock-in numbers (e.g., 10:00 PM to 06:30 AM), triggering negative durations. SolveIt executes modular temporal arithmetic automatically.
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-surface-container-lowest shadow-sm font-data-mono text-body-sm text-primary font-bold">
                  t_out &lt; t_in ? (t_out + 24) - t_in : t_out - t_in
                </div>
              </div>
              {/* Live Overnight Interactive Sandbox */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overnight Shift Step 1</span>
                  <div className="font-body-md font-semibold text-on-surface">Night Shift Clock-In</div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low font-data-mono">
                    <span>Day 1 • 10:00 PM</span>
                    <span className="text-on-surface-variant">22.000 hrs</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Operator initiates graveyard production cycle on Monday night.</p>
                </div>
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overnight Shift Step 2</span>
                  <div className="font-body-md font-semibold text-on-surface">Midnight Rollover &amp; Clock-Out</div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low font-data-mono">
                    <span>Day 2 • 06:30 AM</span>
                    <span className="text-primary font-semibold">06.500 hrs (+24.0)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Rollover adjusted to 30.500 normalized hours before subtraction.</p>
                </div>
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overnight Shift Step 3</span>
                  <div className="font-body-md font-semibold text-on-surface">Net Paid Computation</div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container font-data-mono">
                    <span className="text-primary font-bold">8h 00m Net</span>
                    <span className="text-on-surface-variant">-30m Unpaid</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Result: 8.50 gross hrs - 0.50 break = exactly 8.00 paid hours. Zero payroll error.</p>
                </div>
              </div>
            </div>
          </section>
          {/* SECTION 8: FLSA OVERTIME & PAYROLL TIER AUDITOR */}
          <section id="tab-section-overtime" className="w-full py-space-2xl bg-surface scroll-mt-28">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">gavel</span>
                  STATUTORY LABOR STANDARDS
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">FLSA Overtime Rules &amp; Tier Architectures</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">SolveIt’s calculation engines are configured to cross-validate against US Department of Labor Fair Labor Standards Act benchmarks.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* CARD A: FLSA STANDARD */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold">1</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Federal FLSA Standard</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Applies across 46 US states. Overtime is triggered strictly when an employee exceeds <strong>40.0 hours</strong> within a 7-consecutive-day defined workweek at 1.5x regular pay.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-primary font-semibold">Threshold: &gt;40h / week</div>
                </div>
                {/* CARD B: CALIFORNIA DAILY OVERTIME */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">2</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">California Daily 8 / 12</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      California, Alaska, and Nevada enforce daily caps: 1.5x after <strong>8 daily hours</strong>, and 2.0x double-time after <strong>12 daily hours</strong>, plus 7th consecutive workday rules.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-tertiary font-semibold">Tier 1: &gt;8h | Tier 2: &gt;12h</div>
                </div>
                {/* CARD C: BLENDED WEIGHTED AVERAGE */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center font-bold">3</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Weighted Blended OT</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      When an employee works multiple roles at different base rates (e.g., $30/hr day, $45/hr on-call), total regular earnings are divided by total hours to determine regular rate before 0.5x bonus.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-secondary font-semibold">Formula: Total Pay / Total Hrs</div>
                </div>
                {/* CARD D: COMP TIME RESTRICTIONS */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold">4</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Compensatory Time</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Private sector employers cannot legally substitute "comp time off" in lieu of cash overtime pay under FLSA 29 U.S.C. § 207(o). Only public government agencies may offer comp time.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-on-surface-variant font-semibold">Private vs Public Sector</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: REAL-WORLD EMPLOYMENT PERSONAS & SCENARIOS (WITH IMAGES) */}
          <section className="w-full py-space-2xl bg-surface-container-low/40 border-t border-b border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                  WORKFORCE ARCHETYPES
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Precision Metrology Across Real-World Disciplines</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">How different industry professionals configure SolveIt to capture billable accuracy.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* PERSONA 1: SOFTWARE ENGINEER */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <div className="relative w-full h-44">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyt0GeKVryhuZwdTQB_yYgZ0TOIX3IFvRya9YIcYV4teoI_DerdUDUgGsS6WYnaFMAhzA9vVidkFBQ8ZIlSRJ6NNeRqkQxkfUHvEw0JMRPwjrMFYdkQ9iGBjpZXyA6_OxcjzrJ-I2oejqzDSBELh0YFFpQPF09qFFLQ5LI_lk3oTMxZ7q8KAUsw0TgeWiuhNhFj-Ip0cjYaoberERjhw0vFqlCHbf5U-0ASihNUTq2hQJCUzzsPB7I" alt="Professional software engineer" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-primary uppercase">Tech &amp; Engineering</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Devin K. — Senior SRE</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Exempt salary with incident on-call stipends. Uses the 15-minute rounding tool to track weekend triage outages and invoice secondary engineering consultation.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Avg Shift:</span>
                      <span className="font-data-mono font-medium text-on-surface">8.25h • Flexible</span>
                    </div>
                  </div>
                </div>
                {/* PERSONA 2: ICU NURSE */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <div className="relative w-full h-44">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5RDIeRtjPbzSqHcjZQf8sWrx09xhqwQ6b8ftun9iCCsE2hxmmsC52Kqk-VHDsJf-DfdYZfLCGjfnjOCt2t-BLYSB8s6jEsBDx284Mysxlqyu0lOZYjboGvcDamjdiNYImZu0qAx0jClWrjBOe-IiyJj5-3BZ4_eLZGmeF7x1JYzPBPVil5NkBdeifYn6I76Fu9_oFwXKbDpfiqgL49aPiQ59NA-H1-JJwOj6pjAvmK36Rmn_gaVSC" alt="Healthcare clinical specialist" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-tertiary uppercase">Clinical Healthcare</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Maria S. — Travel ICU Nurse</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      12-hour rotating night shifts (7:00 PM to 7:30 AM) across 3 compressed workdays. Relies on midnight modulo arithmetic and California daily 2.0x overtime threshold.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Night Differential:</span>
                      <span className="font-data-mono font-medium text-tertiary">+15% Premium</span>
                    </div>
                  </div>
                </div>
                {/* PERSONA 3: FREELANCE CONSULTANT */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <div className="relative w-full h-44">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGCsWITqRGtkpTMfW_0-qoHiQ2gE_xlXi6miZC4kER8fUXjaD8kPYsoPZQhYW-iBmSTaPhnM74Ul_kZ_5LZBO0cOCPrr1dymPku488KxY00ZT-jGPiMmBRtWFrjYClWd4MjFI7CGytaXNawivzdhyUKOad4PTYjsU35i5oS_jrCB0Voys3pstMHGVXbmrsD1xiSdhAX4T-SgMuGo-Cqx_SnYH5S_n94rx_a7PjwQudzbwN9o7-JTl8" alt="Architectural and brand designer" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-secondary uppercase">Independent Advisory</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Alex P. — Brand Strategist</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Logs multiple micro-engagements across 4 concurrent clients. Converts sexagesimal task chunks (1h 12m) to exact decimals (1.20h) for flawless QuickBooks invoicing.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Billable Rate:</span>
                      <span className="font-data-mono font-medium text-secondary">$135.00 / hr</span>
                    </div>
                  </div>
                </div>
                {/* PERSONA 4: RETAIL SUPERVISOR */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <div className="relative w-full h-44">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsttEfNY8E8pBd1tCOH2Bsr7y_waTLYwXyBoFoT4Qcs1pKKuj8FOAM0i7SGobpp4iZGTuk0CMEJN0J8maYZaVbRmlheg7HbpQ3UnJN2CnZnNT6WmURA5kJt8Rbj0F-9D3OzEdhzD8coxSO65tdZ14QB1rgb5dkd1i_HtG9vHZaRCrdmSM1xLAqz8PHydKYWBDR2ysK3sprCkxJnMllDxKRK8U-KeIfHQPJwdYRi2VsJ84zwyWs3c1N" alt="Logistics team leader" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-on-surface uppercase">Operations &amp; Retail</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Marcus R. — Store Lead</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Split shifts during peak inventory weeks. Audits team clock-in timecard anomalies and enforces mandatory 30-minute state meal break compliance.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Compliance:</span>
                      <span className="font-data-mono font-medium text-on-surface">Meal-Audit Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 10: DOWNLOADABLE TIMESHEET TEMPLATES & EXPORT CENTER */}
          <section id="tab-section-freelance" className="w-full py-space-2xl bg-surface scroll-mt-28">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                    <span className="material-symbols-outlined text-[14px]">description</span>
                    PAYROLL ASSETS
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Downloadable Timesheet Templates &amp; Audit Forms</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Pre-formatted corporate timesheet ledger assets ready for Excel, Google Sheets, and PDF dispatch.</p>
                </div>
                <button 
                  onClick={downloadAllTemplatesZip} 
                  disabled={isZipping}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:opacity-95 shadow-sm font-body-sm font-medium transition-all disabled:opacity-50 cursor-pointer" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">{isZipping ? 'hourglass_top' : 'folder_zip'}</span>
                  {isZipping ? 'Generating Package (.ZIP)...' : 'Download All Templates (.ZIP)'}
                </button>
              </div>

              {downloadNotification && (
                <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 text-body-sm text-primary font-medium animate-fadeIn">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>{downloadNotification}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4 border border-surface-container/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">table_view</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Weekly Bi-Fold Timesheet</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Standard Monday-Sunday spreadsheet with automated overtime formulas and meal break deductions.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm pt-3 border-t border-surface-container">
                    <span className="text-on-surface-variant">Format: <strong>XLSX, CSV</strong></span>
                    <button 
                      onClick={downloadWeeklyTemplate}
                      className="text-primary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                      type="button"
                    >
                      Download CSV <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4 border border-surface-container/60 hover:border-secondary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Biweekly 80-Hour Corporate Ledger</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">High-density 14-day payroll verification document with supervisor approval and employee sign-off lines.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm pt-3 border-t border-surface-container">
                    <span className="text-on-surface-variant">Format: <strong>Printable PDF / HTML</strong></span>
                    <button 
                      onClick={downloadBiweeklyTemplate}
                      className="text-secondary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                      type="button"
                    >
                      Download HTML/PDF <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4 border border-surface-container/60 hover:border-tertiary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Monthly Project Invoicing Ledger</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Consulting timesheet itemizing client project codes, decimal durations, expense reimbursements, and tax.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm pt-3 border-t border-surface-container">
                    <span className="text-on-surface-variant">Format: <strong>Sheets / CSV</strong></span>
                    <button 
                      onClick={downloadMonthlyInvoiceTemplate}
                      className="text-tertiary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                      type="button"
                    >
                      Download Sheet <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 11: MATHEMATICAL RIGOR & TIME ARITHMETIC PRIMER */}
          <section className="w-full py-space-2xl bg-surface-container-low/40 border-t border-b border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">functions</span>
                  METROLOGICAL FOUNDATION
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Time Arithmetic &amp; Decimal Conversion Formulas</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">The mathematical principles governing computerized payroll calculation and rounding laws.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Formula 1: Sexagesimal to Decimal */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Conversion 01</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Sexagesimal to Decimal</h3>
                  <div className="p-3 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface">
                    Decimal Hours = H + (M / 60) + (S / 3600)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Example: 8 hours and 45 minutes = 8 + (45/60) = 8 + 0.75 = <strong>8.75 decimal hours</strong>. Essential because payroll engines cannot multiply sexagesimal minutes directly by hourly wage.
                  </p>
                </div>
                {/* Formula 2: FLSA 7-Minute Rounding Rule */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-semibold">Rule 02</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">7-Minute FLSA Rounding</h3>
                  <div className="p-3 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface">
                    1-7 min → 0 min | 8-14 min → 15 min (.25h)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    29 C.F.R. § 785.48(b) permits 15-minute increment rounding provided it operates neutrally: minutes 1 through 7 round down to the nearest quarter hour, while minutes 8 through 14 round up.
                  </p>
                </div>
                {/* Formula 3: Gross Pay Distribution */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">Formula 03</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Gross Overtime Distribution</h3>
                  <div className="p-3 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface">
                    Gross = (H_reg × R) + (H_ot × 1.5R) + (H_dt × 2R)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Multi-tier gross calculation separates regular hours from statutory multipliers before appending weekend differentials or discretionary bonuses.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 12: FREQUENTLY ASKED QUESTIONS */}
          <section className="w-full py-space-2xl bg-surface">
            <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              <div className="text-center flex flex-col items-center">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Comprehensive Guide</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Frequently Asked Questions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Detailed answers on federal labor standards, decimal payroll conversion, and privacy assurances.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>How does decimal hour conversion work for payroll calculations?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Standard time is based on 60 minutes per hour (sexagesimal), but payroll calculations require standard base-10 decimals. To convert minutes into decimal hours, divide the minute count by 60. For instance, 15 minutes is 0.25 hours, 30 minutes is 0.50 hours, and 45 minutes is 0.75 hours. SolveIt executes this transformation automatically in real time to guarantee that multiplying decimal hours by your hourly rate produces 100% mathematically exact payroll figures.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>Does federal law require employers to pay for short breaks under 20 minutes?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Yes. Under US Federal Fair Labor Standards Act regulations (29 C.F.R. § 785.18), rest periods of short duration (typically lasting 5 to 20 minutes) are customary in industry and must be counted as compensable hours worked. Employers are not permitted to deduct short coffee or rest breaks. However, bona fide meal periods (typically lasting 30 minutes or more where the worker is completely relieved from work duties) are not considered work time and are unpaid.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>How do I correctly calculate work hours that cross midnight into the next day?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    When clocking out on the following day (such as starting at 10:00 PM and finishing at 6:00 AM), standard subtraction results in a negative value. SolveIt handles overnight shifts by checking whether the end time is numerically less than the start time; if so, it automatically adds 24 hours (1,440 minutes) to the clock-out time before performing the subtraction. The formula is: <code className="font-data-mono bg-surface-container px-1 py-0.5 rounded">Duration = (ClockOut + 24) - ClockIn - UnpaidBreak</code>.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>What is the FLSA 7-minute rounding rule and is it legally permissible?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Under 29 C.F.R. § 785.48(b), employers may round employee punch times to the nearest quarter hour (15 minutes). Under the "7/8 minute rule," minutes 1 through 7 round down to the nearest 15-minute increment, while minutes 8 through 14 round up. This rounding practice is legally permissible only if it is applied neutrally in a way that does not consistently favor the employer over time.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>Are timesheet logs stored on SolveIt servers or is it 100% private to my browser?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    All timesheet entries, hourly rates, client logs, and financial totals entered on SolveIt remain 100% inside your device's browser memory (Client-Side Sandboxing). No data is transmitted to or logged on remote servers, ensuring confidentiality for sensitive wage details and internal payroll compliance.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>How can I export my timesheet as a payroll-ready PDF or CSV?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Simply click the "Export CSV" button located at the top of the Weekly Timesheet Ledger. SolveIt dynamically generates a properly structured, RFC-4180 compliant CSV file containing your full 7-day breakdown, date ranges, decimal hours, and calculated gross pay. You can open this directly in Excel, Google Sheets, or QuickBooks, or click "Print Sheet" to produce a clean, printer-friendly PDF timecard.
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* SECTION 13: INTERCONNECTED TEMPORAL & PAYROLL SUITE */}
          <section className="w-full py-space-2xl bg-surface-container-low/40 border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">hub</span>
                  SOLVEIT COMPUTATIONAL ECOSYSTEM
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Related Time, Date &amp; Financial Calculators</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Seamlessly transition across our high-precision mathematical suite.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/age-calculator">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Age Calculator</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Exact chronological age in years, months, days, hours, and seconds.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/date-difference">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">date_range</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Date Difference</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Compute business days, weekends, and holidays between calendar dates.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/finance/hourly-to-salary">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Hourly to Salary Converter</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Annualized gross salary projections based on regular and overtime hours.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/finance/freelance-tax">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">receipt</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Freelance Net Pay Estimator</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Self-employment 15.3% FICA and quarterly estimated income tax deduction.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/time-zone-overlap">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Time Zone Overlap Matrix</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Coordinate distributed international team shifts and asynchronous handoffs.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/pomodoro-timer">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">timer</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Focus &amp; Pomodoro Engine</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">High-efficiency work sprint interval timer with deep productivity analytics.</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
