"use client";

import { useEffect, useState, Suspense } from "react";
import { Bell, Plus, Search, Pill, ShieldAlert, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { recordMedicationQuery, RiskLevel, generateId, saveLocalSession, loadLocalSession } from "@/lib/userMetrics";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@/components/ai-elements/loader";

interface Medication {
  id: number;
  name: string;
  time: string;
  active: boolean;
}

function PageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [meds, setMeds] = useState<Medication[]>([]);
  const [query, setQuery] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Add Medication Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState("");

  const queryId = searchParams.get("id");

  useEffect(() => {
    fetchMeds();
  }, []);

  // Hydrate explicit medication history sessions dynamically
  useEffect(() => {
    if (queryId) {
      const session = loadLocalSession(queryId);
      if (session) {
        setQuery(session.query || "");
        setAiResult(session.aiResult || "");
      }
    } else {
      setQuery("");
      setAiResult("");
    }
  }, [queryId]);

  const fetchMeds = async () => {
    try {
      const res = await fetch("/api/medications");
      if (res.ok) {
        const data = await res.json();
        setMeds(data);
      }
    } catch (error) {
    }
  };

  const addMedication = async () => {
    if (!newName) return;

    try {
      await fetch("/api/medications", {
        method: "POST",
        body: JSON.stringify({ name: newName, time: newTime || "08:00 AM" }),
        headers: { "Content-Type": "application/json" },
      });
      fetchMeds();
      
      setNewName("");
      setNewTime("");
      setIsAdding(false);
    } catch (error) {}
  };

  const toggleReminder = async (id: number) => {
    try {
      await fetch("/api/medications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      fetchMeds();
    } catch (error) {}
  };

  const deleteMedication = async (id: number) => {
    try {
      await fetch("/api/medications", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      fetchMeds();
    } catch (error) {}
  };

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    try {
      const queryText = query.trim();
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ query: queryText }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const resultText = data.result || "";
      setAiResult(resultText);

      const lower = `${queryText} ${resultText}`.toLowerCase();
      const risk: RiskLevel =
        lower.includes("urgent") ||
        lower.includes("emergency") ||
        lower.includes("immediately") ||
        lower.includes("severe")
          ? "high"
          : "low";
          
      // Generate immutable session context mapped perfectly across DB metrics
      const newId = generateId();
      recordMedicationQuery(user, newId, queryText, resultText.slice(0, 180), risk);
      saveLocalSession(newId, { query: queryText, aiResult: resultText });
      
      // Sync URL dynamically to enable browser-back functionality correctly
      router.replace(`/dashboard/MedicationAssistant?id=${newId}`);
      
    } catch (error) {
    } finally {
      setIsSearching(false);
    }
  };

  const total = meds.length;
  const active = meds.filter((m) => m.active).length;
  const paused = total - active;

  return (
    <div className="p-6 bg-[#eef8f8] min-h-screen font-sans pb-20">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start justify-between">
        <div>
          <p className="text-[#0ebcb9] text-xs font-bold uppercase tracking-wider mb-2 text-[11px]">MEDICATIONS</p>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Medication Reminders</h1>
          <p className="text-[#0ebcb9] font-medium text-sm">{active} active reminders</p>
        </div>
        <div className="bg-[#e6f7f7] p-3 rounded-2xl text-[#0ebcb9]">
          <Bell className="w-8 h-8" strokeWidth={1.5} />
        </div>
      </div>

      {/* ADD BUTTON */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#1a233b] hover:bg-[#12192b] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm text-sm"
        >
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> Add Medication</>}
        </button>
      </div>

      {/* ADD MEDICATION FORM */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm mt-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-end animate-in fade-in zoom-in-95 duration-200">
          <div className="flex-1 w-full relative">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Medicine Name</label>
            <input
              type="text"
              placeholder="e.g. Aspirin 500mg"
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#0ebcb9]"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 relative">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Reminder Time</label>
            <input
              type="time"
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#0ebcb9]"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
          <button
            onClick={addMedication}
            disabled={!newName}
            className="w-full md:w-auto bg-[#0ebcb9] hover:bg-[#0ba3a0] disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card title="Total" value={total} color="default" />
        <Card title="Active" value={active} color="active" />
        <Card title="Paused" value={paused} color="default" />
      </div>

      {/* MED LIST */}
      {meds.length > 0 && (
        <div className="mt-8 space-y-3">
          {meds.map((med) => (
            <div
              key={med.id}
              className="bg-[#e6f4f2] p-4 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4">
                <Bell className="text-[#0ebcb9] w-5 h-5 flex-shrink-0" fill={med.active ? "#0ebcb9" : "none"} strokeWidth={2} />
                <div>
                  <h3 className="font-semibold text-[#0f172a]">{med.name}</h3>
                  <p className="text-sm text-gray-500">Reminder set for {med.time || "08:00 AM"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={med.active}
                  onCheckedChange={() => toggleReminder(med.id)}
                  className="data-[state=checked]:bg-[#0ebcb9]"
                />
                <button 
                  onClick={() => deleteMedication(med.id)}
                  className="p-2 ml-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete medication"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MEDICATION ASSISTANT SECTION */}
      <div className="bg-white mt-8 p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#e6f7f7] p-2 rounded-xl">
            <Pill className="w-6 h-6 text-[#0ebcb9] rotate-45" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] flex-1">
            Medication Assistant
          </h2>
          {queryId && (
            <button 
              onClick={() => router.push("/dashboard/MedicationAssistant")} 
              className="text-sm text-[#0ebcb9] font-medium hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> New Query
            </button>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              className="w-full border border-gray-200 outline-none focus:ring-2 focus:ring-[#0ebcb9] focus:border-transparent py-3 pl-12 pr-4 rounded-2xl text-gray-700 placeholder:text-gray-400"
              placeholder="Enter medicine name or describe symptoms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-[#a6e6e5] text-[#0d9488] px-8 py-3 rounded-2xl font-semibold hover:bg-[#8fd9d8] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {aiResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-gray-700 leading-relaxed border border-gray-100">
             {/* If it's pure text or HTML safely loaded, basic text is fine */}
            {aiResult}
          </div>
        )}

        {/* DISCLAIMER */}
        <div className="mt-6 p-4 bg-[#fff9ed] rounded-2xl text-sm border border-[#ffdbb2] flex gap-3 text-[#d97706] shadow-sm">
          <ShieldAlert className="w-6 h-6 shrink-0" strokeWidth={2} />
          <p className="leading-snug pt-0.5 font-medium">
            This is AI-generated guidance and not a medical prescription. Always consult your doctor or pharmacist before taking any medication.
          </p>
        </div>
      </div>
    </div>
  );
}

// Suspense wrap cleanly for Next.js App Router 
export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 flex items-center justify-center"><Loader /></div>}>
      <PageContent />
    </Suspense>
  );
}

function Card({ title, value, color }: { title: string; value: number; color: "default" | "active" }) {
  if (color === "active") {
    return (
      <div className="bg-[#e6f7f7] border border-[#d1f0f0] p-6 rounded-2xl text-center shadow-sm">
        <h2 className="text-4xl font-extrabold text-[#0ebcb9] mb-1">{value}</h2>
        <p className="text-gray-600 font-medium text-sm">{title}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl text-center shadow-sm">
      <h2 className="text-4xl font-extrabold text-[#0f172a] mb-1">{value}</h2>
      <p className="text-gray-500 font-medium text-sm">{title}</p>
    </div>
  );
}