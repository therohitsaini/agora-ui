import React, { useState, useEffect, useRef } from 'react'

function VoiceCall({ channelName, uid, onBack }) {
  // State management
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true)
  const [remoteUsers, setRemoteUsers] = useState([])
  
  // Refs
  const clientRef = useRef(null)
  const localTracksRef = useRef([])

  // Initialize Agora SDK
  useEffect(() => {
    const initAgora = async () => {
      try {
        // Load Agora SDK dynamically
        if (!window.AgoraRTC) {
          const script = document.createElement('script')
          script.src = 'https://download.agora.io/sdk/release/AgoraRTC_N-4.20.0.js'
          script.onload = () => {
            console.log('Agora SDK loaded successfully')
            showStatus('Agora SDK loaded successfully', 'success')
          }
          document.head.appendChild(script)
        }
      } catch (error) {
        console.error('Error loading Agora SDK:', error)
        showStatus('Error loading Agora SDK', 'error')
      }
    }

    initAgora()
  }, [])

  // Show status message
  const showStatus = (message, type) => {
    setStatus({ message, type })
    setTimeout(() => {
      setStatus({ message: '', type: '' })
    }, 5000)
  }

  // Get token from server
  const getToken = async (channelName, uid) => {
    try {
      showStatus('Connecting to server...', 'info')
      
      const response = await fetch(`https://sainiweb-agora-backend.onrender.com/api/video-call/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName: channelName,
          uid: uid
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      const data = await response.json()
      return data
      
    } catch (error) {
      console.error('Error getting token:', error)
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure server is running on port 3001')
      }
      
      throw error
    }
  }

  // Join channel
  const joinChannel = async () => {
    if (!channelName || !uid) {
      showStatus('Please enter channel name and user ID', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      showStatus('Getting token...', 'info')
      
      // Get token from server
      const tokenData = await getToken(channelName, uid)
      showStatus('Token received, joining channel...', 'info')
      
      // Initialize Agora client
      if (!clientRef.current) {
        clientRef.current = window.AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
        
        // Handle user joined
        clientRef.current.on("user-published", async (user, mediaType) => {
          console.log("🔔 User published event received:", user.uid, "Media type:", mediaType)
          showStatus(`Remote user ${user.uid} joined with ${mediaType}`, 'info')
          
          await clientRef.current.subscribe(user, mediaType)
          console.log("✅ Successfully subscribed to user:", user.uid)
          
          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack
            console.log("🔊 Playing remote audio for user:", user.uid)
            remoteAudioTrack.play()
            setRemoteUsers(prev => [...prev, { uid: user.uid, audioTrack: remoteAudioTrack }])
            showStatus(`Remote audio from user ${user.uid} is now playing`, 'success')
          }
        })
        
        // Handle user left
        clientRef.current.on("user-unpublished", (user) => {
          console.log("👋 User unpublished:", user.uid)
          showStatus(`User ${user.uid} left the channel`, 'info')
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
        })
        
        // Handle user joined channel
        clientRef.current.on("user-joined", (user) => {
          console.log("🎉 User joined channel:", user.uid)
          showStatus(`User ${user.uid} joined the channel`, 'info')
        })
        
        // Handle user left channel
        clientRef.current.on("user-left", (user) => {
          console.log("🚪 User left channel:", user.uid)
          showStatus(`User ${user.uid} left the channel`, 'info')
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
        })
      }
      
      // Create local audio track only
      try {
        console.log("🎤 Requesting microphone access...")
        const localAudioTrack = await window.AgoraRTC.createMicrophoneAudioTrack()
        localTracksRef.current = [localAudioTrack]
        console.log("✅ Local audio track created successfully")
      } catch (trackError) {
        console.error("❌ Error creating audio track:", trackError)
        
        if (trackError.message.includes("Device in use")) {
          showStatus("Microphone is being used by another tab. Please close other tabs or use different browser.", 'error')
          throw new Error("Device in use: Please close other browser tabs using microphone or try a different browser.")
        } else if (trackError.message.includes("NotAllowedError")) {
          showStatus("Microphone permission denied. Please allow permissions and try again.", 'error')
          throw new Error("Permission denied: Please allow microphone permissions in your browser.")
        } else if (trackError.message.includes("NotFoundError")) {
          showStatus("No microphone found. Please check your device.", 'error')
          throw new Error("No microphone found: Please check if microphone is connected.")
        }
        throw trackError
      }
      
      // Join channel
      console.log(`🚀 Joining channel: ${channelName} with UID: ${uid}`)
      await clientRef.current.join(tokenData.appId, channelName, tokenData.token, uid)
      console.log(`✅ Successfully joined channel: ${channelName}`)
      
      // Publish local audio track
      console.log("📤 Publishing local audio track...")
      await clientRef.current.publish(localTracksRef.current)
      console.log("✅ Local audio track published successfully")
      
      setIsJoined(true)
      showStatus(`Successfully joined voice call: ${channelName} with UID: ${uid}`, 'success')
      
    } catch (error) {
      console.error('Error joining channel:', error)
      showStatus(`Error: ${error.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Leave channel
  const leaveChannel = async () => {
    try {
      showStatus('Leaving channel...', 'info')
      console.log('🚪 Leaving channel and cleaning up...')
      
      // Stop and cleanup local tracks
      if (localTracksRef.current && localTracksRef.current.length > 0) {
        console.log('🛑 Stopping local tracks...')
        for (let track of localTracksRef.current) {
          if (track) {
            try {
              if (track.stop) track.stop()
              if (track.close) track.close()
              if (track.destroy) track.destroy()
              console.log('✅ Track cleaned up')
            } catch (trackError) {
              console.log('⚠️ Error cleaning up track:', trackError)
            }
          }
        }
        localTracksRef.current = []
      }
      
      // Leave channel
      if (clientRef.current && isJoined) {
        console.log('🚪 Leaving Agora channel...')
        try {
          await clientRef.current.leave()
          console.log('✅ Left Agora channel successfully')
        } catch (leaveError) {
          console.log('⚠️ Error leaving channel:', leaveError)
        }
      }
      
      // Clean up client
      if (clientRef.current) {
        try {
          clientRef.current.removeAllListeners()
          console.log('✅ Removed all event listeners')
        } catch (cleanupError) {
          console.log('⚠️ Error cleaning up client:', cleanupError)
        }
        clientRef.current = null
      }
      
      // Reset state
      setIsJoined(false)
      setRemoteUsers([])
      showStatus('Left channel successfully', 'success')
      console.log('✅ Channel cleanup completed')
      
    } catch (error) {
      console.error('Error leaving channel:', error)
      showStatus(`Error leaving channel: ${error.message}`, 'error')
      
      // Force reset state
      setIsJoined(false)
      setRemoteUsers([])
      clientRef.current = null
      localTracksRef.current = []
    }
  }

  // Toggle local audio
  const toggleLocalAudio = () => {
    if (localTracksRef.current && localTracksRef.current[0]) {
      localTracksRef.current[0].setEnabled(!localAudioEnabled)
      setLocalAudioEnabled(!localAudioEnabled)
      showStatus(`Local audio ${!localAudioEnabled ? 'enabled' : 'disabled'}`, 'info')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Pre-join Setup */}
      {!isJoined && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎤</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Join Voice Call
              </h1>
              <p className="text-gray-600">Audio only - No video required</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channelName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="number"
                  value={uid}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={joinChannel}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <span>🎤</span>
                    Join Voice Call
                  </>
                )}
              </button>

              <button
                onClick={onBack}
                className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>←</span>
                Back to Selection
              </button>
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                status.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {status.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voice Call Interface */}
      {isJoined && (
        <div className="h-screen flex flex-col bg-gray-900">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">Voice Call</h1>
                <p className="text-sm text-gray-500">Channel: {channelName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Live
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
            {/* Voice Call Visual */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-5xl">🎤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Call Active</h2>
              <p className="text-gray-600">You are connected to the voice channel</p>
            </div>

            {/* Participants List */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Participants</h3>
              <div className="space-y-3">
                {/* Local User */}
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">You</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">You (UID: {uid})</p>
                    <p className="text-xs text-gray-500">Host</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    localAudioEnabled ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <svg className={`w-3 h-3 ${localAudioEnabled ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    </svg>
                  </div>
                </div>

                {/* Remote Users */}
                {remoteUsers.map((user, index) => (
                  <div key={user.uid} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">U{user.uid}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">User {user.uid}</p>
                      <p className="text-xs text-gray-500">Participant</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      </svg>
                    </div>
                  </div>
                ))}

                {remoteUsers.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Waiting for other participants...</p>
                    <p className="text-xs mt-1">Share the channel name to invite others</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLocalAudio}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                  localAudioEnabled 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>

              <button
                onClick={leaveChannel}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg"
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                </svg>
              </button>
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`mt-6 p-3 rounded-lg text-sm max-w-md ${
                status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                status.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {status.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VoiceCall
