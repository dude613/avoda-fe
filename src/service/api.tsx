import axios from "axios";
import { CREATE_ORGANIZATION, ORGANIZATION_LIST, ADD_TEAM_MEMBER, LOGIN_API } from "../Config"

const userId = localStorage.getItem("userId");

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
        return data;
    } catch (e) {
        console.error(e);
        return e;
    }
}

export async function CreateOrganizationAPI(formData: any) {
    try {
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

export async function fetchOrganization() {
    try {
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