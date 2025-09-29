// src/pages/TechStack.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchTechStacks } from "../../redux/Slice/techStackSlice";

// Icons
import {
  FaReact, FaNodeJs, FaDatabase, FaTools, FaHtml5, FaCss3Alt, FaBootstrap,
  FaJava, FaWordpress, FaShopify, FaCode, FaAngular
} from "react-icons/fa";
import {
  SiTailwindcss, SiJavascript, SiMongodb, SiTypescript, SiC, SiCplusplus, SiDocker,
  SiNextdotjs, SiVite, SiGit, SiFigma, SiNestjs, SiPostgresql, SiRedis, SiPrisma,
  SiGraphql, SiArduino, SiRaspberrypi, SiEspressif,
  SiRuby
} from "react-icons/si";

const techIcons = {
  HTML: <FaHtml5 className="text-orange-500 w-5 h-5" />,
  CSS: <FaCss3Alt className="text-blue-500 w-5 h-5" />,
  Bootstrap: <FaBootstrap className="text-purple-500 w-5 h-5" />,
  React: <FaReact className="text-cyan-400 w-5 h-5" />,
  "Next.js": <SiNextdotjs className="text-white w-5 h-5" />,
  Angular: <FaAngular className="text-red-600 w-5 h-5" />,
  "Tailwind CSS": <SiTailwindcss className="text-sky-400 w-5 h-5" />,
  TypeScript: <SiTypescript className="text-blue-400 w-5 h-5" />,
  Vite: <SiVite className="text-yellow-400 w-5 h-5" />,
  JavaScript: <SiJavascript className="text-yellow-400 w-5 h-5" />,
  C: <SiC className="text-blue-500 w-5 h-5" />,
  "C++": <SiCplusplus className="text-indigo-500 w-5 h-5" />,
  Java: <FaJava className="text-red-500 w-5 h-5" />,
  Algorithms: <FaTools className="text-gray-300 w-5 h-5" />,
  Docker: <SiDocker className="text-blue-400 w-5 h-5" />,
  "Git/GitHub": <SiGit className="text-gray-200 w-5 h-5" />,
  "VS Code": <FaCode className="text-blue-300 w-5 h-5" />,
  "CI/CD": <FaTools className="text-green-400 w-5 h-5" />,
  Figma: <SiFigma className="text-pink-400 w-5 h-5" />,
  "Node.js": <FaNodeJs className="text-green-500 w-5 h-5" />,
  Express: <FaNodeJs className="text-gray-300 w-5 h-5" />,
  NestJS: <SiNestjs className="text-red-500 w-5 h-5" />,
  Postgres: <SiPostgresql className="text-sky-400 w-5 h-5" />,
  MongoDB: <SiMongodb className="text-green-400 w-5 h-5" />,
  PostgreSQL: <SiPostgresql className="text-sky-500 w-5 h-5" />,
  Redis: <SiRedis className="text-red-500 w-5 h-5" />,
  Prisma: <SiPrisma className="text-indigo-400 w-5 h-5" />,
  WordPress: <FaWordpress className="text-blue-400 w-5 h-5" />,
  Shopify: <FaShopify className="text-green-500 w-5 h-5" />,
  "Shopify GraphQL": <SiGraphql className="text-pink-500 w-5 h-5" />,
  Arduino: <SiArduino className="text-red-500 w-5 h-5" />,
  RaspberryPi: <SiRaspberrypi className="text-green-500 w-5 h-5" />,
  ESP32: <SiEspressif className="text-blue-400 w-5 h-5" />,
  MQTT: <FaCode className="text-purple-400 w-5 h-5" />,
  Sensors: <FaTools className="text-yellow-400 w-5 h-5" />,
    Ruby: <SiRuby className="text-red-500 w-5 h-5" />,
};

// ✅ Helper function to match icons ignoring case/spacing
const getIcon = (name) => {
  if (!name) return null;
  const key = Object.keys(techIcons).find(
    (k) => k.toLowerCase().trim() === name.toLowerCase().trim()
  );
  return key ? techIcons[key] : null;
};

export default function TechStack() {
  const dispatch = useDispatch();
  const { stacks, loading } = useSelector((state) => state.techStack);

  useEffect(() => {
    dispatch(fetchTechStacks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent"
        />
      </div>
    );
  }

  const highlights = stacks.flatMap((stack) =>
    stack.skills.filter((s) => s.level?.toLowerCase() === "advanced")
  );

  return (
    <motion.section
      id="tech"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-16 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8">
          <span className="text-purple-400">&lt;</span>Tech Stack
          <span className="text-purple-400">/&gt;</span>
        </h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          My toolbox — frontend, backend, programming languages, CMS/e-commerce, IoT, and developer tools I use to build modern, scalable applications.
        </p>

        {/* Main Grid for Tech Stacks */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ gridAutoFlow: "dense" }}
        >
          {stacks.map((stack) => (
            <motion.div
              key={stack._id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-gray-900 bg-opacity-70 rounded-xl p-5 shadow-lg border border-transparent hover:border-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-800 flex items-center justify-center text-white shadow-md">
                    <FaTools className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-300">{stack.category}</h3>
                </div>
                <div className="text-sm text-gray-400">{stack.skills.length} items</div>
              </div>

              <ul className="mt-4 grid grid-cols-1 gap-2">
                {stack.skills.map((skill) => (
                  <motion.li
                    key={skill._id}
                    whileHover={{ x: 6, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-800 bg-opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(skill.name) && (
                        <motion.span
                          whileHover={{ rotate: 10, scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {getIcon(skill.name)}
                        </motion.span>
                      )}
                      <span className="text-gray-200">{skill.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">{skill.level}</div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Highlight Card */}
          {highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="lg:col-span-2 sm:col-span-2 bg-gradient-to-r from-purple-900/50 via-purple-800/30 to-gray-900/20 rounded-xl p-6 shadow-lg border border-purple-600/20 glow-purple"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SiJavascript className="w-8 h-8 text-yellow-400" />
                  <h4 className="text-lg font-semibold">Highlights (Advanced)</h4>
                </div>
                <div className="text-sm text-gray-300">Expertise</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {highlights.map((s) => (
                  <motion.span
                    key={s._id}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-full bg-purple-800 bg-opacity-30 border border-purple-700 text-sm text-gray-200 flex items-center gap-2"
                  >
                    {getIcon(s.name) && <span>{getIcon(s.name)}</span>}
                    {s.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
