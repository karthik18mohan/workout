"use client";

import { motion } from "framer-motion";
import { TrendingUp, Home, Beef, Timer, Footprints, Moon, Droplets, Dumbbell } from "lucide-react";

const rules = [
  {
    icon: TrendingUp,
    title: "Progressive Overload",
    desc: "Increase weight, reps, or sets every week. If you hit all target reps, go heavier next session.",
    color: "text-accent-red",
    bg: "bg-accent-red/10",
  },
  {
    icon: Home,
    title: "Never Skip Home Workouts",
    desc: "On rest days from the gym, always do a home workout. No zero days.",
    color: "text-accent-green",
    bg: "bg-accent-green/10",
  },
  {
    icon: Beef,
    title: "Hit Protein Target",
    desc: "Minimum 150g protein daily. Track it. No excuses.",
    color: "text-accent-orange",
    bg: "bg-accent-orange/10",
  },
  {
    icon: Timer,
    title: "Rest Times",
    desc: "60-90 seconds between sets. 2 minutes max for heavy compounds. Stay disciplined.",
    color: "text-accent-red",
    bg: "bg-accent-red/10",
  },
  {
    icon: Footprints,
    title: "10,000 Steps Daily",
    desc: "Walk every single day. Non-negotiable NEAT activity for fat loss.",
    color: "text-accent-green",
    bg: "bg-accent-green/10",
  },
  {
    icon: Moon,
    title: "7+ Hours Sleep",
    desc: "Recovery happens when you sleep. Muscles grow at night. Prioritize rest.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Droplets,
    title: "3 Liters Water",
    desc: "Stay hydrated. Carry a bottle everywhere. Minimum 3L daily.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Dumbbell,
    title: "Abs Every Gym Day",
    desc: "Cable crunches, planks, hanging raises — abs are trained every gym session.",
    color: "text-accent-orange",
    bg: "bg-accent-orange/10",
  },
];

export default function NonNegotiablesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h2 className="text-2xl font-bold mb-2">
        <span className="text-accent-red">NON-</span>NEGOTIABLES
      </h2>
      <p className="text-sm text-muted mb-6">The 8 rules you never break. Period.</p>

      <div className="space-y-3">
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${rule.bg} border border-border-custom rounded-xl p-4 flex gap-4`}
          >
            <div className={`${rule.color} mt-0.5`}>
              <rule.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{rule.title}</h3>
              <p className="text-xs text-muted mt-1">{rule.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
