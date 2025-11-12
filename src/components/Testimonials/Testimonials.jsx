import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight,} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestimonials } from "../../redux/Slice/testimonialSlice";

export default function TestimonialsSlider() {
  const dispatch = useDispatch();
  const { items: testimonials, loading, error } = useSelector(
    (state) => state.testimonials
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-purple-400 text-lg">
        Loading testimonials...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400 text-lg">
        Failed to load testimonials: {error}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg">
        No testimonials available.
      </div>
    );
  }

  const current = testimonials[currentIndex];
  const rating = Number(current.rating ?? 0);
  return (
    <motion.section
      id="testimonials"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-16 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">
          <span className="text-purple-400">&lt;</span>Testimonials
          <span className="text-purple-400">/&gt;</span>
        </h2>
        <p className="text-gray-400 mb-12">
          Words from clients, colleagues, and collaborators who’ve experienced my work firsthand.
        </p>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 bg-opacity-70 rounded-xl p-8 shadow-lg border border-purple-500/20 mx-auto max-w-2xl relative"
            >
              <div className="flex justify-center mb-4">
                <FaQuoteLeft className="text-purple-400 text-2xl" />
              </div>

              <p className="text-gray-300 text-lg mb-6 italic">
                {current.testimonial}
              </p>

              <div className="flex justify-center mb-4">
                <FaQuoteRight className="text-purple-400 text-2xl" />
              </div>

              <div className="flex items-center justify-center gap-4">
                {current.image && (
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
                  />
                )}
                <div className="text-left">
                  <h4 className="font-semibold text-white">{current.name}</h4>
                  <p className="text-sm text-gray-400">{current.role}</p>
                </div>
              </div>
              {rating > 0 && (
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < rating ? "text-yellow-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-purple-900 bg-opacity-50 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-purple-900 bg-opacity-50 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            <FaChevronRight />
          </button>
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-purple-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

