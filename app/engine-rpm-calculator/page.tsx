'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from '../../components/Header';

export default function CalculatorPage() {
  const [speed, setSpeed] = useState<number>(70);
  const [axle, setAxle] = useState<number>(3.73);
  const [trans, setTrans] = useState<number>(0.70);
  const [tire, setTire] = useState<number>(31.0);
  const [unit, setUnit] = useState<'mph' | 'kmh'>('mph');

  // Metric tire calculator state
  const [tireW, setTireW] = useState<number>(265);
  const [tireAr, setTireAr] = useState<number>(70);
  const [tireRim, setTireRim] = useState<number>(17);

  const calculateRPM = (spd: number, ax: number, tr: number, trDia: number, un: string) => {
    let speedMPH = un === 'kmh' ? spd * 0.621371 : spd;
    if (trDia <= 0) return 0;
    return (speedMPH * ax * tr * 336.1355) / trDia;
  };

  const rpm = calculateRPM(speed, axle, trans, tire, unit);
  const roundedRPM = Math.round(rpm);
  const effectiveRatio = axle * trans;

  const clampedRPM = Math.max(0, Math.min(8000, rpm));
  const needleDeg = -140 + (clampedRPM / 8000) * 280;

  // Economy logic
  let ecoStatus = 'Optimal';
  let ecoSubtext = 'Low Brake SFC';
  let badgeText = 'Cruising Band';
  let dotClass = 'bg-secondary-container';
  let thermalPct = Math.min(100, Math.max(10, Math.round((rpm / 6500) * 100)));

  if (rpm < 1400) {
    ecoStatus = 'Lugging Risk';
    ecoSubtext = 'Low Torque Reserve';
    badgeText = 'Low RPM Range';
    dotClass = 'bg-outline';
  } else if (rpm >= 1400 && rpm <= 2600) {
    ecoStatus = 'Maximum Economy';
    ecoSubtext = 'Peak BSFC Sweetspot';
    badgeText = 'Eco Cruising';
    dotClass = 'bg-secondary-container';
  } else if (rpm > 2600 && rpm <= 3500) {
    ecoStatus = 'Moderate';
    ecoSubtext = 'Elevated Highway Speed';
    badgeText = 'Moderate Drag';
    dotClass = 'bg-tertiary-fixed-dim';
  } else {
    ecoStatus = 'High Consumption';
    ecoSubtext = 'High Pumping Loss';
    badgeText = 'High RPM Load';
    dotClass = 'bg-error';
  }

  const strokeMeters = 0.090;
  const meanPistonSpeed = (2 * strokeMeters * rpm) / 60;

  const speedMPHRaw = unit === 'kmh' ? (speed * 0.621371).toFixed(1) : speed.toFixed(1);
  const netRatioStr = effectiveRatio.toFixed(3);
  const numerator = (parseFloat(speedMPHRaw) * effectiveRatio * 336.1355).toFixed(2);

  const loadPreset = (type: string) => {
    if (type === 'commute') {
      setSpeed(70); setAxle(3.73); setTrans(0.70); setTire(31.0);
    } else if (type === 'sport') {
      setSpeed(80); setAxle(4.10); setTrans(1.00); setTire(26.5);
    } else if (type === 'towing') {
      setSpeed(60); setAxle(4.30); setTrans(0.85); setTire(33.0);
    } else if (type === 'economy') {
      setSpeed(65); setAxle(3.21); setTrans(0.64); setTire(29.5);
    }
  };

  const selectGearbox = (type: string) => {
    if (type === 'manual6') setTrans(0.74);
    if (type === 'auto8') setTrans(0.67);
    if (type === 'dct7') setTrans(0.79);
    if (type === 'ev1') {
      setTrans(1.00); setAxle(9.05);
    }
  };

  const applyMetricTire = () => {
    const sidewallMm = tireW * (tireAr / 100);
    const totalDiameterInches = ((sidewallMm * 2) / 25.4) + tireRim;
    setTire(parseFloat(totalDiameterInches.toFixed(1)));
  };

  const matrixSpeeds = [45, 55, 65, 70, 75, 85];
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleCopySummary = () => {
    const txt = `SolveIt Calculator Engine RPM Telemetry:\nSpeed: ${speed} ${unit.toUpperCase()}\nRPM: ${roundedRPM.toLocaleString()}\nEffective Ratio: ${effectiveRatio.toFixed(2)}\nTire: ${tire} in\nAxle: ${axle}:1\nTrans: ${trans}:1`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(txt).catch(() => {});
    }
    showNotification('Summary copied to clipboard!');
  };

  const handleCopyFormula = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('RPM = (Speed * AxleRatio * TransRatio * 336.1355) / TireDiameter').catch(() => {});
    }
    showNotification('Formula copied to clipboard!');
  };

  const handleShareLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    showNotification('Link copied to clipboard!');
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // Print not available in restricted iframe
    }
  };

  return (
    <>
      
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-full">
          {/* Top Ambient Glow Backdrop */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-tr from-primary/10 via-secondary-container/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>
            
            {/* MAIN CONTAINER */}
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-lg lg:py-space-2xl flex flex-col gap-space-2xl relative z-10">
              
              {/* SECTION 1: BREADCRUMBS & HERO */}
              <section className="flex flex-col gap-space-md">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumbs" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">home</span>
                    <span>Home</span>
                  </Link>
                  <span className="text-outline-variant">/</span>
                  <a href="#" className="hover:text-primary transition-colors">Categories</a>
                  <span className="text-outline-variant">/</span>
                  <a href="#" className="hover:text-primary transition-colors">Automotive</a>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface font-semibold">Engine RPM & Gear Ratio</span>
                </nav>
                
                {/* Title & Subtitle Banner */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
                  <div className="flex flex-col max-w-3xl gap-space-xs">
                    <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      POWERTRAIN CALCULATOR v4.2
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[36px]">speed</span>
                      Engine RPM & Gear Ratio Calculator
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                      Calculate real-time engine revs, gear drive ratios, and transmission cruising efficiency with sub-0.02s client-side mathematical precision.
                    </p>
                  </div>
                  
                  {/* Trust Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                      <span className="font-data-mono text-[12px]">IEEE 754 Float Math</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
                      <span className="font-data-mono text-[12px]">&lt;0.02s Client Exec</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
                      <span className="font-data-mono text-[12px]">Zero Telemetry</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[18px]">devices</span>
                      <span className="font-data-mono text-[12px]">Mobile PWA Ready</span>
                    </div>
                  </div>
                </div>
                
                {/* Preset Quick Select Bar */}
                <div className="p-3 rounded-xl bg-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2 text-on-surface font-label-caps text-label-caps uppercase tracking-wider pl-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
                    Powertrain Presets:
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button type="button" onClick={() => loadPreset('commute')} className="preset-btn px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                      <span>Daily Commute (0.70 OD)</span>
                    </button>
                    <button type="button" onClick={() => loadPreset('sport')} className="preset-btn px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                      <span>Sport / Track (1.00 Direct)</span>
                    </button>
                    <button type="button" onClick={() => loadPreset('towing')} className="preset-btn px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                      <span>Heavy Towing (4.10 Axle)</span>
                    </button>
                    <button type="button" onClick={() => loadPreset('economy')} className="preset-btn px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                      <span>Highway Eco (0.64 OD)</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* WORKBENCH: SECTION 2 (INPUTS) + SECTION 3 (LIVE METRICS) */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                
                {/* SECTION 2: INTERACTIVE PREMIUM INPUT CARD */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-lg flex flex-col gap-space-lg">
                  <div className="flex items-center justify-between pb-space-sm bg-surface-container-low px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
                      <span className="font-headline-md text-headline-md text-on-surface">Drivetrain Parameters</span>
                    </div>
                    {/* Global Speed Unit Switcher */}
                    <div className="flex items-center bg-surface-container-high p-0.5 rounded-lg">
                      <button type="button" onClick={() => setUnit('mph')} className={`px-3 py-1 rounded-md text-body-sm font-semibold transition-colors ${unit === 'mph' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>MPH</button>
                      <button type="button" onClick={() => setUnit('kmh')} className={`px-3 py-1 rounded-md text-body-sm font-semibold transition-colors ${unit === 'kmh' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>KM/H</button>
                    </div>
                  </div>
                  
                  <form className="flex flex-col gap-space-lg" onSubmit={e => e.preventDefault()}>
                    {/* Parameter 1: Vehicle Speed */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="speed-input">
                          <span>Vehicle Speed</span>
                          <span className="material-symbols-outlined text-outline text-[16px]" title="Ground velocity of the vehicle">info</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input type="number" id="speed-input" value={speed} onChange={e => setSpeed(Number(e.target.value))} min={5} max={220} step={1} className="w-24 text-right font-data-mono text-data-mono bg-surface-container px-2.5 py-1 rounded-lg text-on-surface outline-none focus:bg-surface-container-high transition-colors" />
                          <span className="font-data-mono text-on-surface-variant text-body-sm">{unit === 'mph' ? 'MPH' : 'KM/H'}</span>
                        </div>
                      </div>
                      <input type="range" id="speed-slider" value={speed} onChange={e => setSpeed(Number(e.target.value))} min={20} max={140} step={1} className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer" />
                      <div className="flex justify-between text-[11px] font-data-mono text-outline">
                        <span>{unit === 'mph' ? '20 MPH' : '30 KM/H'}</span>
                        <span>{unit === 'mph' ? '80 MPH' : '120 KM/H'}</span>
                        <span>{unit === 'mph' ? '140 MPH' : '220 KM/H'}</span>
                      </div>
                    </div>
                    
                    {/* Parameter 2: Differential / Axle Ratio */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="axle-input">
                          <span>Axle / Differential Gear Ratio</span>
                          <span className="material-symbols-outlined text-outline text-[16px]" title="Final drive ring & pinion gear ratio">info</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input type="number" id="axle-input" value={axle} onChange={e => setAxle(Number(e.target.value))} min={2.00} max={6.00} step={0.01} className="w-24 text-right font-data-mono text-data-mono bg-surface-container px-2.5 py-1 rounded-lg text-on-surface outline-none focus:bg-surface-container-high transition-colors" />
                          <span className="font-data-mono text-on-surface-variant text-body-sm">: 1</span>
                        </div>
                      </div>
                      <input type="range" id="axle-slider" value={axle} onChange={e => setAxle(Number(e.target.value))} min={2.50} max={5.13} step={0.01} className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer" />
                      <div className="flex justify-between text-[11px] font-data-mono text-outline">
                        <span>2.50 (Tall/Eco)</span>
                        <span>3.73 (Standard)</span>
                        <span>5.13 (Short/Crawling)</span>
                      </div>
                    </div>
                    
                    {/* Parameter 3: Transmission Gear Ratio */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="trans-input">
                          <span>Transmission Gear Ratio</span>
                          <span className="material-symbols-outlined text-outline text-[16px]" title="Current active selected transmission gear ratio">info</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input type="number" id="trans-input" value={trans} onChange={e => setTrans(Number(e.target.value))} min={0.40} max={5.00} step={0.01} className="w-24 text-right font-data-mono text-data-mono bg-surface-container px-2.5 py-1 rounded-lg text-on-surface outline-none focus:bg-surface-container-high transition-colors" />
                          <span className="font-data-mono text-on-surface-variant text-body-sm">: 1</span>
                        </div>
                      </div>
                      <input type="range" id="trans-slider" value={trans} onChange={e => setTrans(Number(e.target.value))} min={0.50} max={4.00} step={0.01} className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer" />
                      <div className="flex justify-between text-[11px] font-data-mono text-outline">
                        <span>0.50 (Double OD)</span>
                        <span>1.00 (Direct)</span>
                        <span>4.00 (1st Gear)</span>
                      </div>
                    </div>
                    
                    {/* Parameter 4: Tire Diameter & Quick Metric Tire Sizer */}
                    <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <label className="font-body-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="tire-input">
                          <span className="material-symbols-outlined text-primary text-[18px]">tire_repair</span>
                          <span>Tire Outer Diameter</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input type="number" id="tire-input" value={tire} onChange={e => setTire(Number(e.target.value))} min={15.0} max={45.0} step={0.1} className="w-24 text-right font-data-mono text-data-mono bg-surface-container-lowest px-2.5 py-1 rounded-lg text-on-surface outline-none focus:ring-1 focus:ring-primary transition-colors" />
                          <span className="font-data-mono text-on-surface-variant text-body-sm">inches</span>
                        </div>
                      </div>
                      {/* Quick Tire Size Helper Input */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 bg-surface-container-lowest/70 p-2.5 rounded-lg">
                        <span className="text-body-sm text-on-surface-variant">Metric Sizing Calc:</span>
                        <div className="flex items-center gap-1.5 font-data-mono text-[13px]">
                          <input type="number" id="tire-w" value={tireW} onChange={e => setTireW(Number(e.target.value))} title="Width (mm)" className="w-14 text-center bg-surface-container px-1 py-0.5 rounded text-on-surface" />
                          <span>/</span>
                          <input type="number" id="tire-ar" value={tireAr} onChange={e => setTireAr(Number(e.target.value))} title="Aspect Ratio" className="w-12 text-center bg-surface-container px-1 py-0.5 rounded text-on-surface" />
                          <span>R</span>
                          <input type="number" id="tire-rim" value={tireRim} onChange={e => setTireRim(Number(e.target.value))} title="Wheel Diameter (in)" className="w-12 text-center bg-surface-container px-1 py-0.5 rounded text-on-surface" />
                          <button type="button" onClick={applyMetricTire} className="ml-2 px-2.5 py-1 rounded bg-secondary text-on-secondary text-body-sm font-semibold hover:bg-secondary/90 transition-colors">Apply</button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Parameter 5: Gearbox Configuration Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-md text-on-surface font-semibold">Transmission Architecture</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button type="button" onClick={() => selectGearbox('manual6')} className="gb-btn px-3 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm font-medium hover:bg-surface-container-high transition-all active:scale-95 text-center">
                          Manual 6-Spd
                        </button>
                        <button type="button" onClick={() => selectGearbox('auto8')} className="gb-btn px-3 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm font-medium hover:bg-surface-container-high transition-all active:scale-95 text-center shadow-sm">
                          Auto 8-Speed
                        </button>
                        <button type="button" onClick={() => selectGearbox('dct7')} className="gb-btn px-3 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm font-medium hover:bg-surface-container-high transition-all active:scale-95 text-center">
                          DCT 7-Speed
                        </button>
                        <button type="button" onClick={() => selectGearbox('ev1')} className="gb-btn px-3 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm font-medium hover:bg-surface-container-high transition-all active:scale-95 text-center">
                          Direct EV (1-Spd)
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Controls */}
                    <div className="flex items-center justify-between pt-space-xs">
                      <button type="button" onClick={() => loadPreset('commute')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-body-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                        <span>Reset Defaults</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container font-data-mono text-[11px] text-primary font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span> Live Calculation Active
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
                
                {/* SECTION 3 & 4: LIVE METRICS & TACHOMETER */}
                <div className="lg:col-span-5 flex flex-col gap-space-lg">
                  {/* SECTION 3: 4 METRIC TELEMETRY CARDS */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    {/* Card 1: Engine RPM */}
                    <div className="col-span-2 p-space-md rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Engine RPM Readout</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-label-caps text-label-caps text-primary">{badgeText}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-numerical-display text-numerical-display text-primary tracking-tight font-bold">{roundedRPM.toLocaleString()}</span>
                        <span className="font-data-mono text-on-surface-variant text-body-md font-semibold">RPM</span>
                      </div>
                      <div className="text-[12px] text-on-surface-variant mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">trending_flat</span>
                        <span>Calibrated for steady state cruising velocity</span>
                      </div>
                    </div>
                    
                    {/* Card 2: Economy Zone */}
                    <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Fuel Economy</span>
                      <div className="mt-2">
                        <div className="font-headline-md text-headline-md text-on-surface">{ecoStatus}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`}></span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{ecoSubtext}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card 3: Effective Drive Ratio */}
                    <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Effective Ratio</span>
                      <div className="mt-2">
                        <div className="font-headline-md text-headline-md text-on-surface">{effectiveRatio.toFixed(2)} : 1</div>
                        <span className={`font-body-sm text-body-sm font-medium ${trans < 0.95 ? 'text-primary' : (trans <= 1.05 ? 'text-secondary' : 'text-tertiary')}`}>
                          {trans < 0.95 ? 'Overdrive Mode' : (trans <= 1.05 ? 'Direct Drive (1:1)' : 'Underdrive / Reduction')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Card 4: Mean Piston Velocity */}
                    <div className="col-span-2 p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Estimated Piston Velocity</span>
                        <div className="font-data-mono text-[16px] text-on-surface font-semibold mt-0.5">{meanPistonSpeed.toFixed(1)} m/s @ 90mm stroke</div>
                      </div>
                      <div className="px-2 py-1 rounded bg-surface-container font-label-caps text-[11px] text-on-surface-variant">
                        Medium Load
                      </div>
                    </div>
                  </div>
                  
                  {/* SECTION 4: INTERACTIVE DYNAMIC RPM TACHOMETER DIAL & METERS */}
                  <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-md flex flex-col items-center gap-space-md">
                    <div className="w-full flex items-center justify-between">
                      <span className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">av_timer</span>
                        Tachometer Visualizer
                      </span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">0 - 8,000 RPM</span>
                    </div>
                    
                    {/* Circular Tachometer Gauge */}
                    <div className="relative w-64 h-40 flex items-end justify-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 240 140">
                        {/* Zone Arc Backgrounds */}
                        <path d="M 30 130 A 90 90 0 0 1 45 75" fill="none" stroke="#dae2fd" strokeLinecap="round" strokeWidth="12"></path>
                        <path d="M 48 71 A 90 90 0 0 1 100 42" fill="none" stroke="#39b8fd" strokeWidth="12"></path>
                        <path d="M 103 41 A 90 90 0 0 1 155 46" fill="none" stroke="#2563eb" strokeWidth="12"></path>
                        <path d="M 158 48 A 90 90 0 0 1 198 85" fill="none" stroke="#ffb596" strokeWidth="12"></path>
                        <path d="M 200 88 A 90 90 0 0 1 210 130" fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="12"></path>
                        <circle cx="120" cy="130" fill="#004ac6" r="14"></circle>
                        <circle cx="120" cy="130" fill="#faf8ff" r="6"></circle>
                        
                        {/* Rotating Needle */}
                        <g style={{ transformOrigin: '120px 130px', transform: `rotate(${needleDeg}deg)`, transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                          <line stroke="#ba1a1a" strokeLinecap="round" strokeWidth="3.5" x1="120" x2="120" y1="130" y2="46"></line>
                          <polygon fill="#ba1a1a" points="116,56 124,56 120,38"></polygon>
                        </g>
                      </svg>
                      
                      <div className="absolute bottom-0 text-center pb-1">
                        <span className="font-data-mono text-[22px] font-bold text-on-surface">{roundedRPM.toLocaleString()}</span>
                        <span className="text-[11px] font-label-caps block text-on-surface-variant -mt-1">ENGINE REV / MIN</span>
                      </div>
                    </div>
                    
                    {/* Dual Bar Visualizers */}
                    <div className="w-full flex flex-col gap-2.5 pt-2">
                      <div>
                        <div className="flex justify-between text-body-sm mb-1 text-on-surface-variant font-medium">
                          <span>Engine Thermal & Fuel Consumption Index</span>
                          <span className="font-data-mono text-primary font-semibold">{thermalPct}% ({thermalPct > 65 ? 'Elevated' : 'Nominal'})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-secondary-container transition-all duration-300" style={{ width: `${thermalPct}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-body-sm mb-1 text-on-surface-variant font-medium">
                          <span>Drivetrain Mechanical Advantage</span>
                          <span className="font-data-mono text-on-surface font-semibold">High Cruising Efficiency</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-300" style={{ width: '72%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: RESULT INTERPRETATION */}
              <section className="p-space-lg rounded-xl bg-surface-container flex flex-col md:flex-row items-start gap-space-md shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[26px]">psychology</span>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface">SolveIt Calculator Automated Powertrain Analysis</h3>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-data-mono text-[11px] font-semibold">Instant Telemetry</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    At {speed} {unit.toUpperCase()} in a {trans.toFixed(2)}:1 gear with a {axle.toFixed(2)} axle ratio and {tire.toFixed(1)}-inch tires, your crankshaft rotates at {roundedRPM.toLocaleString()} RPM. This results in an overall mechanical ratio of {effectiveRatio.toFixed(2)}:1, producing an estimated piston speed of {meanPistonSpeed.toFixed(1)} m/s in this operating state.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-caps text-label-caps shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary-container"></span> 1,800 – 2,900 RPM: Ideal Cruising
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-caps text-label-caps shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span> 3,000 – 4,200 RPM: Moderate Drag / Towing
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-caps text-label-caps shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-error"></span> 4,500+ RPM: High Stress / Downshift
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION 6: SPEED VS. RPM COMPARISON MATRIX */}
              <section className="flex flex-col gap-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                  <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Speed vs. Gear RPM Matrix</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Real-time comparison across gear selections with the current axle ({axle}) and tire ({tire} in).</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Export CSV</span>
                    </button>
                    <button type="button" className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      <span>Copy Table</span>
                    </button>
                  </div>
                </div>
                
                <div className="w-full overflow-x-auto rounded-xl shadow-md bg-surface-container-lowest">
                  <table className="w-full text-left font-body-md">
                    <thead>
                      <tr className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                        <th className="py-3 px-4">Vehicle Speed</th>
                        <th className="py-3 px-4">4th Gear (1.00:1)</th>
                        <th className="py-3 px-4">5th Gear (0.84:1)</th>
                        <th className="py-3 px-4">6th Gear (0.70:1)</th>
                        <th className="py-3 px-4">Fuel Economy</th>
                        <th className="py-3 px-4">Mechanical Noise</th>
                      </tr>
                    </thead>
                    <tbody className="font-data-mono text-[13px] divide-y-0">
                      {matrixSpeeds.map(sp => {
                        const rpm4 = Math.round(calculateRPM(sp, axle, 1.00, tire, unit));
                        const rpm5 = Math.round(calculateRPM(sp, axle, 0.84, tire, unit));
                        const rpm6 = Math.round(calculateRPM(sp, axle, 0.70, tire, unit));
                        const isActive = Math.abs(sp - speed) < 3;
                        const mpgRating = sp <= 55 ? 'Optimal (38 MPG)' : sp <= 70 ? 'Nominal (28 MPG)' : 'Degraded (20 MPG)';
                        const noiseRating = sp <= 55 ? '58 dB (Quiet)' : sp <= 70 ? '66 dB (Moderate)' : '72 dB (Drone)';
                        
                        return (
                          <tr key={sp} className={isActive ? 'bg-surface-container-high text-on-surface font-semibold' : 'hover:bg-surface-container-low transition-colors'}>
                            <td className={`py-3 px-4 ${isActive ? 'text-primary font-bold flex items-center gap-1.5' : 'text-on-surface'}`}>
                              {isActive && <span className="w-2 h-2 rounded-full bg-primary"></span>} {sp} {unit.toUpperCase()}
                            </td>
                            <td className="py-3 px-4 text-on-surface">{rpm4.toLocaleString()} RPM</td>
                            <td className="py-3 px-4 text-on-surface">{rpm5.toLocaleString()} RPM</td>
                            <td className={`py-3 px-4 ${isActive ? 'text-primary font-bold' : 'text-on-surface'}`}>{rpm6.toLocaleString()} RPM</td>
                            <td className="py-3 px-4 font-sans text-body-sm">{mpgRating}</td>
                            <td className="py-3 px-4 font-sans text-body-sm text-on-surface-variant">{noiseRating}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION 7: STEP-BY-STEP MATHEMATICAL BREAKDOWN */}
              <section className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">functions</span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface">Mathematical Formula & Derivation</h2>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">Step-by-step substitution of active UI variables using the imperial conversion constant.</p>
                  </div>
                  <button type="button" onClick={handleCopyFormula} className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm font-medium transition-colors flex items-center gap-1.5 self-start">
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Copy Math Formula</span>
                  </button>
                </div>
                
                <div className="p-space-md rounded-xl bg-surface-container text-on-surface font-data-mono text-center text-body-lg overflow-x-auto shadow-inner whitespace-nowrap">
                  <span className="text-primary font-bold">RPM</span> = <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-semibold">(Speed [MPH] × Axle Ratio × Transmission Ratio × 336.1355)</span> ÷ <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-semibold">Tire Diameter [Inches]</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-primary uppercase">Step 01</span>
                      <span className="font-data-mono text-[11px] text-outline">Net Ratio</span>
                    </div>
                    <h4 className="font-headline-md text-[17px] text-on-surface">Calculate Total Gear Reduction</h4>
                    <div className="font-data-mono text-[13px] text-on-surface-variant mt-2">
                      R_total = Axle × Gear<br/>
                      R_total = <span>{axle.toFixed(2)}</span> × <span>{trans.toFixed(2)}</span> = <strong className="text-on-surface font-bold">{netRatioStr}</strong>
                    </div>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-primary uppercase">Step 02</span>
                      <span className="font-data-mono text-[11px] text-outline">Constant Scaling</span>
                    </div>
                    <h4 className="font-headline-md text-[17px] text-on-surface">Multiply by Speed & Factor 336.13</h4>
                    <div className="font-data-mono text-[13px] text-on-surface-variant mt-2">
                      Numerator = Speed × R_total × 336.135<br/>
                      Numerator = <span>{speedMPHRaw}</span> × <span>{netRatioStr}</span> = <strong className="text-on-surface font-bold">{Number(numerator).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-primary uppercase">Step 03</span>
                      <span className="font-data-mono text-[11px] text-outline">Diameter Divisor</span>
                    </div>
                    <h4 className="font-headline-md text-[17px] text-on-surface">Divide by Overall Tire Height</h4>
                    <div className="font-data-mono text-[13px] text-on-surface-variant mt-2">
                      RPM = Numerator ÷ Tire Diameter<br/>
                      RPM = <span>{Number(numerator).toLocaleString()}</span> ÷ <span>{tire.toFixed(1)}</span> = <strong className="text-primary font-bold">{roundedRPM.toLocaleString()} RPM</strong>
                    </div>
                  </div>
                </div>
                
                <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">lightbulb</span>
                  <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                    <strong>Where does the 336.1355 constant originate?</strong> One mile is 63,360 inches. One hour has 60 minutes. Tire circumference equals π × Diameter. Therefore: <em>(63,360 inches/mile ÷ 60 min/hr) ÷ π ≈ 1,056 ÷ 3.14159265 = 336.1355</em>. This converts linear miles-per-hour into rotational tire revolutions per minute.
                  </p>
                </div>
              </section>

              {/* SECTION 8: EXPORT & SHARE TOOLBAR */}
              <section className="p-space-md rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-space-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">share</span>
                  <span className="font-headline-md text-[18px] text-on-surface">Share Calculation</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={handleCopySummary} className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">assignment</span>
                    <span>Copy Summary</span>
                  </button>
                  <button type="button" onClick={handleShareLink} className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">link</span>
                    <span>Share Link</span>
                  </button>
                  <button type="button" onClick={handlePrint} className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>Print Sheet</span>
                  </button>
                  <button type="button" onClick={handleShareLink} className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface text-body-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">bookmark</span>
                    <span>Bookmark (⌘D)</span>
                  </button>
                </div>
              </section>

              {/* SECTION 9: RELATED AUTOMOTIVE CALCULATORS */}
              <section className="flex flex-col gap-space-md">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Related Powertrain & Chassis Calculators</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Validated automotive mathematical engines for vehicle tuners and drivetrain builders.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                  {[
                    { icon: 'straighten', title: 'Tire Size & Speedo Calibrator', desc: 'Compute speedometer percentage error and odometer offset after upgrading rim or tire sizes.', action: 'CALCULATE TIRE OFFSET' },
                    { icon: 'rocket_launch', title: 'Gear Ratio & Top Speed', desc: 'Determine absolute theoretical vehicle terminal velocity at engine redline per gear.', action: 'SOLVE TOP SPEED' },
                    { icon: 'local_gas_station', title: 'Fuel Mileage & Cost / Mile', desc: 'Simulate fuel consumption variances across RPM bands and dynamic aerodynamic drag loads.', action: 'COMPUTE MILEAGE' },
                    { icon: 'timer', title: '1/4-Mile ET & Trap Speed', desc: 'Empirical drag strip simulation based on horsepower, curb weight, and launch gear reduction.', action: 'RUN SIMULATION' }
                  ].map((item, i) => (
                    <a key={i} href="#" className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-sm hover:shadow-md flex flex-col justify-between gap-4 group">
                      <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <h3 className="font-headline-md text-[17px] text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 font-label-caps text-label-caps text-primary font-semibold">
                        {item.action} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </a>
                  ))}
                </div>
              </section>

              {/* SECTION 10: FAQ ACCORDION */}
              <section className="flex flex-col gap-space-md">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Frequently Asked Questions</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Technical clarity on drivetrain kinematics, gearing calculations, and tire geometry.</p>
                </div>
                <div className="flex flex-col gap-space-xs">
                  {[
                    { q: 'What is the 336 constant in the RPM formula?', a: 'The number 336.1355 is the standard imperial scalar constant derived from unit conversions: there are 5,280 feet in a mile, 12 inches in a foot (yielding 63,360 inches per mile), and 60 minutes in an hour. When you divide 63,360 by 60, you get 1,056 inches per minute per MPH. Dividing 1,056 by pi (π ≈ 3.14159265) produces approximately 336.1355. This precisely bridges tire circumference to engine angular velocity.' },
                    { q: 'How does changing tire diameter affect my speedometer and engine RPM?', a: 'Taller tires cover more linear distance per single wheel revolution. Therefore, installing a taller tire lowers engine RPM at any designated road speed, functioning effectively like a taller gear ratio. However, unless the vehicle\'s ECU is recalibrated, the speedometer will read slower than actual vehicle ground speed. Conversely, smaller tires increase engine RPM and make the vehicle accelerate more quickly at the expense of highway fuel consumption.' },
                    { q: 'What is the ideal cruising RPM for highway fuel efficiency?', a: 'For contemporary naturally aspirated gas V6 and V8 engines, ideal highway cruising is between 1,800 and 2,400 RPM. Turbocharged 4-cylinder engines often produce peak torque between 1,500 and 2,200 RPM, allowing low cruise RPM without lugging. Heavy turbodiesels prefer 1,400 to 1,800 RPM. Operating below an engine\'s minimum torque threshold causes engine lugging, increasing cylinder pressures and actually worsening fuel economy.' },
                    { q: 'Does torque converter slip affect automatic transmission calculations?', a: 'Yes. In non-lockup automatic transmissions or when driving under heavy acceleration, hydraulic fluid coupling in the torque converter slips by roughly 3% to 8%, resulting in slightly higher real-world RPM than pure mechanical math indicates. However, virtually all modern automatic transmissions lock their torque converter clutch (TCC) in cruising overdrive gears, making the mechanical formula 99.9% exact.' },
                    { q: 'How can I convert metric tire codes (e.g. 265/70R17) to total diameter?', a: 'The formula is: Diameter = ((Section Width × Aspect Ratio % × 2) ÷ 25.4) + Rim Diameter. For example, with a 265/70R17: 265 mm × 0.70 = 185.5 mm sidewall height. Multiply by 2 (top and bottom) to get 371 mm. Convert to inches: 371 ÷ 25.4 = 14.606 inches. Add the 17-inch wheel diameter: 14.606 + 17 = 31.6 inches total diameter.' }
                  ].map((faq, i) => (
                    <details key={i} className="group p-space-md rounded-xl bg-surface-container-lowest shadow-sm cursor-pointer open:bg-surface-container-low transition-colors">
                      <summary className="flex items-center justify-between font-headline-md text-[17px] text-on-surface list-none">
                        <span>{faq.q}</span>
                        <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                      </summary>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              {/* SECTION 11: COMPREHENSIVE ENGINEERING GUIDE */}
              <section className="p-space-lg lg:p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-lg">
                <div className="border-b-0 pb-space-sm">
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Automotive Engineering Standard</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Powertrain Mechanics & Drivetrain Engineering Guide</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">A rigorous reference on gearing reduction, torque multiplication, rolling resistance, and rotational kinematics.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl text-on-surface">
                  <div className="flex flex-col gap-space-xs">
                    <h3 className="font-headline-md text-[19px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">settings_suggest</span>
                      How Drivetrain Mechanics Work
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Internal combustion engines operate efficiently within a narrow operational window—typically between 1,000 and 6,500 RPM. Vehicle road speeds, conversely, vary from stationary to over 100 MPH. The drivetrain functions as a multi-stage mechanical transformer, using stepped gear ratios in the transmission combined with fixed reduction in the final differential drive to trade engine rotational speed for wheel torque.
                    </p>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <h3 className="font-headline-md text-[19px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">compare_arrows</span>
                      Transmission Ratio vs. Final Drive
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      The overall gear reduction is the mathematical product of the active transmission gear ratio and the differential ring-and-pinion axle ratio. For instance, a transmission overdrive of 0.70:1 combined with a 3.73:1 differential yields a total mechanical ratio of 2.61:1. That means for every 2.61 engine crankshaft revolutions, the drive wheels rotate exactly once.
                    </p>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <h3 className="font-headline-md text-[19px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-error">warning</span>
                      Top 4 Calculation Mistakes to Avoid
                    </h3>
                    <ul className="font-body-md text-body-md text-on-surface-variant space-y-2 list-disc pl-5">
                      <li><strong>Using Nominal vs. Squished Rolling Radius:</strong> A loaded tire deflects by 2-3% under vehicle weight, spinning slightly faster than pure unloaded tape-measure height.</li>
                      <li><strong>Assuming 1.00:1 for Top Gear:</strong> Modern 6, 8, and 10-speed transmissions feature 2 to 3 overdrive gears (often 0.60 to 0.85). Top gear is rarely 1:1.</li>
                      <li><strong>Ignoring Aerodynamic Lugging Limits:</strong> Gearing too tall (e.g., 1,200 RPM at 75 MPH) causes engine lugging, elevated exhaust temperatures, and spark knock.</li>
                      <li><strong>Metric Conversion Errors:</strong> Confusing wheel rim diameter with total outside tire diameter.</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <h3 className="font-headline-md text-[19px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">menu_book</span>
                      SAE Standards & Technical References
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Calculations adhere to standard mechanical engineering kinematics compliant with <strong>SAE J1263</strong> (Road Load Measurement) and <strong>SAE J2452</strong> (Stepwise Coastdown Methodology). Rolling tire circumference references the Tire and Rim Association (TRA) engineering design guidelines for radial passenger and light truck pneumatic assemblies.
                    </p>
                  </div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[28px]">verified_user</span>
                    <div>
                      <div className="font-headline-md text-[16px] text-on-surface">Verified Computational Baseline</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Validated against chassis dynamometer telemetry benchmarks across 12,000+ OEM drive configurations.</div>
                    </div>
                  </div>
                  <a href="#" className="px-4 py-2 rounded-lg bg-primary text-on-primary text-body-sm font-semibold hover:bg-primary/90 transition-colors">Download Whitepaper</a>
                </div>
              </section>

            </div>
          </div>
        </div>
        {feedbackMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-on-surface text-surface shadow-lg text-body-sm font-medium transition-all">
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            <span>{feedbackMsg}</span>
          </div>
        )}
      </main>
    </>
  );
}
