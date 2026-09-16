'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Unit, UNITS } from '@/lib/unit-data';

interface Props {
  initialFrom: Unit;
  initialTo: Unit;
  slug: string;
}

export default function DynamicConverterClient({ initialFrom, initialTo, slug }: Props) {
  const router = useRouter();
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  
  const [currentFrom, setCurrentFrom] = useState<Unit>(initialFrom);
  const [currentTo, setCurrentTo] = useState<Unit>(initialTo);

  useEffect(() => {
    setCurrentFrom(initialFrom);
    setCurrentTo(initialTo);
  }, [initialFrom, initialTo]);

  const ratio = currentFrom.baseFactor / currentTo.baseFactor;

  useEffect(() => {
    const val = parseFloat(fromValue);
    if (!isNaN(val)) {
      setToValue((val * ratio).toLocaleString('en-US', { maximumFractionDigits: 6 }));
    } else {
      setToValue('');
    }
  }, [fromValue, ratio, currentFrom, currentTo]);

  const handleToValueChange = (val: string) => {
    setToValue(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setFromValue((num / ratio).toLocaleString('en-US', { maximumFractionDigits: 6 }));
    } else {
      setFromValue('');
    }
  };

  const handleUnitChange = (type: 'from' | 'to', unitId: string) => {
    const newFromId = type === 'from' ? unitId : currentFrom.id;
    const newToId = type === 'to' ? unitId : currentTo.id;
    
    const newFrom = UNITS.find(u => u.id === newFromId);
    const newTo = UNITS.find(u => u.id === newToId);
    
    if (newFrom && newTo && newFrom.id !== newTo.id) {
       router.push(`/conversion/${newFrom.id}-to-${newTo.id}`);
    }
  };

  const copyToClipboard = () => {
    const text = `${fromValue} ${currentFrom.symbol} = ${toValue} ${currentTo.symbol}`;
    navigator.clipboard.writeText(text);
  };

  const generateTableData = () => {
    const bases = [1, 5, 10, 25, 50, 100, 500, 1000];
    return bases.map(base => ({
      from: base,
      to: (base * ratio).toLocaleString('en-US', { maximumFractionDigits: 6 })
    }));
  };

  const tableData = generateTableData();
  const availableUnits = UNITS.filter(u => u.category === currentFrom.category);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full bg-surface-container-low border-b border-outline-variant/10 py-space-xs sticky top-16 z-40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center gap-space-xs font-data-mono text-body-sm text-on-surface-variant">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto text-body-sm whitespace-nowrap">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>Home
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface-variant cursor-default">Conversion</span>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-semibold">{currentFrom.nameSingular} to {currentTo.nameSingular}</span>
              </nav>
            </div>
          </div>

          <section className="w-full bg-surface py-space-xl px-gutter-mobile md:px-gutter-desktop">
            <div className="max-w-max-width-canvas mx-auto flex flex-col lg:flex-row gap-space-xl">
              
              <div className="flex-1 w-full max-w-4xl mx-auto">
                <div className="text-center mb-space-xl">
                  <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">{currentFrom.nameSingular} to {currentTo.nameSingular} Converter</h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">Convert {currentFrom.namePlural.toLowerCase()} to {currentTo.namePlural.toLowerCase()} instantly.</p>
                </div>

                <div className="bg-surface-container-low p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 mb-space-xl max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md items-center mb-space-md">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">From</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="w-1/2 px-4 py-3 bg-surface rounded-xl font-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                          value={fromValue}
                          onChange={(e) => setFromValue(e.target.value)}
                        />
                        <select 
                          className="w-1/2 px-2 py-3 bg-surface rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                          value={currentFrom.id}
                          onChange={(e) => handleUnitChange('from', e.target.value)}
                        >
                          {availableUnits.map(u => (
                            <option key={u.id} value={u.id}>{u.namePlural} ({u.symbol})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">To</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="w-1/2 px-4 py-3 bg-surface rounded-xl font-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                          value={toValue}
                          onChange={(e) => handleToValueChange(e.target.value)}
                        />
                         <select 
                          className="w-1/2 px-2 py-3 bg-surface rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                          value={currentTo.id}
                          onChange={(e) => handleUnitChange('to', e.target.value)}
                        >
                          {availableUnits.map(u => (
                            <option key={u.id} value={u.id}>{u.namePlural} ({u.symbol})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/30">
                    <span className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Result</span>
                    <div className="font-data-mono text-[24px] text-primary font-bold mb-2">
                      {fromValue || '0'} {currentFrom.symbol} = {toValue || '0'} {currentTo.symbol}
                    </div>

                    <div className="flex justify-between items-center">
                      <button className="text-primary font-medium hover:underline text-body-sm flex items-center gap-1" onClick={() => document.getElementById('how-to')?.scrollIntoView({ behavior: 'smooth' })}>
                        View formula <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                      <button onClick={copyToClipboard} className="p-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors" title="Copy Result">
                        <span className="material-symbols-outlined text-on-surface">content_copy</span>
                      </button>
                    </div>
                  </div>
                </div>

                <article className="prose prose-lg max-w-none text-on-surface prose-headings:text-on-surface prose-a:text-primary prose-strong:text-on-surface">
                  <h2 id="how-to">How to Convert {currentFrom.namePlural} to {currentTo.namePlural}</h2>
                  <p>
                    To convert a measurement in {currentFrom.namePlural.toLowerCase()} to a measurement in {currentTo.namePlural.toLowerCase()}, multiply the value by the following conversion ratio: <strong>{ratio.toPrecision(6)} {currentTo.namePlural.toLowerCase()}/{currentFrom.nameSingular.toLowerCase()}</strong>.
                  </p>
                  
                  <div className="bg-surface-container p-4 rounded-xl font-data-mono text-center my-6 text-[18px] font-bold text-primary shadow-sm border border-outline-variant/20">
                    {currentTo.namePlural.toLowerCase()} = {currentFrom.namePlural.toLowerCase()} × {ratio.toPrecision(6)}
                  </div>
                  
                  <h3 className="mt-8">Worked Examples</h3>
                  <ul className="list-none pl-0 space-y-4">
                    {[100, 500, 1000].map(val => (
                      <li key={val} className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/30">
                        <div className="font-semibold mb-1">{val} {currentFrom.namePlural.toLowerCase()} to {currentTo.namePlural.toLowerCase()}:</div>
                        <div className="font-data-mono text-primary text-sm">{val} {currentFrom.symbol} × {ratio.toPrecision(6)} = {(val * ratio).toLocaleString('en-US', { maximumFractionDigits: 6 })} {currentTo.symbol}</div>
                      </li>
                    ))}
                  </ul>

                  <h2 className="mt-12">What Is a {currentFrom.nameSingular}?</h2>
                  <p>{currentFrom.description || `The ${currentFrom.nameSingular.toLowerCase()} is a unit of ${currentFrom.category}.`}</p>

                  <h2 className="mt-12">What Is a {currentTo.nameSingular}?</h2>
                  <p>{currentTo.description || `The ${currentTo.nameSingular.toLowerCase()} is a unit of ${currentTo.category}.`}</p>

                  <h2 className="mt-12">{currentFrom.nameSingular} to {currentTo.nameSingular} Conversion Table</h2>
                  
                  <div className="overflow-x-auto my-6 border border-outline-variant/30 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low">
                          <th className="p-4 border-b border-outline-variant/30 font-semibold">{currentFrom.namePlural} ({currentFrom.symbol})</th>
                          <th className="p-4 border-b border-outline-variant/30 font-semibold">{currentTo.namePlural} ({currentTo.symbol})</th>
                        </tr>
                      </thead>
                      <tbody className="font-data-mono text-body-sm">
                        {tableData.map((row, i) => (
                          <tr key={i} className="hover:bg-surface-container-lowest/50 border-b border-outline-variant/20 last:border-0 transition-colors">
                            <td className="p-4 border-r border-outline-variant/20">{row.from} {currentFrom.symbol}</td>
                            <td className="p-4">{row.to} {currentTo.symbol}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <h2 className="mt-12">Frequently Asked Questions</h2>
                  <div className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold m-0">How many {currentTo.namePlural.toLowerCase()} are in a {currentFrom.nameSingular.toLowerCase()}?</h3>
                      <p className="mt-2">There are {ratio.toPrecision(6)} {currentTo.namePlural.toLowerCase()} in one {currentFrom.nameSingular.toLowerCase()}.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold m-0">How do you convert {currentFrom.namePlural.toLowerCase()} to {currentTo.namePlural.toLowerCase()}?</h3>
                      <p className="mt-2">Multiply the number of {currentFrom.namePlural.toLowerCase()} by {ratio.toPrecision(6)}.</p>
                    </div>
                  </div>

                </article>

              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0 pt-16 lg:pt-0">
                 <div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 mb-space-md">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Related Conversions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2">Convert from {currentFrom.namePlural}</h4>
                        <ul className="space-y-2 text-body-sm text-primary">
                          {availableUnits.filter(u => u.id !== currentFrom.id && u.id !== currentTo.id).slice(0, 5).map(u => (
                            <li key={u.id}>
                              <Link href={`/conversion/${currentFrom.id}-to-${u.id}`} className="hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span> {currentFrom.namePlural.toLowerCase()} to {u.namePlural.toLowerCase()}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2">Convert to {currentTo.namePlural}</h4>
                        <ul className="space-y-2 text-body-sm text-primary">
                          {availableUnits.filter(u => u.id !== currentTo.id && u.id !== currentFrom.id).slice(0, 5).map(u => (
                            <li key={u.id}>
                              <Link href={`/conversion/${u.id}-to-${currentTo.id}`} className="hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span> {u.namePlural.toLowerCase()} to {currentTo.namePlural.toLowerCase()}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                 </div>
              </div>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
