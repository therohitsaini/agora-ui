import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import SignIn from '../Auth/SignIn';

function ProtectRoute({ children }) {
   const { user, isAuthenticated, loading } = useAuth();

   // Show loading while checking authentication
   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
         </div>
      );
   }

   // If not authenticated, redirect to login
   if (!isAuthenticated || !user) {
      console.log("❌ User not authenticated, redirecting to login");
      return <Navigate to="/" replace />;
   }

   // If authenticated, render protected content
   console.log("✅ User authenticated, allowing access");
   return children;
}

export default ProtectRoute;