"use client";

import { Exercise, ExerciseSet } from "@/lib/types";

interface ExerciseTableProps {
  exercises: Exercise[];
  logged?: Record<string, ExerciseSet[]>;
  onUpdateSet?: (exerciseName: string, setIndex: number, field: "weight" | "reps", value: string) => void;
  editable?: boolean;
}

export default function ExerciseTable({ exercises, logged, onUpdateSet, editable = false }: ExerciseTableProps) {
  return (
    <div className="space-y-2">
      {exercises.map((ex) => {
        const loggedSets = logged?.[ex.name] || ex.sets;
        return (
          <div key={ex.name} className="bg-[#111] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-white">{ex.name}</span>
              {ex.note && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-orange/20 text-accent-orange font-medium">
                  {ex.note}
                </span>
              )}
            </div>
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-xs">
              <span className="text-muted font-medium">Set</span>
              <span className="text-muted font-medium">Weight</span>
              <span className="text-muted font-medium">Reps</span>
              {loggedSets.map((s, i) => (
                <SetRow
                  key={i}
                  index={i}
                  set={s}
                  editable={editable}
                  onChange={(field, val) => onUpdateSet?.(ex.name, i, field, val)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SetRow({
  index,
  set,
  editable,
  onChange,
}: {
  index: number;
  set: ExerciseSet;
  editable: boolean;
  onChange?: (field: "weight" | "reps", val: string) => void;
}) {
  return (
    <>
      <span className="text-muted">{index + 1}</span>
      {editable ? (
        <>
          <input
            type="text"
            className="bg-bg-hover border border-border-custom rounded px-2 py-0.5 text-white text-xs w-full"
            defaultValue={String(set.weight)}
            onBlur={(e) => onChange?.("weight", e.target.value)}
          />
          <input
            type="text"
            className="bg-bg-hover border border-border-custom rounded px-2 py-0.5 text-white text-xs w-full"
            defaultValue={String(set.reps)}
            onBlur={(e) => onChange?.("reps", e.target.value)}
          />
        </>
      ) : (
        <>
          <span className="text-white">{set.weight}</span>
          <span className="text-white">{set.reps}</span>
        </>
      )}
    </>
  );
}
