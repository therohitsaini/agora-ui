import React, { createContext, useState, useEffect } from "react";

// Context create karo
export const allUserDetailsContext = createContext();

export const AllUserProvider = ({ children }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // GET API call
    const getAllUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const url = `${import.meta.env.VITE_BACK_END_URL}/api/users/user-details`;

            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/josn" }
            });
            const data = await res.json();

            if (res.ok) {
                setAllUsers(data.data || []); // assume backend returns { success, data }
            } else {
                setError(data.message || "Failed to fetch allUsers");
            }
        } catch (err) {
            setError("Server error, please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Page load hone par call ho jaye
    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <allUserDetailsContext.Provider value={{ allUsers, loading, error }}>
            {children}
        </allUserDetailsContext.Provider>
    );
};
