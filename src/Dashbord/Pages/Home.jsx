import React, { useState, useEffect, useRef } from 'react'

function Home() {
  // State management
  const [channelName, setChannelName] = useState('test-channel')
  const [uid, setUid] = useState(1001)
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true)
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true)
  const [remoteUsers, setRemoteUsers] = useState([])
  const [localVideoLoaded, setLocalVideoLoaded] = useState(false)
  
  // Refs
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
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
          
          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack
            console.log("📹 Playing remote video for user:", user.uid)
            remoteVideoTrack.play(remoteVideoRef.current)
            setRemoteUsers(prev => [...prev, { uid: user.uid, videoTrack: remoteVideoTrack }])
            showStatus(`Remote video from user ${user.uid} is now playing`, 'success')
          }
          
          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack
            console.log("🔊 Playing remote audio for user:", user.uid)
            remoteAudioTrack.play()
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
      
      // Create local tracks
      try {
        console.log("🎥 Requesting camera and microphone access...")
        localTracksRef.current = await window.AgoraRTC.createMicrophoneAndCameraTracks()
        console.log("✅ Local tracks created successfully")
      } catch (trackError) {
        console.error("❌ Error creating tracks:", trackError)
        
        if (trackError.message.includes("Device in use")) {
          showStatus("Camera/Microphone is being used by another tab. Please close other tabs or use different browser.", 'error')
          throw new Error("Device in use: Please close other browser tabs using camera/microphone or try a different browser.")
        } else if (trackError.message.includes("Starting videoinput failed") || trackError.message.includes("AbortError")) {
          showStatus("Camera access failed. Please check camera permissions and try again.", 'error')
          throw new Error("Camera access failed: Please allow camera permissions and make sure no other app is using the camera.")
        } else if (trackError.message.includes("NotAllowedError")) {
          showStatus("Camera/Microphone permission denied. Please allow permissions and try again.", 'error')
          throw new Error("Permission denied: Please allow camera and microphone permissions in your browser.")
        } else if (trackError.message.includes("NotFoundError")) {
          showStatus("No camera/microphone found. Please check your devices.", 'error')
          throw new Error("No devices found: Please check if camera and microphone are connected.")
        }
        throw trackError
      }
      
      // Play local video in thumbnail
      if (localVideoRef.current && localTracksRef.current[1]) {
        try {
          localTracksRef.current[1].play(localVideoRef.current)
          console.log("✅ Local video playing in thumbnail")
          setLocalVideoLoaded(true)
          
          // Additional debugging
          setTimeout(() => {
            if (localVideoRef.current) {
              console.log("Local video element:", localVideoRef.current)
              console.log("Video srcObject:", localVideoRef.current.srcObject)
              console.log("Video readyState:", localVideoRef.current.readyState)
            }
          }, 1000)
        } catch (error) {
          console.error("Error playing local video:", error)
        }
      }
      
      // Join channel
      console.log(`🚀 Joining channel: ${channelName} with UID: ${uid}`)
      await clientRef.current.join(tokenData.appId, channelName, tokenData.token, uid)
      console.log(`✅ Successfully joined channel: ${channelName}`)
      
      // Publish local tracks
      console.log("📤 Publishing local tracks...")
      await clientRef.current.publish(localTracksRef.current)
      console.log("✅ Local tracks published successfully")
      
      setIsJoined(true)
      showStatus(`Successfully joined channel: ${channelName} with UID: ${uid}`, 'success')
      
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
      setLocalVideoLoaded(false)
      showStatus('Left channel successfully', 'success')
      console.log('✅ Channel cleanup completed')
      
    } catch (error) {
      console.error('Error leaving channel:', error)
      showStatus(`Error leaving channel: ${error.message}`, 'error')
      
      // Force reset state
      setIsJoined(false)
      setRemoteUsers([])
      setLocalVideoLoaded(false)
      clientRef.current = null
      localTracksRef.current = []
    }
  }

  // Toggle local video
  const toggleLocalVideo = () => {
    if (localTracksRef.current && localTracksRef.current[1]) {
      localTracksRef.current[1].setEnabled(!localVideoEnabled)
      setLocalVideoEnabled(!localVideoEnabled)
      showStatus(`Local video ${!localVideoEnabled ? 'enabled' : 'disabled'}`, 'info')
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

  // Release all devices
  const releaseAllDevices = async () => {
    try {
      showStatus('Releasing all devices...', 'info')
      
      // Stop all tracks
      if (localTracksRef.current && localTracksRef.current.length > 0) {
        for (let track of localTracksRef.current) {
          if (track) {
            try {
              if (track.stop) track.stop()
              if (track.close) track.close()
              if (track.destroy) track.destroy()
            } catch (e) {
              console.log('⚠️ Error cleaning track:', e)
            }
          }
        }
        localTracksRef.current = []
      }
      
      // Leave channel if joined
      if (clientRef.current && isJoined) {
        try {
          await clientRef.current.leave()
        } catch (e) {
          console.log('⚠️ Error leaving channel:', e)
        }
      }
      
      // Clean up client
      if (clientRef.current) {
        try {
          clientRef.current.removeAllListeners()
        } catch (e) {
          console.log('⚠️ Error removing listeners:', e)
        }
        clientRef.current = null
      }
      
      // Reset state
      setIsJoined(false)
      setRemoteUsers([])
      
      showStatus('All devices released successfully!', 'success')
      
    } catch (error) {
      console.error('Error releasing devices:', error)
      showStatus(`Error releasing devices: ${error.message}`, 'error')
    }
  }

  return (
    <div className="min-h-[100vh] bg-gray-100">
      {/* Pre-join Setup */}
      {!isJoined && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎥</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Join Video Call
              </h1>
              <p className="text-gray-600">Enter your details to start the meeting</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter channel name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="number"
                  value={uid}
                  onChange={(e) => setUid(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter user ID"
                />
              </div>
            </div>

            <button
              onClick={joinChannel}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Joining...
                </>
              ) : (
                <>
                  <span>📞</span>
                  Join Meeting
                </>
              )}
            </button>

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

      {/* Main Meeting Interface */}
      {isJoined && (
        <div className="h-screen flex flex-col bg-gray-900">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={leaveChannel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">Video Call Meeting</h1>
                <p className="text-sm text-gray-500">Channel: {channelName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
          <div className="flex-1 flex  relative">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col h-">
              {/* Main Video Feed */}
              <div className="flex-1 bg-gray-800 relative h-[50vh]">
                <video
                  ref={remoteVideoRef}
                  className="h-[90vh] w-full object-cover"
                  autoPlay
                  playsInline
                />
                {remoteUsers.length === 0 && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium mb-2">Waiting for participants...</h3>
                      <p className="text-gray-400">Share the channel name with others to join</p>
                    </div>
                  </div>
                )}
                
                {/* Video Controls Overlay */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  {remoteUsers.map((user, index) => (
                    <div key={user.uid} className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      User {user.uid}
                    </div>
                  ))}
                </div>
              </div>

              {/* Participant Thumbnails */}
              <div className="bg-gray-800 p-4 absolute  ">
                <div className="flex space-x-4 justify-center">
                  {/* Local Video Thumbnail */}
                  <div className="relative w-32 h-24 bg-gray-700 rounded-lg overflow-hidden ">
                    <video
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                      style={{ backgroundColor: '#374151' }}
                    />
                    {!localVideoEnabled && (
                      <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
                        </svg>
                      </div>
                    )}
                    {/* Fallback when video is not loaded */}
                    {localVideoEnabled && !localVideoLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-1">
                            <span className="text-sm font-bold">You</span>
                          </div>
                          <div className="text-xs">Loading...</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      You
                    </div>
                    <div className="absolute top-1 right-1">
                      <button
                        onClick={toggleLocalVideo}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          localVideoEnabled ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Remote User Thumbnails */}
                  {remoteUsers.map((user, index) => (
                    <div key={user.uid} className="relative w-32 h-24 bg-gray-700 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">U{user.uid}</span>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        User {user.uid}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={toggleLocalAudio}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      localAudioEnabled 
                        ? 'bg-gray-200 hover:bg-gray-300' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${localAudioEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  </button>

                  <button
                    onClick={toggleLocalVideo}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      localVideoEnabled 
                        ? 'bg-gray-200 hover:bg-gray-300' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${localVideoEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </button>

                  <button className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                    </svg>
                  </button>

                  <button
                    onClick={leaveChannel}
                    className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              {/* Participants Tab */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Participants</h3>
                <p className="text-sm text-gray-500">{remoteUsers.length + 1} participant(s)</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {/* Local User */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">You</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">You (UID: {uid})</p>
                      <p className="text-xs text-gray-500">Host</p>
                    </div>
                    <div className="flex space-x-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        localAudioEnabled ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <svg className={`w-3 h-3 ${localAudioEnabled ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        </svg>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        localVideoEnabled ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <svg className={`w-3 h-3 ${localVideoEnabled ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Remote Users */}
                  {remoteUsers.map((user, index) => (
                    <div key={user.uid} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">U{user.uid}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">User {user.uid}</p>
                        <p className="text-xs text-gray-500">Participant</p>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                          </svg>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Section */}
              <div className="border-t border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Chat</h3>
                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                  <div className="text-xs text-gray-500 text-center py-2">
                    Chat feature coming soon...
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  />
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home