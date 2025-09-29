import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAbout } from "../../redux/Slice/aboutSlice"; // Redux slice

// Icons
import { FaReact, FaNodeJs, FaDatabase, FaCss3Alt, FaJs } from "react-icons/fa";

export default function About() {
  const dispatch = useDispatch();
  const { about, loading, error } = useSelector((state) => state.about);

  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  // Map tech stack to icons
  const iconMap = {
    React: <FaReact className="text-cyan-400 text-xl" />,
    Node: <FaNodeJs className="text-green-500 text-xl" />,
    MongoDB: <FaDatabase className="text-emerald-400 text-xl" />,
    "Tailwind CSS": <FaCss3Alt className="text-sky-400 text-xl" />,
    Javascript: <FaJs className="text-yellow-400 text-xl" />,
  };

  // Highlight Ayush + full-stack developer
  const highlightText = (text) => {
    if (!text) return "";
    return text.split(" ").map((word, i) => {
      if (word.toLowerCase().includes("ayush")) {
        return (
          <span key={i} className="font-bold text-purple-400">
            {word}{" "}
          </span>
        );
      }
      if (
        word.toLowerCase().includes("full-stack") ||
        word.toLowerCase().includes("developer")
      ) {
        return (
          <span key={i} className="font-bold text-purple-300">
            {word}{" "}
          </span>
        );
      }
      return word + " ";
    });
  };

  return (
    <section
      id="about"
      className="min-h-screen relative flex flex-col md:flex-row items-center justify-center px-6 py-20 gap-12 scroll-mt-20 text-white overflow-hidden"
    >
      {/* Running Gradient Layers */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-black animate-gradient-x opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-purple-900 to-black animate-gradient-y opacity-30"></div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500/60"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8 + Math.random() * 6,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Profile Image with Spinning Conic Border */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex justify-center items-center shadow-2xl border-3 border-purple-600"
      >
        <div className="absolute inset-0 rounded-full conic-border" />
        {about?.image && (
          <img
            src={about.image}
            alt="Profile"
            className="w-64 h-64 md:w-72 md:h-72 rounded-full object-cover z-10 shadow-xl"
          />
        )}
        <div className="absolute inset-0 rounded-full shadow-[0_0_50px_rgba(139,92,246,0.6)] animate-pulse"></div>
      </motion.div>

      {/* About Info */}
      <motion.div
        className="max-w-xl space-y-6 z-10 backdrop-blur-lg p-6 rounded-xl bg-gray-900/40 shadow-lg border border-purple-600/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-purple-400">
          <span className="text-purple-400">&lt;</span>About Me
          <span className="text-purple-400">/&gt;</span>
        </h2>

        {loading ? (
          <p className="text-gray-300 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : (
          <>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {highlightText(about?.aboutText)}
            </p>

            {/* Skills / Highlights */}
            <div className="flex flex-wrap gap-3">
              {(about?.techStack || []).map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 20px rgba(139,92,246,0.7)",
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-700 bg-opacity-50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 rounded-full text-white font-medium text-sm transition-all duration-300"
                >
                  {iconMap[skill] || null} {skill}
                </motion.span>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Inline CSS */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .conic-border { border: 6px solid transparent; border-radius: 50%; border-top-color: #8b5cf6; border-right-color: #c084fc; border-bottom-color: #8b5cf6; border-left-color: #c084fc; position: absolute; inset: 0; animation: spin 5s linear infinite; }
        @keyframes gradientX { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes gradientY { 0% { background-position: 50% 0%; } 50% { background-position: 50% 100%; } 100% { background-position: 50% 0%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradientX 25s ease infinite; }
        .animate-gradient-y { background-size: 200% 200%; animation: gradientY 35s ease infinite; }
      `}</style>
    </section>
  );
}
