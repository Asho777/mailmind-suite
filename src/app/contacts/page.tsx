"use client";

import React, { useState, useRef } from "react";
import { 
  Users, 
  User, 
  Search, 
  Mail, 
  MessageSquare, 
  Star, 
  MoreVertical,
  Plus,
  Filter,
  ArrowUpRight,
  Trash2,
  Edit2,
  Upload,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import ContactModal from "@/components/modals/ContactModal";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company: string;
  relationship: string;
  interactions: number;
  lastActive: string;
  priority: string;
}

const mockContacts: Contact[] = [
  { id: "1", name: "Sarah Jenkins", email: "sarah@clientcorp.com", company: "Client Corp", relationship: "Key Client", interactions: 42, lastActive: "2 hours ago", priority: "High", phone: "+61 412 345 678", address: "12 Pitt St, Sydney" },
  { id: "2", name: "David Miller", email: "d.miller@vendor.net", company: "Miller Supply", relationship: "Vendor", interactions: 12, lastActive: "1 day ago", priority: "Normal", phone: "+61 498 765 432" },
  { id: "3", name: "Elena Rodriguez", email: "elena@startup.io", company: "QuickStart", relationship: "Lead", interactions: 8, lastActive: "3 days ago", priority: "High" },
  { id: "4", name: "Tom Wilson", email: "tom@hr-solutions.com", company: "HR Solutions", relationship: "Partner", interactions: 25, lastActive: "5 hours ago", priority: "Normal" },
];

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState(mockContacts);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const filteredContacts = contacts.filter(c => 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExport = () => {
    const data = JSON.stringify(contacts, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mailmind_contacts_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Contacts exported successfully as JSON!");
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedContacts = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedContacts)) {
          const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()));
          const uniqueNewContacts = importedContacts.filter(c => !existingEmails.has(c.email.toLowerCase()));
          
          if (uniqueNewContacts.length === 0) {
            alert("No new contacts found. All contacts in the file already exist in your list.");
          } else {
            setContacts([...uniqueNewContacts, ...contacts]);
            const skipped = importedContacts.length - uniqueNewContacts.length;
            alert(`Successfully imported ${uniqueNewContacts.length} new contacts!${skipped > 0 ? ` (${skipped} duplicates skipped)` : ""}`);
          }
        } else {
          alert("Invalid file format. Please upload a valid contacts backup.");
        }
      } catch (err) {
        alert("Error reading file. Make sure it's a valid JSON backup.");
      }
    };
    reader.readAsText(file);
    setShowImportMenu(false);
  };

  const handleImport = (source: string) => {
    if (source === "File") {
      importFileRef.current?.click();
      return;
    }
    alert(`Connecting to ${source} to sync contacts...`);
    // Mock import of one contact
    const newContact = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Imported from ${source}`,
      email: `sync@${source.toLowerCase()}.com`,
      company: "External Corp",
      relationship: "Lead",
      interactions: 1,
      lastActive: "Just now",
      priority: "Normal"
    };
    setContacts([newContact, ...contacts]);
    setShowImportMenu(false);
  };

  const togglePriority = (id: string) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, priority: c.priority === "High" ? "Normal" : "High" } : c
    ));
  };

  const deleteContact = (id: string) => {
    if (confirm("Delete this contact?")) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (contact: any) => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === contact.id ? { ...c, ...contact } : c));
    } else {
      setContacts([{ ...contact, interactions: 0, lastActive: "Just now" }, ...contacts]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Contacts</h1>
          <p className="text-slate-400">Manage your relationships and communication history.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={importFileRef} 
            onChange={handleFileImport} 
            accept=".json"
            className="hidden" 
          />
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowImportMenu(!showImportMenu)}
              className={cn(
                "flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg",
                showImportMenu && "border-indigo-500/50 text-indigo-400 bg-indigo-500/5"
              )}
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            {showImportMenu && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-1 border-b border-slate-800 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source Software</span>
                </div>
                <button onClick={() => handleImport("File")} className="w-full px-4 py-2 text-left text-xs text-indigo-400 font-bold hover:bg-slate-800 hover:text-indigo-300 transition-colors">MailMind Backup (.json)</button>
                <button onClick={() => handleImport("Gmail")} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Gmail / Google</button>
                <button onClick={() => handleImport("Outlook")} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Outlook / Office</button>
                <button onClick={() => handleImport("Thunderbird")} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Mozilla Thunderbird</button>
                <button onClick={() => handleImport("Internet Explorer")} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Internet Explorer</button>
              </div>
            )}
          </div>
          <button 
            onClick={handleCreateContact}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add Contact
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, email or company..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-slate-900/30 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Relationship</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Interactions</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Last Active</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No contacts found matching your search.
                </td>
              </tr>
            ) : filteredContacts.map((contact) => (
              <tr key={contact.id} className="group hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/5">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        {contact.name}
                        <button onClick={() => togglePriority(contact.id)} className="hover:scale-110 transition-transform">
                          <Star className={cn("w-3 h-3 transition-colors", contact.priority === "High" ? "text-amber-400 fill-amber-400" : "text-slate-700 hover:text-slate-500")} />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500">{contact.email} • {contact.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                    contact.relationship === "Key Client" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    contact.relationship === "Lead" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    "bg-slate-800 text-slate-400 border border-slate-700"
                  )}>
                    {contact.relationship}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    {contact.interactions} emails
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-slate-400">{contact.lastActive}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditContact(contact)}
                      className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Edit Contact"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent("open-compose", { detail: { to: contact.email } }))}
                      className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteContact(contact.id)}
                      className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
        <div>Showing {filteredContacts.length} of 156 contacts</div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors disabled:opacity-50" disabled>Previous</button>
          <button className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors">Next</button>
        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
        initialContact={editingContact as any}
      />
    </div>
  );
}
