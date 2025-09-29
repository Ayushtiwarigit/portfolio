// src/components/Contact.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaGlobe,
  FaSnapchatGhost,
} from "react-icons/fa";
import { getContact } from "../../redux/Slice/contactSlice";
import { sendMessage, resetMessageState } from "../../redux/Slice/messageSlice";

const iconMap = {
  email: FaEnvelope,
  phone: FaPhone,
  location: FaMapMarkerAlt,
  github: FaGithub,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
  website: FaGlobe,
  snapchat: FaSnapchatGhost,
};

export default function Contact() {
  const dispatch = useDispatch();
  const { contact, loading: contactLoading, error: contactError } = useSelector(
    (state) => state.contact
  );
  const {
    loading: msgLoading,
    error: msgError,
    message: msgSuccess,
  } = useSelector((state) => state.message);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    dispatch(getContact());
  }, [dispatch]);

  // 🎉 Snackbar handler
  useEffect(() => {
    if (msgSuccess) {
      setSnackbar({ type: "success", text: msgSuccess });
      setFormData({ name: "", email: "", message: "" }); // reset form
      dispatch(resetMessageState());
    }
    if (msgError) {
      setSnackbar({ type: "error", text: msgError });
      dispatch(resetMessageState());
    }
  }, [msgSuccess, msgError, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendMessage(formData));
  };

  if (contactLoading) return <p className="text-center text-white">Loading...</p>;
  if (contactError) return <p className="text-center text-red-400">{contactError}</p>;
  if (!contact) return null;

  return (
    <section className="relative min-h-screen py-16 px-6 text-white scroll-mt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-black animate-gradient-x opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-purple-900 to-black animate-gradient-y opacity-30"></div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center mb-8">
          <span className="text-purple-400">&lt;</span>Contact
          <span className="text-purple-400">/&gt;</span>
        </h2>
        <p className="text-center text-gray-300 mb-12 text-lg">
          Feel free to <span className="text-purple-400 font-semibold">contact me</span> anytime ✨
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            {/* Basic Info */}
            {["email", "phone", "location"].map(
              (field, idx) =>
                contact[field] && (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-800 bg-opacity-70 p-5 rounded-xl shadow-lg hover:shadow-purple-500 border border-transparent hover:border-purple-500 transition"
                  >
                    {React.createElement(iconMap[field], {
                      className: "w-6 h-6 text-purple-400",
                    })}
                    <span>{contact[field]}</span>
                  </div>
                )
            )}

            {/* Social Links */}
            <div className="flex gap-4 mt-6 flex-wrap">
              {Object.keys(contact).map(
                (key) =>
                  iconMap[key] &&
                  contact[key] &&
                  !["email", "phone", "location"].includes(key) && (
                    <a
                      key={key}
                      href={contact[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 bg-gray-800 bg-opacity-70 rounded-full hover:bg-purple-700 transition text-white shadow hover:shadow-purple-500"
                    >
                      {React.createElement(iconMap[key], {
                        className: "w-5 h-5",
                      })}
                      {/* Tooltip */}
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-purple-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </a>
                  )
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="p-4 rounded-lg bg-gray-800 bg-opacity-70 border border-transparent focus:border-purple-500 outline-none text-white placeholder-gray-400 transition shadow-sm focus:shadow-purple-500/40"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="p-4 rounded-lg bg-gray-800 bg-opacity-70 border border-transparent focus:border-purple-500 outline-none text-white placeholder-gray-400 transition shadow-sm focus:shadow-purple-500/40"
            />
            <textarea
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="p-4 rounded-lg bg-gray-800 bg-opacity-70 border border-transparent focus:border-purple-500 outline-none text-white placeholder-gray-400 transition shadow-sm focus:shadow-purple-500/40"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={msgLoading}
              className="px-6 py-3 bg-purple-700 rounded-lg text-white font-semibold hover:bg-purple-600 transition shadow hover:shadow-purple-500/50 disabled:opacity-50"
            >
              {msgLoading ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-500 ${
            snackbar.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {snackbar.text}
        </div>
      )}
    </section>
  );
}
