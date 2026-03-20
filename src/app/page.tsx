"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import DayCard from "@/components/day-card";
import { getMonday, getWeekDays, formatDate, getWeekNumber, getPhaseFromWeek } from "@/lib/utils";

export default function WeeklyView() {
  const [weekOffset, setWeekOffset] = useState(0);

  const monday = useMemo(() => {
    const today = new Date();
    const m = getMonday(today);
    m.setDate(m.getDate() + weekOffset * 7);
    return m;
  }, [weekOffset]);

  const days = useMemo(() => getWeekDays(monday), [monday]);
  const todayStr = formatDate(new Date());
  const weekNum = getWeekNumber(monday);
  const phase = getPhaseFromWeek(weekNum);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Week header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="p-2 rounded-lg bg-bg-card border border-border-custom hover:bg-bg-hover transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="text-lg font-bold">
            Week {weekNum > 0 && weekNum <= 12 ? weekNum : "—"}
          </div>
          <div className="text-xs text-muted">
            {weekNum >= 1 && weekNum <= 12 ? (
              <span>
                Phase {phase}{" "}
                <span className="text-accent-orange">
                  ({phase === 1 ? "Foundation" : phase === 2 ? "Supersets" : "Peak"})
                </span>
              </span>
            ) : (
              "Outside program range"
            )}
          </div>
          <div className="text-xs text-muted mt-0.5">
            {days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
            {days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          className="p-2 rounded-lg bg-bg-card border border-border-custom hover:bg-bg-hover transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Today button */}
      {weekOffset !== 0 && (
        <button
          onClick={() => setWeekOffset(0)}
          className="mb-4 mx-auto block text-xs text-accent-red hover:underline"
        >
          Jump to today
        </button>
      )}

      {/* Day cards */}
      <motion.div
        key={weekOffset}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-3"
      >
        {days.map((date) => (
          <DayCard
            key={formatDate(date)}
            date={date}
            isToday={formatDate(date) === todayStr}
          />
        ))}
      </motion.div>
    </div>
  );
}
