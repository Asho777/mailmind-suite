"use client";

import React from "react";
import { 
  BarChart2, 
  Clock, 
  Zap, 
  TrendingUp, 
  Mail, 
  Users, 
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [range, setRange] = React.useState("30D");
  const [showHistory, setShowHistory] = React.useState(false);

  // Dynamic Mock Data based on Range
  const getData = (r: string) => {
    switch(r) {
      case "7D": return {
        timeSaved: "3.2 hrs",
        autoHandled: 184,
        analysed: 512,
        contacts: 42,
        chart: [30, 45, 25, 60, 40, 50, 35],
        distribution: [
          { label: "Urgent", count: 28, percent: 12 },
          { label: "Important", count: 82, percent: 35 },
          { label: "Normal", count: 214, percent: 43 },
          { label: "Low/Noise", count: 54, percent: 10 },
        ]
      };
      case "3M": return {
        timeSaved: "42.8 hrs",
        autoHandled: "2,410",
        analysed: "7,850",
        contacts: 412,
        chart: [60, 80, 55, 90, 70, 85, 65, 95, 100, 80, 75, 85],
        distribution: [
          { label: "Urgent", count: 412, percent: 18 },
          { label: "Important", count: 1240, percent: 32 },
          { label: "Normal", count: 3120, percent: 40 },
          { label: "Low/Noise", count: 840, percent: 10 },
        ]
      };
      case "1Y": return {
        timeSaved: "164 hrs",
        autoHandled: "9,240",
        analysed: "28,400",
        contacts: "1.2k",
        chart: [70, 60, 85, 95, 100, 85, 75, 80, 90, 95, 85, 100],
        distribution: [
          { label: "Urgent", count: "1.8k", percent: 15 },
          { label: "Important", count: "4.2k", percent: 35 },
          { label: "Normal", count: "8.6k", percent: 40 },
          { label: "Low/Noise", count: "2.1k", percent: 10 },
        ]
      };
      default: return { // 30D
        timeSaved: "14.5 hrs",
        autoHandled: 842,
        analysed: "2,418",
        contacts: 156,
        chart: [40, 60, 45, 90, 65, 80, 55, 70, 85, 45, 60, 75, 95, 100],
        distribution: [
          { label: "Urgent", count: 124, percent: 15 },
          { label: "Important", count: 342, percent: 30 },
          { label: "Normal", count: 856, percent: 45 },
          { label: "Low/Noise", count: 124, percent: 10 },
        ]
      };
    }
  };

  const currentData = getData(range);

  const handleDownloadReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange: range,
      heroStats: currentData,
      efficiencyScore: "94%"
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MailMind_Full_Report_${range}_${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("Full Analytics Report generated and downloaded successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-slate-400">Insights into your email efficiency and AI performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {["7D", "30D", "3M", "1Y"].map((r) => (
            <button 
              key={r} 
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                r === range ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Time Saved", value: currentData.timeSaved, icon: Clock, color: "text-emerald-400", trend: "+12%" },
          { label: "Auto-Handled", value: currentData.autoHandled, icon: Zap, color: "text-amber-400", trend: "+5%" },
          { label: "Emails Analysed", value: currentData.analysed, icon: Mail, color: "text-indigo-400", trend: "+8%" },
          { label: "Active Contacts", value: currentData.contacts, icon: Users, color: "text-blue-400", trend: "+2%" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-950 border border-slate-800", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-100 tracking-tight group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200">Email Volume & AI Action</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Human Reviewed
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Auto-Handled
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-2 px-4 pb-4">
            {currentData.chart.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                <div 
                  className="w-full bg-indigo-500/20 rounded-t-sm group-hover:bg-indigo-500/40 transition-all animate-in slide-in-from-bottom duration-500" 
                  style={{ height: `${h * 0.6}%`, transitionDelay: `${i * 30}ms` }} 
                />
                <div 
                  className="w-full bg-emerald-500/40 rounded-b-sm group-hover:bg-emerald-500/60 transition-all animate-in slide-in-from-bottom duration-500" 
                  style={{ height: `${h * 0.4}%`, transitionDelay: `${i * 30}ms` }} 
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4">
            <span>Start</span>
            <span>Middle</span>
            <span>End</span>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-8">
          <h3 className="font-bold text-slate-200">Priority Distribution</h3>
          <div className="space-y-6">
            {currentData.distribution.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{p.label}</span>
                  <span className="text-slate-100 font-bold">{p.count}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", "bg-indigo-500")} style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-800">
            <button 
              onClick={handleDownloadReport}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Download Full Report <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600/10 via-slate-900/50 to-slate-900/50 border border-indigo-500/20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center relative shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentData.timeSaved.split(' ')[0]}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Hours</div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> Efficiency across {range}!
              </h3>
              <p className="text-slate-400 leading-relaxed max-w-xl">
                Based on your selection, MailMind has handled {currentData.autoHandled} interactions autonomously, reclaiming significant time for your core business.
              </p>
            </div>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              {showHistory ? "Hide Time History" : "View Time History"}
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-400">
              <Clock className="w-5 h-5" /> Detailed Time History
            </h4>
            <div className="space-y-4">
              {[
                { date: "May 10, 2026", action: "Bulk Auto-Categorization", time: "45 mins", saved: "12 mins" },
                { date: "May 09, 2026", action: "AI Draft Generation (24 items)", time: "2.5 hrs", saved: "1.2 hrs" },
                { date: "May 08, 2026", action: "Automated Rules Cleanup", time: "1 hr", saved: "30 mins" },
                { date: "May 07, 2026", action: "Smart Filter Application", time: "15 mins", saved: "5 mins" },
                { date: "May 06, 2026", action: "AI Reply Orchestration", time: "4 hrs", saved: "2.1 hrs" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-200">{item.action}</div>
                    <div className="text-xs text-slate-500">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">+{item.saved} saved</div>
                    <div className="text-[10px] text-slate-600 uppercase font-bold">Total Duration: {item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
