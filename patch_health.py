import re

with open('healthClient_old.tsx', 'r') as f:
    content = f.read()

# 1. Add new states after liftReps
states_insert = """  const [liftReps, setLiftReps] = useState<number>(5);

  // Macros
  const [macroCalories, setMacroCalories] = useState<number>(2500);
  // Lean Mass
  const [lmWeight, setLmWeight] = useState<number>(75);
  const [lmFat, setLmFat] = useState<number>(15);
  // METs
  const [metsWeight, setMetsWeight] = useState<number>(75);
  const [metsValue, setMetsValue] = useState<number>(8);
  const [metsDuration, setMetsDuration] = useState<number>(30);
  // Pace
  const [paceDist, setPaceDist] = useState<number>(5);
  const [paceTime, setPaceTime] = useState<number>(25);
  // FTP
  const [ftpPower, setFtpPower] = useState<number>(200);
  // Rucking
  const [ruckWeight, setRuckWeight] = useState<number>(75);
  const [ruckPack, setRuckPack] = useState<number>(15);
  // THR
  const [thrAge, setThrAge] = useState<number>(30);
  const [thrRhr, setThrRhr] = useState<number>(60);
  const [thrIntensity, setThrIntensity] = useState<number>(70);
  // BP
  const [bpSys, setBpSys] = useState<number>(120);
  const [bpDia, setBpDia] = useState<number>(80);
  // HRR
  const [hrrPeak, setHrrPeak] = useState<number>(170);
  const [hrr1Min, setHrr1Min] = useState<number>(140);
  // Max HR
  const [maxHrAge, setMaxHrAge] = useState<number>(30);
  // Sleep Debt
  const [sleepReq, setSleepReq] = useState<number>(8);
  const [sleepAct, setSleepAct] = useState<number>(6);
  // ESS
  const [essScore, setEssScore] = useState<number>(8);
  // Ovulation
  const [ovuLmp, setOvuLmp] = useState<string>('2026-05-15');
  const [ovuCycle, setOvuCycle] = useState<number>(28);
  // hCG
  const [hcg1, setHcg1] = useState<number>(150);
  const [hcg2, setHcg2] = useState<number>(320);
  const [hcgHours, setHcgHours] = useState<number>(48);"""
content = content.replace("  const [liftReps, setLiftReps] = useState<number>(5);", states_insert)


# 2. Add new calculated values after calculated1RM
calc_insert = """  const calculated1RM = useMemo(() => {
    return Math.round(liftWeight * (1 + 0.0333 * liftReps));
  }, [liftWeight, liftReps]);

  const calculatedMacros = useMemo(() => {
    const p = Math.round((macroCalories * 0.3) / 4);
    const c = Math.round((macroCalories * 0.35) / 4);
    const f = Math.round((macroCalories * 0.35) / 9);
    return { p, c, f };
  }, [macroCalories]);
  const calculatedLeanMass = useMemo(() => {
    return parseFloat((lmWeight * (1 - lmFat / 100)).toFixed(1));
  }, [lmWeight, lmFat]);
  const calculatedMets = useMemo(() => {
    return Math.round(metsWeight * metsValue * (metsDuration / 60));
  }, [metsWeight, metsValue, metsDuration]);
  const calculatedPace = useMemo(() => {
    const minsPerKm = paceTime / paceDist;
    const m = Math.floor(minsPerKm);
    const s = Math.round((minsPerKm - m) * 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }, [paceDist, paceTime]);
  const calculatedFtp = useMemo(() => {
    return Math.round(ftpPower * 0.95);
  }, [ftpPower]);
  const calculatedRucking = useMemo(() => {
    return Math.round((ruckWeight + ruckPack) * 6 * (30 / 60));
  }, [ruckWeight, ruckPack]);
  const calculatedThr = useMemo(() => {
    const max = 208 - 0.7 * thrAge;
    return Math.round(((max - thrRhr) * (thrIntensity / 100)) + thrRhr);
  }, [thrAge, thrRhr, thrIntensity]);
  const calculatedMap = useMemo(() => {
    return Math.round(bpDia + (1 / 3) * (bpSys - bpDia));
  }, [bpSys, bpDia]);
  const calculatedPulsePressure = useMemo(() => {
    return bpSys - bpDia;
  }, [bpSys, bpDia]);
  const calculatedHrr = useMemo(() => {
    return hrrPeak - hrr1Min;
  }, [hrrPeak, hrr1Min]);
  const calculatedMaxHr = useMemo(() => {
    return Math.round(208 - 0.7 * maxHrAge);
  }, [maxHrAge]);
  const calculatedSleepDebt = useMemo(() => {
    return parseFloat((sleepReq - sleepAct).toFixed(1));
  }, [sleepReq, sleepAct]);
  const calculatedOvu = useMemo(() => {
    const d = new Date(ovuLmp || '2026-05-15');
    d.setDate(d.getDate() + (ovuCycle - 14));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [ovuLmp, ovuCycle]);
  const calculatedHcg = useMemo(() => {
    if (hcg1 <= 0 || hcg2 <= 0 || hcg1 >= hcg2) return 0;
    return parseFloat(((hcgHours * Math.log(2)) / Math.log(hcg2 / hcg1)).toFixed(1));
  }, [hcg1, hcg2, hcgHours]);"""
