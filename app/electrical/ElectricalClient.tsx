'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
      badge: "DISCIPLINE: RESIDENTIAL CONTRACTING",
      heading: "NEC Home Feeder & Branch Package",
      summary: "Recommended sequence for whole-house 100A, 200A, or 400A service entry, kitchen small-appliance branch circuits, and Level 2 EV charging.",
      tools: [
        { name: "1. NEC Cable & Wire Sizing", link: "#workbench-cable" },
        { name: "2. 200A Service Demand Calculator", link: "#cat-17" },
        { name: "3. MCB / Dual-Pole Breaker Sizer", link: "#cat-4" },
        { name: "4. Conduit Fill (EMT / PVC)", link: "#cat-3" }
      ]
    },
    solar: {
      badge: "DISCIPLINE: SOLAR PHOTOVOLTAIC",
      heading: "Renewable Generation & Storage Suite",
      summary: "End-to-end solar array modeling from sun peak hours, MPPT string sizing, hybrid inverter capacity, to battery autonomy days.",
      tools: [
        { name: "1. Solar PV Array Modeler", link: "#workbench-solar" },
        { name: "2. MPPT Charge Controller Sizer", link: "#cat-9" },
        { name: "3. LiFePO4 Battery Ah Capacity", link: "#cat-10" },
        { name: "4. DC String Cable Sizer", link: "#workbench-cable" }
      ]
    },
    industrial: {
      badge: "DISCIPLINE: INDUSTRIAL POWER",
      heading: "Medium Voltage & Factory Load Architecture",
      summary: "Heavy plant engineering tools including copper/aluminum busbar sizing, power factor correction capacitor banks, and MCC feeders.",
      tools: [
        { name: "1. Busbar Ampacity Sizer (A/mm²)", link: "#cat-18" },
        { name: "2. Power Factor Correction (kVAr)", link: "#cat-11" },
        { name: "3. Transformer Full Load Amps", link: "#workbench-transformer" },
        { name: "4. Fault Loop Impedance (Zs)", link: "#cat-4" }
      ]
    },
    motor: {
      badge: "DISCIPLINE: MOTOR SYSTEMS",
      heading: "Industrial Induction Drive Workbench",
      summary: "Evaluate motor full-load currents, across-the-line starting inrush, VFD carrier sizing, and thermal overload settings per NEC 430.",
      tools: [
        { name: "1. Motor FLA & Starting Workbench", link: "#workbench-motor" },
        { name: "2. Motor Torque & Synchronous Speed", link: "#cat-7" },
        { name: "3. VFD Inverter Sizer", link: "#cat-7" },
        { name: "4. Group Motor Branch Feeder", link: "#cat-18" }
      ]
    },
    transformer: {
      badge: "DISCIPLINE: TRANSFORMERS & SUBSTATIONS",
      heading: "Substation Transformer Engineering",
      summary: "Capacity ratings, secondary FLA, impedance calculations (%Z), and primary overcurrent protection per NEC 450.3.",
      tools: [
        { name: "1. Transformer Capacity Workbench", link: "#workbench-transformer" },
        { name: "2. Percentage Impedance %Z Fault Sizer", link: "#cat-6" },
        { name: "3. Core & Copper Losses", link: "#cat-6" },
        { name: "4. Star-Delta Secondary Configuration", link: "#cat-5" }
      ]
    },
    backup: {
      badge: "DISCIPLINE: CRITICAL BACKUP & UPS",
      heading: "Emergency Power & Generator Systems",
      summary: "Model data center double-conversion UPS runtimes, diesel generator prime kVA, and automatic transfer switch ratings.",
      tools: [
        { name: "1. Battery Backup Runtime Hours", link: "#cat-10" },
        { name: "2. Diesel Generator Fuel & Sizing", link: "#cat-8" },
        { name: "3. ATS Automatic Transfer Switch", link: "#cat-8" },
        { name: "4. Inverter Surge Capacity", link: "#cat-10" }
      ]
    },
    electronics: {
      badge: "DISCIPLINE: ELECTRONICS & RLC",
      heading: "Component Design & Signal Processing",
      summary: "Analog electronics, LED droppers, 555 timers, op-amp gains, and resonant RLC AC filter calculations.",
      tools: [
        { name: "1. LED Current Limiting Resistor", link: "#cat-12" },
        { name: "2. Complex Impedance Z = √(R²+X²)", link: "#cat-13" },
        { name: "3. Resistor Color Code (4/5 Band)", link: "#cat-14" },
        { name: "4. LC Resonant Frequency", link: "#cat-13" }
      ]
    }
  };

  // --- FAQ State ---
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});
  const toggleFaq = (idx: number) => {
    setOpenFaqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // --- 20-Category Directory Data ---
  const categoriesList = [
    {
      num: '01',
      id: 'cat-1',
      title: 'Basic Electrical',
      desc: 'Foundational circuit principles, fundamental laws, and basic energetic conversions.',
      badge: 'FUNDAMENTAL SUITE',
      tag: 'NEC / IEC BASE',
      count: '8 Tools',
      color: 'primary',
      tools: [
        "Ohm's Law Calculator (V = I × R)",
        "Voltage, Current & Resistance",
        "DC Power Calculator (P = V × I)",
        "Joule's Law Heating / Heat Loss",
        "Electrical Energy (kWh & Joules)",
        "AC Power Triangle (P, Q, S)",
        "Electrical Efficiency (η = Pout/Pin)",
        "Conductance, Susceptance & Admittance"
      ]
    },
    {
      num: '02',
      id: 'cat-2',
      title: 'Power Calculators',
      desc: 'Precise bidirectional conversions across electrical ratings and mechanical power units.',
      badge: 'POWER METRICS',
      tag: 'EXACT FLOATS',
      count: '12 Tools',
      color: 'secondary',
      tools: [
        "Watts to Amps & Amps to Watts",
        "Volts to Watts & Watts to Volts",
        "kW to Amps & Amps to kW",
        "kVA to Amps & Amps to kVA",
        "kW to kVA & kVA to kW",
        "Horsepower (HP) to Watts & kW",
        "Horsepower to Amps (1Φ & 3Φ)",
        "BTU/hr to Kilowatts"
      ]
    },
    {
      num: '03',
      id: 'cat-3',
      title: 'Cable & Wire Sizing',
      desc: 'Conductor thermal capacity, distance voltage degradation, and raceway fill geometry.',
      badge: 'MOST POPULAR',
      tag: 'NEC 310.16 COMPLIANT',
      count: '9 Tools',
      color: 'primary',
      featuredTool: 'Cable Size Calculator (AWG & mm²)',
      tools: [
        "American Wire Gauge (AWG) Index",
        "SWG to Metric mm² Conversion",
        "Ampacity Sizer (NEC Table 310.16)",
        "Voltage Drop Calculator (1Φ & 3Φ)",
        "Conductor Resistance (R = ρL/A)",
        "Conduit Fill Sizer (EMT, PVC, RMC 40%)",
        "Ambient Temperature & Bundling Derating",
        "Max Run Length at 3% Drop Threshold"
      ]
    },
    {
      num: '04',
      id: 'cat-4',
      title: 'Circuit Protection',
      desc: 'Overcurrent trip curves, short-circuit ratings, prospective fault currents, and fuses.',
      badge: 'TRIP CURVES',
      tag: 'IEC 60898 & 60947',
      count: '7 Tools',
      color: 'secondary',
      tools: [
        "MCB Curve Sizer (Type B, C, D Trip)",
        "MCCB Industrial Breaker Sizer",
        "HRC Fuse Sizing & I²t Let-Through",
        "Circuit Breaker Frame & Trip Rating",
        "Earth Fault Loop Impedance (Zs = Ze + (R1+R2))",
        "Prospective Short-Circuit Current (PSCC)",
        "Protective Relay Time-Current Coordination"
      ]
    },
    {
      num: '05',
      id: 'cat-5',
      title: 'Three Phase Systems',
      desc: 'Polyphase load balancing, neutral current vectors, and Delta-Wye impedance networks.',
      badge: 'POLYPHASE',
      tag: 'IEEE 141 RED BOOK',
      count: '8 Tools',
      color: 'primary',
      tools: [
        "Three-Phase Power (P = √3 × V × I × PF)",
        "Three-Phase Current Calculator",
        "Line vs Phase Voltage & Current (√3)",
        "Neutral Current in Unbalanced 3Φ Systems",
        "Voltage & Current Imbalance Factor (NEMA)",
        "Symmetrical Load Balancing Optimizer",
        "Star-Delta (Wye-Δ) Conversion Network",
        "Two-Wattmeter Method 3Φ Power Factor"
      ]
    },
    {
      num: '06',
      id: 'cat-6',
      title: 'Transformers',
      desc: 'Substation sizing, percentage impedance %Z, core/copper losses, and primary protection.',
      badge: 'MAGNETIC CORE',
      tag: 'IEEE C57.12',
      count: '6 Tools',
      color: 'primary',
      featuredTool: 'Transformer kVA Sizer & Rating',
      tools: [
        "Primary & Secondary Full-Load Amps (FLA)",
        "Core & Copper Losses & Efficiency",
        "Turns Ratio & Secondary Induced Voltage",
        "Percentage Impedance (%Z) Fault Current",
        "Transformer Inrush & NEC 450.3 Protection"
      ]
    },
    {
      num: '07',
      id: 'cat-7',
      title: 'Motors',
      desc: 'Induction motor full-load currents, locked-rotor surges, torque, and VFD parameters.',
      badge: 'ELECTROMECHANICAL',
      tag: 'NEMA MG-1',
      count: '8 Tools',
      color: 'secondary',
      featuredTool: 'Motor Full Load Amps (FLA) Sizer',
      tools: [
        "Shaft Power & Mechanical Output kW",
        "Motor Efficiency Standard (IE1 to IE4)",
        "Motor Torque (Nm & lb-ft) from RPM",
        "Synchronous Speed & Slip Percentage",
        "Starting Current & Locked Rotor kVA/HP",
        "Variable Frequency Drive (VFD) Sizing",
        "Thermal Overload Relay Setting Threshold"
      ]
    },
    {
      num: '08',
      id: 'cat-8',
      title: 'Generators & DG Sets',
      desc: 'Prime vs Standby diesel generators, transient motor start skVA, fuel burn rate, and ATS.',
      badge: 'ISLANDED POWER',
      tag: 'ISO 8528 STANDARDS',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "Generator Prime & Standby kVA Sizer",
        "Generator Fuel Consumption Calculator",
        "Alternator Full-Load Efficiency & Derating",
        "Maximum Starting kVA (Motor Inrush Step)",
        "Continuous Running Load Demand Factor",
        "Automatic Transfer Switch (ATS) Sizing"
      ]
    },
    {
      num: '09',
      id: 'cat-9',
      title: 'Solar Energy (PV)',
      desc: 'Solar array capacity kWp, MPPT charge controllers, grid-tie/hybrid inverters, and LCOE.',
      badge: 'RENEWABLES',
      tag: 'IEC 62548 SPEC',
      count: '9 Tools',
      color: 'tertiary',
      featuredTool: 'Solar PV Array Wattage & Sizing',
      tools: [
        "MPPT Solar Charge Controller Sizer",
        "Solar Inverter (Grid-Tie / Hybrid) Rating",
        "Annual Solar Yield (kWh/kWp/year)",
        "Levelized Cost of Electricity (LCOE $/kWh)",
        "Solar Financial ROI & Simple Payback",
        "PV DC String Cable & Voltage Drop Sizer",
        "Solar Azimuth & Tilt Angle Optimizer",
        "Complete Off-Grid Autonomy Sizer"
      ]
    },
    {
      num: '10',
      id: 'cat-10',
      title: 'Batteries & UPS Systems',
      desc: "Amp-hour (Ah) requirements, C-rate charge curves, Peukert's equation, and runtime.",
      badge: 'ENERGY STORAGE',
      tag: 'IEEE 485 / 1188',
      count: '7 Tools',
      color: 'secondary',
      tools: [
        "Battery Backup Runtime Hours (Peukert)",
        "Inverter Battery Capacity (Ah) Sizer",
        "Battery C-Rate & Charging Time (0.2C/0.5C)",
        "Battery Bank Wiring Calculator",
        "Online Double-Conversion UPS Sizer",
        "Lead-Acid vs LiFePO4 Cycle Life Estimator",
        "Inverter Surge Overload Capacity"
      ]
    },
    {
      num: '11',
      id: 'cat-11',
      title: 'Power Quality',
      desc: 'Capacitor bank kVAr sizing, THD harmonic distortion analysis, and APFC panels.',
      badge: 'GRID PURITY',
      tag: 'IEEE 519-2022',
      count: '7 Tools',
      color: 'primary',
      tools: [
        "Power Factor Correction (Capacitor kVAr)",
        "Total Harmonic Distortion (% THD-V & THD-I)",
        "Voltage Unbalance Factor (VUF)",
        "Reactive Power Q (VAr / kVAr)",
        "Automatic PF Correction (APFC) Steps Sizer",
        "Passive Harmonic Detuned Filter Sizing",
        "K-Factor Transformer Rating for Harmonics"
      ]
    },
    {
      num: '12',
      id: 'cat-12',
      title: 'Electronics',
      desc: 'Signal conditioning, bias divider calculations, timing circuits, and operational amplifiers.',
      badge: 'ANALOG CIRCUITS',
      tag: 'MICROVOLT MODEL',
      count: '8 Tools',
      color: 'secondary',
      tools: [
        "LED Current Limiting Resistor (R = (Vs-Vf)/If)",
        "Voltage Divider Rule (Loaded & Unloaded)",
        "Current Divider Rule Calculator",
        "Capacitor Charge / Discharge Transient",
        "Inductor Energy Storage (E = ½LI²)",
        "RC Time Constant (τ = R × C)",
        "555 Timer Astable & Monostable Mode",
        "Op-Amp Inverting & Non-Inverting Gain"
      ]
    },
    {
      num: '13',
      id: 'cat-13',
      title: 'RLC & AC Circuits',
      desc: 'Reactance, complex phasor impedance Z, resonant frequency, and phase shift angles.',
      badge: 'PHASOR ANALYSIS',
      tag: 'COMPLEX NUMBERS',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "Capacitive Reactance Xc = 1 / (2πfC)",
        "Inductive Reactance Xl = 2πfL",
        "Complex AC Impedance Z = √(R² + X²)",
        "LC Resonant Frequency f = 1 / (2π√LC)",
        "Series & Parallel RLC Quality Factor (Q)",
        "Signal Frequency to Wavelength (λ = c/f)"
      ]
    },
    {
      num: '14',
      id: 'cat-14',
      title: 'Component Tools',
      desc: 'Standard color coding, SMD code decoders, transistor bias points, and diode parameters.',
      badge: 'BENCHMARK LAB',
      tag: 'EIA/IEC 60062',
      count: '6 Tools',
      color: 'secondary',
      tools: [
        "4-Band & 5-Band Resistor Color Code",
        "SMD 3-Digit, 4-Digit & EIA-96 Code",
        "Ceramic & Tantalum Capacitor Markings",
        "Inductor Color Codes & Core Inductance",
        "BJT Transistor Saturation & Bias Point",
        "Zener Diode Voltage Regulator Resistor"
      ]
    },
    {
      num: '15',
      id: 'cat-15',
      title: 'Lighting & Photometrics',
      desc: 'Illuminance levels, Room Cavity Ratios (RCR), lumen maintenance, and LED retrofits.',
      badge: 'IESNA STANDARDS',
      tag: 'LUMEN METHOD',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "Illuminance Lux to Lumens (Area Sizer)",
        "Foot-Candles to Lux Unit Converter",
        "Room Cavity Ratio (RCR) Lighting Fixtures",
        "LED vs Incandescent / HID Energy Savings",
        "Office, Retail & Warehouse Recommended Lux",
        "Emergency Egress Lighting Battery Sizer"
      ]
    },
    {
      num: '16',
      id: 'cat-16',
      title: 'Energy & Utility Cost',
      desc: 'Tiered utility billing tariffs, time-of-use (TOU) arbitrage, and peak demand billing charges.',
      badge: 'UTILITY AUDITING',
      tag: 'TARIFF MODELING',
      count: '6 Tools',
      color: 'secondary',
      tools: [
        "Electricity Bill Calculator",
        "Appliance Energy Cost Calculator",
        "Carbon Footprint (CO2 kg/kWh Emission)",
        "Time-of-Use (TOU) Peak Shifting Optimizer",
        "15-Minute Peak Demand Surcharge Estimator",
        "Annual Building Energy Consumption Audit"
      ]
    },
    {
      num: '17',
      id: 'cat-17',
      title: 'Home Electrical',
      desc: 'Residential NEC standard calculations, main breaker sizing, and heat pump circuits.',
      badge: 'RESIDENTIAL CODE',
      tag: 'NEC ARTICLE 220',
      count: '6 Tools',
      color: 'primary',
      tools: [
        "Whole-House 100A/200A/400A Demand Sizer",
        "NEC Branch Circuit Wire & Romex (NM-B)",
        "240V Dual-Pole Breaker & Appliance Sizing",
        "Room-by-Room Wattage Allocator",
        "Air Conditioner / Heat Pump Circuit (MCA/MOP)",
        "EV Level 2 Charger 50A/60A Feeder Sizer"
      ]
    },
    {
      num: '18',
      id: 'cat-18',
      title: 'Industrial Electrical',
      desc: 'Plant diversity factors, Motor Control Centers (MCC), busbars, and factory substations.',
      badge: 'HEAVY INDUSTRIAL',
      tag: 'IEEE 141 RED BOOK',
      count: '6 Tools',
      color: 'secondary',
      tools: [
        "Plant Diversity & Coincidence Demand Factor",
        "Motor Control Center (MCC) Busbar Rating",
        "Copper & Aluminum Busbar Ampacity (A/mm²)",
        "Unit Substation kVA & Primary Switchgear",
        "Factory Maximum Continuous Demand Load",
        "Group Motor Installation Branch Feeder Sizer"
      ]
    },
    {
      num: '19',
      id: 'cat-19',
      title: 'EV & Electric Mobility',
      desc: 'Level 1, 2, and DC fast charging runtimes, wire feeders, and driving cost benchmarks.',
      badge: 'ELECTROMOBILITY',
      tag: 'SAE J1772 & CCS',
      count: '5 Tools',
      color: 'primary',
      tools: [
        "EV Charging Time (Level 1, 2 & DCFC 350kW)",
        "EV Charger Breaker & Feeder Sizer (NEC 625)",
        "Usable Battery Pack kWh Capacity from SoC",
        "EV vs Gasoline Operating Cost per Mile",
        "Charging Power kW = V × A × √3"
      ]
    },
    {
      num: '20',
      id: 'cat-20',
      title: 'Electrical Unit Conversions',
      desc: 'SI multi-prefix converter from sub-pico to giga across physical electrical parameters.',
      badge: 'UNIVERSAL SI',
      tag: 'NIST SP 811 EXACT',
      count: '8 Systems',
      color: 'secondary',
      tools: [
        "Voltage Converter: V, mV, µV, kV, MV",
        "Current Converter: A, mA, µA, kA",
        "Resistance: Ω, mΩ, kΩ, MΩ",
        "Power: W, kW, MW, HP, BTU/hr, Cal/s",
        "Frequency: Hz, kHz, MHz, GHz, rad/s",
        "Capacitance: pF, nF, µF, mF, Farads",
        "Inductance: nH, µH, mH, Henry",
        "Energy: Joules, Wh, kWh, MWh, BTU"
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
      <Header />

      <main className="w-full pt-20 bg-background flex-1">
        {/* Verification & Electrical Standards Sub-Bar */}
        <div className="w-full bg-surface-container-low border-b border-outline-variant/15 sticky top-20 z-40 backdrop-blur-md bg-surface-container-low/95">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xs flex flex-col md:flex-row items-center justify-between gap-space-xs">
            <div className="flex items-center gap-space-xs overflow-x-auto w-full md:w-auto no-scrollbar py-1 text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
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
            <div className="hidden lg:flex items-center gap-space-sm font-label-caps text-label-caps text-on-surface-variant">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-primary font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>NEC 2024 &amp; IEC 60364
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-secondary font-semibold">
                <span className="material-symbols-outlined text-[14px]">memory</span>IEEE 1584 &amp; 519
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>Fast &amp; Secure Calculations
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-2xl">
          <div className="flex flex-col gap-space-md max-w-4xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="/">Home</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-medium">Electrical Calculators</span>
              <span className="ml-space-xs px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">
                Electrical Calculators &amp; Tools
              </span>
            </nav>

            {/* Headline & Subtitle */}
            <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-on-surface font-bold tracking-tight">
              Electrical Calculators &amp; Engineering Tools
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Easy-to-use electrical calculators, wire gauge sizing tools, transformer capacity planners, motor current estimators, solar setup designers, and circuit breaker tools. Compliant with NEC and IEC standards.
            </p>

            {/* Real-time Quick Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Electrical Tools</span>
                <span className="font-numerical-display-mobile text-numerical-display-mobile text-primary font-bold">300+</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Across 20 Categories</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Standard Frameworks</span>
                <span className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface font-bold">NEC / IEC</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">2024 NFPA &amp; IEEE Red Book</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Calculations Solved</span>
                <span className="font-numerical-display-mobile text-numerical-display-mobile text-secondary font-bold">18.5M+</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Locally &amp; Privately</span>
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
                  placeholder="Jump directly to any calculator (e.g. 'Voltage Drop', 'Transformer FLA', 'Ohm', 'AWG')..."
                  type="text"
                />
                <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs font-data-mono text-on-surface-variant bg-surface-container rounded-md mr-2 shadow-inner">
                  /
                </kbd>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-space-xs font-label-caps text-label-caps text-on-surface-variant">
                <span className="uppercase tracking-wider font-semibold">Fast Shortcuts:</span>
                {[
                  { label: 'Cable Sizer', href: '#workbench-cable' },
                  { label: 'Transformer kVA', href: '#workbench-transformer' },
                  { label: 'Motor FLA', href: '#workbench-motor' },
                  { label: 'Solar PV Array', href: '#workbench-solar' },
                  { label: 'Conduit Fill', href: '#cat-3' },
                  { label: 'Power Factor', href: '#cat-11' },
                  { label: "Ohm's Law", href: '#cat-1' }
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
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
                  title: 'Size A Cable',
                  count: '9 Tools',
                  desc: 'Calculate AWG / mm², ensure voltage drop < 3%, determine conduit fill limits, and apply ambient temperature derating.',
                  action: 'Launch Cable Workbench',
                  icon: 'electric_bolt',
                  color: 'primary',
                  link: '#workbench-cable'
                },
                {
                  title: 'Design A Circuit',
                  count: '7 Tools',
                  desc: 'Size MCB/MCCB breakers, verify prospective short-circuit current (PSCC), evaluate fault loop impedance, and coordinate tripping.',
                  action: 'Evaluate Breakers & Relays',
                  icon: 'power',
                  color: 'secondary',
                  link: '#cat-4'
                },
                {
                  title: 'Build A Solar System',
                  count: '9 Tools',
                  desc: 'Size photovoltaic array kWp, match MPPT charge controller limits, model LiFePO4 battery banks, and configure hybrid inverters.',
                  action: 'Open Solar Modeler',
                  icon: 'wb_sunny',
                  color: 'tertiary',
                  link: '#workbench-solar'
                },
                {
                  title: 'Size Industrial Plant',
                  count: '6 Tools',
                  desc: 'Design copper/aluminum busbar capacity, calculate transformer kVA, size APFC capacitor banks to attain 0.98 power factor.',
                  action: 'Check Substation Specs',
                  icon: 'factory',
                  color: 'primary',
                  link: '#workbench-transformer'
                },
                {
                  title: 'Calculate Battery Backup',
                  count: '7 Tools',
                  desc: 'Determine UPS runtime hours, compute battery capacity in Amp-hours (Ah), evaluate Depth of Discharge (DoD), and series arrays.',
                  action: 'Simulate Runtime',
                  icon: 'battery_charging_full',
                  color: 'secondary',
                  link: '#cat-10'
                },
                {
                  title: 'Size A Motor & VFD',
                  count: '8 Tools',
                  desc: 'Full-load current (FLA), locked-rotor starting current (Code letters A-V), thermal overload relay threshold, and torque output.',
                  action: 'Calculate Motor Limits',
                  icon: 'settings_slow_motion',
                  color: 'primary',
                  link: '#workbench-motor'
                },
                {
                  title: 'Calculate Home Load',
                  count: '6 Tools',
                  desc: 'NEC 220 service load calculation for 100A, 200A, or 400A panels, plus heat pump and EV Level 2 dedicated feeder verification.',
                  action: 'Size Residential Panel',
                  icon: 'roofing',
                  color: 'tertiary',
                  link: '#cat-17'
                },
                {
                  title: 'Reduce Utility Cost',
                  count: '6 Tools',
                  desc: 'Analyze peak demand kW penalties, power factor low-pf penalties, time-of-use (TOU) arbitrage, and lighting retrofits.',
                  action: 'Audit Energy Costs',
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
                    className={`mt-space-md flex items-center gap-1 font-body-sm text-body-sm font-semibold ${
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
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">NEC Table 310.16 &amp; IEC 60364-5-52</span>
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
                    {cableResult.isCompliant ? 'NEC Section 210.19(A) < 3% branch criteria satisfied' : 'Voltage drop exceeds recommended 3% threshold'}
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
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Three-Phase kVA to Amps Sizing</span>
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
                  <span>Turns Ratio (Np/Ns): <span className="font-data-mono font-semibold text-on-surface" id="wb2-out-ratio">{transformerResult.ratio}:1</span></span>
                  <span className="font-data-mono text-xs text-secondary">Assumes 3-Phase Symmetrical Load</span>
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
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Three-Phase Motor FLA &amp; Overload</h3>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">NEC Table 430.250 &amp; NEMA MG-1</span>
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
                  <span className="font-data-mono text-xs text-primary">NEC 430.22 branch factor (1.25×)</span>
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
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Solar PV Array &amp; Battery Storage</h3>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Solar &amp; Battery Sizing Calculator</span>
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
                  <span>LiFePO4 80% Depth of Discharge &amp; 80% System PR Applied</span>
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
                            className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container transition-colors font-semibold text-primary"
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
                            className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container transition-colors"
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
                { step: 1, label: 'Load Profile', sub: '28.5 kWh/day' },
                { step: 2, label: 'PV Array Size', sub: '7.4 kWp Peak' },
                { step: 3, label: 'Battery Bank', sub: '20.4 kWh LiFePO4' },
                { step: 4, label: 'Inverter / MPPT', sub: '8 kW Hybrid 48V' },
                { step: 5, label: 'DC Cable & Breaker', sub: '10 AWG <2% drop' },
                { step: 6, label: 'Capex & ROI', sub: '5.8 yr Payback' }
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
                  4 Coordinated Tools
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
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">{tool.name}</span>
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
              Comparative Metrology
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Technical Trade-Offs &amp; Architecture Comparisons
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Definitive engineering comparisons across alternating paradigms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* Compare 1 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                  kW (Real Power) vs kVA (Apparent Power)
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-primary">
                  PF = kW / kVA
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                <strong>kW</strong> measures the active power consumed by resistive loads to do mechanical work or emit heat. <strong>kVA</strong> represents the total apparent vector power that transformers, cables, and alternators must transmit to sustain magnetic fields in inductive equipment.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-primary font-bold mb-1">Real Power (kW)</span>
                  P = V × I × cos(θ)<br />
                  Billed by commercial utility meters as kWh consumed.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-secondary font-bold mb-1">Apparent Power (kVA)</span>
                  S = V × I (or √3 × VL × IL)<br />
                  Defines equipment thermal rating and peak demand penalization.
                </div>
              </div>
            </div>

            {/* Compare 2 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                  MCB (Miniature) vs MCCB (Molded Case)
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-secondary">
                  Trip Tech
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                <strong>MCBs</strong> are fixed-trip modular devices suited up to 125A in sub-panels with interrupting capacities up to 10–15 kA. <strong>MCCBs</strong> support adjustable thermal-magnetic trip parameters up to 2,500A with massive short-circuit withstands exceeding 100 kA.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-primary font-bold mb-1">MCB Characteristics</span>
                  Max 125A, Fixed thermal trip, DIN-rail mounted, residential &amp; branch circuits.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-secondary font-bold mb-1">MCCB Characteristics</span>
                  Up to 2,500A, Microprocessor trip units, adjustable Ir, Isd, Ii, main switchgear.
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
                Lead-acid cells degrade severely beyond 50% Depth of Discharge (DoD), yielding ~500–1,000 cycles. Lithium Iron Phosphate (LiFePO4) operates comfortably at 80–90% DoD for 4,000–6,000+ cycles with flat discharge curves and zero thermal runaway risks.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-on-surface-variant font-bold mb-1">Lead-Acid / AGM</span>
                  50% Usable DoD, 500–800 cycles, heavy weight (30 Wh/kg), Peukert effect loss.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-tertiary font-bold mb-1">Lithium LiFePO4</span>
                  80-90% Usable DoD, 4,000+ cycles, lightweight (100+ Wh/kg), 96% round-trip efficiency.
                </div>
              </div>
            </div>

            {/* Compare 4 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                  Star (Wye) vs Delta (Δ) Configurations
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-primary">
                  3Φ Topologies
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                <strong>Wye (Star)</strong> features a common neutral center-tap providing two voltages (e.g. 208V Line-to-Line and 120V Line-to-Neutral). <strong>Delta</strong> carries only three ungrounded conductors, ideal for balanced long-distance power distribution and high motor starting torque.
              </p>
              <div className="grid grid-cols-2 gap-space-xs text-xs font-data-mono">
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-primary font-bold mb-1">Wye (Y) Features</span>
                  V_line = √3 × V_phase<br />
                  I_line = I_phase<br />
                  Provides neutral for 120V loads.
                </div>
                <div className="p-space-xs rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="block text-secondary font-bold mb-1">Delta (Δ) Features</span>
                  V_line = V_phase<br />
                  I_line = √3 × I_phase<br />
                  Traps 3rd harmonics internally.
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
                Clear, standard-compliant methodologies with NFPA 70 / NEC guidelines explained simply.
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
                    How to Size Conductors for Voltage Drop (3% Rule)
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    NEC Informational Note 210.19(A) recommends that conductor size be engineered such that the maximum voltage drop does not exceed 3% on branch circuits, and 5% total to the furthest outlet.
                  </p>
                  <div className="my-3 p-2 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                    VD = (2 × K × I × L) / CM (Single Phase)<br />
                    VD = (1.732 × K × I × L) / CM (Three Phase)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Where K is copper resistivity (12.9 Ω·cmil/ft at 75°C), I is current, L is one-way run in feet, and CM is circular mils cross-section.
                  </p>
                </div>
                <a className="mt-4 font-body-sm text-body-sm text-primary font-semibold flex items-center gap-1" href="#workbench-cable">
                  Test on Cable Workbench <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                    NEC Table 310.16 Ampacity Derating Rules
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Conductor base ampacity must be derated whenever conductors are subjected to elevated ambient temperatures exceeding 30°C (86°F), or bundled in conduit exceeding three current-carrying conductors.
                  </p>
                  <div className="my-3 p-2 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                    I_derated = I_table × Temp_Factor × Bundle_Factor<br />
                    4–6 Conductors: Derate to 80%<br />
                    7–9 Conductors: Derate to 70%
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Always select the terminal temperature rating (typically 75°C on modern breakers) even when employing 90°C THHN wire.
                  </p>
                </div>
                <a className="mt-4 font-body-sm text-body-sm text-secondary font-semibold flex items-center gap-1" href="#cat-3">
                  Review Derating Tables <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                    Calculating 3-Phase Motor FLA &amp; Overcurrent
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Per NEC 430.6(A)(1), motor feeder and branch circuit components must be sized from standard NEC Table 430.250 values rather than motor nameplates.
                  </p>
                  <div className="my-3 p-2 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                    Branch Conductors = 125% of Table FLA<br />
                    Inverse-Time Breaker = 250% of Table FLA<br />
                    Thermal Overload Relay = 115%–125% of Nameplate FLA
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    This decoupling ensures safe branch clearing during startup without triggering nuisance trips under 6× inrush surges.
                  </p>
                </div>
                <a className="mt-4 font-body-sm text-body-sm text-tertiary font-semibold flex items-center gap-1" href="#workbench-motor">
                  Compute Motor Currents <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Comprehensive FAQ Accordion */}
        <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-space-xl">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
                HELP &amp; QUESTIONS
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Helpful answers on calculation accuracy, privacy, and using these tools offline.
              </p>
            </div>

            <div className="space-y-space-sm">
              {[
                {
                  id: 1,
                  q: 'Are these calculations compliant with the latest 2024 NEC and IEC codes?',
                  a: 'Yes. All algorithms are calibrated to the National Electrical Code (NFPA 70) 2024 edition, IEC 60364 electrical installations standards, and IEEE standards (such as IEEE 141 and IEEE 519-2022). Formulas are verified against tabulated baseline examples directly from code appendices.'
                },
                {
                  id: 2,
                  q: 'How does SolveIt keep my data private and secure?',
                  a: 'All calculations happen privately on your device or computer. We never store or transmit your project numbers, wiring details, or project data over the internet. Everything stays safely on your machine.'
                },
                {
                  id: 3,
                  q: 'Can these calculators be operated offline or on job sites without internet?',
                  a: 'Yes. Once this page is loaded in your mobile or laptop browser cache, every core interactive workbench and directory lookup function remains 100% operational without active cellular or Wi-Fi connectivity.'
                },
                {
                  id: 4,
                  q: 'What is the difference between Single-Phase and Three-Phase Voltage Drop?',
                  a: 'In single-phase circuits, current must travel out along the ungrounded phase conductor and return along the neutral conductor, multiplying the distance by 2. In balanced three-phase systems, line currents sum to zero at the star neutral point; therefore, the geometric factor is √3 (approximately 1.732) rather than 2, resulting in lower line-to-line voltage loss.'
                },
                {
                  id: 5,
                  q: 'What standard is used for Transformer inrush and overcurrent protection?',
                  a: 'Our models follow NEC Table 450.3(B) for transformers operating under 1,000 Volts. If secondary overcurrent protection is not provided, primary protection is generally limited to 125% of rated primary FLA. If secondary protection is provided at 125%, primary protection may be increased up to 250% to prevent nuisance tripping during initial core magnetization.'
                }
              ].map(faq => (
                <div key={faq.id} className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between text-left font-headline-md text-headline-md text-on-surface font-semibold text-base focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`material-symbols-outlined text-primary text-[20px] transition-transform duration-200 ${
                        openFaqs[faq.id] ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaqs[faq.id] && (
                    <div className="mt-space-sm pt-space-xs border-t border-surface-container font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
