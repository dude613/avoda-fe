export const userId = localStorage.getItem('userId');
export const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
};
