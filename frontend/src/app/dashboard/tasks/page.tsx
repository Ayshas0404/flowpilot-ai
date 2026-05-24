"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, MoreHorizontal, X } from "lucide-react";
import { tasksApi, projectsApi, Task, Project, toArray } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";


const COLUMNS = [
  { id: "todo",        title: "To Do",       color: "border-gray-500/50" },
  { id: "in_progress", title: "In Progress",  color: "border-blue-500/50" },
  { id: "review",      title: "In Review",    color: "border-orange-500/50" },
  { id: "done",        title: "Done",         color: "border-green-500/50" },
];

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high";

function CreateTaskModal({
  projects,
  onClose,
  onCreate,
}: {
  projects: Project[];
  onClose: () => void;
  onCreate: (t: Task) => void;
}) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    project: projects[0]?.id ?? 0,
    due_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.project) { toastError("Select a project", "Please select a project for this task."); return; }
    setLoading(true);
    try {
      const task = await tasksApi.create({
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        project: form.project,
        due_date: form.due_date || null,
        assigned_to: null,
      });
      success("Task created!", `"${task.title}" added to board.`);
      onCreate(task);
      onClose();
    } catch (err) {
      toastError("Failed to create task", err instanceof Error ? err.message : "Please try again.");
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
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold text-white mb-6">New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Task Title</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Design login flow" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Priority</label>
              <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          {projects.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Project</label>
              <select value={form.project} onChange={(e) => setForm((f) => ({ ...f, project: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Due Date (optional)</label>
            <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg glassmorphism text-muted-foreground hover:text-white text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm disabled:opacity-50">
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function TasksPage() {
  const { error: toastError, success } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksData, projectsData] = await Promise.all([
          tasksApi.list(),
          projectsApi.list(),
        ]);
        const t = toArray(tasksData);
        const p = toArray(projectsData);
        setTasks(t);
        setProjects(p);
      } catch {
        toastError("Could not load tasks", "Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await tasksApi.update(taskId, { status: newStatus });
      success("Task updated");
    } catch {
      toastError("Update failed");
    }
  };

  const handleDelete = async (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await tasksApi.delete(taskId);
    } catch {
      toastError("Delete failed");
    }
  };

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks Board</h1>
          <p className="text-sm text-muted-foreground">{tasks.length} tasks across {COLUMNS.length} stages</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glassmorphism text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/5">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-[300px] flex-shrink-0 space-y-3">
              <div className="h-6 w-28 bg-white/5 rounded animate-pulse" />
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-6 h-full min-w-max">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="w-[300px] flex flex-col max-h-full">
                  <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {col.title}
                      <span className="bg-white/10 text-muted-foreground text-xs px-2 py-0.5 rounded-full">{colTasks.length}</span>
                    </h3>
                    <button onClick={() => setShowModal(true)} className="text-muted-foreground hover:text-white">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {colTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.04 }}
                        className="glass-card rounded-lg p-4 border border-white/5 hover:border-white/20 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={`text-[10px] font-semibold px-2 py-1 rounded ${
                            task.priority === "high" ? "bg-red-500/10 text-red-400" :
                            task.priority === "medium" ? "bg-orange-500/10 text-orange-400" :
                            "bg-blue-500/10 text-blue-400"
                          }`}>
                            {task.priority?.toUpperCase() ?? "MEDIUM"}
                          </div>
                          <button onClick={() => handleDelete(typeof task.id === "string" ? parseInt(task.id) : task.id)}
                            className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-white mb-3 leading-snug">{task.title}</p>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(typeof task.id === "string" ? parseInt(task.id) : task.id, e.target.value as TaskStatus)}
                            className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-1 text-muted-foreground focus:outline-none"
                          >
                            {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                          </select>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-6 h-6 rounded-full bg-gradient-brand border border-background flex items-center justify-center text-[10px] text-white">
                              {task.assigned_to_name?.[0] ?? "U"}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="border-2 border-dashed border-white/5 rounded-xl h-20 flex items-center justify-center text-xs text-muted-foreground/50">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <CreateTaskModal
            projects={projects}
            onClose={() => setShowModal(false)}
            onCreate={(t) => setTasks((prev) => [t, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
