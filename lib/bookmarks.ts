"use client";

export interface SavedTool {
  id: string;
  title: string;
  link: string;
  category?: string;
  label?: string;
  desc?: string;
  badgeClass?: string;
  savedAt: number;
}

const STORAGE_KEY = "solveit_saved_tools";

// Safe helper to retrieve saved tools from localStorage
export function getSavedTools(): SavedTool[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error("Error reading saved tools from localStorage", e);
    return [];
  }
}

// Check if a tool is saved by id or by relative link
export function isToolSaved(idOrLink: string): boolean {
  if (!idOrLink) return false;
  const tools = getSavedTools();
  const normalized = idOrLink.toLowerCase().replace(/\/$/, "");
  return tools.some(
    (t) =>
      t.id.toLowerCase() === normalized ||
      t.link.toLowerCase().replace(/\/$/, "") === normalized
  );
}

// Save a tool to browser storage
export function saveTool(
  tool: Omit<SavedTool, "savedAt"> & { savedAt?: number }
): void {
  if (typeof window === "undefined") return;
  try {
    const tools = getSavedTools();
    const normalizedLink = tool.link.toLowerCase().replace(/\/$/, "");
    const existingIndex = tools.findIndex(
      (t) =>
        t.id.toLowerCase() === tool.id.toLowerCase() ||
        t.link.toLowerCase().replace(/\/$/, "") === normalizedLink
    );

    const newEntry: SavedTool = {
      id: tool.id || normalizedLink,
      title: tool.title,
      link: tool.link,
      category: tool.category || "general",
      label: tool.label || "Tool",
      desc: tool.desc || "",
      badgeClass: tool.badgeClass || "",
      savedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      tools[existingIndex] = newEntry;
    } else {
      tools.unshift(newEntry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    window.dispatchEvent(
      new CustomEvent("solveit-bookmarks-change", { detail: tools })
    );
  } catch (e) {
    console.error("Error saving tool to localStorage", e);
  }
}

// Remove a tool from browser storage
export function removeSavedTool(idOrLink: string): void {
  if (typeof window === "undefined" || !idOrLink) return;
  try {
    const tools = getSavedTools();
    const normalized = idOrLink.toLowerCase().replace(/\/$/, "");
    const filtered = tools.filter(
      (t) =>
        t.id.toLowerCase() !== normalized &&
        t.link.toLowerCase().replace(/\/$/, "") !== normalized
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(
      new CustomEvent("solveit-bookmarks-change", { detail: filtered })
    );
  } catch (e) {
    console.error("Error removing saved tool from localStorage", e);
  }
}

// Toggle save/remove
export function toggleSaveTool(
  tool: Omit<SavedTool, "savedAt"> & { savedAt?: number }
): boolean {
  if (isToolSaved(tool.id || tool.link)) {
    removeSavedTool(tool.id || tool.link);
    return false;
  } else {
    saveTool(tool);
    return true;
  }
}

// Clear all saved tools
export function clearAllSavedTools(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("solveit-bookmarks-change", { detail: [] })
    );
  } catch (e) {
    console.error("Error clearing saved tools from localStorage", e);
  }
}
