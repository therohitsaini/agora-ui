import React, { useEffect, useMemo, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

function CallPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const callType = searchParams.get('type') || 'video'
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
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const handlersRef = useRef({})
  const socketRef = useRef(null)

  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  const tokenUrl = useMemo(() => {
    const base = import.meta.env.VITE_BACK_END_URL || 'http://localhost:3001'
    return callType === 'voice' ? `${base}/api/video-call/generate-voice-token` : `${base}/api/video-call/generate-token`
  }, [callType])

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: callType === 'video' })
      // Close temporary stream tracks
      stream.getTracks().forEach(t => t.stop())
    } catch (e) {
      console.error('Permission denied:', e)
      throw new Error('Please allow microphone/camera permissions')
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
        if (mediaType === 'video') {
          user.videoTrack?.play(remoteVideoRef.current)
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play()
        }
        remoteUsersRef.current.set(user.uid, user)
      }
      const onUserUnpublished = (user) => {
        // stop any playing tracks
        try { user.videoTrack?.stop() } catch {}
        try { user.audioTrack?.stop() } catch {}
        remoteUsersRef.current.delete(user.uid)
      }
      const onUserLeft = (user) => {
        try { user.videoTrack?.stop() } catch {}
        try { user.audioTrack?.stop() } catch {}
        remoteUsersRef.current.delete(user.uid)
      }
      handlersRef.current = { onUserPublished, onUserUnpublished, onUserLeft }
      client.on('user-published', onUserPublished)
      client.on('user-unpublished', onUserUnpublished)
      client.on('user-left', onUserLeft)

      await client.join(appId, channelName, token, uid)

      if (callType === 'video') {
        const [micTrack, camTrack] = await RTC.createMicrophoneAndCameraTracks(
          { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          { encoderConfig: '720p_1', facingMode: 'user' }
        )
        localTracksRef.current = [micTrack, camTrack]
        camTrack.play(localVideoRef.current)
        await client.publish([micTrack, camTrack])
        setMicOn(true)
        setCamOn(true)
      } else {
        const micTrack = await RTC.createMicrophoneAudioTrack({ echoCancellation: true, noiseSuppression: true, autoGainControl: true })
        localTracksRef.current = [micTrack]
        await client.publish([micTrack])
        setMicOn(true)
      }

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
      // Unpublish local tracks first so peers stop receiving
      if (client && localTracksRef.current.length) {
        try { await client.unpublish(localTracksRef.current.filter(Boolean)) } catch {}
      }
      // Stop and close local tracks
      for (const t of localTracksRef.current) {
        try { t.stop && t.stop() } catch {}
        try { t.close && t.close() } catch {}
      }
      localTracksRef.current = []

      // Stop all remote tracks currently playing
      remoteUsersRef.current.forEach((user) => {
        try { user.videoTrack?.stop() } catch {}
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

      // Clear DOM video elements
      if (remoteVideoRef.current) {
        try { remoteVideoRef.current.srcObject = null } catch {}
        try { remoteVideoRef.current.innerHTML = '' } catch {}
      }
      if (localVideoRef.current) {
        try { localVideoRef.current.srcObject = null } catch {}
        try { localVideoRef.current.innerHTML = '' } catch {}
      }

      // Finally leave the channel
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

  async function toggleCam() {
    if (callType !== 'video') return
    const cam = localTracksRef.current[1]
    if (cam) {
      await cam.setEnabled(!camOn)
      setCamOn(!camOn)
    }
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

    // small delay so video elements mount
    const t = setTimeout(() => { join() }, 300)
    // On unmount, clean up media but DO NOT navigate automatically
    return () => { clearTimeout(t); try { s.disconnect() } catch {}; teardown(true) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // no-op: kept for parity if future side-effects are needed
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between bg-neutral-900">
        <div className="text-white font-semibold">{callType === 'video' ? 'Video Call' : 'Voice Call'}</div>
        <div className="text-neutral-400 text-sm">{channelName}</div>
      </div>

      <div className="flex-1 grid grid-cols-1">
        {
          callType === 'video' ? (
            <div className="relative">
              <video ref={remoteVideoRef} className="w-full h-[70vh] object-cover bg-neutral-800" autoPlay playsInline />
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-neutral-700 rounded overflow-hidden">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[70vh]">
              <div className="text-neutral-300">Voice call connected...</div>
            </div>
          )}
      </div>

      <div className="py-4 flex items-center justify-center gap-4 bg-neutral-900">
        <button onClick={toggleMic} className={`px-4 py-2 rounded ${micOn ? 'bg-neutral-700' : 'bg-red-600'} text-white`}>{micOn ? 'Mic On' : 'Mic Off'}</button>
        {callType === 'video' && (
          <button onClick={toggleCam} className={`px-4 py-2 rounded ${camOn ? 'bg-neutral-700' : 'bg-red-600'} text-white`}>{camOn ? 'Cam On' : 'Cam Off'}</button>
        )}
        <button onClick={leave} className="px-4 py-2 rounded bg-red-600 text-white">End</button>
      </div>
    </div>
  )
}

export default CallPage
