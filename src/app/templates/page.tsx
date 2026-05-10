"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Copy, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Tag,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import TemplateModal from "@/components/modals/TemplateModal";

interface Template {
  id: string;
  name: string;
  category: string;
  body: string;
  usage: number;
}

const mockTemplates: Template[] = [
  { id: "1", name: "Initial Inquiry Reply", category: "Sales", body: "Hi {{name}}, thank you for your interest in our solutions. I've attached our brochure below...", usage: 124 },
  { id: "2", name: "Out of Office - Simple", category: "General", body: "I am currently away from my desk. I will respond to your email as soon as I return.", usage: 45 },
  { id: "3", name: "Follow Up - No Response", category: "Follow-up", body: "Hi {{name}}, just checking in to see if you had a chance to review my previous email...", usage: 89 },
  { id: "4", name: "Invoice Sent", category: "Billing", body: "Please find your invoice for {{month}} attached. Let me know if you have any questions.", usage: 210 },
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || t.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSaveTemplate = (template: Template) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates([...templates, template]);
    }
  };

  const deleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const useTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.body);
    setTemplates(templates.map(t => t.id === template.id ? { ...t, usage: t.usage + 1 } : t));
    alert("Template copied to clipboard and usage updated!");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Templates</h1>
          <p className="text-slate-400">Reusable AI-powered templates for quick drafting.</p>
        </div>
        <button 
          onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create Template
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
          {["All", "Sales", "Follow-up", "Billing", "General"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeFilter === cat ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="group flex flex-col p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => { setEditingTemplate(template); setIsModalOpen(true); }}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => { navigator.clipboard.writeText(template.body); alert("Copied!"); }}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-1">{template.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-3 h-3 text-slate-600" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{template.category}</span>
            </div>
            <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed flex-1 italic">
              "{template.body}"
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Zap className="w-3 h-3 text-amber-500" /> {template.usage} uses
              </div>
              <button 
                onClick={() => useTemplate(template)}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 uppercase tracking-widest"
              >
                Use Now <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }}
          className="flex flex-col items-center justify-center p-8 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-400">Add New Template</span>
        </button>
      </div>

      <TemplateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTemplate}
        initialTemplate={editingTemplate}
      />
    </div>
  );
}
