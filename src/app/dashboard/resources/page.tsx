"use client";

import { useState } from "react";
import { Search, Upload } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type ResourceType = "Video" | "Audio" | "Article" | "Worksheet";

interface Resource {
  id: number;
  type: ResourceType;
  title: string;
  description: string;
  link: string;
}

const initialResources: Resource[] = [
  // ==== VIDEOS (15) ====
  {
    id: 1,
    type: "Video",
    title: "Mindfulness Meditation Guide",
    description: "Learn mindful breathing to relax and focus.",
    link: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  },
  {
    id: 2,
    type: "Video",
    title: "Coping with Anxiety",
    description: "Practical strategies to reduce anxious thoughts.",
    link: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  },
  {
    id: 3,
    type: "Video",
    title: "Daily Gratitude Practice",
    description: "Short practices to build gratitude.",
    link: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: 4,
    type: "Video",
    title: "Overcoming Exam Stress",
    description: "Tips for managing test-related pressure.",
    link: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  },
  {
    id: 5,
    type: "Video",
    title: "Emotional Regulation Skills",
    description: "Control strong emotions with simple exercises.",
    link: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
  },
  {
    id: 6,
    type: "Video",
    title: "Self-Compassion Training",
    description: "Be kinder to yourself during tough times.",
    link: "https://samplelib.com/lib/preview/mp4/sample-40s.mp4",
  },
  {
    id: 7,
    type: "Video",
    title: "Relaxation Breathing",
    description: "Follow guided breathing for calmness.",
    link: "https://samplelib.com/lib/preview/mp4/sample-50s.mp4",
  },
  {
    id: 8,
    type: "Video",
    title: "Positive Affirmations",
    description: "Boost confidence with affirmations.",
    link: "https://samplelib.com/lib/preview/mp4/sample-1s.mp4",
  },
  {
    id: 9,
    type: "Video",
    title: "Focus & Study Hacks",
    description: "Concentration tips for students.",
    link: "https://samplelib.com/lib/preview/mp4/sample-2s.mp4",
  },
  {
    id: 10,
    type: "Video",
    title: "Managing Social Anxiety",
    description: "Practical coping skills for social settings.",
    link: "https://samplelib.com/lib/preview/mp4/sample-3s.mp4",
  },
  {
    id: 11,
    type: "Video",
    title: "Breaking Negative Thought Loops",
    description: "CBT-inspired methods to stop overthinking.",
    link: "https://samplelib.com/lib/preview/mp4/sample-4s.mp4",
  },
  {
    id: 12,
    type: "Video",
    title: "Building Resilience",
    description: "Bouncing back from challenges.",
    link: "https://samplelib.com/lib/preview/mp4/sample-6s.mp4",
  },
  {
    id: 13,
    type: "Video",
    title: "Sleep Hygiene Routine",
    description: "How to improve your sleep cycle.",
    link: "https://samplelib.com/lib/preview/mp4/sample-7s.mp4",
  },
  {
    id: 14,
    type: "Video",
    title: "Handling Loneliness",
    description: "Ways to feel connected when alone.",
    link: "https://samplelib.com/lib/preview/mp4/sample-8s.mp4",
  },
  {
    id: 15,
    type: "Video",
    title: "Time Management for Students",
    description: "Organize your day to reduce stress.",
    link: "https://samplelib.com/lib/preview/mp4/sample-9s.mp4",
  },

  // ==== AUDIOS (10) ====
  {
    id: 20,
    type: "Audio",
    title: "Relaxing Nature Sounds",
    description: "Birds and rivers for peace of mind.",
    link: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
  },
  {
    id: 21,
    type: "Audio",
    title: "Deep Sleep Music",
    description: "Calm tones for restful sleep.",
    link: "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
  },
  {
    id: 22,
    type: "Audio",
    title: "Morning Motivation",
    description: "Uplifting track to start your day.",
    link: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
  },
  {
    id: 23,
    type: "Audio",
    title: "Guided Body Scan",
    description: "Awareness meditation to relax your body.",
    link: "https://samplelib.com/lib/preview/mp3/sample-12s.mp3",
  },
  {
    id: 24,
    type: "Audio",
    title: "Healing Piano",
    description: "Instrumental piano for emotional healing.",
    link: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
  },
  {
    id: 25,
    type: "Audio",
    title: "Focus Boost Tones",
    description: "Lo-fi beats to stay focused.",
    link: "https://samplelib.com/lib/preview/mp3/sample-18s.mp3",
  },
  {
    id: 26,
    type: "Audio",
    title: "Gratitude Reflection",
    description: "Short reflection practice in audio form.",
    link: "https://samplelib.com/lib/preview/mp3/sample-21s.mp3",
  },
  {
    id: 27,
    type: "Audio",
    title: "Calm Breathing Session",
    description: "Follow breathing rhythm with soothing sounds.",
    link: "https://samplelib.com/lib/preview/mp3/sample-24s.mp3",
  },
  {
    id: 28,
    type: "Audio",
    title: "Motivation for Exams",
    description: "Energizing pep talk for study time.",
    link: "https://samplelib.com/lib/preview/mp3/sample-27s.mp3",
  },
  {
    id: 29,
    type: "Audio",
    title: "Anxiety Release",
    description: "Relaxation audio to reduce tension.",
    link: "https://samplelib.com/lib/preview/mp3/sample-30s.mp3",
  },

  // ==== ARTICLES (15) ====
  {
    id: 40,
    type: "Article",
    title: "10 Tips for Better Mental Health",
    description: "Practical steps for everyday wellness.",
    link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 41,
    type: "Article",
    title: "Understanding Emotional Resilience",
    description: "How to recover quickly from setbacks.",
    link: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 42,
    type: "Article",
    title: "The Science of Gratitude",
    description: "Why gratitude improves happiness.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample.pdf",
  },
  {
    id: 43,
    type: "Article",
    title: "Managing College Stress",
    description: "Stress relief techniques for students.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample2.pdf",
  },
  {
    id: 44,
    type: "Article",
    title: "Sleep and Mental Health",
    description: "How rest affects the brain.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample3.pdf",
  },
  {
    id: 45,
    type: "Article",
    title: "Meditation for Beginners",
    description: "A simple guide to start meditating.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample4.pdf",
  },
  {
    id: 46,
    type: "Article",
    title: "Cognitive Behavioral Therapy Basics",
    description: "CBT tools for thought management.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample5.pdf",
  },
  {
    id: 47,
    type: "Article",
    title: "Loneliness and Connection",
    description: "How to build social bonds.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample6.pdf",
  },
  {
    id: 48,
    type: "Article",
    title: "Overcoming Procrastination",
    description: "Practical ways to beat delay habits.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample7.pdf",
  },
  {
    id: 49,
    type: "Article",
    title: "Nutrition for Mental Wellness",
    description: "Foods that improve brain function.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample8.pdf",
  },
  {
    id: 50,
    type: "Article",
    title: "The Power of Journaling",
    description: "Writing therapy for clarity.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample9.pdf",
  },
  {
    id: 51,
    type: "Article",
    title: "Time Management & Stress",
    description: "Better scheduling to reduce burnout.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample10.pdf",
  },
  {
    id: 52,
    type: "Article",
    title: "Digital Detox",
    description: "Why screen breaks matter.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample11.pdf",
  },
  {
    id: 53,
    type: "Article",
    title: "The Psychology of Motivation",
    description: "How to stay driven.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample12.pdf",
  },
  {
    id: 54,
    type: "Article",
    title: "Mind-Body Connection",
    description: "How physical health impacts emotions.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample13.pdf",
  },

  // ==== WORKSHEETS (10) ====
  {
    id: 60,
    type: "Worksheet",
    title: "Stress Management Worksheet",
    description: "Exercises to reduce stress.",
    link: "https://file-examples.com/storage/fe3e35bce9/2017/10/file-sample_150kB.pdf",
  },
  {
    id: 61,
    type: "Worksheet",
    title: "Self-Reflection Journal",
    description: "Daily prompts for reflection.",
    link: "https://file-examples.com/storage/fe3e35bce9/2017/10/file-sample_150kB.pdf",
  },
  {
    id: 62,
    type: "Worksheet",
    title: "Gratitude Log",
    description: "Track what you’re thankful for.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample14.pdf",
  },
  {
    id: 63,
    type: "Worksheet",
    title: "Mood Tracker",
    description: "Record emotions daily.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample15.pdf",
  },
  {
    id: 64,
    type: "Worksheet",
    title: "Sleep Tracker",
    description: "Monitor your rest quality.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample16.pdf",
  },
  {
    id: 65,
    type: "Worksheet",
    title: "Anxiety Coping Plan",
    description: "Steps for managing anxious moments.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample17.pdf",
  },
  {
    id: 66,
    type: "Worksheet",
    title: "Goal Setting Template",
    description: "SMART goals for progress.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample18.pdf",
  },
  {
    id: 67,
    type: "Worksheet",
    title: "CBT Thought Record",
    description: "Challenge negative thinking.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample19.pdf",
  },
  {
    id: 68,
    type: "Worksheet",
    title: "Mindful Eating Journal",
    description: "Track eating habits mindfully.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample20.pdf",
  },
  {
    id: 69,
    type: "Worksheet",
    title: "Self-Care Checklist",
    description: "Plan your daily self-care routine.",
    link: "https://file-examples.com/storage/fe3e35bce9/sample21.pdf",
  },
];

