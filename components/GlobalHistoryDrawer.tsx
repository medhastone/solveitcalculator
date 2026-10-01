'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  History,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Calculator,
  ArrowRight,
} from 'lucide-react';

export interface HistoryEntry {
  id: string;
  toolName: string;
  toolPath: string;
  summary: string;
  result: string;
  timestamp: number;
}

interface GlobalHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'solveit_calc_history';

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    const newEntry: HistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    list.unshift(newEntry);
    const trimmed = list.slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent('solveit-history-change'));
  } catch (e) {
    console.error('Failed to save calculation history', e);
  }
}

export default function GlobalHistoryDrawer({ isOpen, onClose }: GlobalHistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setHistory(parsed);
          }
        } else {
          setHistory([]);
        }
      } catch {
        setHistory([]);
      }
    };

    if (isOpen) {
      loadHistory();
    }

    const handleUpdate = () => loadHistory();
    window.addEventListener('solveit-history-change', handleUpdate);
    return () => window.removeEventListener('solveit-history-change', handleUpdate);
  }, [isOpen]);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      window.dispatchEvent(new CustomEvent('solveit-history-change'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Calculation History</h2>
                <p className="text-xs text-slate-400">Recent calculations on this device</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-slate-300">No Recent Calculations</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Your calculation results will automatically appear here as you use calculators and converters.
                </p>
                <div className="pt-2">
                  <Link
                    href="/finance"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20"
                  >
                    <span>Browse Calculators</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.toolPath || '/'}
                      onClick={onClose}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>{item.toolName}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/90 rounded-lg p-2 font-mono">
                    <p className="text-slate-400 text-[11px] mb-1">{item.summary}</p>
                    <p className="font-semibold text-white text-sm break-all">{item.result}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.result)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Result</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">{history.length} items saved locally</span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
