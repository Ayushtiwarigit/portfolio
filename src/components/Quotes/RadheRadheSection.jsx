import React from "react";
import { motion } from "framer-motion";
import { GiFlute } from "react-icons/gi";
import { FaOm } from "react-icons/fa";

export default function RadheRadheSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 text-gray-900 relative overflow-hidden">
      {/* Background decorative flutes */}
      <GiFlute className="absolute top-10 left-5 text-pink-400 text-6xl opacity-20 animate-bounce" />
      <GiFlute className="absolute bottom-10 right-5 text-purple-500 text-6xl opacity-20 animate-pulse" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Om Icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <FaOm className="text-5xl text-purple-600 drop-shadow-lg" />
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
          🌸 Radhe Radhe 🌸
        </h2>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg md:text-xl text-gray-800 italic mb-6"
        >
          “जहाँ श्री राधा रानी हैं, वहाँ स्वयं श्री कृष्ण हैं,  
          और जहाँ श्री कृष्ण हैं, वहाँ सम्पूर्ण आनंद है।”  
        </motion.p>

        {/* Animated Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.2 }}
          className="h-1 bg-purple-400 mx-auto rounded-full mb-6"
        ></motion.div>

        {/* Closing line */}
        <p className="text-sm md:text-base text-gray-700">
          May Shri Radha Krishna bless you with{" "}
          <span className="text-purple-600 font-semibold">love, peace, and success</span>.  
        </p>
      </div>
    </section>
  );
}
