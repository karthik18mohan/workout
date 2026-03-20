"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getAllLogs } from "@/lib/storage";
import { DayLog } from "@/lib/types";

interface TargetItem {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

export default function TargetsPage() {
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLogs(getAllLogs());
  }, []);

  const targets: TargetItem[] = useMemo(() => {
    const entries = Object.values(logs);
    const gymDays = entries.filter((l) => l.workoutType === "gym" || l.workoutType === "both").length;
    const homeDays = entries.filter((l) => l.workoutType === "home" || l.workoutType === "both").length;
    const totalWorkouts = entries.filter((l) => l.workoutType !== "rest").length;
    const stepsHit = entries.filter((l) => l.dailyChecklist?.steps).length;
    const proteinHit = entries.filter((l) => l.dailyChecklist?.protein).length;
    const waterHit = entries.filter((l) => l.dailyChecklist?.water).length;
    const sleepHit = entries.filter((l) => l.dailyChecklist?.sleep).length;

    return [
      { label: "Gym Sessions", current: gymDays, goal: 48, unit: "sessions", color: "bg-accent-red" },
      { label: "Home Workouts", current: homeDays, goal: 36, unit: "sessions", color: "bg-accent-green" },
      { label: "Total Workouts", current: totalWorkouts, goal: 72, unit: "sessions", color: "bg-accent-orange" },
      { label: "10K Steps Days", current: stepsHit, goal: 84, unit: "days", color: "bg-accent-green" },
      { label: "Protein Goal Days", current: proteinHit, goal: 84, unit: "days", color: "bg-accent-orange" },
      { label: "3L Water Days", current: waterHit, goal: 84, unit: "days", color: "bg-cyan-400" },
      { label: "7h Sleep Days", current: sleepHit, goal: 84, unit: "days", color: "bg-blue-400" },
    ];
  }, [logs]);

  if (!mounted) return <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse"><div className="h-96 bg-bg-card rounded-xl" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h2 className="text-2xl font-bold mb-2">
        <span className="text-accent-orange">3-MONTH</span> TARGETS
      </h2>
      <p className="text-sm text-muted mb-6">12-week goals starting April 1, 2026</p>

      <div className="space-y-4">
        {targets.map((t, i) => {
          const pct = Math.min(100, Math.round((t.current / t.goal) * 100));
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-bg-card border border-border-custom rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">{t.label}</span>
                <span className="text-xs text-muted">
                  {t.current} / {t.goal} {t.unit}
                </span>
              </div>
              <div className="h-3 bg-bg-hover rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`h-full rounded-full ${t.color}`}
                />
              </div>
              <div className="text-right mt-1 text-xs text-muted">{pct}%</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
