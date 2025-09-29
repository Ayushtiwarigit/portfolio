import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
  resetProjectState,
} from "../redux/Slice/projectSlice";
import { fetchTechStacks } from "../redux/Slice/techStackSlice";

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message, results } = useSelector(
    (state) => state.project
  );
  const { stacks } = useSelector((state) => state.techStack);

  // Local states
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    githubLink: "",
    previewLink: "",
    projectImage: null,
    technologiesUsed: [],
  });
  const [editId, setEditId] = useState(null);

  // Fetch projects & tech stacks
  useEffect(() => {
    dispatch(getProjects());
    dispatch(fetchTechStacks());
    return () => {
      dispatch(resetProjectState());
    };
  }, [dispatch]);

  // Submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await dispatch(updateProject({ id: editId, updates: formData }));
    } else {
      await dispatch(createProject(formData));
    }
    dispatch(getProjects());

    // reset
    setFormData({
      projectName: "",
      projectDescription: "",
      githubLink: "",
      previewLink: "",
      projectImage: null,
      technologiesUsed: [],
    });
    setEditId(null);
  };

  // Edit
  const handleEdit = async (id) => {
    const res = await dispatch(getProjectById(id));
    if (res.payload?.result) {
      const project = res.payload.result;

      setFormData({
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        githubLink: project.githubLink,
        previewLink: project.previewLink,
        projectImage: null, // do not auto-fill file input
        technologiesUsed:
          project.technologiesUsed?.map((t) => ({
            techStack: t.techStack?._id || t.techStack,
            skillId: t.skill?._id || t.skillId,
          })) || [],
      });

      setEditId(id);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await dispatch(deleteProject(id));
      dispatch(getProjects());
    }
  };

  // Tech select (unique)
  const handleTechSelect = (techId, skillId) => {
    const exists = formData.technologiesUsed.some(
      (t) => t.techStack === techId && t.skillId === skillId
    );
    if (!exists) {
      setFormData((prev) => ({
        ...prev,
        technologiesUsed: [
          ...prev.technologiesUsed,
          { techStack: techId, skillId },
        ],
      }));
    }
  };

  // Remove tech
  const handleRemoveTech = (techId, skillId) => {
    setFormData((prev) => ({
      ...prev,
      technologiesUsed: prev.technologiesUsed.filter(
        (t) => !(t.techStack === techId && t.skillId === skillId)
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Projects Manager</h1>

      {loading && <p className="text-blue-400">Loading...</p>}
      {!loading && message && (
        <p className={error ? "text-red-400" : "text-green-400"}>{message}</p>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 border border-gray-700 p-4 rounded-md bg-gray-900"
      >
        <h2 className="font-bold text-lg">
          {editId ? "Edit Project" : "Add New Project"}
        </h2>
        <input
          type="text"
          placeholder="Project Name"
          value={formData.projectName}
          onChange={(e) =>
            setFormData({ ...formData, projectName: e.target.value })
          }
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Project Description"
          value={formData.projectDescription}
          onChange={(e) =>
            setFormData({ ...formData, projectDescription: e.target.value })
          }
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="GitHub Link"
          value={formData.githubLink}
          onChange={(e) =>
            setFormData({ ...formData, githubLink: e.target.value })
          }
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Preview Link"
          value={formData.previewLink}
          onChange={(e) =>
            setFormData({ ...formData, previewLink: e.target.value })
          }
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, projectImage: e.target.files[0] })
          }
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          required={!editId}
        />

        <select
          onChange={(e) => {
            const [techId, skillId] = e.target.value.split("|");
            if (techId && skillId) handleTechSelect(techId, skillId);
          }}
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
        >
          <option value="">Select Tech Stack</option>
          {stacks?.map((stack) => (
            <optgroup key={stack._id} label={stack.category}>
              {stack.skills?.map((skill) => (
                <option key={skill._id} value={`${stack._id}|${skill._id}`}>
                  {skill.name} ({stack.category})
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          {formData.technologiesUsed.map((t, idx) => {
            const stack = stacks.find((s) => s._id === t.techStack);
            const skill = stack?.skills?.find((sk) => sk._id === t.skillId);

            return (
              <span
                key={`${t.techStack}-${t.skillId}-${idx}`}
                className="flex items-center gap-2 bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
              >
                {skill?.name} ({skill?.level}) – {stack?.category}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(t.techStack, t.skillId)}
                  className="ml-1 text-red-400 hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Project" : "Create Project"}
        </button>
      </form>

      {/* Card List */}
      <div>
        <h2 className="text-xl font-bold mb-3">All Projects</h2>
        {Array.isArray(results) && results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((project) => (
              <div
                key={project._id}
                className="border border-gray-700 rounded-lg bg-gray-900 shadow-md overflow-hidden"
              >
                {project.projectImage && (
                  <img
                    src={project.projectImage}
                    alt={project.projectName}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{project.projectName}</h3>
                  <p className="text-sm text-gray-300">
                    {project.projectDescription}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologiesUsed?.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                      >
                        {t.skill?.name} ({t.skill?.level}) –{" "}
                        {t.techStack?.category}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-3">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      GitHub
                    </a>
                    <a
                      href={project.previewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Preview
                    </a>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(project._id)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects found</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
