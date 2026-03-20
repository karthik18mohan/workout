"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Dumbbell, Home, BedDouble } from "lucide-react";
import { DayLog, WorkoutType } from "@/lib/types";
import { gymDaysByPhase, homeWorkouts } from "@/lib/workout-data";
import { getDayLog, saveDayLog } from "@/lib/storage";
import { getPhase, formatDate } from "@/lib/utils";
import ExerciseTable from "./exercise-table";

interface DayCardProps {
  date: Date;
  isToday: boolean;
}

const defaultChecklist = { steps: false, protein: false, water: false, sleep: false };

export default function DayCard({ date, isToday }: DayCardProps) {
  const dateStr = formatDate(date);
  const [log, setLog] = useState<DayLog | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getDayLog(dateStr);
    setLog(saved);
    if (isToday && !saved) setExpanded(true);
  }, [dateStr, isToday]);

  const save = useCallback(
    (updated: DayLog) => {
      setLog(updated);
      saveDayLog(updated);
    },
    []
  );

  const toggleWorkoutType = (type: "gym" | "home") => {
    const current = log?.workoutType || "rest";
    let newType: WorkoutType;

    if (type === "gym") {
      if (current === "gym") newType = "rest";
      else if (current === "home") newType = "both";
      else if (current === "both") newType = "home";
      else newType = "gym";
    } else {
      if (current === "home") newType = "rest";
      else if (current === "gym") newType = "both";
      else if (current === "both") newType = "gym";
      else newType = "home";
    }

    save({
      date: dateStr,
      workoutType: newType,
      gymDayNumber: log?.gymDayNumber || 1,
      homeWorkoutId: log?.homeWorkoutId || "A",
      exerciseLogs: log?.exerciseLogs || {},
      dailyChecklist: log?.dailyChecklist || { ...defaultChecklist },
    });
  };

  const isGym = log?.workoutType === "gym" || log?.workoutType === "both";
  const isHome = log?.workoutType === "home" || log?.workoutType === "both";
  const phase = getPhase(date);
  const gymDays = gymDaysByPhase[phase];
  const selectedGymDay = gymDays?.find((d) => d.dayNumber === (log?.gymDayNumber || 1));
  const selectedHome = homeWorkouts.find((h) => h.id === (log?.homeWorkoutId || "A"));

  const updateSet = (exerciseName: string, setIndex: number, field: "weight" | "reps", value: string) => {
    if (!log) return;
    const logs = { ...(log.exerciseLogs || {}) };
    const key = exerciseName;
    if (!logs[key]) {
      const allExercises = [
        ...(selectedGymDay?.exercises || []),
        ...(selectedHome?.exercises || []),
      ];
      const found = allExercises.find((e) => e.name === exerciseName);
      if (found) logs[key] = found.sets.map((s) => ({ ...s }));
    }
    if (logs[key] && logs[key][setIndex]) {
      const numVal = parseFloat(value);
      const val = isNaN(numVal) ? value : numVal;
      if (field === "weight") logs[key][setIndex] = { ...logs[key][setIndex], weight: val };
      else logs[key][setIndex] = { ...logs[key][setIndex], reps: val };
    }
    save({ ...log, exerciseLogs: logs });
  };

  const toggleChecklist = (key: keyof DayLog["dailyChecklist"]) => {
    const checklist = log?.dailyChecklist || { ...defaultChecklist };
    save({
      date: dateStr,
      workoutType: log?.workoutType || "rest",
      gymDayNumber: log?.gymDayNumber,
      homeWorkoutId: log?.homeWorkoutId,
      exerciseLogs: log?.exerciseLogs,
      dailyChecklist: { ...checklist, [key]: !checklist[key] },
    });
  };

  const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
  const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const borderColor = log?.workoutType === "both"
    ? "border-accent-orange"
    : log?.workoutType === "gym"
    ? "border-accent-red"
    : log?.workoutType === "home"
    ? "border-accent-green"
    : "border-border-custom";

  if (!mounted) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-custom p-4 animate-pulse">
        <div className="h-6 bg-bg-hover rounded w-1/3" />
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-bg-card rounded-xl border-2 ${borderColor} overflow-hidden transition-colors ${
        isToday ? "ring-1 ring-accent-red/50" : ""
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-bg-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="text-sm font-bold text-white">{dayLabel}</div>
            <div className="text-xs text-muted">{dateLabel}</div>
          </div>
          {isToday && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-red/20 text-accent-red font-bold">
              TODAY
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isGym && <Dumbbell size={16} className="text-accent-red" />}
          {isHome && <Home size={16} className="text-accent-green" />}
          {!isGym && !isHome && <BedDouble size={16} className="text-muted" />}
          {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Workout type toggles */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleWorkoutType("gym")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isGym ? "bg-accent-red/20 text-accent-red border border-accent-red/50" : "bg-bg-hover text-muted border border-border-custom"
                  }`}
                >
                  <Dumbbell size={14} /> GYM
                </button>
                <button
                  onClick={() => toggleWorkoutType("home")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isHome ? "bg-accent-green/20 text-accent-green border border-accent-green/50" : "bg-bg-hover text-muted border border-border-custom"
                  }`}
                >
                  <Home size={14} /> HOME
                </button>
              </div>

              {/* Gym day selector */}
              {isGym && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Gym Day:</span>
                    <div className="flex gap-1">
                      {gymDays.map((d) => (
                        <button
                          key={d.dayNumber}
                          onClick={() => save({ ...log!, gymDayNumber: d.dayNumber })}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            (log?.gymDayNumber || 1) === d.dayNumber
                              ? "bg-accent-red text-white"
                              : "bg-bg-hover text-muted hover:text-white"
                          }`}
                        >
                          D{d.dayNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedGymDay && (
                    <div>
                      <div className="text-xs text-accent-red font-bold mb-2">
                        {selectedGymDay.label} — Phase {phase}
                      </div>
                      <ExerciseTable
                        exercises={selectedGymDay.exercises}
                        logged={log?.exerciseLogs}
                        onUpdateSet={updateSet}
                        editable
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Home workout selector */}
              {isHome && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Home:</span>
                    <div className="flex gap-1">
                      {homeWorkouts.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => save({ ...log!, homeWorkoutId: h.id })}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            (log?.homeWorkoutId || "A") === h.id
                              ? "bg-accent-green text-white"
                              : "bg-bg-hover text-muted hover:text-white"
                          }`}
                        >
                          {h.id}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedHome && (
                    <div>
                      <div className="text-xs text-accent-green font-bold mb-2">{selectedHome.label}</div>
                      <ExerciseTable
                        exercises={selectedHome.exercises}
                        logged={log?.exerciseLogs}
                        onUpdateSet={updateSet}
                        editable
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Daily checklist */}
              <div className="border-t border-border-custom pt-3">
                <div className="text-xs text-muted font-medium mb-2">DAILY NON-NEGOTIABLES</div>
                <div className="grid grid-cols-2 gap-2">
                  {(["steps", "protein", "water", "sleep"] as const).map((key) => {
                    const labels = { steps: "10K Steps", protein: "Protein", water: "3L Water", sleep: "7h Sleep" };
                    const icons = { steps: "🚶", protein: "🥩", water: "💧", sleep: "😴" };
                    const checked = log?.dailyChecklist?.[key] || false;
                    return (
                      <button
                        key={key}
                        onClick={() => toggleChecklist(key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          checked
                            ? "bg-accent-green/20 text-accent-green border border-accent-green/30"
                            : "bg-bg-hover text-muted border border-border-custom"
                        }`}
                      >
                        <span>{icons[key]}</span>
                        <span>{labels[key]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
