"use client";

import { useState, useEffect, useRef } from "react";
import { Wind, Play, Square, RotateCcw, User, Heart, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

type ActionType = "inhale" | "hold_full" | "exhale" | "hold_empty";

interface Phase {
  name: string;
  duration: number; // in seconds
  action: ActionType;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  phases: Phase[];
}

const EXERCISES: Exercise[] = [
  {
    id: "4-7-8",
    title: "4-7-8 Relaxation",
    description: "Calm anxiety and fall asleep faster",
    subtitle: "4s / 7s / 8s",
    phases: [
      { name: "Breathe In", duration: 4, action: "inhale" },
      { name: "Hold", duration: 7, action: "hold_full" },
      { name: "Breathe Out", duration: 8, action: "exhale" },
    ],
  },
  {
    id: "box",
    title: "Box Breathing",
    description: "Used by Navy SEALs for stress control",
    subtitle: "4s / 4s / 4s",
    phases: [
      { name: "Breathe In", duration: 4, action: "inhale" },
      { name: "Hold", duration: 4, action: "hold_full" },
      { name: "Breathe Out", duration: 4, action: "exhale" },
      { name: "Hold", duration: 4, action: "hold_empty" },
    ],
  },
  {
    id: "deep",
    title: "Deep Calm",
    description: "General relaxation and mindfulness",
    subtitle: "5s / 5s / 5s",
    phases: [
      { name: "Breathe In", duration: 5, action: "inhale" },
      { name: "Hold", duration: 5, action: "hold_full" },
      { name: "Breathe Out", duration: 5, action: "exhale" },
    ],
  },
];

export default function MentalWellnessPage() {
  const { user } = useAuth();
  const [activeExerciseId, setActiveExerciseId] = useState<string>("4-7-8");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeExercise = EXERCISES.find((ex) => ex.id === activeExerciseId) || EXERCISES[0];
  const currentPhase = activeExercise.phases[phaseIndex];

  // --- Meditation State ---
  const [meditationMinutes, setMeditationMinutes] = useState<number>(5);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState<number>(5 * 60);
  const [isMeditationPlaying, setIsMeditationPlaying] = useState<boolean>(false);
  const meditationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMeditationPlaying) {
      if (meditationTimeLeft <= 0) {
        setIsMeditationPlaying(false);
      } else {
        meditationTimerRef.current = setTimeout(() => setMeditationTimeLeft((t) => t - 1), 1000);
      }
    } else {
      clearTimeout(meditationTimerRef.current as NodeJS.Timeout);
    }
    return () => clearTimeout(meditationTimerRef.current as NodeJS.Timeout);
  }, [isMeditationPlaying, meditationTimeLeft]);

  const handleMeditationStartStop = () => {
    if (isMeditationPlaying) {
      setIsMeditationPlaying(false);
    } else {
      if (meditationTimeLeft <= 0) setMeditationTimeLeft(meditationMinutes * 60);
      setIsMeditationPlaying(true);
    }
  };

  const handleMeditationReset = () => {
    setIsMeditationPlaying(false);
    setMeditationTimeLeft(meditationMinutes * 60);
    clearTimeout(meditationTimerRef.current as NodeJS.Timeout);
  };

  const handleMeditationTimeSelect = (mins: number) => {
    if (isMeditationPlaying) setIsMeditationPlaying(false);
    setMeditationMinutes(mins);
    setMeditationTimeLeft(mins * 60);
    clearTimeout(meditationTimerRef.current as NodeJS.Timeout);
  };

  const formatMeditationTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    // Determine target scale for animation
    // When not playing, revert to 1.
    // When playing, inhale to 1.5, exhale down to 1.0, hold at whatever was last.
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      if (timeLeft === 0) {
        // Switch phase immediately on 0 or start over
        const nextIndex = phaseIndex + 1;
        if (nextIndex >= activeExercise.phases.length) {
          setPhaseIndex(0);
          setCycleCount((c) => c + 1);
          setTimeLeft(activeExercise.phases[0].duration);
        } else {
          setPhaseIndex(nextIndex);
          setTimeLeft(activeExercise.phases[nextIndex].duration);
        }
      } else {
        timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      }
    } else {
      clearTimeout(timerRef.current as NodeJS.Timeout);
    }
    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, [isPlaying, timeLeft, phaseIndex, activeExercise]);

  const handleStartStop = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (!isPlaying && timeLeft === 0 && phaseIndex === 0) {
        setTimeLeft(activeExercise.phases[0].duration);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhaseIndex(0);
    setCycleCount(0);
    setTimeLeft(activeExercise.phases[0].duration);
    clearTimeout(timerRef.current as NodeJS.Timeout);
  };

  const handleSelectExercise = (id: string) => {
    if (isPlaying) setIsPlaying(false);
    setActiveExerciseId(id);
    const ex = EXERCISES.find((e) => e.id === id)!;
    setPhaseIndex(0);
    setCycleCount(0);
    setTimeLeft(ex.phases[0].duration);
    clearTimeout(timerRef.current as NodeJS.Timeout);
  };

  // Determine the target scale for framer-motion based on the current action
  const getScale = () => {
    if (!isPlaying && timeLeft === 0 && phaseIndex === 0) return 1; // Not started
    switch (currentPhase?.action) {
      case "inhale":
      case "hold_full":
        return 1.4;
      case "exhale":
      case "hold_empty":
        return 1.0;
      default:
        return 1.0;
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf7f5] flex flex-col font-sans">
      


      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col items-center">
        
        <div className="text-center mb-8 max-w-xl mx-auto space-y-2 mt-4">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Mental Wellness Center</h2>
          <p className="text-slate-500 font-medium">Take a moment to breathe, relax, and recharge your mind.</p>
        </div>

        <Card className="w-full max-w-4xl bg-white shadow-sm border-none rounded-3xl overflow-hidden min-h-[600px] flex flex-col p-6 md:p-10 relative">
          
          {/* Header Row */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center">
              <Wind className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Breathing Exercises</h3>
          </div>

          {/* Exercise Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {EXERCISES.map((ex) => {
              const isActive = activeExerciseId === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    isActive 
                      ? "border-cyan-400 bg-cyan-50/20 shadow-sm" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <h4 className="font-bold text-slate-800 mb-1">{ex.title}</h4>
                  <p className="text-slate-500 text-sm mb-2 font-medium line-clamp-1">{ex.description}</p>
                  <span className={`text-sm font-semibold ${isActive ? "text-cyan-500" : "text-cyan-500"}`}>
                    {ex.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Animation & Visualization Center */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
            
            {/* The Breathing Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-10 mt-auto">
              <motion.div
                className="absolute inset-0 bg-cyan-50/80 rounded-full"
                animate={{ scale: getScale() }}
                transition={{
                  duration: isPlaying ? currentPhase.duration : 1,
                  ease: "easeInOut"
                }}
              />
              <div className="relative z-10 text-center flex flex-col items-center justify-center p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPlaying ? `${phaseIndex}-${currentPhase.name}` : "idle"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-slate-700 font-bold text-xl tracking-wide mb-1"
                  >
                    {!isPlaying && timeLeft === 0 && phaseIndex === 0
                      ? "Press Play to Begin"
                      : currentPhase.name}
                  </motion.div>
                </AnimatePresence>

                {isPlaying && (
                  <motion.div
                    key={timeLeft}
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl font-extrabold text-cyan-600 mt-2"
                  >
                    {timeLeft}s
                  </motion.div>
                )}
              </div>
            </div>

            {/* Cycle Count Badge */}
            <div className="mb-8 p-1.5 px-5 bg-white border-2 border-slate-100 rounded-full shadow-sm text-sm font-bold text-slate-700">
              Cycles: {cycleCount}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleStartStop}
                className="bg-cyan-400 hover:bg-cyan-500 text-white fill-white px-8 py-3 rounded-full font-bold shadow-sm transition-all flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Square className="w-5 h-5 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Start
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-full font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

          </div>
        </Card>

        {/* Stress-Relief Suggestions Card */}
        <Card className="w-full max-w-4xl bg-white shadow-sm border-none rounded-3xl overflow-hidden mt-6 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Stress-Relief Suggestions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[#eaf4f4] rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-all border border-transparent hover:border-cyan-100">
              <div className="w-12 h-12 bg-cyan-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sun className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Morning Routine</h4>
                <p className="text-slate-600 text-sm">Start with 5 minutes of gentle stretching and deep breathing.</p>
              </div>
            </div>

            <div className="bg-[#eaf4f4] rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-all border border-transparent hover:border-cyan-100">
              <div className="w-12 h-12 bg-cyan-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Gratitude Practice</h4>
                <p className="text-slate-600 text-sm">Write down 3 things you're grateful for each day.</p>
              </div>
            </div>

            <div className="bg-[#eaf4f4] rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-all border border-transparent hover:border-cyan-100">
              <div className="w-12 h-12 bg-cyan-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Moon className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Digital Detox</h4>
                <p className="text-slate-600 text-sm">Put your phone away 1 hour before bed for better sleep.</p>
              </div>
            </div>

            <div className="bg-[#eaf4f4] rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-all border border-transparent hover:border-cyan-100">
              <div className="w-12 h-12 bg-cyan-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wind className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Nature Walk</h4>
                <p className="text-slate-600 text-sm">Spend at least 20 minutes outdoors in nature daily.</p>
              </div>
            </div>

          </div>
        </Card>

        {/* Quick Meditation Card */}
        <Card className="w-full max-w-4xl bg-[#1a233a] shadow-md border-none rounded-3xl overflow-hidden mt-6 p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            🧘 Quick Meditation
          </h3>
          <p className="text-slate-300 font-medium mb-10">Close your eyes, breathe deeply, and focus on the present moment.</p>

          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            {[1, 3, 5, 10].map((mins) => (
              <button
                key={mins}
                onClick={() => handleMeditationTimeSelect(mins)}
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                  meditationMinutes === mins 
                    ? "bg-cyan-400 text-slate-900 shadow-md" 
                    : "bg-[#253256] text-slate-300 hover:bg-[#2d3a63]"
                }`}
              >
                {mins}min
              </button>
            ))}
          </div>

          <div className="text-7xl font-extrabold text-white tracking-widest mb-12 tabular-nums">
            {formatMeditationTime(meditationTimeLeft)}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleMeditationStartStop}
              className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 fill-slate-900 px-8 py-3.5 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 text-lg"
            >
              {isMeditationPlaying ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Start
                </>
              )}
            </button>
            <button
              onClick={handleMeditationReset}
              className="bg-slate-200/90 hover:bg-white text-slate-800 px-6 py-3.5 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
