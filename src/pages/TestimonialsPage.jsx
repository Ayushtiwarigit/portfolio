import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../redux/Slice/testimonialSlice";

// ✅ Snackbar with auto-hide
const Snackbar = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000); // auto-hide after 3s
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-slide-up">
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold hover:text-red-400">
          ✕
        </button>
      </div>
    </div>
  );
};

// ✅ Confirmation Modal
const ConfirmModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-96 shadow-2xl text-center text-white animate-fade-in">
        <h3 className="text-xl font-semibold mb-3">Delete Testimonial</h3>
        <p className="mb-6 text-gray-400">Are you sure? This action cannot be undone.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const TestimonialsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.testimonials);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    testimonial: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateTestimonial({ id: editingId, data: formData }))
        .unwrap()
        .then(() => {
          setSnackbar("✅ Testimonial updated successfully");
          setEditingId(null);
          setFormData({ name: "", role: "", testimonial: "", image: "" });
        })
        .catch(() => setSnackbar("❌ Failed to update testimonial"));
    } else {
      dispatch(addTestimonial(formData))
        .unwrap()
        .then(() => {
          setSnackbar("✅ Testimonial added successfully");
          setFormData({ name: "", role: "", testimonial: "", image: "" });
        })
        .catch(() => setSnackbar("❌ Failed to add testimonial"));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      role: item.role,
      testimonial: item.testimonial,
      image: item.image || "",
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    dispatch(deleteTestimonial(deleteId))
      .unwrap()
      .then(() => setSnackbar("✅ Testimonial deleted successfully"))
      .catch(() => setSnackbar("❌ Failed to delete testimonial"));
    setDeleteId(null);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-8">📢 Testimonials</h1>

      {/* ✅ Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 shadow-lg rounded-2xl p-6 mb-10 border border-gray-800"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <textarea
          name="testimonial"
          placeholder="Testimonial"
          value={formData.testimonial}
          onChange={handleChange}
          className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full mt-4 focus:ring-2 focus:ring-blue-500 transition"
          rows="4"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="mt-4 text-gray-300"
          accept="image/*"
        />
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-lg mt-3 border border-gray-700"
          />
        )}
        <button
          type="submit"
          className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {editingId ? "Update Testimonial" : "Add Testimonial"}
        </button>
      </form>

      {/* ✅ Testimonials List */}
      {loading && <p className="text-gray-400">Loading testimonials...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900 border border-gray-800 shadow-md rounded-xl p-5 flex flex-col hover:shadow-xl hover:border-gray-700 transition"
          >
            <div className="flex items-center gap-4 mb-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-full border border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                  👤
                </div>
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.role}</p>
              </div>
            </div>
            <p className="mb-5 text-gray-300 italic">“{item.testimonial}”</p>
            <div className="flex justify-end gap-2 mt-auto">
              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-1 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteId(item._id)}
                className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Snackbar */}
      <Snackbar message={snackbar} onClose={() => setSnackbar("")} />

      {/* ✅ Confirm Delete Modal */}
      <ConfirmModal
        show={!!deleteId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default TestimonialsPage;
