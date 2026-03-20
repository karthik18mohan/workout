import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Phase } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PROGRAM_START = new Date(2026, 3, 1); // April 1, 2026

export function getWeekNumber(date: Date): number {
  const diff = date.getTime() - PROGRAM_START.getTime();
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(12, weekNum));
}

export function getPhase(date: Date): Phase {
  const week = getWeekNumber(date);
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  return 3;
}

export function getPhaseFromWeek(week: number): Phase {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  return 3;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function isProgramActive(date: Date): boolean {
  const end = new Date(2026, 5, 24); // June 24, 2026
  return date >= PROGRAM_START && date <= end;
}

export function dayNames(): string[] {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}
