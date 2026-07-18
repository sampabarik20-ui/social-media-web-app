import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { fetchCurrentUser } from "./authReducer";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`users/profile/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching profile data."
      );
    }
  }
);

export const toggleFollow = createAsyncThunk(
  "profile/toggleFollow",
  async (id, {dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`users/follow/${id}`);
      dispatch(fetchProfile(id));
      dispatch(fetchCurrentUser());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error toggling follow."
      );
    }
  }
);
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFollow.pending, (state) => {
       state.loading = true;
      })
      .addCase(toggleFollow.fulfilled, (state) => { 
        state.loading = false;
     })
     .addCase(toggleFollow.rejected, (state, action) => {
          state.loading = false;
         state.error = action.payload;
     });
  },
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
