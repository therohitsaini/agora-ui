import React, { useEffect, useState, Fragment } from 'react'
import AppBarDashbord from '../DashbordComponents/DashbordPages/AppBarDashbord'
import SideDrower from '../DashbordComponents/DashbordPages/SideDrower'
import { Outlet, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../authProvider/AuthProvider'
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { io } from 'socket.io-client'
import IncomingCallPopup from '../components/IncomingCallPopup'

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
   const [socket, setSocket] = useState(null)
   const [incoming, setIncoming] = useState(null)
   const location = useLocation();
   const currentPath = location.pathname.split('/').pop();
   const pageTitle = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
   const { user, isAuthenticated, loading } = useAuth();
   const navigate = useNavigate()

   useEffect(() => {
      const backendUrl = import.meta.env.VITE_BACK_END_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
      const s = io(backendUrl, {
         transports: ['websocket', 'polling'],
         reconnection: true,
         reconnectionAttempts: 10,
         reconnectionDelay: 1000,
         withCredentials: true,
      })
      setSocket(s)
      const me = localStorage.getItem('user-ID')
      if (me) s.emit('register', me)
      s.on('connect_error', (e) => console.log('socket connect_error', e?.message))
      s.on('error', (e) => console.log('socket error', e))
      s.on('incoming-call', (data) => setIncoming(data))
      s.on('call-cancelled', () => setIncoming(null))
      return () => s.disconnect()
   }, [])

   const accept = async () => {
      if (!socket || !incoming) return
      const fromUid = localStorage.getItem('user-ID')
      socket.emit('call-accepted', { toUid: incoming.fromUid, fromUid, type: incoming.type, channelName: incoming.channelName })
      if (incoming.type === 'voice') {
         await navigate(`/voice-call?type=${incoming.type}&channel=${incoming.channelName}&uid=${fromUid}&consultantId=${incoming.fromUid}`)
      } else {
         await navigate(`/video-call?type=${incoming.type}&channel=${incoming.channelName}&uid=${fromUid}&consultantId=${incoming.fromUid}`)
      }
      setIncoming(null)
   }

   const reject = () => {
      if (!socket || !incoming) return
      const fromUid = localStorage.getItem('user-ID')
      socket.emit('call-rejected', { toUid: incoming.fromUid, fromUid, channelName: incoming.channelName, reason: 'Call rejected by consultant' })
      setIncoming(null)
   }

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
                  {incoming && (
                     <IncomingCallPopup incoming={incoming} accept={accept} reject={reject} />
                  )}
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