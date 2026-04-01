"use client";

import { useEffect, useState } from "react";
import { 
  User as UserIcon, 
  ShieldCheck, 
  MessageSquare, 
  Pill, 
  AlertTriangle, 
  Activity,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserMetrics, HistoryItem } from "@/lib/userMetrics";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"chat" | "med">("chat");
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [medHistory, setMedHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState([
    { label: "Total Chats", value: 0, icon: MessageSquare, color: "text-cyan-500" },
    { label: "Med Queries", value: 0, icon: Pill, color: "text-blue-500" },
    { label: "Emergencies", value: 0, icon: AlertTriangle, color: "text-red-500" },
    { label: "High Risk", value: 0, icon: Activity, color: "text-orange-500" },
  ]);

  useEffect(() => {
    const loadMetrics = () => {
      const metrics = getUserMetrics(user);
      setStats([
        { label: "Total Chats", value: metrics.totalChats, icon: MessageSquare, color: "text-cyan-500" },
        { label: "Med Queries", value: metrics.medQueries, icon: Pill, color: "text-blue-500" },
        { label: "Emergencies", value: metrics.emergencies, icon: AlertTriangle, color: "text-red-500" },
        { label: "High Risk", value: metrics.highRisk, icon: Activity, color: "text-orange-500" },
      ]);
      setChatHistory(metrics.chatHistory);
      setMedHistory(metrics.medHistory);
    };

    loadMetrics();
    window.addEventListener("focus", loadMetrics);
    return () => window.removeEventListener("focus", loadMetrics);
  }, [user]);

  // Fallback to defaults matching screenshot if no user context available
  const fullName = user?.fullName || "Bipasa Saha Luchi";
  const email = user?.email || "bipasasahaluchi@gmail.com";

  const renderBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px] px-2 py-0">low</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 text-[10px] px-2 py-0">high</Badge>;
      case "critical":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 text-[10px] px-2 py-0">critical</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] px-2 py-0">{risk}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf7f5] p-4 md:p-8 font-sans pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* User Card */}
        <Card className="border-none shadow-sm rounded-[1.5rem] bg-white overflows-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-cyan-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-8 h-8 text-cyan-500" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
                <p className="text-slate-500 font-medium text-sm md:text-base">{email}</p>
                <div className="flex pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Privacy Protected
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[1.5rem] bg-white">
              <CardContent className="p-6">
                <stat.icon className={`w-6 h-6 mb-4 ${stat.color}`} strokeWidth={2} />
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* History Tabs Card */}
        <Card className="border-none shadow-sm rounded-[1.5rem] bg-white overflows-hidden min-h-[500px]">
          <CardContent className="p-6 md:p-8">
            
            {/* Tab Switcher */}
            <div className="bg-slate-100/80 p-1 rounded-2xl flex flex-col sm:flex-row gap-1 mb-6 max-w-2xl mx-auto">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "chat" 
                    ? "bg-white shadow-sm text-slate-800" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Chat History
              </button>
              <button
                onClick={() => setActiveTab("med")}
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "med" 
                    ? "bg-white shadow-sm text-slate-800" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Medication Queries
              </button>
            </div>

            {/* List Content */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {(activeTab === "chat" ? chatHistory : medHistory).map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-start gap-4 p-5 rounded-2xl bg-slate-100/60 hover:bg-cyan-50/50 transition-colors cursor-pointer border border-transparent hover:border-cyan-100"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-5 h-5 text-cyan-500" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                          {item.snippet}
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          {renderBadge(item.risk)}
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(activeTab === "chat" ? chatHistory : medHistory).length === 0 && (
                    <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-2xl">
                      No {activeTab === "chat" ? "chat" : "medication"} history yet.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
