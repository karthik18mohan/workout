"use client";

import { DayLog } from "./types";

const STORAGE_KEY = "operation-shred-logs";

export function getAllLogs(): Record<string, DayLog> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getDayLog(date: string): DayLog | null {
  const logs = getAllLogs();
  return logs[date] || null;
}

export function saveDayLog(log: DayLog): void {
  const logs = getAllLogs();
  logs[log.date] = log;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function exportData(): string {
  return JSON.stringify(getAllLogs(), null, 2);
}

export function downloadExport(): void {
  const data = exportData();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `operation-shred-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
