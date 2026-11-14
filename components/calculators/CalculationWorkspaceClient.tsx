'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ChevronRight,
  Copy,
  Check,
  Trash2,
  Download,
  RotateCcw,
  PlusCircle,
  CornerDownLeft,
  Pencil,
  BookmarkPlus,
  AlertCircle,
  Info,
  Sparkles,
  History,
  Delete,
  ArrowUpRight,
} from 'lucide-react';
import {
  WORKSPACE_STORAGE_KEY,
  WORKSPACE_STORAGE_VERSION,
  MAX_HISTORY_RECORDS,
  evaluateWorkspaceExpression,
  createHistoryRecord,
  addRecordToHistory,
  updateHistoryRecordNote,
  deleteHistoryRecord,
  computeHistoryRunningTotal,
  exportHistoryToCsv,
  exportHistoryToText,
  formatWorkspaceNumber,
  WorkspaceHistoryRecord,
  NamedSubtotal,
  WorkspacePersistedState,
} from '@/lib/calculationWorkspaceEngine';

const QUICK_EXAMPLES = [
  { label: 'Add 8.5% Sales Tax', expr: '120 + 8.5%', note: 'Order + 8.5% tax' },
  { label: '20% Discount Off $250', expr: '250 - 20%', note: '20% promotional discount' },
  { label: 'Multi-Item Quantity', expr: '(45.50 * 3) + (19.99 * 2)', note: 'Supplies order' },
  { label: 'Split Bill 4 Ways + 18% Tip', expr: '(164 + 18%) / 4', note: 'Dinner per person' },
];

const RELATED_TOOLS = [
  {
    name: 'Scientific Calculator',
    description: 'Trigonometry, logarithms, powers, roots, factorials, and scientific notation.',
    href: '/math/scientific-calculator',
  },
  {
    name: 'Algebraic Equation Solver',
    description: 'Solve linear and quadratic equations step by step.',
    href: '/math/equation-solver',
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages of numbers, percentage increases, and proportions.',
    href: '/math/percentage-calculator',
  },
  {
    name: 'Discount & Sale Price Calculator',
    description: 'Compute markdowns, double discounts, and sales tax on retail purchases.',
    href: '/math/discount-calculator',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'Project long-term savings and investment compounding with regular deposits.',
    href: '/compound-interest-calculator',
  },
  {
    name: 'All-in-One Unit Converter',
    description: 'Convert length, weight, temperature, volume, area, speed, digital, and energy units.',
    href: '/conversions',
  },
];

