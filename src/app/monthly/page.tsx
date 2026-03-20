"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Dumbbell, Home, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAllLogs } from "@/lib/storage";
import { DayLog } from "@/lib/types";
import { getDaysInMonth, formatDate } from "@/lib/utils";

export default function MonthlyView() {
  const router = useRouter();
  const [monthOffset, setMonthOffset] = useState(0);
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLogs(getAllLogs());
  }, []);

  const now = new Date();
  const year = now.getFullYear();
  const baseMonth = now.getMonth() + monthOffset;
  const viewDate = new Date(year, baseMonth, 1);
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const days = useMemo(() => getDaysInMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const firstDayOfWeek = (days[0].getDay() + 6) % 7; // Mon=0

  const stats = useMemo(() => {
    let gym = 0, home = 0, both = 0, streak = 0, maxStreak = 0, currentStreak = 0;
    const sorted = days.map((d) => ({ date: d, log: logs[formatDate(d)] }));
    sorted.forEach(({ log }) => {
      if (!log || log.workoutType === "rest") {
        currentStreak = 0;
      } else {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        if (log.workoutType === "gym") gym++;
        else if (log.workoutType === "home") home++;
        else if (log.workoutType === "both") { both++; gym++; home++; }
      }
    });
    streak = maxStreak;
    return { gym, home, both, streak, total: gym + home - both + both };
  }, [days, logs]);

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const colorForDay = (dateStr: string): string => {
    const log = logs[dateStr];
    if (!log || log.workoutType === "rest") return "bg-[#1A1A1A]";
    if (log.workoutType === "both") return "bg-accent-orange";
    if (log.workoutType === "gym") return "bg-accent-red";
    if (log.workoutType === "home") return "bg-accent-green";
    return "bg-[#1A1A1A]";
  };

  if (!mounted) return <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse"><div className="h-96 bg-bg-card rounded-xl" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Month header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMonthOffset((o) => o - 1)}
          className="p-2 rounded-lg bg-bg-card border border-border-custom hover:bg-bg-hover transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">{monthLabel}</h2>
        <button
          onClick={() => setMonthOffset((o) => o + 1)}
          className="p-2 rounded-lg bg-bg-card border border-border-custom hover:bg-bg-hover transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <StatBox icon={<Dumbbell size={14} />} label="Gym" value={stats.gym} color="text-accent-red" />
        <StatBox icon={<Home size={14} />} label="Home" value={stats.home} color="text-accent-green" />
        <StatBox icon={<Flame size={14} />} label="Streak" value={stats.streak} color="text-accent-orange" />
        <StatBox icon={null} label="Total" value={stats.total} color="text-white" />
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent-red inline-block" /> Gym</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent-green inline-block" /> Home</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent-orange inline-block" /> Both</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#1A1A1A] border border-border-custom inline-block" /> Rest</span>
      </div>

      {/* Calendar grid */}
      <motion.div
        key={monthOffset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-bg-card rounded-xl border border-border-custom p-3"
      >
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="text-center text-xs text-muted font-medium py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((date) => {
            const dateStr = formatDate(date);
            const isToday = dateStr === formatDate(new Date());
            return (
              <button
                key={dateStr}
                onClick={() => router.push(`/?date=${dateStr}`)}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-105 ${colorForDay(dateStr)} ${
                  isToday ? "ring-2 ring-white/50" : ""
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-bg-card rounded-lg border border-border-custom p-3 text-center">
      <div className={`flex items-center justify-center gap-1 ${color} mb-1`}>
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
