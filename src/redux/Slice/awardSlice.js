import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/awards`;


// ✅ Helper: get token from localStorage
const getToken = () => localStorage.getItem("token");

// -------------------- Thunks -------------------- //

// Create Award
export const createAward = createAsyncThunk(
  "awards/createAward",
  async (awardData, { rejectWithValue }) => {
    try {
      const token = getToken();

      const formData = new FormData();
      for (const key in awardData) {
        formData.append(key, awardData[key]);
      }

      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch All Awards
export const fetchAwards = createAsyncThunk(
  "awards/fetchAwards",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update Award by ID
export const updateAward = createAsyncThunk(
  "awards/updateAward",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = getToken();

      const formData = new FormData();
      for (const key in updateData) {
        formData.append(key, updateData[key]);
      }

      const res = await axios.patch(`${API_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete Award by ID
export const deleteAward = createAsyncThunk(
  "awards/deleteAward",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...res.data, id };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// -------------------- Slice -------------------- //

const awardSlice = createSlice({
  name: "awards",
  initialState: {
    awards: [],
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

      // ✅ Create Award
      .addCase(createAward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAward.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        if (action.payload.result) {
          state.awards.push(action.payload.result);
        }
      })
      .addCase(createAward.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create award";
      })

      // ✅ Fetch Awards
      .addCase(fetchAwards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAwards.fulfilled, (state, action) => {
        state.loading = false;
        state.awards = action.payload.results || []; // ✅ fixed plural
      })
      .addCase(fetchAwards.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch awards";
      })

      // ✅ Update Award
      .addCase(updateAward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAward.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedAward = action.payload.result;
        state.awards = state.awards.map((a) =>
          a._id === updatedAward._id ? updatedAward : a
        );
      })
      .addCase(updateAward.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update award";
      })

      // ✅ Delete Award
      .addCase(deleteAward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAward.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.awards = state.awards.filter(
          (a) => a._id !== action.payload.id
        );
      })
      .addCase(deleteAward.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to delete award";
      });
  },
});

export const { clearMessages } = awardSlice.actions;
export default awardSlice.reducer;
