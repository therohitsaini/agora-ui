import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   const fetchverifyToken = async (token) => {
      try {
         const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:3001';
         
         // Try the token-verify endpoint first
         const fetchData = await fetch(`${backendUrl}/api/auth/token-verify`, {
            method: "GET",
            headers: { 
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}` 
            }
         });
         
         if (fetchData.status === 401) {
            console.log("❌ Token expired or invalid");
            localStorage.removeItem("access_user");
            localStorage.removeItem("user-ID");
            setUser(null);
            setIsAuthenticated(false);
            return;
         }
         
         const response = await fetchData.json();
         console.log("✅ Token verified successfully:", response);
         
         if (response.user) {
            setUser(response.user);
            setIsAuthenticated(true);
         } else {
            setUser(null);
            setIsAuthenticated(false);
         }
      } catch (err) {
         console.log("❌ Token verification failed:", err);
         
         // If token-verify endpoint doesn't exist, try to get user details
         try {
            const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:3001';
            const userDataResponse = await fetch(`${backendUrl}/api/users/user-details`, {
               method: "GET",
               headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}` 
               }
            });
            
            if (userDataResponse.ok) {
               const userData = await userDataResponse.json();
               console.log("✅ User data fetched successfully:", userData);
               setUser(userData.data[0]); // Assuming user data is in data array
               setIsAuthenticated(true);
            } else {
               throw new Error("Failed to fetch user data");
            }
         } catch (fallbackErr) {
            console.log("❌ Fallback verification also failed:", fallbackErr);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_user");
            localStorage.removeItem("user-ID");
         }
      } finally {
         setLoading(false);
      }
   };

   const login = (token, userData) => {
      localStorage.setItem("access_user", token);
      localStorage.setItem("user-ID", userData._id);
      setUser(userData);
      setIsAuthenticated(true);
   };

   const logout = () => {
      localStorage.removeItem("access_user");
      localStorage.removeItem("user-ID");
      setUser(null);
      setIsAuthenticated(false);
   };

   useEffect(() => {
      const token = localStorage.getItem("access_user");
      if (token) {
         fetchverifyToken(token);
      } else {
         setUser(null);
         setIsAuthenticated(false);
         setLoading(false);
      }
   }, []);

   return (
      <AuthContext.Provider value={{ 
         user, 
         setUser, 
         isAuthenticated, 
         loading, 
         login, 
         logout 
      }}>
         {children}
      </AuthContext.Provider>
   );
};




export const useAuth = () => useContext(AuthContext)