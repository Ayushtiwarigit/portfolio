// src/pages/TechStackPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTechStacks,
  createTechStack,
  updateTechStack,
  deleteTechStack,
  clearMessages,
} from "../redux/Slice/techStackSlice";

const TechStackPage = () => {
  const dispatch = useDispatch();
  const { stacks, loading, error, successMessage } = useSelector(
    (state) => state.techStack
  );

  const [categoryForm, setCategoryForm] = useState({ category: "" });
  const [editCategoryId, setEditCategoryId] = useState(null);

  // skill state
  const [skillForm, setSkillForm] = useState({ name: "", level: "" });
  const [editSkill, setEditSkill] = useState({ categoryId: null, skillId: null });

  // ✅ Fetch stacks on mount
  useEffect(() => {
    dispatch(fetchTechStacks());
  }, [dispatch]);

  // ✅ Auto-clear messages
  useEffect(() => {
    if (error || successMessage) {
      setTimeout(() => dispatch(clearMessages()), 3000);
    }
  }, [error, successMessage, dispatch]);

  /* ------------------ CATEGORY HANDLERS ------------------ */
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editCategoryId) {
      dispatch(
        updateTechStack({
          id: editCategoryId,
          updatedData: { category: categoryForm.category },
        })
      );
      setEditCategoryId(null);
    } else {
      dispatch(createTechStack({ category: categoryForm.category, skills: [] }));
    }
    setCategoryForm({ category: "" });
  };

  const handleCategoryEdit = (cat) => {
    setCategoryForm({ category: cat.category });
    setEditCategoryId(cat._id);
  };

  const handleCategoryDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteTechStack(id));
    }
  };

  /* ------------------ SKILL HANDLERS ------------------ */
  // const handleSkillSubmit = (e, categoryId) => {
  //   e.preventDefault();
  //   if (editSkill.skillId) {
  //     // update skill inside category
  //     dispatch(
  //       updateTechStack({
  //         id: categoryId,
  //         updatedData: {
  //           action: "update-skill",
  //           skillId: editSkill.skillId,
  //           skill: skillForm,
  //         },
  //       })
  //     );
  //     setEditSkill({ categoryId: null, skillId: null });
  //   } else {
  //     dispatch(
  //       updateTechStack({
  //         id: categoryId,
  //         updatedData: {
  //           action: "add-skill",
  //           skill: skillForm,
  //         },
  //       })
  //     );
  //   }
  //   setSkillForm({ name: "", level: "" });
  // };

  const handleSkillSubmit = (e, categoryId) => {
  e.preventDefault();

  const category = stacks.find((c) => c._id === categoryId);

  let updatedCategory = { ...category };

  if (editSkill.skillId) {
    // update existing skill
    updatedCategory.skills = category.skills.map((s) =>
      s._id === editSkill.skillId ? { ...s, ...skillForm } : s
    );
  } else {
    // add new skill
    updatedCategory.skills = [...category.skills, skillForm];
  }

  dispatch(updateTechStack({ id: categoryId, updatedData: updatedCategory }));

  setSkillForm({ name: "", level: "" });
  setEditSkill({ categoryId: null, skillId: null });
};

  const handleSkillEdit = (categoryId, skill) => {
    setSkillForm({ name: skill.name, level: skill.level });
    setEditSkill({ categoryId, skillId: skill._id });
  };

  const handleSkillDelete = (categoryId, skillId) => {
    if (window.confirm("Delete this skill?")) {
      dispatch(
        updateTechStack({
          id: categoryId,
          updatedData: { action: "delete-skill", skillId },
        })
      );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">⚙️ Manage Tech Stacks</h1>

      {/* ✅ Feedback messages */}
      {successMessage && (
        <p className="bg-green-900 text-green-200 p-2 rounded mb-4 border border-green-700">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="bg-red-900 text-red-200 p-2 rounded mb-4 border border-red-700">
          {error}
        </p>
      )}

      {/* ✅ Category Form */}
      <form
        onSubmit={handleCategorySubmit}
        className="flex gap-2 mb-6 items-center bg-gray-900 p-4 rounded shadow border border-gray-700"
      >
        <input
          type="text"
          placeholder="Category name (e.g., Frontend)"
          value={categoryForm.category}
          onChange={(e) =>
            setCategoryForm({ ...categoryForm, category: e.target.value })
          }
          className="bg-gray-800 border border-gray-700 p-2 flex-1 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {editCategoryId ? "Update" : "Add"}
        </button>
      </form>

      {/* ✅ Display Categories + Skills */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-6">
          {stacks.map((cat) => (
            <div
              key={cat._id}
              className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow"
            >
              {/* Category header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">{cat.category}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCategoryEdit(cat)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCategoryDelete(cat._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <ul className="space-y-2 mb-3">
                {cat.skills.map((skill) => (
                  <li
                    key={skill._id}
                    className="flex justify-between items-center bg-gray-900 p-2 rounded border border-gray-700"
                  >
                    <span>
                      {skill.name}{" "}
                      <span className="text-sm text-gray-400">
                        ({skill.level})
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSkillEdit(cat._id, skill)}
                        className="px-2 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSkillDelete(cat._id, skill._id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add/Edit Skill Form */}
              <form
                onSubmit={(e) => handleSkillSubmit(e, cat._id)}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Skill name"
                  value={skillForm.name}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, name: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 p-2 flex-1 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={skillForm.level}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, level: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 p-2 rounded text-white focus:outline-none"
                  required
                >
                  <option value="">Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  {editSkill.skillId &&
                  editSkill.categoryId === cat._id
                    ? "Update Skill"
                    : "Add Skill"}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechStackPage;
