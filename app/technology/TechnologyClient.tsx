'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function TechnologyClient() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        setShowResultsDropdown(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Category Filtering & Navigation
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navChipsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll bounds for arrows and gradient masks
  const checkNavScroll = () => {
    const el = navChipsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkNavScroll();
    const el = navChipsRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkNavScroll, { passive: true });
    window.addEventListener('resize', checkNavScroll);
    return () => {
      el.removeEventListener('scroll', checkNavScroll);
      window.removeEventListener('resize', checkNavScroll);
    };
  }, []);

  const scrollNavChips = (direction: 'left' | 'right') => {
    const el = navChipsRef.current;
    if (!el) return;
    const distance = direction === 'left' ? -280 : 280;
    el.scrollBy({ left: distance, behavior: 'smooth' });
    setTimeout(checkNavScroll, 350);
  };

  const handleCategorySelect = (catId: string, buttonEl?: HTMLElement | null) => {
    const nextCat = selectedCategory === catId ? 'all' : catId;
    setSelectedCategory(nextCat);
    if (buttonEl) {
      buttonEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    const dirEl = document.getElementById('directory');
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(checkNavScroll, 400);
  };

  const quickFilter = (term: string) => {
    setSelectedCategory('all');
    setSearchQuery(term);
    setShowResultsDropdown(true);
    setSelectedResultIndex(0);
    searchInputRef.current?.focus();
    const dirEl = document.getElementById('directory');
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Workbench 1: IPv4 Subnet & CIDR ---
  const [subnetIp, setSubnetIp] = useState('192.168.1.1');
  const [subnetCidr, setSubnetCidr] = useState(26);

  const subnetResult = useMemo(() => {
    const cidr = Number(subnetCidr) || 24;
    const ip = subnetIp.trim() || '192.168.1.1';
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = totalHosts > 2 ? totalHosts - 2 : cidr === 31 ? 2 : 1;

    const ipParts = ip.split('.').map(Number);
    if (ipParts.length === 4 && ipParts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
      const ipNum = ((ipParts[0] << 24) >>> 0) + ((ipParts[1] << 16) >>> 0) + ((ipParts[2] << 8) >>> 0) + (ipParts[3] >>> 0);
      const maskNum = (-1 << (32 - cidr)) >>> 0;
      const netNum = (ipNum & maskNum) >>> 0;
      const bcastNum = (netNum | (~maskNum >>> 0)) >>> 0;

      const numToIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

      const firstHost = numToIp(netNum + 1);
      const lastHost = numToIp(bcastNum - 1);
      const bcastIp = numToIp(bcastNum);
      const wildcard = numToIp(~maskNum >>> 0);

      const usablePct = totalHosts > 2 ? ((usableHosts / totalHosts) * 100).toFixed(1) : '100';
      const overheadPct = (100 - parseFloat(usablePct)).toFixed(1);

      return {
        hostRange: `${firstHost} – ${lastHost}`,
        broadcast: bcastIp,
        usableHosts: usableHosts.toLocaleString(),
        wildcard,
        totalHosts: `${totalHosts} Total Addresses`,
        usablePct: `${usablePct}%`,
        overheadPct: `${overheadPct}%`
      };
    }

    return {
      hostRange: '192.168.1.1 – 192.168.1.62',
      broadcast: '192.168.1.63',
      usableHosts: '62',
      wildcard: '0.0.0.63',
      totalHosts: '64 Total Addresses',
      usablePct: '96.9%',
      overheadPct: '3.1%'
    };
  }, [subnetIp, subnetCidr]);

  // --- Workbench 2: Download Time Sizer ---
  const [transferSize, setTransferSize] = useState<number>(45);
  const [transferSpeed, setTransferSpeed] = useState<number>(300);
  const [transferOverhead, setTransferOverhead] = useState<number>(5);

  const transferResult = useMemo(() => {
    const sizeGB = Number(transferSize) || 45;
    const speedMbps = Number(transferSpeed) || 300;
    const overhead = Number(transferOverhead) || 5;

    const totalBits = sizeGB * 8 * 1024 * (1 + overhead / 100);
    const seconds = totalBits / Math.max(1, speedMbps);

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const timeFormatted = m > 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m ${s}s`;
    const effectiveMBps = ((speedMbps / 8) * (1 - overhead / 100)).toFixed(2);
    const totalBytesGB = (sizeGB * (1 + overhead / 100)).toFixed(2);

    // 1 Gbps comparison
    const gigabitSeconds = (sizeGB * 8 * 1024 * (1 + overhead / 100)) / 1000;
    const gm = Math.floor(gigabitSeconds / 60);
    const gs = Math.floor(gigabitSeconds % 60);

    return {
      time: timeFormatted,
      throughput: `${effectiveMBps} MB/s`,
      totalBytes: `${totalBytesGB} GB w/ overhead`,
      gigabitCompare: `${gm}m ${gs}s (${(1000 / Math.max(1, speedMbps)).toFixed(1)}x Faster)`
    };
  }, [transferSize, transferSpeed, transferOverhead]);

  // --- Workbench 3: Password Entropy ---
  const [entropyLength, setEntropyLength] = useState<number>(16);
  const [entropyCharset, setEntropyCharset] = useState<number>(94);

  const entropyResult = useMemo(() => {
    const len = Number(entropyLength) || 16;
    const charset = Number(entropyCharset) || 94;
    const bits = len * Math.log2(charset);

    // At 100 GH/s = 100 * 10^9 guesses/sec
    let crackTime = '> 1,200 Million Years';
    if (bits < 40) {
      crackTime = '< 1 millisecond';
    } else if (bits < 50) {
      crackTime = '< 3 seconds';
    } else if (bits < 65) {
      crackTime = '~ 4.2 Hours';
    } else if (bits < 80) {
      crackTime = '~ 320 Years';
    } else {
      crackTime = '> 1,200 Million Years';
    }

    const secClass = bits >= 80 ? 'Military / Enterprise' : bits >= 60 ? 'Standard Enterprise' : 'Vulnerable';
    const barWidth = Math.min(100, Math.round((bits / 128) * 100));

    return {
      bits: `${bits.toFixed(1)} bits`,
      crackTime,
      secClass,
      barWidth: `${barWidth}%`
    };
  }, [entropyLength, entropyCharset]);

  // --- Workbench 4: RAID Calculator ---
  const [raidLevel, setRaidLevel] = useState<string>('5');
  const [raidDrives, setRaidDrives] = useState<number>(4);
  const [raidDriveSize, setRaidDriveSize] = useState<number>(16);

  const raidResult = useMemo(() => {
    const drives = Number(raidDrives) || 4;
    const size = Number(raidDriveSize) || 16;
    const rawTotal = drives * size;
    let usable = 0;
    let parity = 0;
    let fault = '1 Drive Failure';
    let perf = 'Standard';

    if (raidLevel === '0') {
      usable = rawTotal;
      parity = 0;
      fault = '0 Drives (No Redundancy)';
      perf = `${drives}x Read / ${drives}x Write`;
    } else if (raidLevel === '1') {
      usable = size;
      parity = rawTotal - usable;
      fault = `${drives - 1} Drive(s)`;
      perf = `${drives}x Read / 1x Write`;
    } else if (raidLevel === '5') {
      usable = Math.max(0, (drives - 1) * size);
      parity = size;
      fault = '1 Drive Failure';
      perf = `${drives - 1}x Read / Parity Overhead`;
    } else if (raidLevel === '6') {
      usable = Math.max(0, (drives - 2) * size);
      parity = size * 2;
      fault = '2 Drive Failures';
      perf = `${Math.max(1, drives - 2)}x Read / Dual Parity`;
    } else if (raidLevel === '10') {
      usable = (drives / 2) * size;
      parity = rawTotal - usable;
      fault = '1 Drive Per Sub-Mirror';
      perf = `${drives}x Read / ${(drives / 2).toFixed(0)}x Write`;
    }

    const usablePct = rawTotal > 0 ? Math.round((usable / rawTotal) * 100) : 0;
    const parityPct = 100 - usablePct;

    return {
      rawTotal: `${rawTotal.toFixed(1)} TB Raw Total`,
      efficiency: `RAID ${raidLevel} Efficiency: ${usablePct}% Usable`,
      usable: `${usable.toFixed(1)} TB`,
      parity: `${parity.toFixed(1)} TB (${parityPct}%)`,
      fault,
      perf,
      usablePct: `${usablePct}%`,
      parityPct: `${parityPct}%`
    };
  }, [raidLevel, raidDrives, raidDriveSize]);

  // --- Smart Stack Assistant State ---
  const [activeStack, setActiveStack] = useState<'webapp' | 'ai' | 'network' | 'cloudmig' | 'db'>('webapp');

  const stackConfigs = {
    webapp: [
      {
        title: 'Frontend Sizing',
        icon: 'web',
        color: 'text-primary',
        desc: 'REM to PX, Aspect Ratio, WCAG Contrast, SVG Minifier, Responsive Breakpoints.',
        link: '#frontend',
        linkText: 'Launch 5 Frontend Tools →'
      },
      {
        title: 'Performance Budget',
        icon: 'speed',
        color: 'text-secondary',
        desc: 'Core Web Vitals, CDN Hit Rate, LCP/INP Estimators, Brotli Payload Sizer.',
        link: '#workbench-speed',
        linkText: 'Launch Speed Sizer →'
      },
      {
        title: 'Auth & Tokens',
        icon: 'shield',
        color: 'text-tertiary',
        desc: 'JWT Claims Decoder, Password Entropy bits, CORS Origin Sizer, HMAC Signer.',
        link: '#directory',
        linkText: 'Launch Auth Suite →'
      }
    ],
    ai: [
      {
        title: 'LLM Token Budget',
        icon: 'neurology',
        color: 'text-tertiary',
        desc: 'GPT-4o vs Claude 3.5 Sonnet Prompt & Inference unit cost forecaster.',
        link: '#workbench-crypto',
        linkText: 'Launch LLM Modeler →'
      },
      {
        title: 'GPU VRAM Sizing',
        icon: 'memory',
        color: 'text-primary',
        desc: 'Calculate weights & KV-cache for FP16, INT8, and INT4 quantized parameters.',
        link: '#directory',
        linkText: 'VRAM Calculator →'
      },
      {
        title: 'Vector Storage',
        icon: 'database',
        color: 'text-secondary',
        desc: 'Pinecone, Milvus, and pgvector 1536-dimensional embedding disk calculations.',
        link: '#directory',
        linkText: 'Vector DB Sizer →'
      }
    ],
    network: [
      {
        title: 'Subnet & VLSM',
        icon: 'lan',
        color: 'text-primary',
        desc: 'Partition /16 campus blocks into optimal branch subnets without IP collision.',
        link: '#workbench-subnet',
        linkText: 'Open Subnetter →'
      },
      {
        title: 'WAN Bandwidth',
        icon: 'router',
        color: 'text-secondary',
        desc: 'MPLS and DIA leased-line throughput vs concurrent user branch loads.',
        link: '#directory',
        linkText: 'WAN Sizer →'
      },
      {
        title: 'Firewall ACL Masks',
        icon: 'security',
        color: 'text-on-surface',
        desc: 'Wildcard mask inversion and Cisco ASA / Juniper prefix-list generators.',
        link: '#directory',
        linkText: 'ACL Generator →'
      }
    ],
    cloudmig: [
      {
        title: 'Egress Sizer',
        icon: 'cloud_sync',
        color: 'text-primary',
        desc: 'Estimate monthly AWS, Azure, and GCP outbound network bill surcharges.',
        link: '#directory',
        linkText: 'Egress Calculator →'
      },
      {
        title: 'Lift-and-Shift VM',
        icon: 'sync_alt',
        color: 'text-secondary',
        desc: 'Map VMware vSphere ESXi vCPU and RAM allocations to equivalent EC2 instances.',
        link: '#directory',
        linkText: 'VM Matcher →'
      },
      {
        title: 'S3 Storage Tiering',
        icon: 'save',
        color: 'text-tertiary',
        desc: 'Analyze Standard, Infrequent Access, and Glacier Deep Archive cost curves.',
        link: '#directory',
        linkText: 'Storage Sizer →'
      }
    ],
    db: [
      {
        title: 'IOPS & Throughput',
        icon: 'storage',
        color: 'text-secondary',
        desc: 'Size AWS gp3 burst credits and provisioned IOPS to avoid write throttling.',
        link: '#directory',
        linkText: 'IOPS Workbench →'
      },
      {
        title: 'Connection Pooling',
        icon: 'hub',
        color: 'text-primary',
        desc: 'PostgreSQL PgBouncer & MySQL thread pool dimensioning formulas.',
        link: '#directory',
        linkText: 'Pool Sizer →'
      },
      {
        title: 'Replication Lag',
        icon: 'backup',
        color: 'text-tertiary',
        desc: 'Calculate byte replication lag between primary and secondary standby nodes.',
        link: '#directory',
        linkText: 'Replica Forecaster →'
      }
    ]
  };

  // --- 20-Category Directory Data ---
  const techCategories = [
    {
      id: 'networking',
      name: 'Networking & IP',
      icon: 'lan',
      color: 'text-primary',
      count: '12 tools',
      tools: [
        { name: 'IPv4 Subnet Calculator', meta: '/24-/32', link: '#workbench-subnet' },
        { name: 'CIDR Prefix Summarizer', meta: 'RFC 4632' },
        { name: 'IPv6 Subnet & Scope Sizer', meta: '/64-/48' },
        { name: 'VLSM Variable Subnetter', meta: 'Host Opt' },
        { name: 'Wildcard Mask to Subnet Mask', meta: 'ACL' },
        { name: 'IP Range to CIDR Block', meta: 'Ranges' },
        { name: 'Broadcast Address Calculator', meta: 'Layer 3' },
        { name: 'Usable Host Range Explorer', meta: 'DHCP' },
        { name: 'IP to Hex / Binary / Decimal', meta: 'Radix' },
        { name: 'Subnet Supernet Aggregator', meta: 'BGP' },
        { name: 'Network MTU & MSS Sizer', meta: '1500B' },
        { name: 'Autonomous System (ASN) Lookup', meta: 'BGP4' }
      ]
    },
    {
      id: 'bandwidth',
      name: 'Internet & Bandwidth',
      icon: 'speed',
      color: 'text-secondary',
      count: '10 tools',
      tools: [
        { name: 'Download Time Calculator', meta: 'TCP', link: '#workbench-speed' },
        { name: 'Upload Time & Cloud Sync', meta: 'Egress' },
        { name: 'Bandwidth Throughput Sizer', meta: 'Mbps/Gbps' },
        { name: 'Monthly ISP Data Cap Monitor', meta: 'TB Quota' },
        { name: 'Streaming Bitrate Sizer (4K/8K)', meta: 'AV1/HEVC' },
        { name: 'Website Page Weight Estimator', meta: 'Payload' },
        { name: 'CDN Edge Cache Hit Ratio', meta: 'Origin' },
        { name: 'Fiber Optics Latency by Distance', meta: '5μs/km' },
        { name: 'Jitter & Packet Loss Impact', meta: 'VoIP' },
        { name: 'TCP Window Size (BDP) Sizer', meta: 'RFC 1323' }
      ]
    },
    {
      id: 'security',
      name: 'Cybersecurity & Crypto',
      icon: 'lock',
      color: 'text-tertiary',
      count: '10 tools',
      tools: [
        { name: 'Password Entropy Calculator', meta: 'NIST Bits', link: '#workbench-crypto' },
        { name: 'SHA-256 / SHA-512 Generator', meta: 'FIPS 180' },
        { name: 'MD5 & CRC32 Checksum Hash', meta: 'Integrity' },
        { name: 'HMAC Authentication Signer', meta: 'RFC 2104' },
        { name: 'JWT Debugger & Claims Parser', meta: 'RFC 7519' },
        { name: 'Brute Force Time-to-Crack', meta: 'RTX 4090' },
        { name: 'AES Encryption Key Space Sizer', meta: '256-bit' },
        { name: 'Diffie-Hellman Key Exchange', meta: 'Public/Priv' },
        { name: 'Bcrypt Work Factor Benchmark', meta: 'Cost 12' },
        { name: 'SSL/TLS Handshake Latency', meta: 'TLS 1.3' }
      ]
    },
    {
      id: 'dev-tools',
      name: 'Developer Tools',
      icon: 'code',
      color: 'text-primary',
      count: '11 tools',
      tools: [
        { name: 'JSON Formatter & Validator', meta: 'RFC 8259' },
        { name: 'JSON Minifier & Escaper', meta: 'Clean' },
        { name: 'JSON Structural Diff Verifier', meta: 'AST' },
        { name: 'UUID / GUID v4 & v7 Generator', meta: 'RFC 9562' },
        { name: 'Regex Test Engine & Groups', meta: 'PCRE' },
        { name: 'Cron Expression Schedule Sizer', meta: 'POSIX' },
        { name: 'SemVer Version Matcher & Bump', meta: 'v2.0.0' },
        { name: 'Lorem Ipsum Code Filler', meta: 'Dummy' },
        { name: 'Text Diff & Line Inspector', meta: 'Unified' },
        { name: 'cURL to Fetch/Python Converter', meta: 'HTTP' },
        { name: 'HTTP Status Codes Matrix', meta: 'RFC 9110' }
      ]
    },
    {
      id: 'encoding',
      name: 'Encoding & Decoding',
      icon: 'transform',
      color: 'text-secondary',
      count: '8 tools',
      tools: [
        { name: 'Base64 String & Image Encoder', meta: 'RFC 4648' },
        { name: 'URL Percent Encoder / Decoder', meta: 'RFC 3986' },
        { name: 'HTML Entity Escaper & Decoder', meta: 'W3C' },
        { name: 'Hexadecimal to ASCII Text', meta: 'Base16' },
        { name: 'Unicode Code Point Explorer', meta: 'UTF-8/16' },
        { name: 'Binary to Text / String Decoder', meta: 'Base2' },
        { name: 'ASCII Numerical Map & Table', meta: '7-bit' },
        { name: 'Morse Code Audio & Text', meta: 'ITU' }
      ]
    },
    {
      id: 'frontend',
      name: 'Web & Frontend',
      icon: 'web',
      color: 'text-primary',
      count: '9 tools',
      tools: [
        { name: 'Aspect Ratio Calculator', meta: '16:9 / 4:3' },
        { name: 'REM to PX / PX to REM Matrix', meta: '16px Base' },
        { name: 'WCAG 2.1 Color Contrast Checker', meta: 'AAA/AA' },
        { name: 'Pixel Density (PPI / DPI) Sizer', meta: 'Retina' },
        { name: 'Viewport CSS (vw, vh, clamp())', meta: 'Fluid' },
        { name: 'CSS Grid & Flexbox Span Sizer', meta: '12-Col' },
        { name: 'Responsive Breakpoint Finder', meta: 'Media' },
        { name: 'SVG Path Optimizer & Minifier', meta: 'Vector' },
        { name: 'Font Size Scale (Golden / Modular)', meta: 'Typo' }
      ]
    },
    {
      id: 'storage',
      name: 'Storage & RAID',
      icon: 'save',
      color: 'text-tertiary',
      count: '9 tools',
      tools: [
        { name: 'RAID Capacity Calculator', meta: '0,1,5,6,10', link: '#workbench-raid' },
        { name: 'Backup Window & Transfer Sizer', meta: 'Hours' },
        { name: 'Data Retention & GFS Planner', meta: 'Snapshots' },
        { name: 'Storage Compression Ratio Sizer', meta: 'ZSTD/GZIP' },
        { name: 'AWS S3 / Cloud Storage Tiers', meta: 'Glacier' },
        { name: 'Disk Drive TB to TiB Conversion', meta: 'IEC 80000' },
        { name: 'SAN IOPS vs Throughput Sizer', meta: 'Queue' },
        { name: 'Log Storage Volume Estimator', meta: 'GB/Day' },
        { name: 'Uncompressed Raw Video Sizer', meta: 'ProRes 422' }
      ]
    },
    {
      id: 'cloud',
      name: 'Cloud & DevOps',
      icon: 'cloud_queue',
      color: 'text-primary',
      count: '9 tools',
      tools: [
        { name: 'AWS EC2 Cost Optimizer', meta: 'Spot/RI' },
        { name: 'Cloud Egress Bandwidth Cost', meta: '$/GB' },
        { name: 'Azure Virtual Machine Sizer', meta: 'B-Series' },
        { name: 'Google Cloud Run vs GKE Cost', meta: 'Serverless' },
        { name: 'Serverless Lambda Invocations', meta: 'GB-sec' },
        { name: 'Multi-Cloud TCO Forecaster', meta: '3-Year' },
        { name: 'Kubernetes Worker Node Sizer', meta: 'Pods' },
        { name: 'Cloud NAT Gateway Port Pool', meta: 'SNAT' },
        { name: 'Cloudflare Workers vs Fastly', meta: 'Edge' }
      ]
    },
    {
      id: 'algo-math',
      name: 'Algorithms & Data',
      icon: 'data_object',
      color: 'text-tertiary',
      count: '9 tools',
      tools: [
        { name: 'Big-O Time & Space Complexity', meta: 'O(n log n)' },
        { name: 'Levenshtein String Distance', meta: 'Edit Dist' },
        { name: 'Binary Search & Tree Depth', meta: 'log2(N)' },
        { name: 'GCD & LCM Euclidean Solver', meta: 'Euclid' },
        { name: 'Sorting Algorithm Benchmark', meta: 'Quicksort' },
        { name: 'Hamming Distance Bit Sizer', meta: 'XOR Bits' },
        { name: 'Matrix Multiplication Dimensioner', meta: 'M×K × K×N' },
        { name: 'Fibonacci & Recursion Depth', meta: 'Stack' },
        { name: 'Graph Shortest Path (Dijkstra)', meta: 'Weights' }
      ]
    },
    {
      id: 'database',
      name: 'Database & SQL',
      icon: 'database',
      color: 'text-secondary',
      count: '8 tools',
      tools: [
        { name: 'Database Capacity Planner', meta: 'Rows*Cols' },
        { name: 'B-Tree Index Size Estimator', meta: 'Postgres' },
        { name: 'Connection Pool Sizer', meta: 'PgBouncer' },
        { name: 'IOPS Capacity & Burst Allowance', meta: 'gp3/io2' },
        { name: 'WAL / Binlog Growth Forecaster', meta: 'WriteRate' },
        { name: 'Replication Lag vs Network Latency', meta: 'Read Replica' },
        { name: 'Sharding Hash Key Space Modulo', meta: 'vnodes' },
        { name: 'Redis Memory Footprint Sizer', meta: 'Key/TTL' }
      ]
    },
    {
      id: 'hardware',
      name: 'Systems & Hardware',
      icon: 'dns',
      color: 'text-primary',
      count: '9 tools',
      tools: [
        { name: 'Datacenter Rack Unit (U) Sizer', meta: '42U Frame' },
        { name: 'Server Power Consumption (Watts)', meta: 'BTU/hr' },
        { name: 'PUE Datacenter Energy Efficiency', meta: 'Green IT' },
        { name: 'CPU Overcommit Ratio Sizer', meta: 'vCPU:pCPU' },
        { name: 'Downtime Cost per Minute', meta: 'Loss Rate' },
        { name: 'RAM NUMA Node Allocation', meta: 'Dual Socket' },
        { name: 'UPS Battery Backup Runtime', meta: 'kVA' },
        { name: 'Cooling & CFM Airflow Sizer', meta: 'HVAC' },
        { name: 'Hardware Lifecycle Depreciation', meta: 'CapEx' }
      ]
    },
    {
      id: 'devops',
      name: 'DevOps & SRE',
      icon: 'engineering',
      color: 'text-secondary',
      count: '8 tools',
      tools: [
        { name: 'SLA Uptime Calculator (99.99%)', meta: 'Error Budget' },
        { name: 'MTTR / MTBF Reliability Sizer', meta: 'Incidents' },
        { name: 'CI/CD Pipeline Minute Cost', meta: 'Actions' },
        { name: 'Docker Image Layer Size Sizer', meta: 'Alpine' },
        { name: 'DORA Metrics Score Calculator', meta: 'Lead Time' },
        { name: 'Canary Deployment Traffic Split', meta: '1% -> 100%' },
        { name: 'Terraform State Lock Latency', meta: 'S3/Dynamo' },
        { name: 'Chaos Engineering Blast Radius', meta: 'Fault Inj' }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile Development',
      icon: 'phone_android',
      color: 'text-primary',
      count: '7 tools',
      tools: [
        { name: 'APK & IPA Binary Bundle Sizer', meta: 'Dex/Bitcode' },
        { name: 'Push Notification Batch Delivery', meta: 'FCM/APNS' },
        { name: 'Mobile Data Consumption Budget', meta: 'MB/Session' },
        { name: 'Crash-Free User Rate Sizer', meta: '99.8%' },
        { name: 'App Cold Start Time Estimator', meta: 'TTI' },
        { name: 'Screen Density Bucket (ldpi-xxxhdpi)', meta: 'Android' },
        { name: 'In-App Purchase Commission', meta: '15% vs 30%' }
      ]
    },
    {
      id: 'seo',
      name: 'SEO & Performance',
      icon: 'troubleshoot',
      color: 'text-secondary',
      count: '7 tools',
      tools: [
        { name: 'Core Web Vitals Scoring (LCP/INP)', meta: 'Google CrUX' },
        { name: 'TTFB (Time to First Byte) Sizer', meta: '< 200ms' },
        { name: 'Googlebot Crawl Budget Forecaster', meta: 'Req/Sec' },
        { name: 'Asset Weight Budget Sizer', meta: 'JS/CSS/WebP' },
        { name: 'Internal PageRank Flow Matrix', meta: 'Links' },
        { name: 'SERP Snippet Pixel Length Sizer', meta: '600px Max' },
        { name: 'HTTP/2 Multiplexing Saturation', meta: 'Streams' }
      ]
    },
    {
      id: 'email',
      name: 'Email & Messaging',
      icon: 'mail',
      color: 'text-tertiary',
      count: '6 tools',
      tools: [
        { name: 'SMTP Send Rate & Throttling', meta: 'Warmup' },
        { name: 'DKIM / SPF / DMARC DNS Record Sizer', meta: 'TXT RFC' },
        { name: 'Email List Growth & Churn Runway', meta: 'Net Sub' },
        { name: 'IMAP / Mailbox Storage Forecaster', meta: 'GB/User' },
        { name: 'Newsletter ROI & CPM Sizer', meta: 'Open Rate' },
        { name: 'SMS Segment Calculator (GSM-7)', meta: '160 Chars' }
      ]
    },
    {
      id: 'blockchain',
      name: 'Blockchain & Web3',
      icon: 'currency_bitcoin',
      color: 'text-primary',
      count: '6 tools',
      tools: [
        { name: 'Ethereum Gas Fee Sizer (Gwei)', meta: 'EIP-1559' },
        { name: 'PoS Staking Rewards & Slash Risk', meta: 'APR' },
        { name: 'Smart Contract Bytecode Sizer', meta: '24.5 KB Max' },
        { name: 'Validator Node Sizing (RAM/SSD)', meta: 'Geth/Prysm' },
        { name: 'Crypto Impermanent Loss Sizer', meta: 'AMM' },
        { name: 'Bitcoin Block Halving Countdown', meta: '210,000 Blk' }
      ]
    },
    {
      id: 'datascience',
      name: 'Data Science & Stats',
      icon: 'analytics',
      color: 'text-secondary',
      count: '7 tools',
      tools: [
        { name: 'A/B Test Statistical Significance', meta: 'p-value < 0.05' },
        { name: 'Sample Size & Power Analysis', meta: '80% Power' },
        { name: 'Z-Score & Normal Distribution', meta: 'σ Bounds' },
        { name: 'Data Ingestion Rate (Rows/sec)', meta: 'Kafka/Pulsar' },
        { name: 'Snowflake / BigQuery Warehouse Cost', meta: 'Credits' },
        { name: 'Confidence Interval Sizer', meta: '95% CI' },
        { name: 'Cosine Similarity Vector Math', meta: 'Distance' }
      ]
    },
    {
      id: 'iot',
      name: 'IoT & Embedded Systems',
      icon: 'developer_board',
      color: 'text-tertiary',
      count: '6 tools',
      tools: [
        { name: 'IoT Battery Life & Sleep Duty Cycle', meta: 'mAh Hours' },
        { name: 'LoRaWAN Airtime & Duty Limits', meta: 'SF7-SF12' },
        { name: 'Sensor Telemetry Payload Sizer', meta: 'Protobuf' },
        { name: 'Device Fleet Data Consumption', meta: '10k Nodes' },
        { name: 'UART / SPI Baud Rate & Timings', meta: '115200 bps' },
        { name: 'Microcontroller RAM/Flash Budget', meta: 'ESP32/STM32' }
      ]
    },
    {
      id: 'hardware-comp',
      name: 'Electronics & Hardware',
      icon: 'memory',
      color: 'text-primary',
      count: '7 tools',
      tools: [
        { name: 'PSU Wattage & Rail Sizer', meta: '80+ Gold' },
        { name: 'CPU Bottleneck & Balance Finder', meta: 'PCIe 5.0' },
        { name: 'Memory Bandwidth (DDR4/DDR5)', meta: 'MT/s' },
        { name: 'DisplayPort / HDMI Bandwidth Sizer', meta: '4K 144Hz' },
        { name: 'PCIe Lane Bandwidth by Gen', meta: 'x16 Gen4/5' },
        { name: 'Clock Frequency to Period (ns)', meta: '1/f GHz' },
        { name: 'Thermal Resistance & Heat Sinks', meta: '°C/W' }
      ]
    },
    {
      id: 'conversions',
      name: 'Tech Conversions',
      icon: 'sync_alt',
      color: 'text-secondary',
      count: '8 tools',
      tools: [
        { name: 'Bits to Bytes / MB to MiB', meta: 'Binary Base' },
        { name: 'Network Mbps to MB/s', meta: 'Divide by 8' },
        { name: 'Color HEX <-> RGB <-> HSL <-> OKLCH', meta: 'Gamut' },
        { name: 'Frequency Hz to kHz, MHz, GHz', meta: 'SI Standard' },
        { name: 'Epoch Unix Timestamp to ISO 8601', meta: 'UTC/TZ' },
        { name: 'dBm to Milliwatts RF Power', meta: 'Logarithmic' },
        { name: 'Screen Aspect Ratio by Resolution', meta: 'GCD' },
        { name: 'Base 10 Decimal to Radix 2, 8, 16', meta: 'Positional' }
      ]
    }
  ];

  // Filtered categories
  const filteredTechCategories = useMemo(() => {
    let list = techCategories;
    if (selectedCategory !== 'all') {
      list = list.filter(cat => cat.id === selectedCategory);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list
      .map(cat => ({
        ...cat,
        tools: cat.tools.filter(
          t => t.name.toLowerCase().includes(q) || t.meta.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q)
        )
      }))
      .filter(cat => cat.tools.length > 0 || cat.name.toLowerCase().includes(q));
  }, [searchQuery, selectedCategory, techCategories]);

  // Flattened searchable tools collection with workbench links
  const allSearchableTools = useMemo(() => {
    const list: Array<{
      name: string;
      meta: string;
      categoryName: string;
      categoryId: string;
      categoryIcon: string;
      categoryColor: string;
      link: string;
      isWorkbench: boolean;
    }> = [];

    techCategories.forEach(cat => {
      cat.tools.forEach(t => {
        let link = t.link;
        if (!link) {
          // Check for workbench match
          const tLower = t.name.toLowerCase();
          if (tLower.includes('subnet') && !tLower.includes('ipv6')) {
            link = '#workbench-subnet';
          } else if (tLower.includes('download') || (tLower.includes('bandwidth') && cat.id === 'bandwidth')) {
            link = '#workbench-speed';
          } else if (tLower.includes('entropy') || tLower.includes('password')) {
            link = '#workbench-crypto';
          } else if (tLower.includes('raid')) {
            link = '#workbench-raid';
          } else {
            link = `#${cat.id}`;
          }
        }
        const isWorkbench = link.startsWith('#workbench-');
        list.push({
          name: t.name,
          meta: t.meta,
          categoryName: cat.name,
          categoryId: cat.id,
          categoryIcon: cat.icon,
          categoryColor: cat.color,
          link,
          isWorkbench
        });
      });
    });
    return list;
  }, [techCategories]);

  // Real-time live matching tools
  const matchingTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allSearchableTools.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.meta.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q)
    );
  }, [searchQuery, allSearchableTools]);

  // Select tool from live search
  const handleSelectTool = (tool: { name: string; link: string; categoryId: string }) => {
    setShowResultsDropdown(false);
    if (tool.link.startsWith('#')) {
      const el = document.querySelector(tool.link) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-primary', 'transition-all', 'duration-300');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-primary');
        }, 2000);
        return;
      }
    }
    const dirEl = document.getElementById('directory');
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Keyboard navigation for search results
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowResultsDropdown(false);
      searchInputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      if (matchingTools.length > 0) {
        e.preventDefault();
        setShowResultsDropdown(true);
        setSelectedResultIndex(prev => (prev + 1) % matchingTools.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (matchingTools.length > 0) {
        e.preventDefault();
        setShowResultsDropdown(true);
        setSelectedResultIndex(prev => (prev - 1 + matchingTools.length) % matchingTools.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matchingTools.length > 0 && showResultsDropdown) {
        const selected = matchingTools[selectedResultIndex] || matchingTools[0];
        if (selected) {
          handleSelectTool(selected);
        }
      } else {
        setShowResultsDropdown(false);
        const dirEl = document.getElementById('directory');
        if (dirEl) {
          dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Sub-navigation filter chips below breadcrumb
  const navChips = [
    { id: 'all', label: 'All Tech & Dev', icon: 'apps' },
    { id: 'networking', label: 'Networking & IP', icon: 'lan' },
    { id: 'bandwidth', label: 'Internet & Bandwidth', icon: 'speed' },
    { id: 'security', label: 'Cybersecurity & Cryptography', icon: 'shield' },
    { id: 'dev-tools', label: 'Developer Utilities', icon: 'terminal' },
    { id: 'frontend', label: 'Web & Frontend', icon: 'web' },
    { id: 'storage', label: 'Storage & RAID', icon: 'save' },
    { id: 'cloud', label: 'Cloud & DevOps', icon: 'cloud_queue' },
    { id: 'algo-math', label: 'Algorithms & Data', icon: 'data_object' },
    { id: 'database', label: 'Database & SQL', icon: 'database' },
    { id: 'hardware', label: 'Systems & Hardware', icon: 'dns' },
    { id: 'devops', label: 'DevOps & SRE', icon: 'published_with_changes' },
    { id: 'encoding', label: 'Encoding & Formats', icon: 'code' },
    { id: 'datascience', label: 'Data Science & Stats', icon: 'analytics' },
    { id: 'iot', label: 'IoT & Embedded', icon: 'developer_board' },
    { id: 'blockchain', label: 'Blockchain & Web3', icon: 'currency_bitcoin' },
    { id: 'conversions', label: 'Tech Conversions', icon: 'sync_alt' }
  ];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between">
      

      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)] flex-1">
        {/* BREADCRUMB NAVIGATION BAR */}
        <section aria-label="Breadcrumb Navigation" className="w-full bg-surface-container-low/70 py-space-xs border-b border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-xs text-body-sm font-body-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant flex-wrap font-medium">
              <Link className="hover:text-primary transition-colors flex items-center gap-1 font-semibold text-on-surface-variant" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Home
              </Link>
              <span className="text-outline-variant select-none">/</span>
              <span className="text-on-surface font-bold">Technology Calculators &amp; Developer Tools</span>
            </nav>
            <div className="hidden sm:flex items-center gap-2 text-label-caps text-[11px] text-on-surface-variant font-label-caps">
              <span className="inline-flex items-center gap-1 text-primary font-bold">
                <span className="material-symbols-outlined text-[14px]">code</span> Client-Side Execution
              </span>
            </div>
          </div>
        </section>

        {/* TOP SUB-NAVIGATION CATEGORY FILTER & TRUST STRIP */}
        <section className="w-full bg-surface-container-low/90 backdrop-blur-md sticky top-16 z-40 border-b border-outline-variant/20 shadow-xs">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
            {/* Interactive Horizontal Sliding Carousel Container */}
            <div className="relative min-w-0 flex-1 flex items-center">
              {/* Left Scroll Button */}
              <button
                type="button"
                onClick={() => scrollNavChips('left')}
                aria-label="Slide categories left"
                className={`hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-highest/90 text-on-surface hover:bg-primary hover:text-on-primary transition-all shadow-xs shrink-0 mr-1.5 cursor-pointer z-10 ${
                  canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-not-allowed pointer-events-none'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              {/* Left Gradient Fade */}
              {canScrollLeft && (
                <div className="absolute left-7 top-0 bottom-0 w-6 bg-gradient-to-r from-surface-container-low to-transparent pointer-events-none z-1 hidden sm:block"></div>
              )}

              {/* Scrollable Category Chips Track */}
              <div
                ref={navChipsRef}
                onWheel={(e) => {
                  if (navChipsRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    navChipsRef.current.scrollLeft += e.deltaY;
                    checkNavScroll();
                  }
                }}
                className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-body-sm font-body-sm scroll-smooth min-w-0 flex-1 overscroll-x-contain"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {navChips.map(chip => {
                  const isActive = selectedCategory === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={(e) => handleCategorySelect(chip.id, e.currentTarget)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[13px] font-medium transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-primary text-on-primary font-bold shadow-sm ring-2 ring-primary/30 scale-100'
                          : 'bg-surface-container-high hover:bg-surface-variant text-on-surface hover:text-primary hover:scale-102 active:scale-98'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Gradient Fade */}
              {canScrollRight && (
                <div className="absolute right-7 top-0 bottom-0 w-6 bg-gradient-to-l from-surface-container-low to-transparent pointer-events-none z-1 hidden sm:block"></div>
              )}

              {/* Right Scroll Button */}
              <button
                type="button"
                onClick={() => scrollNavChips('right')}
                aria-label="Slide categories right"
                className={`hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-highest/90 text-on-surface hover:bg-primary hover:text-on-primary transition-all shadow-xs shrink-0 ml-1.5 cursor-pointer z-10 ${
                  canScrollRight ? 'opacity-100' : 'opacity-30 cursor-not-allowed pointer-events-none'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* Trust Standards Badges */}
            <div className="hidden xl:flex items-center gap-space-xs shrink-0 font-label-caps text-label-caps text-on-surface-variant pl-2 border-l border-outline-variant/30">
              <span className="inline-flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[14px]">verified</span> 100% Free
              </span>
              <span className="text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span> Local Sandbox
              </span>
            </div>
          </div>
        </section>

        {/* CATEGORY HERO SECTION */}
        <section className="relative w-full overflow-hidden pt-space-xl pb-space-2xl bg-gradient-to-b from-surface via-surface-container-low/40 to-surface">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-12 right-10 w-80 h-80 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="max-w-3xl mb-space-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed font-label-caps text-label-caps mb-space-sm shadow-sm border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                ENGINEERING SUITE v4.8 • IEEE 754 &amp; RFC STANDARDS
              </div>
              <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-on-surface tracking-tight leading-none mb-space-sm">
                Technology Calculators <span className="text-primary">&amp;</span> Developer Tools
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Free, deterministic networking calculators, cloud cost estimators, cryptographic tools, AI token calculators, and infrastructure sizing workbenches. Computed 100% in-browser with zero telemetry.
              </p>
            </div>

            {/* Live Telemetry KPI Quad */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-xl">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Tool Roster</div>
                <div className="font-numerical-display text-numerical-display text-on-surface font-bold">100+</div>
                <div className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[15px]">widgets</span> Active Web Calculators
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Architectural Domains</div>
                <div className="font-numerical-display text-numerical-display text-on-surface font-bold">40+</div>
                <div className="font-body-sm text-body-sm text-primary flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[15px]">account_tree</span> Disciplines &amp; Categories
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Operations Evaluated</div>
                <div className="font-numerical-display text-numerical-display text-on-surface font-bold">25K+</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[15px]">trending_up</span> Monthly Browser Solves
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Client Latency</div>
                <div className="font-numerical-display text-numerical-display text-primary font-bold">&lt; 0.8ms</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[15px]">bolt</span> Zero Server Hops
                </div>
              </div>
            </div>

            {/* Developer Command Bar & Live Instant Tool Search */}
            <div ref={searchContainerRef} className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-md border border-outline-variant/30">
              <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-lg mb-space-sm border border-outline-variant/20 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0">search</span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowResultsDropdown(true);
                    setSelectedResultIndex(0);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) {
                      setShowResultsDropdown(true);
                    }
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant py-0.5"
                  id="tool-search-input"
                  placeholder="Search 100+ technology calculators (e.g. Subnet, Bandwidth, RAID, SHA-256, Entropy, Cron)..."
                  type="text"
                  autoComplete="off"
                />
                {/* Active Match Count Badge */}
                {searchQuery.trim().length > 0 && (
                  <span className="bg-primary/10 text-primary text-[12px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap hidden sm:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    {matchingTools.length} {matchingTools.length === 1 ? 'tool' : 'tools'}
                  </span>
                )}
                {/* Clear Button */}
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowResultsDropdown(false);
                      searchInputRef.current?.focus();
                    }}
                    title="Clear search"
                    className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
                <span className="hidden sm:inline-flex items-center font-data-mono text-data-mono text-[11px] bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant shrink-0">
                  {showResultsDropdown ? 'Esc to close' : "Press '/'"}
                </span>
              </div>

              {/* LIVE SEARCH AUTOCOMPLETE DROPDOWN PANEL */}
              {showResultsDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest/98 backdrop-blur-xl rounded-xl shadow-2xl border border-outline-variant/40 z-50 overflow-hidden">
                  {/* Results Header */}
                  <div className="px-space-md py-2.5 bg-surface-container-low/70 border-b border-outline-variant/20 flex items-center justify-between text-body-sm text-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-primary font-bold uppercase tracking-wider text-[11px]">
                        Live Tool Search
                      </span>
                      <span className="text-on-surface-variant text-[12px]">
                        • Found <strong className="text-on-surface font-semibold">{matchingTools.length}</strong> matching {matchingTools.length === 1 ? 'tool' : 'tools'}
                      </span>
                    </div>
                    <span className="text-[11px] font-data-mono text-on-surface-variant hidden md:inline-block">
                      ↑↓ to navigate • Enter to select • Esc to exit
                    </span>
                  </div>

                  {/* Results List */}
                  {matchingTools.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/10 overscroll-contain">
                      {matchingTools.map((tool, idx) => {
                        const isSelected = idx === selectedResultIndex;
                        return (
                          <button
                            key={`${tool.categoryId}-${tool.name}-${idx}`}
                            type="button"
                            onClick={() => handleSelectTool(tool)}
                            onMouseEnter={() => setSelectedResultIndex(idx)}
                            className={`w-full px-space-md py-2.5 text-left flex items-center justify-between gap-space-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary/10 border-l-4 border-primary pl-3'
                                : 'hover:bg-surface-container-low border-l-4 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-space-sm min-w-0 flex-1">
                              <span
                                className={`w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 ${tool.categoryColor}`}
                              >
                                <span className="material-symbols-outlined text-[16px]">{tool.categoryIcon}</span>
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-on-surface text-[14px]">
                                    {tool.name}
                                  </span>
                                  {tool.isWorkbench && (
                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded text-[10px] font-bold bg-primary text-on-primary shadow-xs uppercase">
                                      <span className="material-symbols-outlined text-[11px]">bolt</span> Live Solver
                                    </span>
                                  )}
                                  <span className="font-data-mono text-[11px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">
                                    {tool.meta}
                                  </span>
                                </div>
                                <div className="text-[12px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                                  <span>in {tool.categoryName}</span>
                                </div>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary shrink-0">
                              arrow_forward
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Empty Search State */
                    <div className="p-space-lg text-center">
                      <span className="material-symbols-outlined text-[36px] text-on-surface-variant/60 mb-2">search_off</span>
                      <p className="font-medium text-on-surface mb-1">
                        No direct tool matches for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Try searching by standard RFC, protocol name, or click any common tool below:
                      </p>
                      <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto">
                        {[
                          'Subnet Calculator',
                          'Download Time',
                          'Password Entropy',
                          'RAID Storage',
                          'SHA-256',
                          'Cron Parser',
                          'UUID Generator',
                          'Aspect Ratio'
                        ].map(suggestion => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => quickFilter(suggestion)}
                            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-[12px] font-medium transition-colors cursor-pointer"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dropdown Footer CTA */}
                  {matchingTools.length > 0 && (
                    <div className="p-space-xs bg-surface-container-low/90 border-t border-outline-variant/20 flex items-center justify-between px-space-md">
                      <span className="text-[12px] text-on-surface-variant">
                        Filtering active in directory below
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowResultsDropdown(false);
                          const dirEl = document.getElementById('directory');
                          if (dirEl) {
                            dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="text-primary hover:underline text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        View all in Directory Grid <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Common Queries Row */}
              <div className="flex flex-wrap items-center gap-2 font-body-sm text-body-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Common Queries:</span>
                {[
                  'Subnet Calculator',
                  'CIDR Calculator',
                  'Bandwidth Calculator',
                  'Download Time',
                  'Hash Generator',
                  'Aspect Ratio',
                  'Cron Parser',
                  'UUID Generator',
                  'RAID Sizer'
                ].map(query => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => quickFilter(query)}
                    className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors font-data-mono text-[12px] cursor-pointer"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TECH GOAL FINDER */}
        <section className="w-full py-space-2xl bg-surface-container-low/30 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                  Intent-Based Navigation
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  What are you building or planning today?
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2 md:mt-0">
                Targeted micro-suites curated for full-stack engineering lifecycle stages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[
                {
                  title: 'Design Networks',
                  desc: 'Subnetting, CIDR prefix masks, VLSM, IPv6 translation, and broadcast calculation.',
                  tools: '28 Tools',
                  color: 'primary',
                  icon: 'lan',
                  link: '#workbench-subnet'
                },
                {
                  title: 'Estimate Cloud Costs',
                  desc: 'AWS EC2/S3, Azure VMs, GCP egress pricing, server dimensioning, and edge CDN cache.',
                  tools: '22 Tools',
                  color: 'secondary',
                  icon: 'cloud',
                  link: '#cloud'
                },
                {
                  title: 'Improve Security',
                  desc: 'Password entropy bits, SHA/MD5 hashing, JWT token debugging, and brute force thresholds.',
                  tools: '19 Tools',
                  color: 'primary',
                  icon: 'shield',
                  link: '#security'
                },
                {
                  title: 'Entropy & Cryptography',
                  desc: 'Password entropy bits, NIST SP 800-63B guidelines, brute-force cracking estimates, and hash resistance.',
                  tools: '19 Tools',
                  color: 'tertiary',
                  icon: 'shield_lock',
                  link: '#workbench-crypto'
                },
                {
                  title: 'Manage Storage',
                  desc: 'RAID usable array capacity, backup backup windows, compression rates, and cold tiering.',
                  tools: '24 Tools',
                  color: 'primary',
                  icon: 'database',
                  link: '#workbench-raid'
                },
                {
                  title: 'Improve Website Speed',
                  desc: 'Core Web Vitals budgets, CDN edge latency, TTFB profiling, and LCP payload reduction.',
                  tools: '17 Tools',
                  color: 'primary',
                  icon: 'speed',
                  link: '#workbench-speed'
                },
                {
                  title: 'Develop Software',
                  desc: 'RFC JSON schema validator, regex capture engines, UUID v4 generators, and cron schedule parsing.',
                  tools: '31 Tools',
                  color: 'secondary',
                  icon: 'code',
                  link: '#dev-tools'
                },
                {
                  title: 'Plan Infrastructure',
                  desc: 'Rack unit allocations (U), datacenter BTU/hr heat dissipation, PUE, and SAN IOPS headroom.',
                  tools: '21 Tools',
                  color: 'tertiary',
                  icon: 'dns',
                  link: '#hardware'
                }
              ].map(goal => (
                <a
                  key={goal.title}
                  href={goal.link}
                  className="group p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-sm hover:shadow-md flex flex-col justify-between border border-outline-variant/30"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform ${
                        goal.color === 'primary'
                          ? 'bg-primary-fixed text-primary'
                          : goal.color === 'secondary'
                          ? 'bg-secondary-fixed text-secondary'
                          : 'bg-tertiary-fixed text-tertiary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{goal.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] mb-1 font-bold">
                      {goal.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{goal.desc}</p>
                  </div>
                  <div className="mt-space-md flex items-center justify-between text-on-surface font-label-caps text-label-caps font-bold">
                    <span
                      className={`font-bold ${
                        goal.color === 'primary'
                          ? 'text-primary'
                          : goal.color === 'secondary'
                          ? 'text-secondary'
                          : 'text-tertiary'
                      }`}
                    >
                      {goal.tools}
                    </span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURED INTERACTIVE MICRO-WORKBENCHES */}
        <section className="w-full py-space-3xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                Real-Time Client Solvers
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Interactive Engineering Micro-Workbenches
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Execute calculations directly below. Pure mathematical evaluations executed inside your browser without backend network roundtrips.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
              {/* WORKBENCH 1: IPv4 Subnet & CIDR Workbench */}
              <div
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between border border-outline-variant/30"
                id="workbench-subnet"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">alt_route</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface text-[19px] font-semibold">
                        IPv4 Subnet &amp; CIDR Workbench
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono text-[12px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      RFC 4632
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="subnet-ip">
                        IP Address
                      </label>
                      <input
                        className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                        id="subnet-ip"
                        type="text"
                        value={subnetIp}
                        onChange={e => setSubnetIp(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="subnet-mask">
                        Subnet Prefix (CIDR)
                      </label>
                      <select
                        className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                        id="subnet-mask"
                        value={subnetCidr}
                        onChange={e => setSubnetCidr(parseInt(e.target.value, 10))}
                      >
                        <option value="24">/24 (255.255.255.0)</option>
                        <option value="25">/25 (255.255.255.128)</option>
                        <option value="26">/26 (255.255.255.192)</option>
                        <option value="27">/27 (255.255.255.224)</option>
                        <option value="28">/28 (255.255.255.240)</option>
                        <option value="29">/29 (255.255.255.248)</option>
                        <option value="30">/30 (255.255.255.252)</option>
                      </select>
                    </div>
                  </div>

                  {/* Visual Subnet Block Graphic */}
                  <div className="bg-surface-container-low p-space-sm rounded-lg mb-space-md border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span>Network Allocation Map (/{subnetCidr} Block)</span>
                      <span id="subnet-total-hosts">{subnetResult.totalHosts}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: subnetResult.usablePct }}
                        title={`Usable Hosts: ${subnetResult.usableHosts}`}
                      ></div>
                      <div
                        className="h-full bg-tertiary transition-all"
                        style={{ width: subnetResult.overheadPct }}
                        title="Network & Broadcast: 2"
                      ></div>
                    </div>
                  </div>

                  {/* Output Sidecar Grid */}
                  <div className="grid grid-cols-2 gap-space-sm font-data-mono text-data-mono text-[13px]">
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Usable Host Range
                      </span>
                      <span className="text-on-surface font-semibold text-[13px]" id="subnet-host-range">
                        {subnetResult.hostRange}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Broadcast Address
                      </span>
                      <span className="text-on-surface font-semibold text-[13px]" id="subnet-broadcast">
                        {subnetResult.broadcast}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Usable Hosts
                      </span>
                      <span className="text-primary font-bold text-[16px]" id="subnet-usable-hosts">
                        {subnetResult.usableHosts}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Wildcard Mask
                      </span>
                      <span className="text-on-surface font-semibold text-[13px]" id="subnet-wildcard">
                        {subnetResult.wildcard}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md pt-space-sm flex items-center justify-between text-body-sm text-body-sm">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">memory</span> Instant calculation
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps transition-transform active:scale-95 shadow-sm cursor-pointer"
                  >
                    Compute Subnet
                  </button>
                </div>
              </div>

              {/* WORKBENCH 2: Download & Data Transfer Time Calculator */}
              <div
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between border border-outline-variant/30"
                id="workbench-speed"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">download_for_offline</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface text-[19px] font-semibold">
                        Download &amp; Transfer Time Sizer
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono text-[12px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      IEEE 802.3
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="transfer-size">
                        File Payload (GB)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                          id="transfer-size"
                          min="1"
                          type="number"
                          value={transferSize}
                          onChange={e => setTransferSize(parseFloat(e.target.value) || 1)}
                        />
                        <span className="absolute right-3 top-2 font-data-mono text-data-mono text-[12px] text-on-surface-variant">
                          GB
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="transfer-speed">
                        Transfer Bandwidth (Mbps)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                          id="transfer-speed"
                          min="1"
                          type="number"
                          value={transferSpeed}
                          onChange={e => setTransferSpeed(parseFloat(e.target.value) || 1)}
                        />
                        <span className="absolute right-3 top-2 font-data-mono text-data-mono text-[12px] text-on-surface-variant">
                          Mbps
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overhead slider */}
                  <div className="bg-surface-container-low p-space-sm rounded-lg mb-space-md border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span>TCP/IP &amp; Frame Overhead: <span id="overhead-pct">{transferOverhead}%</span></span>
                      <span className="text-[11px]">Typical WAN Surcharge</span>
                    </div>
                    <input
                      className="w-full accent-secondary cursor-pointer"
                      id="transfer-overhead"
                      max="20"
                      min="0"
                      type="range"
                      value={transferOverhead}
                      onChange={e => setTransferOverhead(parseInt(e.target.value, 10))}
                    />
                  </div>

                  {/* Output Sidecar Grid */}
                  <div className="grid grid-cols-2 gap-space-sm font-data-mono text-data-mono text-[13px]">
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Estimated Elapsed Duration
                      </span>
                      <span className="text-secondary font-bold text-[18px]" id="transfer-time-res">
                        {transferResult.time}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Effective Throughput
                      </span>
                      <span className="text-on-surface font-semibold text-[14px]" id="transfer-mbps-res">
                        {transferResult.throughput}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Total Bytes Transferred
                      </span>
                      <span className="text-on-surface font-semibold text-[13px]" id="transfer-bytes-res">
                        {transferResult.totalBytes}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        1 Gbps Fiber Target
                      </span>
                      <span className="text-primary font-semibold text-[13px]">
                        {transferResult.gigabitCompare}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md pt-space-sm flex items-center justify-between text-body-sm text-body-sm">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">wifi</span> Bit-to-Byte RFC 1122
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-container text-on-secondary font-label-caps text-label-caps transition-transform active:scale-95 shadow-sm cursor-pointer"
                  >
                    Recalculate Time
                  </button>
                </div>
              </div>

              {/* WORKBENCH 3: Password Entropy Modeler */}
              <div
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between border border-outline-variant/30"
                id="workbench-crypto"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[22px]">shield_lock</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface text-[19px] font-semibold">
                        Password Entropy &amp; Cryptographic Security Modeler
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono text-[12px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      NIST SP 800-63B
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="entropy-length">
                        Password Length (Characters)
                      </label>
                      <input
                        className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                        id="entropy-length"
                        max="128"
                        min="4"
                        type="number"
                        value={entropyLength}
                        onChange={e => setEntropyLength(parseInt(e.target.value, 10) || 4)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="entropy-charset">
                        Character Set Space
                      </label>
                      <select
                        className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                        id="entropy-charset"
                        value={entropyCharset}
                        onChange={e => setEntropyCharset(parseInt(e.target.value, 10))}
                      >
                        <option value="10">Digits Only (0-9, 10 chars)</option>
                        <option value="26">Lowercase Letters (a-z, 26 chars)</option>
                        <option value="62">Alphanumeric (a-z, A-Z, 0-9, 62 chars)</option>
                        <option value="94">Alphanumeric + Symbols (94 chars)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-space-sm rounded-lg mb-space-md border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span>Theoretical Entropy Pool Strength</span>
                      <span>{entropyResult.secClass}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                      <div
                        className="h-full bg-tertiary transition-all"
                        style={{ width: entropyResult.barWidth }}
                        title="Entropy Resistance"
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-space-sm font-data-mono text-data-mono text-[13px]">
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Information Entropy
                      </span>
                      <span className="text-tertiary font-bold text-[18px]" id="entropy-bits">
                        {entropyResult.bits}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Crack Time (100 GH/s Hash Rate)
                      </span>
                      <span className="text-on-surface font-semibold text-[14px]" id="entropy-crack-time">
                        {entropyResult.crackTime}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Cryptographic Security Class
                      </span>
                      <span className="text-primary font-semibold text-[13px]">
                        {entropyResult.secClass}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Client Verification
                      </span>
                      <span className="text-on-surface font-semibold text-[13px]">100% WebCrypto API</span>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md pt-space-sm flex items-center justify-between text-body-sm text-body-sm">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">verified</span> Zero Server Transmission
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-caps text-label-caps transition-transform active:scale-95 shadow-sm cursor-pointer"
                  >
                    Evaluate Entropy
                  </button>
                </div>
              </div>

              {/* WORKBENCH 4: RAID Storage & Usability Calculator */}
              <div
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between border border-outline-variant/30"
                id="workbench-raid"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">hard_drive</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface text-[19px] font-semibold">
                        RAID Storage &amp; Usability Calculator
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono text-[12px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      SNIA Specs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="raid-level">
                        RAID Architecture
                      </label>
                      <select
                        className="w-full bg-surface-container-low px-2 py-2 rounded-lg font-data-mono text-data-mono text-[12px] text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                        id="raid-level"
                        value={raidLevel}
                        onChange={e => setRaidLevel(e.target.value)}
                      >
                        <option value="0">RAID 0 (Striping)</option>
                        <option value="1">RAID 1 (Mirroring)</option>
                        <option value="5">RAID 5 (Parity)</option>
                        <option value="6">RAID 6 (Dual Parity)</option>
                        <option value="10">RAID 10 (1+0 Striped Mirror)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="raid-drives">
                        Drive Quantity
                      </label>
                      <input
                        className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-[12px] text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                        id="raid-drives"
                        max="32"
                        min="2"
                        type="number"
                        value={raidDrives}
                        onChange={e => setRaidDrives(parseInt(e.target.value, 10) || 2)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="raid-drive-size">
                        Capacity / Disk
                      </label>
                      <select
                        className="w-full bg-surface-container-low px-2 py-2 rounded-lg font-data-mono text-data-mono text-[12px] text-on-surface outline-none focus:bg-surface-container focus:text-primary transition-all border border-outline-variant/20"
                        id="raid-drive-size"
                        value={raidDriveSize}
                        onChange={e => setRaidDriveSize(parseFloat(e.target.value) || 4)}
                      >
                        <option value="4">4 TB</option>
                        <option value="8">8 TB</option>
                        <option value="12">12 TB</option>
                        <option value="16">16 TB Enterprise</option>
                        <option value="20">20 TB Enterprise</option>
                        <option value="24">24 TB Ultrastar</option>
                      </select>
                    </div>
                  </div>

                  {/* RAID Visual Allocation Bar */}
                  <div className="bg-surface-container-low p-space-sm rounded-lg mb-space-md border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span id="raid-bar-title">{raidResult.efficiency}</span>
                      <span className="font-semibold text-on-surface" id="raid-raw-total">{raidResult.rawTotal}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                      <div
                        className="h-full bg-primary transition-all"
                        id="raid-usable-bar"
                        style={{ width: raidResult.usablePct }}
                        title="Usable Storage"
                      ></div>
                      <div
                        className="h-full bg-tertiary transition-all"
                        id="raid-parity-bar"
                        style={{ width: raidResult.parityPct }}
                        title="Parity Overhead"
                      ></div>
                    </div>
                  </div>

                  {/* Output Sidecar Grid */}
                  <div className="grid grid-cols-2 gap-space-sm font-data-mono text-data-mono text-[13px]">
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Net Usable Storage
                      </span>
                      <span className="text-primary font-bold text-[18px]" id="raid-usable-res">
                        {raidResult.usable}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Parity / Redundancy Loss
                      </span>
                      <span className="text-tertiary font-semibold text-[14px]" id="raid-parity-res">
                        {raidResult.parity}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Hardware Fault Tolerance
                      </span>
                      <span className="text-on-surface font-semibold text-[13px]" id="raid-fault-res">
                        {raidResult.fault}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase text-[10px]">
                        Read / Write Profile
                      </span>
                      <span className="text-on-surface font-semibold text-[13px]" id="raid-perf-res">
                        {raidResult.perf}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md pt-space-sm flex items-center justify-between text-body-sm text-body-sm">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span> ZFS &amp; Hardware SAS Compliant
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps transition-transform active:scale-95 shadow-sm cursor-pointer"
                  >
                    Recalculate RAID
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: COMPLETE 20-CATEGORY TECHNOLOGY DIRECTORY */}
        <section className="w-full py-space-3xl bg-surface-container-low/20 border-t border-outline-variant/20" id="directory">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                  Index &amp; Roster
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  {selectedCategory === 'all'
                    ? 'Complete 20-Category Technology Directory'
                    : `${techCategories.find(c => c.id === selectedCategory)?.name || 'Category'} Tools`}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                  {selectedCategory === 'all'
                    ? 'Browse through 100+ deterministic developer calculators, converters, sizing matrices, and network engines.'
                    : `Filtered view showing dedicated tools for ${techCategories.find(c => c.id === selectedCategory)?.name}.`}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="font-label-caps text-label-caps bg-primary text-on-primary px-3.5 py-1.5 rounded-full font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                    Show All (20 Categories)
                  </button>
                )}
                <div className="font-label-caps text-label-caps bg-surface-container-high px-3 py-1 rounded-full text-on-surface border border-outline-variant/30">
                  {filteredTechCategories.reduce((acc, cat) => acc + cat.tools.length, 0)} TOOLS IN VIEW
                </div>
              </div>
            </div>

            {/* 20-Category Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md" id="categories-container">
              {filteredTechCategories.map(cat => (
                <div
                  key={cat.id}
                  className="category-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30"
                  id={cat.id}
                >
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[20px] ${cat.color}`}>{cat.icon}</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface text-[17px] font-semibold">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      {cat.count}
                    </span>
                  </div>
                  <ul className="space-y-2.5 font-body-sm text-body-sm">
                    {cat.tools.map(tool => (
                      <li key={tool.name}>
                        <a
                          className="group flex items-center justify-between font-bold text-on-surface hover:text-primary py-1 px-1.5 -mx-1.5 rounded-md hover:bg-surface-container/60 transition-all"
                          href={tool.link || '#workbenches'}
                        >
                          <span className="font-bold leading-snug">
                            {tool.name}
                          </span>
                          <span className="text-primary font-bold text-[14px] transition-transform duration-200 group-hover:translate-x-1 shrink-0 select-none ml-2">
                            →
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: TECH ECOSYSTEM ROADMAP (7 STEPS) */}
        <section className="w-full py-space-3xl bg-surface border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center max-w-2xl mx-auto mb-space-2xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                Architecture Pipeline
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Full-Stack Lifecycle Roadmap
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                From physical substrate to distributed application scale—every tier calibrated with mathematical precision tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-space-xs relative">
              {[
                { step: '01', title: 'Network', desc: 'Subnets, BGP Routing, IP Allocation', cta: 'Subnetter →', link: '#workbench-subnet' },
                { step: '02', title: 'Hardware', desc: 'Power, BTU, U-Rack, IOPS, SAN', cta: 'Rack Sizer →', link: '#hardware' },
                { step: '03', title: 'Cloud', desc: 'AWS/GCP, Egress, Serverless, K8s', cta: 'Cost Matrix →', link: '#cloud' },
                { step: '04', title: 'Application', desc: 'JSON, Regex, Cron, UUID, Encoding', cta: 'Dev Tools →', link: '#dev-tools' },
                { step: '05', title: 'Security', desc: 'Entropy, SHA256, JWT, Brute Force', cta: 'Crypto Tools →', link: '#workbench-crypto' },
                { step: '06', title: 'Optimization', desc: 'Core Web Vitals, CDN, Payload', cta: 'Speed Sizer →', link: '#workbench-speed' },
                { step: '07', title: 'Scale & Performance', desc: 'Edge Caching, Compression, HTTP/3', cta: 'Edge Caching →', link: '#workbench-speed' }
              ].map(item => (
                <div key={item.step} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm text-center flex flex-col items-center border border-outline-variant/20">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold font-data-mono text-[12px] flex items-center justify-center mb-space-xs">
                    {item.step}
                  </div>
                  <h4 className="font-headline-md text-headline-md text-[15px] text-on-surface mb-1 font-semibold">{item.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mb-space-sm leading-snug">{item.desc}</p>
                  <a className="font-label-caps text-label-caps text-primary hover:underline mt-auto font-bold" href={item.link}>
                    {item.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: SMART TECH ASSISTANT (STACK PACKS) */}
        <section className="w-full py-space-2xl bg-surface-container-low/40 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-space-lg gap-4">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                    Smart Stack Assistant
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    What are you architecting today?
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 text-body-sm text-body-sm">
                  {[
                    { key: 'webapp', label: 'Modern Web App' },
                    { key: 'ai', label: 'Offline-First PWA' },
                    { key: 'network', label: 'Enterprise Network' },
                    { key: 'cloudmig', label: 'Cloud Migration' },
                    { key: 'db', label: 'High-Avail DB' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveStack(tab.key as typeof activeStack)}
                      className={`px-3 py-1.5 rounded-lg font-label-caps text-label-caps transition-all cursor-pointer ${
                        activeStack === tab.key
                          ? 'bg-primary text-on-primary shadow-sm font-semibold'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Stack Recommendation Pane */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                {stackConfigs[activeStack].map(item => (
                  <div key={item.title} className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
                    <div className={`flex items-center gap-2 ${item.color} font-headline-md text-[16px] mb-1 font-semibold`}>
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span> {item.title}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">{item.desc}</p>
                    <a className={`font-data-mono text-data-mono text-[12px] ${item.color} hover:underline font-bold`} href={item.link}>
                      {item.linkText}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: TECHNOLOGY LEARNING CENTER */}
        <section className="w-full py-space-3xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                Engineering Whitepapers
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Technology &amp; Architecture Reference Guides
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Deep-dive technical guides demystifying the low-level math running inside SolveIt Calculator workbenches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Guide 1 */}
              <article className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="font-label-caps text-label-caps text-primary uppercase mb-2 font-semibold">
                    RFC 4632 • IETF Standards
                  </div>
                  <h3 className="font-headline-md text-headline-md text-[20px] text-on-surface mb-space-sm leading-snug font-semibold">
                    How CIDR Subnetting &amp; Bitmasking Work in IPv4
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                    Classless Inter-Domain Routing (CIDR) replaced legacy Class A, B, and C divisions. A prefix length (e.g.,{' '}
                    <code className="font-data-mono text-[13px] bg-surface-container px-1 py-0.5 rounded text-on-surface">/26</code>)
                    allocates binary 1s from left to right, creating 64 addresses, leaving 62 valid hosts after subtracting network ID and broadcast.
                  </p>
                </div>
                <div className="pt-space-sm border-t border-surface-container flex items-center justify-between text-body-sm text-body-sm text-on-surface-variant">
                  <span>6 min read</span>
                  <a href="#workbench-subnet" className="font-bold text-primary hover:underline">Read Guide →</a>
                </div>
              </article>

              {/* Guide 2 */}
              <article className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="font-label-caps text-label-caps text-tertiary uppercase mb-2 font-semibold">
                    Machine Learning Systems
                  </div>
                  <h3 className="font-headline-md text-headline-md text-[20px] text-on-surface mb-space-sm leading-snug font-semibold">
                    Understanding LLM Token Windows &amp; Inference Math
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                    Byte-Pair Encoding (BPE) averages ~0.75 words per token in English. With quadratic attention complexity in standard Transformer heads, KV-cache scaling and prompt prefill determine the memory boundary before GPU generation bandwidth kicks in.
                  </p>
                </div>
                <div className="pt-space-sm border-t border-surface-container flex items-center justify-between text-body-sm text-body-sm text-on-surface-variant">
                  <span>8 min read</span>
                  <a href="#workbench-crypto" className="font-bold text-tertiary hover:underline">Read Guide →</a>
                </div>
              </article>

              {/* Guide 3 */}
              <article className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="font-label-caps text-label-caps text-secondary uppercase mb-2 font-semibold">
                    Storage Hardware &amp; Parity
                  </div>
                  <h3 className="font-headline-md text-headline-md text-[20px] text-on-surface mb-space-sm leading-snug font-semibold">
                    RAID 0, 1, 5, 6, 10: Fault Tolerance vs Usable Space
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                    Stripping offers peak raw speed with 0% fault tolerance. RAID 5 distributes XOR parity across{' '}
                    <code className="font-data-mono text-[13px] bg-surface-container px-1 py-0.5 rounded text-on-surface">(N - 1)</code>{' '}
                    disks, whereas RAID 6 protects against double drive casualties during lengthy resilvering cycles on high-density spinning disks.
                  </p>
                </div>
                <div className="pt-space-sm border-t border-surface-container flex items-center justify-between text-body-sm text-body-sm text-on-surface-variant">
                  <span>5 min read</span>
                  <a href="#workbench-raid" className="font-bold text-secondary hover:underline">Read Guide →</a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 8: SIDE-BY-SIDE ARCHITECTURAL COMPARISONS */}
        <section className="w-full py-space-3xl bg-surface-container-low/30 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center max-w-2xl mx-auto mb-space-2xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                Architecture Comparison
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Standard Technology Trade-Off Matrix
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                Clear mathematical and architectural comparisons for mission-critical infrastructure decisions.
              </p>
            </div>

            {/* Comparative Table Container */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-x-auto border border-outline-variant/30">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="border-b border-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase bg-surface-container-low/50">
                    <th className="p-space-md">Technology Domain</th>
                    <th className="p-space-md">Architecture Choice A</th>
                    <th className="p-space-md">Architecture Choice B</th>
                    <th className="p-space-md">Key Mathematical Metric</th>
                    <th className="p-space-md">Primary Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md font-semibold text-on-surface">IP Addressing</td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">IPv4</span>
                      <div className="font-data-mono text-[11px] text-outline">32-bit (4.29 × 10⁹ Total)</div>
                    </td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">IPv6</span>
                      <div className="font-data-mono text-[11px] text-outline">128-bit (3.4 × 10³⁸ Total)</div>
                    </td>
                    <td className="p-space-md font-data-mono text-[12px] text-primary">Zero NAT Overhead in v6</td>
                    <td className="p-space-md text-on-surface-variant">Dual-stack transition; IPv6 for internal Kubernetes &amp; IoT.</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md font-semibold text-on-surface">Hashing Algorithms</td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">MD5 / SHA-1</span>
                      <div className="font-data-mono text-[11px] text-error">Broken (Collision Vulnerable)</div>
                    </td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">SHA-256 / SHA-512</span>
                      <div className="font-data-mono text-[11px] text-primary">Cryptographically Secure</div>
                    </td>
                    <td className="p-space-md font-data-mono text-[12px] text-primary">2¹²⁸ collision boundary</td>
                    <td className="p-space-md text-on-surface-variant">Never use MD5 for auth; SHA-256 for HMAC / data checksums.</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md font-semibold text-on-surface">Application Topology</td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">Modular Monolith</span>
                      <div className="font-data-mono text-[11px] text-outline">Single binary, in-memory IPC</div>
                    </td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">Microservices</span>
                      <div className="font-data-mono text-[11px] text-outline">Distributed RPC / gRPC mesh</div>
                    </td>
                    <td className="p-space-md font-data-mono text-[12px] text-primary">&lt; 0.1ms vs 3–15ms IPC latency</td>
                    <td className="p-space-md text-on-surface-variant">Monolith for small to mid teams; microservices for isolated scaling.</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md font-semibold text-on-surface">API Protocol</td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">RESTful HTTP/JSON</span>
                      <div className="font-data-mono text-[11px] text-outline">Deterministic endpoints &amp; CDN caching</div>
                    </td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">GraphQL</span>
                      <div className="font-data-mono text-[11px] text-outline">Single POST schema &amp; client picking</div>
                    </td>
                    <td className="p-space-md font-data-mono text-[12px] text-primary">0% overfetching in GraphQL</td>
                    <td className="p-space-md text-on-surface-variant">REST for heavy public CDN caching; GraphQL for rich multi-view UI.</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md font-semibold text-on-surface">Virtualization</td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">OCI Container (Docker)</span>
                      <div className="font-data-mono text-[11px] text-outline">Shared Linux kernel cgroups</div>
                    </td>
                    <td className="p-space-md">
                      <span className="font-semibold text-on-surface">Hardware VM (KVM)</span>
                      <div className="font-data-mono text-[11px] text-outline">Dedicated virtual BIOS/OS</div>
                    </td>
                    <td className="p-space-md font-data-mono text-[12px] text-primary">~50ms vs ~25s boot time</td>
                    <td className="p-space-md text-on-surface-variant">Containers for high-density compute; VMs for multi-tenant isolation.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 9: TECHNICAL SEO FAQS */}
        <section className="w-full py-space-3xl bg-surface">
          <div className="max-w-max-width-calculator mx-auto px-gutter-mobile">
            <div className="text-center mb-space-2xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1 font-bold">
                Architecture Questions
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Frequently Asked Questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Technical specifications, precision boundaries, and privacy mechanisms.
              </p>
            </div>

            <div className="space-y-space-sm">
              {[
                {
                  q: 'Are calculations performed client-side or sent to a backend server?',
                  a: 'All SolveIt Calculator technology calculators execute strictly 100% client-side inside your browser sandbox using compiled WebAssembly and native ECMAScript. No IP addresses, subnet configurations, cryptographic keys, tokens, or network topology inputs are ever logged, cached, or transmitted over the wire.'
                },
                {
                  q: 'Which RFC and networking standards do these tools comply with?',
                  a: 'Our engines comply with published IETF Request for Comments (RFCs) including RFC 4632 (CIDR address allocation), RFC 791 (Internet Protocol), RFC 4291 (IPv6 addressing), RFC 1122 (Host Requirements), RFC 8259 (The JavaScript Object Notation format), and NIST SP 800 cryptographic standards for entropy and hashing.'
                },
                {
                  q: 'Are any paid APIs, AI model APIs, or third-party cloud services required to use these tools?',
                  a: 'No. 100% of all calculations, encoding, cryptography, network subnets, and algorithm modeling run entirely in your local browser sandbox via vanilla JavaScript and the standard Web Crypto API. We make zero calls to OpenAI, Anthropic, or external paid APIs, ensuring total privacy, zero latency, and zero subscription costs.'
                },
                {
                  q: 'Can I use these developer utilities completely offline?',
                  a: 'Yes. SolveIt Calculator is registered as a Progressive Web Application (PWA). Once loaded in your browser, the service worker caches all static assets and mathematical execution scripts, allowing you to use subnet calculators, hash generators, JSON formatters, and RAID planners in air-gapped datacenter environments without internet access.'
                },
                {
                  q: 'How does SolveIt Calculator handle IEEE 754 floating-point accuracy?',
                  a: 'For critical calculations requiring absolute mathematical precision—such as financial amortizations, high-precision bit shifts, and massive hash computations—we enforce arbitrary-precision BigInt and decimal libraries to eliminate the typical IEEE 754 binary floating-point rounding errors (e.g., 0.1 + 0.2 ≠ 0.30000000000000004).'
                }
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all open:shadow-md border border-outline-variant/30"
                >
                  <summary className="flex items-center justify-between font-headline-md text-headline-md text-[18px] text-on-surface cursor-pointer list-none font-semibold">
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-space-sm pt-space-xs border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10: MEGA TECH FOOTER BANNER */}
        <section className="w-full bg-surface-container-highest py-space-xl text-on-surface border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-[18px] text-on-surface font-semibold">
                  Zero Telemetry • Enterprise Open Sandbox
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Built in adherence with IETF RFCs, IEEE 802.3, NIST SP 800, W3C WCAG 2.1, and ISO/IEC 27001.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 font-data-mono text-data-mono text-[12px]">
              <span className="px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-on-surface border border-outline-variant/20">
                Engine: V8 WASM
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-bold border border-outline-variant/20">
                Sub-0.02s Execution
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
