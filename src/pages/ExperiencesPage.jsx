import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  resetExperienceState,
} from "../redux/Slice/experienceSlice";

const ExperiencesPage = () => {
  const dispatch = useDispatch();
  const { experiences, loading, error, success, message } = useSelector(
    (state) => state.experience
  );

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  // fetch all experiences
  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);

  // reset success/error after 3s
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(resetExperienceState()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateExperience({ id: editId, updatedData: formData }));
    } else {
      dispatch(createExperience(formData));
    }
    setFormData({ role: "", company: "", duration: "", description: "" });
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("🗑️ Are you sure you want to delete this experience?")) {
      dispatch(deleteExperience(id));
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
    });
    setEditId(exp._id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>💼 Experiences</h1>

      {/* Messages */}
      {loading && <p style={styles.info}>⏳ Loading...</p>}
      {error && <p style={styles.error}>❌ {message}</p>}
      {success && <p style={styles.success}>✅ {message}</p>}

      {/* Form */}
      <div style={styles.card}>
        <h2>{editId ? "✏️ Edit Experience" : "➕ Add Experience"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="role"
            placeholder="Job Role"
            value={formData.role}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g. 2023 - Present)"
            value={formData.duration}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            style={styles.textarea}
          />
          <div style={styles.btnGroup}>
            <button type="submit" style={styles.btnPrimary}>
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setFormData({ role: "", company: "", duration: "", description: "" });
                  dispatch(resetExperienceState());
                }}
                style={styles.btnSecondary}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Experience List */}
      <div style={styles.grid}>
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <div key={exp._id} style={styles.card}>
              <h3 style={styles.expTitle}>{exp.role}</h3>
              <p style={styles.expCompany}>
                <strong>{exp.company}</strong> • {exp.duration}
              </p>
              <p style={styles.expDesc}>{exp.description}</p>
              <div style={styles.btnGroup}>
                <button onClick={() => handleEdit(exp)} style={styles.btnPrimary}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  style={styles.btnDanger}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.info}>No experiences found.</p>
        )}
      </div>
    </div>
  );
};

/* ---------------------- STYLES ---------------------- */
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    background: "#121212",
    minHeight: "100vh",
    color: "#e5e5e5",
  },
  heading: { textAlign: "center", marginBottom: "20px", color: "#fff" },
  info: { textAlign: "center", color: "#aaa" },
  error: { color: "#f87171", textAlign: "center" },
  success: { color: "#34d399", textAlign: "center" },

  card: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "8px",
    background: "#2a2a2a",
    color: "#fff",
    outline: "none",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "8px",
    background: "#2a2a2a",
    color: "#fff",
    outline: "none",
  },
  btnGroup: { display: "flex", gap: "10px", marginTop: "10px" },
  btnPrimary: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnSecondary: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnDanger: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  expTitle: { margin: "0 0 10px", color: "#fff" },
  expCompany: { margin: "0", color: "#ccc" },
  expDesc: { margin: "10px 0", color: "#aaa", fontSize: "14px" },
};

export default ExperiencesPage;
