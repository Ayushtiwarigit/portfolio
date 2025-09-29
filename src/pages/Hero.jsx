import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import profilePic from "../assets/profile.jpeg";

// Import Vanta Rings
import RINGS from "vanta/dist/vanta.rings.min";
import * as THREE from "three";

export default function Hero() {
  const vantaRef = useRef(null);

  useEffect(() => {
    // Initialize Vanta Rings
    const effect = RINGS({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0x000000, // black background
      color: 0x8b5cf6, // purple rings

      // ✅ Optimizations for smoother feel
      spacing: 3.0, // more spacing = fewer rings
      ringSize: 1.2, // slightly smaller rings
      mouseEase: true, // smooth interpolation
      mouseCoeffX: 0.05, // reduce sensitivity
      mouseCoeffY: 0.05,
    });

    // Cleanup on unmount
    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <section
      ref={vantaRef}
      className="min-h-screen flex flex-col md:flex-row justify-center items-center text-white text-center px-6 relative overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Overlay tint (non-blocking) */}
      <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center z-10">
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0 md:mr-10">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Hi, I’m <span className="text-purple-400">Ayush Tiwari</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl max-w-2xl mb-6 text-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            A passionate{" "}
            <span className="text-purple-300 font-semibold">
              <Typewriter
                words={[
                  "Software Developer",
                  "MERN Developer",
                  "React Enthusiast",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>{" "}
            crafting modern & unique digital experiences.
          </motion.p>

          <motion.a
            href="#projects"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-lg shadow-lg transition-all"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 25px rgba(139,92,246,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
        </div>

        {/* Profile Image with Spinning Border */}
        <motion.div
          className="md:w-1/2 flex justify-center items-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-80 h-80 rounded-full flex justify-center items-center relative shadow-2xl">
            <div className="absolute inset-0 rounded-full border-8 border-transparent conic-border" />
            <img
              src={profilePic}
              alt="Ayush Tiwari"
              className="w-72 h-72 rounded-full object-cover z-10 shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      {/* Inline CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .conic-border {
          border: 8px solid transparent;
          border-radius: 50%;
          border-top-color: #8b5cf6;
          border-right-color: #e879f9;
          border-bottom-color: #8b5cf6;
          border-left-color: #e879f9;
          animation: spin 5s linear infinite;
        }
        .text-shadow-md {
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
      `}</style>
    </section>
  );
}
