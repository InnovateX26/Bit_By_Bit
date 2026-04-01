"use client";
import {
  ArrowRightIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const Frame = (): JSX.Element => {
  return (
    <main className="bg-[#bcf3f3] min-h-screen w-full flex justify-center scroll-smooth">
      <div className="w-full max-w-[1440px] relative flex flex-col items-center overflow-hidden">
        {/* Header Section */}
        <motion.header
          className="text-center mt-16 md:mt-24 px-4 md:px-6"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-medium text-3xl md:text-5xl lg:text-6xl leading-snug mb-6 [font-family:'Outfit',Helvetica]">
            <span className="text-white">With </span>
            <span className="text-[#0c0966]">CaReBot+</span>
            <span className="text-white">, Every Health Issue Finds a Cure</span>
          </h2>

          <h1 className="font-bold text-[40px] md:text-[60px] lg:text-[120px] leading-tight [font-family:'Outfit',Helvetica]">
            <span className="text-[#0c0966]">your </span>
            <span className="text-white">AI </span>
            <span className="text-[#0c0966]">health companion</span>
          </h1>
        </motion.header>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between mt-12 md:mt-20 px-4 md:px-16 relative w-full">
          {/* Left Text Block */}
          <motion.div
            className="max-w-xl text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Typewriter Effect */}
            <div className="mb-8">
              <TypeAnimation
                sequence={[
                  "CaReBot is your intelligent health companion, designed to guide, support, and simplify healthcare by providing smart solutions to everyday health issues—anytime, anywhere.",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                style={{
                  fontSize: "1.2rem",
                  display: "inline-block",
                  color: "black",
                  fontWeight: "500",
                }}
                repeat={0}
              />
            </div>

            {/* Call to Action */}
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Experience AI-powered healthcare assistance with our intelligent medical chatbot, 
                location-based hospital finder, and comprehensive health management tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  className="rounded-[40px] border border-solid 
                shadow-[0_0_15px_#6cf0f2,0_0_30px_#6cf0f2] 
                bg-[#6cf0f2] animate-pulse hover:scale-105 transition duration-300 px-8 py-4"
                  onClick={() => {
                    window.location.href = '/dashboard';
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-black text-lg md:text-xl lg:text-2xl leading-normal">
                      Get Started Free
                    </span>
                    <ArrowRightIcon className="w-5 h-5 text-black" />
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer Section with Robot + Socials */}
        <footer className="relative w-full flex flex-col items-center mt-24 md:mt-40 mb-12 md:mb-16">
          {/* Robot in the middle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <img
              src="/robot.png"
              alt="CaReBot illustration"
              className="w-[250px] sm:w-[350px] md:w-[550px] lg:w-[600px] drop-shadow-[0_0_25px_#6cf0f2]"
            />
          </motion.div>

          {/* Text + Socials */}
          <motion.div
            className="mt-6 md:mt-10 flex flex-col items-center md:items-end space-y-4 md:absolute md:right-6 md:bottom-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-medium text-black text-base sm:text-lg md:text-xl leading-normal text-center md:text-right">
              <b>Stay Healthy, Stay Smart with CaReBot</b>
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <FacebookIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 cursor-pointer hover:scale-125 transition" />
              <TwitterIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black cursor-pointer hover:scale-125 transition" />
              <InstagramIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500 cursor-pointer hover:scale-125 transition" />
              <YoutubeIcon className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 cursor-pointer hover:scale-125 transition" />
            </div>
          </motion.div>
        </footer>
      </div>
    </main>
  );
};

export default Frame;
