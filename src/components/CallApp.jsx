import React, { useEffect, useState } from "react";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";
import { IoCallOutline } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { io } from "socket.io-client";
import CallAlert from "./CallAlert";

function CallApp() {
  const [socket, setSocket] = useState(null);
  const [callType, setCallType] = useState(null);
  const [channelName, setChannelName] = useState("test-channel");
  const [uid, setUid] = useState("");
  const [user, setUser] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);

  // Debug logs
  console.log("🔍 Current state:", { callType, channelName, uid, incomingCall, isInCall });
  console.log("🔍 User list:", user.map(u => ({ _id: u._id, fullname: u.fullname, agoraUid: u.agoraUid })));

  const myUserId = localStorage.getItem("user-ID");

  // 1️⃣ Socket connection
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:3001';
    const s = io(backendUrl);
    setSocket(s);

    // 2️⃣ Register user
    s.emit('register', myUserId);

    // 3️⃣ Listen for events
    s.on('incoming-call', (callData) => {
      console.log('📞 Incoming call:', callData);
      setIncomingCall(callData);
    });

    s.on('call-accepted', (callData) => {
      console.log('✅ Call accepted:', callData);

      // Find receiver's agoraUid from user list
      const receiverUser = user.find(u => u._id === callData.fromUid);
      const receiverAgoraUid = receiverUser?.agoraUid || callData.fromUid;

      // Set UID for Agora call
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

  // 4️⃣ Start call
  const startCall = (toUid, type = 'voice') => {
    if (!socket || !toUid) {
      alert("Please select a user to call");
      return;
    }

    // Generate Agora-compatible channel name (max 64 bytes, only alphanumeric)
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const shortUserId = myUserId.slice(-6); // Last 6 chars
    const shortToUid = toUid.slice(-6); // Last 6 chars
    const callChannelName = `call${shortUserId}${shortToUid}${timestamp}`;
    setChannelName(callChannelName);

    socket.emit('call-user', {
      toUid,
      fromUid: myUserId,
      type,
      channelName: callChannelName
    });

    console.log(`📤 Starting ${type} call to ${toUid}`);
  };

  // 5️⃣ Accept call
  const acceptCall = () => {
    console.log('🔍 Accept call clicked!', { socket: !!socket, incomingCall });

    if (socket && incomingCall) {
      // Find caller's agoraUid from user list
      const callerUser = user.find(u => u._id === incomingCall.fromUid);
      const callerAgoraUid = callerUser?.agoraUid || incomingCall.fromUid;

      console.log('🔍 Caller user found:', callerUser);
      console.log('🔍 Caller agoraUid:', callerAgoraUid);
      console.log('🔍 Incoming call data:', incomingCall);

      // Set UID for Agora call
      setUid(callerAgoraUid);

      // Set call type and channel name immediately
      setCallType(incomingCall.type);
      setChannelName(incomingCall.channelName);
      setIsInCall(true);

      console.log('✅ State set - callType:', incomingCall.type, 'channelName:', incomingCall.channelName, 'isInCall: true');

      socket.emit('call-accepted', {
        toUid: incomingCall.fromUid,
        fromUid: myUserId,
        type: incomingCall.type,
        channelName: incomingCall.channelName
      });
      console.log('✅ Call accepted with agoraUid:', callerAgoraUid);
      console.log('✅ Call type set to:', incomingCall.type);
      console.log('✅ Channel name set to:', incomingCall.channelName);
    } else {
      console.log('❌ Missing socket or incomingCall:', { socket: !!socket, incomingCall });
    }
  };

  // 6️⃣ Reject call
  const rejectCall = () => {
    if (socket && incomingCall) {
      socket.emit('call-rejected', {
        toUid: incomingCall.fromUid,
        fromUid: myUserId
      });
      setIncomingCall(null);
      console.log('❌ Call rejected');
    }
  };

  // 7️⃣ End call
  const endCall = () => {
    if (socket) {
      socket.emit('call-ended', {
        fromUid: myUserId,
        channelName: channelName
      });
      setCallType(null);
      setIsInCall(false);
      console.log('📞 Call ended');
    }
  };

  // Fetch users
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

  // 8️⃣ Render call screen if in call
  if (callType === "voice") {
    return (
      <VoiceCall
        channelName={channelName}
        uid={uid}
        onBack={endCall}
      />
    );
  }

  if (callType === "video") {
    return (
      <VideoCall
        channelName={channelName}
        uid={uid}
        onBack={endCall}
      />
    );
  }

  // 9️⃣ Render incoming call popup
  if (incomingCall) {
    return (
      <CallAlert acceptCall={acceptCall} rejectCall={rejectCall} incomingCall={incomingCall} />
    );
  }

  const logOutButton = () => {
    localStorage.removeItem("user-ID");
    window.location.reload();
  }

  return (
    <div className="min-h-screen w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-300 w-[700px] ">
        <div className="header  p-5 flex justify-end">
          <button onClick={logOutButton} className="text-red-500 hover:underline font-bold">Log Out</button>
        </div>
        <div className="text-center pt-5 ">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl"><IoCallOutline /></span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Agora Call App</h1>
          <p className="text-gray-600">Choose your call type to start</p>
        </div>

        <div className="main-content rounded-lg p-10 flex flex-col gap-5 items-center justify-center w-full">
          {/* Channel and UID Input */}
          <div className="space-y-4 mb-8 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Channel Name</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter channel name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
              <select
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">-- Select a user --</option>
                {user.map((u) => (
                  <option key={u._id} value={u._id}>{u.fullname}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Call Type Selection */}
          <div className="flex w-full gap-5">
            <button
              onClick={() => startCall(uid, "voice")}
              className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl text-green-500"><IoCallOutline /></span>
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold">Voice Call</div>
                <div className="text-sm opacity-90">Audio only - No video</div>
              </div>
            </button>

            <button
              onClick={() => startCall(uid, "video")}
              className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl text-blue-500"><FaVideo /></span>
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold">Video Call</div>
                <div className="text-sm opacity-90">Audio + Video</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallApp;