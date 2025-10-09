import React, { Fragment, useEffect, useState } from 'react'
import Overview from '../../Utils/Overview'

import SessionsChart from '../../Charts/SessionsChart'
import { PageViewsBarChart } from '../../Charts/SparklineChart'
import DataGridTable from '../../components/DataGridTable'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import IncomingCallPopup from '../../components/IncomingCallPopup'
import { Box, Typography } from '@mui/material'


const columns =
   [

      { field: 'fullname', headerName: 'First name', width: 180 },
      { field: 'EmailId', headerName: 'Email Id', width: 180 },
      { field: 'CallType', headerName: 'Call Type', width: 150 },
      { field: 'StartTime', headerName: 'Start Time', width: 150 },
      { field: 'Duration', headerName: 'Duration', width: 150 },
      { field: 'EndTime', headerName: 'End Time', width: 150 },

   ]

function HomeConsultant() {
   const [socket, setSocket] = useState(null)
   const [incoming, setIncoming] = useState(null)
   const [callsHistory, setCallsHistory] = useState([])
   const [id, setId] = useState(null)
   const navigate = useNavigate()

   useEffect(() => {
      const id = localStorage.getItem('user-ID')
      setId(id)
   }, [])



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

   const getAllCallsHistory = async (id) => {
      const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/consultant-history/${id}`
      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      })
      const { userHistory } = await response.json()
      if (response.ok) {
         setCallsHistory(userHistory)
      } else {
         console.log('Failed to get calls history')
      }

   }
   useEffect(() => {
      getAllCallsHistory(id)
   }, [id])
   console.log("callsHistory", callsHistory)

   const formatDateTime = (isoString) => {
      if (!isoString) return '-'
      const d = new Date(isoString)
      if (Number.isNaN(d.getTime())) return '-'
      return d.toLocaleString()
   }

   const formatSeconds = (totalSeconds) => {
      if (typeof totalSeconds !== 'number' || !Number.isFinite(totalSeconds)) return '-'
      const seconds = Math.max(0, Math.floor(totalSeconds))
      const hrs = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      return `${mins}:${String(secs).padStart(2, '0')}`
   }

   const deriveDurationSeconds = (startTime, endTime, durationSeconds) => {
      if (typeof durationSeconds === 'number') return durationSeconds
      if (startTime && endTime) {
         const start = new Date(startTime).getTime()
         const end = new Date(endTime).getTime()
         if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
            return Math.floor((end - start) / 1000)
         }
      }
      return undefined
   }

   const rows = callsHistory?.map((call, idx) => {
      const durationSec = deriveDurationSeconds(call.startTime, call.endTime, call.durationSeconds)
      const rowId = call?.id || call?._id || `${call?.userId || 'unknown'}-${call?.startTime || idx}-${idx}`
      return {
         id: rowId, // must be unique per row for the grid
         fullname: call?.user?.fullName || call?.user?.fullname || '-',
         EmailId: call?.user?.EmailId || call?.user?.email || '-',
         CallType: call?.type || '-',
         StartTime: formatDateTime(call?.startTime),
         Duration: formatSeconds(durationSec),
         EndTime: formatDateTime(call?.endTime),
      }
   })


   return (
      <Fragment>
         {
            incoming && (
               <IncomingCallPopup incoming={incoming} accept={accept} reject={reject} />
            )}
         <Overview totalClients={callsHistory} />
         <div className='flex gap-5 mt-5 my-5'>
            <SessionsChart />
            <PageViewsBarChart />
         </div>
         <Box sx={{ width: '100%' }}>
            <Typography variant='h6' className='text-white' sx={{ fontSize: '1.5rem', mb: 1, textUnderlineOffset: '10px' }}>Calls History</Typography>
            <DataGridTable columns={columns} rows={rows} />
         </Box>
         <div className='w-full text-slate-600 py-10 text-center'>    © 2025 Saini Web Solutions. All rights reserved.</div>
      </Fragment>
   )
}

export default HomeConsultant