

// const Demo = ({ channelName, localVideoRef, remoteVideoRef, remoteUsers, uid, formatTime, time, localAudioEnabled, localVideoEnabled, toggleLocalAudio, toggleLocalVideo, leaveChannel }) => {
//     return (
//         <div className="h-screen flex flex-col bg-gray-900 ">

//             <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                     <button

//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                         </svg>
//                     </button>
//                     <div>
//                         <h1 className="text-lg font-semibold text-gray-800">Video Call Meeting</h1>
//                         <p className="text-sm text-gray-500">Channel: {channelName}</p>
//                     </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                         Live
//                     </span>
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                         <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
//                             <circle cx="12" cy="12" r="10" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>

//             <div className="flex-1 flex  h-[200px] ">

//                 <div className="flex-1 flex flex-row items-center justify-center bg-gray-800">

//                     <video
//                         ref={localVideoRef}
//                         className="h-full w-1/2 object-cover border-4 border-blue-500 rounded-lg m-2"
//                         autoPlay
//                         muted
//                         playsInline

//                     />

//                     <video
//                         ref={remoteVideoRef}
//                         className="h-full w-1/2 object-cover border-4 border-green-500 rounded-lg m-2"
//                         autoPlay
//                         playsInline
//                     />
//                 </div>


//                 <div className="w-80 bg-white border-l border-gray-200 flex flex-col">

//                     <div className="p-4 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800">Participants</h3>
//                         <p className="text-sm text-gray-500">{remoteUsers?.length + 1} participant(s)</p>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                         <div className="space-y-3">

//                             <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
//                                 <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
//                                     <span className="text-white font-medium text-sm">You</span>
//                                 </div>
//                                 <div className="flex-1">
//                                     <p className="text-sm font-medium text-gray-800">You (UID: {uid || 123})</p>
//                                     <p className="text-xs text-gray-500">Host</p>
//                                     {/* <span>{formatTime(time)}</span> */}
//                                 </div>
//                                 <div className="flex space-x-1">
//                                     <div className={`w-6 h-6 rounded-full flex items-center justify-center ${localAudioEnabled ? 'bg-green-100' : 'bg-red-100'
//                                         }`}>
//                                         <svg className={`w-3 h-3 ${localAudioEnabled ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 24 24">
//                                             <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
//                                         </svg>
//                                     </div>
//                                     <div className={`w-6 h-6 rounded-full flex items-center justify-center ${localVideoEnabled ? 'bg-green-100' : 'bg-red-100'
//                                         }`}>
//                                         <svg className={`w-3 h-3 ${localVideoEnabled ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 24 24">
//                                             <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>

//                             {
//                                 remoteUsers?.map((user, index) => (
//                                     <div key={user.uid} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
//                                         <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//                                             <span className="text-white font-medium text-sm">U{user.uid}</span>
//                                         </div>
//                                         <div className="flex-1">
//                                             <p className="text-sm font-medium text-gray-800">User {user.uid}</p>
//                                             <p className="text-xs text-gray-500">Participant</p>
//                                         </div>
//                                         <div className="flex space-x-1">
//                                             <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
//                                                 <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
//                                                     <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
//                                                 </svg>
//                                             </div>
//                                             <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
//                                                 <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
//                                                     <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>

//                     <div className="border-t border-gray-200 p-4">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">Chat</h3>
//                         <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
//                             <div className="text-xs text-gray-500 text-center py-2">
//                                 Chat feature coming soon...
//                             </div>
//                         </div>
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder="Type a message..."
//                                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 disabled
//                             />
//                             <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled>
//                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* Bottom Controls */}
//             <div className="bg-white border-t border-gray-200 px-6 py-4">
//                 <div className="flex items-center justify-center space-x-4">
//                     <button
//                         onClick={toggleLocalAudio}
//                         className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${localAudioEnabled
//                             ? 'bg-gray-200 hover:bg-gray-300'
//                             : 'bg-red-500 hover:bg-red-600'
//                             }`}
//                     >
//                         <svg className={`w-6 h-6 ${localAudioEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
//                             <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={toggleLocalVideo}
//                         className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${localVideoEnabled
//                             ? 'bg-gray-200 hover:bg-gray-300'
//                             : 'bg-red-500 hover:bg-red-600'
//                             }`}
//                     >
//                         <svg className={`w-6 h-6 ${localVideoEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
//                         </svg>
//                     </button>
//                     <button className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
//                         <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={leaveChannel}
//                         className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
//                     >
//                         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11-.53-.29-.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Demo