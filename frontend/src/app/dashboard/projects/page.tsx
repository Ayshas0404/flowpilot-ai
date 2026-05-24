"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, X, Trash2 } from "lucide-react";
import { projectsApi, Project, toArray } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";


type Status = "todo" | "in_progress" | "completed";
type Priority = "low" | "medium" | "high";

const STATUS_LABELS: Record<Status, string> = { todo: "To Do", in_progress: "In Progress", completed: "Completed" };
const PRIORITY_LABELS: Record<Priority, string> = { low: "Low", medium: "Medium", high: "High" };

function ProjectCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 border border-white/5 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 w-24 bg-white/5 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-white/5 rounded" />
      <div className="h-4 w-full bg-white/5 rounded" />
      <div className="h-4 w-2/3 bg-white/5 rounded" />
      <div className="h-1.5 w-full bg-white/5 rounded-full mt-2" />
    </div>
  );
}

function CreateProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: Project) => void }) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "todo" as Status, priority: "medium" as Priority, deadline: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const project = await projectsApi.create({
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        deadline: form.deadline || null,
      });
      success("Project created!", `"${project.title}" is ready.`);
      onCreate(project);
      onClose();
    } catch (err) {
      toastError("Failed to create project", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card border border-white/10 rounded-2xl p-6 w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Project Name</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Q4 Marketing Campaign" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20"
              placeholder="Briefly describe the project goal..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Priority</label>
              <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Deadline (optional)</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg glassmorphism text-muted-foreground hover:text-white transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors text-sm disabled:opacity-50">
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ProjectsPage() {
  const { error: toastError, success } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | Status>("all");

  useEffect(() => {
    projectsApi.list()
      .then((data) => {
        const arr = toArray(data);
        setProjects(arr);
      })
      .catch(() => {
        toastError("Could not load projects", "Please try again later.");
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      success("Project deleted");
    } catch {
      toastError("Delete failed", "Could not delete this project.");
    }
  };

  const filtered = activeTab === "all" ? projects : projects.filter((p) => p.status === activeTab);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage and track your team&apos;s initiatives.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-0">
        {(["all", "todo", "in_progress", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-4 border-b-2 transition-colors ${
              activeTab === tab ? "text-white border-primary" : "text-muted-foreground border-transparent hover:text-white"
            }`}
          >
            {tab === "all" ? "All" : STATUS_LABELS[tab as Status]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : filtered.map((project, index) => {
              const progress = project.tasks_count > 0
                ? Math.round((project.completed_tasks / project.tasks_count) * 100)
                : 0;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  className="glass-card rounded-xl p-6 border border-white/5 flex flex-col hover:border-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      project.status === "completed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      project.status === "in_progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-white/5 text-muted-foreground border-white/10"
                    }`}>
                      {STATUS_LABELS[project.status as Status] || project.status}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">{project.description || "No description."}</p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-white">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${project.status === "completed" ? "bg-green-500" : "bg-primary"}`}
                          style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.deadline || "No deadline"}
                      </div>
                      <div className={`text-[10px] font-semibold px-2 py-1 rounded ${
                        (project.priority === "high") ? "bg-red-500/10 text-red-400" :
                        (project.priority === "medium") ? "bg-orange-500/10 text-orange-400" :
                        "bg-blue-500/10 text-blue-400"
                      }`}>
                        {PRIORITY_LABELS[project.priority as Priority] || project.priority}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
      </div>

      <AnimatePresence>
        {showModal && (
          <CreateProjectModal
            onClose={() => setShowModal(false)}
            onCreate={(p) => setProjects((prev) => [p, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
