import React, { useEffect, useRef, useState } from "react";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";
import { IoCallOutline } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { io } from "socket.io-client";
import CallAlert from "./CallAlert";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CallApp() {
  const [socket, setSocket] = useState(null);
  const [callType, setCallType] = useState(null);
  const [channelName, setChannelName] = useState("test-channel");
  const [uid, setUid] = useState("");
  const [user, setUser] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true)
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true)
  const [remoteUsers, setRemoteUsers] = useState([])
  const [localVideoLoaded, setLocalVideoLoaded] = useState(false)
  const [joined, setJoined] = useState(false)



  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const clientRef = useRef(null)
  const localTracksRef = useRef([])

  const navigator = useNavigate();



  const myUserId = localStorage.getItem("user-ID");


  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:3001';
    const s = io(backendUrl);
    setSocket(s);
    s.emit('register', myUserId);
    s.on('incoming-call', (callData) => {
      console.log('📞 Incoming call:', callData);
      setIncomingCall(callData);
    });

    s.on('call-accepted', (callData) => {
      console.log('✅ Call accepted:', callData);


      const receiverUser = user.find(u => u._id === callData.fromUid);
      const receiverAgoraUid = receiverUser?.agoraUid || callData.fromUid;

      setUid(receiverAgoraUid);
      setCallType(callData.type);
      setChannelName(callData.channelName);
      setIsInCall(true);
      setIncomingCall(null);

      console.log('✅ Setting agoraUid for call:', receiverAgoraUid);
      console.log('✅ Call screen should open now!');
    });

    s.on('call-rejected', (callData) => {
      console.log('❌ Call rejected:', callData);
      setIncomingCall(null);
      alert('Call rejected');
    });

    s.on('call-ended', (callData) => {
      console.log('📞 Call ended:', callData);
      setCallType(null);
      setIsInCall(false);
      setIncomingCall(null);
    });

    return () => {
      s.disconnect();
    };
  }, [myUserId, user]);

  const startCall = (toUid, type = 'voice') => {
    if (!socket || !toUid) {
      alert("Please select a user to call");
      return;
    }


    const timestamp = Date.now().toString().slice(-8);
    const shortUserId = myUserId.slice(-6);
    const shortToUid = toUid.slice(-6);
    const callChannelName = `call${shortUserId}${shortToUid}${timestamp}`;
    setChannelName(callChannelName);

    socket.emit('call-user', {
      toUid,
      fromUid: myUserId,
      type,
      channelName: callChannelName
    });

    console.log(` Starting ${type} call to ${toUid}`);
  };


  const acceptCall = () => {
    console.log(' Accept call clicked!', { socket: !!socket, incomingCall });

    if (socket && incomingCall) {

      const callerUser = user.find(u => u._id === incomingCall.fromUid);
      const callerAgoraUid = callerUser?.agoraUid || incomingCall.fromUid;
      setUid(callerAgoraUid);
      setCallType(incomingCall.type);
      setChannelName(incomingCall.channelName);
      setIsInCall(true);
      socket.emit('call-accepted', {
        toUid: incomingCall.fromUid,
        fromUid: myUserId,
        type: incomingCall.type,
        channelName: incomingCall.channelName
      });


    } else {
      console.log(' Missing socket or incomingCall:', { socket: !!socket, incomingCall });
    }
  };


  const rejectCall = () => {
    if (socket && incomingCall) {
      socket.emit('call-rejected', {
        toUid: incomingCall.fromUid,
        fromUid: myUserId
      });
      setIncomingCall(null);
      console.log(' Call rejected');
    }
  };


  const endCall = () => {
    if (socket) {
      socket.emit('call-ended', {
        fromUid: myUserId,
        channelName: channelName
      });
      setCallType(null);
      setIsInCall(false);
      console.log(' Call ended');
    }
  };


  const userDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_BACK_END_URL}/api/users/user-details`;
      const fetchData = await fetch(url, { method: "GET" });
      const { data } = await fetchData.json();
      if (fetchData.ok) setUser(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    userDetails();
  }, []);




  useEffect(() => {
    const initAgora = async () => {
      try {
        if (!window.AgoraRTC) {
          const script = document.createElement('script')
          script.src = 'https://download.agora.io/sdk/release/AgoraRTC_N-4.20.0.js'
          script.onload = () => {
            showStatus('Agora SDK loaded successfully', 'success')
          }
          document.head.appendChild(script)
        }
      } catch (error) {
        showStatus('Error loading Agora SDK', 'error')
      }
    }
    initAgora()
  }, [])


  const showStatus = (message, type) => {
    setStatus({ message, type })
    setTimeout(() => {
      setStatus({ message: '', type: '' })
    }, 5000)
  }


  const getToken = async (channelName, uid) => {
    try {
      showStatus('Connecting to server...', 'info')
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/api/video-call/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName, uid })
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      showStatus('Error getting token', 'error')
      throw error
    }
  }


  const joinChannel = async () => {
    if (!channelName || !uid) {
      showStatus('Please enter channel name and user ID', 'error')
      return
    }
    setIsLoading(true)
    try {
      showStatus('Getting token...', 'info')
      const tokenData = await getToken(channelName, uid)
      showStatus('Token received, joining channel...', 'info')

      if (!clientRef.current) {
        clientRef.current = window.AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

        clientRef.current.on("user-published", async (user, mediaType) => {
          showStatus(`Remote user ${user.uid} joined with ${mediaType}`, 'info')
          await clientRef.current.subscribe(user, mediaType)
          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack
            remoteVideoTrack.play(remoteVideoRef.current)
            setRemoteUsers(prev => [...prev, { uid: user.uid, videoTrack: remoteVideoTrack }])
            showStatus(`Remote video from user ${user.uid} is now playing`, 'success')
          }
          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack
            remoteAudioTrack.play()
            showStatus(`Remote audio from user ${user.uid} is now playing`, 'success')
          }
        })

        clientRef.current.on("user-unpublished", (user) => {
          showStatus(`User ${user.uid} left the channel`, 'info')
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
        })

        clientRef.current.on("user-joined", (user) => {
          showStatus(`User ${user.uid} joined the channel`, 'info')
        })

        clientRef.current.on("user-left", (user) => {
          showStatus(`User ${user.uid} left the channel`, 'info')
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
        })
      }

      try {
        localTracksRef.current = await window.AgoraRTC.createMicrophoneAndCameraTracks()
      } catch (trackError) {
        showStatus("Camera/Microphone error: " + trackError.message, 'error')
        throw trackError
      }


      if (localVideoRef.current && localTracksRef.current[1]) {
        try {
          localTracksRef.current[1].play(localVideoRef.current)
          setLocalVideoLoaded(true)
        } catch (error) {

        }
      }

      await clientRef.current.join(tokenData.appId, channelName, tokenData.token, uid)
      await clientRef.current.publish(localTracksRef.current)
      setIsJoined(true)
      showStatus(`Successfully joined video call: ${channelName} with UID: ${uid}`, 'success')
    } catch (error) {
      showStatus(`Error: ${error.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (isInCall && callType === "video" && !isJoined && !clientRef.current) {
      joinChannel();
    }
  }, [isJoined, isInCall, callType]);




  if (localVideoRef.current && localTracksRef.current[1]) {
    localTracksRef.current[1].play(localVideoRef.current);
    console.log("Local video track played:", localVideoRef.current);
  }


  const leaveChannel = async () => {
    try {
      showStatus('Leaving channel...', 'info')
      if (localTracksRef.current && localTracksRef.current.length > 0) {
        for (let track of localTracksRef.current) {
          if (track) {
            try {
              if (track.stop) track.stop()
              if (track.close) track.close()
              if (track.destroy) track.destroy()
            } catch { }
          }
        }
        localTracksRef.current = []
      }
      if (clientRef.current && isJoined) {
        try {
          await clientRef.current.leave()
        } catch { }
      }
      if (clientRef.current) {
        try {
          clientRef.current.removeAllListeners()
        } catch { }
        clientRef.current = null
      }
      setIsJoined(false)
      setIsInCall(false)
      setRemoteUsers([])
      setLocalVideoLoaded(false)
      showStatus('Left channel successfully', 'success')
    } catch (error) {
      showStatus(`Error leaving channel: ${error.message}`, 'error')
      setIsJoined(false)
      setIsInCall(false)
      setRemoteUsers([])
      setLocalVideoLoaded(false)
      clientRef.current = null
      localTracksRef.current = []
    }
  }


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


  if (callType === "voice") {
    return (
      <VoiceCall
        channelName={channelName}
        uid={uid}
        onBack={endCall}
        isInCall={isInCall}
        setIsInCall={setIsInCall}
        callType={callType}
      />
    );
  }

  if (callType === "video") {
    return (
      <VideoCall
        channelName={channelName}
        uid={uid}
        onBack={endCall}
        isJoined={isJoined}
        joinChannel={joinChannel}
        leaveChannel={leaveChannel}
        isLoading={isLoading}
        status={status}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        localVideoLoaded={localVideoLoaded}
        toggleLocalVideo={toggleLocalVideo}
        localVideoEnabled={localVideoEnabled}
        toggleLocalAudio={toggleLocalAudio}
        localAudioEnabled={localAudioEnabled}
        remoteUsers={remoteUsers}
      />
    );
  }

  if (incomingCall) {
    return (
      <CallAlert
        acceptCall={acceptCall}
        rejectCall={rejectCall}
        incomingCall={incomingCall}
        open={!!incomingCall}
      />
    );
  }

  const logOutButton = () => {
    navigator('/');
    localStorage.removeItem("user-ID");
    window.location.reload();

  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
      }} >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 6,
          border: "2px solid #d1d5db",
          width: 700,
        }}
      >

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
        >
          <Button
            onClick={logOutButton}
            sx={{ fontWeight: "bold", color: "error.main", textDecoration: "underline" }}
          >
            Log Out
          </Button>
        </Box>


        <CardContent sx={{ textAlign: "center", pt: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 3,
              mx: "auto",
              background: "linear-gradient(to bottom right, #2563eb, #7c3aed)",
            }}
          >
            <IoCallOutline size={30} />
          </Avatar>
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            Agora Call App
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose your call type to start
          </Typography>
        </CardContent>


        <CardContent sx={{ p: 4, py: 0 }}>
          <Box sx={{ mb: 5 }}>
            <Box sx={{ mb: 3 }}>
              <InputLabel shrink>Channel Name</InputLabel>
              <TextField
                fullWidth
                size="small"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Enter channel name"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box>
              <FormControl fullWidth size="small" >
                <InputLabel>Select User</InputLabel>
                <Select
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  label="Select User"
                >
                  <MenuItem value="">
                    -- Select a user --
                  </MenuItem>
                  {user.map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      {u.fullname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>


          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              fullWidth
              onClick={() => startCall(uid, "voice")}
              sx={{

                background: "linear-gradient(to right, #22c55e, #16a34a)",
                color: "white",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 4,
                "&:hover": {
                  background: "linear-gradient(to right, #16a34a, #15803d)",
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(253, 250, 250, 0.2)",
                  mr: 2,
                  width: 40,
                  height: 40,
                }}
              >
                <IoCallOutline size={20} color="#ffffff" />
              </Avatar>
              <Box textAlign="left">
                <Typography variant="subtitle1" fontWeight="600">
                  Voice Call
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Audio only - No video
                </Typography>
              </Box>
            </Button>

            <Button
              fullWidth
              onClick={() => startCall(uid, "video")}
              sx={{

                background: "linear-gradient(to right, #3b82f6, #2563eb)",
                color: "white",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",

                "&:hover": {
                  background: "linear-gradient(to right, #2563eb, #1d4ed8)",
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  mr: 2,
                  width: 40,
                  height: 40,
                }}
              >
                <FaVideo size={20} color="#feffff" />
              </Avatar>
              <Box textAlign="left">
                <Typography variant="subtitle1" fontWeight="600">
                  Video Call
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Audio + Video
                </Typography>
              </Box>
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CallApp;