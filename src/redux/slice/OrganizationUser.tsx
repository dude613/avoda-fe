import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LIST_TEAMMEMBER } from "../../Config";

interface TeamMember {
  userDeleteStatus: string;
  avatar: string | undefined;
  id: string;
  userId: string;
  organizationName: string;
  name: string;
  email: string;
  role: string;
  status: string;
  organization: string;
  resetToken: string;
  resetTokenExpiry: string;
}

interface OrganizationState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  teamMembers: [],
  loading: false,
  error: null,
};

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

export const fetchOrganizations = createAsyncThunk(
  "organization/fetchOrganizations",
  async (userId: string) => {
    const response = await axios.get(`${LIST_TEAMMEMBER}/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data.teamMembers;
  }
);

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch team members";
      });
  },
});

export default organizationSlice.reducer;
