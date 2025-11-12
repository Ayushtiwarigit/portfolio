
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/education`;


// 🔑 Helper to attach token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// CREATE education
export const createEducation = createAsyncThunk(
  "education/createEducation",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data, getAuthHeaders());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// READ (GET all education entries)
export const fetchEducation = createAsyncThunk(
  "education/fetchEducation",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, getAuthHeaders());
      return res.data.results || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE education by ID (PATCH)
export const updateEducation = createAsyncThunk(
  "education/updateEducation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, data, getAuthHeaders());
      return res.data.result || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE education by ID
export const deleteEducation = createAsyncThunk(
  "education/deleteEducation",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const educationSlice = createSlice({
  name: "education",
  initialState: {
    list: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // CREATE
    builder
      .addCase(createEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Education added successfully!";
        
        // Handle different response formats
        const newEducation = action.payload.result || action.payload.data || action.payload;
        if (newEducation && newEducation._id) {
          // Avoid duplicates
          const existingIndex = state.list.findIndex(item => item._id === newEducation._id);
          if (existingIndex === -1) {
            state.list.push(newEducation);
          }
        }
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to add education";
      });

    // READ
    builder
      .addCase(fetchEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to fetch education";
      });

    // UPDATE
    builder
      .addCase(updateEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Education updated successfully!";
        
        const updatedEducation = action.payload;
        state.list = state.list.map((edu) =>
          edu._id === updatedEducation._id ? updatedEducation : edu
        );
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to update education";
      });

    // DELETE
    builder
      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Education deleted successfully!";
        state.list = state.list.filter((edu) => edu._id !== action.payload.id);
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to delete education";
      });
  },
});

export const { clearMessages } = educationSlice.actions;
export default educationSlice.reducer;