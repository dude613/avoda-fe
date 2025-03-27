import axios from "axios";
import { CREATE_ORGANIZATION, ORGANIZATION_LIST, ADD_TEAM_MEMBER, LOGIN_API, SKIP_ORGANIZATION, UPDATE_USER_PROFILE } from "../Config"



const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

export async function LoginAPI(formData: { email: string; password: string }) {
    try {
        const response = await fetch(LOGIN_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (!response.ok) {
            return { success: false, error: data.error || `Error: ${response.status} ${response.statusText}` };
        }
        return data;
    } catch (e) {
        console.error(e);
        return { success: false, error: `Failed to connect to server: ${e instanceof Error ? e.message : String(e)}` };
    }
}

export async function CreateOrganizationAPI(formData: any) {
    try {
        const userId = localStorage.getItem("userId");
        const body = {
            ...formData,
            userId: userId,
        };
        const response = await axios.post(
            CREATE_ORGANIZATION, body,
            {
                headers: getAuthHeaders(),
            }
        );
        const data = response.data;
        return data;
    } catch (e) {
        console.log("error message Create Organization", e)
        return e;
    }
}

export async function SkipOnboardingAPI(organizationId: string) {
    try {
        const response = await axios.post(
            SKIP_ORGANIZATION, { OrgId: organizationId },
            {
                headers: getAuthHeaders(),
            }
        );
        const data = response.data;
        return data;
    } catch (error) {
        return { success: false, error: "Failed to connect to server" }
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
        console.log("error fetch organization", error)
        return error
    }
}

export async function AddTeamMemberAPI(formData: any) {
    try {
        const response = await axios.post(
            ADD_TEAM_MEMBER, formData,
            {
                headers: getAuthHeaders(),
            }
        );
        const data = response.data;
        return data;
    } catch (e) {
        console.log("error message Create Organization", e)
        return e;
    }
}


export async function UpdateProfile(formData: any) {
    try {
        const response = await axios.put(UPDATE_USER_PROFILE, formData, {
            headers: getAuthHeaders(),
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.log("error message Create Organization", error)
        return error;
    }
}