import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function PublicRoute({ children }) {
   const { isAuthenticated, loading } = useAuth();

   // Show loading while checking authentication
   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
         </div>
      );
   }

   // If authenticated, redirect to dashboard
   if (isAuthenticated) {
      console.log("✅ User already authenticated, redirecting to dashboard");
      return <Navigate to="/callapp" replace />;
   }

   // If not authenticated, show public content
   console.log("✅ User not authenticated, showing public content");
   return children;
}

export default PublicRoute;
