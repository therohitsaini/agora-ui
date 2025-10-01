import React from 'react'
import AppBarDashbord from '../DashbordComponents/DashbordPages/AppBarDashbord'
import SideDrower from '../DashbordComponents/DashbordPages/SideDrower'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../authProvider/AuthProvider'
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";

const menuItemConsultant = [
   { text: "Home", icon: <HomeIcon sx={{ fontSize: "16px" }} />, path: "/consultant-dashboard/homeconsultant" },
   { text: "Clients", icon: <PeopleIcon sx={{ fontSize: "16px" }} />, path: "/consultant-dashboard/clients-consultant" },
   // { text: "Tasks", icon: <AssignmentIcon sx={{ fontSize: "16px" }} />, path: "/consultant-dashboard/tasks" },
   { text: "Analytics", icon: <AssignmentIcon sx={{ fontSize: "16px" }} />, path: "/consultant-dashboard/analytics-consultant" },
];
const profileOptions = [
   { text: "Profile", path: "/consultant-dashboard/profile" },
   { text: "Settings", path: "/consultant-dashboard/settings" },
   { text: "Logout", path: "/consultant-dashboard/logout" },

];
function ConsultantHome() {

   const location = useLocation();
   const currentPath = location.pathname.split('/').pop();
   const pageTitle = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
   const { user, isAuthenticated, loading } = useAuth();

   return (
      <div className="h-screen flex flex-col">
         {/* Top AppBar */}
         <div className="sticky top-0 z-50">
            <AppBarDashbord />
         </div>

         {/* Sidebar + Main Content */}
         <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-60 bg-[#050505f3] text-white flex-shrink-0 -mt-10">
               <SideDrower menuItemConsultant={menuItemConsultant} profileOptions={profileOptions} />
            </div>

            {/* Main Content */}
            <div className="main-Content flex-1 overflow-auto p-4 bg-black">
               <div className="h-full">
                  <p className='text-white py-5'>
                     <span className='text-slate-600 font-bold'>Dashboard &gt;</span> {pageTitle}
                  </p>

                  <Outlet data />
               </div>
            </div>
         </div>
      </div>
   )
}

export default ConsultantHome