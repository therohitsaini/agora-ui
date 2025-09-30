import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function AdminRoute({ children }) {
   const { user, isAuthenticated, loading } = useAuth();

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
         </div>
      );
   }

   const role = String(user?.role || '').trim().toLowerCase();

   if (!isAuthenticated || role !== 'admin') {
      return <Navigate to="/" replace />;
   }

   return children;
}

export default AdminRoute;


