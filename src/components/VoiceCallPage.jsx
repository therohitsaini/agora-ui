import React, { useEffect, useMemo, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

function VoiceCallPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const channelName = searchParams.get('channel') || ''
  const consultantId = searchParams.get('consultantId') || ''
  
  // Use a numeric Agora RTC UID. If URL uid is not numeric, generate one per session.
  const uid = useMemo(() => {
    const urlUid = Number(searchParams.get('uid'))
    if (Number.isInteger(urlUid) && urlUid > 0) return urlUid
    const stored = sessionStorage.getItem('agora-rtc-uid')
    if (stored && Number(stored) > 0) return Number(stored)
    const generated = Math.floor(100000 + Math.random() * 900000)
    sessionStorage.setItem('agora-rtc-uid', String(generated))
    return generated
  }, [searchParams])

  const clientRef = useRef(null)
  const localTracksRef = useRef([])
  const remoteUsersRef = useRef(new Map())
  const handlersRef = useRef({})
  const socketRef = useRef(null)

  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  const tokenUrl = useMemo(() => {
    const base = import.meta.env.VITE_BACK_END_URL || 'http://localhost:3001'
    return `${base}/api/video-call/generate-voice-token`
  }, [])

  function extractJwtFromObject(obj) {
    if (!obj || typeof obj !== 'object') return ''
    // common fields
    if (typeof obj.token === 'string') return obj.token
    if (typeof obj.accessToken === 'string') return obj.accessToken
    if (typeof obj.jwt === 'string') return obj.jwt
    if (obj.user && typeof obj.user.token === 'string') return obj.user.token
    return ''
  }

  function scanLocalStorageForJwt() {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      const val = localStorage.getItem(key) || ''
      if (jwtRegex.test(val)) return val
      try {
        const parsed = JSON.parse(val)
        const candidate = extractJwtFromObject(parsed)
        if (candidate && jwtRegex.test(candidate)) return candidate
      } catch {}
    }
    return ''
  }

  function getAuthToken() {
    // Try known storage keys first
    const rawAccessUser = localStorage.getItem('access_user')
    if (rawAccessUser) {
      try {
        const parsed = JSON.parse(rawAccessUser)
        const t = extractJwtFromObject(parsed)
        if (t) return t
      } catch {}
    }
    const direct = (
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      ''
    )
    if (direct) return direct
    // Fallback: scan all keys for a JWT-like string
    return scanLocalStorageForJwt()
  }

  async function fetchToken() {
    const bearer = getAuthToken()
    const res = await fetch(tokenUrl, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
      body: JSON.stringify({ channelName, uid })
    })
    if (res.status === 401) {
      throw new Error('Unauthorized (401): missing/invalid token')
    }
    if (!res.ok) throw new Error(`Token API ${res.status}`)
    return res.json()
  }

  async function ensurePermissions() {
    // Prompt for permissions early to surface browser UI
    if (!navigator.mediaDevices?.getUserMedia) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Close temporary stream tracks
      stream.getTracks().forEach(t => t.stop())
    } catch (e) {
      console.error('Permission denied:', e)
      throw new Error('Please allow microphone permissions')
    }
  }

  async function join() {
    if (!channelName || !uid) return
    setIsJoining(true)
    try {
      const { appId, token } = await fetchToken()
      await ensurePermissions()
      const RTC = AgoraRTC
      if (!RTC) {
        console.error('AgoraRTC not loaded. Ensure agora-rtc-sdk-ng is installed or included via script tag.')
        throw new Error('Agora SDK missing')
      }

      const client = RTC.createClient({ mode: 'rtc', codec: 'vp8' })
      clientRef.current = client

      const onUserPublished = async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        if (mediaType === 'audio') {
          user.audioTrack?.play()
        }
        remoteUsersRef.current.set(user.uid, user)
      }
      const onUserUnpublished = (user) => {
        try { user.audioTrack?.stop() } catch {}
        remoteUsersRef.current.delete(user.uid)
      }
      const onUserLeft = (user) => {
        try { user.audioTrack?.stop() } catch {}
        remoteUsersRef.current.delete(user.uid)
      }
      handlersRef.current = { onUserPublished, onUserUnpublished, onUserLeft }
      client.on('user-published', onUserPublished)
      client.on('user-unpublished', onUserUnpublished)
      client.on('user-left', onUserLeft)

      await client.join(appId, channelName, token, uid)

      // Create microphone track for voice call
      const micTrack = await RTC.createMicrophoneAudioTrack({ 
        echoCancellation: true, 
        noiseSuppression: true, 
        autoGainControl: true 
      })
      localTracksRef.current = [micTrack]
      await client.publish([micTrack])
      setMicOn(true)

      setIsJoined(true)
      // Autoplay policy: resume on first user interaction if audio was blocked
      const tryResume = () => {
        client.resume?.().catch(() => { })
        document.removeEventListener('click', tryResume)
        document.removeEventListener('touchstart', tryResume)
      }
      document.addEventListener('click', tryResume)
      document.addEventListener('touchstart', tryResume)
    } catch (e) {
      console.error('join error', e)
    } finally {
      setIsJoining(false)
    }
  }

  async function teardown(noNavigate = false) {
    try {
      const client = clientRef.current
      // Unpublish local tracks so peers stop receiving
      if (client && localTracksRef.current.length) {
        try { await client.unpublish(localTracksRef.current.filter(Boolean)) } catch {}
      }
      // Stop and close local tracks
      for (const t of localTracksRef.current) {
        try { t.stop && t.stop() } catch {}
        try { t.close && t.close() } catch {}
      }
      localTracksRef.current = []

      // Stop remote audio
      remoteUsersRef.current.forEach((user) => {
        try { user.audioTrack?.stop() } catch {}
      })
      remoteUsersRef.current.clear()

      // Detach event listeners
      if (client && handlersRef.current) {
        const { onUserPublished, onUserUnpublished, onUserLeft } = handlersRef.current
        try { client.off('user-published', onUserPublished) } catch {}
        try { client.off('user-unpublished', onUserUnpublished) } catch {}
        try { client.off('user-left', onUserLeft) } catch {}
        try { client.removeAllListeners && client.removeAllListeners() } catch {}
      }

      // Leave channel last
      if (client) {
        try { await client.leave() } catch {}
        clientRef.current = null
      }
    } finally {
      setIsJoined(false)
      if (!noNavigate) navigate(-1)
    }
  }

  async function leave() {
    try {
      const s = socketRef.current
      const fromUid = localStorage.getItem('user-ID')
      if (s && fromUid) {
        s.emit('call-ended', { toUid: consultantId || undefined, fromUid, channelName })
      }
    } catch {}
    await teardown(false)
  }

  async function toggleMic() {
    const mic = localTracksRef.current[0]
    if (mic) {
      await mic.setEnabled(!micOn)
      setMicOn(!micOn)
    }
  }

  // Call duration timer
  useEffect(() => {
    if (!isJoined) return
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isJoined])

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    // Setup socket to coordinate hangups
    const backendUrl = import.meta.env.VITE_BACK_END_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
    const s = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      withCredentials: true,
    })
    socketRef.current = s
    const me = localStorage.getItem('user-ID')
    if (me) s.emit('register', me)
    s.on('call-ended', async () => {
      await teardown(false)
    })

    // small delay so everything mounts
    const t = setTimeout(() => { join() }, 300)
    // On unmount, clean up media but DO NOT navigate automatically
    return () => { clearTimeout(t); try { s.disconnect() } catch {}; teardown(true) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-black/20 backdrop-blur-sm">
        <div className="text-white font-semibold text-lg">Voice Call</div>
        <div className="text-white/70 text-sm">{channelName}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Call Status */}
        <div className="text-center mb-8">
          {isJoining && (
            <div className="text-white/70 text-lg">Connecting...</div>
          )}
          {isJoined && (
            <div className="text-white text-2xl font-semibold mb-2">
              Call Connected
            </div>
          )}
          {isJoined && (
            <div className="text-white/70 text-lg">
              Duration: {formatDuration(callDuration)}
            </div>
          )}
        </div>

        {/* Voice Call Visual */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
          
          {/* Animated rings for voice call effect */}
          {isJoined && (
            <>
              <div className="absolute inset-0 w-32 h-32 border-2 border-white/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
            </>
          )}
        </div>

        {/* Call Info */}
        <div className="text-center text-white/70 mb-8">
          <div className="text-lg">Consultant ID: {consultantId}</div>
          <div className="text-sm">Channel: {channelName}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="py-6 flex items-center justify-center gap-6 bg-black/20 backdrop-blur-sm">
        <button 
          onClick={toggleMic} 
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            micOn 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white shadow-lg`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            {micOn ? (
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            ) : (
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
            )}
          </svg>
        </button>
        
        <button 
          onClick={leave} 
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default VoiceCallPage
