'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  Info,
  Grid,
  ListFilter,
  Calculator,
  BookOpen,
  Scale,
  Flame,
  Gauge,
  Radio,
  Clock,
  Sun,
  BatteryCharging,
  Plug,
  Cpu,
  Compass,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Activity,
  Boxes,
  Globe2
} from 'lucide-react';

interface ToolItem {
  name: string;
  desc: string;
  action: string;
  href?: string;
  badge?: string;
}

interface CategoryGroup {
  id: string;
  num: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'cyan' | 'rose' | 'indigo';
  count: string;
  group: 'Wiring & Panels' | 'Motors & Power' | 'Solar & Batteries' | 'Industrial & Electronics';
  tools: ToolItem[];
}

export default function ElectricalClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Wiring & Panels' | 'Motors & Power' | 'Solar & Batteries' | 'Industrial & Electronics'>('all');
  const [viewDensity, setViewDensity] = useState<'compact' | 'detailed'>('compact');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Workbench 1: Wire Sizing & Voltage Drop ---
  const [wb1Current, setWb1Current] = useState<number>(45); // 45 Amps
  const [wb1Voltage, setWb1Voltage] = useState<number>(240); // 240 Volts (Dryer/AC/EV)
  const [wb1Conductor, setWb1Conductor] = useState<string>('copper75');
  const [wb1Length, setWb1Length] = useState<number>(100); // 100 feet

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
    const isCompliant = vDropPercent <= 3.0;

    return {
      gauge,
      mm2,
      ampacity,
      vDropPercent: vDropPercent.toFixed(1),
      vDropVolts: vDrop.toFixed(1),
      isCompliant,
    };
  }, [wb1Current, wb1Voltage, wb1Conductor, wb1Length]);

  // --- Workbench 2: Transformer Capacity (kVA to Amps) ---
  const [wb2Kva, setWb2Kva] = useState<number>(75); // 75 kVA
  const [wb2PrimaryV, setWb2PrimaryV] = useState<number>(480); // 480V
  const [wb2SecondaryV, setWb2SecondaryV] = useState<number>(208); // 208V

  const transformerResult = useMemo(() => {
    const kva = Number(wb2Kva) || 0;
    const pV = Number(wb2PrimaryV) || 480;
    const sV = Number(wb2SecondaryV) || 208;

    const pFla = (kva * 1000) / (Math.sqrt(3) * pV);
    const sFla = (kva * 1000) / (Math.sqrt(3) * sV);
    const pBreaker = Math.round(pFla * 1.25);
    const sBreaker = Math.round(sFla * 1.25);

    return {
      pFla: pFla.toFixed(0),
      sFla: sFla.toFixed(0),
      pBreaker,
      sBreaker,
    };
  }, [wb2Kva, wb2PrimaryV, wb2SecondaryV]);

  // --- Workbench 3: Electric Motor Current & Breaker Size ---
  const [wb3Hp, setWb3Hp] = useState<number>(25); // 25 Horsepower
  const [wb3Voltage, setWb3Voltage] = useState<number>(460); // 460V 3-Phase

  const motorResult = useMemo(() => {
    const hp = Number(wb3Hp) || 0;
    const v = Number(wb3Voltage) || 460;
    const watts = hp * 746;
    const fla = watts / (Math.sqrt(3) * v * 0.92 * 0.86);
    const breakerAmps = Math.round(fla * 2.5); // Standard breaker for motor start
    const wireAmps = Math.round(fla * 1.25);

    return {
      fla: fla.toFixed(1),
      breakerAmps,
      wireAmps,
      kw: (watts / 1000).toFixed(1),
    };
  }, [wb3Hp, wb3Voltage]);

  // --- Workbench 4: Solar & Battery Backup Runtime ---
  const [wb4BatteryKwh, setWb4BatteryKwh] = useState<number>(10); // 10 kWh battery
  const [wb4LoadWatts, setWb4LoadWatts] = useState<number>(1200); // 1200 Watts continuous home load

  const batteryResult = useMemo(() => {
    const kwh = Number(wb4BatteryKwh) || 0;
    const watts = Number(wb4LoadWatts) || 1;
    const usableWh = kwh * 1000 * 0.85; // 85% usable capacity for lithium
    const hours = usableWh / watts;

    return {
      hours: hours.toFixed(1),
      days: (hours / 24).toFixed(1),
      usableKwh: (usableWh / 1000).toFixed(1),
    };
  }, [wb4BatteryKwh, wb4LoadWatts]);

  // --- Interactive 6-Stage Solar Workflow State ---
  const [workflowStep, setWorkflowStep] = useState<number>(1);

  const workflowData: Record<number, { title: string; badge: string; desc: string; formula: string; metrics: { label: string; val: string }[] }> = {
    1: {
      title: 'Calculate Daily Home Energy Consumption',
      badge: 'STAGE 01 • ENERGY AUDIT',
      desc: 'Add up the kilowatt-hours (kWh) from your monthly electric bill or tally your key appliances.',
      formula: 'Daily kWh = (Monthly kWh from bill) ÷ 30 Days',
      metrics: [
        { label: 'Average Daily Use', val: '28.5 kWh / day' },
        { label: 'Peak Power Demand', val: '6.5 kW' },
        { label: 'Monthly Target', val: '855 kWh / month' },
      ],
    },
    2: {
      title: 'Determine Solar Panel Array Size',
      badge: 'STAGE 02 • SOLAR SIZING',
      desc: 'Divide daily energy by your area peak sun hours per day to find total solar panel wattage needed.',
      formula: 'Solar System kW = (Daily kWh) ÷ (Sun Hours × 0.80 efficiency)',
      metrics: [
        { label: 'Solar Array Needed', val: '7.4 kW DC' },
        { label: 'Number of Panels', val: '18–20 Panels (400W)' },
        { label: 'Roof Area Required', val: '~420 sq ft' },
      ],
    },
    3: {
      title: 'Size Battery Backup Storage',
      badge: 'STAGE 03 • BATTERY BANK',
      desc: 'Choose how many hours or days of backup power you want during electric power outages.',
      formula: 'Battery kWh = (Critical Daily kWh × Days of Backup) ÷ 0.85 usable',
      metrics: [
        { label: 'Battery Capacity', val: '15.0–20.0 kWh' },
        { label: 'Type Recommended', val: 'Lithium (LiFePO4)' },
        { label: 'Emergency Runtime', val: '24–36 Hours' },
      ],
    },
    4: {
      title: 'Select Inverter & Charge Controller',
      badge: 'STAGE 04 • INVERTER SIZING',
      desc: 'Pick an inverter capable of running your maximum home power draw without tripping.',
      formula: 'Inverter kW ≥ Peak Home Load × 1.25 Safety Margin',
      metrics: [
        { label: 'Inverter Rating', val: '8.0 kW Continuous' },
        { label: 'Surge Starting Power', val: '16.0 kW (Motor Start)' },
        { label: 'System Voltage', val: '48V DC / 240V AC' },
      ],
    },
    5: {
      title: 'Wire Sizes & Circuit Breakers',
      badge: 'STAGE 05 • ELECTRICAL SAFETY',
      desc: 'Size copper wires and safety breakers to keep voltage drop under 2% and prevent warm wires.',
      formula: 'Wire Size: Sized for 125% continuous solar current',
      metrics: [
        { label: 'Main AC Breaker', val: '50 Amp 2-Pole' },
        { label: 'DC Solar Wire', val: '10 AWG Solar Cable' },
        { label: 'Voltage Loss', val: '< 1.5% Loss' },
      ],
    },
    6: {
      title: 'Cost, Energy Savings & Payback Period',
      badge: 'STAGE 06 • PAYBACK RETURN',
      desc: 'Compare total installation cost against your monthly electric bill savings to find payback time.',
      formula: 'Payback Years = Net System Cost ÷ Annual Electric Savings',
      metrics: [
        { label: 'Yearly Electric Savings', val: '$1,850 / year' },
        { label: 'Estimated Payback', val: '5.5 to 6.8 Years' },
        { label: '25-Year Net Profit', val: '+$34,000 Saved' },
      ],
    },
  };

  // --- Complete 20-Category Directory in Everyday Plain English ---
  const allCategories: CategoryGroup[] = [
    {
      id: 'cat-wires',
      num: '01',
      title: 'Wire Sizing & Cable Thickness',
      desc: 'Find how thick of a copper or aluminum wire you need for home appliances, subpanels, and tools.',
      icon: Zap,
      color: 'blue',
      count: '6 Tools',
      group: 'Wiring & Panels',
      tools: [
        { name: 'Wire Thickness & Gauge (AWG / mm²)', desc: 'Find the correct wire thickness (14, 12, 10, 8 AWG) for any electric current.', action: 'Find Wire Size', href: '/electrical-converter', badge: 'Everyday' },
        { name: 'Copper vs Aluminum Wire Size Comparison', desc: 'See which aluminum wire size safely replaces a copper wire to save money.', action: 'Compare Metals' },
        { name: 'Wire Heating in Hot Attics & Conduits', desc: 'Adjust wire thickness when running cables through hot attics or bundled pipes.', action: 'Check Temperature' },
        { name: 'Underground Trench Cable Sizing', desc: 'Calculate wire thickness for direct burial cables out to sheds, gates, or garages.', action: 'Size Trench Cable' },
        { name: 'Flexible Cord & Extension Cord Sizing', desc: 'Find safe extension cord wire gauges to prevent power tools from burning out.', action: 'Check Extension Cord' },
        { name: 'Subpanel Feeder Wire Calculator', desc: 'Calculate the heavy wire gauge needed to feed a 60A, 100A, or 125A garage subpanel.', action: 'Size Subpanel' },
      ],
    },
    {
      id: 'cat-vdrop',
      num: '02',
      title: 'Voltage Loss over Long Wires',
      desc: 'Keep power strong over long wire distances to prevent dim lights and sluggish motors.',
      icon: Gauge,
      color: 'cyan',
      count: '5 Tools',
      group: 'Wiring & Panels',
      tools: [
        { name: 'Long Wire Voltage Loss (3% Safety Rule)', desc: 'Calculate how much voltage is lost over 50, 100, or 300 feet of wire.', action: 'Check Voltage Loss', badge: 'Essential' },
        { name: 'Maximum Wire Distance for 120V Outlets', desc: 'Find the maximum distance you can run a 15A or 20A outlet before needing thicker wire.', action: 'Find Max Distance' },
        { name: 'Three-Phase 208V & 480V Voltage Loss', desc: 'Calculate voltage drop for commercial equipment and 3-phase machinery.', action: 'Check 3-Phase Loss' },
        { name: '12V & 24V Low Voltage DC Wire Drop', desc: 'Size wires for RVs, campervans, boats, and low-voltage landscape lighting.', action: 'Size 12V Wire' },
        { name: 'Electricity Wasted as Heat in Wires', desc: 'Calculate money and kilowatt-hours wasted as heat inside undersized long wires.', action: 'Calculate Loss' },
      ],
    },
    {
      id: 'cat-breakers',
      num: '03',
      title: 'Breakers, Fuses & Safety Panels',
      desc: 'Select the right circuit breaker amps, ground fault breakers, and main house panels.',
      icon: ShieldCheck,
      color: 'purple',
      count: '5 Tools',
      group: 'Wiring & Panels',
      tools: [
        { name: 'Circuit Breaker Amps Sizer (15A, 20A, 50A)', desc: 'Select the safe circuit breaker size based on continuous power draw and 80% safety rules.', action: 'Size Breaker', badge: 'Popular' },
        { name: '80% Safety Load Rule (Continuous Power)', desc: 'Ensure continuous loads (like EV chargers and space heaters) don’t overheat breakers.', action: 'Check 80% Rule' },
        { name: 'Bathroom & Outdoor GFCI Outlet Safety', desc: 'Verify ground fault protection rules for kitchens, bathrooms, and outdoor outlets.', action: 'Check GFCI' },
        { name: 'Fuse Size & Time-Delay Fuses', desc: 'Select fast-acting or slow-blow fuses for power supplies and motor equipment.', action: 'Size Fuse' },
        { name: 'Main Circuit Breaker Panel Upgrade', desc: 'Check if you need a 100A, 150A, 200A, or 400A main electric service panel.', action: 'Check Main Panel' },
      ],
    },
    {
      id: 'cat-homeload',
      num: '04',
      title: 'Home Electric Load & Appliance Watts',
      desc: 'Calculate total household power use to see if your breaker panel can handle heat pumps and EV chargers.',
      icon: Plug,
      color: 'emerald',
      count: '5 Tools',
      group: 'Wiring & Panels',
      tools: [
        { name: 'Whole House Electric Load Calculator', desc: 'Add up appliances, AC, heaters, and lighting to check total house electrical load.', action: 'Calculate House Load', badge: 'Home Core' },
        { name: 'Heat Pump & Air Conditioner Electric Load', desc: 'Calculate electrical amps needed when switching from gas heating to an electric heat pump.', action: 'Size Heat Pump' },
        { name: 'Kitchen & Laundry Circuit Planner', desc: 'Plan dedicated 20A appliance circuits for refrigerators, microwaves, and dryers.', action: 'Plan Kitchen' },
        { name: 'Electric Water Heater Wiring & Breaker', desc: 'Find wire size and 240V double-pole breaker for 4500W water heaters.', action: 'Size Water Heater' },
        { name: 'Hot Tub & Pool Pump Electric Sizing', desc: 'Calculate GFCI breaker and wiring for backyard hot tubs and pool pumps.', action: 'Size Hot Tub' },
      ],
    },
    {
      id: 'cat-conduit',
      num: '05',
      title: 'How Many Wires Fit in a Pipe (Conduit)',
      desc: 'Find what diameter metal or plastic pipe (EMT / PVC) you need to pull wires without jamming.',
      icon: Boxes,
      color: 'amber',
      count: '4 Tools',
      group: 'Wiring & Panels',
      tools: [
        { name: 'Pipe Size for Wire Bundles (Conduit Fill 40%)', desc: 'Calculate the pipe diameter (1/2", 3/4", 1", 2") needed for any combination of wires.', action: 'Find Pipe Size', badge: 'Practical' },
        { name: 'How Many Wires Can Fit in a 3/4" or 1" Pipe?', desc: 'See the maximum number of 14, 12, and 10 AWG wires allowed in standard electrical pipe.', action: 'Check Wire Limit' },
        { name: 'Pull Box & Junction Box Dimensions', desc: 'Calculate minimum metal box length for straight pulls and 90-degree pipe turns.', action: 'Size Box' },
        { name: 'Underground PVC Trench Depth & Sizing', desc: 'Check safe burial depths for PVC conduit under driveways, lawns, and gardens.', action: 'Check Trench' },
      ],
    },
    {
      id: 'cat-ev',
      num: '06',
      title: 'Electric Cars & EV Charging',
      desc: 'Level 2 home chargers, charging hours needed, electric panel capacity, and road trip costs.',
      icon: BatteryCharging,
      color: 'blue',
      count: '5 Tools',
      group: 'Solar & Batteries',
      tools: [
        { name: 'EV Home Charger Wire & Breaker Sizer', desc: 'Size 40A, 50A, or 60A circuit breakers and 6 AWG wiring for Tesla and Level 2 chargers.', action: 'Size EV Charger', badge: 'Popular' },
        { name: 'EV Charge Time Calculator', desc: 'Calculate how many hours it takes to charge from 20% to 80% on 120V vs 240V.', action: 'Calculate Charge Time' },
        { name: 'EV vs Gasoline Cost per Mile', desc: 'Compare electricity cost per mile against gasoline prices to see your fuel savings.', action: 'Compare Costs' },
        { name: 'Will an EV Charger Overload My House Panel?', desc: 'Check if your existing 100A or 200A home panel has enough room for an EV charger.', action: 'Check Panel Room' },
        { name: 'Public Fast Charger (DCFC) Speed & Cost', desc: 'Estimate charging speed and cost when using high-power public highway chargers.', action: 'Estimate Fast Charge' },
      ],
    },
    {
      id: 'cat-solar',
      num: '07',
      title: 'Solar Panels & Inverters',
      desc: 'How many solar panels you need, inverter size, and annual electric bill savings.',
      icon: Sun,
      color: 'amber',
      count: '6 Tools',
      group: 'Solar & Batteries',
      tools: [
        { name: 'How Many Solar Panels Do You Need?', desc: 'Calculate the total solar panel wattage needed to cover 100% of your electric bill.', action: 'Size Solar System', badge: 'Clean Energy' },
        { name: 'Solar Inverter & Micro-Inverter Sizing', desc: 'Match solar panel output to the correct string inverter or micro-inverter size.', action: 'Size Inverter' },
        { name: 'Solar Payback & Monthly Electric Savings', desc: 'Calculate how many years until your solar installation pays for itself in electric savings.', action: 'Check Payback' },
        { name: 'Off-Grid Cabin Solar & Battery Sizer', desc: 'Size an independent solar setup for remote cabins, campers, and RVs.', action: 'Size Off-Grid' },
        { name: 'Solar Panel Tilt Angle for Max Sunshine', desc: 'Find the best roof tilt angle and compass direction for year-round solar energy.', action: 'Find Tilt Angle' },
        { name: 'Solar Wire Sizing & DC Voltage Drop', desc: 'Select thick UV-resistant solar cables to prevent energy loss between panels and inverter.', action: 'Size Solar Wire' },
      ],
    },
    {
      id: 'cat-batteries',
      num: '08',
      title: 'Batteries & Emergency Backup Power',
      desc: 'How many hours a battery lasts, lithium vs lead-acid capacity, and battery banks.',
      icon: BatteryCharging,
      color: 'emerald',
      count: '5 Tools',
      group: 'Solar & Batteries',
      tools: [
        { name: 'Battery Backup Runtime (Hours & Days)', desc: 'Calculate how many hours your battery will power your refrigerator, lights, and Wi-Fi.', action: 'Check Runtime', badge: 'Essential' },
        { name: 'Battery Amp-Hours (Ah) to Watt-Hours (Wh)', desc: 'Convert battery voltage and Amp-Hours into real usable kilowatt-hours of power.', action: 'Convert Ah to Wh' },
        { name: 'Lithium (LiFePO4) vs Lead-Acid Battery Sizer', desc: 'Compare usable capacity and lifetime charge cycles between battery chemistries.', action: 'Compare Batteries' },
        { name: 'Battery Bank Wiring (12V, 24V, 48V)', desc: 'Calculate wiring in series or parallel to increase voltage or storage capacity.', action: 'Wire Battery Bank' },
        { name: 'Inverter Battery Drain & Efficiency Loss', desc: 'Calculate how fast a 12V or 24V power inverter drains your battery bank under heavy load.', action: 'Check Drain' },
      ],
    },
    {
      id: 'cat-generators',
      num: '09',
      title: 'Emergency Generators & Backup Power',
      desc: 'Generator size for your home, propane/gas fuel use, and transfer switches.',
      icon: Flame,
      color: 'rose',
      count: '5 Tools',
      group: 'Solar & Batteries',
      tools: [
        { name: 'What Size Backup Generator Do You Need?', desc: 'Calculate starting watts and running watts to power your whole house during a blackout.', action: 'Size Generator', badge: 'Backup' },
        { name: 'Generator Gas & Propane Fuel Usage', desc: 'Calculate how many gallons of gasoline or propane your generator burns per day.', action: 'Check Fuel' },
        { name: 'Manual Transfer Switch & Interlock Sizer', desc: 'Size safe transfer switches (30A or 50A) to connect a portable generator to your panel.', action: 'Size Transfer Switch' },
        { name: 'Motor Starting Surge Watts (Air Conditioners)', desc: 'Calculate the huge startup surge power needed when AC compressors kick on.', action: 'Calculate Surge' },
        { name: 'High Altitude Generator Power Loss', desc: 'Calculate generator power loss when running at high mountain elevations.', action: 'Check Altitude Loss' },
      ],
    },
    {
      id: 'cat-motors',
      num: '10',
      title: 'Electric Motors & Machinery',
      desc: 'Motor horsepower, running amps, starting power surge, and speed controllers.',
      icon: Activity,
      color: 'blue',
      count: '6 Tools',
      group: 'Motors & Power',
      tools: [
        { name: 'Motor Full Load Amps & Horsepower (HP to kW)', desc: 'Convert motor horsepower into running electric amps and kilowatt power.', action: 'Check Motor Amps', badge: 'Core' },
        { name: 'Motor Circuit Breaker & Overload Setting', desc: 'Size circuit breakers and overload relays to protect motors without nuisance trips.', action: 'Size Motor Breaker' },
        { name: 'Motor Starting Surge (LRA)', desc: 'Calculate the heavy temporary current spike when an electric motor first starts spinning.', action: 'Check Starting Surge' },
        { name: 'Motor Turning Power & RPM (Torque)', desc: 'Calculate turning power (foot-pounds / Nm) based on motor shaft speed and horsepower.', action: 'Calculate Torque' },
        { name: 'Motor Efficiency & Electric Bill Cost', desc: 'Calculate how much money high-efficiency motors save on industrial electric bills.', action: 'Check Efficiency Savings' },
        { name: 'Variable Speed Drive (VFD) Sizing', desc: 'Select the correct frequency drive controller for variable-speed pumps and fans.', action: 'Size VFD' },
      ],
    },
    {
      id: 'cat-transformers',
      num: '11',
      title: 'Transformers & Voltage Conversion',
      desc: 'Step-up and step-down transformers, full load current, and safety breakers.',
      icon: Zap,
      color: 'purple',
      count: '5 Tools',
      group: 'Motors & Power',
      tools: [
        { name: 'Transformer Power Capacity (kVA to Amps)', desc: 'Calculate primary and secondary running currents for standard transformers.', action: 'Size Transformer', badge: 'Standard' },
        { name: 'Step-Down Transformer Turns Ratio', desc: 'Calculate voltage conversion (e.g. 480V down to 120/208V) and coil turns.', action: 'Check Turns' },
        { name: 'Transformer Primary & Secondary Breakers', desc: 'Size upstream and downstream circuit breakers to protect transformer coils.', action: 'Size Breakers' },
        { name: 'Transformer Heat Loss & Efficiency', desc: 'Calculate energy lost as heat inside transformer steel cores and copper coils.', action: 'Calculate Heat Loss' },
        { name: 'Control Transformer for Relay Panels', desc: 'Size 120V to 24V control power transformers for HVAC and automation panels.', action: 'Size Control Transformer' },
      ],
    },
    {
      id: 'cat-threephase',
      num: '12',
      title: 'Three-Phase vs Single-Phase Power',
      desc: 'Commercial 3-phase wiring, Star/Wye vs Delta setups, and line voltages.',
      icon: Radio,
      color: 'indigo',
      count: '5 Tools',
      group: 'Motors & Power',
      tools: [
        { name: 'Three-Phase Power (kW, kVA, Amps)', desc: 'Calculate power and current for 208V, 240V, and 480V commercial 3-phase systems.', action: 'Calculate 3-Phase', badge: 'Commercial' },
        { name: 'Star (Wye) vs Delta 3-Phase Wiring', desc: 'Understand the difference between 4-wire Wye (with 120V neutral) and 3-wire Delta.', action: 'Compare Wiring' },
        { name: 'Phase Voltage vs Line-to-Line Voltage', desc: 'Convert between line-to-neutral (120V / 277V) and line-to-line (208V / 480V) voltages.', action: 'Convert Voltages' },
        { name: 'Unbalanced 3-Phase Load Check', desc: 'Check if single-phase appliances are overloading one phase in a commercial panel.', action: 'Check Balance' },
        { name: 'Single-Phase to 3-Phase Converter Sizing', desc: 'Size rotary or digital phase converters to run 3-phase machinery from home power.', action: 'Size Phase Converter' },
      ],
    },
    {
      id: 'cat-powerquality',
      num: '13',
      title: 'Power Efficiency & Electric Bill Savings',
      desc: 'Improve power factor, remove electric utility penalty charges, and clean power.',
      icon: Scale,
      color: 'emerald',
      count: '5 Tools',
      group: 'Motors & Power',
      tools: [
        { name: 'Electric Power Efficiency (Power Factor)', desc: 'Calculate how efficiently your building uses electricity and avoid utility penalty fees.', action: 'Check Efficiency', badge: 'Cost Saver' },
        { name: 'Capacitor Bank for Bill Savings', desc: 'Size capacitor banks to bring building power factor up to 0.95 and stop utility fines.', action: 'Size Capacitors' },
        { name: 'Real Power (kW) vs Total Power (kVA)', desc: 'Understand the easy difference between useful work power and total capacity supplied.', action: 'Compare kW and kVA' },
        { name: 'Clean vs Dirty Power (Harmonic Distortion)', desc: 'Check if LED lights and computer power supplies are creating dirty electrical waves.', action: 'Check Harmonics' },
        { name: 'Voltage Sag & Unbalance Checker', desc: 'Check if voltage drops dangerously when heavy machinery switches on.', action: 'Check Voltage Sag' },
      ],
    },
    {
      id: 'cat-grounding',
      num: '14',
      title: 'Grounding & Lightning Safety',
      desc: 'Ground rods, safety ground wires, bonding pipes, and lightning protection.',
      icon: ShieldCheck,
      color: 'cyan',
      count: '4 Tools',
      group: 'Wiring & Panels',
      tools: [
        { name: 'Ground Wire Size for Breaker Panels', desc: 'Select the safe copper ground wire size (10, 8, 6, 4 AWG) based on your main breaker.', action: 'Size Ground Wire', badge: 'Safety' },
        { name: 'Ground Rod Resistance (25 Ohm Rule)', desc: 'Calculate soil resistance to verify if you need one or two 8-foot ground rods.', action: 'Check Ground Rod' },
        { name: 'Metal Water Pipe & Gas Bonding Wire', desc: 'Size the safety bonding jumper wire connecting metal plumbing pipes to ground.', action: 'Size Bonding Wire' },
        { name: 'Whole-House Surge Protector Sizing', desc: 'Select panel surge arresters to protect electronics from lightning strikes.', action: 'Size Surge Protector' },
      ],
    },
    {
      id: 'cat-industrial',
      num: '15',
      title: 'Commercial & Factory Power Systems',
      desc: 'Copper busbars, factory electric loads, switchboards, and motor centers.',
      icon: Globe2,
      color: 'amber',
      count: '4 Tools',
      group: 'Industrial & Electronics',
      tools: [
        { name: 'Copper & Aluminum Busbar Capacity', desc: 'Calculate how many amps of power a solid copper or aluminum busbar bar can carry.', action: 'Size Busbar' },
        { name: 'Factory Total Electric Demand Factor', desc: 'Apply realistic diversity factors so you don’t over-build factory power panels.', action: 'Calculate Demand' },
        { name: 'Short Circuit Current & Fault Rating', desc: 'Calculate maximum short-circuit spark current to choose safe commercial breakers.', action: 'Check Fault Amps' },
        { name: 'Substation Switchboard Load Balancing', desc: 'Balance heavy industrial motor feeds across main commercial distribution panels.', action: 'Balance Switchboard' },
      ],
    },
    {
      id: 'cat-electronics',
      num: '16',
      title: 'Electronics, LEDs & Small Circuits',
      desc: 'LED resistors, voltage divider circuits, 555 timers, and circuit components.',
      icon: Cpu,
      color: 'rose',
      count: '5 Tools',
      group: 'Industrial & Electronics',
      tools: [
        { name: 'LED Resistor Calculator', desc: 'Find the exact resistor ohms needed to safely power an LED without burning it out.', action: 'Size LED Resistor', badge: 'Popular' },
        { name: 'Voltage Divider (Step Down Voltage)', desc: 'Calculate resistor pairs to step 12V or 5V down to any sensor voltage needed.', action: 'Divide Voltage' },
        { name: '555 Timer Flasher & Oscillator', desc: 'Calculate resistor and capacitor values for flashing lights and pulse generators.', action: 'Calculate Timer' },
        { name: 'Zener Diode Voltage Regulator', desc: 'Size resistors to keep sensitive circuit chip voltages steady and safe.', action: 'Regulate Voltage' },
        { name: 'Transistor Switch Base Resistor', desc: 'Calculate base resistor ohms to use transistors as on/off electronic switches.', action: 'Size Transistor' },
      ],
    },
    {
      id: 'cat-components',
      num: '17',
      title: 'Resistors, Capacitors & Color Codes',
      desc: 'Read resistor color bands, SMD chip numbers, and capacitor microfarads.',
      icon: Compass,
      color: 'purple',
      count: '4 Tools',
      group: 'Industrial & Electronics',
      tools: [
        { name: 'Resistor Color Code Band Decoder (4 & 5 Band)', desc: 'Click the colored stripes on a resistor to instantly get its exact ohm value.', action: 'Decode Bands', badge: 'Visual Tool' },
        { name: 'SMD Surface-Mount Resistor Code Reader', desc: 'Type 3-digit or 4-digit codes on tiny circuit chips to find their exact resistance.', action: 'Decode SMD' },
        { name: 'Capacitor Microfarad (µF, nF, pF) Converter', desc: 'Convert between microfarads, nanofarads, and picofarad capacitor markings.', action: 'Convert Capacitors' },
        { name: 'Resistors in Series & Parallel', desc: 'Calculate total resistance when combining multiple resistors together.', action: 'Combine Resistors' },
      ],
    },
    {
      id: 'cat-accircuits',
      num: '18',
      title: 'AC Circuits, Waves & Frequency',
      desc: 'AC impedance, coil reactance, capacitor timing, and resonance frequencies.',
      icon: Radio,
      color: 'blue',
      count: '4 Tools',
      group: 'Industrial & Electronics',
      tools: [
        { name: 'AC Circuit Resistance (Impedance Z)', desc: 'Calculate total resistance to alternating current combining resistors and coils.', action: 'Calculate Impedance' },
        { name: 'Capacitor & Coil AC Resistance (Reactance)', desc: 'Find how much coils and capacitors resist alternating current at different frequencies.', action: 'Check Reactance' },
        { name: 'Radio & Audio Resonant Frequency', desc: 'Calculate the tuning frequency where coils and capacitors resonate together.', action: 'Find Resonance' },
        { name: 'Radio Wave Length from Frequency', desc: 'Convert MHz frequencies into physical radio antenna wavelengths in feet or meters.', action: 'Convert Wavelength' },
      ],
    },
    {
      id: 'cat-ohms',
      num: '19',
      title: 'Volts, Amps, Watts & Ohms (Ohm’s Law)',
      desc: 'The fundamental four: calculate voltage, electric current, power, and resistance.',
      icon: Zap,
      color: 'emerald',
      count: '4 Tools',
      group: 'Industrial & Electronics',
      tools: [
        { name: 'Ohm’s Law Calculator (V = I × R)', desc: 'Enter any two values to instantly calculate Volts, Amps, Ohms, or Watts.', action: 'Calculate Ohm’s Law', badge: 'Everyday' },
        { name: 'Amps to Watts & Watts to Amps', desc: 'Convert everyday appliance wattage into electric current at 120V or 240V.', action: 'Convert Amps & Watts' },
        { name: 'Volts to Amps Converter', desc: 'Calculate how many amps flow through a circuit based on voltage and resistance.', action: 'Convert Volts to Amps' },
        { name: 'Electricity Heat Dissipation (I²R Loss)', desc: 'Calculate how much heat an electric heater, coil, or resistor generates.', action: 'Calculate Heat' },
      ],
    },
    {
      id: 'cat-conversions',
      num: '20',
      title: 'Electrical Unit Conversions',
      desc: 'Convert horsepower to kilowatts, millivolts to volts, and kilowatt-hours.',
      icon: Calculator,
      color: 'indigo',
      count: '5 Tools',
      group: 'Industrial & Electronics',
      tools: [
        { name: 'Horsepower (HP) to Kilowatts (kW)', desc: 'Easily convert electric motor horsepower to metric kilowatts (1 HP = 746 Watts).', action: 'Convert HP to kW', href: '/power-converter', badge: 'Popular' },
        { name: 'Kilowatt-Hours (kWh) to Joules & BTUs', desc: 'Convert electric power usage into heat BTUs and mechanical work energy.', action: 'Convert Energy', href: '/energy-converter' },
        { name: 'MilliAmps (mA) to Amps (A) Converter', desc: 'Convert tiny sensor currents into standard electrical amperes.', action: 'Convert Current' },
        { name: 'Kilovolts (kV) to Volts (V) Converter', desc: 'Convert high-voltage power line ratings to standard single-phase volts.', action: 'Convert Volts' },
        { name: 'Frequency: Hertz (Hz) to RPM', desc: 'Convert electric grid frequency (50Hz / 60Hz) into motor revolutions per minute.', action: 'Convert Hz to RPM' },
      ],
    },
  ];

  // Filtered categories
  const filteredCategories = useMemo(() => {
    let result = allCategories;

    // Filter by group tab
    if (activeTab !== 'all') {
      result = result.filter(c => c.group === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result
        .map(cat => ({
          ...cat,
          tools: cat.tools.filter(
            t =>
              t.name.toLowerCase().includes(q) ||
              t.desc.toLowerCase().includes(q) ||
              cat.title.toLowerCase().includes(q) ||
              cat.desc.toLowerCase().includes(q)
          ),
        }))
        .filter(cat => cat.tools.length > 0 || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q));
    }

    return result;
  }, [searchQuery, activeTab, allCategories]);

  // Total tool count
  const totalToolsCount = useMemo(() => {
    return allCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [allCategories]);

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      hover: 'hover:border-emerald-500/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      hover: 'hover:border-blue-500/40',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
      hover: 'hover:border-purple-500/40',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
      hover: 'hover:border-amber-500/40',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
      hover: 'hover:border-cyan-500/40',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      hover: 'hover:border-rose-500/40',
      icon: 'text-rose-600 dark:text-rose-400',
    },
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
      hover: 'hover:border-indigo-500/40',
      icon: 'text-indigo-600 dark:text-indigo-400',
    },
  };

  // 8 Structured FAQ Cards in Plain English
  const persistentFaqs = [
    {
      q: 'How do I choose the correct wire thickness for a home circuit?',
      a: 'First, find the total electric current (Amps) of your appliance. In North America: 14 AWG wire is used for 15-Amp circuits (lights & bedrooms), 12 AWG for 20-Amp circuits (kitchens & bathrooms), 10 AWG for 30-Amp circuits (water heaters & dryers), and 8 or 6 AWG for 50-Amp EV chargers and ranges.',
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
      takeaway: 'Quick Rule: 14 AWG (15A), 12 AWG (20A), 10 AWG (30A), 6 AWG (50A)',
    },
    {
      q: 'What is "Voltage Drop" and why does wire length matter?',
      a: 'Wires have a tiny amount of natural electrical resistance. When electricity travels through very long wires (over 100 feet), voltage drops along the way. If voltage drops too much (over 3%), motors run sluggishly and electronics can glitch. Using a thicker wire solves the problem.',
      icon: Gauge,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
      takeaway: 'Standard: Keep voltage drop under 3% for strong, safe power',
    },
    {
      q: 'How do I size a circuit breaker for an appliance or EV charger?',
      a: 'Circuit breakers must be sized for at least 125% of any appliance that runs continuously for 3 hours or more (such as space heaters or electric vehicle chargers). For example, a 32-Amp EV charger requires a 40-Amp circuit breaker (32A × 1.25 = 40A).',
      icon: ShieldCheck,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
      takeaway: 'Continuous Rule: Multiply continuous amps by 1.25 to pick breaker size',
    },
    {
      q: 'What is the difference between Watts (kW) and Volt-Amps (kVA)?',
      a: 'Watts (kW) is the real, usable power that actually does work (like heating water or lighting a room). Volt-Amps (kVA) is the total electrical capacity supplied, including the extra magnetic power needed to run motors and transformers.',
      icon: Scale,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      takeaway: 'Remember: kW is real power used; kVA is total capacity needed',
    },
    {
      q: 'What size generator do I need for my home during an outage?',
      a: 'Total up the running watts of your essential appliances (refrigerator ~600W, lights ~300W, Wi-Fi ~50W), then add the large starting surge power needed when refrigerator or air conditioner compressors kick on. Most homes need a 7,500W to 12,000W generator.',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
      takeaway: 'Home Target: 7.5 kW to 12 kW covers essential circuits & AC starting surge',
    },
    {
      q: 'What is the difference between Copper and Aluminum wiring?',
      a: 'Copper carries more electric current in a smaller, thinner wire and is standard for indoor home outlets. Aluminum is much lighter and less expensive, making it the industry standard for large underground service wires bringing power from the street to your house.',
      icon: Plug,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      takeaway: 'Usage: Copper for indoor branch outlets; Aluminum for main street feeders',
    },
    {
      q: 'How many solar panels do I need to eliminate my electric bill?',
      a: 'Divide your daily household energy use (typically 25 to 30 kWh per day) by the average daily sunshine hours in your state (usually 4 to 5 hours). A typical home needs a 6 kW to 8 kW solar system, which equals about 16 to 20 modern 400-watt solar panels.',
      icon: Sun,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      takeaway: 'Average Home: 16 to 20 solar panels (7 kW system) covers standard home use',
    },
    {
      q: 'Is my electrical calculation data and house information private?',
      a: '100% private. All calculations run right inside your web browser. None of your wire lengths, panel numbers, or appliance details are ever uploaded to a server or saved externally.',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      takeaway: 'Guaranteed: 100% in-browser processing with zero server tracking',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* ================= BREADCRUMB BAR ================= */}
      <section className="w-full bg-surface-container-low/50 py-2 border-b border-outline-variant/30">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <span className="text-outline-variant/60">/</span>
            <span className="text-on-surface font-semibold">Electrical Calculators</span>
          </nav>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-on-surface-variant/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{totalToolsCount} Tools • 100% Free &amp; Private</span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: HERO & COMPACT SEARCH ================= */}
      <section className="w-full pt-6 pb-8 sm:pt-8 sm:pb-10 bg-gradient-to-b from-surface-container-low/40 via-background to-background relative overflow-hidden border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
            {/* Header Eyebrow Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-primary text-xs font-semibold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Easy Electrical Sizing &amp; Wire Calculators</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-on-surface tracking-tight leading-tight">
              Electrical Calculators &amp; Wire Sizing Tools
            </h1>

            {/* Subheading in Plain English */}
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Simple, accurate calculators for wire thickness, voltage drop, circuit breaker amps, solar panels, battery runtime, and electric car home chargers.
            </p>

            {/* Compact Search Bar */}
            <div className="w-full max-w-2xl pt-1">
              <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-on-surface-variant ml-3.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  id="electrical-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tools: wire size, voltage drop, breaker, solar panels, EV charger, motor amps..."
                  className="w-full py-2.5 px-3 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-2 text-on-surface-variant hover:text-on-surface rounded transition-colors text-xs"
                    title="Clear search"
                  >
                    Clear
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center justify-center mr-3 bg-surface-container px-2 py-0.5 rounded text-[11px] font-mono text-on-surface-variant font-semibold border border-outline-variant/30">
                  /
                </kbd>
              </div>

              {/* Quick Filter Tag Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 text-xs">
                <span className="text-on-surface-variant/70 text-[11px] font-semibold uppercase tracking-wider mr-1">
                  Popular:
                </span>
                {[
                  'Wire Size',
                  'Voltage Drop',
                  'Circuit Breaker',
                  'EV Charger',
                  'Solar Panels',
                  'Battery Runtime',
                  'Motor Amps',
                  "Ohm's Law",
                ].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      searchInputRef.current?.focus();
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all ${
                      searchQuery.toLowerCase() === tag.toLowerCase()
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Authentic Value Strip */}
            <div className="w-full pt-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-surface-container-lowest/80 backdrop-blur-xs rounded-xl p-2.5 border border-outline-variant/40 shadow-2xs">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">Safety Compliant</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Standard Wire Codes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Plug className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">Home &amp; Industrial</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">120V, 240V &amp; 3-Phase</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">100% Private</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Runs on Your Device</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">20 Categories</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Wiring, Solar &amp; Power</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: COMPACT EXPLORATION GATEWAYS ================= */}
      <section className="w-full py-6 sm:py-8 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Quick Navigation
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                What electrical project are you working on?
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant">
              Click any category to jump directly
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {[
              {
                title: 'Wire Sizing',
                desc: 'Gauge & copper vs aluminum',
                count: '6 Tools',
                icon: Zap,
                color: 'text-blue-500 bg-blue-500/10',
                link: '#cat-wires',
              },
              {
                title: 'Voltage Loss',
                desc: 'Keep power strong over long runs',
                count: '5 Tools',
                icon: Gauge,
                color: 'text-cyan-500 bg-cyan-500/10',
                link: '#cat-vdrop',
              },
              {
                title: 'Breakers & Panels',
                desc: 'Breaker amps & 80% rule',
                count: '5 Tools',
                icon: ShieldCheck,
                color: 'text-purple-500 bg-purple-500/10',
                link: '#cat-breakers',
              },
              {
                title: 'Solar & Battery',
                desc: 'Solar panels & backup hours',
                count: '11 Tools',
                icon: Sun,
                color: 'text-amber-500 bg-amber-500/10',
                link: '#cat-solar',
              },
              {
                title: 'EV Car Chargers',
                desc: 'Level 2 home chargers & amps',
                count: '5 Tools',
                icon: BatteryCharging,
                color: 'text-emerald-500 bg-emerald-500/10',
                link: '#cat-ev',
              },
              {
                title: 'Electric Motors',
                desc: 'Horsepower, amps & breakers',
                count: '6 Tools',
                icon: Activity,
                color: 'text-indigo-500 bg-indigo-500/10',
                link: '#cat-motors',
              },
            ].map(item => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.link}
                  className="group bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 hover:border-primary/50 hover:shadow-xs transition-all flex flex-col justify-between min-h-[92px]"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-on-surface-variant font-medium bg-surface-container px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                      <span className="truncate">{item.title}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                    </h3>
                    <p className="text-[10px] text-on-surface-variant/80 truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: 4 LIVE INTERACTIVE WORKBENCHES ================= */}
      <section className="w-full py-6 sm:py-10 bg-surface-container-low/30 border-b border-outline-variant/20" id="workbenches">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Instant Solvers
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                Live Interactive Electrical Calculators
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Type in your numbers below to see instant answers calculated directly in your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* WORKBENCH 1: Wire Sizing & Voltage Drop */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Wire Thickness &amp; Voltage Loss Calculator
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Find the safe wire gauge and check voltage loss over distance
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Wire Sizer
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Current (Amps)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="5"
                        min="1"
                        value={wb1Current}
                        onChange={e => setWb1Current(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Voltage (V)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="10"
                        value={wb1Voltage}
                        onChange={e => setWb1Voltage(parseFloat(e.target.value) || 240)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Wire Metal
                    </label>
                    <select
                      value={wb1Conductor}
                      onChange={e => setWb1Conductor(e.target.value)}
                      className="w-full py-1.5 px-1 bg-surface-container-low rounded-lg border border-outline-variant/40 font-mono text-xs text-on-surface font-semibold outline-none"
                    >
                      <option value="copper75">Copper</option>
                      <option value="aluminum">Aluminum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      One-Way Feet
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="25"
                        value={wb1Length}
                        onChange={e => setWb1Length(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Recommended Wire
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-primary block mt-0.5">
                      {cableResult.gauge}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Voltage Loss (%)
                    </span>
                    <span className={`text-base sm:text-lg font-bold font-mono block mt-0.5 ${cableResult.isCompliant ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {cableResult.vDropPercent}% ({cableResult.vDropVolts}V)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Max Safe Amps
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {cableResult.ampacity} Amps
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center text-[11px] font-medium text-on-surface-variant">
                  {cableResult.isCompliant ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ Voltage loss is safe and under the recommended 3% limit.
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      ⚠ Voltage loss exceeds 3%. Consider choosing a thicker wire.
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-wires"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Wire Sizing Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 2: Transformer Capacity */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Transformer Power Capacity (kVA to Amps)
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Calculate full load current and circuit breaker sizes
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    kVA Sizer
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Capacity (kVA)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="15"
                        value={wb2Kva}
                        onChange={e => setWb2Kva(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Incoming Volts
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="10"
                        value={wb2PrimaryV}
                        onChange={e => setWb2PrimaryV(parseFloat(e.target.value) || 480)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Outgoing Volts
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="10"
                        value={wb2SecondaryV}
                        onChange={e => setWb2SecondaryV(parseFloat(e.target.value) || 208)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Incoming Side Current
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-purple-600 dark:text-purple-400 block mt-0.5">
                      {transformerResult.pFla} Amps
                    </span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                      Breaker: {transformerResult.pBreaker}A
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Outgoing Side Current
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {transformerResult.sFla} Amps
                    </span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                      Breaker: {transformerResult.sBreaker}A
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-transformers"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Transformer Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 3: Electric Motor Current */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Electric Motor Running Current &amp; Breaker Size
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Calculate motor running current, wire size, and startup breaker
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Motor Sizer
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Motor Horsepower (HP)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="5"
                        value={wb3Hp}
                        onChange={e => setWb3Hp(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">HP</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Motor Voltage (V)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="10"
                        value={wb3Voltage}
                        onChange={e => setWb3Voltage(parseFloat(e.target.value) || 460)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">V (3-Ph)</span>
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Running Current
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      {motorResult.fla} Amps
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Wire Capacity
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {motorResult.wireAmps} Amps
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Startup Breaker
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-primary block mt-0.5">
                      {motorResult.breakerAmps} Amps
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-motors"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Motor &amp; Drive Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 4: Battery Backup Runtime */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <BatteryCharging className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Battery Backup Runtime Calculator
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Calculate how many hours a battery will power home appliances during blackouts
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Runtime
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Battery Size (kWh)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="2.5"
                        value={wb4BatteryKwh}
                        onChange={e => setWb4BatteryKwh(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">kWh</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Home Load (Watts)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="100"
                        value={wb4LoadWatts}
                        onChange={e => setWb4LoadWatts(parseFloat(e.target.value) || 1)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">Watts</span>
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Emergency Runtime
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400 block mt-0.5">
                      {batteryResult.hours} Hours
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Usable Battery Energy
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {batteryResult.usableKwh} kWh
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-batteries"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Battery &amp; UPS Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: COMPLETE 20-CATEGORY DIRECTORY ================= */}
      <section className="w-full py-8 sm:py-12 bg-background" id="directory">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Complete Tool Index
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                All 20 Electrical Calculator Categories
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-0.5">
                Organized simply by what you are building: Home Wiring, Solar, Electric Motors, and Electronics.
              </p>
            </div>

            {/* Filter Tabs & Density Switcher */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center p-1 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs">
                {(['all', 'Wiring & Panels', 'Motors & Power', 'Solar & Batteries', 'Industrial & Electronics'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab === 'all' ? 'All (20)' : tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setViewDensity(viewDensity === 'compact' ? 'detailed' : 'compact')}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs text-on-surface-variant border border-outline-variant/30 transition-colors"
                title="Toggle density"
              >
                {viewDensity === 'compact' ? (
                  <>
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Detailed</span>
                  </>
                ) : (
                  <>
                    <Grid className="w-3.5 h-3.5" />
                    <span>Compact</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search notification when filtering */}
          {searchQuery && (
            <div className="mb-4 p-2.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-between text-xs text-on-surface">
              <span>
                Showing results matching <strong>&ldquo;{searchQuery}&rdquo;</strong> across {filteredCategories.length} categories
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary font-bold hover:underline"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Directory Grid */}
          <div className="space-y-4 sm:space-y-6">
            {filteredCategories.map(cat => {
              const IconComp = cat.icon;
              const colorStyle = colorClasses[cat.color] || colorClasses.blue;

              return (
                <div
                  key={cat.id}
                  id={cat.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs transition-shadow hover:shadow-sm"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-outline-variant/20 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorStyle.bg}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-on-surface truncate">
                            {cat.num}. {cat.title}
                          </h3>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded shrink-0">
                      {cat.tools.length} Tools
                    </span>
                  </div>

                  {/* Category Tools Grid */}
                  <div className={`grid gap-2 ${viewDensity === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {cat.tools.map(tool => (
                      <Link
                        key={tool.name}
                        href={tool.href || '#workbenches'}
                        className={`group p-2.5 sm:p-3 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low border border-outline-variant/30 ${colorStyle.hover} transition-all flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5 line-clamp-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary shrink-0 transition-colors" />
                              <span>{tool.name}</span>
                            </span>
                            {tool.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary/10 text-primary shrink-0">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          {viewDensity === 'detailed' && (
                            <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                              {tool.desc}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant/70 text-[10px]">
                            {tool.action}
                          </span>
                          <span className="text-primary font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            Open Tool <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: 6-STAGE SOLAR & BACKUP WORKFLOW ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-low/40 border-y border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Step-by-Step Project Planner
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface mt-0.5">
                  Complete Solar &amp; Battery Installation Guide
                </h2>
              </div>
              <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md font-medium">
                6-Stage Planning Guide
              </span>
            </div>

            {/* Step Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
              {[
                { step: 1, label: 'Energy Use', sub: 'Daily kWh' },
                { step: 2, label: 'Solar Size', sub: 'Panel Count' },
                { step: 3, label: 'Battery Bank', sub: 'Backup Hours' },
                { step: 4, label: 'Inverter', sub: 'Max Watts' },
                { step: 5, label: 'Wires & Breakers', sub: 'Safe Wiring' },
                { step: 6, label: 'Payback', sub: 'Years to Save' },
              ].map(s => (
                <button
                  key={s.step}
                  onClick={() => setWorkflowStep(s.step)}
                  className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    workflowStep === s.step
                      ? 'bg-primary text-white font-bold shadow-xs'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span className="text-[10px] font-mono block opacity-80">STEP 0{s.step}</span>
                  <span className="text-xs font-bold block truncate">{s.label}</span>
                  <span className="text-[10px] opacity-75 block truncate">{s.sub}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Step Content */}
            <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {workflowData[workflowStep].badge}
                </span>
                <h4 className="text-sm font-bold text-on-surface">
                  {workflowData[workflowStep].title}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {workflowData[workflowStep].desc}
                </p>
                <div className="pt-1 text-[11px] font-mono text-primary font-semibold">
                  Rule: {workflowData[workflowStep].formula}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full md:w-auto min-w-[280px]">
                {workflowData[workflowStep].metrics.map(m => (
                  <div key={m.label} className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-center">
                    <span className="block text-[10px] text-on-surface-variant truncate">{m.label}</span>
                    <span className="font-mono font-bold text-xs text-on-surface block mt-0.5 truncate">{m.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: HELPFUL COMPARISONS ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Everyday Explanations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
              Side-by-Side Electrical Comparisons
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Clear, simple explanations for concepts and equipment ratings that often get confused.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Compare 1 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Power Types
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Real Power (kW) vs Total Power (kVA)
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Real Power (kW)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Actual power used by heaters and appliances. Shows on electric bills as kWh.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Total Power (kVA)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Total electrical capacity needed to size transformers and generators.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compare 2 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Wiring Metals
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Copper vs Aluminum Wiring
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Copper Wire</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Thinner, highly durable, standard for indoor home branch outlets.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Aluminum Wire</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Lightweight, low cost, standard for heavy underground street feeders.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compare 3 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Batteries
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Lead-Acid vs Lithium (LiFePO4)
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Lead-Acid / AGM</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      50% usable capacity, lasts 500 charge cycles, heavy weight.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Lithium LiFePO4</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      90% usable capacity, lasts 4,000+ cycles, lightweight and fast.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compare 4 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Voltages
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  120V vs 240V vs 3-Phase Power
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">120V / 240V (Single)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Standard home power for lights (120V) and dryers/AC (240V).
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">3-Phase (Commercial)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      High-efficiency power for factories, workshops, and big motors.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compare 5 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Circuit Breakers
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Standard Breakers vs GFCI Outlets
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Standard Breaker</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Protects the wire from catching fire if too many appliances turn on.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">GFCI Safety Outlet</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Instantly cuts power in milliseconds to prevent dangerous electric shocks.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compare 6 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Units
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Volts vs Amps vs Watts
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Volts &amp; Amps</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Volts is water pressure; Amps is the volume of water flowing.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Watts (Power)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Volts multiplied by Amps. The total energy an appliance consumes.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: 2-COLUMN ALWAYS-VISIBLE FAQ GRID ================= */}
      <section className="w-full py-8 sm:py-12 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
              Electrical Questions &amp; Answers
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Clear, straightforward answers about wire sizes, circuit breakers, solar, and safety.
            </p>
          </div>

          {/* Responsive Two-Column Grid with Persistent Always-Visible Answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {persistentFaqs.map((faq, idx) => {
              const IconComp = faq.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant/40 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${faq.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-on-surface leading-snug">
                          {faq.q}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] text-on-surface-variant/90">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-medium truncate">{faq.takeaway}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: TRUST & SAFETY FOOTER ================= */}
      <section className="w-full py-6 bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface">
                  Free, Private &amp; Simple Electrical Sizing
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  All calculations happen directly inside your web browser. Always follow local electrical safety codes and consult a licensed electrician for permit installations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant shrink-0">
              <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant/30 font-semibold">
                100% Free &amp; Private
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
