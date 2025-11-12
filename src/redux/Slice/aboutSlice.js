import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/about`;


// ================= Async Thunks ==================

// Fetch About section
export const fetchAbout = createAsyncThunk(
  "about/fetchAbout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.result; // Assuming response.data.result has the about object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Save/Update About section
// Save/Update About section
export const saveAbout = createAsyncThunk(
  "about/saveAbout",
  async (aboutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, aboutData, {
        headers: {
          "Content-Type": "multipart/form-data", // <-- important
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// ================= Slice ==================
const aboutSlice = createSlice({
  name: "about",
  initialState: {
    about: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    resetAboutState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch About
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.about = action.payload;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Save About
    builder
      .addCase(saveAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.about = action.payload;
        state.successMessage = "About section saved successfully";
      })
      .addCase(saveAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAboutState } = aboutSlice.actions;
export default aboutSlice.reducer;