content = content.replace("  const calculated1RM = useMemo(() => {\n    return Math.round(liftWeight * (1 + 0.0333 * liftReps));\n  }, [liftWeight, liftReps]);", calc_insert)

# 3. Add to the modal titles
title_insert = """                  {activeModal === '1rm' && '1RM One-Rep Max Calculator'}
                  {activeModal === 'macros' && 'Macro Splitter'}
                  {activeModal === 'lean-mass' && 'Lean Body Mass'}
                  {activeModal === 'mets' && 'METs Calories Burned'}
                  {activeModal === 'running-pace' && 'Running Pace'}
                  {activeModal === 'ftp' && 'Cycling FTP'}
                  {activeModal === 'rucking' && 'Rucking Calorie Burn'}
                  {activeModal === 'thr' && 'Target Heart Rate'}
                  {activeModal === 'map' && 'Mean Arterial Pressure (MAP)'}
                  {activeModal === 'hrr' && 'Heart Rate Recovery (HRR)'}
                  {activeModal === 'pulse-pressure' && 'Pulse Pressure'}
                  {activeModal === 'max-hr' && 'Maximum Heart Rate'}
                  {activeModal === 'sleep-debt' && 'Sleep Debt Accumulator'}
                  {activeModal === 'ess' && 'Daytime Sleepiness Scale (ESS)'}
                  {activeModal === 'ovulation' && 'Ovulation Window'}
                  {activeModal === 'hcg' && 'Beta hCG Doubling Time'}"""
content = content.replace("                  {activeModal === '1rm' && '1RM One-Rep Max Calculator'}", title_insert)

# 4. Replace the array of supported tools in the fallback condition
supported_tools = "'bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm', 'macros', 'lean-mass', 'mets', 'running-pace', 'ftp', 'rucking', 'thr', 'map', 'hrr', 'pulse-pressure', 'max-hr', 'sleep-debt', 'ess', 'ovulation', 'hcg'"
content = content.replace("!['bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm'].includes(activeModal)", f"![{supported_tools}].includes(activeModal)")


