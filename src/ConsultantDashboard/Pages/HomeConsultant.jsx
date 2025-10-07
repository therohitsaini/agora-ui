import React, { Fragment, useEffect, useState } from 'react'
import Overview from '../../Utils/Overview'
import { cardData } from '../../FalbackData'
import SessionsChart from '../../Charts/SessionsChart'
import { PageViewsBarChart } from '../../Charts/SparklineChart'
import DataGridTable from '../../components/DataGridTable'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import IncomingCallPopup from '../../components/IncomingCallPopup'

function HomeConsultant() {
   const [socket, setSocket] = useState(null)
   const [incoming, setIncoming] = useState(null)
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
      return () => s.disconnect()
   }, [])

   const accept = async () => {
      if (!socket || !incoming) return
      const fromUid = localStorage.getItem('user-ID')
      socket.emit('call-accepted', { toUid: incoming.fromUid, fromUid, type: incoming.type, channelName: incoming.channelName })

      // Navigate to appropriate call page based on type
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
      <Fragment>
         {
            incoming && (
               <IncomingCallPopup incoming={incoming} accept={accept} reject={reject} />
            )}
         <Overview cardData={cardData} />
         <div className='flex gap-5 mt-5 my-5'>
            <SessionsChart />
            <PageViewsBarChart />
         </div>
         <DataGridTable />
         <div className='w-full text-slate-600 py-10 text-center'>    © 2025 Saini Web Solutions. All rights reserved.</div>
      </Fragment>
   )
}

export default HomeConsultant