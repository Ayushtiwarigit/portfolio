import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://192.168.0.152:5000/api/v1/project";

/* ---------------------- Thunks ---------------------- */

// Create project
export const createProject = createAsyncThunk(
  "project/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(projectData).forEach((key) => {
        if (key === "technologiesUsed") {
          formData.append(key, JSON.stringify(projectData[key]));
        } else {
          formData.append(key, projectData[key]);
        }
      });

      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Create failed",
        }
      );
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(updates).forEach((key) => {
        if (key === "technologiesUsed") {
          formData.append(key, JSON.stringify(updates[key]));
        } else {
          formData.append(key, updates[key]);
        }
      });

      const res = await axios.patch(`${API_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Update failed",
        }
      );
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...res.data, deletedId: id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Delete failed",
        }
      );
    }
  }
);

// Get all projects
export const getProjects = createAsyncThunk(
  "project/getProjects",
  async ({ skillName, category } = {}, { rejectWithValue }) => {
    try {
      let url = API_URL;
      const params = [];

      // 🔥 Make sure this matches your backend query param
      if (skillName) params.push(`skill=${skillName}`);
      if (category) params.push(`category=${category}`);

      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Fetch failed",
        }
      );
    }
  }
);

// Get project by ID
export const getProjectById = createAsyncThunk(
  "project/getProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Fetch failed",
        }
      );
    }
  }
);

/* ---------------------- Slice ---------------------- */

const projectSlice = createSlice({
  name: "project",
  initialState: {
    loading: false,
    success: false,
    error: false,
    message: "",
    result: null, // single project
    results: [], // list of projects
  },
  reducers: {
    resetProjectState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = "";
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createProject.pending, (s) => {
        s.loading = true;
      })
      .addCase(createProject.fulfilled, (s, a) => {
        s.loading = false;
        s.success = a.payload.success;
        s.error = a.payload.error;
        s.message = a.payload.message;
        s.result = a.payload.result;
      })
      .addCase(createProject.rejected, (s, a) => {
        s.loading = false;
        s.error = true;
        s.success = false;
        s.message = a.payload?.message;
      });

    // Update
    builder
      .addCase(updateProject.pending, (s) => {
        s.loading = true;
      })
      .addCase(updateProject.fulfilled, (s, a) => {
        s.loading = false;
        s.success = a.payload.success;
        s.error = a.payload.error;
        s.message = a.payload.message;
        s.result = a.payload.result;
      })
      .addCase(updateProject.rejected, (s, a) => {
        s.loading = false;
        s.error = true;
        s.success = false;
        s.message = a.payload?.message;
      });

    // Delete
    builder
      .addCase(deleteProject.pending, (s) => {
        s.loading = true;
      })
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.loading = false;
        s.success = a.payload.success;
        s.error = a.payload.error;
        s.message = a.payload.message;
        s.results = s.results.filter((p) => p._id !== a.payload.deletedId);
      })
      .addCase(deleteProject.rejected, (s, a) => {
        s.loading = false;
        s.error = true;
        s.success = false;
        s.message = a.payload?.message;
      });

    // Get All
    builder
      .addCase(getProjects.pending, (s) => {
        s.loading = true;
      })
      .addCase(getProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.success = a.payload.success;
        s.error = a.payload.error;
        s.message = a.payload.message;

        // 🔥 support both `results` and `data`
        s.results = a.payload.results || a.payload.data || [];
      })
      .addCase(getProjects.rejected, (s, a) => {
        s.loading = false;
        s.error = true;
        s.success = false;
        s.message = a.payload?.message;
      });

    // Get by ID
    builder
      .addCase(getProjectById.pending, (s) => {
        s.loading = true;
      })
      .addCase(getProjectById.fulfilled, (s, a) => {
        s.loading = false;
        s.success = a.payload.success;
        s.error = a.payload.error;
        s.message = a.payload.message;
        s.result = a.payload.result || a.payload.data || null;
      })
      .addCase(getProjectById.rejected, (s, a) => {
        s.loading = false;
        s.error = true;
        s.success = false;
        s.message = a.payload?.message;
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
