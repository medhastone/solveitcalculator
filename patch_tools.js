const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Insert State Variables
const stateVars = `
  const [ibwHeight, setIbwHeight] = useState<number>(178);
  const [ibwGender, setIbwGender] = useState<'male' | 'female'>('male');
  const [ffmiWeight, setFfmiWeight] = useState<number>(75);
  const [ffmiFat, setFfmiFat] = useState<number>(15);
  const [ffmiHeight, setFfmiHeight] = useState<number>(178);
  const [whrWaist, setWhrWaist] = useState<number>(82);
  const [whrHip, setWhrHip] = useState<number>(95);
  const [whrGender, setWhrGender] = useState<'male' | 'female'>('male');
  const [whtrWaist, setWhtrWaist] = useState<number>(82);
  const [whtrHeight, setWhtrHeight] = useState<number>(178);
  const [bsaHeight, setBsaHeight] = useState<number>(178);
  const [bsaWeight, setBsaWeight] = useState<number>(75);
  const [absiWaist, setAbsiWaist] = useState<number>(82);
  const [absiWeight, setAbsiWeight] = useState<number>(75);
  const [absiHeight, setAbsiHeight] = useState<number>(178);
  const [deficitTdee, setDeficitTdee] = useState<number>(2500);
  const [deficitGoal, setDeficitGoal] = useState<'loss' | 'gain'>('loss');
  const [deficitRate, setDeficitRate] = useState<number>(0.5);
  const [proteinWeight, setProteinWeight] = useState<number>(75);
  const [proteinGoal, setProteinGoal] = useState<'maintenance' | 'muscle'>('muscle');
  const [carbTdee, setCarbTdee] = useState<number>(2500);
  const [carbType, setCarbType] = useState<'high' | 'low'>('high');
  const [ketoTdee, setKetoTdee] = useState<number>(2000);
  const [ketoNetCarb, setKetoNetCarb] = useState<number>(25);
  const [velocityWeight, setVelocityWeight] = useState<number>(80);
  const [velocityGoal, setVelocityGoal] = useState<number>(75);
  const [velocityWeeks, setVelocityWeeks] = useState<number>(12);
`;

content = content.replace('const [hcgHours, setHcgHours] = useState<number>(48);', 'const [hcgHours, setHcgHours] = useState<number>(48);' + stateVars);

// 2. Insert Calculations
const calculations = `
  const calculatedIbw = ibwGender === 'male' ? 50 + 0.91 * (ibwHeight - 152.4) : 45.5 + 0.91 * (ibwHeight - 152.4);
  const ibwStr = Math.max(0, calculatedIbw).toFixed(1);

  const calculatedFfmi = (ffmiWeight * (1 - ffmiFat / 100)) / ((ffmiHeight / 100) ** 2);
  const ffmiStr = Math.max(0, calculatedFfmi).toFixed(1);

  const calculatedWhr = whrWaist / (whrHip || 1);
  const whrStr = calculatedWhr.toFixed(2);
  const whrStatus = whrGender === 'male' ? (calculatedWhr < 0.9 ? 'Low Risk' : 'High Risk') : (calculatedWhr < 0.85 ? 'Low Risk' : 'High Risk');

  const calculatedWhtr = whtrWaist / whtrHeight;
  const whtrStr = calculatedWhtr.toFixed(2);

  const calculatedBsa = Math.sqrt((bsaHeight * bsaWeight) / 3600);
  const bsaStr = calculatedBsa.toFixed(2);

  const bmiForAbsi = absiWeight / ((absiHeight / 100) ** 2);
  const calculatedAbsi = (absiWaist / 100) / (Math.pow(bmiForAbsi, 2/3) * Math.pow(absiHeight / 100, 1/2));
  const absiStr = isFinite(calculatedAbsi) ? calculatedAbsi.toFixed(4) : '0.0000';

  const deficitTarget = deficitTdee + (deficitGoal === 'loss' ? -1 : 1) * (deficitRate * 7700 / 7);
  const deficitStr = deficitTarget.toFixed(0);

  const proteinRda = proteinWeight * (proteinGoal === 'maintenance' ? 0.8 : 2.0);
  const proteinStr = proteinRda.toFixed(0);

  const carbCal = carbTdee * (carbType === 'high' ? 0.5 : 0.2);
  const carbGrams = (carbCal / 4).toFixed(0);

  const ketoFatGrams = ((ketoTdee - (ketoNetCarb * 4) - (ketoTdee * 0.2)) / 9).toFixed(0);
  const ketoProteinGrams = ((ketoTdee * 0.2) / 4).toFixed(0);

  const velocityLossPerWeek = (velocityWeight - velocityGoal) / (velocityWeeks || 1);
  const velocityCalDeficit = velocityLossPerWeek * 7700 / 7;
  const velocityStr = velocityCalDeficit.toFixed(0);
`;

