"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Inbox, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart2, 
  Settings, 
  Users, 
  FileText, 
  Zap,
  Menu,
  X,
  Search,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import ComposeModal from "./modals/ComposeModal";

const navigation = [
  { name: "Inbox", href: "/", icon: Inbox, count: 12 },
  { name: "AI Queue", href: "/ai-queue", icon: Zap },
  { name: "Handled", href: "/handled", icon: CheckCircle },
  { name: "Review Needed", href: "/review", icon: AlertCircle, count: 3 },
  { name: "Snoozed", href: "/snoozed", icon: Clock },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Automation", href: "/automation", icon: Settings },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Templates", href: "/templates", icon: FileText },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isComposeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");

  React.useEffect(() => {
    const handleOpenCompose = (e: any) => {
      if (e.detail?.to) setComposeTo(e.detail.to);
      setComposeOpen(true);
    };
    window.addEventListener("open-compose", handleOpenCompose);
    return () => window.removeEventListener("open-compose", handleOpenCompose);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* ... existing code ... */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              {isSidebarOpen && <span className="text-xl font-bold tracking-tight">MailMind</span>}
            </div>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-md hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-indigo-600/10 text-indigo-400" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  {isSidebarOpen && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.count && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-800 rounded-md text-slate-400">
                          {item.count}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Settings */}
          <div className="p-4 border-t border-slate-800">
            <Link 
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
              {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="max-w-md w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search emails..." 
                className="w-full bg-slate-900 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600/50 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setComposeOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Compose</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10 shadow-inner" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-950">
          {children}
        </div>
      </main>

      <ComposeModal 
        isOpen={isComposeOpen} 
        onClose={() => {
          setComposeOpen(false);
          setComposeTo("");
        }} 
        initialTo={composeTo}
      />
    </div>
  );
}
