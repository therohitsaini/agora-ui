import React, { useEffect, useState } from 'react'
import VoiceCall from './VoiceCall'
import VideoCall from './VideoCall'
import { IoCallOutline } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";

function CallApp() {
  const [callType, setCallType] = useState(null) // null, 'voice', or 'video'
  const [channelName, setChannelName] = useState('test-channel')
  const [uid, setUid] = useState(1001)
  const [user, setUser] = useState([])


  const userDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_BACK_END_URL}/api/users/user-details`
      const fetchData = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "user-ID": localStorage.getItem("user-ID")
        },
      });
      const { data } = await fetchData.json();

      if (fetchData.ok) {
        setUser(data)
      } else {
        console.log("Failed to fetch user details");
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  useEffect(() => {
    userDetails()
  }, [])

  if (callType === 'voice') {
    return (
      <VoiceCall
        channelName={channelName}
        uid={uid}
        onBack={() => setCallType(null)}
      />
    )
  }

  if (callType === 'video') {
    return (
      <VideoCall
        channelName={channelName}
        uid={uid}
        onBack={() => setCallType(null)}
      />
    )
  }

  // Render call type selection interface
  return (
    <div className="min-h-screen w-full  rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl   border-2 border-gray-300 w-[700px]">
        <div className="text-center pt-5">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl"><IoCallOutline /></span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Agora Call App
          </h1>
          <p className="text-gray-600">Choose your call type to start</p>
        </div>

        <div className='main-content  rounded-lg p-10 flex flex-col gap-5 items-center justify-center w-full'>
          {/* Channel and UID Input */}
          <div className="space-y-4 mb-8 w-full">
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
                Select User
              </label>
              <select
                value={uid}
                onChange={(e) => setUid(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">-- Select a user --</option>
                {user.map((u) => (
                  <option key={u.agoraUid} value={u.agoraUid}>
                    {u.fullname}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Call Type Selection */}
          <div className="flex w-full gap-5">
            <button
              onClick={() => setCallType('voice')}
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
              onClick={() => setCallType('video')}
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
  )
}

export default CallApp
