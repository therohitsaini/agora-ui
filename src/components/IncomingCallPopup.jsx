import { Box } from "@mui/material";
import React from "react";
import { FaPhoneAlt, FaVideo, FaTimes } from "react-icons/fa";

const IncomingCallPopup = ({ incoming, accept, reject }) => {
   return (
      <div className="fixed bottom-5 right-5 z-50 bg-white/20 backdrop-blur-md  shadow-xl rounded-md p-4 text-white w-80 animate-slideIn">
         <div className="flex items-center gap-3 mb-3 ">
            {incoming.type === "video" ? (
               <Box sx={{
                  height: 40, width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#1f2937',
               }}>
                  <FaVideo className="text-blue-400 text-xl" />
               </Box>
            ) : (
               <Box sx={{

                  height: 40, width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#1f2937',


               }}>
                  <FaPhoneAlt className="text-green-400 text-xl" />
               </Box>
            )}
            <div>
               <p className="font-semibold text-base">Incoming {incoming.type} call</p>
               <p className="text-sm text-gray-400">from {incoming.name || "Unknown User"}</p>
            </div>
         </div>

         <div className="flex justify-between gap-3">
            <button
               onClick={accept}
               className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg text-sm font-medium"
            >
               <FaPhoneAlt className="text-white text-sm" /> Accept
            </button>

            <button
               onClick={reject}
               className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg text-sm font-medium"
            >
               <FaTimes className="text-white text-sm" /> Reject
            </button>
         </div>
      </div>
   );
};

export default IncomingCallPopup;
