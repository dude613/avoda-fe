/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  CREATE_ORGANIZATION,
  ORGANIZATION_LIST,
  ADD_TEAM_MEMBER,
  LOGIN_API,
  SKIP_ORGANIZATION,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_PICTURE,
  ARCHIVE_USER,
  EDIT_TEAM_MEMBER,
  LOGOUT_API,
  All_USER_INFO,
  UNARCHIVE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER,
  GET_ACHIVED_USERS,
} from "../Config";

interface OrganizationFormData {
  organizationName: string;
  industry?: string;
  companySize: string;
}
interface MemberFormData {
  members: { name: string; email: string; role: string }[];
}

export interface TeamMemberEditPayload {
  name: string;
  email: string;
  role: string;
  orgId: string;
  id?: string;
}

interface ProfileFormData {
  name: string;
  email: string;
  role: string;
  userId: string;
}

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

export async function LoginAPI(formData: { email: string; password: string }) {
  try {
    const response = await fetch(LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Error: ${response.status} ${response.statusText}`,
      };
    }
    return data;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: `Failed to connect to server: ${
        e instanceof Error ? e.message : String(e)
      }`,
    };
  }
}

export async function CreateOrganizationAPI(formData: OrganizationFormData) {
  try {
    const userId = localStorage.getItem("userId");
    const body = {
      ...formData,
      userId: userId,
    };
    const response = await axios.post(CREATE_ORGANIZATION, body, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    return data;
  } catch (e) {
    console.log("error message Create Organization", e);
    return e;
  }
}

export async function SkipOnboardingAPI(organizationId: string) {
  try {
    const response = await axios.post(
      SKIP_ORGANIZATION,
      { OrgId: organizationId },
      {
        headers: getAuthHeaders(),
      }
    );

    return response;
  } catch (error) {
    return { success: false, error: "Failed to connect to server" };
  }
}

export async function fetchOrganization() {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(`${ORGANIZATION_LIST}/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.log("error fetch organization", error);
    return error;
  }
}

export async function AddTeamMemberAPI(formData: MemberFormData) {
  try {
    const response = await axios.post(ADD_TEAM_MEMBER, formData, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    return data;
  } catch (e) {
    console.log("error message Create Organization", e);
    return e;
  }
}

export async function UpdateProfile(formData: ProfileFormData) {
  try {
    const response = await axios.put(UPDATE_USER_PROFILE, formData, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.log("error message Create Organization", error);
    return error;
  }
}

export async function UploadUserPicture(formData: FormData) {
  try {
    const response = await axios.post(UPDATE_USER_PROFILE_PICTURE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error during API call:", error);
    return error;
  }
}

export async function ArchiveTeamMember(userId: string, organizationName: string) {
  try {
    const response = await axios.post(
      ARCHIVE_USER,
      { userId, organizationName },
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    return null;
  }
}

export async function unarchiveTeamMember(userId: string, organizationName: string) {
  try {
    const response = await axios.put(`${UNARCHIVE_TEAM_MEMBER}/${userId}/${organizationName}`,
      { userId },
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error during unarchive API call:", error);
    return null;
  }
}
export async function deleteTeamMember(userId: string, organizationName: string) {
  try {
    const response = await axios.delete(`${DELETE_TEAM_MEMBER}/${userId}/${organizationName}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error during deleting team member:", error);
    return null;
  }
}

export async function fetchArchivedTeamMembers() {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(`${GET_ACHIVED_USERS}/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.log("error fetching archived team members", error);
    return error;
  }
}

export const GetUserInfoApi = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(`${All_USER_INFO}/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = response?.data?.allUserDetails;
    return data;
  } catch (error) {
    console.log("error fetch organization", error);
    return error;
  }
};

export async function EditTeamMemberAPI(formData: TeamMemberEditPayload) {
  try {
    const response = await axios.put(EDIT_TEAM_MEMBER, formData, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.log("error message Create Organization", error);
    return error;
  }
}

export async function LogoutAPI(formData: { userId: string }) {
  try {
    const response = await fetch(LOGOUT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Error: ${response.status} ${response.statusText}`,
      };
    }
    return data;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: `Failed to connect to server: ${
        e instanceof Error ? e.message : String(e)
      }`,
    };
  }
}
