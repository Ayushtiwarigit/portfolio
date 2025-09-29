import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAwards } from "../../redux/Slice/awardSlice";

export default function AwardsAchievements() {
  const dispatch = useDispatch();
  const { awards, loading, error } = useSelector((state) => state.awards);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(fetchAwards());
  }, [dispatch]);

  const openLightbox = (imgUrl) => {
    setSelectedImage(imgUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setLightboxOpen(false);
  };

  return (
    <motion.section
      id="awards"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-16 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8">
          <span className="text-purple-400">&lt;</span>Awards & Achievements
          <span className="text-purple-400">/&gt;</span>
        </h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          Recognitions and milestones that mark my journey in tech and innovation.
        </p>

        {/* Loader */}
        {loading && (
          <p className="text-center text-gray-400">Loading awards...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">
            Failed to load awards: {error}
          </p>
        )}

        {/* Awards Grid */}
        {!loading && awards.length > 0 && (
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
          >
            {awards.map((award) => (
              <motion.div
                key={award._id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-gray-900 bg-opacity-70 rounded-xl shadow-lg border border-transparent hover:border-purple-500/30 overflow-hidden"
              >
                {/* Image on Top */}
                {award.image && (
                  <img
                    src={award.image}
                    alt={award.title}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
                    onClick={() => openLightbox(award.image)}
                  />
                )}

                {/* Text Content */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">
                    {award.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {new Date(award.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300">{award.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && awards.length === 0 && (
          <p className="text-center text-gray-400">No awards added yet.</p>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-3xl max-h-[90vh] rounded-lg shadow-lg"
          />
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl font-bold"
          >
            ×
          </button>
        </div>
      )}
    </motion.section>
  );
}
