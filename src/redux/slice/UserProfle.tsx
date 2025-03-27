import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { GET_USER_PROFILE } from '../../Config';
import { UserProfile } from '@/type';

interface UserProfileState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}


const initialState: UserProfileState = {
  userProfile: null,
  loading: false,
  error: null,
};

export const getUserProfile = createAsyncThunk<UserProfile, string>(
  GET_USER_PROFILE,
  async (userId: string) => {
    const response = await axios.get<UserProfile>(`${GET_USER_PROFILE}/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });
    return response.data;
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load user profile';
      });
  },
});

export default userProfileSlice.reducer;
