"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, User, Monitor, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const NAV = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Monitor },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
  });

  const initials = `${form.first_name?.[0] ?? ""}${form.last_name?.[0] ?? ""}`.toUpperCase() || "U";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: call PATCH /api/auth/me/
    success("Profile saved!", "Your changes have been applied.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences and settings.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="flex flex-col gap-1 md:sticky md:top-24">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                activeTab === id ? "bg-white/10 text-white font-medium" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {initials}
                </div>
                <div>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2">
                    Change Avatar
                  </button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">First Name</label>
                    <input type="text" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Last Name</label>
                    <input type="text" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3}
                    placeholder="Tell your team a bit about yourself..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Security</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); success("Password updated!"); }}>
                {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                  <div key={label} className="space-y-2">
                    <label className="text-sm font-medium text-white/80">{label}</label>
                    <input type="password" placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                ))}
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium">
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {(activeTab === "notifications" || activeTab === "appearance") && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2 capitalize">{activeTab}</h3>
              <p className="text-sm text-muted-foreground">These settings will be available in the next update.</p>
            </motion.div>
          )}

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-xl border border-red-500/20 p-6">
            <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={logout} className="bg-white/5 hover:bg-white/10 text-muted-foreground border border-white/10 px-4 py-2 rounded-lg text-sm font-medium">
                Sign Out
              </button>
              <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
