import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      // store tokens
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axios.post(`${BASE_URL}/auth/logout`, { token: refreshToken });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return true;
    } catch (err) {
      // still clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { setUser, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
