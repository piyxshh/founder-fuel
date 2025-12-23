// File: app/page.tsx

// 1. Tell Next.js this is an interactive Client Component
"use client";

// 2. Import the "motion" component from our new library
import { motion } from "framer-motion";

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
        
        {/* 3. Wrap H1 in a container for a "stagger" effect */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-6xl font-light text-white tracking-tight"
            // Animation properties:
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            FounderFuel
          </motion.h1>
        </div>

        {/* 4. Wrap P in a container */}
        <div className="overflow-hidden">
          <motion.p
            className="mt-4 text-lg text-gray-200 tracking-wider"
            // Animation properties:
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            Your AI Content Engine
          </motion.p>
        </div>

      </div>
    </main>
  );
}