export default function CalculationWorkspaceClient() {
  const [expression, setExpression] = useState<string>('120 + 15%');
  const [note, setNote] = useState<string>('Sample item with 15% tax');
  const [history, setHistory] = useState<WorkspaceHistoryRecord[]>([]);
  const [subtotals, setSubtotals] = useState<NamedSubtotal[]>([]);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false);

  // Editing & UI states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>('');
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [subtotalNameInput, setSubtotalNameInput] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted history & subtotals from versioned localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<WorkspacePersistedState>;
        if (parsed && Array.isArray(parsed.history)) {
          setHistory(parsed.history.slice(0, MAX_HISTORY_RECORDS));
        }
        if (parsed && Array.isArray(parsed.subtotals)) {
          setSubtotals(parsed.subtotals.slice(0, 25));
        }
      }
    } catch {
      setStorageWarning(
        'Browser storage is unavailable or restricted in this session. Calculations will work normally, but history will only persist until you close this tab.'
      );
    } finally {
      setHasLoadedStorage(true);
    }
  }, []);

  // Save to versioned localStorage whenever history or subtotals change
  useEffect(() => {
    if (!hasLoadedStorage || typeof window === 'undefined') return;
    try {
      const payload: WorkspacePersistedState = {
        version: WORKSPACE_STORAGE_VERSION,
        history: history.slice(0, MAX_HISTORY_RECORDS),
        subtotals: subtotals.slice(0, 25),
      };
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(payload));
      setStorageWarning(null);
    } catch {
      setStorageWarning(
        'Could not save history to local browser storage (storage quota may be full or disabled).'
      );
    }
  }, [history, subtotals, hasLoadedStorage]);

  // Live evaluation of the current expression
  const liveEval = useMemo(() => evaluateWorkspaceExpression(expression), [expression]);

  // Running total across all history records
  const runningTotal = useMemo(() => computeHistoryRunningTotal(history), [history]);

  const lastResult = history.length > 0 ? history[0].result : null;

  const triggerCopyFeedback = (id: string, textToCopy: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  // Calculate & Add to History
  const handleCalculateAndSave = () => {
    if (!liveEval.ok) return;
    const newRecord = createHistoryRecord({
      expression,
      evalResult: liveEval,
      note: note.trim(),
      sourceCalculator: 'Calculation Workspace',
    });
    setHistory((prev) => addRecordToHistory(prev, newRecord, MAX_HISTORY_RECORDS));
    setNote('');
    setConfirmClearAll(false);
  };

  // Insert token or value into the current expression nicely
  const insertIntoExpression = (snippet: string) => {
    setExpression((prev) => {
      const trimmed = prev.trimEnd();
      if (!trimmed) return snippet;
      const lastChar = trimmed[trimmed.length - 1];
      const snippetStartsWithOperator = /^[+\-*/×÷%)]/.test(snippet);
      const endsWithOperatorOrOpen = /[+\-*/×÷(]$/.test(lastChar);

      if (snippetStartsWithOperator || endsWithOperatorOrOpen) {
        return `${trimmed}${snippet}`;
      }
      // If both are numbers, separate with a '+' if user clicks "Reuse Result" on a complete number, or append digit if keypad
      return `${trimmed}${snippet}`;
    });
    inputRef.current?.focus();
  };

  // Reuse a previous numeric result in the expression
  const handleReuseValue = (val: number, operatorPrefix?: '+' | '-' | '*' | '/') => {
    const cleanStr = String(val);
    setExpression((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return cleanStr;
      if (operatorPrefix) {
        return `${trimmed} ${operatorPrefix} ${cleanStr}`;
      }
      // If current expression already ends with an operator or '(', append the value directly
      if (/[+\-*/×÷(]$/.test(trimmed)) {
        return `${trimmed} ${cleanStr}`;
      }
      // Otherwise append "+ value" so consecutive reuse builds a running calculation naturally
      return `${trimmed} + ${cleanStr}`;
    });
    inputRef.current?.focus();
  };

  // Save current live result or running total as a Named Subtotal
  const handleSaveNamedSubtotal = (customName?: string, customValue?: number) => {
    const targetVal =
      typeof customValue === 'number'
        ? customValue
        : liveEval.ok
        ? liveEval.result
        : null;
    if (targetVal === null || !Number.isFinite(targetVal)) return;

    const label =
      (customName ?? subtotalNameInput.trim()) ||
      note.trim() ||
      `Subtotal #${subtotals.length + 1}`;

    const newSub: NamedSubtotal = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: label,
      value: targetVal,
      formattedValue: formatWorkspaceNumber(targetVal),
      updatedAt: new Date().toISOString(),
    };
    setSubtotals((prev) => [newSub, ...prev].slice(0, 25));
    setSubtotalNameInput('');
  };

  const handleToggleSign = () => {
    setExpression((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return '-';
      if (trimmed.startsWith('-(') && trimmed.endsWith(')')) {
        return trimmed.slice(2, -1);
      }
      return `-(${trimmed})`;
    });
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleClearExpression = () => {
    setExpression('');
    setConfirmClearAll(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (liveEval.ok) {
        handleCalculateAndSave();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClearExpression();
    }
  };

  const handleDownloadFile = (format: 'csv' | 'txt') => {
    if (history.length === 0) return;
    const content =
      format === 'csv' ? exportHistoryToCsv(history) : exportHistoryToText(history);
    const mime = format === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solveit-calculation-history.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startEditingNote = (record: WorkspaceHistoryRecord) => {
    setEditingId(record.id);
    setEditingNoteText(record.note);
  };

  const saveEditedNote = (id: string) => {
    setHistory((prev) => updateHistoryRecordNote(prev, id, editingNoteText));
    setEditingId(null);
    setEditingNoteText('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#475569]">
            <li>
              <Link href="/" className="hover:text-[#2457D6] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </li>
            <li>
              <Link href="/math" className="hover:text-[#2457D6] transition-colors">
                Math Calculators
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </li>
            <li className="text-[#152238] font-bold" aria-current="page">
              Calculation Workspace
            </li>
          </ol>
        </nav>

        {/* Compact Page Header */}
        <header className="mb-6 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5 font-extrabold">
                <Calculator className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#152238]">
                  Calculation Workspace
                </h1>
                <p className="text-sm sm:text-base text-[#475569] mt-1">
                  Calculate, review previous steps, and reuse results without starting over.
                </p>
              </div>
            </div>

            {/* Quick Example Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-[#64748B] mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#2457D6]" />
                Try:
              </span>
              {QUICK_EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    setExpression(ex.expr);
                    setNote(ex.note);
                    inputRef.current?.focus();
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#F8FAFC] hover:bg-[#EBF2FF] text-[#334155] hover:text-[#2457D6] border border-[#CBD5E1] transition-colors cursor-pointer"
                >
                  {ex.expr}
                </button>
              ))}
            </div>
          </div>
        </header>

        {storageWarning && (
          <div
            role="status"
            className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs font-bold text-[#92400E]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{storageWarning}</span>
          </div>
        )}

        {/* Main Workspace Grid: Left = Calculator & Keypad, Right = History & Running Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Expression Input, Live Result Preview, Keypad, Named Subtotals */}
          <div className="lg:col-span-7 space-y-6">
            <section
              aria-label="Expression Calculator"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-5"
            >
              {/* Expression Input Field */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label
                    htmlFor="workspace-expression-input"
                    className="text-sm font-extrabold text-[#152238]"
                  >
                    Mathematical Expression
                  </label>
                  <span className="text-xs font-semibold text-[#64748B]">
                    Press <kbd className="px-1.5 py-0.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-bold text-[#152238]">Enter</kbd> to save · <kbd className="px-1.5 py-0.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-bold text-[#152238]">Esc</kbd> to clear
                  </span>
                </div>

                <div className="relative flex items-center rounded-xl border-2 border-[#CBD5E1] bg-white focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 transition-all">
                  <input
                    ref={inputRef}
                    id="workspace-expression-input"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. (125.50 + 42.25) + 8.5%"
                    aria-describedby="live-preview-region"
                    className="w-full px-4 py-3.5 text-lg sm:text-xl font-extrabold text-[#152238] bg-transparent tabular-nums tracking-tight focus:outline-none"
                  />
                  {expression && (
                    <button
                      type="button"
                      onClick={handleClearExpression}
                      aria-label="Clear expression"
                      title="Clear expression (Esc)"
                      className="mr-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#475569] hover:text-[#152238] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Optional Step Note / Label Input */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label
                    htmlFor="workspace-step-note"
                    className="block text-xs font-extrabold text-[#475569] mb-1.5"
                  >
                    Step Note or Label (Optional)
                  </label>
                  <input
                    id="workspace-step-note"
                    type="text"
                    maxLength={80}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Q2 Materials, Grocery subtotal, Lumber + tax..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#152238] focus:outline-none focus:border-[#2457D6]"
                  />
                </div>
                <div className="sm:col-span-4 flex items-end">
                  <button
                    type="button"
                    disabled={!liveEval.ok}
                    onClick={() => handleSaveNamedSubtotal(note.trim() || undefined)}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#EBF2FF] disabled:opacity-50 text-xs font-extrabold text-[#2457D6] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookmarkPlus className="w-4 h-4 shrink-0" />
                    <span>Pin as Subtotal</span>
                  </button>
                </div>
              </div>

              {/* Live Result Preview Box */}
              <div
                id="live-preview-region"
                aria-live="polite"
                className={`rounded-xl border p-4 transition-colors ${
                  liveEval.ok
                    ? 'bg-[#F0FDF9] border-[#A7F3D0]'
                    : liveEval.isIncomplete
                    ? 'bg-[#F8FAFC] border-[#CBD5E1]'
                    : 'bg-[#FFF1F2] border-[#FECDD3]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#475569]">
                      Live Result Preview
                    </div>
                    {liveEval.ok ? (
                      <div className="mt-1 flex flex-wrap items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#16856B] tabular-nums">
                          = {liveEval.formattedResult}
                        </span>
                        <span className="text-xs font-semibold text-[#475569]">
                          ({liveEval.normalizedExpression})
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`mt-1 text-sm font-bold flex items-center gap-2 ${
                          liveEval.isIncomplete ? 'text-[#475569]' : 'text-[#BE123C]'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{liveEval.error}</span>
                      </div>
                    )}
                  </div>

                  {liveEval.ok && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          triggerCopyFeedback('live-result', String(liveEval.result))
                        }
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#2457D6] text-xs font-extrabold text-[#152238] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedId === 'live-result' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#16856B]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#2457D6]" />
                            <span>Copy Result</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExpression(String(liveEval.result));
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#2457D6] text-xs font-extrabold text-[#2457D6] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Use as Base</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Percentage Semantics Explanation when % is active */}
                {liveEval.ok && liveEval.hasPercentage && liveEval.percentageExplanation && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#A7F3D0] text-xs font-semibold text-[#065F46] flex items-start gap-1.5">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#16856B]" />
                    <span>
                      <strong>Percentage evaluation:</strong> {liveEval.percentageExplanation}
                    </span>
                  </div>
                )}
              </div>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <button
                  type="button"
                  disabled={!liveEval.ok}
                  onClick={handleCalculateAndSave}
                  className="sm:col-span-7 py-3.5 px-5 rounded-xl bg-[#2457D6] hover:bg-[#1D46B0] disabled:opacity-50 text-white text-sm sm:text-base font-extrabold shadow-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CornerDownLeft className="w-4 h-4" />
                  <span>Calculate &amp; Add to History</span>
                </button>

                <button
                  type="button"
                  disabled={lastResult === null}
                  onClick={() => lastResult !== null && handleReuseValue(lastResult)}
                  title="Insert most recent history result into expression"
                  className="sm:col-span-3 py-3.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EBF2FF] disabled:opacity-50 border border-[#CBD5E1] text-[#152238] text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#2457D6]" />
                  <span>Ans ({lastResult !== null ? formatWorkspaceNumber(lastResult) : '—'})</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearExpression}
                  className="sm:col-span-2 py-3.5 px-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Standard On-Screen Calculator Keypad */}
              <div className="pt-3 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                    Calculator Keypad
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBackspace}
                      aria-label="Backspace"
                      className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-xs font-bold text-[#152238] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Delete className="w-3.5 h-3.5" />
                      <span>Backspace</span>
                    </button>
                  </div>
                </div>

                <div
                  role="group"
                  aria-label="Calculator keypad buttons"
                  className="grid grid-cols-4 gap-2 sm:gap-2.5"
                >
                  {/* Row 1 */}
                  <button
                    type="button"
                    onClick={() => insertIntoExpression('(')}
                    className="py-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-base font-extrabold text-[#152238] cursor-pointer"
                  >
                    (
                  </button>
                  <button
                    type="button"
                    onClick={() => insertIntoExpression(')')}
                    className="py-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-base font-extrabold text-[#152238] cursor-pointer"
                  >
                    )
                  </button>
                  <button
                    type="button"
                    onClick={() => insertIntoExpression('%')}
                    className="py-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-base font-extrabold text-[#2457D6] cursor-pointer"
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => insertIntoExpression(' ÷ ')}
                    aria-label="Divide"
                    className="py-3 rounded-xl bg-[#EBF2FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-lg font-extrabold text-[#2457D6] cursor-pointer"
                  >
                    ÷
                  </button>

                  {/* Row 2 */}
                  {['7', '8', '9'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => insertIntoExpression(d)}
                      className="py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-base font-extrabold text-[#152238] shadow-2xs cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => insertIntoExpression(' × ')}
                    aria-label="Multiply"
                    className="py-3 rounded-xl bg-[#EBF2FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-lg font-extrabold text-[#2457D6] cursor-pointer"
                  >
                    ×
                  </button>

                  {/* Row 3 */}
                  {['4', '5', '6'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => insertIntoExpression(d)}
                      className="py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-base font-extrabold text-[#152238] shadow-2xs cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => insertIntoExpression(' - ')}
                    aria-label="Subtract"
                    className="py-3 rounded-xl bg-[#EBF2FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-lg font-extrabold text-[#2457D6] cursor-pointer"
                  >
                    −
                  </button>

                  {/* Row 4 */}
                  {['1', '2', '3'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => insertIntoExpression(d)}
                      className="py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-base font-extrabold text-[#152238] shadow-2xs cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => insertIntoExpression(' + ')}
                    aria-label="Add"
                    className="py-3 rounded-xl bg-[#EBF2FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-lg font-extrabold text-[#2457D6] cursor-pointer"
                  >
                    +
                  </button>

                  {/* Row 5 */}
                  <button
                    type="button"
                    onClick={handleToggleSign}
                    aria-label="Toggle positive or negative sign"
                    className="py-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-sm font-extrabold text-[#152238] cursor-pointer"
                  >
                    ±
                  </button>
                  <button
                    type="button"
                    onClick={() => insertIntoExpression('0')}
                    className="py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-base font-extrabold text-[#152238] shadow-2xs cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => insertIntoExpression('.')}
                    aria-label="Decimal point"
                    className="py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-lg font-extrabold text-[#152238] shadow-2xs cursor-pointer"
                  >
                    .
                  </button>
                  <button
                    type="button"
                    disabled={!liveEval.ok}
                    onClick={handleCalculateAndSave}
                    aria-label="Calculate and add to history"
                    className="py-3 rounded-xl bg-[#16856B] hover:bg-[#116B56] disabled:opacity-50 text-white text-lg font-extrabold shadow-xs cursor-pointer"
                  >
                    =
                  </button>
                </div>
              </div>
            </section>

            {/* Named Subtotals & Saved Values Section */}
            <section
              aria-label="Named Subtotals"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
                    Named Subtotals &amp; Saved Values
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Pin important intermediate numbers with a custom name to reuse across multiple steps.
                  </p>
                </div>

                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveNamedSubtotal(
                        `History Total (${history.length} items)`,
                        runningTotal.total
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#EBF2FF] hover:bg-[#DBEAFE] text-xs font-extrabold text-[#2457D6] transition-colors cursor-pointer"
                  >
                    + Pin History Running Total ({runningTotal.formattedTotal})
                  </button>
                )}
              </div>

              {/* Add custom named subtotal form */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  maxLength={50}
                  value={subtotalNameInput}
                  onChange={(e) => setSubtotalNameInput(e.target.value)}
                  placeholder="Subtotal name (e.g. Room 1 Sq Ft, Monthly Base)..."
                  aria-label="Named subtotal label"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm font-semibold text-[#152238] focus:outline-none focus:border-[#2457D6]"
                />
                <button
                  type="button"
                  disabled={!liveEval.ok}
                  onClick={() => handleSaveNamedSubtotal()}
                  className="px-4 py-2 rounded-xl bg-[#2457D6] hover:bg-[#1D46B0] disabled:opacity-50 text-white text-xs font-extrabold shrink-0 cursor-pointer"
                >
                  Save Current Result ({liveEval.ok ? liveEval.formattedResult : '—'})
                </button>
              </div>

              {subtotals.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-xs text-[#64748B] text-center">
                  No named subtotals saved yet. Click <strong>Pin as Subtotal</strong> above or on any history item to store a reusable value.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {subtotals.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#152238] truncate">
                          {sub.name}
                        </div>
                        <div className="text-sm font-extrabold text-[#16856B] tabular-nums">
                          {sub.formattedValue}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReuseValue(sub.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#2457D6] hover:bg-[#1D46B0] text-white text-xs font-bold cursor-pointer"
                        >
                          Insert
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSubtotals((prev) => prev.filter((s) => s.id !== sub.id))
                          }
                          aria-label={`Delete subtotal ${sub.name}`}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#BE123C] hover:bg-[#FFE4E6] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Calculation History & Running Total */}
          <div className="lg:col-span-5 space-y-6 min-h-[620px] flex flex-col justify-between">
            <section
              aria-label="Calculation History"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4 flex-1 flex flex-col justify-between min-h-[620px]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#2457D6]" aria-hidden="true" />
                  <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
                    Calculation History ({history.length})
                  </h2>
                </div>

                {history.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDownloadFile('csv')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#EBF2FF] border border-[#CBD5E1] text-xs font-bold text-[#152238] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#2457D6]" />
                      <span>CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile('txt')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#EBF2FF] border border-[#CBD5E1] text-xs font-bold text-[#152238] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#2457D6]" />
                      <span>TXT</span>
                    </button>

                    {!confirmClearAll ? (
                      <button
                        type="button"
                        onClick={() => setConfirmClearAll(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] text-xs font-bold text-[#BE123C] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-[#FFF1F2] border border-[#FECDD3] px-2 py-1 rounded-lg">
                        <span className="text-[11px] font-extrabold text-[#BE123C]">
                          Clear all?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setHistory([]);
                            setConfirmClearAll(false);
                          }}
                          className="px-2 py-0.5 rounded bg-[#BE123C] text-white text-[11px] font-extrabold cursor-pointer"
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClearAll(false)}
                          className="px-2 py-0.5 rounded bg-white text-[#152238] border border-[#CBD5E1] text-[11px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Running Total Banner */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    Running Total of History ({history.length} {history.length === 1 ? 'step' : 'steps'})
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-[#152238] tabular-nums mt-0.5">
                    {runningTotal.formattedTotal}
                  </div>
                </div>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReuseValue(runningTotal.total)}
                    className="px-3 py-1.5 rounded-lg bg-[#2457D6] hover:bg-[#1D46B0] text-white text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    Reuse Total
                  </button>
                )}
              </div>

              {/* History List or Consistent Min-Height Placeholder State */}
              {history.length === 0 ? (
                <div className="min-h-[340px] flex-1 p-5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] flex flex-col justify-between gap-4">
                  <div className="text-center space-y-1.5 pt-2">
                    <p className="text-sm font-extrabold text-[#152238]">
                      Your calculation tape is ready
                    </p>
                    <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
                      Enter an expression on the left and press <strong>Enter</strong> or click{' '}
                      <strong>Calculate &amp; Add to History</strong> to record each step on your running tape.
                    </p>
                  </div>

                  {/* Live Expression Verification Preview inside Placeholder */}
                  <div className="rounded-xl bg-white border border-[#E2E8F0] p-3.5 space-y-1.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2457D6]">
                      Current Active Expression Preview
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-mono font-semibold text-[#475569] truncate">
                        {expression.trim() || '—'}
                      </span>
                      <span className="text-sm font-mono font-extrabold text-[#16856B] tabular-nums">
                        {liveEval.ok ? `= ${liveEval.formattedResult}` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-[#64748B]">
                      Quick-start sample calculations:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {QUICK_EXAMPLES.map((ex) => (
                        <button
                          key={ex.label}
                          type="button"
                          onClick={() => {
                            setExpression(ex.expr);
                            setNote(ex.note);
                          }}
                          className="text-left p-2.5 rounded-lg bg-white hover:bg-[#EBF2FF] border border-[#CBD5E1] transition-colors cursor-pointer"
                        >
                          <div className="text-[11px] font-bold text-[#152238] truncate">
                            {ex.label}
                          </div>
                          <div className="text-xs font-mono font-semibold text-[#2457D6] tabular-nums">
                            {ex.expr}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 min-h-[340px] max-h-[540px] overflow-y-auto pr-1 flex-1">
                  {history.map((item, idx) => {
                    const isEditing = editingId === item.id;
                    return (
                      <article
                        key={item.id}
                        aria-label={`Calculation step ${history.length - idx}`}
                        className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#94A3B8] transition-colors space-y-2"
                      >
                        {/* Top row: Step badge, note or note editor, timestamp */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="px-2 py-0.5 rounded-md bg-[#EBF2FF] text-[#2457D6] text-[11px] font-extrabold shrink-0">
                              #{history.length - idx}
                            </span>
                            {!isEditing ? (
                              <button
                                type="button"
                                onClick={() => startEditingNote(item)}
                                className="text-xs font-bold text-[#475569] hover:text-[#2457D6] truncate inline-flex items-center gap-1 cursor-pointer"
                                title="Click to edit note"
                              >
                                <span>{item.note || 'Add note...'}</span>
                                <Pencil className="w-3 h-3 shrink-0 opacity-70" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  maxLength={80}
                                  value={editingNoteText}
                                  onChange={(e) => setEditingNoteText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditedNote(item.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                  autoFocus
                                  placeholder="Step description..."
                                  className="px-2 py-1 rounded border border-[#2457D6] bg-white text-xs font-semibold text-[#152238] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => saveEditedNote(item.id)}
                                  className="px-2 py-1 rounded bg-[#2457D6] text-white text-[11px] font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            )}
                          </div>

                          <span className="text-[11px] text-[#64748B] shrink-0">
                            {new Date(item.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Middle row: Expression and Result */}
                        <div className="flex flex-wrap items-baseline justify-between gap-2 pt-0.5">
                          <div className="text-xs sm:text-sm font-bold text-[#334155] break-all">
                            {item.expression}
                          </div>
                          <div className="text-base sm:text-lg font-extrabold text-[#16856B] tabular-nums">
                            = {item.formattedResult}
                          </div>
                        </div>

                        {/* Bottom row: Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-[#E2E8F0]">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleReuseValue(item.result)}
                              className="px-2.5 py-1 rounded-lg bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[11px] font-extrabold cursor-pointer"
                            >
                              + Reuse Result
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setExpression(item.expression);
                                setNote(item.note);
                                inputRef.current?.focus();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EBF2FF] border border-[#CBD5E1] text-[11px] font-bold text-[#152238] cursor-pointer"
                            >
                              Edit Expr
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveNamedSubtotal(
                                  item.note || `Step #${history.length - idx}`,
                                  item.result
                                )
                              }
                              className="px-2 py-1 rounded-lg bg-white hover:bg-[#EBF2FF] border border-[#CBD5E1] text-[11px] font-bold text-[#2457D6] cursor-pointer"
                            >
                              Pin
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                triggerCopyFeedback(`res_${item.id}`, String(item.result))
                              }
                              title="Copy numeric result"
                              className="px-2 py-1 rounded-lg bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[11px] font-bold text-[#475569] inline-flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === `res_${item.id}` ? (
                                <Check className="w-3 h-3 text-[#16856B]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setHistory((prev) => deleteHistoryRecord(prev, item.id))
                              }
                              aria-label="Delete history record"
                              title="Delete this record"
                              className="p-1 rounded-lg text-[#64748B] hover:text-[#BE123C] hover:bg-[#FFE4E6] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Storage Transparency Note */}
              <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] leading-relaxed">
                <strong className="text-[#152238]">How history is stored:</strong> Up to{' '}
                {MAX_HISTORY_RECORDS} records and named subtotals are saved locally in your
                browser&apos;s storage (<code className="font-mono">localStorage</code>). Your
                expressions and numbers are never sent to any external server. Clearing your
                browser data, using private/incognito browsing, or switching devices will remove
                locally stored history—use <strong>CSV</strong> or <strong>TXT</strong> export to
                keep a permanent copy.
              </div>
            </section>
          </div>
        </div>

        {/* Documentation: Percentage Semantics & Operator Precedence */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-3">
            <h2 className="text-lg font-extrabold text-[#152238]">
              How Percentage (%) Operations Are Evaluated
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              To avoid ambiguity, Calculation Workspace uses transparent, documented rules for
              expressions containing the <code className="font-bold text-[#152238]">%</code>{' '}
              operator and displays the exact expanded formula in the Live Result Preview:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#334155]">
              <li className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <strong className="text-[#152238]">Adding a percentage (A + B%):</strong> Adds{' '}
                <em>B% of A</em> to <em>A</em>. Example:{' '}
                <code className="font-bold text-[#2457D6]">100 + 15%</code> evaluates as{' '}
                <code>100 + (100 × 15 ÷ 100) = 115</code> (ideal for sales tax, tips, or markups).
              </li>
              <li className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <strong className="text-[#152238]">Subtracting a percentage (A − B%):</strong>{' '}
                Subtracts <em>B% of A</em> from <em>A</em>. Example:{' '}
                <code className="font-bold text-[#2457D6]">200 - 20%</code> evaluates as{' '}
                <code>200 - (200 × 20 ÷ 100) = 160</code> (ideal for retail discounts).
              </li>
              <li className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <strong className="text-[#152238]">
                  Multiplying, dividing, or standalone (A × B% or B%):
                </strong>{' '}
                Converts <em>B%</em> to its decimal equivalent <code>B ÷ 100</code>. Example:{' '}
                <code className="font-bold text-[#2457D6]">250 * 8%</code> evaluates as{' '}
                <code>250 × 0.08 = 20</code>.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-3">
            <h2 className="text-lg font-extrabold text-[#152238]">
              Order of Operations &amp; Safe Expression Parsing
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Every expression is evaluated using a dedicated mathematical parser following
              standard PEMDAS / BODMAS rules:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-[#334155]">
              <li>
                <strong className="text-[#152238]">Parentheses ()</strong> — evaluated from
                innermost to outermost first.
              </li>
              <li>
                <strong className="text-[#152238]">Percentage (%) &amp; Unary Signs (±)</strong> —
                applied directly to their operand.
              </li>
              <li>
                <strong className="text-[#152238]">Multiplication (×, *) &amp; Division (÷, /)</strong>{' '}
                — evaluated left to right before addition and subtraction.
              </li>
              <li>
                <strong className="text-[#152238]">Addition (+) &amp; Subtraction (−)</strong> —
                evaluated left to right.
              </li>
            </ol>
            <p className="text-xs text-[#64748B] pt-1">
              Division by zero, unmatched parentheses, and unsupported symbols are caught
              immediately with descriptive guidance so you never see raw <code>NaN</code> or{' '}
              <code>Infinity</code> outputs.
            </p>
          </div>
        </section>

        {/* Frequently Asked Questions (Google Search Queries) */}
        <section
          id="faq"
          aria-labelledby="workspace-faq-heading"
          className="mt-8 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4"
        >
          <div>
            <h2
              id="workspace-faq-heading"
              className="text-base sm:text-lg font-extrabold text-[#152238]"
            >
              Frequently Asked Questions About Multi-Step &amp; Tape Calculations
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Common questions on PEMDAS order of operations, running totals, and keyboard shortcuts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm">
            {[
              {
                q: 'How does the Calculation Workspace follow PEMDAS / BODMAS order of operations?',
                a: 'Expressions inside parentheses () are evaluated first, followed by percentages (%) and unary signs, then multiplication (×) and division (÷) from left to right, and finally addition (+) and subtraction (−) from left to right.',
              },
              {
                q: 'How do I chain a running total from my previous answer?',
                a: 'Click any item in the Saved History Tape or press the Use Result button to load that exact number into your current expression as the starting operand.',
              },
              {
                q: 'What keyboard shortcuts work in the calculator workspace?',
                a: 'Type numbers 0–9, +, -, *, /, %, and parentheses directly on your keyboard. Press Enter or = to evaluate and save to the tape, Backspace to delete the last character, and Escape to clear the current line.',
              },
              {
                q: 'Why does 10 + 5 × 2 equal 20 instead of 30?',
                a: 'Under standard algebraic precedence (PEMDAS), multiplication is performed before addition: 5 × 2 = 10, and 10 + 10 = 20. If you want to add first, wrap the addition in parentheses: (10 + 5) × 2 = 30.',
              },
              {
                q: 'How are percentages (%) evaluated inside an expression?',
                a: 'A percentage sign converts the preceding number to its decimal hundredth (dividing by 100). For example, 250 × 18% evaluates as 250 × 0.18 = 45.',
              },
              {
                q: 'Does my calculation history persist if I refresh the browser tab?',
                a: 'Yes. Your recent calculation tape is saved locally in your browser’s storage so you can review or copy your multi-step audit trail until you click Clear History.',
              },
              {
                q: 'Can I copy the full formula and result for a spreadsheet or invoice?',
                a: 'Yes. Click the Copy Result button in the output panel or click any row in the history tape to copy the formatted calculation directly to your clipboard.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1"
              >
                <h3 className="font-bold text-[#152238] text-xs sm:text-sm">
                  {faq.q}
                </h3>
                <p className="text-[#475569] leading-relaxed text-xs">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Calculators & Contextual Internal Links */}
        <section aria-labelledby="related-workspace-calculators" className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="related-workspace-calculators"
              className="text-lg sm:text-xl font-extrabold text-[#152238]"
            >
              Related Calculators
            </h2>
            <Link
              href="/calculators"
              className="text-xs sm:text-sm font-bold text-[#2457D6] hover:underline"
            >
              Browse All Calculators →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RELATED_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#2457D6] p-4 shadow-2xs transition-all group"
              >
                <div className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors">
                  {tool.name}
                </div>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
            <span>
              <strong>Last updated:</strong> November 13, 2026 · Standard PEMDAS algebraic expression evaluator.
            </span>
            <div className="flex flex-wrap items-center gap-3 font-bold">
              <Link href="/calculation-methodology" className="text-[#2457D6] hover:underline">
                Methodology
              </Link>
              <span>·</span>
              <Link href="/contact" className="text-[#2457D6] hover:underline">
                Contact
              </Link>
              <span>·</span>
              <Link href="/contact#report-error" className="text-[#E11D48] hover:underline">
                Report an error
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
