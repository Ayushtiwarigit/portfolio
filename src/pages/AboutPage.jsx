import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAbout, saveAbout, resetAboutState } from "../redux/Slice/aboutSlice";

const AboutPage = () => {
  const dispatch = useDispatch();
  const { about, loading, error, successMessage } = useSelector((state) => state.about);

  // Form state
  const [aboutText, setAboutText] = useState("");
  const [techStack, setTechStack] = useState("");
  const [imageFile, setImageFile] = useState(null); // store file
  const [preview, setPreview] = useState(""); // for preview

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  useEffect(() => {
    dispatch(fetchAbout());
    return () => dispatch(resetAboutState());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      setAboutText(about.aboutText || "");
      setTechStack(about.techStack?.join(", ") || "");
      setPreview(about.image || ""); // show saved image
    }
  }, [about]);

  // Show snackbar on success/error
  useEffect(() => {
    if (successMessage) {
      setSnackbar({ message: successMessage, type: "success" });
      setTimeout(() => setSnackbar({ message: "", type: "" }), 3000);
    }
    if (error) {
      setSnackbar({ message: error, type: "error" });
      setTimeout(() => setSnackbar({ message: "", type: "" }), 3000);
    }
  }, [successMessage, error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // prepare formData for POST
    const formData = new FormData();
    formData.append("aboutText", aboutText);
    formData.append("techStack", JSON.stringify(techStack.split(",").map((t) => t.trim())));
    if (imageFile) {
      formData.append("image", imageFile); // field name must match multer/backend
    }

    dispatch(saveAbout(formData));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-8 border-b pb-2">Manage About Section</h1>

      {/* ===== Snackbar Notification ===== */}
      {snackbar.message && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded shadow-lg text-white font-medium z-50
            ${snackbar.type === "success" ? "bg-green-500" : "bg-red-500"}
            transition-all duration-300`}
        >
          {snackbar.message}
        </div>
      )}

      {/* ===== POST/Update Form (Top) ===== */}
      <div className="mb-10 p-6 border rounded shadow-md bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Update About Section</h2>

        {loading && <p className="text-blue-500 mb-4">Loading...</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">About Text</label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Write something about yourself..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="React, Node, MongoDB, CSS"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {preview && (
            <div>
              <p className="mb-2 font-medium">Preview:</p>
              <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded shadow" />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Save About
          </button>
        </form>
      </div>

      {/* ===== GET Details (Bottom) ===== */}
      {about && (
        <div className="p-6 border rounded shadow-md bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold mb-4">Current About Details</h2>
          <p className="mb-2"><strong>About Text:</strong> {about.aboutText}</p>
          <p className="mb-2"><strong>Tech Stack:</strong> {about.techStack.join(", ")}</p>
          {about.image && (
            <div className="mt-4">
              <strong>Image:</strong>
              <br />
              <img src={about.image} alt="About" className="w-48 h-48 object-cover rounded shadow" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutPage;
