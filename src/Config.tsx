const baseUrl = import.meta.env.VITE_BACKEND_URL;

const url = `${baseUrl}/api`;


//.................Organization API endpoints................\\
export const CREATE_ORGANIZATION = `${url}/admin/create-Organization`;
export const SKIP_ORGANIZATION = `${url}/admin/skip-organization`
export const ORGANIZATION_LIST = `${url}/admin/organization-list`;
export const ADD_TEAM_MEMBER = `${url}/admin/add-teammember`;
export const LIST_TEAMMEMBER = `${url}/admin/list-teammember`;
export const USER_ARCHIVED = `${url}/admin/user-archived`;
export const EDIT_TEAM_MEMBER = `${url}/admin/edit-teammember`;



//..................Auth API Endpoints....................\\
export const GET_USER_PROFILE = `${url}/auth/get-profile`;
export const LOGIN_API = `${url}/auth/login`;
export const UPDATE_USER_PROFILE = `${url}/auth/update-profile`;
export const UPDATE_USER_PROFILE_PICTURE = `${url}/auth/upload-image`;
export const LOGOUT_API = `${url}/auth/logout`;
export const All_USER_INFO=`${url}/auth/allUserInfo`