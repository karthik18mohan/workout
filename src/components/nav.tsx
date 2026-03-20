"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, CalendarDays, Shield, Target, Download } from "lucide-react";
import { downloadExport } from "@/lib/storage";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Weekly", icon: CalendarDays },
  { href: "/monthly", label: "Monthly", icon: Calendar },
  { href: "/non-negotiables", label: "Rules", icon: Shield },
  { href: "/targets", label: "Targets", icon: Target },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 bg-bg-card border-b border-border-custom">
        <h1 className="text-xl font-bold tracking-wider">
          <span className="text-accent-red">OPERATION</span>{" "}
          <span className="text-accent-orange">SHRED</span>
        </h1>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === l.href
                  ? "bg-accent-red/20 text-accent-red"
                  : "text-muted hover:text-white hover:bg-bg-hover"
              )}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          ))}
          <button
            onClick={downloadExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-white hover:bg-bg-hover transition-colors ml-2"
          >
            <Download size={16} />
            Export
          </button>
        </nav>
      </header>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border-custom flex justify-around py-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors",
              pathname === l.href ? "text-accent-red" : "text-muted"
            )}
          >
            <l.icon size={20} />
            {l.label}
          </Link>
        ))}
        <button
          onClick={downloadExport}
          className="flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium text-muted"
        >
          <Download size={20} />
          Export
        </button>
      </nav>
    </>
  );
}
