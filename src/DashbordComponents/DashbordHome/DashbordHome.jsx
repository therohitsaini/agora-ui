import React, { Fragment } from 'react'
import AppBarDashbord from '../DashbordPages/AppBarDashbord'
import SideDrower from '../DashbordPages/SideDrower'
import HomeContent from '../DashbordPages/HomeContent'
import { Outlet } from 'react-router-dom'

function DashbordHome() {
    return (
        <div className="h-screen flex flex-col">
            <div
                className="sticky top-0 z-50">
                <AppBarDashbord />
            </div>
            <div
                className="flex flex-1 overflow-hidden">
                <div
                    className="w-60 bg-[#050505f3] text-white flex-shrink-0 -mt-10">
                    <SideDrower />
                </div>
                <div
                    className="flex-1 overflow-auto p-4 bg-black">
                    <div
                        className="h-full">
                        <p className='text-white py-5'> <span className='text-slate-600 font-bold'>Dashboard  &gt;</span> Home</p>
                        <HomeContent />
                     
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashbordHome
