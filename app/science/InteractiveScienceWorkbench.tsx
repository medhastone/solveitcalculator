'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Orbit,
  FlaskConical,
  Flame,
  Telescope,
  Atom,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Zap,
  Globe,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { PERIODIC_TABLE_ELEMENTS } from './scienceCategoryData';

type ScienceMode = 'kinematics' | 'idealgas' | 'chemistry' | 'astronomy' | 'quantum';

interface CelestialBodyPreset {
  name: string;
  mass: number; // kg
  radius: number; // km
  defaultAltitude: number; // km
  surfaceGravity: number; // m/s²
}

const CELESTIAL_BODIES: Record<string, CelestialBodyPreset> = {
  earth: {
    name: 'Earth (ISS LEO)',
    mass: 5.9722e24,
    radius: 6371,
    defaultAltitude: 408,
    surfaceGravity: 9.80665,
  },
  earth_geo: {
    name: 'Earth (Geostationary)',
    mass: 5.9722e24,
    radius: 6371,
    defaultAltitude: 35786,
    surfaceGravity: 9.80665,
  },
  moon: {
    name: 'The Moon (Lunar Orbit)',
    mass: 7.342e22,
    radius: 1737.4,
    defaultAltitude: 100,
    surfaceGravity: 1.622,
  },
  mars: {
    name: 'Mars (Areostationary)',
    mass: 6.4171e23,
    radius: 3389.5,
    defaultAltitude: 300,
    surfaceGravity: 3.72076,
  },
  jupiter: {
    name: 'Jupiter (Jovian Orbit)',
    mass: 1.8982e27,
    radius: 69911,
    defaultAltitude: 1000,
    surfaceGravity: 24.79,
  },
  sun: {
    name: 'The Sun (Solar Orbit)',
    mass: 1.9885e30,
    radius: 696340,
    defaultAltitude: 5000000,
    surfaceGravity: 274.0,
  },
};

