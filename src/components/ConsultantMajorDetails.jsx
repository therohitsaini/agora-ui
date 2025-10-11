import React, { useContext, useState } from 'react'
import {
   Box,
   Grid,
   Card,
   CardContent,
   Avatar,
   Typography,
   Stack,
   Chip,
   Button,
   IconButton,
   Divider,
   Rating,
   LinearProgress,

} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import CallIcon from '@mui/icons-material/Call'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import VideocamIcon from '@mui/icons-material/Videocam'
import MessageIcon from '@mui/icons-material/Message'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Navbar from './Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { toast, ToastContainer } from 'react-toastify'
import InsufficientBalanceAlert from '../AlertModal/InsuficientBalanceAlert'

function StatRow({ label, value, color = '#10b981' }) {
   return (
      <Stack spacing={0.5}>
         <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>{label}</Typography>
            <Typography variant="caption" sx={{ color: '#e5e7eb' }}>{value}%</Typography>
         </Stack>
         <LinearProgress
            variant="determinate"
            value={value}
            sx={{
               height: 6,
               borderRadius: 3,
               bgcolor: 'rgba(148, 163, 184, 0.12)',
               '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 }
            }}
         />
      </Stack>
   )
}

function ConsultantMajorDetails() {
   const [isFav, setIsFav] = useState(false)
   const [consultantByID, setConsultantByID] = useState([])
   const [socket, setSocket] = useState(null)
   const [callFailed, setCallFailed] = useState(false)
   const [isCalling, setIsCalling] = useState(false)
   const callingToastRef = useRef(null)
   const { id } = useParams()
   const navigate = useNavigate()
   console.log("id", id)

   const getConsultantByID = async (id) => {
      if (!id) {
         console.log("id is not found")
         return;
      }
      try {
         const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/consultantid/${id}`;
         const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
         });
         const { consultant } = await res.json();

         if (res.ok) {
            setConsultantByID(consultant);
         }
         else {
            console.log("consultant by id data is not found")
         }
      } catch (err) {
         console.log(" Error in getConsultantByID:", err);

      }
   }
   useEffect(() => {
      getConsultantByID(id);
   }, [id])


   useEffect(() => {
      const backendUrl = import.meta.env.VITE_BACK_END_URL
      const s = io(backendUrl, {
         transports: ['websocket', 'polling'],
         reconnection: true,
         reconnectionAttempts: 10,
         reconnectionDelay: 1000,
         withCredentials: true,
      })
      setSocket(s)
      const callerId = localStorage.getItem('user-ID')
      if (callerId) s.emit('register', callerId)

      s.on('connect_error', (err) => {
         console.log('socket connect_error', err?.message)
      })
      s.on('error', (err) => {
         console.log('socket error', err)
      })
      s.on('call-failed', (payload) => {
         console.log('call-failed', payload)
         setCallFailed(true)
         setIsCalling(false)
         if (callingToastRef.current) {
            try { toast.dismiss(callingToastRef.current) } catch { }
            callingToastRef.current = null
         }
         return
      })
      s.on('call-accepted', (payload) => {
         const type = payload.type
         const channel = payload.channelName
         const uid = localStorage.getItem('user-ID')
         const consultantId = payload.fromUid || id
         setIsCalling(false)

         if (callingToastRef.current) {
            try { toast.dismiss(callingToastRef.current) } catch { }
            callingToastRef.current = null
         }
         if (type === 'voice') {
            navigate(`/voice-call?type=${type}&channel=${channel}&uid=${uid}&consultantId=${consultantId}`)
         } else if (type === 'video') {
            navigate(`/video-call?type=${type}&channel=${channel}&uid=${uid}&consultantId=${consultantId}`)
         } else {
            toast.error('Invalid call type')
         }
      })

      s.on('call-rejected', (payload) => {
         setIsCalling(false)

         if (callingToastRef.current) {
            try { toast.dismiss(callingToastRef.current) } catch { }
            callingToastRef.current = null
         }
         const reason = payload?.reason || 'reject the call'
         toast.error(reason)
      })

      return () => s.disconnect()
   }, [id])

   const startVideoCall = () => {
      if (!socket) { toast.error('No connection'); return }
      if (!id) { toast.error('Consultant missing'); return }
      const fromUid = localStorage.getItem('user-ID')
      if (!fromUid) { toast.error('Login required'); return }
      const ts = Date.now().toString().slice(-8)
      const channelName = `call${fromUid.slice(-6)}${id.slice(-6)}${ts}`
      const data = { toUid: id, fromUid, type: 'video', channelName }
      socket.emit('call-user', data)
      try { callingToastRef.current = toast.loading('Calling consultant...') } catch { }
   }


   const resetCallFailed = () => {
      setCallFailed(false)
      setIsCalling(false)
   }

   const startVoiceCall = () => {
      if (!socket) { toast.error('No connection'); return }
      if (!id) { toast.error('Consultant missing'); return }
      const fromUid = localStorage.getItem('user-ID')
      if (!fromUid) { toast.error('Login required'); return }
      if (callFailed) return
      if (isCalling) return
      setIsCalling(true)
      const ts = Date.now().toString().slice(-8)
      const channelName = `voice${fromUid.slice(-6)}${id.slice(-6)}${ts}`
      const data = { toUid: id, fromUid, type: 'voice', channelName }
      socket.emit('call-user', data)
      try { callingToastRef.current = toast.loading('Calling consultant...') } catch { }
   }


   const consultant = {
      name: 'Advit Sharma',
      avatar:
         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      role: 'Vedic • Numerology • Vastu',
      languages: ['Hindi', 'English', 'Punjabi', 'Gujarati'],
      experience: 8,
      rating: 4.94,
      reviews: 16954,
      calls: 20000,
      price: 5,
      mrp: 23,
      bio:
         "Advit is a Vedic Astrologer who helps clients find clarity with compassionate, practical guidance. He works with Vedic Astrology ethics to bring stability and empowers you with spiritual insight for relationships, career, wealth and property, health and more.",
      similar: [
         { name: 'Archita', rating: 4.9 },
         { name: 'Sujata', rating: 4.8 },
         { name: 'Aniket', rating: 4.9 },
         { name: 'Shilpa', rating: 5.0 }
      ]
   }

   return (
      <div className='w-full h-full'>
         <Navbar />
         <ToastContainer />
         <InsufficientBalanceAlert open={callFailed} onClose={resetCallFailed} />
         <Box sx={{
            minHeight: '100vh',
            px: { xs: 2, md: 3 },
            py: 3,
            // border: '1px solid red',
            px: 20,
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
         }}>
            <Grid container spacing={3}>

               <Grid item xs={12} md={8}>
                  <Card sx={{
                     background: 'rgba(255, 255, 255, 0.05)',
                     border: '1px solid rgba(148,163,184,0.12)',
                     borderRadius: 3
                  }}>
                     <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Grid container spacing={2} alignItems="center">
                           <Grid item xs={12} sm="auto">
                              <Avatar src={consultant.avatar} alt={consultant.name} sx={{ width: 110, height: 110, border: '4px solid #3b82f6' }} />
                           </Grid>
                           <Grid item xs={12} sm>
                              <Stack spacing={1}>
                                 <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 700 }}>{consultantByID.fullname}</Typography>
                                    <VerifiedIcon sx={{ color: '#10b981' }} />
                                 </Stack>
                                 <Typography variant="body2" sx={{ color: '#94a3b8' }}>{consultantByID.profession}</Typography>
                                 <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {consultantByID?.language?.map((l) => (
                                       <Chip key={l} label={l} size="small" sx={{ bgcolor: 'rgba(148,163,184,0.12)', color: '#cbd5e1' }} />
                                    ))}
                                 </Stack>

                                 <Stack direction="row" spacing={2} alignItems="center">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                       <Rating value={consultant?.rating} precision={0.01} readOnly size="small" />
                                       <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{consultant.rating.toFixed(2)}</Typography>
                                       <Typography variant="caption" sx={{ color: '#94a3b8' }}>({consultant.reviews.toLocaleString()} reviews)</Typography>
                                    </Stack>

                                    <Divider flexItem orientation="vertical" sx={{ borderColor: 'rgba(148,163,184,0.15)' }} />
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                       <PeopleIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                       <Typography variant="body2" sx={{ color: '#94a3b8' }}>{consultant.calls.toLocaleString()} calls</Typography>
                                    </Stack>
                                    <Divider flexItem orientation="vertical" sx={{ borderColor: 'rgba(148,163,184,0.15)' }} />
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                       <AccessTimeIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                       <Typography variant="body2" sx={{ color: '#94a3b8' }}>{consultantByID.experience}+ yrs</Typography>
                                    </Stack>
                                 </Stack>
                              </Stack>
                           </Grid>
                           <Grid item xs={12} sm="auto">
                              <Stack direction="row" spacing={1}>
                                 <IconButton onClick={() => setIsFav((p) => !p)} sx={{ color: isFav ? '#ef4444' : '#94a3b8' }}><FavoriteIcon /></IconButton>
                                 <IconButton sx={{ color: '#94a3b8' }}><ShareIcon /></IconButton>
                                 <IconButton sx={{ color: '#94a3b8' }}><MoreVertIcon /></IconButton>
                              </Stack>
                           </Grid>
                        </Grid>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
                           <Button onClick={() => navigate('/chat-web')} fullWidth  startIcon={<HeadsetMicIcon />} variant="contained" sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              textTransform: 'none', fontWeight: 700, borderRadius: 2
                           }}>Coming Soon</Button>
                           <Button fullWidth startIcon={<CallIcon />} variant="outlined" onClick={startVoiceCall} sx={{
                              borderColor: 'rgba(148,163,184,0.35)', color: '#e5e7eb', textTransform: 'none', fontWeight: 700, borderRadius: 2,
                              '&:hover': { borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)' }
                           }}>Voice Call</Button>
                           <Button fullWidth startIcon={<VideocamIcon />} variant="outlined" onClick={startVideoCall} sx={{
                              borderColor: 'rgba(148,163,184,0.35)', color: '#e5e7eb', textTransform: 'none', fontWeight: 700, borderRadius: 2,
                              '&:hover': { borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)' }
                           }}>Video Call</Button>
                        </Stack>
                     </CardContent>
                  </Card>

                  <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 3 }}>
                     <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 1.5 }}>About me</Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>{consultantByID.bio || consultant.bio}</Typography>
                     </CardContent>
                  </Card>

                  <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 3 }}>
                     <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>Rating & Reviews</Typography>
                        <Grid container spacing={3} alignItems="center">
                           <Grid item xs={12} sm={5} md={4}>
                              <Stack alignItems="center" spacing={0.5}>
                                 <Typography variant="h3" sx={{ color: '#f8fafc', fontWeight: 800 }}>{consultant?.rating.toFixed(2)}</Typography>
                                 <Rating value={consultant.rating} precision={0.01} readOnly />
                                 <Typography variant="caption" sx={{ color: '#94a3b8' }}>{consultant.reviews.toLocaleString()} total</Typography>
                              </Stack>
                           </Grid>
                           <Grid item xs={12} sm={7} md={8}>
                              <Stack spacing={1.2}>
                                 <StatRow label="5" value={72} />
                                 <StatRow label="4" value={18} color="#3b82f6" />
                                 <StatRow label="3" value={6} color="#f59e0b" />
                                 <StatRow label="2" value={3} color="#ef4444" />
                                 <StatRow label="1" value={1} color="#7f1d1d" />
                              </Stack>
                           </Grid>
                        </Grid>

                        <Divider sx={{ my: 2, borderColor: 'rgba(148,163,184,0.12)' }} />

                        <Stack spacing={2}>
                           {['Archita', 'Sujata', 'Aniket'].map((n, i) => (
                              <Card key={i} sx={{ background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', border: '1px solid rgba(148,163,184,0.12)' }}>
                                 <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                       <Typography variant="subtitle2" sx={{ color: '#e5e7eb', fontWeight: 600 }}>{n}</Typography>
                                       <Rating value={5} readOnly size="small" />
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1.0 }}>
                                       Amazing guidance and clear remedies. Highly recommended.
                                    </Typography>
                                 </CardContent>
                              </Card>
                           ))}
                        </Stack>
                     </CardContent>
                  </Card>
               </Grid>

               <Grid item xs={12} md={4}>
                  {/* <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 3 }}>
                     <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 1.5 }}>Check Similar Consultants</Typography>
                        <List>
                           {consultant.similar.map((s, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                 <ListItemAvatar>
                                    <Avatar src={`https://i.pravatar.cc/100?img=${idx + 10}`} />
                                 </ListItemAvatar>
                                 <ListItemText
                                    primary={
                                       <Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 600 }}>{s.name}</Typography>
                                    }
                                    secondary={
                                       <Stack direction="row" spacing={1} alignItems="center">
                                          <Rating value={s.rating} readOnly size="small" />
                                          <Button size="small" variant="text" sx={{ color: '#10b981', textTransform: 'none' }}>View</Button>
                                       </Stack>
                                    }
                                 />
                              </ListItem>
                           ))}
                        </List>
                     </CardContent>
                  </Card> */}

                  <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 3 }}>
                     <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack spacing={1.5}>
                           <Button startIcon={<CallIcon />} variant="contained" sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>Quick Voice Call</Button>
                           <Button startIcon={<VideocamIcon />} variant="outlined" sx={{ borderColor: 'rgba(148,163,184,0.35)', color: '#e5e7eb', textTransform: 'none', fontWeight: 700, borderRadius: 2, '&:hover': { borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)' } }}>Quick Video Call</Button>
                           <Button startIcon={<MessageIcon />} variant="outlined" sx={{ borderColor: 'rgba(148,163,184,0.35)', color: '#e5e7eb', textTransform: 'none', fontWeight: 700, borderRadius: 2, '&:hover': { borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.08)' } }}>Ask on Chat</Button>
                        </Stack>
                     </CardContent>
                  </Card>
               </Grid>
            </Grid>
         </Box>
      </div>
   )
}

export default ConsultantMajorDetails;