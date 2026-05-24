"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, LayoutDashboard, Sparkles, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glassmorphism border-b-0 border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)'}}>
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FlowPilot<span className="text-primary">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="relative container mx-auto px-4 pb-20 pt-10 text-center flex flex-col items-center">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glassmorphism text-sm font-medium text-primary mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>FlowPilot 2.0 is now live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] mb-6"
          >
            Manage Projects Faster with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI-Powered</span> Collaboration
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            The intelligent workspace that plans your sprints, tracks productivity, and keeps your team aligned. Built for modern, fast-moving startups.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 transition-all">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-full glassmorphism hover:bg-white/10 text-white font-medium flex items-center justify-center transition-all">
              View Demo
            </Link>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-5xl mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="rounded-xl border border-white/10 glass-card p-2 md:p-4 shadow-2xl relative overflow-hidden">
              <div className="aspect-[16/9] rounded-lg bg-secondary/50 border border-white/5 relative overflow-hidden flex flex-col">
                {/* Mock UI Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="h-6 w-48 bg-white/5 rounded-md" />
                </div>
                {/* Mock UI Body */}
                <div className="flex-1 p-6 flex gap-6">
                  <div className="w-48 hidden md:flex flex-col gap-3">
                    <div className="h-8 bg-white/5 rounded-md w-full" />
                    <div className="h-8 bg-white/5 rounded-md w-3/4" />
                    <div className="h-8 bg-primary/20 rounded-md w-5/6" />
                    <div className="h-8 bg-white/5 rounded-md w-full mt-4" />
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="h-24 bg-white/5 rounded-xl border border-white/5 flex items-center px-6">
                       <div className="h-8 w-1/3 bg-white/10 rounded-md" />
                    </div>
                    <div className="flex gap-4 flex-1">
                      <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                        <div className="h-6 w-24 bg-white/10 rounded-md mb-2" />
                        <div className="h-16 bg-white/5 rounded-lg" />
                        <div className="h-16 bg-white/5 rounded-lg" />
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                        <div className="h-6 w-24 bg-white/10 rounded-md mb-2" />
                        <div className="h-16 bg-primary/20 rounded-lg border border-primary/30" />
                        <div className="h-16 bg-white/5 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to ship faster</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Stop managing tools and start managing projects. FlowPilot brings everything together in one beautiful, lightning-fast interface.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <FeatureCard 
                icon={<BrainCircuit className="w-6 h-6 text-primary" />}
                title="AI Sprint Planning"
                description="Describe your goal, and let our AI generate a complete sprint plan with tasks, timelines, and priorities instantly."
              />
              <FeatureCard 
                icon={<LayoutDashboard className="w-6 h-6 text-primary" />}
                title="Beautiful Dashboards"
                description="Get a bird's-eye view of your entire organization with customizable, real-time analytics dashboards."
              />
              <FeatureCard 
                icon={<Users className="w-6 h-6 text-primary" />}
                title="Seamless Collaboration"
                description="Keep your team aligned with real-time updates, integrated comments, and intelligent notification routing."
              />
            </div>
          </div>
        </section>

        {/* Stats/Social Proof Section */}
        <section className="py-20 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">Trusted by innovative teams worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
              {/* Mock Logos */}
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 rounded bg-white" /> Acme Corp</div>
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 rounded-full bg-white" /> Globex</div>
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 rotate-45 bg-white" /> Initech</div>
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 rounded-sm bg-white" /> Soylent</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-white">FlowPilot<span className="text-primary">AI</span></span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 FlowPilot AI. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl glass-card border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