export default function InteractiveScienceWorkbench() {
  const [mode, setMode] = useState<ScienceMode>('kinematics');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. Kinematics & Projectile State
  const [velocity, setVelocity] = useState<number>(25); // m/s
  const [launchAngle, setLaunchAngle] = useState<number>(45); // degrees
  const [initialHeight, setInitialHeight] = useState<number>(0); // m
  const [gravity, setGravity] = useState<number>(9.80665); // m/s²

  // 2. Ideal Gas Law State (PV = nRT)
  const [gasSolveFor, setGasSolveFor] = useState<'P' | 'V' | 'n' | 'T'>('P');
  const [gasPressure, setGasPressure] = useState<number>(1.0); // atm
  const [gasVolume, setGasVolume] = useState<number>(22.414); // Liters
  const [gasMoles, setGasMoles] = useState<number>(1.0); // moles
  const [gasTempC, setGasTempC] = useState<number>(0.0); // Celsius

  // 3. Chemistry & Periodic Table State
  const [chemicalFormula, setChemicalFormula] = useState<string>('H2SO4');
  const [selectedElementSymbol, setSelectedElementSymbol] = useState<string>('H');

  // 4. Astronomy & Orbital Mechanics State
  const [selectedBodyKey, setSelectedBodyKey] = useState<string>('earth');
  const [customAltitude, setCustomAltitude] = useState<number>(408); // km

  // 5. Quantum Photon State
  const [wavelengthNm, setWavelengthNm] = useState<number>(532); // nm (Green laser)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- Calculations ---

  // 1. Projectile & Kinematics Calculations
  const kinematicsResults = useMemo(() => {
    const angleRad = (launchAngle * Math.PI) / 180;
    const v0x = velocity * Math.cos(angleRad);
    const v0y = velocity * Math.sin(angleRad);

    // Apex time and maximum height
    const timeToApex = v0y / gravity;
    const maxHeightAboveLaunch = (v0y * v0y) / (2 * gravity);
    const totalMaxHeight = initialHeight + maxHeightAboveLaunch;

    // Total flight time solving quadratic: -0.5*g*t^2 + v0y*t + h0 = 0
    // 0.5*g*t^2 - v0y*t - h0 = 0 -> t = (v0y + sqrt(v0y^2 + 2*g*h0)) / g
    const discriminant = v0y * v0y + 2 * gravity * initialHeight;
    const totalFlightTime = (v0y + Math.sqrt(Math.max(0, discriminant))) / gravity;
    const horizontalRange = v0x * totalFlightTime;

    // Impact velocity
    const vyImpact = v0y - gravity * totalFlightTime;
    const impactSpeed = Math.sqrt(v0x * v0x + vyImpact * vyImpact);

    return {
      v0x,
      v0y,
      timeToApex,
      totalMaxHeight,
      totalFlightTime,
      horizontalRange,
      impactSpeed,
    };
  }, [velocity, launchAngle, initialHeight, gravity]);

  // 2. Ideal Gas Calculations (R = 0.08205736 L·atm/(mol·K))
  const R_ATM = 0.082057366;
  const gasResults = useMemo(() => {
    const kelvin = gasTempC + 273.15;
    let computedP = gasPressure;
    let computedV = gasVolume;
    let computedN = gasMoles;
    let computedT_K = kelvin;
    let computedT_C = gasTempC;

    if (gasSolveFor === 'P') {
      computedP = (gasMoles * R_ATM * kelvin) / (gasVolume > 0 ? gasVolume : 0.001);
    } else if (gasSolveFor === 'V') {
      computedV = (gasMoles * R_ATM * kelvin) / (gasPressure > 0 ? gasPressure : 0.001);
    } else if (gasSolveFor === 'n') {
      computedN = (gasPressure * gasVolume) / (R_ATM * (kelvin > 0 ? kelvin : 1));
    } else if (gasSolveFor === 'T') {
      computedT_K = (gasPressure * gasVolume) / (R_ATM * (gasMoles > 0 ? gasMoles : 0.001));
      computedT_C = computedT_K - 273.15;
    }

    const pressureKPa = computedP * 101.325;
    const molarVolume = computedN > 0 ? computedV / computedN : 0;

    return {
      P_atm: computedP,
      P_kPa: pressureKPa,
      V_L: computedV,
      n_mol: computedN,
      T_K: computedT_K,
      T_C: computedT_C,
      molarVolume,
    };
  }, [gasSolveFor, gasPressure, gasVolume, gasMoles, gasTempC]);

  // 3. Chemistry Molar Mass Parser
  const molarMassResults = useMemo(() => {
    const raw = chemicalFormula.trim();
    if (!raw) return { totalMass: 0, breakdown: [], valid: false, error: 'Empty formula' };

    // Standard formula tokenizer regex: Element symbol followed by optional numbers
    const elementRegex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    let totalMass = 0;
    const countMap: Record<string, number> = {};
    let matchedLength = 0;

    while ((match = elementRegex.exec(raw)) !== null) {
      const symbol = match[1];
      const count = match[2] ? parseInt(match[2], 10) : 1;
      matchedLength += match[0].length;
      countMap[symbol] = (countMap[symbol] || 0) + count;
    }

    // Check if entire formula was matched
    if (matchedLength !== raw.length) {
      return { totalMass: 0, breakdown: [], valid: false, error: 'Invalid characters or unsupported syntax' };
    }

    const breakdown: { symbol: string; name: string; count: number; atomicMass: number; totalElementMass: number; percent: number }[] = [];

    for (const [symbol, count] of Object.entries(countMap)) {
      const elem = PERIODIC_TABLE_ELEMENTS.find((e) => e.symbol === symbol);
      if (!elem) {
        return { totalMass: 0, breakdown: [], valid: false, error: `Unknown element symbol: ${symbol}` };
      }
      const elemTotal = elem.mass * count;
      totalMass += elemTotal;
      breakdown.push({
        symbol: elem.symbol,
        name: elem.name,
        count,
        atomicMass: elem.mass,
        totalElementMass: elemTotal,
        percent: 0,
      });
    }

    // Calculate mass percentages
    breakdown.forEach((item) => {
      item.percent = totalMass > 0 ? (item.totalElementMass / totalMass) * 100 : 0;
    });

    return {
      totalMass,
      breakdown,
      valid: true,
      error: null,
    };
  }, [chemicalFormula]);

  // Selected single element details
  const selectedElement = useMemo(() => {
    return (
      PERIODIC_TABLE_ELEMENTS.find((e) => e.symbol === selectedElementSymbol) ||
      PERIODIC_TABLE_ELEMENTS[0]
    );
  }, [selectedElementSymbol]);

  // 4. Astronomy & Orbital Calculations
  const orbitalResults = useMemo(() => {
    const body = CELESTIAL_BODIES[selectedBodyKey] || CELESTIAL_BODIES.earth;
    const G = 6.6743e-11; // m³/kg·s²
    const rMeters = (body.radius + customAltitude) * 1000; // meters from center of mass

    // Orbital velocity v = sqrt(GM/r)
    const orbitalVelocityMps = Math.sqrt((G * body.mass) / rMeters);
    const orbitalVelocityKmps = orbitalVelocityMps / 1000;

    // Orbital Period T = 2*pi*sqrt(r^3 / GM)
    const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(rMeters, 3) / (G * body.mass));
    const periodHours = periodSeconds / 3600;
    const periodMins = (periodSeconds % 3600) / 60;

    // Escape Velocity v_e = sqrt(2GM/r)
    const escapeVelocityMps = Math.sqrt((2 * G * body.mass) / rMeters);
    const escapeVelocityKmps = escapeVelocityMps / 1000;

    // Surface gravity at that altitude
    const localGravity = (G * body.mass) / (rMeters * rMeters);

    return {
      body,
      orbitalVelocityKmps,
      periodHours: Math.floor(periodHours),
      periodMins: Math.round(periodMins),
      escapeVelocityKmps,
      localGravity,
      orbitalRadiusKm: body.radius + customAltitude,
    };
  }, [selectedBodyKey, customAltitude]);

  // 5. Quantum Photon Calculations
  const quantumResults = useMemo(() => {
    const c = 299792458; // m/s
    const h = 6.62607015e-34; // J·s
    const eV = 1.602176634e-19; // Joules per eV

    const wavelengthM = wavelengthNm * 1e-9;
    const frequencyHz = wavelengthM > 0 ? c / wavelengthM : 0;
    const energyJoules = h * frequencyHz;
    const energyEV = energyJoules / eV;
    const waveNumberCm = wavelengthM > 0 ? 1 / (wavelengthM * 100) : 0;

    // Spectral band naming
    let band = 'Visible Light';
    let bandColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';

    if (wavelengthNm < 0.01) {
      band = 'Gamma Rays';
      bandColor = 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900';
    } else if (wavelengthNm < 10) {
      band = 'X-Rays';
      bandColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900';
    } else if (wavelengthNm < 380) {
      band = 'Ultraviolet (UV)';
      bandColor = 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900';
    } else if (wavelengthNm <= 750) {
      band = 'Visible Spectrum';
      bandColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    } else if (wavelengthNm <= 1000000) {
      band = 'Infrared (IR)';
      bandColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
    } else if (wavelengthNm <= 1000000000) {
      band = 'Microwaves';
      bandColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
    } else {
      band = 'Radio Waves';
      bandColor = 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900';
    }

    return {
      frequencyHz,
      frequencyTHz: frequencyHz / 1e12,
      energyJoules,
      energyEV,
      waveNumberCm,
      band,
      bandColor,
    };
  }, [wavelengthNm]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-12">
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Multi-Discipline Interactive Science Workbench
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  CODATA Calibrated
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-0.5">
                Real-time physics kinematics, Ideal Gas thermodynamics, stoichiometry, orbital speeds, and quantum photon waves
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setVelocity(25);
              setLaunchAngle(45);
              setInitialHeight(0);
              setGravity(9.80665);
              setGasSolveFor('P');
              setGasPressure(1.0);
              setGasVolume(22.414);
              setGasMoles(1.0);
              setGasTempC(0.0);
              setChemicalFormula('H2SO4');
              setSelectedBodyKey('earth');
              setCustomAltitude(408);
              setWavelengthNm(532);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Solver Mode Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setMode('kinematics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'kinematics'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Orbit className="w-4 h-4" />
            1. Kinematics & Projectiles
          </button>

          <button
            onClick={() => setMode('idealgas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'idealgas'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            2. Ideal Gas Law (PV=nRT)
          </button>

          <button
            onClick={() => setMode('chemistry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'chemistry'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            3. Periodic Table & Molar Mass
          </button>

          <button
            onClick={() => setMode('astronomy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'astronomy'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Telescope className="w-4 h-4" />
            4. Orbital & Escape Velocity
          </button>

          <button
            onClick={() => setMode('quantum')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'quantum'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Atom className="w-4 h-4" />
            5. Quantum Photon & Waves
          </button>
        </div>
      </div>

      {/* Main Interactive Body */}
      <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/50">
        {/* =========================================================================
            MODE 1: KINEMATICS & 2D PROJECTILES
        ========================================================================= */}
        {mode === 'kinematics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Launch Trajectory Parameters
                </h3>

                {/* Launch Velocity */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Initial Velocity (v₀)</span>
                    <span className="font-mono tabular-nums">{velocity.toFixed(1)} m/s ({(velocity * 3.6).toFixed(1)} km/h)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    step="1"
                    value={velocity}
                    onChange={(e) => setVelocity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>

                {/* Launch Angle */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Launch Angle (θ)</span>
                    <span className="font-mono tabular-nums">{launchAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="1"
                    value={launchAngle}
                    onChange={(e) => setLaunchAngle(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>

                {/* Launch Height */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Initial Elevation (h₀)</span>
                    <span className="font-mono tabular-nums">{initialHeight} meters</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={initialHeight}
                    onChange={(e) => setInitialHeight(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>

                {/* Planetary Gravitational Field */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Gravitational Field (g)</span>
                    <span className="font-mono tabular-nums">{gravity.toFixed(2)} m/s²</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <button
                      onClick={() => setGravity(9.80665)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition ${
                        gravity === 9.80665
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Earth (9.81)
                    </button>
                    <button
                      onClick={() => setGravity(1.622)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition ${
                        gravity === 1.622
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Moon (1.62)
                    </button>
                    <button
                      onClick={() => setGravity(3.72)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition ${
                        gravity === 3.72
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Mars (3.72)
                    </button>
                    <button
                      onClick={() => setGravity(24.79)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition ${
                        gravity === 24.79
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Jupiter (24.8)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Kinematics Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Horizontal Range */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Horizontal Range (R)
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${kinematicsResults.horizontalRange.toFixed(2)} m`, 'range')}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {copiedKey === 'range' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-cyan-600 dark:text-cyan-400">
                    {kinematicsResults.horizontalRange.toFixed(1)} <span className="text-sm font-normal text-slate-400">m</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    total distance traveled along x-axis
                  </div>
                </div>

                {/* Maximum Apex Height */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Peak Apex Height (H)
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${kinematicsResults.totalMaxHeight.toFixed(2)} m`, 'maxh')}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {copiedKey === 'maxh' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                    {kinematicsResults.totalMaxHeight.toFixed(1)} <span className="text-sm font-normal text-slate-400">m</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    apex reached at t = {kinematicsResults.timeToApex.toFixed(2)}s
                  </div>
                </div>
              </div>

              {/* Time & Impact Velocity Details */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Flight Duration & Velocity Vectors
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Total Time: {kinematicsResults.totalFlightTime.toFixed(2)} s
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums pt-1 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">v₀x (Constant)</span>
                    <span className="font-bold">{kinematicsResults.v0x.toFixed(1)} m/s</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">v₀y (Initial)</span>
                    <span className="font-bold">{kinematicsResults.v0y.toFixed(1)} m/s</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">Impact Speed</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      {kinematicsResults.impactSpeed.toFixed(1)} m/s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 2: IDEAL GAS LAW (PV = nRT)
        ========================================================================= */}
        {mode === 'idealgas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    Thermodynamic State Variables
                  </h3>
                </div>

                {/* Variable Selector to Solve For */}
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    Select Target Variable to Solve:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['P', 'V', 'n', 'T'] as const).map((variable) => (
                      <button
                        key={variable}
                        onClick={() => setGasSolveFor(variable)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                          gasSolveFor === variable
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {variable === 'P' && 'Pressure (P)'}
                        {variable === 'V' && 'Volume (V)'}
                        {variable === 'n' && 'Moles (n)'}
                        {variable === 'T' && 'Temp (T)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs for remaining variables */}
                {gasSolveFor !== 'P' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Pressure (P) in atm</span>
                      <span className="font-mono tabular-nums">{gasPressure.toFixed(2)} atm</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="20"
                      step="0.1"
                      value={gasPressure}
                      onChange={(e) => setGasPressure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                )}

                {gasSolveFor !== 'V' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Volume (V) in Liters</span>
                      <span className="font-mono tabular-nums">{gasVolume.toFixed(2)} L</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="0.5"
                      value={gasVolume}
                      onChange={(e) => setGasVolume(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                )}

                {gasSolveFor !== 'n' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Amount of Substance (n) in Moles</span>
                      <span className="font-mono tabular-nums">{gasMoles.toFixed(2)} mol</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={gasMoles}
                      onChange={(e) => setGasMoles(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                )}

                {gasSolveFor !== 'T' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Temperature (T) in °Celsius</span>
                      <span className="font-mono tabular-nums">{gasTempC}°C ({(gasTempC + 273.15).toFixed(1)} K)</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="300"
                      step="5"
                      value={gasTempC}
                      onChange={(e) => setGasTempC(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ideal Gas Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Calculated State Variable (Solving for {gasSolveFor})
                </span>

                <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-amber-500">
                  {gasSolveFor === 'P' && `${gasResults.P_atm.toFixed(3)} atm`}
                  {gasSolveFor === 'V' && `${gasResults.V_L.toFixed(2)} Liters`}
                  {gasSolveFor === 'n' && `${gasResults.n_mol.toFixed(3)} moles`}
                  {gasSolveFor === 'T' && `${gasResults.T_C.toFixed(1)} °C (${gasResults.T_K.toFixed(1)} K)`}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-400 block">Pressure in SI (kPa):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{gasResults.P_kPa.toFixed(1)} kPa</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-400 block">Molar Volume (V_m):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{gasResults.molarVolume.toFixed(2)} L/mol</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  Universal Gas Constant: <strong>R = 8.31446 J/(mol·K) = 0.08206 L·atm/(mol·K)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 3: PERIODIC TABLE & MOLAR MASS
        ========================================================================= */}
        {mode === 'chemistry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Chemical Formula Molar Mass Solver
                </h3>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Enter Chemical Formula:
                  </label>
                  <input
                    type="text"
                    value={chemicalFormula}
                    onChange={(e) => setChemicalFormula(e.target.value)}
                    placeholder="e.g. C6H12O6, H2SO4, NaCl"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-base focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Common Chemical Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['H2O', 'CO2', 'NaCl', 'H2SO4', 'C6H12O6', 'C8H10N4O2'].map((formula) => (
                      <button
                        key={formula}
                        onClick={() => setChemicalFormula(formula)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-semibold transition"
                      >
                        {formula}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Single Element Quick Selector */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Or Select Single Element (Periodic Table):
                  </span>
                  <select
                    value={selectedElementSymbol}
                    onChange={(e) => setSelectedElementSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
                  >
                    {PERIODIC_TABLE_ELEMENTS.map((el) => (
                      <option key={el.symbol} value={el.symbol}>
                        {el.number}. {el.name} ({el.symbol}) — {el.mass.toFixed(3)} g/mol
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Molar Mass Breakdown Output */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Molecular Weight (Molar Mass)
                </span>

                {molarMassResults.valid ? (
                  <>
                    <div className="text-3xl font-extrabold font-mono tabular-nums text-cyan-600 dark:text-cyan-400">
                      {molarMassResults.totalMass.toFixed(3)} <span className="text-sm font-normal text-slate-400">g / mol</span>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Elemental Mass Breakdown:
                      </span>
                      {molarMassResults.breakdown.map((item) => (
                        <div key={item.symbol} className="text-xs font-mono">
                          <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-0.5">
                            <span>{item.name} ({item.symbol} × {item.count})</span>
                            <span className="font-bold">{item.percent.toFixed(1)}% ({item.totalElementMass.toFixed(2)} g/mol)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-cyan-500 h-full rounded-full"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-rose-500 font-semibold p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
                    {molarMassResults.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 4: ASTRONOMY & ORBITAL MECHANICS
        ========================================================================= */}
        {mode === 'astronomy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  Celestial Central Body & Orbit
                </h3>

                {/* Celestial Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(CELESTIAL_BODIES).map(([key, body]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedBodyKey(key);
                        setCustomAltitude(body.defaultAltitude);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs transition ${
                        selectedBodyKey === key
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold">{body.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">g = {body.surfaceGravity} m/s²</div>
                    </button>
                  ))}
                </div>

                {/* Orbital Altitude Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Orbital Altitude (Above Surface)</span>
                    <span className="font-mono tabular-nums">{customAltitude.toLocaleString()} km</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="50000"
                    step="50"
                    value={customAltitude}
                    onChange={(e) => setCustomAltitude(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Orbital Speed Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Circular Orbital Speed */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Circular Orbital Speed (v)
                  </span>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {orbitalResults.orbitalVelocityKmps.toFixed(2)} <span className="text-sm font-normal text-slate-400">km/s</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    ({(orbitalResults.orbitalVelocityKmps * 3600).toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h)
                  </div>
                </div>

                {/* Escape Velocity */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Escape Velocity (v_e)
                  </span>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-purple-600 dark:text-purple-400">
                    {orbitalResults.escapeVelocityKmps.toFixed(2)} <span className="text-sm font-normal text-slate-400">km/s</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    exact √2 × orbital velocity
                  </div>
                </div>
              </div>

              {/* Orbital Period Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Keplerian Orbital Period (T)
                  </span>
                  <span className="font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400 text-base">
                    {orbitalResults.periodHours}h {orbitalResults.periodMins}m
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono">
                  Orbital Radius from Center: {orbitalResults.orbitalRadiusKm.toLocaleString()} km
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 5: QUANTUM PHOTON & WAVES
        ========================================================================= */}
        {mode === 'quantum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Atom className="w-5 h-5 text-cyan-500" />
                  Electromagnetic Wavelength Input
                </h3>

                {/* Wavelength Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Wavelength (λ) in Nanometers (nm)</span>
                    <span className="font-mono tabular-nums">{wavelengthNm} nm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="1500"
                    step="1"
                    value={wavelengthNm}
                    onChange={(e) => setWavelengthNm(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Laser Presets */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Laser & Emission Presets:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setWavelengthNm(632.8)}
                      className="px-2 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold font-mono"
                    >
                      HeNe Red (633nm)
                    </button>
                    <button
                      onClick={() => setWavelengthNm(532.0)}
                      className="px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold font-mono"
                    >
                      DPSS Green (532nm)
                    </button>
                    <button
                      onClick={() => setWavelengthNm(405.0)}
                      className="px-2 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900 text-xs font-semibold font-mono"
                    >
                      Blu-ray Violet (405nm)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantum Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Photon Energy eV */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Photon Energy (eV)
                  </span>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-cyan-600 dark:text-cyan-400">
                    {quantumResults.energyEV.toFixed(3)} <span className="text-sm font-normal text-slate-400">eV</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    quantum energy per single photon
                  </div>
                </div>

                {/* Frequency THz */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Wave Frequency (f)
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${quantumResults.bandColor}`}>
                      {quantumResults.band}
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                    {quantumResults.frequencyTHz.toFixed(1)} <span className="text-sm font-normal text-slate-400">THz</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {quantumResults.frequencyHz.toExponential(3)} Hz
                  </div>
                </div>
              </div>

              {/* Energy in Joules Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Energy in SI Joules (J):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{quantumResults.energyJoules.toExponential(4)} J</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spectroscopic Wavenumber:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{quantumResults.waveNumberCm.toFixed(1)} cm⁻¹</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
