"use client";

import { Bell, Search, Menu } from "lucide-react";

export function DashboardNavbar() {
  return (
    <header className="h-16 border-b border-white/5 glassmorphism sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search projects, tasks..." 
            className="w-full bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute 0 right-0 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 border border-white/10 flex items-center justify-center text-sm font-medium text-white cursor-pointer">
          AD
        </div>
      </div>
    </header>
  );
}