export default function ResourceHub() {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>(initialResources);

  // Handle video upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate a unique id (avoid collisions with non-sequential seeded ids)
    const nextId = resources.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;

    const newResource: Resource = {
      id: nextId,
      type: "Video",
      title: `Uploaded: ${file.name}`,
      description: "Your uploaded wellness video",
      link: URL.createObjectURL(file), // blob link for preview
    };

    setResources([newResource, ...resources]); // Add to the top
  };

  const filtered = resources.filter((res) =>
    [res.title, res.type, res.description]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#a3d2ff] pt-28 px-6 md:px-20">
      {/* Heading */}
      <motion.div
        className="text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold   text-black">Resource Hub</h1>
        <p className="text-xl md:text-2xl text-gray-700 mt-4">
          Browse and access our collection of mental health resources
        </p>
      </motion.div>

      {/* Search + Upload */}
      <motion.div
        className="max-w-2xl mx-auto mb-12 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {/* Search */}
        <div className="flex flex-1 items-center bg-white rounded-2xl px-4 py-3 shadow-lg">
          <Search className="w-6 h-6 text-gray-500 mr-3" />
          <Input
            placeholder="Search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0"
          />
        </div>

        {/* Upload */}
        <label className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl cursor-pointer shadow-lg transition">
          <Upload className="w-5 h-5" />
          <span>Upload </span>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </motion.div>

      {/* Resource List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filtered.length === 0 ? (
          <p className="text-gray-700 text-lg">No resources found.</p>
        ) : (
          filtered.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className="w-full max-w-sm"
            >
              <Card
                className="bg-gradient-to-r from-blue-200 via-pink-200 to-purple-200 
                           animate-gradient bg-[length:200%_200%] 
                           shadow-lg hover:shadow-2xl transition rounded-2xl relative"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center relative z-10">
                  <h3 className="text-2xl font-semibold text-black">{res.title}</h3>
                  <p className="text-md text-gray-700 mt-2">{res.description}</p>
                  <span className="mt-2 text-sm text-blue-600 font-medium">
                    {res.type}
                  </span>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Link
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full transition"
                    >
                      View
                    </Link>
                    <Link
                      href={res.link}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
                    >
                      Download
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradientMove 8s ease infinite;
        }
      `}</style>
    </main>
  );
}
