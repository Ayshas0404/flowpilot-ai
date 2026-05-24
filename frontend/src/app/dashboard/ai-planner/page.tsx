"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Copy, Loader2, Target, Layers, Calendar, CheckSquare, X, FolderKanban } from "lucide-react";
import { aiApi, tasksApi, projectsApi, AIHistoryItem, Project, toArray } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

const SUGGESTIONS = [
  "Build a fintech onboarding dashboard with KYC flow",
  "Launch a mobile app MVP in 4 weeks",
  "Migrate from REST to GraphQL for a B2B SaaS",
];

// ─── Add Sprint Modal ─────────────────────────────────────────────────────────

function AddSprintModal({
  sprint,
  projects,
  onClose,
  onAdded,
}: {
  sprint: { name: string; duration: string; tasks: string[] };
  projects: Project[];
  onClose: () => void;
  onAdded: (count: number) => void;
}) {
  const { success, error: toastError } = useToast();
  const [selectedProject, setSelectedProject] = useState<number>(projects[0]?.id ?? 0);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!selectedProject) {
      toastError("Select a project", "Choose a project to add these tasks to.");
      return;
    }
    setLoading(true);
    try {
      // Create all tasks in parallel
      await Promise.all(
        sprint.tasks.map((title) =>
          tasksApi.create({
            title,
            description: `Part of ${sprint.name}`,
            status: "todo",
            priority: "medium",
            project: selectedProject,
            due_date: null,
            assigned_to: null,
          })
        )
      );
      success(`Sprint added!`, `${sprint.tasks.length} tasks posted to your board.`);
      onAdded(sprint.tasks.length);
      onClose();
    } catch (err) {
      toastError("Failed to add sprint", err instanceof Error ? err.message : "Please try again.");
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Add Sprint to Board</h2>
            <p className="text-xs text-muted-foreground">{sprint.tasks.length} tasks will be created as &ldquo;To Do&rdquo;</p>
          </div>
        </div>

        {/* Task preview */}
        <div className="mb-5 max-h-40 overflow-y-auto space-y-1.5 pr-1">
          {sprint.tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckSquare className="w-4 h-4 text-white/20 mt-0.5 flex-shrink-0" />
              <span>{task}</span>
            </div>
          ))}
        </div>

        {/* Project selector */}
        {projects.length > 0 ? (
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-white/80">Add to Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 mb-6">
            No projects found. Create a project first from the Projects page.
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg glassmorphism text-muted-foreground hover:text-white text-sm">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || projects.length === 0}
            className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add to Board"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AIPlannerPage() {
  const { error: toastError, success } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AIHistoryItem | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeSprint, setActiveSprint] = useState<{ name: string; duration: string; tasks: string[] } | null>(null);

  // Load projects for the Add Sprint modal
  useEffect(() => {
    projectsApi.list()
      .then((data) => setProjects(toArray(data)))
      .catch(() => {}); // silently fail — user will see "No projects" in modal
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const data = await aiApi.generate(prompt);
      setResult(data);
      success("Plan generated!", "Your AI sprint plan is ready.");
    } catch (err) {
      toastError("Generation failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = result.generated_output.sprints
      .map((s) => `## ${s.name} (${s.duration})\n${s.tasks.map((t) => `- ${t}`).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    success("Copied to clipboard!");
  };

  const output = result?.generated_output;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand mb-2 shadow-lg shadow-primary/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">AI Sprint Planner</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Describe your goal and FlowPilot AI will generate a complete sprint plan instantly.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="glass-card rounded-2xl p-2 border border-white/10 shadow-2xl">
        <form onSubmit={handleGenerate} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Build a fintech onboarding dashboard with KYC flow..."
            className="w-full bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-muted-foreground/50 text-base"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="flex-shrink-0 px-6 bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:text-muted-foreground text-white rounded-xl font-medium transition-all flex items-center gap-2 m-2"
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              : <><Send className="w-4 h-4" /> Generate</>
            }
          </button>
        </form>
      </div>

      {/* Suggestions */}
      {!result && !isGenerating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center gap-3">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => setPrompt(s)}
              className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/5 text-sm text-muted-foreground hover:text-white transition-colors">
              {s}
            </button>
          ))}
        </motion.div>
      )}

      {/* Skeleton while generating */}
      {isGenerating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl border border-white/5 p-6 animate-pulse">
              <div className="h-5 w-48 bg-white/10 rounded mb-4" />
              <div className="space-y-3">
                {[1,2,3,4,5].map((j) => <div key={j} className="h-4 bg-white/5 rounded w-full" />)}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {output && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <div className="text-sm text-primary font-medium mb-1">Generated Plan for</div>
                <h2 className="text-xl font-semibold text-white">&ldquo;{output.goal}&rdquo;</h2>
                <div className="text-sm text-muted-foreground mt-1">
                  Estimated: <span className="text-white">{output.estimated_total_duration}</span>
                </div>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white glassmorphism px-4 py-2 rounded-lg transition-colors flex-shrink-0">
                <Copy className="w-4 h-4" /> Copy Plan
              </button>
            </div>

            {/* Sprint Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {output.sprints.map((sprint, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-primary flex-shrink-0" /> {sprint.name}
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-muted-foreground flex items-center gap-1.5 flex-shrink-0">
                      <Calendar className="w-3 h-3" /> {sprint.duration}
                    </span>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {sprint.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground group">
                        <CheckSquare className="w-4 h-4 mt-0.5 text-white/20 group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="group-hover:text-white transition-colors leading-snug">{task}</span>
                      </li>
                    ))}
                  </ul>
                  {/* ✅ FULLY FUNCTIONAL: opens modal to post tasks to a real project */}
                  <button
                    onClick={() => setActiveSprint(sprint)}
                    className="w-full mt-5 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-all border border-primary/20 hover:border-primary/40 flex items-center justify-center gap-2"
                  >
                    <FolderKanban className="w-4 h-4" /> Add Sprint to Board
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Milestones */}
            <div className="glass-card rounded-xl p-6 border border-white/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Key Milestones</h4>
                <div className="flex flex-wrap gap-3">
                  {output.milestones.map((m, i) => (
                    <span key={i} className="text-sm text-muted-foreground flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" /> {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Sprint to Board Modal */}
      <AnimatePresence>
        {activeSprint && (
          <AddSprintModal
            sprint={activeSprint}
            projects={projects}
            onClose={() => setActiveSprint(null)}
            onAdded={(count) => {
              success(`${count} tasks added!`, "Head to the Tasks board to see them.");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
