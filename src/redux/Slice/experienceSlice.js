// // src/redux/Slice/experienceSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/experience`;


// /* ---------------------- THUNKS ---------------------- */

// // 🎯 GET all experiences
// export const fetchExperiences = createAsyncThunk(
//   "experience/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(API_URL);
//       return res.data; // { success, error, message, results: [...] }
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data || { success: false, error: true, message: "Failed to fetch" }
//       );
//     }
//   }
// );

// // 🎯 POST create experience
// export const createExperience = createAsyncThunk(
//   "experience/create",
//   async (experienceData, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(API_URL, experienceData);
//       return res.data; // { success, error, message, result }
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data || { success: false, error: true, message: "Failed to create" }
//       );
//     }
//   }
// );

// // 🎯 PATCH update experience
// export const updateExperience = createAsyncThunk(
//   "experience/update",
//   async ({ id, updatedData }, { rejectWithValue }) => {
//     try {
//       const res = await axios.patch(`${API_URL}/${id}`, updatedData);
//       return res.data; // { success, error, message, result }
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data || { success: false, error: true, message: "Failed to update" }
//       );
//     }
//   }
// );

// // 🎯 DELETE experience
// export const deleteExperience = createAsyncThunk(
//   "experience/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await axios.delete(`${API_URL}/${id}`);
//       return { ...res.data, deletedId: id }; 
//       // server might not return the deleted id, so attach it manually
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data || { success: false, error: true, message: "Failed to delete" }
//       );
//     }
//   }
// );

// /* ---------------------- SLICE ---------------------- */
// const experienceSlice = createSlice({
//   name: "experience",
//   initialState: {
//     experiences: [],
//     loading: false,
//     success: false,
//     error: false,
//     message: "",
//   },
//   reducers: {
//     resetExperienceState: (state) => {
//       state.success = false;
//       state.error = false;
//       state.message = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /* -------- Fetch -------- */
//       .addCase(fetchExperiences.pending, (state) => {
//         state.loading = true;
//         state.success = false;
//         state.error = false;
//         state.message = "";
//       })
//       .addCase(fetchExperiences.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.success;
//         state.error = action.payload.error;
//         state.message = action.payload.message;
//         state.experiences = action.payload.results || []; // ✅ use results
//       })
//       .addCase(fetchExperiences.rejected, (state, action) => {
//         state.loading = false;
//         state.success = false;
//         state.error = true;
//         state.message = action.payload?.message || "Failed to fetch experiences";
//       })

//       /* -------- Create -------- */
//       .addCase(createExperience.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createExperience.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.success;
//         state.error = action.payload.error;
//         state.message = action.payload.message;
//         if (action.payload.success && action.payload.result) {
//           state.experiences.push(action.payload.result); // ✅ push result
//         }
//       })
//       .addCase(createExperience.rejected, (state, action) => {
//         state.loading = false;
//         state.success = false;
//         state.error = true;
//         state.message = action.payload?.message || "Failed to create experience";
//       })

//       /* -------- Update -------- */
//       .addCase(updateExperience.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateExperience.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.success;
//         state.error = action.payload.error;
//         state.message = action.payload.message;
//         if (action.payload.success && action.payload.result) {
//           state.experiences = state.experiences.map((exp) =>
//             exp._id === action.payload.result._id ? action.payload.result : exp
//           );
//         }
//       })
//       .addCase(updateExperience.rejected, (state, action) => {
//         state.loading = false;
//         state.success = false;
//         state.error = true;
//         state.message = action.payload?.message || "Failed to update experience";
//       })

//       /* -------- Delete -------- */
//       .addCase(deleteExperience.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteExperience.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.success;
//         state.error = action.payload.error;
//         state.message = action.payload.message;
//         if (action.payload.success) {
//           state.experiences = state.experiences.filter(
//             (exp) => exp._id !== action.payload.deletedId
//           );
//         }
//       })
//       .addCase(deleteExperience.rejected, (state, action) => {
//         state.loading = false;
//         state.success = false;
//         state.error = true;
//         state.message = action.payload?.message || "Failed to delete experience";
//       });
//   },
// });

// export const { resetExperienceState } = experienceSlice.actions;
// export default experienceSlice.reducer;
// src/redux/Slice/experienceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/experience`;

/* ---------------------- THUNKS ---------------------- */

// 🎯 GET all experiences (public or protected as needed)
export const fetchExperiences = createAsyncThunk(
  "experience/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // ✅ Get token
      const res = await axios.get(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Failed to fetch",
        }
      );
    }
  }
);

// 🎯 POST create experience
export const createExperience = createAsyncThunk(
  "experience/create",
  async (experienceData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // ✅ from Redux
      const res = await axios.post(API_URL, experienceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Failed to create",
        }
      );
    }
  }
);

// 🎯 PATCH update experience
export const updateExperience = createAsyncThunk(
  "experience/update",
  async ({ id, updatedData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // ✅ from Redux
      const res = await axios.patch(`${API_URL}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Failed to update",
        }
      );
    }
  }
);

// 🎯 DELETE experience
export const deleteExperience = createAsyncThunk(
  "experience/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // ✅ from Redux
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...res.data, deletedId: id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          success: false,
          error: true,
          message: "Failed to delete",
        }
      );
    }
  }
);

/* ---------------------- SLICE ---------------------- */

const experienceSlice = createSlice({
  name: "experience",
  initialState: {
    experiences: [],
    loading: false,
    success: false,
    error: false,
    message: "",
  },
  reducers: {
    resetExperienceState: (state) => {
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------- Fetch -------- */
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.error;
        state.message = action.payload.message;
        state.experiences = action.payload.results || [];
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message =
          action.payload?.message || "Failed to fetch experiences";
      })

      /* -------- Create -------- */
      .addCase(createExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.error;
        state.message = action.payload.message;
        if (action.payload.success && action.payload.result) {
          state.experiences.push(action.payload.result);
        }
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message =
          action.payload?.message || "Failed to create experience";
      })

      /* -------- Update -------- */
      .addCase(updateExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.error;
        state.message = action.payload.message;
        if (action.payload.success && action.payload.result) {
          state.experiences = state.experiences.map((exp) =>
            exp._id === action.payload.result._id
              ? action.payload.result
              : exp
          );
        }
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message =
          action.payload?.message || "Failed to update experience";
      })

      /* -------- Delete -------- */
      .addCase(deleteExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.error;
        state.message = action.payload.message;
        if (action.payload.success) {
          state.experiences = state.experiences.filter(
            (exp) => exp._id !== action.payload.deletedId
          );
        }
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message =
          action.payload?.message || "Failed to delete experience";
      });
  },
});

export const { resetExperienceState } = experienceSlice.actions;
export default experienceSlice.reducer;
