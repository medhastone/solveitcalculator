'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import ElectricalSeoSection from './ElectricalSeoSection';

export default function ElectricalClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Workbench 1: Cable Sizing ---
  const [wb1Current, setWb1Current] = useState<number>(45);
  const [wb1Voltage, setWb1Voltage] = useState<number>(240);
  const [wb1Conductor, setWb1Conductor] = useState<string>('copper75');
  const [wb1Length, setWb1Length] = useState<number>(120);

  const cableResult = useMemo(() => {
    const current = Number(wb1Current) || 0;
    const voltage = Number(wb1Voltage) || 240;
    const length = Number(wb1Length) || 0;
    const k = wb1Conductor === 'aluminum' ? 21.2 : 12.9;

    let gauge = '14 AWG';
    let mm2 = '2.08';
    let cmil = 4110;
    let ampacity = 20;

    if (current <= 15) { gauge = '14 AWG'; mm2 = '2.08'; cmil = 4110; ampacity = 20; }
    else if (current <= 20) { gauge = '12 AWG'; mm2 = '3.31'; cmil = 6530; ampacity = 25; }
    else if (current <= 30) { gauge = '10 AWG'; mm2 = '5.26'; cmil = 10380; ampacity = 35; }
    else if (current <= 50) { gauge = '8 AWG'; mm2 = '8.37'; cmil = 16510; ampacity = 50; }
    else if (current <= 65) { gauge = '6 AWG'; mm2 = '13.3'; cmil = 26240; ampacity = 65; }
    else if (current <= 85) { gauge = '4 AWG'; mm2 = '21.2'; cmil = 41740; ampacity = 85; }
    else if (current <= 115) { gauge = '2 AWG'; mm2 = '33.6'; cmil = 66360; ampacity = 115; }
    else if (current <= 150) { gauge = '1/0 AWG'; mm2 = '53.5'; cmil = 105600; ampacity = 150; }
    else if (current <= 175) { gauge = '2/0 AWG'; mm2 = '67.4'; cmil = 133100; ampacity = 175; }
    else if (current <= 230) { gauge = '4/0 AWG'; mm2 = '107.2'; cmil = 211600; ampacity = 230; }
    else { gauge = '350 kcmil'; mm2 = '177.3'; cmil = 350000; ampacity = 310; }

    const is3Phase = (voltage === 208 || voltage === 480);
    const multiplier = is3Phase ? 1.732 : 2.0;
    const vDrop = (multiplier * k * current * length) / cmil;
    const vDropPercent = (vDrop / voltage) * 100;
    const resistance = (k * length * (is3Phase ? 1 : 2)) / cmil;
    const lossWatts = Math.pow(current, 2) * resistance;

    return {
      gauge,
      mm2,
      ampacity,
      vDropPercent: vDropPercent.toFixed(2),
      vDropVolts: vDrop.toFixed(2),
      lossWatts: lossWatts.toFixed(1),
      isCompliant: vDropPercent <= 3.0
    };
  }, [wb1Current, wb1Voltage, wb1Conductor, wb1Length]);

  // --- Workbench 2: Transformer Capacity ---
  const [wb2Kva, setWb2Kva] = useState<number>(75);
  const [wb2PrimaryV, setWb2PrimaryV] = useState<number>(480);
  const [wb2SecondaryV, setWb2SecondaryV] = useState<number>(208);

  const transformerResult = useMemo(() => {
    const kva = Number(wb2Kva) || 0;
    const pV = Number(wb2PrimaryV) || 480;
    const sV = Number(wb2SecondaryV) || 208;

    const pFla = (kva * 1000) / (Math.sqrt(3) * pV);
    const sFla = (kva * 1000) / (Math.sqrt(3) * sV);
    const pBreaker = Math.round(pFla * 1.25);
    const sBreaker = Math.round(sFla * 1.25);
    const ratio = (pV / sV).toFixed(2);

    return {
      pFla: pFla.toFixed(1),
      sFla: sFla.toFixed(1),
      pBreaker,
      sBreaker,
      ratio
    };
  }, [wb2Kva, wb2PrimaryV, wb2SecondaryV]);

  // --- Workbench 3: Motor FLA ---
  const [wb3Hp, setWb3Hp] = useState<number>(25);
  const [wb3Voltage, setWb3Voltage] = useState<number>(460);
  const [wb3Eff, setWb3Eff] = useState<number>(93);
  const [wb3Pf, setWb3Pf] = useState<number>(0.86);

  const motorResult = useMemo(() => {
    const hp = Number(wb3Hp) || 0;
    const v = Number(wb3Voltage) || 460;
    const eff = (Number(wb3Eff) || 93) / 100;
    const pf = Number(wb3Pf) || 0.86;

    const watts = hp * 746;
    const fla = watts / (Math.sqrt(3) * v * eff * pf);
    const lra = fla * 6.0;
    const tol = fla * 1.15;
    const kw = (watts / 1000).toFixed(2);

    let wire = '12 AWG';
    const wireCurrent = fla * 1.25;
    if (wireCurrent <= 15) wire = '14 AWG';
    else if (wireCurrent <= 20) wire = '12 AWG';
    else if (wireCurrent <= 30) wire = '10 AWG';
    else if (wireCurrent <= 50) wire = '8 AWG';
    else if (wireCurrent <= 65) wire = '6 AWG';
    else if (wireCurrent <= 85) wire = '4 AWG';
    else if (wireCurrent <= 115) wire = '2 AWG';
    else wire = '1/0 AWG';

    return {
      fla: fla.toFixed(1),
      lra: lra.toFixed(1),
      tol: tol.toFixed(1),
      wire,
      kw
    };
  }, [wb3Hp, wb3Voltage, wb3Eff, wb3Pf]);

  // --- Workbench 4: Solar PV Array ---
  const [wb4Energy, setWb4Energy] = useState<number>(32);
  const [wb4Sun, setWb4Sun] = useState<number>(4.8);
  const [wb4Autonomy, setWb4Autonomy] = useState<number>(2);

  const solarResult = useMemo(() => {
    const energy = Number(wb4Energy) || 32;
    const sunHours = Number(wb4Sun) || 4.8;
    const autonomy = Number(wb4Autonomy) || 2;

    const pr = 0.80; // Performance ratio
    const dod = 0.80; // Depth of discharge
    const sysVoltage = 48; // 48Vdc bus

    const kwp = energy / (sunHours * pr);
    const panels = Math.ceil((kwp * 1000) / 400);
    const storageKwh = (energy * autonomy) / dod;
    const storageAh = Math.round((storageKwh * 1000) / sysVoltage);
    const annualMwh = ((kwp * sunHours * 365 * pr) / 1000).toFixed(1);
    const inverterKw = Math.ceil(kwp * 1.2);

    return {
      kwp: kwp.toFixed(2),
      panels,
      storageAh,
      storageKwh: storageKwh.toFixed(1),
      inverterKw,
      annualMwh
    };
  }, [wb4Energy, wb4Sun, wb4Autonomy]);

  // --- Multi-Step Project Workflow State ---
  const [workflowStep, setWorkflowStep] = useState<number>(1);
  const workflowData: Record<number, {
    badge: string;
    title: string;
    desc: string;
    formula: string;
    metrics: Array<{ label: string; val: string }>;
  }> = {
    1: {
      badge: "STAGE 1: CONSUMPTION",
      title: "Residential & Facility Daily Energy Audit",
      desc: "Summation of continuous and intermittent loads throughout a 24-hour diurnal cycle. In this benchmark project, base load is 850W with afternoon HVAC peaks reaching 4.8 kW.",
      formula: "E_day = Σ (Power_i × Hours_i)",
      metrics: [
        { label: "Base Consumption", val: "20.4 kWh" },
        { label: "HVAC Demand", val: "8.1 kWh" },
        { label: "Total Evaluated", val: "28.5 kWh/day" }
      ]
    },
    2: {
      badge: "STAGE 2: PV ARRAY SIZING",
      title: "Photovoltaic Peak Generation Modeling",
      desc: "Sizing solar capacity based on regional Peak Sun Hours (PSH = 4.5 hrs/day) and standard balance of system (BOS) loss factor of 18%.",
      formula: "Array_kWp = Daily_kWh / (PSH × η_sys)",
      metrics: [
        { label: "Required Peak", val: "7.4 kWp" },
        { label: "400W Modules", val: "19 Panels" },
        { label: "Required Roof", val: "38 m² (409 sq ft)" }
      ]
    },
    3: {
      badge: "STAGE 3: ENERGY STORAGE",
      title: "LiFePO4 Battery Bank & Autonomy Reserve",
      desc: "Autonomy sizing for 1.5 days off-grid security factoring lithium iron phosphate 80% maximum Depth of Discharge (DoD) to assure 4,000+ lifecycle longevity.",
      formula: "Capacity_kWh = (E_day × Days) / DoD",
      metrics: [
        { label: "Total Storage", val: "20.4 kWh" },
        { label: "DC Bus Voltage", val: "48 Vdc" },
        { label: "Ampacity Bank", val: "425 Ah @ 48V" }
      ]
    },
    4: {
      badge: "STAGE 4: INVERTER & MPPT",
      title: "Hybrid Inverter & Charge Controller Pairing",
      desc: "Matching inverter continuous rating to max coincident demand while keeping MPPT voltage thresholds within VOC string temperature extremes (-10°C to +45°C).",
      formula: "P_inv ≥ P_peak_load × 1.25",
      metrics: [
        { label: "Hybrid Inverter", val: "8.0 kW" },
        { label: "Max DC Input", val: "10 kWp" },
        { label: "Dual MPPT Range", val: "120V - 500V" }
      ]
    },
    5: {
      badge: "STAGE 5: CONDUCTORS & PROTECTION",
      title: "Solar DC String & AC Interconnection Sizing",
      desc: "Conductor verification ensuring DC wire losses remain under 1.5% at maximum string voltage (450V) with 15A gPV inline fused disconnects.",
      formula: "VD% = (2 × K × I × L / CM) × 100 < 2%",
      metrics: [
        { label: "PV DC Wire", val: "10 AWG Copper" },
        { label: "AC Interconnect", val: "40A Dual Pole" },
        { label: "DC Disconnect", val: "600V 25A Double" }
      ]
    },
    6: {
      badge: "STAGE 6: FINANCIAL RECOVERY",
      title: "Turnkey Capex, Tax Credits & Payback Period",
      desc: "Financial payback amortization factoring federal clean energy tax credits, avoided tiered retail electricity costs, and ongoing inverter warranties.",
      formula: "Payback = Net_Capex / Annual_Savings",
      metrics: [
        { label: "Gross Capex", val: "$16,800" },
        { label: "Net Post-Credit", val: "$11,760 (30% off)" },
        { label: "Simple Payback", val: "5.8 Years" }
      ]
    }
  };

  // --- Smart Electrical Assistant Disciplines ---
  const [selectedDiscipline, setSelectedDiscipline] = useState<'home' | 'solar' | 'industrial' | 'motor' | 'transformer' | 'backup' | 'electronics'>('home');

  const disciplineData = {
    home: {
      badge: "HOME & RESIDENTIAL WIRING",
      heading: "Home Electrical & Circuit Package",
      summary: "Recommended calculators for whole-house 100A, 200A, or 400A electrical service, kitchen circuits, and Level 2 EV charging.",
      tools: [
        { name: "1. Wire & Cable Size Sizer", link: "#workbench-cable" },
        { name: "2. 200A Home Service Panel Calculator", link: "#cat-17" },
        { name: "3. Circuit Breaker Sizer", link: "#cat-4" },
        { name: "4. Conduit Pipe Fill Sizer", link: "#cat-3" }
      ]
    },
    solar: {
      badge: "SOLAR POWER & STORAGE",
      heading: "Solar Energy & Battery Package",
      summary: "Complete solar planning from peak sun hours and charge controllers to battery capacity and backup days.",
      tools: [
        { name: "1. Solar Panel Array Calculator", link: "#workbench-solar" },
        { name: "2. MPPT Charge Controller Sizer", link: "#cat-9" },
        { name: "3. Battery Storage Capacity (Ah)", link: "#cat-10" },
        { name: "4. Solar DC Wire Sizer", link: "#workbench-cable" }
      ]
    },
    industrial: {
      badge: "FACTORY & COMMERCIAL POWER",
      heading: "Commercial & Factory Power Setup",
      summary: "Heavy power tools including copper and aluminum busbar sizing, power factor capacitor banks, and transformer loads.",
      tools: [
        { name: "1. Busbar Current Capacity (A/mm²)", link: "#cat-18" },
        { name: "2. Power Factor Correction (kVAr)", link: "#cat-11" },
        { name: "3. Transformer Full Load Amps", link: "#workbench-transformer" },
        { name: "4. Electrical Ground Fault Loop", link: "#cat-4" }
      ]
    },
    motor: {
      badge: "ELECTRIC MOTORS & DRIVES",
      heading: "Motor Current & Starter Setup",
      summary: "Find motor running current, starting surge amps, speed controller sizing, and overload protection settings.",
      tools: [
        { name: "1. Motor Current & Starting Calculator", link: "#workbench-motor" },
        { name: "2. Motor Torque & Speed Calculator", link: "#cat-7" },
        { name: "3. Speed Controller (VFD) Sizer", link: "#cat-7" },
        { name: "4. Motor Feeder Wire Sizer", link: "#cat-18" }
      ]
    },
    transformer: {
      badge: "TRANSFORMERS & SUBSTATIONS",
      heading: "Transformer Capacity & Ratings",
      summary: "Calculate transformer power ratings, primary and secondary currents, voltage step-up/down, and circuit breakers.",
      tools: [
        { name: "1. Transformer Power Calculator", link: "#workbench-transformer" },
        { name: "2. Short Circuit Fault Sizer", link: "#cat-6" },
        { name: "3. Power Losses & Efficiency", link: "#cat-6" },
        { name: "4. Three-Phase Voltage Setup", link: "#cat-5" }
      ]
    },
    backup: {
      badge: "BACKUP POWER & GENERATORS",
      heading: "Emergency Power & Generator Setup",
      summary: "Calculate battery backup runtime in hours, generator power needs, fuel consumption, and transfer switches.",
      tools: [
        { name: "1. Battery Backup Runtime in Hours", link: "#cat-10" },
        { name: "2. Generator Sizing & Fuel Calculator", link: "#cat-8" },
        { name: "3. Automatic Transfer Switch (ATS)", link: "#cat-8" },
        { name: "4. Inverter Surge Power Sizer", link: "#cat-10" }
      ]
    },
    electronics: {
      badge: "ELECTRONICS & CIRCUITS",
      heading: "Circuits & Electronic Components",
      summary: "Calculate LED resistors, timers, filter frequencies, and component values with easy formulas.",
      tools: [
        { name: "1. LED Resistor Calculator", link: "#cat-12" },
        { name: "2. Circuit Impedance Calculator", link: "#cat-13" },
        { name: "3. Resistor Color Code (4/5 Band)", link: "#cat-14" },
        { name: "4. Resonant Frequency Calculator", link: "#cat-13" }
      ]
    }
  };

  // --- 20-Category Directory Data ---
  const categoriesList = [
    {
      num: '01',
      id: 'cat-1',
      title: 'Basic Electrical',
      desc: "Ohm's law, power formulas, and circuit basics.",
      badge: 'FUNDAMENTALS',
      tag: 'BASIC LAWS',
      count: '8 Tools',
      color: 'primary',
      tools: [
        "Ohm's Law Calculator",
        "Voltage, Current & Resistance",
        "DC Power Calculator",
        "Joule's Law Heating",
        "Electrical Energy (kWh)",
        "AC Power Triangle",
        "Electrical Efficiency",
        "Conductance & Admittance"
      ]
    },
    {
      num: '02',
      id: 'cat-2',
      title: 'Power Calculators',
      desc: 'Convert between watts, amps, volts, kW, and kVA.',
      badge: 'POWER CONVERSIONS',
      tag: 'POWER FORMULAS',
      count: '8 Tools',
      color: 'secondary',
      tools: [
        "Watts to Amps",
        "Volts to Watts",
        "kW to Amps",
        "kVA to Amps",
        "kW to kVA",
        "Horsepower to kW",
        "Horsepower to Amps",
        "BTU/hr to kW"
      ]
    },
    {
      num: '03',
      id: 'cat-3',
      title: 'Cable & Wire Sizing',
      desc: 'Wire gauge, voltage drop, and conduit fill.',
      badge: 'POPULAR TOOLS',
      tag: 'WIRE SIZING',
      count: '8 Tools',
      color: 'primary',
      featuredTool: 'Cable Size Calculator',
      tools: [
        "AWG Wire Gauge Index",
        "SWG to mm² Converter",
        "Ampacity Sizer",
        "Voltage Drop Calculator",
        "Conductor Resistance",
        "Conduit Fill Sizer",
        "Temperature Derating",
        "Max Run Length"
      ]
    },
    {
      num: '04',
      id: 'cat-4',
      title: 'Circuit Protection',
      desc: 'Breakers, fuse ratings, and trip curves.',
      badge: 'PROTECTION',
      tag: 'SAFETY & TRIPPING',
      count: '7 Tools',
      color: 'secondary',
      tools: [
        "MCB Curve Sizer (B, C, D)",
        "MCCB Industrial Breaker",
        "HRC Fuse Sizing",
        "Frame & Trip Rating",
        "Earth Fault Impedance",
        "Short-Circuit Current",
        "Relay Coordination"
      ]
    },
    {
      num: '05',
      id: 'cat-5',
      title: 'Three Phase Systems',
      desc: '3-phase power, voltage, and load balancing.',
      badge: 'THREE-PHASE',
      tag: 'DISTRIBUTION',
      count: '8 Tools',
      color: 'primary',
      tools: [
        "Three-Phase Power",
        "Three-Phase Current",
        "Line vs Phase Voltage",
        "Neutral Current (3Φ)",
        "Voltage Imbalance",
        "Load Balancing",
        "Star-Delta Conversion",
        "Two-Wattmeter Method"
      ]
    },
    {
      num: '06',
      id: 'cat-6',
      title: 'Transformers',
      desc: 'kVA rating, full-load amps, and protection.',
      badge: 'TRANSFORMERS',
      tag: 'VOLTAGE CONVERSION',
      count: '5 Tools',
      color: 'primary',
      featuredTool: 'Transformer kVA Sizer',
      tools: [
        "Primary & Secondary FLA",
        "Core & Copper Losses",
        "Turns Ratio & Voltage",
        "Impedance Fault Current",
        "Transformer Inrush"
      ]
    },
    {
      num: '07',
      id: 'cat-7',
      title: 'Motors',
      desc: 'Motor FLA, starting surge, and controllers.',
      badge: 'MOTORS & DRIVES',
      tag: 'MOTOR FLA',
      count: '7 Tools',
      color: 'secondary',
      featuredTool: 'Motor Full Load Amps',
      tools: [
        "Shaft Power & Output kW",
        "Motor Efficiency (IE1–IE4)",
        "Motor Torque from RPM",
        "Speed & Slip %",
        "Starting Current (LRA)",
        "VFD Sizing",
        "Thermal Overload Setting"
      ]
    },
    {
      num: '08',
      id: 'cat-8',
      title: 'Generators & DG Sets',
      desc: 'Generator kVA sizing, fuel use, and switches.',
      badge: 'GENERATORS',
      tag: 'BACKUP POWER',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "Prime & Standby kVA",
        "Fuel Consumption",
        "Alternator Derating",
        "Max Starting kVA",
        "Demand Factor",
        "Transfer Switch (ATS)"
      ]
    },
    {
      num: '09',
      id: 'cat-9',
      title: 'Solar Energy (PV)',
      desc: 'Solar panels, controllers, and battery storage.',
      badge: 'SOLAR POWER',
      tag: 'CLEAN ENERGY',
      count: '8 Tools',
      color: 'tertiary',
      featuredTool: 'Solar PV Array Sizer',
      tools: [
        "MPPT Charge Controller",
        "Solar Inverter Rating",
        "Annual Solar Yield",
        "LCOE Energy Cost",
        "Solar Payback & ROI",
        "DC Cable Voltage Drop",
        "Tilt & Azimuth Angle",
        "Off-Grid Autonomy"
      ]
    },
    {
      num: '10',
      id: 'cat-10',
      title: 'Batteries & UPS Systems',
      desc: 'Battery runtime, Ah capacity, and UPS sizing.',
      badge: 'BATTERY BACKUP',
      tag: 'ENERGY STORAGE',
      count: '7 Tools',
      color: 'secondary',
      tools: [
        "Backup Runtime Hours",
        "Battery Capacity (Ah)",
        "C-Rate & Charge Time",
        "Battery Bank Wiring",
        "Online UPS Sizer",
        "Lead-Acid vs LiFePO4",
        "Surge Overload Capacity"
      ]
    },
    {
      num: '11',
      id: 'cat-11',
      title: 'Power Quality',
      desc: 'Power factor correction and harmonics.',
      badge: 'POWER FACTOR',
      tag: 'POWER QUALITY',
      count: '7 Tools',
      color: 'primary',
      tools: [
        "Power Factor Correction",
        "Harmonic Distortion (% THD)",
        "Voltage Unbalance (VUF)",
        "Reactive Power (kVAr)",
        "APFC Steps Sizer",
        "Harmonic Filter Sizing",
        "K-Factor Transformer"
      ]
    },
    {
      num: '12',
      id: 'cat-12',
      title: 'Electronics',
      desc: 'LED resistors, voltage dividers, and timers.',
      badge: 'ELECTRONICS',
      tag: 'CIRCUIT DESIGN',
      count: '8 Tools',
      color: 'secondary',
      tools: [
        "LED Limiting Resistor",
        "Voltage Divider Rule",
        "Current Divider Rule",
        "Capacitor Transient",
        "Inductor Energy Storage",
        "RC Time Constant",
        "555 Timer Calculator",
        "Op-Amp Gain Sizer"
      ]
    },
    {
      num: '13',
      id: 'cat-13',
      title: 'RLC & AC Circuits',
      desc: 'Impedance, reactance, and resonant frequency.',
      badge: 'AC CIRCUITS',
      tag: 'REACTANCE',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "Capacitive Reactance",
        "Inductive Reactance",
        "AC Impedance",
        "Resonant Frequency",
        "RLC Quality Factor (Q)",
        "Signal Wavelength"
      ]
    },
    {
      num: '14',
      id: 'cat-14',
      title: 'Component Tools',
      desc: 'Resistor color codes, SMD codes, and diodes.',
      badge: 'COMPONENTS',
      tag: 'COLOR CODES',
      count: '6 Tools',
      color: 'secondary',
      tools: [
        "Resistor Color Codes",
        "SMD Resistor Codes",
        "Capacitor Markings",
        "Inductor Color Codes",
        "BJT Transistor Bias",
        "Zener Diode Regulator"
      ]
    },
    {
      num: '15',
      id: 'cat-15',
      title: 'Lighting & Photometrics',
      desc: 'Room lighting needs, lux to lumens, and LED.',
      badge: 'LIGHTING',
      tag: 'LUMENS & LUX',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "Lux to Lumens Sizer",
        "Foot-Candles to Lux",
        "Room Cavity Ratio (RCR)",
        "LED Energy Savings",
        "Recommended Lux Levels",
        "Emergency Egress Lighting"
      ]
    },
    {
      num: '16',
      id: 'cat-16',
      title: 'Energy & Utility Cost',
      desc: 'Electricity bills, appliance costs, and savings.',
      badge: 'ENERGY BILLS',
      tag: 'COST SAVINGS',
      count: '6 Tools',
      color: 'secondary',
      tools: [
        "Electricity Bill Sizer",
        "Appliance Energy Cost",
        "Carbon Footprint (CO2)",
        "Peak Shifting (TOU)",
        "Peak Demand Surcharge",
        "Building Energy Audit"
      ]
    },
    {
      num: '17',
      id: 'cat-17',
      title: 'Home Electrical',
      desc: 'Panel sizing, branch circuits, and EV charging.',
      badge: 'HOME WIRING',
      tag: 'RESIDENTIAL',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "100A–400A Service Demand",
        "Branch Circuit Wire (Romex)",
        "240V Appliance Breaker",
        "Room Wattage Allocator",
        "Heat Pump Circuit (MCA)",
        "EV Level 2 Charger Feeder"
      ]
    },
    {
      num: '18',
      id: 'cat-18',
      title: 'Industrial Electrical',
      desc: 'Plant load, busbar ampacity, and MCC panels.',
      badge: 'INDUSTRIAL',
      tag: 'FACTORY LOADS',
      count: '6 Tools',
      color: 'secondary',
      tools: [
        "Plant Diversity Factor",
        "MCC Busbar Rating",
        "Busbar Ampacity (A/mm²)",
        "Substation Switchgear",
        "Continuous Demand Load",
        "Group Motor Feeder"
      ]
    },
    {
      num: '19',
      id: 'cat-19',
      title: 'EV & Electric Mobility',
      desc: 'EV charge time, charger breaker, and costs.',
      badge: 'EV CHARGING',
      tag: 'CHARGING SPEED',
      count: '5 Tools',
      color: 'primary',
      tools: [
        "EV Charging Time",
        "EV Charger Breaker",
        "Usable Battery kWh",
        "EV vs Gas Cost / Mile",
        "Charging Power (kW)"
      ]
    },
    {
      num: '20',
      id: 'cat-20',
      title: 'Electrical Unit Conversions',
      desc: 'Quick conversions for volts, amps, and watts.',
      badge: 'CONVERSIONS',
      tag: 'UNIT CONVERTER',
      count: '8 Units',
      color: 'secondary',
      tools: [
        "Voltage (V, mV, kV)",
        "Current (A, mA, kA)",
        "Resistance (Ω, kΩ, MΩ)",
        "Power (W, kW, HP)",
        "Frequency (Hz, kHz, MHz)",
        "Capacitance (µF, nF, pF)",
        "Inductance (mH, µH, H)",
        "Energy (kWh, Wh, Joules)"
      ]
    }
  ];

  // Search filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesList;
    const q = searchQuery.toLowerCase();
    return categoriesList
      .map(cat => ({
        ...cat,
        tools: cat.tools.filter(
          t => t.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q)
        )
      }))
      .filter(cat => cat.tools.length > 0 || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q));
  }, [searchQuery, categoriesList]);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col justify-between">
      

      <main className="w-full pt-16 bg-background flex-1">
        {/* Verification & Electrical Standards Sub-Bar */}
        <div className="w-full bg-surface-container-low border-b border-outline-variant/15 sticky top-16 z-40 backdrop-blur-md bg-surface-container-low/95">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xs flex flex-col md:flex-row items-center justify-between gap-space-xs">
            <div className="flex items-center gap-space-xs overflow-x-auto w-full no-scrollbar py-1 text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
              <span className="px-space-xs py-1 rounded-md bg-primary-container text-on-primary-container font-semibold whitespace-nowrap flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>All Electrical Tools
              </span>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#workbench-cable">Cables &amp; Sizing</a>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#cat-4">Circuit Protection</a>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#cat-5">3-Phase Systems</a>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#workbench-transformer">Transformers &amp; Motors</a>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#workbench-solar">Solar &amp; Batteries</a>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#cat-11">Power Quality</a>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#cat-12">Electronics &amp; RLC</a>
              <a className="px-space-xs py-1 rounded-md hover:bg-surface-container hover:text-on-surface whitespace-nowrap transition-colors" href="#directory">All 20 Categories</a>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-2xl">
          <div className="flex flex-col gap-space-md max-w-4xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant" aria-label="Breadcrumb">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <span className="text-outline">&gt;</span>
              <span className="text-on-surface font-semibold">Electrical calculators</span>
            </nav>

            {/* Headline & Subtitle */}
            <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-on-surface font-bold tracking-tight">
              Electrical Calculators &amp; Sizing Tools
            </h1>

            {/* Real-time Quick Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Electrical Tools</span>
                <span className="font-numerical-display-mobile text-numerical-display-mobile text-primary font-bold">300+</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Across 20 Categories</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Industry Standards</span>
                <span className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface font-bold">NEC &amp; IEC</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Standard Electrical Codes</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Calculations Run</span>
                <span className="font-numerical-display-mobile text-numerical-display-mobile text-secondary font-bold">100K+</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Fast &amp; Accurate</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Instant Results</span>
                <span className="font-numerical-display-mobile text-numerical-display-mobile text-emerald-600 font-bold">No Waiting</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Runs 100% on your device</span>
              </div>
            </div>

            {/* Quick Command Input */}
            <div className="mt-space-sm relative">
              <div className="relative flex items-center shadow-md rounded-2xl bg-surface-container-lowest p-2 border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary ml-3 mr-2 text-[24px]">search</span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full py-2 bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-outline"
                  id="quickSearchInput"
                  placeholder="Jump directly to any calculator (e.g. 'Voltage Drop', 'Transformer Current', 'Ohm', 'Wire Size')..."
                  type="text"
                />
                <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs font-data-mono text-on-surface-variant bg-surface-container rounded-md mr-2 shadow-inner">
                  /
                </kbd>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-space-xs font-label-caps text-label-caps text-on-surface-variant">
                <span className="uppercase tracking-wider font-semibold">Fast Shortcuts:</span>
                {[
                  { label: 'Wire Sizer', href: '#workbench-cable' },
                  { label: 'Transformer Power', href: '#workbench-transformer' },
                  { label: 'Motor Current', href: '#workbench-motor' },
                  { label: 'Solar Panels', href: '#workbench-solar' },
                  { label: 'Conduit Fill', href: '#cat-3' },
                  { label: 'Power Factor', href: '#cat-11' },
                  { label: "Ohm's Law", href: '#cat-1' }
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary transition-all cursor-pointer font-bold"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Electrical Goal Finder */}
        <section className="w-full bg-surface-container-low py-space-2xl border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-space-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-[14px]">alt_route</span>QUICK START GOALS
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  What would you like to calculate today?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Select what you want to work on to open the recommended calculator right away.
                </p>
              </div>
              <span className="font-data-mono text-data-mono text-primary font-semibold">8 Popular Goals</span>
            </div>

            {/* 8 Visual Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[
                {
                  title: 'Wire Sizing & Drop',
                  count: '9 Tools',
                  desc: 'AWG wire gauge, voltage drop, and conduit fill.',
                  action: 'Size Wire',
                  icon: 'electric_bolt',
                  color: 'primary',
                  link: '#workbench-cable'
                },
                {
                  title: 'Circuit Breakers',
                  count: '7 Tools',
                  desc: 'Breaker ratings, fuses, and overload protection.',
                  action: 'Check Breakers',
                  icon: 'power',
                  color: 'secondary',
                  link: '#cat-4'
                },
                {
                  title: 'Solar PV Systems',
                  count: '9 Tools',
                  desc: 'Solar panel wattage, batteries, and inverters.',
                  action: 'Plan Solar',
                  icon: 'wb_sunny',
                  color: 'tertiary',
                  link: '#workbench-solar'
                },
                {
                  title: 'Industrial Power',
                  count: '6 Tools',
                  desc: 'Commercial loads, transformers, and busbars.',
                  action: 'Plant Power',
                  icon: 'factory',
                  color: 'primary',
                  link: '#workbench-transformer'
                },
                {
                  title: 'Battery Backup',
                  count: '7 Tools',
                  desc: 'Runtime hours, Ah capacity, and UPS sizing.',
                  action: 'Check Battery',
                  icon: 'battery_charging_full',
                  color: 'secondary',
                  link: '#cat-10'
                },
                {
                  title: 'Electric Motors',
                  count: '8 Tools',
                  desc: 'Motor FLA, starting surge, and protection.',
                  action: 'Size Motor',
                  icon: 'settings_slow_motion',
                  color: 'primary',
                  link: '#workbench-motor'
                },
                {
                  title: 'Home Panel Demand',
                  count: '6 Tools',
                  desc: '100A–400A panel demand and EV circuits.',
                  action: 'Home Panel',
                  icon: 'roofing',
                  color: 'tertiary',
                  link: '#cat-17'
                },
                {
                  title: 'Energy & Utility Bills',
                  count: '6 Tools',
                  desc: 'Appliance costs, peak hours, and savings.',
                  action: 'Power Savings',
                  icon: 'query_stats',
                  color: 'secondary',
                  link: '#cat-16'
                }
              ].map(card => (
                <a
                  key={card.title}
                  className="group p-space-lg rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-sm hover:shadow-md flex flex-col justify-between border border-outline-variant/30"
                  href={card.link}
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform ${
                        card.color === 'primary'
                          ? 'bg-primary/10 text-primary'
                          : card.color === 'secondary'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-tertiary-container/10 text-tertiary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">{card.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                        {card.count}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div
                    className={`mt-space-md flex items-center gap-1 font-body-sm text-body-sm font-bold ${
                      card.color === 'primary'
                        ? 'text-primary'
                        : card.color === 'secondary'
                        ? 'text-secondary'
                        : 'text-tertiary'
                    }`}
                  >
                    {card.action} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Workbenches */}
        <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
                POPULAR TOOLS
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Featured Electrical Calculators
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Try our most popular interactive calculators for wire sizing, transformers, motors, and solar backup.
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">Instant Calculation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
            {/* Workbench 1: Cable Sizing & Ampacity */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between border border-outline-variant/30" id="workbench-cable">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary text-on-primary">
                      <span className="material-symbols-outlined text-[20px]">cable</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Cable Sizing &amp; Ampacity</h3>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">NEC &amp; IEC Standards</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-label-caps text-label-caps font-semibold">
                    CODE OK
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Load Current (A)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest transition-all border border-outline-variant/20"
                      id="wb1-current"
                      type="number"
                      min="1"
                      max="600"
                      value={wb1Current}
                      onChange={e => setWb1Current(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">System Voltage</label>
                    <select
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb1-voltage"
                      value={wb1Voltage}
                      onChange={e => setWb1Voltage(parseFloat(e.target.value) || 240)}
                    >
                      <option value="120">120V 1-Phase</option>
                      <option value="240">240V 1-Phase</option>
                      <option value="208">208V 3-Phase</option>
                      <option value="480">480V 3-Phase</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Conductor Material</label>
                    <select
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb1-conductor"
                      value={wb1Conductor}
                      onChange={e => setWb1Conductor(e.target.value)}
                    >
                      <option value="copper75">Copper THHN (75°C)</option>
                      <option value="copper90">Copper THWN-2 (90°C)</option>
                      <option value="aluminum">Aluminum XHHW-2</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">One-Way Length (Feet)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest transition-all border border-outline-variant/20"
                      id="wb1-length"
                      type="number"
                      min="5"
                      max="2000"
                      value={wb1Length}
                      onChange={e => setWb1Length(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="mt-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-inner border border-outline-variant/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs text-center">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Conductor Gauge</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-primary font-bold block" id="wb1-out-gauge">
                      {cableResult.gauge}
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">{cableResult.mm2} mm²</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Ampacity Limit</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface font-bold block" id="wb1-out-ampacity">
                      {cableResult.ampacity} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">at 75°C</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Voltage Drop %</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-secondary font-bold block" id="wb1-out-vdrop">
                      {cableResult.vDropPercent}%
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">{cableResult.vDropVolts} Volts</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Line Heat Loss</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-emerald-600 font-bold block" id="wb1-out-loss">
                      {cableResult.lossWatts} W
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">I²R Dissipation</span>
                  </div>
                </div>
                <div className="mt-space-xs pt-space-xs border-t border-surface-container flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    {cableResult.isCompliant ? 'Voltage drop < 3% compliant' : 'Voltage drop exceeds 3%'}
                  </span>
                  <span className="font-data-mono text-xs text-primary">ρ = 10.4 Ω·cmil/ft</span>
                </div>
              </div>
            </div>

            {/* Workbench 2: Transformer Capacity & FLA */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between border border-outline-variant/30" id="workbench-transformer">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-secondary text-on-secondary">
                      <span className="material-symbols-outlined text-[20px]">swap_vertical_circle</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Transformer Full-Load &amp; Protection</h3>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">3-Phase kVA Sizing</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-label-caps font-semibold">
                    IEEE C57.12
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Transformer (kVA)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb2-kva"
                      type="number"
                      step="5"
                      min="5"
                      max="2500"
                      value={wb2Kva}
                      onChange={e => setWb2Kva(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Primary Voltage (V)</label>
                    <select
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb2-primary-v"
                      value={wb2PrimaryV}
                      onChange={e => setWb2PrimaryV(parseFloat(e.target.value) || 480)}
                    >
                      <option value="480">480 V (3Φ)</option>
                      <option value="4160">4,160 V (3Φ)</option>
                      <option value="12470">12,470 V (3Φ)</option>
                      <option value="240">240 V (3Φ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Secondary Voltage (V)</label>
                    <select
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb2-secondary-v"
                      value={wb2SecondaryV}
                      onChange={e => setWb2SecondaryV(parseFloat(e.target.value) || 208)}
                    >
                      <option value="208">208Y/120 V (3Φ)</option>
                      <option value="480">480Y/277 V (3Φ)</option>
                      <option value="240">240 V Delta (3Φ)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="mt-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-inner border border-outline-variant/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs text-center">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Primary FLA</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-primary font-bold block" id="wb2-out-pfla">
                      {transformerResult.pFla} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">High-side Current</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Secondary FLA</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-secondary font-bold block" id="wb2-out-sfla">
                      {transformerResult.sFla} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">Low-side Current</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Primary Breaker</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface font-bold block" id="wb2-out-pbrek">
                      {transformerResult.pBreaker} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">125% Standard NEC</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Secondary Breaker</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-emerald-600 font-bold block" id="wb2-out-sbrek">
                      {transformerResult.sBreaker} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">125% Main Panel</span>
                  </div>
                </div>
                <div className="mt-space-xs pt-space-xs border-t border-surface-container flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Turns Ratio: <span className="font-data-mono font-semibold text-on-surface" id="wb2-out-ratio">{transformerResult.ratio}:1</span></span>
                  <span className="font-data-mono text-xs text-secondary">Balanced 3Φ Load</span>
                </div>
              </div>
            </div>

            {/* Workbench 3: 3-Phase Motor Starting & FLA */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between border border-outline-variant/30" id="workbench-motor">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary-container text-on-primary-container">
                      <span className="material-symbols-outlined text-[20px]">mode_fan</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Motor FLA &amp; Overload</h3>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">NEC &amp; NEMA Standards</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps font-semibold">
                    NEMA MG-1
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm mt-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1 text-xs">Motor Power (HP)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb3-hp"
                      type="number"
                      step="1"
                      min="1"
                      max="200"
                      value={wb3Hp}
                      onChange={e => setWb3Hp(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1 text-xs">Line Voltage (V)</label>
                    <select
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb3-voltage"
                      value={wb3Voltage}
                      onChange={e => setWb3Voltage(parseFloat(e.target.value) || 460)}
                    >
                      <option value="208">208 V</option>
                      <option value="230">230 V</option>
                      <option value="460">460 V</option>
                      <option value="575">575 V</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1 text-xs">Efficiency % (η)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb3-eff"
                      type="number"
                      step="1"
                      min="70"
                      max="98"
                      value={wb3Eff}
                      onChange={e => setWb3Eff(parseFloat(e.target.value) || 93)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1 text-xs">Power Factor (PF)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb3-pf"
                      type="number"
                      step="0.01"
                      min="0.5"
                      max="1.0"
                      value={wb3Pf}
                      onChange={e => setWb3Pf(parseFloat(e.target.value) || 0.86)}
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="mt-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-inner border border-outline-variant/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs text-center">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Full-Load FLA</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-primary font-bold block" id="wb3-out-fla">
                      {motorResult.fla} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">Continuous Running</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Locked Rotor (~6x)</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-error font-bold block" id="wb3-out-lra">
                      {motorResult.lra} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">Code G Surge</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Thermal Overload</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-secondary font-bold block" id="wb3-out-tol">
                      {motorResult.tol} A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">115% Relay Dial</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Min Conductor</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-emerald-600 font-bold block" id="wb3-out-wire">
                      {motorResult.wire}
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">125% Branch</span>
                  </div>
                </div>
                <div className="mt-space-xs pt-space-xs border-t border-surface-container flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Shaft Mechanical Power: <span className="font-data-mono font-semibold text-on-surface" id="wb3-out-kw">{motorResult.kw} kW</span></span>
                  <span className="font-data-mono text-xs text-primary">NEC 430.22 (1.25×)</span>
                </div>
              </div>
            </div>

            {/* Workbench 4: Solar PV Array & Battery Storage */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between border border-outline-variant/30" id="workbench-solar">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-tertiary-container text-on-tertiary">
                      <span className="material-symbols-outlined text-[20px]">solar_power</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Solar PV &amp; Storage</h3>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">PV &amp; Battery Sizer</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps font-semibold">
                    IEC 62548
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Daily Energy (kWh)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb4-energy"
                      type="number"
                      step="1"
                      min="1"
                      max="500"
                      value={wb4Energy}
                      onChange={e => setWb4Energy(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Peak Sun Hours (h/day)</label>
                    <input
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb4-sun"
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="8.0"
                      value={wb4Sun}
                      onChange={e => setWb4Sun(parseFloat(e.target.value) || 4.8)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold block mb-1">Autonomy Reserve</label>
                    <select
                      className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20"
                      id="wb4-autonomy"
                      value={wb4Autonomy}
                      onChange={e => setWb4Autonomy(parseFloat(e.target.value) || 2)}
                    >
                      <option value="1">1 Day Reserve</option>
                      <option value="2">2 Days Reserve</option>
                      <option value="3">3 Days Reserve</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="mt-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-inner border border-outline-variant/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs text-center">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">PV Array Size</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-primary font-bold block" id="wb4-out-array">
                      {solarResult.kwp} kWp
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">{solarResult.panels} × 400W</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Battery Capacity</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface font-bold block" id="wb4-out-ah">
                      {solarResult.storageAh} Ah
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">@ 48V Bus ({solarResult.storageKwh} kWh)</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Inverter Rating</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-secondary font-bold block" id="wb4-out-inv">
                      {solarResult.inverterKw} kW
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">120% Sizing Buffer</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Annual Generation</span>
                    <span className="font-numerical-display-mobile text-numerical-display-mobile text-emerald-600 font-bold block" id="wb4-out-annual">
                      {solarResult.annualMwh} MWh
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant block">Clean Energy/yr</span>
                  </div>
                </div>
                <div className="mt-space-xs pt-space-xs border-t border-surface-container flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>LiFePO4 80% DoD &amp; 80% PR</span>
                  <span className="font-data-mono text-xs text-tertiary">DC String Loss &lt; 1.5%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Master Engineering Directory (All 20 Categories) */}
        <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/20" id="directory">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-sm">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
                  CALCULATOR DIRECTORY
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Explore All Electrical Calculators
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Browse 20 electrical categories with over 300+ calculators and sizing tools for electricians, engineers, and DIYers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="px-space-sm py-2 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm w-64"
                  id="categoryFilterInput"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter categories or tools..."
                  type="text"
                />
              </div>
            </div>

            {/* Master Grid of 20 Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg" id="categoriesContainer">
              {filteredCategories.map(cat => (
                <div
                  key={cat.id}
                  className="category-card p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30"
                  id={cat.id}
                >
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center font-data-mono text-xs font-bold">
                          {cat.num}
                        </span>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">{cat.title}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                        {cat.count}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">{cat.desc}</p>
                    <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface">
                      {cat.featuredTool && (
                        <li>
                          <a
                            className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container transition-colors font-bold text-primary"
                            href="#workbench-cable"
                          >
                            <span>{cat.featuredTool}</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
                          </a>
                        </li>
                      )}
                      {cat.tools.map(tool => (
                        <li key={tool}>
                          <a
                            className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container transition-colors font-bold text-on-surface hover:text-primary"
                            href="#"
                          >
                            <span>{tool}</span>
                            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-space-md pt-space-xs border-t border-surface-container font-label-caps text-label-caps text-primary flex items-center justify-between">
                    <span>{cat.badge}</span>
                    <span className="font-data-mono">{cat.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Interactive Multi-Step Project Workflow */}
        <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
          <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-md border border-outline-variant/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-space-lg gap-2">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
                  STEP-BY-STEP PROJECT GUIDE
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Complete Solar Installation Planning
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Follow these simple calculation stages to plan your residential or hybrid solar energy system.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-caps text-label-caps font-semibold">
                6-STAGE PROJECT GUIDE
              </div>
            </div>

            {/* Step Indicator Tracker */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs mb-space-lg">
              {[
                { step: 1, label: 'Energy Usage', sub: '28.5 kWh/day' },
                { step: 2, label: 'Solar Array Size', sub: '7.4 kW Peak' },
                { step: 3, label: 'Battery Storage', sub: '20.4 kWh LiFePO4' },
                { step: 4, label: 'Inverter & Controller', sub: '8 kW Hybrid 48V' },
                { step: 5, label: 'Wire & Breakers', sub: '10 AWG <2% drop' },
                { step: 6, label: 'Cost & Savings', sub: '5.8 yr Payback' }
              ].map(s => (
                <button
                  key={s.step}
                  onClick={() => setWorkflowStep(s.step)}
                  className={`workflow-btn p-space-sm rounded-xl text-left transition-all cursor-pointer ${
                    workflowStep === s.step
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="font-data-mono text-xs block opacity-80">STEP 0{s.step}</span>
                  <span className="font-body-sm text-body-sm font-bold block">{s.label}</span>
                  <span className="text-xs opacity-75">{s.sub}</span>
                </button>
              ))}
            </div>

            {/* Step Dynamic Content Display */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/20" id="workflow-content-card">
              <div className="flex flex-col md:flex-row items-start justify-between gap-space-md">
                <div className="space-y-space-xs max-w-2xl">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                    {workflowData[workflowStep].badge}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-xl">
                    {workflowData[workflowStep].title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {workflowData[workflowStep].desc}
                  </p>
                  <div className="pt-2 font-data-mono text-xs text-primary font-semibold">
                    Core Formula: {workflowData[workflowStep].formula}
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs w-full md:w-auto min-w-[240px]">
                  {workflowData[workflowStep].metrics.map(m => (
                    <div key={m.label} className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                      <span className="block text-xs text-on-surface-variant">{m.label}</span>
                      <span className="font-data-mono font-bold text-on-surface text-sm">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Smart Electrical Assistant */}
        <section className="w-full bg-surface-container-low py-space-2xl border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-lg">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
                RECOMMENDED TOOLS
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Smart Electrical Helper
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Select what you are working on to see our recommended calculation bundle.
              </p>
            </div>

            {/* Discipline Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-space-lg">
              {[
                { key: 'home', label: 'Home Wiring' },
                { key: 'solar', label: 'Solar PV' },
                { key: 'industrial', label: 'Industrial Plant' },
                { key: 'motor', label: 'Motor Drive' },
                { key: 'transformer', label: 'Transformer' },
                { key: 'backup', label: 'Backup Power' },
                { key: 'electronics', label: 'Electronics' }
              ].map(disc => (
                <button
                  key={disc.key}
                  onClick={() => setSelectedDiscipline(disc.key as typeof selectedDiscipline)}
                  className={`px-4 py-2 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
                    selectedDiscipline === disc.key
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'bg-surface-container-lowest text-on-surface font-medium hover:bg-surface-container-high'
                  }`}
                >
                  {disc.label}
                </button>
              ))}
            </div>

            {/* Recommended Suite Result */}
            <div className="max-w-3xl mx-auto p-space-lg rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                    {disciplineData[selectedDiscipline].badge}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                    {disciplineData[selectedDiscipline].heading}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-data-mono text-xs">
                  Recommended Tools
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                {disciplineData[selectedDiscipline].summary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                {disciplineData[selectedDiscipline].tools.map(tool => (
                  <a
                    key={tool.name}
                    className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between border border-outline-variant/20"
                    href={tool.link}
                  >
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">{tool.name}</span>
                    <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Standards & Comparison Center */}
        <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
          <div className="mb-space-lg">
            <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
              HELPFUL COMPARISONS
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Electrical Concepts &amp; Equipment Compared
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Simple, clear comparisons to help you choose the right equipment and understand key electrical ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* Compare 1 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                  Real Power (kW) vs Total Power (kVA)
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-primary">
                  Power Factor
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                <strong>kW (Kilowatts)</strong> measures the real, usable power that does mechanical work or generates heat. <strong>kVA (Kilovolt-Amps)</strong> represents total power delivered to the circuit, including the power needed to create magnetic fields in transformers and motors.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-primary font-bold mb-1">Real Power (kW)</span>
                  Actual power used by appliances and equipment.<br />
                  Shows up on electric bills as kWh.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-secondary font-bold mb-1">Total Power (kVA)</span>
                  Total electrical capacity needed.<br />
                  Used to size transformers and generators.
                </div>
              </div>
            </div>

            {/* Compare 2 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                  Standard Breakers (MCB) vs Industrial Breakers (MCCB)
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-secondary">
                  Breaker Types
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                <strong>MCBs</strong> are compact circuit breakers used in homes and offices for circuits up to 125A. <strong>MCCBs</strong> are heavy-duty breakers with adjustable trip settings for commercial buildings and factories up to 2,500A.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-primary font-bold mb-1">Standard MCB</span>
                  Up to 125A, fixed trip ratings, standard home and apartment panels.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-secondary font-bold mb-1">Industrial MCCB</span>
                  Up to 2,500A, adjustable settings, main commercial power panels.
                </div>
              </div>
            </div>

            {/* Compare 3 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                  Lead-Acid (AGM/Gel) vs Lithium (LiFePO4)
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-tertiary">
                  Battery Life
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                Lead-acid batteries degrade quickly if discharged past 50%, lasting ~500–1,000 cycles. Lithium Iron Phosphate (LiFePO4) batteries safely discharge up to 80–90%, lasting 4,000+ cycles while being much lighter and more efficient.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-on-surface-variant font-bold mb-1">Lead-Acid / AGM</span>
                  50% usable capacity, 500–800 cycles, heavy weight.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-tertiary font-bold mb-1">Lithium LiFePO4</span>
                  80–90% usable capacity, 4,000+ cycles, lightweight, fast charging.
                </div>
              </div>
            </div>

            {/* Compare 4 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                  Star (Wye) vs Delta Three-Phase Wiring
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-primary">
                  3-Phase Wiring
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                <strong>Wye (Star)</strong> wiring includes a center neutral wire providing two voltages (such as 208V and 120V for standard outlets). <strong>Delta</strong> uses three hot wires without a neutral, which is ideal for heavy motor loads and high-power distribution.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-primary font-bold mb-1">Wye (Star) Setup</span>
                  Provides neutral for 120V outlets &amp; 208V power.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-secondary font-bold mb-1">Delta Setup</span>
                  High starting torque for heavy industrial motors.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Engineering Knowledge Base & Field Guides */}
        <section className="w-full bg-surface-container-low py-space-2xl border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-lg">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
                HELPFUL GUIDES
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Step-by-Step Electrical Guides
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Clear, easy-to-follow explanations for common electrical sizing rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {/* Field Guide 1 */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2 mb-space-xs text-primary">
                    <span className="material-symbols-outlined text-[20px]">architecture</span>
                    <span className="font-label-caps text-label-caps uppercase font-bold">GUIDE 01</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg mb-2">
                    How to Choose Wire Size for Voltage Drop (3% Rule)
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Electrical guidelines recommend keeping maximum voltage drop under 3% on branch circuits (and 5% total) to ensure equipment operates at full power and efficiency over long wire runs.
                  </p>
                  <div className="my-3 p-2 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                    Single Phase: VD = (2 × K × I × L) / CM<br />
                    Three Phase: VD = (1.732 × K × I × L) / CM
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Where K is conductor resistance, I is current in Amps, L is length in feet, and CM is the wire cross-section area.
                  </p>
                </div>
                <a className="mt-4 font-body-sm text-body-sm text-primary font-bold flex items-center gap-1" href="#workbench-cable">
                  Calculate Wire Size <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>

              {/* Field Guide 2 */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2 mb-space-xs text-secondary">
                    <span className="material-symbols-outlined text-[20px]">thermostat</span>
                    <span className="font-label-caps text-label-caps uppercase font-bold">GUIDE 02</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg mb-2">
                    Understanding Wire Temperature &amp; Bundling Adjustments
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Wire current carrying capacity is adjusted whenever cables run through hot locations (above 30°C / 86°F) or when multiple wires are bundled together in the same conduit.
                  </p>
                  <div className="my-3 p-2 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                    Adjusted Current = Table Amps × Temp Factor × Bundle Factor<br />
                    4–6 Wires: Multiply by 0.80<br />
                    7–9 Wires: Multiply by 0.70
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Always use the breaker terminal rating (usually 75°C) to make sure connections stay safe and cool.
                  </p>
                </div>
                <a className="mt-4 font-body-sm text-body-sm text-secondary font-bold flex items-center gap-1" href="#cat-3">
                  Check Wire Sizing Tables <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>

              {/* Field Guide 3 */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2 mb-space-xs text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">speed</span>
                    <span className="font-label-caps text-label-caps uppercase font-bold">GUIDE 03</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg mb-2">
                    Finding 3-Phase Motor Current &amp; Breaker Sizes
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Standard electrical guidelines size motor wires and circuit breakers using standard full-load current tables to prevent nuisance tripping during motor startup.
                  </p>
                  <div className="my-3 p-2 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                    Branch Wires = 125% of Motor Full-Load Amps<br />
                    Circuit Breaker = 250% of Motor Full-Load Amps<br />
                    Overload Protection = 115%–125% of Nameplate Amps
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    This setup ensures the circuit breaker will not trip during high startup motor currents while keeping the wiring safe.
                  </p>
                </div>
                <a className="mt-4 font-body-sm text-body-sm text-tertiary font-bold flex items-center gap-1" href="#workbench-motor">
                  Calculate Motor Current <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Comprehensive Long SEO Content, 15-Question FAQ Accordion & JSON-LD Schemas */}
        <ElectricalSeoSection />
      </main>
    </div>
  );
}
