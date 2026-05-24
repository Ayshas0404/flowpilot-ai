"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, FolderKanban, TrendingUp, Sparkles } from "lucide-react";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { analyticsApi, AnalyticsData, projectsApi, Project, toArray } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";


function StatSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 flex flex-col gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-white/5" />
      <div className="space-y-2">
        <div className="h-8 w-16 bg-white/5 rounded" />
        <div className="h-4 w-28 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.first_name || "there";

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsData, projectsData] = await Promise.all([
          analyticsApi.get(),
          projectsApi.list(),
        ]);
        setAnalytics(analyticsData);
        const projects = toArray(projectsData);
        setRecentProjects(projects.slice(0, 3));
      } catch {
        toastError("Could not load dashboard", "Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    {
      name: "Active Projects",
      value: loading ? "—" : String(analytics?.active_projects ?? 0),
      change: "",
      icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10",
    },
    {
      name: "Tasks Completed",
      value: loading ? "—" : String(analytics?.completed_tasks ?? 0),
      change: "",
      icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10",
    },
    {
      name: "Upcoming Deadlines",
      value: loading ? "—" : "0",
      change: "",
      icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10",
    },
    {
      name: "Productivity Score",
      value: loading ? "—" : `${analytics?.productivity_score ?? 0}%`,
      change: "",
      icon: TrendingUp, color: "text-primary", bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening in your workspace today.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hidden sm:block">
          New Project
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="glass-card rounded-xl p-5 border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground">{stat.name}</div>
                    <div className="text-xs text-muted-foreground/60 mt-1">{stat.change}</div>
                  </div>
                </motion.div>
              );
            })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl border border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Productivity Trend</h3>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Last 7 days</span>
          </div>
          <ProductivityChart data={analytics?.productivity_data} />
        </div>

        {/* AI Insights */}
        <div className="glass-card rounded-xl border border-white/5 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> AI Insights
          </h3>
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            No new insights today. Connect AI services to see insights here.
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="glass-card rounded-xl border border-white/5 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
          <a href="/dashboard/projects" className="text-sm text-primary hover:text-primary/80 transition-colors">View all →</a>
        </div>
        <div className="divide-y divide-white/5">
          {recentProjects.map((project) => {
            const progress = project.tasks_count > 0
              ? Math.round((project.completed_tasks / project.tasks_count) * 100)
              : 0;
            return (
              <div key={project.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 group">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate group-hover:text-primary transition-colors">{project.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{project.description}</div>
                </div>
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <div className="w-24">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
