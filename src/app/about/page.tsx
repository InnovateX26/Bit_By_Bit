"use client";

import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";

/* ================= TEAM ================= */

const teamMembers = [
  {
    name: "Bipasa Saha",
    image: "/bipasa.svg",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/bipasa-saha-570000335/",
    github: "https://github.com/Bipasa777-lab",
  },
  {
    name: "Bikram Bera",
    image: "/bikram.svg",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/bikram-bera-8502a2303/",
    github: "https://github.com/Rebikrrt399",
  },
  {
    name: "Animesh Sahoo",
    image: "/animesh.svg",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/animesh-sahoo-b03151302/",
    github: "https://github.com/STROM6532",
  },
  {
    name: "Santanu Maity",
    image: "/santanu.svg",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/santanu-maity-8934b8372",
    github: "https://github.com/santanumaity3155-spec",
  },
];

const revealOnce = { once: true, amount: 0.2 };

/* ================= COMPONENT ================= */

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />

      {/* HERO */}
      <section className="text-center py-12 text-white bg-gradient-to-r from-teal-400 via-blue-400 to-purple-500 bg-[length:200%_200%] animate-gradientMove">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold"
        >
          About CareBot+
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-2 max-w-3xl mx-auto text-lg"
        >
          “Bridging the gap between technology and healthcare with intelligence and care.”
        </motion.p>
      </section>

      {/* TEAM */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="relative group rounded-2xl shadow-lg overflow-hidden bg-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={revealOnce}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={300}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-end pb-6">
                <h3 className="text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-200">
                  {member.role ?? "Developer"}
                </p>

                <div className="flex gap-4 mt-2">
                  <a href={member.linkedin} target="_blank">
                    <FaLinkedin className="text-white" />
                  </a>
                  <a href={member.github} target="_blank">
                    <FaGithub className="text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOG STYLE ABOUT SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10 leading-relaxed">

        {/* INTRO */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealOnce}>
          <h2 className="text-2xl font-bold">🚀 Introduction</h2>
          <p className="mt-3 text-justify">
            In today’s fast-paced world, access to timely and reliable healthcare is more critical than ever.
            <strong> CareBot+</strong> is a next-generation AI-powered medical assistant designed to provide
            real-time healthcare support, emergency guidance, and intelligent medical insights directly to users.
          </p>
        </motion.div>

        {/* WHAT IS */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealOnce}>
          <h2 className="text-2xl font-bold">🧠 What is CareBot+?</h2>
          <p className="mt-3 text-justify">
            CareBot+ is a full-stack AI-driven healthcare ecosystem combining artificial intelligence,
            real-time processing, and geolocation services to deliver a seamless medical support experience.
          </p>
        </motion.div>

        {/* FEATURES */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealOnce}>
          <h2 className="text-2xl font-bold">🌟 Key Features</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>AI Medical Chatbot (Meditron + LangChain)</li>
            <li>Symptom & Report Analysis</li>
            <li>Emergency Assistance System</li>
            <li>Nearby Hospital & Pharmacy Locator</li>
            <li>Multilingual Support</li>
            <li>Secure Local Data Processing</li>
          </ul>
        </motion.div>

        {/* TECH STACK */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealOnce}>
          <h2 className="text-2xl font-bold">🛠️ Tech Stack</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Frontend: Next.js, TypeScript, Tailwind CSS</li>
            <li>Backend: Node.js, Express</li>
            <li>AI Backend: Python, Flask</li>
            <li>AI Model: Meditron</li>
          </ul>
        </motion.div>

        {/* USE CASE */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealOnce}>
          <h2 className="text-2xl font-bold">🌍 Use Cases</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Emergency symptom analysis</li>
            <li>Medical report understanding</li>
            <li>Nearby healthcare service discovery</li>
          </ul>
        </motion.div>

        {/* FUTURE */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealOnce}>
          <h2 className="text-2xl font-bold">🔮 Future Roadmap</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Doctor booking system</li>
            <li>AI X-ray analysis</li>
            <li>Wearable integration</li>
          </ul>
        </motion.div>

        {/* CONCLUSION */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealOnce}>
          <h2 className="text-2xl font-bold">💡 Conclusion</h2>
          <p className="mt-3 text-justify font-semibold">
            CareBot+ is more than just a project — it is a mission to make healthcare intelligent,
            accessible, and immediate for everyone.
          </p>
        </motion.div>

      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-6 text-center mt-12">
        <p>©️ {new Date().getFullYear()} CareBot+. All rights reserved.</p>
      </footer>
    </div>
  );
}