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

   if (!isAuthenticated) {
      return <Navigate to="/" replace />;
   }

   if (role !== 'admin') {
      // Non-admin users (e.g., consultants) are redirected to their dashboard
      if (role === 'consultant') return <Navigate to="/consultant-dashboard" replace />;
      return <Navigate to="/callapp" replace />;
   }

   return children;
}

export default AdminRoute;


