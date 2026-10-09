"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Brain,
  History,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Live Monitoring",
    href: "/dashboard/live",
    icon: Radio,
  },
  {
    name: "AI Classification",
    href: "/dashboard/ai",
    icon: Brain,
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/10 bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-5">
        <h1 className="text-xl font-bold tracking-tight">
          SmartSeg <span className="text-emerald-400">AI</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Smart Waste Management
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                active
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-300">
              System Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}