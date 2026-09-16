"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SavedTool,
  getSavedTools,
  removeSavedTool,
  clearAllSavedTools,
  saveTool,
  isToolSaved,
} from "../lib/bookmarks";
import { allUniqueTools } from "../lib/searchData";

interface SavedToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECOMMENDED_DEFAULTS = [
  {
    id: "mortgage-calc",
    title: "Mortgage Payment Calculator",
    link: "/finance/mortgage-calculator",
    label: "Finance",
    category: "finance",
    desc: "Calculate monthly home loan payments, PITI, amortization, and escrow.",
    badgeClass: "bg-primary-fixed text-primary",
  },
  {
    id: "bmi-calc",
    title: "BMI & Body Composition",
    link: "/health/bmi",
    label: "Health",
    category: "health",
    desc: "Calculate BMI, healthy weight ranges, and body fat percentage.",
    badgeClass: "bg-error-container text-error",
  },
  {
    id: "investing-growth",
    title: "Investing & SIP Compounder",
    link: "/investing-and-growth",
    label: "Finance",
    category: "finance",
    desc: "Calculate compound interest, SIP returns, and portfolio growth.",
    badgeClass: "bg-primary-fixed text-primary",
  },
  {
    id: "scientific-calc",
    title: "Scientific Calculator Suite",
    link: "/scientific-calculator",
    label: "Math",
    category: "math",
    desc: "Advanced trigonometry, algebra, logarithms, and formula solver.",
    badgeClass: "bg-secondary-fixed text-secondary",
  },
  {
    id: "age-calc",
    title: "Age & Milestone Tracker",
    link: "/time-date/age-calculator",
    label: "Time & Date",
    category: "time-date",
    desc: "Calculate exact age down to the second and milestone birthdays.",
    badgeClass: "bg-primary-fixed text-primary",
  },
  {
    id: "length-converter",
    title: "Length & Distance Converter",
    link: "/length-converter",
    label: "Conversion",
    category: "conversion",
    desc: "Convert meters, feet, inches, miles, and kilometers instantly.",
    badgeClass: "bg-surface-container-highest text-on-surface",
  },
];

