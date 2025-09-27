// utils/getLatestUsers.js
export const getLatestUsers = (users, count = 10) => {
    if (!Array.isArray(users)) return [];

    return [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
        .slice(0, count); // sirf 10
};
