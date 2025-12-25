// File: app/page.tsx


"use client";


import { motion } from "framer-motion";


import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main
      className="relative flex h-screen w-full flex-col 
                 items-center justify-center
                 bg-[url('/hero-bg.jpeg')] 
                 bg-cover bg-center"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated Content Container */}
      <div className="relative z-10 flex flex-col items-center">

        {/* 4. Wrap H1 in a container for a "stagger" effect */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-6xl font-light text-white tracking-tight"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            FounderFuel
          </motion.h1>
        </div>

        {/* 5. Wrap P in a container */}
        <div className="overflow-hidden">
          <motion.p
            className="mt-4 text-lg text-gray-200 tracking-wider"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            Your AI Content Engine
          </motion.p>
        </div>

        {/* 6. CTA Button with spring animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.6
          }}
        >
          <Button
            variant="outline"
            size="lg"
            className="mt-8 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300"
          >
            Get Started
          </Button>
        </motion.div>

      </div>
    </main>
  );
}