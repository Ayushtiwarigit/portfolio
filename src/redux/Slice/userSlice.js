import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://192.168.0.152:5000/api/v1/user";

// 🔹 Register user
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// 🔹 Login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      // Save token in localStorage
      const token = response.data?.result?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

// 🔹 Fetch current logged-in user
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Map API result
      return response.data?.result || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.result || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload?.result?.token || null;
        state.user = action.payload?.result || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
