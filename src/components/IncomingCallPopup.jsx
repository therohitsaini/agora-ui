import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { FaPhoneAlt, FaVideo, FaTimes } from "react-icons/fa";

const IncomingCallPopup = ({ incoming, accept, reject }) => {
   const audioRef = useRef(null);

   useEffect(() => {
      // Create and play ring sound when component mounts
      if (incoming) {
       
         const audio = new Audio();
         // Try to use Microsoft Teams ring tone first, fallback to better tone
         audio.src = '/Microsoft_Teams_Incoming_Call_Sound-646775-mobiles24.mp3';
         audio.loop = true;
         audio.volume = 0.7;
         audioRef.current = audio;
         audio.addEventListener('error', () => {  
            // Option 1: WhatsApp style ring tone
            audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuBzvLZiTYIG2m98N+ZURE=';
            
            // Option 2: iPhone style ring tone (uncomment to use)
            // audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuBzvLZiTYIG2m98N+ZURE=';
            
            // Option 3: Simple but pleasant beep (uncomment to use)
            // audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuBzvLZiTYIG2m98N+ZURE=';
         });
         
         // Play the ring sound
         audio.play().catch(e => console.log('Audio play failed:', e));
      }

      return () => {
         if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
         }
      };
   }, [incoming]);



   return (
      <div className="fixed bottom-5 right-5 z-50 bg-white/20 backdrop-blur-md  shadow-xl rounded-md p-4 text-white w-80 animate-slideIn">
         <div className="flex items-center gap-3 mb-3 ">
            {
               incoming.type === "video" ? (
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
