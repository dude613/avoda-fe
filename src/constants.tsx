const baseUrl = import.meta.env.VITE_BACKEND_URL;
const url = `${baseUrl}/api`;



//.................Organization API endpoints................\\
export const CREATE_ORGANIZATION = `${url}/admin/create-Organization`;
export const ORGANIZATION_LIST = `${url}/admin/organization-list`;
export const ADD_TEAM_MEMBER = `${url}/admin/add-teammeber`;
export const LIST_TEAMMEMBER = `${url}/admin/list-teammeber`;