content = content.replace('// Return functions', calculations + '\n  // Return functions');

// 3. Insert Modal Titles
const modalTitles = `
                  {activeModal === 'ibw' && 'Ideal Body Weight (IBW)'}
                  {activeModal === 'ffmi' && 'Fat-Free Mass Index (FFMI)'}
                  {activeModal === 'whr' && 'Waist-to-Hip Ratio'}
                  {activeModal === 'whtr' && 'Waist-to-Height Ratio'}
                  {activeModal === 'bsa' && 'Body Surface Area (BSA)'}
                  {activeModal === 'absi' && 'A Body Shape Index (ABSI)'}
                  {activeModal === 'deficit' && 'Calorie Deficit & Surplus Planner'}
                  {activeModal === 'protein-rda' && 'Protein RDA & Hypertrophy'}
                  {activeModal === 'carb-cycling' && 'Carbohydrate Cycling'}
                  {activeModal === 'keto' && 'Keto Net Carb & Fat Matrix'}
                  {activeModal === 'velocity' && 'Weight Loss Velocity Simulator'}`;

content = content.replace("{activeModal === 'hcg' && 'Beta hCG Doubling Time'}", "{activeModal === 'hcg' && 'Beta hCG Doubling Time'}" + modalTitles);

// 4. Insert Modal JSX bodies
const modalJSX = `
            {activeModal === 'ibw' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Height (cm)</label>
                    <input type="number" value={ibwHeight} onChange={e => setIbwHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Gender</label>
                    <select value={ibwGender} onChange={e => setIbwGender(e.target.value as 'male' | 'female')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Ideal Body Weight</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{ibwStr} kg</div>
                </div>
              </div>
            )}
            
            {activeModal === 'ffmi' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Weight (kg)</label>
                    <input type="number" value={ffmiWeight} onChange={e => setFfmiWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Body Fat (%)</label>
                    <input type="number" value={ffmiFat} onChange={e => setFfmiFat(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Height (cm)</label>
                    <input type="number" value={ffmiHeight} onChange={e => setFfmiHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Fat-Free Mass Index</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{ffmiStr}</div>
                  <div className="text-sm mt-1 text-slate-500">Natural Limit ≈ 25.0</div>
                </div>
              </div>
            )}
            
            {activeModal === 'whr' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Waist (cm)</label>
                    <input type="number" value={whrWaist} onChange={e => setWhrWaist(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Hip (cm)</label>
                    <input type="number" value={whrHip} onChange={e => setWhrHip(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Gender</label>
                    <select value={whrGender} onChange={e => setWhrGender(e.target.value as 'male' | 'female')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Waist-to-Hip Ratio</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{whrStr}</div>
                  <div className="text-sm mt-1 text-slate-500">Status: {whrStatus}</div>
                </div>
              </div>
            )}
            
            {activeModal === 'whtr' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Waist (cm)</label>
                    <input type="number" value={whtrWaist} onChange={e => setWhtrWaist(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Height (cm)</label>
                    <input type="number" value={whtrHeight} onChange={e => setWhtrHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Waist-to-Height Ratio</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{whtrStr}</div>
                  <div className="text-sm mt-1 text-slate-500">Goal: Keep under 0.50</div>
                </div>
              </div>
            )}

            {activeModal === 'bsa' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Height (cm)</label>
                    <input type="number" value={bsaHeight} onChange={e => setBsaHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Weight (kg)</label>
                    <input type="number" value={bsaWeight} onChange={e => setBsaWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Body Surface Area (Du Bois)</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{bsaStr} m²</div>
                </div>
              </div>
            )}

            {activeModal === 'absi' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Waist (cm)</label>
                    <input type="number" value={absiWaist} onChange={e => setAbsiWaist(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Weight (kg)</label>
                    <input type="number" value={absiWeight} onChange={e => setAbsiWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Height (cm)</label>
                    <input type="number" value={absiHeight} onChange={e => setAbsiHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">A Body Shape Index (ABSI)</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{absiStr}</div>
                </div>
              </div>
            )}
            
            {activeModal === 'deficit' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">TDEE (kcal)</label>
                    <input type="number" value={deficitTdee} onChange={e => setDeficitTdee(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Goal</label>
                    <select value={deficitGoal} onChange={e => setDeficitGoal(e.target.value as 'loss' | 'gain')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="loss">Weight Loss</option>
                      <option value="gain">Weight Gain</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Rate (kg/wk)</label>
                    <select value={deficitRate} onChange={e => setDeficitRate(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="0.25">0.25 kg/wk</option>
                      <option value="0.5">0.5 kg/wk</option>
                      <option value="1">1.0 kg/wk</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Target Daily Calories</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{deficitStr} kcal</div>
                </div>
              </div>
            )}

            {activeModal === 'protein-rda' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Weight (kg)</label>
                    <input type="number" value={proteinWeight} onChange={e => setProteinWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Goal</label>
                    <select value={proteinGoal} onChange={e => setProteinGoal(e.target.value as 'maintenance' | 'muscle')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="maintenance">Maintenance (RDA)</option>
                      <option value="muscle">Muscle Hypertrophy</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Target Daily Protein</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{proteinStr} g</div>
                </div>
              </div>
            )}

            {activeModal === 'carb-cycling' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">TDEE (kcal)</label>
                    <input type="number" value={carbTdee} onChange={e => setCarbTdee(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Day Type</label>
                    <select value={carbType} onChange={e => setCarbType(e.target.value as 'high' | 'low')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="high">High Carb (Training)</option>
                      <option value="low">Low Carb (Rest)</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Target Carbohydrates</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{carbGrams} g</div>
                  <div className="text-sm mt-1 text-slate-500">{carbCal.toFixed(0)} kcal from carbs</div>
                </div>
              </div>
            )}
            
            {activeModal === 'keto' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">TDEE (kcal)</label>
                    <input type="number" value={ketoTdee} onChange={e => setKetoTdee(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Net Carbs Target (g)</label>
                    <input type="number" value={ketoNetCarb} onChange={e => setKetoNetCarb(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Keto Macronutrients</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{ketoNetCarb}g</div>
                      <div className="text-xs text-slate-500">Net Carbs</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{ketoProteinGrams}g</div>
                      <div className="text-xs text-slate-500">Protein</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{ketoFatGrams}g</div>
                      <div className="text-xs text-slate-500">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeModal === 'velocity' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Current (kg)</label>
                    <input type="number" value={velocityWeight} onChange={e => setVelocityWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Target (kg)</label>
                    <input type="number" value={velocityGoal} onChange={e => setVelocityGoal(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Weeks</label>
                    <input type="number" value={velocityWeeks} onChange={e => setVelocityWeeks(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Required Daily Caloric Deficit</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{velocityStr} kcal/day</div>
                </div>
              </div>
            )}`;

content = content.replace("{activeModal === 'hcg' && (", modalJSX + "\n\n            {activeModal === 'hcg' && (");

fs.writeFileSync(file, content);
console.log('Patched');