# 5. Add Modal Body Blocks before general fallback
modal_body_insert = """            {/* 1RM Strength Modal Body */}
            {activeModal === '1rm' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Weight Lifted (kg / lbs)</label>
                    <input
                      type="number"
                      value={liftWeight}
                      onChange={(e) => setLiftWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Reps Completed</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={liftReps}
                      onChange={(e) => setLiftReps(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Estimated 1RM (Epley Standard)</span>
                    <div className="text-2xl font-bold text-amber-600">{calculated1RM} kg</div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 rounded-full">
                    Strength Spec
                  </span>
                </div>
                <Link
                  href="/health/1rm"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Strength Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Macros */}
            {activeModal === 'macros' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Daily Target Calories</label>
                  <input type="number" value={macroCalories} onChange={(e) => setMacroCalories(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-on-surface-variant">Protein</span>
                      <div className="text-xl font-bold text-primary">{calculatedMacros.p}g</div>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Carbs</span>
                      <div className="text-xl font-bold text-primary">{calculatedMacros.c}g</div>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Fat</span>
                      <div className="text-xl font-bold text-primary">{calculatedMacros.f}g</div>
                    </div>
                  </div>
                </div>
                <Link href="/health/macros" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Lean Mass */}
            {activeModal === 'lean-mass' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Weight</label>
                    <input type="number" value={lmWeight} onChange={(e) => setLmWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Body Fat %</label>
                    <input type="number" value={lmFat} onChange={(e) => setLmFat(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Lean Body Mass</span>
                    <div className="text-2xl font-bold text-primary">{calculatedLeanMass} kg</div>
                  </div>
                </div>
                <Link href="/health/lean-mass" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* METs */}
            {activeModal === 'mets' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Weight</label>
                    <input type="number" value={metsWeight} onChange={(e) => setMetsWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">MET</label>
                    <input type="number" value={metsValue} onChange={(e) => setMetsValue(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Minutes</label>
                    <input type="number" value={metsDuration} onChange={(e) => setMetsDuration(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Calories Burned</span>
                    <div className="text-2xl font-bold text-primary">{calculatedMets} kcal</div>
                  </div>
                </div>
                <Link href="/health/mets" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Running Pace */}
            {activeModal === 'running-pace' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Distance (km)</label>
                    <input type="number" value={paceDist} onChange={(e) => setPaceDist(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Time (mins)</label>
                    <input type="number" value={paceTime} onChange={(e) => setPaceTime(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Pace</span>
                    <div className="text-2xl font-bold text-primary">{calculatedPace} /km</div>
                  </div>
                </div>
                <Link href="/health/running-pace" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* FTP */}
            {activeModal === 'ftp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">20-Min Avg Power (W)</label>
                  <input type="number" value={ftpPower} onChange={(e) => setFtpPower(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Estimated FTP</span>
                    <div className="text-2xl font-bold text-primary">{calculatedFtp} W</div>
                  </div>
                </div>
                <Link href="/health/ftp" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Rucking */}
            {activeModal === 'rucking' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Body Weight (kg)</label>
                    <input type="number" value={ruckWeight} onChange={(e) => setRuckWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Pack Weight (kg)</label>
                    <input type="number" value={ruckPack} onChange={(e) => setRuckPack(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Est. Calories Burned (30 min flat)</span>
                    <div className="text-2xl font-bold text-primary">{calculatedRucking} kcal</div>
                  </div>
                </div>
                <Link href="/health/rucking" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* THR */}
            {activeModal === 'thr' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Age</label>
                    <input type="number" value={thrAge} onChange={(e) => setThrAge(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Resting HR</label>
                    <input type="number" value={thrRhr} onChange={(e) => setThrRhr(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Intensity %</label>
                    <input type="number" value={thrIntensity} onChange={(e) => setThrIntensity(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Target Heart Rate</span>
                    <div className="text-2xl font-bold text-primary">{calculatedThr} BPM</div>
                  </div>
                </div>
                <Link href="/health/thr" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* MAP & Pulse Pressure */}
            {(activeModal === 'map' || activeModal === 'pulse-pressure') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Systolic</label>
                    <input type="number" value={bpSys} onChange={(e) => setBpSys(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Diastolic</label>
                    <input type="number" value={bpDia} onChange={(e) => setBpDia(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">
                      {activeModal === 'map' ? 'Mean Arterial Pressure' : 'Pulse Pressure'}
                    </span>
                    <div className="text-2xl font-bold text-primary">
                      {activeModal === 'map' ? calculatedMap : calculatedPulsePressure} mmHg
                    </div>
                  </div>
                </div>
                <Link href={`/health/${activeModal}`} className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* HRR */}
            {activeModal === 'hrr' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Peak HR (End of Exercise)</label>
                    <input type="number" value={hrrPeak} onChange={(e) => setHrrPeak(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">HR at 1-Min Post</label>
                    <input type="number" value={hrr1Min} onChange={(e) => setHrr1Min(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Heart Rate Recovery</span>
                    <div className="text-2xl font-bold text-primary">{calculatedHrr} BPM Drop</div>
                  </div>
                </div>
                <Link href="/health/hrr" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Max HR */}
            {activeModal === 'max-hr' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Age</label>
                  <input type="number" value={maxHrAge} onChange={(e) => setMaxHrAge(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Est. Max Heart Rate</span>
                    <div className="text-2xl font-bold text-primary">{calculatedMaxHr} BPM</div>
                  </div>
                </div>
                <Link href="/health/max-hr" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Sleep Debt */}
            {activeModal === 'sleep-debt' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Required Sleep (hrs)</label>
                    <input type="number" step="0.5" value={sleepReq} onChange={(e) => setSleepReq(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Actual Sleep (hrs)</label>
                    <input type="number" step="0.5" value={sleepAct} onChange={(e) => setSleepAct(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Daily Sleep Debt</span>
                    <div className="text-2xl font-bold text-primary">{calculatedSleepDebt} hrs</div>
                  </div>
                </div>
                <Link href="/health/sleep-debt" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* ESS */}
            {activeModal === 'ess' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Total ESS Score (0-24)</label>
                  <input type="number" min="0" max="24" value={essScore} onChange={(e) => setEssScore(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Result</span>
                    <div className="text-xl font-bold text-primary">
                      {essScore <= 5 ? 'Lower Normal' : essScore <= 10 ? 'Higher Normal' : essScore <= 12 ? 'Mild Sleepiness' : essScore <= 15 ? 'Moderate' : 'Severe Sleepiness'}
                    </div>
                  </div>
                </div>
                <Link href="/health/ess" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Ovulation */}
            {activeModal === 'ovulation' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Last Period (LMP)</label>
                    <input type="date" value={ovuLmp} onChange={(e) => setOvuLmp(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Cycle Length</label>
                    <input type="number" value={ovuCycle} onChange={(e) => setOvuCycle(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Est. Ovulation</span>
                    <div className="text-2xl font-bold text-primary">{calculatedOvu}</div>
                  </div>
                </div>
                <Link href="/health/ovulation" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* hCG */}
            {activeModal === 'hcg' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">hCG 1</label>
                    <input type="number" value={hcg1} onChange={(e) => setHcg1(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">hCG 2</label>
                    <input type="number" value={hcg2} onChange={(e) => setHcg2(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Hours Diff</label>
                    <input type="number" value={hcgHours} onChange={(e) => setHcgHours(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Doubling Time</span>
                    <div className="text-2xl font-bold text-primary">{calculatedHcg} hours</div>
                  </div>
                </div>
                <Link href="/health/hcg" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}
"""
content = content.replace("            {/* 1RM Strength Modal Body */}\n            {activeModal === '1rm' && (", modal_body_insert)

with open('app/health/HealthClient.tsx', 'w') as f:
    f.write(content)
