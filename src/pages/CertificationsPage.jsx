import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAwards,
  createAward,
  updateAward,
  deleteAward,
  clearMessages,
} from "../redux/Slice/awardSlice";

const Snackbar = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white 
      ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="text-white font-bold">
          ×
        </button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const CertificationsPage = () => {
  const dispatch = useDispatch();
  const { awards, loading, error, successMessage } = useSelector(
    (state) => state.awards
  );

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  // Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch awards on mount
  useEffect(() => {
    dispatch(fetchAwards());
  }, [dispatch]);

  // Watch error/success to show snackbar
  useEffect(() => {
    if (error) {
      setSnackbar({ message: error, type: "error" });
      dispatch(clearMessages());
    }
    if (successMessage) {
      setSnackbar({ message: successMessage, type: "success" });
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  // Handle input
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Submit new / update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateAward({ id: editId, updateData: formData }));
    } else {
      dispatch(createAward(formData));
    }
    setFormData({ title: "", description: "", date: "", image: null });
    setEditId(null);
  };

  // Edit award
  const handleEdit = (award) => {
    setFormData({
      title: award.title,
      description: award.description,
      date: award.date.split("T")[0],
      image: null,
    });
    setEditId(award._id);
  };

  // Delete award
  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Certifications / Awards</h1>

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ message: "", type: "" })}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => dispatch(deleteAward(deleteId))}
        title="Confirm Delete"
        message="Are you sure you want to delete this award?"
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 p-4 border rounded-lg shadow mb-6"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {/* Preview */}
        {formData.image && (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="preview"
            className="w-32 mt-2 rounded"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Award" : "Add Award"}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {awards.length === 0 ? (
            <p>No awards available.</p>
          ) : (
            awards.map((award) => (
              <div
                key={award._id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{award.title}</h2>
                  <p>{award.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(award.date).toLocaleDateString()}
                  </p>
                  {award.image && (
                    <img
                      src={award.image}
                      alt={award.title}
                      className="w-32 mt-2 rounded"
                    />
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(award)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(award._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsPage;