export default function SavedToolsModal({
  isOpen,
  onClose,
}: SavedToolsModalProps) {
  const pathname = usePathname();
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  // Load saved tools and listen for storage/custom events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setSavedTools(getSavedTools());
    };

    update();

    window.addEventListener("solveit-bookmarks-change", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("solveit-bookmarks-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setConfirmClear(false);
      setFilterQuery("");
      setSavedTools(getSavedTools());
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Find if current page is a recognizable tool
  const currentToolInfo = useMemo(() => {
    if (!pathname || pathname === "/") return null;
    const normalizedPath = pathname.toLowerCase().replace(/\/$/, "");
    const matched = allUniqueTools.find(
      (t) => t.link.toLowerCase().replace(/\/$/, "") === normalizedPath
    );

    if (matched) return matched;

    // Fallback if not directly in allUniqueTools list
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      const readableName = segments[segments.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        id: normalizedPath.replace(/^\//, ""),
        title: readableName + " Calculator",
        link: pathname,
        label: "Current Tool",
        desc: "SolveIt precision calculator page",
      };
    }
    return null;
  }, [pathname]);

  const isCurrentPageSaved = useMemo(() => {
    if (!pathname) return false;
    return isToolSaved(pathname);
  }, [pathname, savedTools]);

  const handleToggleCurrentPage = () => {
    if (!currentToolInfo) return;
    if (isCurrentPageSaved) {
      removeSavedTool(pathname);
    } else {
      saveTool({
        id: currentToolInfo.id,
        title: currentToolInfo.title || (currentToolInfo as any).name || "Calculator",
        link: pathname,
        category: (currentToolInfo as any).category || "general",
        label: (currentToolInfo as any).label || "Saved",
        desc: currentToolInfo.desc || "Quick access saved calculator",
        badgeClass: (currentToolInfo as any).badgeClass || "",
      });
    }
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeSavedTool(id);
  };

  const handleClearAll = () => {
    clearAllSavedTools();
    setConfirmClear(false);
  };

  const handleQuickAdd = (tool: typeof RECOMMENDED_DEFAULTS[0]) => {
    saveTool(tool);
  };

  const filteredTools = useMemo(() => {
    if (!filterQuery.trim()) return savedTools;
    const q = filterQuery.toLowerCase();
    return savedTools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.desc && t.desc.toLowerCase().includes(q)) ||
        (t.label && t.label.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }, [savedTools, filterQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-16 px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Tools & Bookmarks"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[88vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-outline-variant/30 bg-surface-container-low/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                bookmark
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-title-md font-bold text-on-surface flex items-center gap-2">
                <span>Saved Tools</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-medium">
                  {savedTools.length}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedTools.length > 0 && (
              <>
                {confirmClear ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                    <span className="text-xs text-error font-medium">
                      Clear all?
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="px-2 py-1 bg-error text-on-error rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Yes, Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="px-2 py-1 bg-surface-container text-on-surface-variant rounded-lg text-xs hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-xs text-on-surface-variant hover:text-error transition-colors px-2 py-1 rounded-lg hover:bg-surface-container"
                    title="Clear all saved bookmarks"
                  >
                    Clear All
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close saved tools modal"
              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Current Page Contextual Action Banner */}
        {currentToolInfo && pathname !== "/" && (
          <div className="px-4 py-3 bg-surface-container-low/40 border-b border-outline-variant/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                location_on
              </span>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                  Current Page
                </span>
                <p className="text-body-sm font-medium text-on-surface truncate">
                  {currentToolInfo.title || (currentToolInfo as any).name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleCurrentPage}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body-sm text-body-sm font-semibold transition-all shadow-xs ${
                isCurrentPageSaved
                  ? "bg-primary text-on-primary hover:bg-primary/90"
                  : "bg-surface-container-high hover:bg-primary/10 text-on-surface hover:text-primary border border-outline-variant/40"
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {isCurrentPageSaved ? "bookmark_added" : "bookmark_add"}
              </span>
              <span>{isCurrentPageSaved ? "Saved" : "Save this Tool"}</span>
            </button>
          </div>
        )}

        {/* Search / Filter bar inside saved list (if more than 3 tools saved) */}
        {savedTools.length > 3 && (
          <div className="px-4 py-2 border-b border-outline-variant/20 bg-surface-container-lowest">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter your saved tools..."
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant/60"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery("")}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-outline-variant/10">
          {savedTools.length === 0 ? (
            <div className="py-8 px-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-3 text-on-surface-variant/50">
                <span className="material-symbols-outlined text-[32px]">
                  bookmark_border
                </span>
              </div>
              <h3 className="font-headline-sm text-title-md font-bold text-on-surface mb-1">
                No Saved Tools Yet
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto mb-6 leading-relaxed">
                Save any calculator across SolveIt Calculator for rapid 1-click access. All
                bookmarks are saved securely in your browser.
              </p>

              {/* Quick Add Suggestions */}
              <div className="text-left max-w-lg mx-auto bg-surface-container-low/50 rounded-2xl p-3 sm:p-4 border border-outline-variant/30">
                <div className="flex items-center gap-1.5 text-xs font-label-caps uppercase tracking-wider text-primary font-semibold mb-3">
                  <span className="material-symbols-outlined text-[16px]">
                    add_circle
                  </span>
                  <span>Recommended Tools to Save</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RECOMMENDED_DEFAULTS.map((tool) => (
                    <div
                      key={tool.id}
                      className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-body-sm font-semibold text-on-surface truncate block">
                          {tool.title}
                        </span>
                        <span className="text-[10px] text-on-surface-variant truncate block">
                          {tool.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(tool)}
                        className="px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-on-primary text-xs font-semibold transition-colors shrink-0 flex items-center gap-1"
                        title={`Save ${tool.title}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          add
                        </span>
                        <span>Save</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-1 block">
                search_off
              </span>
              <p className="font-body-md text-on-surface font-medium">
                No saved tools match &ldquo;{filterQuery}&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group relative flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all"
                >
                  <Link
                    href={tool.link}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        calculate
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                          {tool.title}
                        </span>
                        {tool.label && (
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                              tool.badgeClass ||
                              "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            {tool.label}
                          </span>
                        )}
                      </div>
                      {tool.desc && (
                        <p className="font-body-sm text-body-sm text-on-surface-variant/80 truncate mt-0.5">
                          {tool.desc}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleRemove(tool.id, e)}
                      className="p-1.5 rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-error-container/20 transition-colors"
                      title="Remove from saved tools"
                      aria-label={`Remove ${tool.title} from saved tools`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete_outline
                      </span>
                    </button>
                    <Link
                      href={tool.link}
                      onClick={onClose}
                      className="p-1.5 rounded-lg text-on-surface-variant/60 hover:text-primary group-hover:text-primary transition-colors"
                      title="Open tool"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-4 py-2.5 bg-surface-container-low/60 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant font-data-mono">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-secondary">
              lock
            </span>
            <span>Saved in your browser storage</span>
          </div>
          <span className="text-[11px] font-normal text-on-surface-variant/70">
            {savedTools.length} {savedTools.length === 1 ? "tool" : "tools"} saved
          </span>
        </div>
      </div>
    </div>
  );
}
