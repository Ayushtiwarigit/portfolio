
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/testimonials`;


// ✅ Token management (example: from localStorage)
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---- Thunks ----

// Add testimonial
export const addTestimonial = createAsyncThunk(
  "testimonials/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data, { headers: getAuthHeader() });
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all testimonials
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeader() });
      return res.data.results;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update testimonial
export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, data, {
        headers: getAuthHeader(),
      });
      return { id, ...res.data.result };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete testimonial
export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---- Slice ----
const testimonialSlice = createSlice({
  name: "testimonials",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    storeToken: (_, action) => {
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addTestimonial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.id ? { ...item, ...action.payload } : item
        );
      })

      // Delete
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { storeToken } = testimonialSlice.actions;
export default testimonialSlice.reducer;
