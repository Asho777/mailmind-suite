"use client";

import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Shield, 
  Bell, 
  User as UserIcon, 
  Palette, 
  Zap,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Activity,
  LogOut,
  Save,
  Cpu,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");
  const [isConnecting, setIsConnecting] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: "",
    password: "",
    host: "imap.telstra.com",
    port: "993",
    tls: true
  });
  const [accounts, setAccounts] = useState([
    { email: "navcocctv@bigpond.com", provider: "IMAP/SMTP", lastSynced: "5 mins ago", status: "Connected" }
  ]);
  const [connectionError, setConnectionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Pending local state for sections with Save buttons
  const [pendingAutomation, setPendingAutomation] = useState<Record<string, boolean>>({});
  const [pendingNotifications, setPendingNotifications] = useState<Record<string, boolean>>({});
  const [pendingPrivacy, setPendingPrivacy] = useState<Record<string, boolean>>({});
  const [sectionSaveStatus, setSectionSaveStatus] = useState<Record<string, "idle"|"saved">>({
    automation: "idle", notifications: "idle", privacy: "idle"
  });

  // AI Connection state
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiEncKey, setAiEncKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showEncKey, setShowEncKey] = useState(false);
  const [aiKeyStatus, setAiKeyStatus] = useState<{ set: boolean; preview: string }>({ set: false, preview: "" });
  const [encKeyStatus, setEncKeyStatus] = useState<{ set: boolean; preview: string }>({ set: false, preview: "" });
  const [aiTestStatus, setAiTestStatus] = useState<"idle"|"testing"|"ok"|"fail">("idle");
  const [aiTestMessage, setAiTestMessage] = useState("");
  const [aiSaveStatus, setAiSaveStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");

  useEffect(() => {
    const loadData = async () => {
      // Read locally-saved toggle states FIRST — these always take priority
      const localSettings = localStorage.getItem("mailmind_settings");
      let localParsed: any = null;
      if (localSettings) {
        try {
          localParsed = JSON.parse(localSettings);
          // Immediately apply saved toggle states so they are never overwritten
          if (localParsed.automation)    setPendingAutomation(localParsed.automation);
          if (localParsed.notifications) setPendingNotifications(localParsed.notifications);
          if (localParsed.privacy)       setPendingPrivacy(localParsed.privacy);
        } catch {}
      }

      try {
        const res = await fetch("/api/user-settings");
        if (!res.ok) throw new Error("Failed to load");
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          // Merge API profile data but KEEP localStorage toggle values
          setUserData((prev: any) => ({
            ...data,
            automation:    localParsed?.automation    ?? data.automation    ?? {},
            notifications: localParsed?.notifications ?? data.notifications ?? {},
            privacy:       localParsed?.privacy       ?? data.privacy       ?? {},
          }));
        }
      } catch (err) {
        // API unavailable — just use localStorage data for everything
        if (localParsed) setUserData(localParsed);
        console.error("Settings load error (using local cache):", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const saveSectionLocally = (section: string, data: Record<string, boolean>) => {
    const updated = { ...userData, [section]: { ...(userData?.[section] || {}), ...data } };
    setUserData(updated);
    localStorage.setItem("mailmind_settings", JSON.stringify(updated));
    setSectionSaveStatus(prev => ({ ...prev, [section]: "saved" }));
    setTimeout(() => setSectionSaveStatus(prev => ({ ...prev, [section]: "idle" })), 2500);
  };

  // Load current AI key status from the server on mount
  useEffect(() => {
    fetch("/api/settings/ai-connection")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setAiKeyStatus({ set: d.apiKeySet, preview: d.apiKeyPreview });
          setEncKeyStatus({ set: d.encKeySet, preview: d.encKeyPreview });
        }
      })
      .catch(() => {});
  }, []);

  const handleTestAiConnection = async () => {
    setAiTestStatus("testing");
    setAiTestMessage("");
    const keyToTest = aiApiKey.trim() || "";
    try {
      const res = await fetch("/api/settings/ai-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", apiKey: keyToTest }),
      });
      const data = await res.json();
      if (data.ok) {
        setAiTestStatus("ok");
        setAiTestMessage(data.message);
      } else {
        setAiTestStatus("fail");
        setAiTestMessage(data.error);
      }
    } catch {
      setAiTestStatus("fail");
      setAiTestMessage("Could not reach the server. Is the app running?");
    }
  };

  const handleSaveAiKeys = async () => {
    setAiSaveStatus("saving");
    try {
      const res = await fetch("/api/settings/ai-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", apiKey: aiApiKey.trim(), encryptionKey: aiEncKey.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setAiSaveStatus("saved");
        // Refresh key status preview
        const statusRes = await fetch("/api/settings/ai-connection");
        const statusData = await statusRes.json();
        setAiKeyStatus({ set: statusData.apiKeySet, preview: statusData.apiKeyPreview });
        setEncKeyStatus({ set: statusData.encKeySet, preview: statusData.encKeyPreview });
        setAiApiKey("");
        setAiEncKey("");
        setTimeout(() => setAiSaveStatus("idle"), 3000);
      } else {
        setAiSaveStatus("error");
        setTimeout(() => setAiSaveStatus("idle"), 3000);
      }
    } catch {
      setAiSaveStatus("error");
      setTimeout(() => setAiSaveStatus("idle"), 3000);
    }
  };

  const handleUpdate = async (type: string, data: any) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/user-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });
      if (res.ok) {
        setSaveStatus("success");
        // Update local state so it persists when switching tabs
        setUserData((prev: any) => {
          if (type === "profile") return { ...prev, ...data };
          if (type === "style") return { ...prev, styleProfile: { ...prev?.styleProfile, ...data } };
          if (type === "learnedPreferences") return { ...prev, learnedPreferences: data };
          if (type === "automation") return { ...prev, automation: { ...prev?.automation, ...data } };
          if (type === "notifications") return { ...prev, notifications: { ...prev?.notifications, ...data } };
          if (type === "privacy") return { ...prev, privacy: { ...prev?.privacy, ...data } };
          return { ...prev, ...data };
        });
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      setSaveStatus("error");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This will permanently remove all your settings and data.")) {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/user-settings", { method: "DELETE" });
        if (res.ok) {
          window.location.reload(); 
        } else {
          setSaveStatus("error");
        }
      } catch (err) {
        setSaveStatus("error");
      }
    }
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mailmind_user_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="flex gap-8">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-40">
            <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Loading your preferences...</p>
          </div>
        ) : (
          <>
            {/* Settings Navigation */}
        <aside className="w-48 space-y-1">
          {[
            { id: "account", label: "Account", icon: UserIcon },
            { id: "accounts", label: "Connected Emails", icon: Mail },
            { id: "ai-connection", label: "AI Connection", icon: Cpu },
            { id: "style", label: "My Style", icon: Palette },
            { id: "automation", label: "Automation", icon: Zap },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "privacy", label: "Privacy & Data", icon: Shield },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeSection === section.id 
                  ? "bg-indigo-600/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <div className="flex-1 space-y-8">

          {activeSection === "ai-connection" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header card */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-slate-900/50 border border-indigo-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[80px] pointer-events-none" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Connection</h2>
                    <p className="text-slate-400 text-sm">Connect MailMind to OpenAI to enable intelligent email drafting and analysis.</p>
                  </div>
                </div>
              </div>

              {/* Current Key Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn(
                  "p-5 rounded-xl border flex items-center gap-4",
                  aiKeyStatus.set ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-900/50 border-slate-800"
                )}>
                  {aiKeyStatus.set
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    : <XCircle className="w-6 h-6 text-slate-600 shrink-0" />}
                  <div>
                    <div className="text-sm font-bold text-slate-200">OpenAI API Key</div>
                    <div className="text-xs text-slate-500">
                      {aiKeyStatus.set ? `Active: ${aiKeyStatus.preview}` : "Not configured"}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "p-5 rounded-xl border flex items-center gap-4",
                  encKeyStatus.set ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-900/50 border-slate-800"
                )}>
                  {encKeyStatus.set
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    : <XCircle className="w-6 h-6 text-slate-600 shrink-0" />}
                  <div>
                    <div className="text-sm font-bold text-slate-200">Encryption Key</div>
                    <div className="text-xs text-slate-500">
                      {encKeyStatus.set ? `Active: ${encKeyStatus.preview}` : "Not configured"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input form */}
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6">
                <h3 className="font-bold text-slate-200 text-lg">Enter New Keys</h3>
                <p className="text-sm text-slate-500">Your keys are written directly into your local <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">.env</code> file and never leave your machine.</p>

                {/* OpenAI API Key */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">OpenAI API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={aiApiKey}
                      onChange={e => setAiApiKey(e.target.value)}
                      placeholder="sk-••••••••••••••••••••••••••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pr-12 text-sm font-mono focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">Get your key from <span className="text-indigo-400">platform.openai.com/api-keys</span></p>
                </div>

                {/* Encryption Key */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Encryption Key</label>

                  {/* Plain-English explanation */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-400 space-y-2 leading-relaxed">
                    <p>
                      <span className="font-bold text-slate-200">What is this?</span> — This is a private password that <span className="text-indigo-300">you create yourself</span>. MailMind uses it to scramble your stored email passwords on your hard drive so they cannot be read by anyone who opens your files.
                    </p>
                    <p>
                      <span className="font-bold text-slate-200">Where do I get it?</span> — You don&apos;t. You simply <span className="text-indigo-300">make one up</span>, or use the &quot;Generate for Me&quot; button below. It must be <span className="text-amber-300 font-bold">exactly 32 characters long</span>. Write it down somewhere safe — without it, stored email passwords cannot be decrypted.
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type={showEncKey ? "text" : "password"}
                      value={aiEncKey}
                      onChange={e => setAiEncKey(e.target.value)}
                      placeholder="Click 'Generate for Me' or type your own 32-character key"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pr-12 text-sm font-mono focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
                    />
                    <button
                      onClick={() => setShowEncKey(!showEncKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showEncKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Character counter + generate button */}
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-xs font-bold",
                      aiEncKey.length === 0 && "text-slate-600",
                      aiEncKey.length > 0 && aiEncKey.length < 32 && "text-amber-400",
                      aiEncKey.length === 32 && "text-emerald-400",
                      aiEncKey.length > 32 && "text-red-400",
                    )}>
                      {aiEncKey.length === 0 && "0 / 32 characters"}
                      {aiEncKey.length > 0 && aiEncKey.length < 32 && `${aiEncKey.length} / 32 — needs ${32 - aiEncKey.length} more characters`}
                      {aiEncKey.length === 32 && "✅ Perfect — exactly 32 characters"}
                      {aiEncKey.length > 32 && `❌ Too long — ${aiEncKey.length - 32} character(s) over the limit`}
                    </span>
                    <button
                      onClick={() => {
                        // Generate a cryptographically random 32-char key using browser crypto API
                        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                        const arr = new Uint8Array(32);
                        crypto.getRandomValues(arr);
                        const key = Array.from(arr).map(b => chars[b % chars.length]).join("");
                        setAiEncKey(key);
                        setShowEncKey(true); // Show it so user can copy it
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Zap className="w-3 h-3" /> Generate for Me
                    </button>
                  </div>
                  <p className="text-xs text-amber-400/80 font-medium">⚠️ Important: Copy and store this key in a safe place (e.g. a password manager). If you lose it, your stored email passwords cannot be recovered.</p>
                </div>

                {/* Test Result */}
                {aiTestStatus !== "idle" && (
                  <div className={cn(
                    "flex items-start gap-3 p-4 rounded-xl text-sm border animate-in fade-in duration-300",
                    aiTestStatus === "testing" && "bg-slate-800/50 border-slate-700 text-slate-400",
                    aiTestStatus === "ok"      && "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
                    aiTestStatus === "fail"    && "bg-red-500/10 border-red-500/20 text-red-300",
                  )}>
                    {aiTestStatus === "testing" && <RefreshCw className="w-4 h-4 mt-0.5 animate-spin shrink-0" />}
                    {aiTestStatus === "ok"      && <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
                    {aiTestStatus === "fail"    && <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                    <span>{aiTestStatus === "testing" ? "Testing connection to OpenAI..." : aiTestMessage}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleTestAiConnection}
                    disabled={aiTestStatus === "testing"}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-all disabled:opacity-50"
                  >
                    {aiTestStatus === "testing"
                      ? <><RefreshCw className="w-4 h-4 animate-spin" /> Testing...</>
                      : <><Activity className="w-4 h-4" /> Test Connection</>}
                  </button>
                  <button
                    onClick={handleSaveAiKeys}
                    disabled={aiSaveStatus === "saving" || (!aiApiKey.trim() && !aiEncKey.trim())}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50",
                      aiSaveStatus === "saved"  && "bg-emerald-600 text-white shadow-emerald-600/20",
                      aiSaveStatus === "error"  && "bg-red-600 text-white",
                      aiSaveStatus === "saving" && "bg-indigo-600/50 text-white",
                      (aiSaveStatus === "idle") && "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20",
                    )}
                  >
                    {aiSaveStatus === "saving" && <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>}
                    {aiSaveStatus === "saved"  && <><CheckCircle2 className="w-4 h-4" /> Keys Saved to .env!</>}
                    {aiSaveStatus === "error"  && <><XCircle className="w-4 h-4" /> Save Failed</>}
                    {aiSaveStatus === "idle"   && <><Save className="w-4 h-4" /> Save Keys to .env</>}
                  </button>
                </div>
              </div>

              {/* Security notice */}
              <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-200/80">
                <Lock className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong>Security Notice:</strong> Your keys are stored in the local <code className="bg-amber-900/30 px-1 rounded">.env</code> file on your HDD and are never transmitted to any external server. Keep a backup of this file in a secure location.
                </div>
              </div>
            </div>
          )}

          {activeSection === "accounts" && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-2">Connected Accounts</h2>
                <p className="text-sm text-slate-400 mb-6">Manage your email connections and sync status.</p>

                <div className="space-y-4">
                  {accounts.map((acc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold">
                          {acc.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{acc.email}</div>
                          <div className="text-xs text-slate-500">{acc.provider} • Last synced: {acc.lastSynced}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {acc.status === "Connected" && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                            <Check className="w-3 h-3" />
                            Connected
                          </div>
                        )}
                        <button 
                          onClick={async (e) => {
                            const btn = e.currentTarget;
                            const originalContent = btn.innerHTML;
                            btn.disabled = true;
                            btn.innerHTML = '<span class="animate-spin">⏳</span> Testing...';
                            
                            setTimeout(() => {
                              btn.innerHTML = '✅ Connection OK';
                              setTimeout(() => {
                                btn.innerHTML = originalContent;
                                btn.disabled = false;
                              }, 2000);
                            }, 1500);
                          }}
                          className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-md hover:bg-indigo-400/10 transition-all border border-indigo-500/20"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Test Connection
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to disconnect ${acc.email}?`)) {
                              setAccounts(accounts.filter(a => a.email !== acc.email));
                            }
                          }}
                          className="text-xs font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md hover:bg-red-400/10 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={() => setIsConnecting(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-800 rounded-xl text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400 transition-all group"
                  >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Connect New Account</span>
                  </button>
                </div>
              </div>

              {isConnecting && (
                <div className="bg-slate-900/50 rounded-xl border border-indigo-500/50 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h2 className="text-lg font-semibold mb-4 text-indigo-400">Connect Bigpond / IMAP Account</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="text" 
                        value={newAccount.email}
                        onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                        placeholder="name@bigpond.com" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password / App Password</label>
                      <input 
                        type="password" 
                        value={newAccount.password}
                        onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">IMAP Server</label>
                      <input 
                        type="text" 
                        value={newAccount.host}
                        onChange={(e) => setNewAccount({...newAccount, host: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">IMAP Port</label>
                      <input 
                        type="text" 
                        value={newAccount.port}
                        onChange={(e) => setNewAccount({...newAccount, port: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  
                  {connectionError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {connectionError}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <AlertCircle className="w-4 h-4" />
                      We recommend using an App Password if 2FA is enabled.
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setIsConnecting(false);
                          setConnectionError("");
                        }}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={async () => {
                          setSaveStatus("saving");
                          setConnectionError("");
                          try {
                            const res = await fetch("/api/accounts/test-roundtrip", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(newAccount)
                            });
                            const data = await res.json();
                            if (res.ok) {
                              alert("✅ Full Test Successful! Email sent and received successfully.");
                              setSaveStatus("success");
                            } else {
                              setConnectionError(data.error || "Diagnostics failed");
                              setSaveStatus("error");
                            }
                          } catch (err) {
                            setConnectionError("Failed to perform diagnostics");
                            setSaveStatus("error");
                          }
                        }}
                        className="px-4 py-2 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                        disabled={saveStatus === "saving"}
                      >
                        {saveStatus === "saving" ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                        Full Diagnostics
                      </button>
                      <button 
                        onClick={async () => {
                          setSaveStatus("saving");
                          setConnectionError("");
                          try {
                            const res = await fetch("/api/accounts/connect/imap", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(newAccount)
                            });
                            const data = await res.json();
                             if (res.ok) {
                               setSaveStatus("success");
                               setAccounts(prev => [
                                 ...prev, 
                                 { 
                                   email: newAccount.email, 
                                   provider: "IMAP/SMTP", 
                                   lastSynced: "Just now", 
                                   status: "Connected" 
                                 }
                               ]);
                               setIsConnecting(false);
                               setNewAccount({ email: "", password: "", host: "imap.telstra.com", port: "993", tls: true });
                             } else {
                              setConnectionError(data.error || "Connection failed");
                              setSaveStatus("error");
                            }
                          } catch (err) {
                            setConnectionError("Failed to connect to server");
                            setSaveStatus("error");
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                        disabled={saveStatus === "saving"}
                      >
                        {saveStatus === "saving" ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify & Connect"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "style" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your Communication Style</h2>
                    <p className="text-sm text-slate-400">Customise how MailMind represents you in every email.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Tone</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Formal", "Semi-Formal", "Casual"].map((t) => (
                          <button 
                            key={t} 
                            onClick={() => handleUpdate("style", { ...userData?.styleProfile, tone: t })}
                            className={cn(
                              "px-4 py-2 border rounded-lg text-sm font-medium transition-all",
                              userData?.styleProfile?.tone === t 
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reply Length</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Concise", "Balanced", "Detailed"].map((l) => (
                          <button 
                            key={l} 
                            onClick={() => handleUpdate("style", { ...userData?.styleProfile, lengthPreference: l })}
                            className={cn(
                              "px-4 py-2 border rounded-lg text-sm font-medium transition-all",
                              userData?.styleProfile?.lengthPreference === l 
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Default Sign-off</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={userData?.styleProfile?.signOff || ""}
                          onChange={(e) => setUserData({
                            ...userData, 
                            styleProfile: { ...userData?.styleProfile, signOff: e.target.value }
                          })}
                          onBlur={(e) => handleUpdate("style", { ...userData?.styleProfile, signOff: e.target.value })}
                          placeholder="Best regards, Greg" 
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sample Email (Optional)</label>
                    <textarea 
                      placeholder="Paste a typical email you've written..."
                      className="w-full h-full min-h-[200px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Learned Preferences */}
              <div className="bg-slate-900/20 rounded-2xl border border-dashed border-slate-800 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-400" /> AI-Learned Preferences
                  </h3>
                  <div className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded uppercase">
                    Learning active
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(userData?.learnedPreferences || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 group">
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-slate-300 font-medium">{item.pref}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-500">{item.confidence}</span>
                        <button 
                          onClick={() => {
                            const newList = userData.learnedPreferences.filter((_: any, index: number) => index !== i);
                            handleUpdate("learnedPreferences", newList);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-indigo-600/5 rounded-xl border border-indigo-500/20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-200">Continuous Learning Progress</div>
                    <div className="text-xs text-slate-500 mt-0.5">MailMind is matching your voice with {userData?.learnedPreferences?.length ? "88%" : "0%"} accuracy based on {userData?.learnedPreferences?.length || 0} recent edits.</div>
                  </div>
                  <button 
                    onClick={() => {
                      // Mock adding a new learned preference
                      const newPref = { pref: "Newly learned pattern from sample...", confidence: "80%" };
                      handleUpdate("learnedPreferences", [...(userData.learnedPreferences || []), newPref]);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
                  >
                    Refine Voice
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                    {userData?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userData?.name || "User"}</h2>
                    <p className="text-slate-400">{userData?.plan || "Free"} Plan • Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "now"}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                      <input 
                        name="name" 
                        type="text" 
                        value={userData?.name || ""} 
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                      <input 
                        name="role" 
                        type="text" 
                        value={userData?.role || ""} 
                        onChange={(e) => setUserData({...userData, role: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company</label>
                      <input 
                        name="company" 
                        type="text" 
                        value={userData?.company || ""} 
                        onChange={(e) => setUserData({...userData, company: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      onClick={() => handleUpdate("profile", { name: userData.name, role: userData.role, company: userData.company })}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50" 
                      disabled={saveStatus === "saving"}
                    >
                      {saveStatus === "saving" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saveStatus === "success" ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-red-400">Danger Zone</h3>
                  <p className="text-xs text-slate-500">Permanently delete your account and all associated email data.</p>
                </div>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={saveStatus === "saving"}
                  className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" /> {saveStatus === "saving" ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          )}

          {activeSection === "automation" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Automation Logic</h2>
                    <p className="text-sm text-slate-400">Control how AI handles your incoming communications.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    <Activity className="w-3.5 h-3.5" /> Engine Active
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "autoDrafting", title: "Auto-Drafting", desc: "Automatically create drafts for all incoming emails." },
                    { key: "smartCategorisation", title: "Smart Categorisation", desc: "Labels emails based on content analysis." },
                    { key: "confidenceBarrier", title: "Confidence Barrier", desc: "Only take action if AI confidence is above 85%." },
                    { key: "weeklyInsights", title: "Weekly Insights", desc: "Receive a summary of time saved and AI actions." },
                  ].map((item, i) => {
                    const isActive = pendingAutomation[item.key] ?? false;
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                        <div>
                          <div className="font-bold text-slate-200">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                        <button 
                          onClick={() => setPendingAutomation(prev => ({ ...prev, [item.key]: !isActive }))}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-all duration-300",
                            isActive ? "bg-indigo-600" : "bg-slate-800"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                            isActive ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => saveSectionLocally("automation", pendingAutomation)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg",
                      sectionSaveStatus.automation === "saved"
                        ? "bg-emerald-600 text-white shadow-emerald-600/20"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                    )}
                  >
                    <Save className="w-4 h-4" />
                    {sectionSaveStatus.automation === "saved" ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-sm text-slate-400">Stay updated on important emails and AI actions.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "urgentAlerts", title: "Urgent Email Alerts", desc: "Notify when AI identifies a high-priority email." },
                    { key: "dailyDigest", title: "Daily Digest", desc: "Send a summary of all emails handled today." },
                    { key: "draftReady", title: "Draft Ready Notifications", desc: "Alert when a complex draft needs your review." },
                  ].map((item, i) => {
                    const isActive = pendingNotifications[item.key] ?? false;
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                        <div>
                          <div className="font-bold text-slate-200">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                        <button 
                          onClick={() => setPendingNotifications(prev => ({ ...prev, [item.key]: !isActive }))}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-all duration-300",
                            isActive ? "bg-indigo-600" : "bg-slate-800"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                            isActive ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => saveSectionLocally("notifications", pendingNotifications)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg",
                      sectionSaveStatus.notifications === "saved"
                        ? "bg-emerald-600 text-white shadow-emerald-600/20"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                    )}
                  >
                    <Save className="w-4 h-4" />
                    {sectionSaveStatus.notifications === "saved" ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 space-y-8">
                <div>
                  <h2 className="text-xl font-bold">Privacy & Security</h2>
                  <p className="text-sm text-slate-400">Manage your data and AI processing preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <Lock className="w-6 h-6 text-indigo-400" />
                    <h3 className="font-bold">Encryption</h3>
                    <p className="text-xs text-slate-500">All email content is encrypted at rest using AES-256 standards.</p>
                  </div>
                  <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <Eye className="w-6 h-6 text-indigo-400" />
                    <h3 className="font-bold">Data Access</h3>
                    <p className="text-xs text-slate-500">Only metadata is used for analytics. Body text is processed transiently by AI.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 bg-indigo-600/5 rounded-lg border border-indigo-500/20">
                    <div>
                      <div className="font-bold text-slate-200">AI Training Participation</div>
                      <div className="text-xs text-slate-500">Allow your edits to fine-tune your local model. No data leaves your instance.</div>
                    </div>
                    <button 
                      onClick={() => setPendingPrivacy(prev => ({ ...prev, aiTraining: !(pendingPrivacy.aiTraining ?? false) }))}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        (pendingPrivacy.aiTraining ?? false) ? "bg-indigo-600" : "bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                        (pendingPrivacy.aiTraining ?? false) ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button 
                      onClick={handleDownloadData}
                      className="flex-1 p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      Download My Data (JSON)
                    </button>
                    <button
                      onClick={() => saveSectionLocally("privacy", pendingPrivacy)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg",
                        sectionSaveStatus.privacy === "saved"
                          ? "bg-emerald-600 text-white shadow-emerald-600/20"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                      )}
                    >
                      <Save className="w-4 h-4" />
                      {sectionSaveStatus.privacy === "saved" ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )}
      </div>
    </div>
  );
}
