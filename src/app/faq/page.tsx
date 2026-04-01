"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();

  const faqs = [
    {
      question: "What is Mind Haven and why should I use it?",
      answer:
        "Mind Haven is a mental wellness platform that combines AI-powered support, professional counseling, and a supportive community to help you manage your mental health.",
    },
    {
      question: "How can I register and start using Mind Haven?",
      answer:
        "Click 'Sign Up', enter your details, verify your email, and start exploring AI chat, resources, and scheduling appointments with therapists.",
    },
    {
      question: "Can AI chat replace a therapist?",
      answer:
        "No, AI chat offers immediate support, coping strategies, and guidance, but it cannot replace professional therapy sessions.",
    },
    {
      question: "How do I schedule a counseling session?",
      answer:
        "Select a therapist from the list, check availability, and book a session for video, phone, or in-person consultations.",
    },
    {
      question: "Is my personal data safe?",
      answer:
        "Absolutely. Mind Haven uses encryption and follows strict privacy protocols to ensure your data is protected.",
    },
    {
      question: "What is peer support?",
      answer:
        "Connect with others who have similar experiences through moderated support groups and one-on-one peer mentorship.",
    },
    {
      question: "What should I do in a mental health emergency?",
      answer:
        "Contact emergency services (911) or the 988 Suicide & Crisis Lifeline immediately. Our platform also provides local crisis resources.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleContactClick = () => {
    router.push("/contact");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-['Outfit']">
      {/* New Background from Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#cde6ff] to-[#a9d8ff]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />

      {/* FAQ Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-[#0b5a4b] drop-shadow-lg">Frequently Asked </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-[#0b5a4b] animate-pulse">
              Questions
            </span>
          </h1>
          <p className="text-xl text-[#0b5a4b]/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about Mind Haven
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-[#00bfff] to-[#0b5a4b] mx-auto rounded-full shadow-sm mt-6" />
        </div>

        {/* FAQ Cards */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white/60 backdrop-blur-md rounded-2xl shadow-md border border-white/40 cursor-pointer transition-all duration-500 hover:shadow-xl transform hover:scale-[1.02] ${
                openIndex === index
                  ? "shadow-xl bg-white/70"
                  : hoveredIndex === index
                  ? "shadow-md bg-white/65"
                  : ""
              }`}
              onClick={() => toggleFAQ(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0b5a4b] flex-1 pr-4">
                    {faq.question}
                  </h3>
                  <div
                    className={`transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-[#00bfff]" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-[#0b5a4b]" />
                    )}
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-4 border-t border-white/30 mt-4">
                    <p className="text-lg text-[#0b5a4b]/80 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/40 max-w-2xl mx-auto hover:bg-white/70 transition-all duration-500">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#00bfff]/20 p-3 rounded-full shadow-lg">
                <MessageSquare className="text-[#0b5a4b] w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#0b5a4b] mb-4">
              Still have questions?
            </h3>
            <p className="text-lg text-[#0b5a4b]/80 mb-8 font-medium">
              We're here to help! Our support team is ready to assist you.
            </p>
            <button
              onClick={handleContactClick}
              className="bg-[#00bfff] hover:bg-[#00ace6] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:scale-105"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
