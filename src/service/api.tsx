import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
const userId = localStorage.getItem("userId");
const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
}

export async function CreateOrganizationAPI(formData : any) {
    try {
        const body = {
            ...formData,
            userId: userId,
        };
        const response = await axios.post(
            `${baseUrl}/api/admin/create-Organization`, body,
            {
                headers: header,
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
        const response = await axios.get(`${baseUrl}/api/admin/organization-list/${userId}`, {
            headers: header,
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.log("error fetch organizaiton", error)
        return error
    }
}

export async function AddTeamMemberAPI(formData : any) {
    try {
        const response = await axios.post(
            `${baseUrl}/api/admin/add-teammeber`, formData,
            {
                headers: header,
            }
        );
        const data = response.data;
        return data;
    } catch (e) {
        console.log("error message Create Organization", e)
        return e;
    }
}