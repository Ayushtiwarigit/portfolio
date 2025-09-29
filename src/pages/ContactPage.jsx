// src/pages/ContactPage.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContact,
  getContact,
  updateContact,
  deleteContact,
  resetContactState,
} from "../redux/Slice/contactSlice";
import { getMessages } from "../redux/Slice/messageSlice";
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
  FaSnapchat,
} from "react-icons/fa";

const ContactPage = () => {
  const dispatch = useDispatch();
  const { contact, loading, error, message } = useSelector(
    (state) => state.contact
  );
  const {
    messages,
    loading: msgLoading,
    error: msgError,
  } = useSelector((state) => state.message);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
    website: "",
    snapchat: "",
  });

  // load contact + messages on mount
  useEffect(() => {
    dispatch(getContact());
    dispatch(getMessages());
  }, [dispatch]);

  // if contact is fetched, fill form
  useEffect(() => {
    if (contact) {
      setForm((prev) => ({ ...prev, ...contact }));
    }
  }, [contact]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (contact?._id) {
      dispatch(updateContact({ id: contact._id, updates: form }));
    } else {
      dispatch(createContact(form));
    }
  };

  const handleDelete = () => {
    if (contact?._id) {
      dispatch(deleteContact(contact._id));
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetContactState());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        <span className="text-purple-400">&lt;</span> Contact Management{" "}
        <span className="text-purple-400">/&gt;</span>
      </h1>

      {/* Loader & Messages */}
      {loading && <p className="text-blue-400">Loading contact...</p>}
      {message && <p className="text-green-400">{message}</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* ---------------- Contact Form ---------------- */}
      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        {/* Email */}
        <label className="flex items-center gap-2 col-span-2">
          <FaEnvelope /> Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700 outline-none focus:border-purple-500 col-span-2"
          required
        />

        {/* Phone */}
        <label className="flex items-center gap-2 col-span-2">
          <FaPhone /> Phone
        </label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700 outline-none focus:border-purple-500 col-span-2"
        />

        {/* Location */}
        <label className="flex items-center gap-2 col-span-2">
          <FaMapMarkerAlt /> Location
        </label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700 outline-none focus:border-purple-500 col-span-2"
        />

        {/* Social links */}
        {[
          { name: "github", icon: <FaGithub /> },
          { name: "linkedin", icon: <FaLinkedin /> },
          { name: "youtube", icon: <FaYoutube /> },
          { name: "twitter", icon: <FaTwitter /> },
          { name: "instagram", icon: <FaInstagram /> },
          { name: "facebook", icon: <FaFacebook /> },
          { name: "website", icon: <FaGlobe /> },
          { name: "snapchat", icon: <FaSnapchat /> },
        ].map((field) => (
          <React.Fragment key={field.name}>
            <label className="flex items-center gap-2">
              {field.icon} {field.name.charAt(0).toUpperCase() +
                field.name.slice(1)}
            </label>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-700 outline-none focus:border-purple-500"
            />
          </React.Fragment>
        ))}

        {/* Action buttons */}
        <div className="flex gap-2 col-span-2 mt-4">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            {contact?._id ? "Update Contact (PATCH)" : "Create Contact (POST)"}
          </button>

          {contact?._id && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete Contact
            </button>
          )}
        </div>
      </form>

      {/* ---------------- Messages Section ---------------- */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-purple-400">&lt;</span> Messages{" "}
          <span className="text-purple-400">/&gt;</span>
        </h2>

        {msgLoading && <p className="text-blue-400">Loading messages...</p>}
        {msgError && <p className="text-red-400">{msgError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition"
              >
                <h3 className="text-lg font-semibold text-purple-400">
                  {msg.name}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{msg.email}</p>
                <p className="text-gray-300">{msg.message}</p>

                {msg.reply && (
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-sm text-green-400 font-semibold">
                      Reply:
                    </p>
                    <p className="text-gray-200">{msg.reply}</p>
                  </div>
                )}

                {msg.repliedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Replied on: {new Date(msg.repliedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
