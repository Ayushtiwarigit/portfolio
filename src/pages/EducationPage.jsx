// src/pages/EducationPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  clearMessages,
} from "../redux/Slice/educationSlice";

const EducationPage = () => {
  const dispatch = useDispatch();
  const { list, loading, error, successMessage } = useSelector(
    (state) => state.education
  );

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    address: "",
    qualification: "",
    gradeOrPercentage: "",
    yearOfCompletion: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch education from API
  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  // Clear messages after 3s
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.qualification)
      return;

    try {
      if (editMode && formData._id) {
        await dispatch(updateEducation({ id: formData._id, data: formData })).unwrap();
      } else {
        await dispatch(createEducation(formData)).unwrap();
      }
      setFormData({
        _id: null,
        name: "",
        address: "",
        qualification: "",
        gradeOrPercentage: "",
        yearOfCompletion: "",
      });
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (edu) => {
    setFormData(edu);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this education entry?")) {
      try {
        await dispatch(deleteEducation(id)).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🎓 Education Dashboard</h1>

        {loading && <p className="text-center text-purple-400">⏳ Loading...</p>}
        {error && <p className="text-center text-red-400">❌ {error.message || error}</p>}
        {successMessage && (
          <p className="text-center text-green-400">✅ {successMessage}</p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? "✏️ Edit Education" : "➕ Add Education"}
          </h2>
          <input
            type="text"
            placeholder="Institution Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full mb-3 p-2 rounded border border-gray-700 bg-gray-900 text-gray-100"
          />
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full mb-3 p-2 rounded border border-gray-700 bg-gray-900 text-gray-100"
          />
          <input
            type="text"
            placeholder="Qualification (e.g. BSc Computer Science)"
            value={formData.qualification}
            onChange={(e) => handleInputChange("qualification", e.target.value)}
            className="w-full mb-3 p-2 rounded border border-gray-700 bg-gray-900 text-gray-100"
          />
          <input
            type="text"
            placeholder="Grade / Percentage"
            value={formData.gradeOrPercentage}
            onChange={(e) =>
              handleInputChange("gradeOrPercentage", e.target.value)
            }
            className="w-full mb-3 p-2 rounded border border-gray-700 bg-gray-900 text-gray-100"
          />
          <input
            type="number"
            placeholder="Year of Completion"
            value={formData.yearOfCompletion}
            onChange={(e) =>
              handleInputChange("yearOfCompletion", e.target.value)
            }
            className="w-full mb-3 p-2 rounded border border-gray-700 bg-gray-900 text-gray-100"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-semibold"
          >
            {editMode ? "Update" : "Add"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  _id: null,
                  name: "",
                  address: "",
                  qualification: "",
                  gradeOrPercentage: "",
                  yearOfCompletion: "",
                });
                setEditMode(false);
              }}
              className="ml-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold"
            >
              Cancel
            </button>
          )}
        </form>

        {/* List */}
        <div className="grid gap-4">
          {list.map((edu) => (
            <div
              key={edu._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-start"
            >
              <div>
                <p className="font-bold">{edu.name}</p>
                <p>📍 {edu.address}</p>
                <p>🎓 {edu.qualification}</p>
                <p>🎯 {edu.gradeOrPercentage}</p>
                {edu.yearOfCompletion && <p>📅 {edu.yearOfCompletion}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu._id)}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
