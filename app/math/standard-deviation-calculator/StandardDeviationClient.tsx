'use client';

import React, { useState, useMemo } from 'react';

export default function StandardDeviationClient() {
  const [input, setInput] = useState('10, 12, 23, 23, 16, 23, 21, 16');
  const [type, setType] = useState<'sample' | 'population'>('sample');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // Parse input
    const rawValues = input.split(/[\s,]+/).map(v => v.trim()).filter(v => v !== '');
    const numbers = rawValues.map(Number).filter(n => !isNaN(n));
    
    if (numbers.length === 0) return null;
    if (type === 'sample' && numbers.length < 2) return { error: 'Sample requires at least 2 numbers.' };
    
    const n = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    const deviations = numbers.map(num => num - mean);
    const squaredDeviations = deviations.map(d => d * d);
    const sumOfSquares = squaredDeviations.reduce((a, b) => a + b, 0);
    
    const variance = type === 'sample' ? sumOfSquares / (n - 1) : sumOfSquares / n;
    const stdDev = Math.sqrt(variance);
    const standardError = stdDev / Math.sqrt(n);
    
    // Sort for median/range
    const sorted = [...numbers].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    
    return {
      n,
      sum,
      mean,
      variance,
      stdDev,
      standardError,
      sumOfSquares,
      min,
      max,
      range,
      numbers,
      deviations,
      squaredDeviations
    };
  }, [input, type]);

  const handleCopy = () => {
    if (!results || 'error' in results) return;
    const text = `Standard Deviation: ${results.stdDev.toFixed(4)}\nVariance: ${results.variance.toFixed(4)}\nMean: ${results.mean.toFixed(4)}\nCount (N): ${results.n}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm mb-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2" htmlFor="dataset">
              Enter Data Set (comma or space separated)
            </label>
            <textarea
              id="dataset"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-2xl bg-surface-container text-base font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent transition-shadow resize-y"
              placeholder="e.g., 5, 10, 15, 20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">
              Data Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('sample')}
                className={`py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                  type === 'sample' 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">science</span>
                Sample
              </button>
              <button
                type="button"
                onClick={() => setType('population')}
                className={`py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                  type === 'population' 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">groups</span>
                Population
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 px-1">
              {type === 'sample' ? 'Use Sample (N-1) when your data is a subset of a larger population.' : 'Use Population (N) when your data represents the entire population.'}
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Results
            </h3>
            <button
              onClick={handleCopy}
              disabled={!results || ('error' in results)}
              className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-50"
              title="Copy Results"
            >
              <span className="material-symbols-outlined text-[20px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>

          {!results ? (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">
              Please enter valid numerical data.
            </div>
          ) : 'error' in results ? (
            <div className="flex-1 flex items-center justify-center text-error font-medium bg-error-container/20 rounded-xl p-4 text-center border border-error/30">
              {results.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2 bg-primary-container p-4 rounded-xl border border-primary/20">
                <div className="text-sm font-semibold text-on-primary-container mb-1">Standard Deviation (s)</div>
                <div className="text-3xl font-bold text-on-surface tracking-tight">
                  {results.stdDev.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>
              
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                <div className="text-xs font-semibold text-on-surface-variant mb-1">Variance (s²)</div>
                <div className="text-xl font-bold text-on-surface">
                  {results.variance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>
              
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                <div className="text-xs font-semibold text-on-surface-variant mb-1">Mean (μ)</div>
                <div className="text-xl font-bold text-on-surface">
                  {results.mean.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                <div className="text-xs font-semibold text-on-surface-variant mb-1">Count (N)</div>
                <div className="text-xl font-bold text-on-surface">
                  {results.n}
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                <div className="text-xs font-semibold text-on-surface-variant mb-1">Sum (Σx)</div>
                <div className="text-xl font-bold text-on-surface">
                  {results.sum.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Breakdown */}
      {results && !('error' in results) && (
        <div className="mt-8 pt-8 border-t border-outline-variant/30">
          <h4 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">functions</span>
            Step-by-Step Calculation
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-outline-variant/40">
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">Value (x)</th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">Mean (μ)</th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">Deviation (x - μ)</th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">Squared Dev (x - μ)²</th>
                </tr>
              </thead>
              <tbody>
                {results.numbers.slice(0, 10).map((num, i) => (
                  <tr key={i} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                    <td className="py-2 px-4 text-on-surface">{num}</td>
                    <td className="py-2 px-4 text-on-surface-variant">{results.mean.toFixed(2)}</td>
                    <td className="py-2 px-4 text-on-surface-variant">{results.deviations[i].toFixed(2)}</td>
                    <td className="py-2 px-4 font-medium text-on-surface">{results.squaredDeviations[i].toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface-container font-semibold">
                  <td className="py-3 px-4 text-on-surface">Sum = {results.sum.toFixed(2)}</td>
                  <td colSpan={2}></td>
                  <td className="py-3 px-4 text-on-surface">Sum of Squares = {results.sumOfSquares.toFixed(4)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {results.n > 10 && (
            <p className="text-sm text-on-surface-variant mt-3 text-center italic">
              Showing first 10 rows of {results.n} total values.
            </p>
          )}

          <div className="mt-6 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20">
            <p className="text-on-surface font-body-md mb-2">
              <strong>1. Calculate the Mean:</strong> Sum of all values ({results.sum.toFixed(2)}) ÷ {results.n} = {results.mean.toFixed(4)}
            </p>
            <p className="text-on-surface font-body-md mb-2">
              <strong>2. Find Squared Deviations:</strong> Subtract the mean from each value and square the result, then sum them up = {results.sumOfSquares.toFixed(4)}
            </p>
            <p className="text-on-surface font-body-md mb-2">
              <strong>3. Calculate Variance:</strong> Sum of Squares ÷ {type === 'sample' ? `(N-1) i.e., ${results.n - 1}` : `N i.e., ${results.n}`} = {results.variance.toFixed(4)}
            </p>
            <p className="text-on-surface font-body-md">
              <strong>4. Calculate Standard Deviation:</strong> √Variance = {results.stdDev.toFixed(4)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
