import axios from "axios";
import { header, userId } from "../config";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export async function organizationNameAPI(formData: string) {
    try {
        const response = await axios.post(
            `${baseUrl}/api/admin/organization-name`,
            { name: formData },
            {
                headers: header,
            }
        );
        const data = response.data;
        return data;
    } catch (error) {
        console.log("errror organization name ", error)
        return error
    }
}


export async function CreateOrganizationAPI(formData: string) {
    try {
        const response = await axios.post(
            `${baseUrl}/api/admin/create-Organization`,
            { name: formData },
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