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
            console.log("🔄 getAllConsultant function called");
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/api-find-consultant`;
            console.log("🌐 API URL:", url);
            
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            
            console.log("📡 API Response Status:", res.status);
            const responseData = await res.json();
            console.log("📦 API Response Data:", responseData);
            
            if (res.ok) {
                const consultants = responseData.findConsultant || [];
                console.log("✅ Setting consultants:", consultants);
                setAllConsultant(consultants);
            } else {
                console.log("❌ API Error:", responseData);
                setError(responseData.message || "Failed to fetch consultants");
            }
        } catch (err) {
            console.log("💥 Error in getAllConsultant:", err);
            setError("Server error, please try again later.");
        } finally {
            // setLoading(false);
        }
    }

    useEffect(() => {
        getAllUsers();
        getAllConsultant()
    }, []);
    console.log("allConsultant", allConsultant)
    return (
        <allUserDetailsContext.Provider value={{
            allUsers,
            loading,
            error,
            allConsultant,
            getAllConsultant,
            getAllUsers
        }}>
            {children}
        </allUserDetailsContext.Provider>
    );
};
