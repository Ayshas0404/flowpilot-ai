"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { analyticsApi, AnalyticsData } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { TrendingUp, CheckCircle2, Target, Zap } from "lucide-react";

// Chart data is now fetched from the API

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: "hsl(240 10% 5%)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" },
  itemStyle: { color: "#fff" },
  cursor: { fill: "rgba(255,255,255,0.03)" },
};

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground/60 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { error: toastError } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.get()
      .then(setData)
      .catch(() => toastError("Using demo analytics", "Connect backend for live data."))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    { label: "Tasks Completed", value: loading ? "—" : String(data?.completed_tasks ?? 0), sub: "All time", icon: CheckCircle2, color: "bg-green-500/20" },
    { label: "Active Projects", value: loading ? "—" : String(data?.active_projects ?? 0), sub: "Currently running", icon: Target, color: "bg-blue-500/20" },
    { label: "Completion Rate", value: loading ? "—" : `${data?.completion_rate ?? 0}%`, sub: "This month", icon: TrendingUp, color: "bg-primary/20" },
    { label: "Productivity Score", value: loading ? "—" : `${data?.productivity_score ?? 0}`, sub: "+0 vs last week", icon: Zap, color: "bg-orange-500/20" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground">Gain insights into your team&apos;s performance and productivity.</p>
        </div>
        <select className="bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 py-1.5 outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
        </select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Productivity Trend – full width */}
      <div className="glass-card rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Overall Productivity Trend</h3>
        <ProductivityChart data={data?.productivity_data} />
      </div>

      {/* Two-col charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sprint Velocity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Sprint Velocity</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.velocity_data || []} barGap={4}>
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                <Bar dataKey="added" name="Added" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Status Breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Task Status Breakdown</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.pie_data || []} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                  {(data?.pie_data || []).map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Legend formatter={(v) => <span style={{ color: "#888", fontSize: 12 }}>{v}</span>} />
                <Tooltip {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Completion Rate Area chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Task Completion Rate Over Time</h3>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.velocity_data || []}>
              <defs>
                <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gCompleted)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
