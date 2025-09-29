// src/redux/slices/contactSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://192.168.0.152:5000/api/v1/contact";

// ✅ Helper: Get token from localStorage
const getToken = () => localStorage.getItem("token");

// ---------------------- Thunks ---------------------- //

// Create contact
export const createContact = createAsyncThunk(
  "contact/createContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, contactData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create contact");
    }
  }
);

// Get contact
export const getContact = createAsyncThunk(
  "contact/getContact",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch contact");
    }
  }
);

// Update contact
export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, updates, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update contact");
    }
  }
);

// Delete contact
export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete contact");
    }
  }
);

// ---------------------- Slice ---------------------- //

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contact: null,
    token: getToken() || null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
    resetContactState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload.result;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get
      .addCase(getContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload.result;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload.result;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = null;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setToken, clearToken, resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
