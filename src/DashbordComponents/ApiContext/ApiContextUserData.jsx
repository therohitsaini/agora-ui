import React, { createContext, useState, useEffect } from "react";


export const allUserDetailsContext = createContext();

export const AllUserProvider = ({ children }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [allConsultant, setAllConsultant] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
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

    const getAllConsultant = async () => {
        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/api-find-consultant`;
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/josn" }
            });
            const { findConsultant } = await res.json();
            if (res.ok) {
                setAllConsultant(findConsultant || []);
            } else {
                setError(data.message || "Failed to fetch allUsers");
            }
        } catch (err) {
            setError("Server error, please try again later.");
        } finally {
            // setLoading(false);
        }
    }

    useEffect(() => {
        getAllUsers();
        getAllConsultant()
    }, []);

    return (
        <allUserDetailsContext.Provider value={{ allUsers, loading, error, allConsultant }}>
            {children}
        </allUserDetailsContext.Provider>
    );
};
