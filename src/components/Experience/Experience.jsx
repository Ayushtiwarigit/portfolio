import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExperiences } from "../../redux/Slice/experienceSlice";
import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";

export default function Experience() {
  const dispatch = useDispatch();
  const { experiences, loading, error, message } = useSelector(
    (state) => state.experience
  );

  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);

  return (
    <section
      id="experience"
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 px-6 relative overflow-hidden"
    >
      {/* Running Gradient Background */}
      <div className="absolute inset-0 -z-10 running-gradient"></div>

      <div className="max-w-6xl mx-auto relative">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-purple-400">&lt;</span>
          Experience
          <span className="text-purple-400">/&gt;</span>
        </h2>

        {/* Loader & Messages */}
        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-400">{message}</p>}
        {!loading && !error && experiences.length === 0 && (
          <p className="text-center text-gray-400">No experiences found.</p>
        )}

        {/* Timeline Center Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-purple-600/40"></div>

        <div className="flex flex-col gap-12 relative">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp._id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row w-full items-center ${
                index % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <div className="w-full md:w-1/2 relative">
                {/* Icon in center */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  className="absolute top-6 left-1/2 transform -translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-purple-700 text-white shadow-lg z-10"
                >
                  <FaBriefcase />
                </motion.div>

                {/* Card */}
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 25px rgba(139,92,246,0.7)",
                  }}
                  className={`mt-8 md:mt-0 bg-gray-900 bg-opacity-70 rounded-lg p-6 shadow-lg border border-transparent hover:border-purple-500/30 transition`}
                >
                  <h3 className="text-2xl font-semibold text-purple-300">
                    {exp.role}
                  </h3>
                  <p className="text-lg text-gray-300">{exp.company}</p>
                  <span className="block text-sm text-gray-400 mb-2">
                    {exp.duration}
                  </span>
                  <p className="text-gray-200">{exp.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inline CSS for Running Gradient */}
      <style>{`
        @keyframes runGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .running-gradient {
          position: absolute;
          inset: 0;
          z-index: -10;
          background: linear-gradient(270deg, rgba(139,92,246,0.1), rgba(192,132,252,0.1), rgba(139,92,246,0.1));
          background-color: #111;
          background-blend-mode: overlay;
          background-size: 600% 600%;
          animation: runGradient 30s linear infinite;
        }
      `}</style>
    </section>
  );
}