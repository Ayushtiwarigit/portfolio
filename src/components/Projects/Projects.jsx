import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiMongodb,
  SiJavascript,
  SiHtml5,
} from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../redux/Slice/projectSlice";

// Tech icons map
const techIcons = {
  React: <FaReact className="text-cyan-400 w-4 h-4" />,
  "Node.js": <FaNodeJs className="text-green-500 w-4 h-4" />,
  MongoDB: <SiMongodb className="text-green-400 w-4 h-4" />,
  "Tailwind CSS": <SiTailwindcss className="text-sky-400 w-4 h-4" />,
  "Next.js": <SiNextdotjs className="text-white w-4 h-4" />,
  JavaScript: <SiJavascript className="text-yellow-400 w-4 h-4" />,
  Express: <FaDatabase className="text-gray-400 w-4 h-4" />,
  HTML: <SiHtml5 className="text-orange-400 w-4 h-4" />,
};

export default function Projects() {
  const dispatch = useDispatch();
  const { results = [], loading, error, message } = useSelector(
    (state) => state.project
  );

  const [selectedTech, setSelectedTech] = useState("");

  // fetch projects once
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // extract tech name from API structure
  const extractTechName = (techObj) => {
    if (!techObj) return null;
    if (typeof techObj === "string") return techObj;
    if (techObj.skill?.name) return techObj.skill.name;
    if (typeof techObj.techStack === "string") return techObj.techStack;
    if (techObj.techStack?.category) return techObj.techStack.category;
    return null;
  };

  // build unique tech list + counts
  const { uniqueTechs, techCounts } = useMemo(() => {
    const set = new Set();
    const counts = {};
    results.forEach((proj) => {
      proj.technologiesUsed?.forEach((t) => {
        const name = extractTechName(t);
        if (name) {
          set.add(name);
          counts[name] = (counts[name] || 0) + 1;
        }
      });
    });
    return { uniqueTechs: Array.from(set).sort(), techCounts: counts };
  }, [results]);

  // filter projects
  const filteredResults = useMemo(() => {
    if (!selectedTech) return results;
    return results.filter((proj) =>
      proj.technologiesUsed?.some((t) => extractTechName(t) === selectedTech)
    );
  }, [results, selectedTech]);

  return (
    <section
      id="projects"
      className="min-h-screen py-16 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-6"
        >
          <span className="text-purple-400">&lt;</span>Projects
          <span className="text-purple-400">/&gt;</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Click a tech chip to filter projects dynamically.
        </motion.p>

        {/* Tech Chips */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          <motion.button
            variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
            onClick={() => setSelectedTech("")}
            className={`px-3 py-1 rounded-full border transition text-sm ${
              selectedTech === ""
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-gray-800 text-gray-200 border-gray-700 hover:border-purple-500"
            }`}
          >
            All ({results.length})
          </motion.button>

          {uniqueTechs.map((tech) => (
            <motion.button
              key={tech}
              variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => setSelectedTech((prev) => (prev === tech ? "" : tech))}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm transition ${
                selectedTech === tech
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-gray-800 text-gray-200 border-gray-700 hover:border-purple-500"
              }`}
            >
              {techIcons[tech] ?? (
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              )}
              <span>{tech}</span>
              <span className="ml-1 text-xs text-gray-300">
                ({techCounts[tech] || 0})
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Status */}
        {loading && <p className="text-center text-purple-400">Loading...</p>}
        {error && <p className="text-center text-red-400">{message}</p>}

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredResults?.length > 0 ? (
              filteredResults.map((proj) => (
                <motion.div
                  key={proj._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 bg-opacity-70 rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-purple-500/50 hover:shadow-purple-700/30 transition"
                >
                  <img
                    src={proj.projectImage || "https://placehold.co/400x250"}
                    alt={proj.projectName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-purple-300">
                      {proj.projectName}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {proj.projectDescription}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2">
                      {proj.technologiesUsed?.map((t, i) => {
                        const name = extractTechName(t) || "Unknown";
                        return (
                          <span
                            key={`${proj._id}-${name}-${i}`}
                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-800 bg-opacity-30 border border-purple-600 text-sm text-gray-200"
                          >
                            {techIcons[name] ?? null}
                            {name}
                          </span>
                        );
                      })}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 mt-2">
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 bg-gray-800 bg-opacity-50 rounded-md hover:bg-purple-700 hover:text-white transition"
                        >
                          <FaGithub /> GitHub
                        </a>
                      )}
                      {proj.previewLink && (
                        <a
                          href={proj.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 bg-gray-800 bg-opacity-50 rounded-md hover:bg-purple-700 hover:text-white transition"
                        >
                          <FaExternalLinkAlt /> Live
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              !loading && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 col-span-full"
                >
                  No projects found.
                </motion.p>
              )
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
