import React, { useEffect, useState } from 'react'
import AppBarDashbord from '../DashbordPages/AppBarDashbord'
import SideDrower from '../DashbordPages/SideDrower'
import { Outlet, useLocation } from 'react-router-dom'

const profileOptions = [
    { text: "Profile", path: "/dashboard/profile" },
    { text: "Settings", path: "/dashboard/settings" },
    { text: "Logout", path: "/dashboard/logout" },

];

function DashbordHome() {
    const [allusers, setAllUsers] = useState([])

    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();
    const pageTitle = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

    const getAllusers = async (e) => {
        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api/users/user-details`;
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/josn" }
            })
            const { data } = await response.json()
            if (response.ok) {
                setAllUsers(data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllusers()
    }, [])

    const data = {
        allusers
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Top AppBar */}
            <div className="sticky top-0 z-50 ">
                <AppBarDashbord />
            </div>

            {/* Sidebar + Main Content */}
            <div className="flex flex-1 overflow-hidden ">
                {/* Sidebar */}
                <div className="w-60 bg-[#050505f3] text-white flex-shrink-0 -mt-10 ">
                    <SideDrower profileOptions={profileOptions} />
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

export default DashbordHome
