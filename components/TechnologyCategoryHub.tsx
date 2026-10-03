'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Sparkles,
  Wifi,
  HardDrive,
  Lock,
  Download,
  Eye,
  EyeOff,
  Copy,
  Check,
  Layers,
  Sparkle
} from 'lucide-react';

type TechCategory = 'all' | 'networking' | 'storage' | 'hardware' | 'web-dev' | 'cybersecurity';

interface ToolItem {
  id: string;
  name: string;
  category: TechCategory;
  categoryLabel: string;
  badge: string;
  desc: string;
  simpleFormula: string;
  href: string;
  isPopular?: boolean;
}

const TECH_TOOLS: ToolItem[] = [
  // 1. Networking & Internet
  {
    id: 'download-time',
    name: 'Download & Upload Time Estimator',
    category: 'networking',
    categoryLabel: 'Networking',
    badge: 'Popular',
    desc: 'Calculate exact minutes and hours to download games, updates, and 4K movies across any connection speed.',
    simpleFormula: 'Time = (File Size in MB × 8) ÷ Internet Speed in Mbps',
    href: '#workbench-download',
    isPopular: true
  },
  {
    id: 'mbps-to-mbs',
    name: 'Internet Speed Converter (Mbps to MB/s)',
    category: 'networking',
    categoryLabel: 'Networking',
    badge: 'Essential',
    desc: 'Quickly convert between network bit rates (Mbps) and real disk download speeds (Megabytes per second).',
    simpleFormula: '1 MB/s = 8 Mbps (Divide Mbps by 8)',
    href: '/conversions/data-transfer-rate'
  },
  {
    id: 'ipv4-subnet',
    name: 'IPv4 Subnet & Home IP Calculator',
    category: 'networking',
    categoryLabel: 'Networking',
    badge: 'Popular',
    desc: 'Find out how many devices can fit on your home network and see usable IP address ranges in simple terms.',
    simpleFormula: 'Usable Devices = (2^(32 - Subnet Number)) - 2',
    href: '#directory',
    isPopular: true
  },
  {
    id: 'wifi-bandwidth',
    name: 'Home Wi-Fi Streaming Bandwidth Sizer',
    category: 'networking',
    categoryLabel: 'Networking',
    badge: 'Household',
    desc: 'Calculate how much internet speed your family needs for simultaneous Netflix 4K, gaming, and Zoom calls.',
    simpleFormula: 'Total Speed Needed = Sum of all active device stream requirements',
    href: '#directory'
  },
  {
    id: 'ping-latency',
    name: 'Ping, Latency & Distance Estimator',
    category: 'networking',
    categoryLabel: 'Networking',
    badge: 'Gaming',
    desc: 'Estimate the physical delay (ping in milliseconds) between your computer and game servers around the globe.',
    simpleFormula: 'Round-trip delay ≈ 10 ms per 1,000 km of fiber optic glass',
    href: '#directory'
  },

  // 2. Storage & Memory
  {
    id: 'binary-storage',
    name: 'Binary Storage Converter (GB vs GiB)',
    category: 'storage',
    categoryLabel: 'Storage',
    badge: 'Popular',
    desc: 'See the real usable capacity of your new 1 TB or 2 TB hard drive or SSD when plugged into Windows.',
    simpleFormula: 'Windows Size = Label Bytes ÷ (1,024 × 1,024 × 1,024)',
    href: '#workbench-storage',
    isPopular: true
  },
  {
    id: 'photo-video-storage',
    name: 'Photo & Video Storage Capacity Sizer',
    category: 'storage',
    categoryLabel: 'Storage',
    badge: 'Everyday',
    desc: 'Estimate how many thousands of phone photos, MP3s, or 4K videos will fit on a 128 GB, 256 GB, or 1 TB drive.',
    simpleFormula: 'Total Photos = Drive Space (MB) ÷ Average Photo Size (MB)',
    href: '#directory'
  },
  {
    id: 'raid-calculator',
    name: 'RAID Hard Drive Safety & Capacity Planner',
    category: 'storage',
    categoryLabel: 'Storage',
    badge: 'Popular',
    desc: 'Calculate usable storage space and drive failure protection when combining drives in RAID 0, 1, 5, or 10.',
    simpleFormula: 'RAID 5 Usable = (Number of Drives - 1) × Drive Capacity',
    href: '#directory',
    isPopular: true
  },
  {
    id: 'ssd-lifespan',
    name: 'SSD Lifespan & Health (TBW) Forecaster',
    category: 'storage',
    categoryLabel: 'Storage',
    badge: 'Hardware',
    desc: 'Estimate how many years your solid-state drive will last based on your daily gigabytes written.',
    simpleFormula: 'Years of Life = Total Terabytes Written (TBW) ÷ (Daily GB × 365 ÷ 1,000)',
    href: '#directory'
  },
  {
    id: 'backup-window',
    name: 'Computer Backup Time Estimator',
    category: 'storage',
    categoryLabel: 'Storage',
    badge: 'Backup',
    desc: 'Calculate how many hours it will take to clone or back up your computer to an external USB drive or cloud.',
    simpleFormula: 'Backup Hours = Backup Size (GB) ÷ Transfer Speed (GB/hr)',
    href: '#directory'
  },

  // 3. Hardware & Systems
  {
    id: 'server-power-cost',
    name: 'Computer Power & Electricity Cost Sizer',
    category: 'hardware',
    categoryLabel: 'Hardware',
    badge: 'Popular',
    desc: 'Estimate monthly electricity bills for running a desktop PC, gaming rig, home server, or NAS 24/7.',
    simpleFormula: 'Cost = (Watts × Daily Hours × 30 ÷ 1,000) × Electricity Rate ($/kWh)',
    href: '#directory',
    isPopular: true
  },
  {
    id: 'screen-ppi',
    name: 'Screen Sharpness & Pixel Density (PPI) Sizer',
    category: 'hardware',
    categoryLabel: 'Hardware',
    badge: 'Display',
    desc: 'Calculate the pixels-per-inch (PPI) of any computer monitor, laptop screen, or smartphone display.',
    simpleFormula: 'PPI = √(Width² + Height²) ÷ Screen Diagonal Inches',
    href: '#directory'
  },
  {
    id: 'ups-battery',
    name: 'UPS Battery Backup Runtime Calculator',
    category: 'hardware',
    categoryLabel: 'Hardware',
    badge: 'Reliability',
    desc: 'Find out how many minutes your computer or home Wi-Fi router will stay powered during a blackout.',
    simpleFormula: 'Runtime Minutes = (Battery Watt-Hours × 0.8) ÷ Device Watts × 60',
    href: '#directory'
  },
  {
    id: 'datacenter-rack',
    name: 'Server Rack Unit (U) Height Sizer',
    category: 'hardware',
    categoryLabel: 'Hardware',
    badge: 'IT Admin',
    desc: 'Convert standard 1U, 2U, and 4U server heights into exact inches and centimeters for equipment mounting.',
    simpleFormula: '1 Rack Unit (1U) = exactly 1.75 inches (44.45 mm)',
    href: '#directory'
  },
  {
    id: 'cpu-utilization',
    name: 'CPU & Core Workload Estimator',
    category: 'hardware',
    categoryLabel: 'Hardware',
    badge: 'Performance',
    desc: 'Estimate whether your processor has enough cores and clock speed for running multiple apps at once.',
    simpleFormula: 'Capacity % = (Active Virtual Cores ÷ Physical Cores) × 100',
    href: '#directory'
  },

  // 4. Web Development & Design
  {
    id: 'rem-to-px',
    name: 'REM to PX & PX to REM Font Converter',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    badge: 'Popular',
    desc: 'Convert CSS rem units to standard pixel sizes and back for responsive, accessible website design.',
    simpleFormula: 'Pixels = REM value × 16 (default base size)',
    href: '#directory',
    isPopular: true
  },
  {
    id: 'aspect-ratio',
    name: 'Image & Video Aspect Ratio Calculator (16:9, 4:3)',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    badge: 'Design',
    desc: 'Resize images and video frames proportionally without stretching, distorting, or squishing them.',
    simpleFormula: 'New Height = (Original Height ÷ Original Width) × New Width',
    href: '#directory'
  },
  {
    id: 'wcag-contrast',
    name: 'Website Color Contrast & Readability Checker',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    badge: 'Accessibility',
    desc: 'Check if your text and background colors are easy to read and meet official WCAG AA/AAA guidelines.',
    simpleFormula: 'Contrast Ratio = (Lighter Luminance + 0.05) ÷ (Darker Luminance + 0.05)',
    href: '#directory'
  },
  {
    id: 'viewport-clamp',
    name: 'CSS Fluid Typography clamp() Sizer',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    badge: 'CSS',
    desc: 'Generate smooth fluid font scaling that shrinks on mobile phones and expands on desktop monitors.',
    simpleFormula: 'clamp(minimum_px, preferred_vw, maximum_px)',
    href: '#directory'
  },
  {
    id: 'image-file-optimizer',
    name: 'Web Image Compression & Payload Sizer',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    badge: 'Speed',
    desc: 'Estimate download savings when converting heavy PNG or JPEG images into modern WebP and AVIF formats.',
    simpleFormula: 'Savings % = ((Old Size - New Size) ÷ Old Size) × 100',
    href: '#directory'
  },

  // 5. Cybersecurity & Privacy
  {
    id: 'password-strength',
    name: 'Password Strength & Entropy Checker',
    category: 'cybersecurity',
    categoryLabel: 'Cybersecurity',
    badge: 'Popular',
    desc: 'Test how many days, years, or centuries it would take a hacker computer to crack your password.',
    simpleFormula: 'Entropy Bits = Password Length × log₂(Character Variety)',
    href: '#workbench-password',
    isPopular: true
  },
  {
    id: 'brute-force-crack',
    name: 'Brute-Force Attack Time Sizer',
    category: 'cybersecurity',
    categoryLabel: 'Cybersecurity',
    badge: 'Security',
    desc: 'Compare cracking speeds between a normal laptop versus a criminal supercomputing graphics card rig.',
    simpleFormula: 'Cracking Seconds = Total Combinations ÷ Guesses per Second',
    href: '#workbench-password'
  },
  {
    id: 'aes-encryption',
    name: 'AES-128 vs AES-256 Encryption Sizer',
    category: 'cybersecurity',
    categoryLabel: 'Cybersecurity',
    badge: 'Encryption',
    desc: 'Visualize why modern 256-bit bank encryption cannot be cracked even if all computers on Earth worked forever.',
    simpleFormula: 'AES-256 Key Space = 2²⁵⁶ (approx. 1.15 × 10⁷⁷ combinations)',
    href: '#directory'
  },
  {
    id: 'sha256-hash',
    name: 'File Integrity & Checksum Verifier',
    category: 'cybersecurity',
    categoryLabel: 'Cybersecurity',
    badge: 'Integrity',
    desc: 'Understand how SHA-256 fingerprint codes guarantee your downloaded files were not modified or corrupted.',
    simpleFormula: 'Any file change modifies all 64 characters of the unique hash',
    href: '#directory'
  },
  {
    id: 'data-breach-risk',
    name: 'Password Reuse & Credential Risk Estimator',
    category: 'cybersecurity',
    categoryLabel: 'Cybersecurity',
    badge: 'Safety',
    desc: 'Calculate the multiplying risk to your accounts if you use the same password on multiple websites.',
    simpleFormula: 'Compromise Risk = 1 - (1 - Breach Probability)^(Number of Sites)',
    href: '#directory'
  }
];

export default function TechnologyCategoryHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TechCategory>('all');
  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<'download' | 'storage' | 'password'>('download');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // --- WORKBENCH 1: Download Time Estimator State ---
  const [fileSizeVal, setFileSizeVal] = useState<number>(50);
  const [fileSizeUnit, setFileSizeUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [internetSpeedMbps, setInternetSpeedMbps] = useState<number>(300);
  const [overheadPct, setOverheadPct] = useState<number>(5);

  const downloadResults = useMemo(() => {
    let sizeInMB = fileSizeVal;
    if (fileSizeUnit === 'GB') sizeInMB = fileSizeVal * 1024;
    if (fileSizeUnit === 'TB') sizeInMB = fileSizeVal * 1024 * 1024;

    const totalBits = sizeInMB * 8 * (1 + overheadPct / 100);
    const speed = Math.max(1, internetSpeedMbps);
    const totalSeconds = totalBits / speed;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let formattedTime = '';
    if (hours > 0) {
      formattedTime = `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      formattedTime = `${minutes}m ${seconds}s`;
    } else {
      formattedTime = `${seconds} seconds`;
    }

    const effectiveMBps = ((speed / 8) * (1 - overheadPct / 100)).toFixed(1);

    const gigabitSecs = totalBits / 1000;
    const gigMins = Math.floor(gigabitSecs / 60);
    const gigSecs = Math.floor(gigabitSecs % 60);
    const gigabitFormatted = gigMins > 0 ? `${gigMins}m ${gigSecs}s` : `${gigSecs}s`;

    const speedRatio = (1000 / speed).toFixed(1);

    return {
      formattedTime,
      totalSeconds,
      effectiveMBps,
      gigabitFormatted,
      speedRatio,
      sizeInMB
    };
  }, [fileSizeVal, fileSizeUnit, internetSpeedMbps, overheadPct]);

  // --- WORKBENCH 2: Binary Storage Converter State ---
  const [driveLabelSize, setDriveLabelSize] = useState<number>(1);
  const [driveUnit, setDriveUnit] = useState<'GB' | 'TB'>('TB');

  const storageResults = useMemo(() => {
    let totalBytes = driveLabelSize * 1_000_000_000;
    if (driveUnit === 'TB') {
      totalBytes = driveLabelSize * 1_000_000_000_000;
    }

    const gib = totalBytes / 1_073_741_824;
    const tib = gib / 1024;

    const reportedDisplay = driveUnit === 'TB'
      ? `${tib.toFixed(2)} TiB (${gib.toFixed(1)} GiB)`
      : `${gib.toFixed(2)} GiB`;

    const labelDisplay = `${driveLabelSize} ${driveUnit}`;
    const diffPct = (1 - (gib / (driveUnit === 'TB' ? driveLabelSize * 1000 : driveLabelSize))) * 100;
    const diffGb = (driveUnit === 'TB' ? driveLabelSize * 1000 : driveLabelSize) - gib;

    const photoCount = Math.floor(gib * 1024 / 4.5);
    const songCount = Math.floor(gib * 1024 / 8);
    const gameCount = Math.floor(gib / 65);
    const movieCount4K = Math.floor(gib / 18);

    return {
      labelDisplay,
      reportedDisplay,
      gib: gib.toFixed(1),
      diffGb: diffGb.toFixed(1),
      diffPct: Math.abs(diffPct).toFixed(1),
      photoCount: photoCount.toLocaleString(),
      songCount: songCount.toLocaleString(),
      gameCount: gameCount.toLocaleString(),
      movieCount4K: movieCount4K.toLocaleString()
    };
  }, [driveLabelSize, driveUnit]);

  // --- WORKBENCH 3: Password Strength Checker State ---
  const [customPassword, setCustomPassword] = useState('Sunset-Guitar-2026!');
  const [showPassword, setShowPassword] = useState(false);

  const passwordResults = useMemo(() => {
    const pwd = customPassword;
    const len = pwd.length;

    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumber) charsetSize += 10;
    if (hasSymbol) charsetSize += 32;

    if (charsetSize === 0) charsetSize = 1;

    const entropyBits = len > 0 ? len * Math.log2(charsetSize) : 0;

    let crackTimeLaptop = '';
    let crackTimeGpu = '';
    let securityLevel: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Practically Uncrackable' = 'Weak';
    let badgeClass = 'bg-error/15 text-error border border-error/30';
    const progressPct = Math.min(100, Math.round((entropyBits / 100) * 100));

    if (entropyBits < 36) {
      securityLevel = 'Very Weak';
      badgeClass = 'bg-error/15 text-error border border-error/30';
      crackTimeLaptop = 'Instant (< 1 millisecond)';
      crackTimeGpu = 'Instant (< 1 millisecond)';
    } else if (entropyBits < 52) {
      securityLevel = 'Weak';
      badgeClass = 'bg-tertiary/15 text-tertiary border border-tertiary/30';
      crackTimeLaptop = '~ 5 minutes';
      crackTimeGpu = '< 1 second';
    } else if (entropyBits < 68) {
      securityLevel = 'Fair';
      badgeClass = 'bg-tertiary/20 text-tertiary border border-tertiary/40';
      crackTimeLaptop = '~ 3 months';
      crackTimeGpu = '~ 4 hours';
    } else if (entropyBits < 85) {
      securityLevel = 'Strong';
      badgeClass = 'bg-secondary/15 text-secondary border border-secondary/30';
      crackTimeLaptop = '~ 500,000 years';
      crackTimeGpu = '~ 50 years';
    } else {
      securityLevel = 'Practically Uncrackable';
      badgeClass = 'bg-primary/20 text-primary border border-primary/40';
      crackTimeLaptop = '> 100 Trillion Years';
      crackTimeGpu = '> 100 Million Years';
    }

    return {
      length: len,
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      charsetSize,
      entropyBits: entropyBits.toFixed(1),
      securityLevel,
      badgeClass,
      crackTimeLaptop,
      crackTimeGpu,
      progressPct
    };
  }, [customPassword]);

  const filteredTools = useMemo(() => {
    return TECH_TOOLS.filter((t) => {
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q) ||
        t.badge.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  const popularTools = useMemo(() => {
    return TECH_TOOLS.filter((t) => t.isPopular);
  }, []);

  const handleCopyFormula = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="w-full bg-surface text-on-surface min-h-screen antialiased transition-colors duration-200">
      {/* 1. Header & Hero Section */}
      <section className="border-b border-outline-variant/40 bg-surface-container-low/60 py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-on-surface font-semibold">Technology Calculators</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Beginner Friendly • Real-World Examples • Simple Explanations</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
                Technology Calculators
              </h1>
              <p className="mt-3 text-base sm:text-lg text-on-surface-variant leading-relaxed">
                Clear, simple calculation tools for computers, home Wi-Fi, internet downloads, hard drive storage, web design, and password safety. No complicated jargon—just straightforward math explained in everyday words.
              </p>
            </div>

            {/* Quick stats banner */}
            <div className="flex flex-wrap md:flex-col gap-3 bg-surface-container-lowest border border-outline-variant/60 p-4 rounded-xl text-xs sm:text-sm shadow-xs shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="font-semibold text-on-surface">5 Essential Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="font-semibold text-on-surface">3 Interactive Workbenches</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="font-semibold text-on-surface">20+ Practical Tools</span>
              </div>
            </div>
          </div>

          {/* Universal Search & Quick Filter Tags */}
          <div className="mt-8 pt-6 border-t border-outline-variant/40">
            <div className="relative max-w-2xl">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search download time, hard drive GB to GiB, password strength, subnet, power cost..."
                className="w-full pl-11 pr-14 py-3 bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/60 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-xs transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
              <span className="text-on-surface-variant font-medium">Quick Jumps:</span>
              <button
                onClick={() => { setActiveWorkbenchTab('download'); const el = document.getElementById('workbenches'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-medium"
              >
                ⚡ Download Speed
              </button>
              <button
                onClick={() => { setActiveWorkbenchTab('storage'); const el = document.getElementById('workbenches'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 transition-colors font-medium"
              >
                💾 1 TB Drive in Windows
              </button>
              <button
                onClick={() => { setActiveWorkbenchTab('password'); const el = document.getElementById('workbenches'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-2.5 py-1 rounded-md bg-tertiary/10 text-tertiary border border-tertiary/20 hover:bg-tertiary/20 transition-colors font-medium"
              >
                🔒 Password Cracking Time
              </button>
              <button
                onClick={() => { setActiveCategory('hardware'); const el = document.getElementById('directory'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-2.5 py-1 rounded-md bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors font-medium"
              >
                💡 PC Electricity Cost
              </button>
              <button
                onClick={() => { setActiveCategory('web-dev'); const el = document.getElementById('directory'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-2.5 py-1 rounded-md bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors font-medium"
              >
                📐 REM to PX Units
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Tools Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-tertiary" />
              Most Popular Technology Tools
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              The everyday calculation tools most frequently used by home users, students, and professionals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-surface-container-lowest border border-outline-variant/70 hover:border-primary/60 rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {tool.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/30">
                    ★ {tool.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface mt-1">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-mono text-[11px] truncate max-w-[170px]" title={tool.simpleFormula}>
                  {tool.simpleFormula}
                </span>
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Open Tool
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Three Live Interactive Workbenches */}
      <section id="workbenches" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl shadow-xs overflow-hidden">
          {/* Workbench Header & Tabs */}
          <div className="border-b border-outline-variant/50 bg-surface-container-low/70 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Interactive Live Simulators
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
                  Try It Live: Instant Tech Calculators
                </h2>
              </div>

              {/* Tab Selector */}
              <div className="inline-flex p-1 bg-surface-container rounded-xl border border-outline-variant/60">
                <button
                  onClick={() => setActiveWorkbenchTab('download')}
                  className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeWorkbenchTab === 'download'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Time</span>
                </button>
                <button
                  onClick={() => setActiveWorkbenchTab('storage')}
                  className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeWorkbenchTab === 'storage'
                      ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  <span>GB vs GiB Storage</span>
                </button>
                <button
                  onClick={() => setActiveWorkbenchTab('password')}
                  className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeWorkbenchTab === 'password'
                      ? 'bg-surface-container-lowest text-tertiary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Password Strength</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {/* WORKBENCH 1: Download Time Estimator */}
            {activeWorkbenchTab === 'download' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-5">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Wifi className="w-4 h-4" />
                    <span>Download & Upload Time Estimator</span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Find out exactly how long your game update, film, or system backup will take based on your home internet speed.
                  </p>

                  {/* Preset File Sizing Buttons */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-2">
                      Popular File Sizing Presets:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => { setFileSizeVal(4.5); setFileSizeUnit('GB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        🎬 HD Movie (4.5 GB)
                      </button>
                      <button
                        onClick={() => { setFileSizeVal(60); setFileSizeUnit('GB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        🎮 AAA Video Game (60 GB)
                      </button>
                      <button
                        onClick={() => { setFileSizeVal(120); setFileSizeUnit('GB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        ⚡ 4K Game + DLC (120 GB)
                      </button>
                      <button
                        onClick={() => { setFileSizeVal(1); setFileSizeUnit('TB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        💾 Full PC Backup (1 TB)
                      </button>
                    </div>
                  </div>

                  {/* File Size Input */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        File Size:
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={fileSizeVal}
                        onChange={(e) => setFileSizeVal(Math.max(0.1, parseFloat(e.target.value) || 0))}
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Unit:
                      </label>
                      <select
                        value={fileSizeUnit}
                        onChange={(e) => setFileSizeUnit(e.target.value as 'MB' | 'GB' | 'TB')}
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value="MB">MB (Megabytes)</option>
                        <option value="GB">GB (Gigabytes)</option>
                        <option value="TB">TB (Terabytes)</option>
                      </select>
                    </div>
                  </div>

                  {/* Internet Speed Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-2">
                      Internet Speed Presets (Mbps):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setInternetSpeedMbps(25)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${internetSpeedMbps === 25 ? 'bg-primary text-on-primary border-primary font-bold' : 'bg-surface-container border-outline-variant/80 text-on-surface hover:bg-surface-container-high'}`}
                      >
                        25 Mbps (Basic DSL)
                      </button>
                      <button
                        onClick={() => setInternetSpeedMbps(100)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${internetSpeedMbps === 100 ? 'bg-primary text-on-primary border-primary font-bold' : 'bg-surface-container border-outline-variant/80 text-on-surface hover:bg-surface-container-high'}`}
                      >
                        100 Mbps (Standard)
                      </button>
                      <button
                        onClick={() => setInternetSpeedMbps(300)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${internetSpeedMbps === 300 ? 'bg-primary text-on-primary border-primary font-bold' : 'bg-surface-container border-outline-variant/80 text-on-surface hover:bg-surface-container-high'}`}
                      >
                        300 Mbps (Fast Cable)
                      </button>
                      <button
                        onClick={() => setInternetSpeedMbps(1000)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${internetSpeedMbps === 1000 ? 'bg-primary text-on-primary border-primary font-bold' : 'bg-surface-container border-outline-variant/80 text-on-surface hover:bg-surface-container-high'}`}
                      >
                        1,000 Mbps (Gigabit Fiber)
                      </button>
                    </div>
                  </div>

                  {/* Speed input & overhead slider */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Custom Speed (Mbps):
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={internetSpeedMbps}
                        onChange={(e) => setInternetSpeedMbps(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Network Overhead: {overheadPct}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={overheadPct}
                        onChange={(e) => setOverheadPct(parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-container-high accent-primary rounded-lg cursor-pointer mt-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Download Results & Visualizer */}
                <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Estimated Download Duration
                    </span>
                    <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary font-mono">
                      {downloadResults.formattedTime}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Real-world transfer speed: <strong className="text-on-surface font-bold">{downloadResults.effectiveMBps} MB per second</strong>
                    </p>

                    {/* Visual Speed Comparison Bars */}
                    <div className="mt-6 space-y-3">
                      <span className="text-xs font-semibold text-on-surface block">
                        Comparison with Gigabit Fiber Connection:
                      </span>

                      {/* Current Speed Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-medium">
                          <span>Your Connection ({internetSpeedMbps} Mbps):</span>
                          <span className="font-bold text-on-surface">{downloadResults.formattedTime}</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(10, (internetSpeedMbps / 1000) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Gigabit Fiber Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-medium">
                          <span>Gigabit Fiber (1,000 Mbps):</span>
                          <span className="font-bold text-secondary">{downloadResults.gigabitFormatted} ({downloadResults.speedRatio}x Faster)</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full rounded-full w-full" />
                        </div>
                      </div>
                    </div>

                    {/* Plain English explanation box */}
                    <div className="mt-6 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-xs sm:text-sm text-on-surface space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-primary">
                        <Lightbulb className="w-4 h-4 text-tertiary" />
                        Why 300 Mbps doesn’t mean 300 Megabytes per second:
                      </p>
                      <p className="text-on-surface-variant leading-relaxed">
                        There are <strong className="text-on-surface">8 bits in 1 byte</strong>. Internet providers advertise speeds in Megabits (Mbps), but your computer downloads in Megabytes (MB). Always divide your plan speed by 8 to get your actual download speed!
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Formula: Time = (File MB × 8) ÷ Speed Mbps</span>
                    <button
                      onClick={() => handleCopyFormula('Download Time = (File Size in Megabytes * 8) / Internet Speed in Mbps')}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      {copiedFormula ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFormula ? 'Copied' : 'Copy Formula'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH 2: Binary Storage Converter */}
            {activeWorkbenchTab === 'storage' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-5">
                  <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
                    <HardDrive className="w-4 h-4" />
                    <span>Hard Drive & SSD Usable Space Sizer (GB vs GiB)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Ever bought a 1 TB hard drive and wondered why Windows displays 931 GB? Calculate exact reported space and see what actually fits on it.
                  </p>

                  {/* Drive presets */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-2">
                      Standard Commercial Drive Sizes:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => { setDriveLabelSize(256); setDriveUnit('GB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        256 GB SSD
                      </button>
                      <button
                        onClick={() => { setDriveLabelSize(512); setDriveUnit('GB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        512 GB NVMe
                      </button>
                      <button
                        onClick={() => { setDriveLabelSize(1); setDriveUnit('TB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        1 TB Drive
                      </button>
                      <button
                        onClick={() => { setDriveLabelSize(2); setDriveUnit('TB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        2 TB Drive
                      </button>
                      <button
                        onClick={() => { setDriveLabelSize(8); setDriveUnit('TB'); }}
                        className="px-2.5 py-1 text-xs rounded bg-surface-container border border-outline-variant/80 text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        8 TB NAS HDD
                      </button>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Packaging Drive Capacity:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={driveLabelSize}
                        onChange={(e) => setDriveLabelSize(Math.max(1, parseFloat(e.target.value) || 1))}
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Unit:
                      </label>
                      <select
                        value={driveUnit}
                        onChange={(e) => setDriveUnit(e.target.value as 'GB' | 'TB')}
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                      >
                        <option value="GB">GB (Gigabytes)</option>
                        <option value="TB">TB (Terabytes)</option>
                      </select>
                    </div>
                  </div>

                  {/* Real World Item Capacities */}
                  <div className="p-4 bg-surface-container-lowest border border-outline-variant/70 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-on-surface block">
                      What can you realistically store on this drive?
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/60">
                        <span className="text-on-surface-variant block">Smartphone Photos:</span>
                        <strong className="text-on-surface text-sm font-bold font-mono">~{storageResults.photoCount}</strong>
                      </div>
                      <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/60">
                        <span className="text-on-surface-variant block">High-Quality Songs:</span>
                        <strong className="text-on-surface text-sm font-bold font-mono">~{storageResults.songCount}</strong>
                      </div>
                      <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/60">
                        <span className="text-on-surface-variant block">Big Video Games (65 GB):</span>
                        <strong className="text-on-surface text-sm font-bold font-mono">~{storageResults.gameCount} games</strong>
                      </div>
                      <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/60">
                        <span className="text-on-surface-variant block">4K Movies (18 GB):</span>
                        <strong className="text-on-surface text-sm font-bold font-mono">~{storageResults.movieCount4K} movies</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Storage Results & Visualizer */}
                <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Windows Computer Reported Capacity
                    </span>
                    <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-secondary font-mono">
                      {storageResults.reportedDisplay}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Box Label: <strong className="text-on-surface font-bold">{storageResults.labelDisplay}</strong> (Difference: {storageResults.diffPct}% binary offset)
                    </p>

                    {/* Visual Disk Partition Comparison Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-xs text-on-surface font-semibold mb-2">
                        <span>Drive Storage Breakdown:</span>
                        <span className="font-mono">{storageResults.gib} GB Usable in Windows</span>
                      </div>

                      <div className="w-full bg-surface-container-high h-7 rounded-xl flex overflow-hidden p-1 gap-1 border border-outline-variant/40">
                        <div
                          className="bg-secondary rounded-lg flex items-center justify-center text-on-primary font-bold text-xs transition-all duration-500"
                          style={{ width: `${100 - parseFloat(storageResults.diffPct)}%` }}
                        >
                          Usable ({100 - Math.round(parseFloat(storageResults.diffPct))}%)
                        </div>
                        <div
                          className="bg-tertiary rounded-lg flex items-center justify-center text-on-primary font-bold text-[11px] transition-all duration-500"
                          style={{ width: `${storageResults.diffPct}%` }}
                        >
                          Binary {Math.round(parseFloat(storageResults.diffPct))}%
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 px-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Usable Space on Windows
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-tertiary" /> Binary vs Decimal math difference
                        </span>
                      </div>
                    </div>

                    {/* Simple English explanation */}
                    <div className="mt-6 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-xs sm:text-sm text-on-surface space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        You did not lose any storage space!
                      </p>
                      <p className="text-on-surface-variant leading-relaxed">
                        Drive makers use standard decimal math (1,000 bytes = 1 KB). But Windows computes in binary (1,024 bytes = 1 KiB). You have every single byte printed on the box. On an Apple Mac, that exact drive will show as 1,000 GB because macOS uses decimal numbers.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Formula: GiB = Bytes ÷ 1,073,741,824</span>
                    <button
                      onClick={() => handleCopyFormula('Reported GiB = Manufacturer Bytes / (1024 * 1024 * 1024)')}
                      className="inline-flex items-center gap-1 text-secondary hover:underline font-medium"
                    >
                      {copiedFormula ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFormula ? 'Copied' : 'Copy Formula'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH 3: Password Strength Checker */}
            {activeWorkbenchTab === 'password' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-5">
                  <div className="flex items-center gap-2 text-tertiary font-semibold text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Password Strength & Cracking Time Checker</span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Test your password length and variety to see how fast a criminal hacker computer could crack it.
                  </p>

                  {/* Password Input with show/hide toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Type a Sample Password or Passphrase:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        placeholder="e.g. sunset-ocean-guitar-42!"
                        className="w-full pl-3 pr-10 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm sm:text-base font-mono text-on-surface focus:ring-2 focus:ring-tertiary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sample Passwords to click and test */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-2">
                      Try clicking these sample passwords:
                    </label>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => setCustomPassword('password123')}
                        className="px-2.5 py-1 rounded bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-colors"
                      >
                        ❌ password123 (Weak)
                      </button>
                      <button
                        onClick={() => setCustomPassword('P@ssw0rd!')}
                        className="px-2.5 py-1 rounded bg-tertiary/10 text-tertiary border border-tertiary/20 hover:bg-tertiary/20 transition-colors"
                      >
                        ⚠️ P@ssw0rd! (8 chars)
                      </button>
                      <button
                        onClick={() => setCustomPassword('correct-horse-battery-staple')}
                        className="px-2.5 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 font-mono transition-colors"
                      >
                        ✅ 4-word Passphrase (28 chars)
                      </button>
                    </div>
                  </div>

                  {/* Character variety checklist */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded-lg border flex items-center gap-2 ${passwordResults.hasLower ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-surface-container border-outline-variant/60 text-on-surface-variant/50'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Lowercase letters (a-z)</span>
                    </div>
                    <div className={`p-2 rounded-lg border flex items-center gap-2 ${passwordResults.hasUpper ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-surface-container border-outline-variant/60 text-on-surface-variant/50'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Uppercase letters (A-Z)</span>
                    </div>
                    <div className={`p-2 rounded-lg border flex items-center gap-2 ${passwordResults.hasNumber ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-surface-container border-outline-variant/60 text-on-surface-variant/50'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Numbers (0-9)</span>
                    </div>
                    <div className={`p-2 rounded-lg border flex items-center gap-2 ${passwordResults.hasSymbol ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-surface-container border-outline-variant/60 text-on-surface-variant/50'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Symbols & Spaces (!@#$)</span>
                    </div>
                  </div>
                </div>

                {/* Password Results & Visualizer */}
                <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Security Rating
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${passwordResults.badgeClass}`}>
                        {passwordResults.securityLevel}
                      </span>
                    </div>

                    <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-tertiary font-mono">
                      {passwordResults.entropyBits} bits of entropy
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Length: <strong className="text-on-surface font-bold">{passwordResults.length} characters</strong> • Character set pool: {passwordResults.charsetSize} possible symbols
                    </p>

                    {/* Strength Gauge Bar */}
                    <div className="mt-5">
                      <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            passwordResults.progressPct < 40 ? 'bg-error' : passwordResults.progressPct < 70 ? 'bg-tertiary' : 'bg-secondary'
                          }`}
                          style={{ width: `${passwordResults.progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Cracking time comparison cards */}
                    <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/70">
                        <span className="text-on-surface-variant block font-medium">Standard Laptop:</span>
                        <strong className="text-on-surface text-sm font-bold block mt-1 font-mono">
                          {passwordResults.crackTimeLaptop}
                        </strong>
                        <span className="text-[11px] text-on-surface-variant/70 mt-1 block">at 10M guesses/sec</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/70">
                        <span className="text-on-surface-variant block font-medium">Hacker GPU Rig:</span>
                        <strong className="text-tertiary text-sm font-bold block mt-1 font-mono">
                          {passwordResults.crackTimeGpu}
                        </strong>
                        <span className="text-[11px] text-on-surface-variant/70 mt-1 block">at 100B guesses/sec</span>
                      </div>
                    </div>

                    {/* Pro tip */}
                    <div className="mt-5 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-xs text-on-surface">
                      <p className="font-bold flex items-center gap-1.5 text-tertiary">
                        <Lightbulb className="w-3.5 h-3.5 text-tertiary" />
                        The Golden Rule of Passwords:
                      </p>
                      <p className="mt-0.5 text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface">Length is much more powerful than complexity!</strong> A 16-character passphrase made of four everyday words (e.g. <em>blue-ocean-guitar-pizza</em>) is virtually impossible to crack and much easier to remember than <em>P@$$w0rd</em>.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Formula: Bits = Length × log₂(Charset)</span>
                    <button
                      onClick={() => handleCopyFormula('Entropy Bits = Length * log2(Charset Pool)')}
                      className="inline-flex items-center gap-1 text-tertiary hover:underline font-medium"
                    >
                      {copiedFormula ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFormula ? 'Copied' : 'Copy Formula'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Categorized Tool Directory (5 requested categories) */}
      <section id="directory" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Technology Calculators Directory
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Browse all 5 categories of computer, networking, storage, web, and security tools.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-surface-container rounded-xl border border-outline-variant/60">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({TECH_TOOLS.length})
            </button>
            <button
              onClick={() => setActiveCategory('networking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'networking'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Networking
            </button>
            <button
              onClick={() => setActiveCategory('storage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'storage'
                  ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Storage
            </button>
            <button
              onClick={() => setActiveCategory('hardware')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'hardware'
                  ? 'bg-surface-container-lowest text-tertiary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Hardware
            </button>
            <button
              onClick={() => setActiveCategory('web-dev')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'web-dev'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Web Dev
            </button>
            <button
              onClick={() => setActiveCategory('cybersecurity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'cybersecurity'
                  ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Cybersecurity
            </button>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 hover:border-primary/60 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container border border-outline-variant/50 text-on-surface">
                    {tool.categoryLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-primary">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-mono text-[11px] truncate max-w-[170px]" title={tool.simpleFormula}>
                  {tool.simpleFormula}
                </span>
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Use Tool
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-8">
            <Search className="w-8 h-8 mx-auto text-on-surface-variant mb-2" />
            <p className="text-base font-bold text-on-surface">No calculators found</p>
            <p className="text-xs text-on-surface-variant mt-1">Try searching for &quot;download&quot;, &quot;storage&quot;, &quot;password&quot;, or &quot;power&quot;.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. Plain-English Step-by-Step Illustrated Guides */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Everyday Tech Guides & Step-by-Step Formulas
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Learn the simple math behind your internet speeds, computer hard drives, and password security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guide 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Guide 1 • Networking
              </span>
              <h3 className="text-lg font-bold text-on-surface mt-1">
                How Download Time Works: The Simple 8-to-1 Rule
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                Why does a 100 Mbps internet connection download at only 12 Megabytes per second? Because internet providers count in <strong>bits</strong>, but files are measured in <strong>bytes</strong>.
              </p>

              {/* Step by step */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Step 1: Multiply by 8</span>
                  <span className="text-on-surface-variant font-mono">A 60 GB game = 60,000 MB × 8 = 480,000 Megabits.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Step 2: Add 5% packaging</span>
                  <span className="text-on-surface-variant font-mono">480,000 × 1.05 = 504,000 Megabits with network checks.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Step 3: Divide by your speed</span>
                  <span className="text-on-surface-variant font-mono">504,000 ÷ 200 Mbps = 2,520 seconds = <strong className="text-on-surface">42 minutes</strong>.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-outline-variant/40 text-xs text-primary font-semibold">
              Tip: Divide Mbps by 10 for a rapid real-world estimate!
            </div>
          </div>

          {/* Guide 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Guide 2 • Storage
              </span>
              <h3 className="text-lg font-bold text-on-surface mt-1">
                Why Your 1 TB Drive Only Shows 931 GB in Windows
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                No space was stolen! Manufacturers count in human decimal tens (1,000 bytes = 1 KB), while Windows counts in binary computer powers of two (1,024 bytes = 1 KiB).
              </p>

              {/* Step by step */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Step 1: The box label</span>
                  <span className="text-on-surface-variant font-mono">1 TB = exactly 1,000,000,000,000 bytes (1 trillion).</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Step 2: Windows binary unit</span>
                  <span className="text-on-surface-variant font-mono">1 GiB = 1,024 × 1,024 × 1,024 = 1,073,741,824 bytes.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Step 3: The division</span>
                  <span className="text-on-surface-variant font-mono">1,000,000,000,000 ÷ 1,073,741,824 = <strong className="text-on-surface">931.32 GiB</strong>.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-outline-variant/40 text-xs text-secondary font-semibold">
              Tip: Apple Macs display decimal units, showing a full 1,000 GB!
            </div>
          </div>

          {/* Guide 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
                Guide 3 • Cybersecurity
              </span>
              <h3 className="text-lg font-bold text-on-surface mt-1">
                Password Safety: Why Length Beats Complexity
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                Short 8-character passwords with complicated symbols are easily cracked by graphics cards, whereas a long multi-word passphrase is impossible to guess.
              </p>

              {/* Step by step */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Option A: 8-character complex</span>
                  <span className="text-on-surface-variant font-mono">&quot;P@$$w0rd&quot; = 6.09 × 10¹⁵ combinations (cracked in hours).</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">Option B: 16-character phrase</span>
                  <span className="text-on-surface-variant font-mono">&quot;sunset-ocean-guitar&quot; = 3.4 × 10²² combinations.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
                  <span className="font-bold text-on-surface block">The Result</span>
                  <span className="text-on-surface-variant">Option B takes <strong className="text-on-surface">trillions of years</strong> to crack!</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-outline-variant/40 text-xs text-tertiary font-semibold">
              Tip: Aim for 14 to 16 characters using 4 memorable words.
            </div>
          </div>
        </div>
      </section>

      {/* 6. Simple-Words Beginner FAQs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-primary mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
            Common Tech Questions Answered in Simple Everyday Words
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 mb-8">
            Got a confusing tech question? Here are simple, clear explanations without complicated computer jargon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/60">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="text-primary font-extrabold">Q.</span>
                What is the simple difference between Mbps and MB/s?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Mbps</strong> (with a lowercase &apos;b&apos;) measures internet connection speed. <strong className="text-on-surface">MB/s</strong> (with a capital &apos;B&apos;) measures file size and actual download speed. Because there are 8 bits in every byte, an 80 Mbps internet speed downloads files at about 10 MB per second.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/60">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="text-primary font-extrabold">Q.</span>
                Why does my download take longer than what speed tests say?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Speed tests connect to a super-fast nearby server under ideal conditions. In real life, downloads are slower because the game server or website may limit speed, Wi-Fi signals weaken through walls, and network packaging overhead uses up 5% to 10% of total bandwidth.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/60">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="text-primary font-extrabold">Q.</span>
                Why does my 500 GB drive show up as 465 GB on Windows?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Hard drive companies count 1 Gigabyte as 1,000,000,000 bytes. But Windows measures in computer binary powers of two, where 1 Gibibyte equals 1,073,741,824 bytes. Dividing 500 billion by 1.0737 billion gives 465.66 GB. You have all 500 billion bytes you paid for!
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/60">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="text-primary font-extrabold">Q.</span>
                How long should my password be to stay safe from hackers?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Security experts recommend at least <strong className="text-on-surface">14 to 16 characters</strong>. Modern graphics cards can test billions of short passwords every second. But with 16 characters or more, even a supercomputer would need hundreds of thousands of years to guess your combination.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/60">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="text-primary font-extrabold">Q.</span>
                What is an IP address and a subnet mask in simple words?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Think of an IP address like a house address. A street name represents your home network, and the house number represents your specific device (like your phone or TV). The subnet mask is simply the divider line showing where the street name ends and the house number begins.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/60">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="text-primary font-extrabold">Q.</span>
                How much electricity does a desktop computer or server use?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                A typical desktop PC uses about 60 to 100 Watts (costing roughly $2 to $4 per month if on during work hours). A gaming PC playing a 3D game uses 300 to 500 Watts. A small home server or NAS usually runs continuously at only 20 to 40 Watts ($3 to $5/month).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Standards, Trust & Verification */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/70 text-xs text-on-surface-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-secondary shrink-0" />
            <div>
              <span className="font-bold text-on-surface block text-sm">
                Standards-Compliant & Verified Formulas
              </span>
              <span>
                Calculations strictly adhere to IEEE 802.3 Ethernet network standards, NIST SP 800-63B password guidelines, IEC 80000-13 binary data units, and W3C web specifications.
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="shrink-0 px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/70 font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Explore All Hubs →
          </Link>
        </div>
      </section>
    </div>
  );
}
