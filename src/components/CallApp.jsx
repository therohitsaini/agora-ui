import React, { use, useEffect, useRef, useState } from "react";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";
import { IoCallOutline } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { io } from "socket.io-client";
import CallAlert from "./CallAlert";
import { useAuth } from "../authProvider/AuthProvider";
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
import Navbar from "./Navbar";
import bgImage from "../assets/image/agoraBG.jpg";
import AnimatedHero from "./AnimatedHero";
import { toast, ToastContainer } from "react-toastify";
import InsuficientBalanceAlert from "../AlertModal/InsuficientBalanceAlert";
import GoogleAnimatedButton from "../io/Io";

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
  const [open, setOpen] = useState(false);
  const [userId, seUserId] = useState("");
  const [userInfoByID, setUserInfoByID] = useState({})
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const clientRef = useRef(null)
  const localTracksRef = useRef([])
  const navigator = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const id = localStorage.getItem("user-ID");
    seUserId(id);
  }, []);

  const myUserId = localStorage.getItem("user-ID");

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:3001';
    const s = io(backendUrl, {
      transports: ["websocket"],
    });
    setSocket(s);
    s.emit('register', myUserId);

    s.on('incoming-call', (callData) => {
      setIncomingCall(callData);
    });

    s.on('call-accepted', (callData) => {
      const receiverUser = user.find(u => u._id === callData.fromUid);
      const receiverAgoraUid = receiverUser?.agoraUid || callData.fromUid;
      setUid(receiverAgoraUid);
      setCallType(callData.type);
      setChannelName(callData.channelName);
      setIsInCall(true);
      setIncomingCall(null);
    });

    s.on('call-rejected', (callData) => {
      console.log(' Call rejected:', callData);
      setIncomingCall(null);
      toast.error("Call rejected by user");
    });
    s.on('call-failed', (data) => {
      console.log(' Call failed:', data);
      // alert(data.message);
      setOpen(true);
      setIncomingCall(null);
    });

    s.on('call-ended', (callData) => {
      toast.info("Call ended");
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
      toast.error("Please select a user to call");
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

  };


  const acceptCall = () => {
    if (socket && incomingCall) {
      const callerUser = user.find(u => u._id === incomingCall.fromUid);
      const callerAgoraUid = callerUser?.agoraUid || incomingCall.fromUid;
      setUid(callerAgoraUid);
      setCallType(incomingCall.type);
      setChannelName(incomingCall.channelName);
      setIsInCall(true);

      // Emit call-accepted event
      socket.emit('call-accepted', {
        toUid: incomingCall.fromUid,
        fromUid: myUserId,
        type: incomingCall.type,
        channelName: incomingCall.channelName
      });

      // For voice calls, trigger joinChannel immediately
      if (incomingCall.type === 'voice') {
        // Small delay to ensure state is updated
        setTimeout(() => {
          if (window.joinChannelFromCallApp) {
            window.joinChannelFromCallApp();
          }
        }, 100);
      }
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
    const token = localStorage.getItem("access_user")
    try {
      const url = `${import.meta.env.VITE_BACK_END_URL}/api/users/user-details`;
      const fetchData = await fetch(url,
        {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });
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
      const url = `${import.meta.env.VITE_BACK_END_URL}/api/video-call/generate-token`
      const response = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
    if (isInCall && callType === "video" && !isJoined) {
      joinChannel();
    }
  }, [isInCall, callType]);


  if (localVideoRef.current && localTracksRef.current[1]) {
    localTracksRef.current[1].play(localVideoRef.current);
    console.log("Local video track played:", localVideoRef.current);
  }

  const getUserByID = async (id) => {

    try {
      const url = `${import.meta.env.VITE_BACK_END_URL}/api/users/${id}`;
      const fetchData = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
      const { data } = await fetchData.json();
      if (fetchData.ok) {
        setUserInfoByID(data)
      }

    } catch (error) {
      console.log("Error fetching user by ID:", error);
      return null;
    }
  }
  useEffect(() => {
    const id = localStorage.getItem("user-ID");
    if (id) {
      const u = getUserByID(id);

    }
  }, [])


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

  // useEffect(() => {
  //   if (isJoined) {
  //     intervalRef.current = setInterval(() => {
  //       setTime(prev => prev + 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(intervalRef.current);
  //   }

  //   return () => clearInterval(intervalRef.current);
  // }, [isJoined,]);


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };


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
        formatTime={formatTime}
        time={time}
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
    logout();
    navigator('/');
  }



  const handleRecharge = async () => {
    const url = `${import.meta.env.VITE_BACK_END_URL}/api/razerpay-create-order/create-order`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountINR: 1, userId })
    });
    const data = await res.json();
    const order = data.order;

    console.log("TEXT", order)
    // if()
    const options = {
      key: "rzp_test_RJ31PhSmp5nbLQ",
      amount: order?.amount,
      currency: order?.currency,
      name: "My Calling App",
      description: "Wallet Recharge",
      order_id: order?.id,
      handler: async function (response) {

        await fetch(`${import.meta.env.VITE_BACK_END_URL}/api/razerpay-create-order/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, userId, amountINR: 1 })
        });
        alert("Recharge Success! Refresh wallet balance.");
      },
      // prefill: { name: currentUser?.name, email: currentUser?.email, contact: "9999999999" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  return (
    <AnimatedHero>
      <ToastContainer />
      <InsuficientBalanceAlert open={open} onClose={() => setOpen(false)} />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "end",
          flexDirection: "column",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <Navbar logOutButton={logOutButton} handleRecharge={handleRecharge} userInfoByID={userInfoByID} />
        <div className=" w-full min-h-[85vh]  flex  items-center justify-center px-20 ">
          <Box
            sx={{
              width: "100%",
              textAlign: "start",
              px: 3,

            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="start"
              sx={{
                fontSize: "42px",
                background: "linear-gradient(90deg, #f9f9fa, #939494, #4b4b4b)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Video calls with anyone anytime
            </Typography>

            <Typography variant="body1" color="white" textAlign="start" sx={{ mt: 1 }}>
              Select a user and choose call type to start
            </Typography>
            <Button sx={{
              textTransform: "none",
              marginTop: 2,
              p: "10px",
              paddingX: " 20px",
              color: "black",
              fontVariant: "small-caps",
              backgroundColor: "white",
              fontWeight: "bold"
            }}
              variant="contained" >Let's Connect Some One  </Button>
          </Box>
          <Box sx={{
            // background: "#504e4e",
            marginTop: 5,
            borderRadius: 4,
            backgroundColor: "rgba(92, 89, 89, 0.374)",
            width: "100%",

          }}>
            <Card
              sx={{
                background: "transparent", boxShadow: "none",

              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
              >
              </Box>
              <CardContent
                sx={{
                  p: 4,
                  py: 0,
                }}>
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{
                      color: "#ffffff",
                    }} shrink>Channel Name</InputLabel>
                    <TextField
                      fullWidth
                      size="small"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="Enter channel name"
                      variant="outlined"

                      sx={{
                        mt: 1,
                        input: {
                          color: "white",
                        },
                        "& .MuiInputLabel-root": {
                          color: "white",
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <FormControl fullWidth size="small" >
                      <InputLabel sx={{ color: 'white' }} >Select User</InputLabel>
                      <Select
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                        label="Select User"
                        sx={{
                          // color: "#ffffff",

                        }}
                      >
                        <MenuItem sx={{ color: "white" }} value="">
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
        </div>
      </Box >
    </AnimatedHero>
  );
}

export default CallApp;