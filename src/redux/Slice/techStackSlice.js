// src/redux/slices/techStackSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/tech-stack`;


// ✅ Get token from localStorage
const getToken = () => localStorage.getItem("token");

/* ---------------------- THUNKS ---------------------- */

// 🎯 GET: Fetch all Tech Stacks
export const fetchTechStacks = createAsyncThunk(
  "techStack/fetchTechStacks",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.results;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch TechStacks"
      );
    }
  }
);

// 🎯 POST: Create Tech Stack
export const createTechStack = createAsyncThunk(
  "techStack/createTechStack",
  async (techStackData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.post(API_URL, techStackData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.result;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create TechStack"
      );
    }
  }
);

// 🎯 PUT: Update Tech Stack by ID
export const updateTechStack = createAsyncThunk(
  "techStack/updateTechStack",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.patch(`${API_URL}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.result;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update TechStack"
      );
    }
  }
);

// 🎯 DELETE: Remove Tech Stack by ID
export const deleteTechStack = createAsyncThunk(
  "techStack/deleteTechStack",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; // return deleted id to remove from state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete TechStack"
      );
    }
  }
);

/* ---------------------- SLICE ---------------------- */

const techStackSlice = createSlice({
  name: "techStack",
  initialState: {
    stacks: [],
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
    builder
      // FETCH
      .addCase(fetchTechStacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTechStacks.fulfilled, (state, action) => {
        state.loading = false;
        state.stacks = action.payload;
      })
      .addCase(fetchTechStacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createTechStack.fulfilled, (state, action) => {
        state.stacks.push(action.payload);
        state.successMessage = "TechStack created successfully!";
      })
      .addCase(createTechStack.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTechStack.fulfilled, (state, action) => {
        const index = state.stacks.findIndex(
          (stack) => stack._id === action.payload._id
        );
        if (index !== -1) state.stacks[index] = action.payload;
        state.successMessage = "TechStack updated successfully!";
      })
      .addCase(updateTechStack.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteTechStack.fulfilled, (state, action) => {
        state.stacks = state.stacks.filter(
          (stack) => stack._id !== action.payload
        );
        state.successMessage = "TechStack deleted successfully!";
      })
      .addCase(deleteTechStack.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = techStackSlice.actions;
export default techStackSlice.reducer;
