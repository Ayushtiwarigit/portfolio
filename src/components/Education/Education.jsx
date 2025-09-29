import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchEducation } from "../../redux/Slice/educationSlice";
import { FaSchool, FaUniversity } from "react-icons/fa";

export default function Education() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.education);

  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  const getIcon = (qualification) => {
    if (
      qualification?.toLowerCase().includes("10th") ||
      qualification?.toLowerCase().includes("12th")
    ) {
      return <FaSchool className="w-6 h-6 text-purple-400" />;
    }
    return <FaUniversity className="w-6 h-6 text-purple-400" />;
  };

  // Some APIs wrap inside `results`
  const educationList = Array.isArray(list?.results) ? list.results : list || [];

  return (
    <section
      id="education"
      className="relative min-h-screen py-16 px-6 text-white overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-black animate-gradient-x opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-purple-900 to-black animate-gradient-y opacity-30"></div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Loading & Error */}
      <div className="relative z-10 max-w-5xl mx-auto mb-12">
        {loading && <p className="text-center text-purple-400">⏳ Loading...</p>}
        {error && (
          <p className="text-center text-red-500">❌ {error.message || error}</p>
        )}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-purple-400">&lt;</span> Education
          <span className="text-purple-400">/&gt;</span>
        </h2>

        {/* Vertical timeline line */}
        <div className="absolute left-1/2 top-20 h-full w-1 bg-purple-700/40 transform -translate-x-1/2"></div>

        <div className="flex flex-col gap-12 relative">
          {educationList
            .slice()
            .reverse()
            .map((edu, index) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  type: "spring",
                  stiffness: 120,
                  delay: index * 0.2,
                }}
                className={`flex items-center w-full ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`relative w-full md:w-1/2 bg-gray-900 bg-opacity-80 rounded-xl shadow-xl border border-gray-700 hover:border-purple-500 p-6 ${
                    index % 2 === 0 ? "mr-auto text-right" : "ml-auto text-left"
                  }`}
                >
                  {/* Connector dot */}
                  <div
                    className={`absolute top-6 w-4 h-4 rounded-full bg-purple-500 border-4 border-gray-900 ${
                      index % 2 === 0 ? "-right-8" : "-left-8"
                    }`}
                  ></div>

                  {/* Degree & Icon */}
                  <div className="flex items-center gap-3 mb-2">
                    {getIcon(edu.qualification)}
                    <h3 className="text-xl font-semibold text-purple-300">
                      {edu.qualification}
                    </h3>
                  </div>

                  {/* Institution */}
                  <p className="text-gray-300 mb-1">{edu.name}</p>

                  {/* Year & Grade */}
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-gray-200">Address:</span>{" "}
                    {edu.address}
                  </p>
                  {edu.gradeOrPercentage && (
                    <p className="text-sm text-gray-400">
                      <span className="font-medium text-gray-200">Grade:</span>{" "}
                      {edu.gradeOrPercentage}
                    </p>
                  )}
                  {edu.yearOfCompletion && (
                    <p className="text-sm text-gray-400">
                      <span className="font-medium text-gray-200">Year:</span>{" "}
                      {edu.yearOfCompletion}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Inline CSS for gradient animation */}
      <style>{`
        @keyframes gradientX {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientY {
          0% { background-position: 50% 0%; }
          50% { background-position: 50% 100%; }
          100% { background-position: 50% 0%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradientX 25s ease infinite;
        }
        .animate-gradient-y {
          background-size: 200% 200%;
          animation: gradientY 35s ease infinite;
        }
      `}</style>
    </section>
  );
}
