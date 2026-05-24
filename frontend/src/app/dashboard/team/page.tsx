"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MoreVertical, UserPlus, X } from "lucide-react";
import { teamApi, projectsApi, TeamMember, Project, toArray } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";


type MemberWithStatus = TeamMember & { status?: string };

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const STATUS_COLORS: Record<string, string> = {
  Online: "bg-green-400",
  Offline: "bg-gray-400",
  "In a meeting": "bg-orange-400",
};
const STATUS_BADGE: Record<string, string> = {
  Online: "bg-green-500/10 text-green-400 border-green-500/20",
  Offline: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  "In a meeting": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};
const AVATAR_COLORS = ["bg-gradient-brand", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-orange-500"];

/* ─── Invite Modal ───────────────────────────────────────────────────────── */

function InviteModal({
  projects,
  onClose,
  onInvited,
}: {
  projects: Project[];
  onClose: () => void;
  onInvited: (m: TeamMember) => void;
}) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    project: projects[0]?.id ?? 0,
    role: "member",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) {
      toastError("Email required", "Please enter an email address.");
      return;
    }
    if (!form.project) {
      toastError("Select a project", "Create a project first to invite members.");
      return;
    }
    setLoading(true);
    try {
      const member = await teamApi.invite({
        email: form.email.trim().toLowerCase(),
        project: form.project,
        role: form.role,
      });
      success("Member invited!", `${form.email} has been added to the project.`);
      onInvited(member);
      onClose();
    } catch (err) {
      toastError(
        "Invite failed",
        err instanceof Error ? err.message : "Please try again."
      );
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-1">Invite Member</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Add a team member to a project by email.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              Email Address
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="colleague@example.com"
            />
          </div>

          {projects.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Project
              </label>
              <select
                value={form.project}
                onChange={(e) =>
                  setForm((f) => ({ ...f, project: Number(e.target.value) }))
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Role</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value }))
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg glassmorphism text-muted-foreground hover:text-white text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm disabled:opacity-50"
            >
              {loading ? "Inviting..." : "Send Invite"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Team Page ───────────────────────────────────────────────────────────── */

export default function TeamPage() {
  const { error: toastError } = useToast();
  const [members, setMembers] = useState<MemberWithStatus[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [teamData, projectsData] = await Promise.all([
          teamApi.list(),
          projectsApi.list(),
        ]);
        setMembers(toArray(teamData));
        setProjects(toArray(projectsData));
      } catch {
        toastError("Could not load team data", "Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Members</h1>
          <p className="text-sm text-muted-foreground">{members.length} members in your workspace.</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-3 w-48 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <UserPlus className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No team members yet.</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Invite someone to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Member</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member, index) => {
                  const memberStatus = member.status ?? "Online";
                  const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];
                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${avatarBg}`}>
                            {getInitials(member.user_name || "User")}
                          </div>
                          <div>
                            <div className="font-medium text-white">{member.user_name}</div>
                            <div className="text-xs text-muted-foreground">{member.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">{member.role}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_BADGE[memberStatus] ?? STATUS_BADGE["Online"]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[memberStatus] ?? STATUS_COLORS["Online"]}`} />
                          {memberStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showInvite && (
          <InviteModal
            projects={projects}
            onClose={() => setShowInvite(false)}
            onInvited={(m) => setMembers((prev) => [m, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
