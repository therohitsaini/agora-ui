import React from 'react'
import AppBarDashbord from '../DashbordPages/AppBarDashbord'
import SideDrower from '../DashbordPages/SideDrower'
import { Outlet, useLocation } from 'react-router-dom'

function DashbordHome() {
    const location = useLocation();

    // Dynamic heading text based on path
    const currentPath = location.pathname.split('/').pop();
    const pageTitle = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

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
                    <SideDrower />
                </div>

                {/* Main Content */}
                <div className="main-Content flex-1 overflow-auto p-4 bg-black">
                    <div className="h-full">
                        <p className='text-white py-5'>
                            <span className='text-slate-600 font-bold'>Dashboard &gt;</span> {pageTitle}
                        </p>
                      
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashbordHome
