"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  Phone, 
  HeartPulse, 
  Wind, 
  Brain, 
  Activity,
  Loader2,
  AlertCircle,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { recordEmergencyEvent } from "@/lib/userMetrics";

const CRITICAL_SYMPTOMS = [
  { id: "chest-pain", label: "Chest Pain", icon: HeartPulse },
  { id: "breathing-difficulty", label: "Breathing Difficulty", icon: Wind },
  { id: "head-injury", label: "Severe Head Injury", icon: Brain },
  { id: "stroke", label: "Stroke Symptoms", icon: Activity },
  { id: "bleeding", label: "Severe Bleeding", icon: AlertTriangle },
  { id: "loss-of-consciousness", label: "Loss of Consciousness", icon: AlertTriangle },
];

interface AnalysisResult {
  severity: "critical" | "high" | "moderate";
  immediate_actions: string[];
  tell_emergency: string;
  warning_signs: string[];
}

export default function EmergencyPage() {
  const { user } = useAuth();
  const [customSymptom, setCustomSymptom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);

  const handleAnalyze = async (searchSymptom: string) => {
    if (!searchSymptom.trim()) return;

    setActiveSymptom(searchSymptom);
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: searchSymptom }),
      });

      if (!res.ok) throw new Error("Failed to analyze emergency.");
      
      const data = await res.json();
      setResult(data);
      recordEmergencyEvent(user, searchSymptom, data.severity || "moderate");
    } catch (err: any) {
      setError(err.message || "An error occurred fetching guidance.");
    } finally {
      setIsLoading(false);
    }
  };

  const severityColors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200"
  };

  return (
    <div className="min-h-screen bg-[#eaf7f5] p-4 md:p-8 font-sans pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Emergency Banner */}
        <Card className="bg-red-50 border-red-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-bold text-red-900">Emergency Support</h1>
                <p className="text-red-600 font-medium text-sm md:text-base">
                  Select a symptom or describe your emergency for immediate guidance
                </p>
                
                <div className="flex flex-wrap gap-3 mt-4 pt-2">
                  <a href="tel:911" className="inline-block">
                    <Button className="bg-[#da292e] hover:bg-red-700 text-white rounded-full px-6 shadow-sm gap-2">
                      <Phone className="w-4 h-4" />
                      Call Emergency (112)
                    </Button>
                  </a>
                
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms Selection Card */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Select Critical Symptom</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {CRITICAL_SYMPTOMS.map((symptom) => {
                const isSelected = activeSymptom === symptom.label;
                const Icon = symptom.icon;
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => handleAnalyze(symptom.label)}
                    disabled={isLoading}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-red-400 bg-red-50 shadow-sm' 
                        : 'border-slate-100 bg-white hover:border-red-200 hover:bg-red-50/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Icon className="w-6 h-6 text-[#fa6b6b]" strokeWidth={2} />
                    <span className="font-semibold text-slate-700 flex-1">{symptom.label}</span>
                    {isLoading && isSelected ? (
                      <Loader2 className="w-4 h-4 text-red-500 animate-spin" aria-label="Analyzing" />
                    ) : (
                      <span className="text-xs font-bold text-red-800 bg-red-100 border border-red-200 rounded-full px-3 py-1">
                        Analyze
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze(customSymptom)}
                placeholder="Describe other emergency symptoms..."
                className="flex-1 rounded-xl border-slate-200 focus-visible:ring-red-200 h-12 text-base"
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleAnalyze(customSymptom)}
                disabled={!customSymptom.trim() || isLoading}
                className="bg-[#f08a8a] py-6 hover:bg-[#e67575] text-white rounded-xl px-8 font-semibold shadow-sm h-12"
              >
                {isLoading && activeSymptom === customSymptom ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Result Area */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-2 border-red-100 overflow-hidden shadow-md rounded-2xl">
                <div className={`px-6 py-4 border-b ${severityColors[result.severity] || "bg-slate-100"} flex items-center justify-between`}>
                  <h3 className="font-bold text-lg capitalize flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {result.severity} Severity Assessment
                  </h3>
                </div>
                <CardContent className="p-6 md:p-8 space-y-8 bg-white">
                  
                  {/* Immediate Actions */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">1</div>
                      Immediate Actions
                    </h4>
                    <div className="grid gap-3 pl-3 md:pl-10">
                      {result.immediate_actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="w-2 h-2 mt-2 rounded-full bg-red-400 flex-shrink-0" />
                          <p className="text-slate-700 font-medium leading-relaxed">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What to tell dispatcher */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">2</div>
                      What to tell Emergency Services
                    </h4>
                    <div className="pl-3 md:pl-10">
                      <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 relative">
                        <FileText className="absolute right-4 top-4 text-purple-200 w-12 h-12 opacity-50" />
                        <p className="text-purple-900 font-medium text-lg italic relative z-10">
                          "{result.tell_emergency}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Signs */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">3</div>
                      Watch for Worsening Signs
                    </h4>
                    <div className="pl-3 md:pl-10 text-slate-600 bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                      <ul className="list-disc space-y-2 pl-4 marker:text-orange-400">
                        {result.warning_signs.map((sign, i) => (
                          <li key={i} className="font-medium text-slate-700">{sign}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
