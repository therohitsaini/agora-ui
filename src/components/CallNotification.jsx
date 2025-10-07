// CallNotification.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Socket connection
const socket = io(`${import.meta.env.VITE_BACK_END_URL}`); // backend URL

function CallNotification() {
   const [incomingCall, setIncomingCall] = useState(null);
   const [targetUserId, setTargetUserId] = useState(""); // user ko call karne ke liye input

   // 1️⃣ Connect & register
   useEffect(() => {
      const myUserId = localStorage.getItem("user-ID") // apni ID
      localStorage.setItem("user-ID", myUserId);

      socket.on("connect", () => {
         console.log("Connected to backend:", socket.id);
         socket.emit("register", myUserId);
      });

      // 2️⃣ Listen for incoming call
      socket.on("incoming-call", ({ fromUid, type }) => {
         setIncomingCall({ fromUid, type });
      });

      return () => {
         socket.off("incoming-call");
      };
   }, []);

   // 3️⃣ Call user function
   const callUser = () => {
      const myUserId = localStorage.getItem("user-ID");
      if (!targetUserId) return alert("Enter target user ID");

      socket.emit("call-user", {
         toUid: targetUserId,
         fromUid: myUserId,
         type: "video", // ya "voice"
      });

      alert(`Call sent to ${targetUserId}`);
   };

   // 4️⃣ Accept / Reject
   const acceptCall = () => {
      alert(`Call from ${incomingCall.fromUid} accepted!`);
      setIncomingCall(null);
      // yahan Agora join call logic add kar sakte ho
   };

   const rejectCall = () => {
      alert(`Call from ${incomingCall.fromUid} rejected!`);
      setIncomingCall(null);
      // yahan backend ko reject notify kar sakte ho
   };

   return (
      <div className="p-4 max-w-md mx-auto mt-8 border rounded shadow">
         <h2 className="text-xl font-bold mb-4">Call Notification Demo</h2>

         {/* Call input */}
         <div className="mb-4">
            <input
               type="text"
               placeholder="Target User ID"
               value={targetUserId}
               onChange={(e) => setTargetUserId(e.target.value)}
               className="w-full p-2 border rounded"
            />
         </div>
         <button
            onClick={callUser}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
         >
            Call User
         </button>

         {/* Incoming call */}
         {incomingCall && (
            <div className="mt-6 p-4 border rounded bg-yellow-100">
               <p>
                  📞 Incoming {incomingCall.type} call from <b>{incomingCall.fromUid}</b>
               </p>
               <div className="mt-2 flex space-x-2">
                  <button
                     onClick={acceptCall}
                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                     Accept
                  </button>
                  <button
                     onClick={rejectCall}
                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                     Reject
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default CallNotification;
