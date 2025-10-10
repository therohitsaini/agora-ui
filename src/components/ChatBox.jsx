import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// ChatBox component compatible with the provided backend socket events
// Props:
// - roomId: string (required) → room to join
// - userId: string (required) → current user id
// - toUid: string (optional) → direct recipient id if any
// - socket: Socket (optional) → pass an existing socket instance; if not provided, this component will create and manage its own
// - height: number|string (optional) → container height
// - placeholder: string (optional)
function ChatBox({ roomId, toUid, socket: externalSocket, height = 380, placeholder = 'Send Some thing  message...' }) {
   const [messages, setMessages] = useState([])
   const [input, setInput] = useState('')
   const [typingUsers, setTypingUsers] = useState(new Set())
   const [connected, setConnected] = useState(false)
   const typingTimeoutRef = useRef(null)
   const ownSocketRef = useRef(null)
   const listEndRef = useRef(null)
    const userId = "68cd21a38f964c2597d80838"

   // Fallbacks so the component works standalone for text chat
   const rId = useMemo(() => roomId || `room-${(userId || localStorage.getItem('user-ID') || 'guest')}`, [roomId, userId])
   const uId = useMemo(() => userId || localStorage.getItem('user-ID') || 'guest', [userId])

   // Scroll to bottom when messages change
   useEffect(() => {
      if (listEndRef.current) {
         try { listEndRef.current.scrollIntoView({ behavior: 'smooth' }) } catch { }
      }
   }, [messages])

   const socket = useMemo(() => {
      if (externalSocket) return externalSocket
      const backendUrl = import.meta.env.VITE_BACK_END_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
      const s = io(backendUrl, {
         transports: ['websocket', 'polling'],
         reconnection: true,
         reconnectionAttempts: 10,
         reconnectionDelay: 1000,
         withCredentials: true,
      })
      ownSocketRef.current = s
      return s
   }, [externalSocket])

   // Wire up socket listeners
   useEffect(() => {
      if (!socket || !rId || !uId) return

      const onConnect = () => setConnected(true)
      const onDisconnect = () => setConnected(false)

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)

      // Join the room
      socket.emit('chat:join', { roomId: rId, userId: uId })

      // Someone joined
      const onUserJoined = ({ userId: joinedUserId }) => {
         setMessages(prev => ([
            ...prev,
            { system: true, text: `User joined: ${joinedUserId}`, createdAt: new Date().toISOString() }
         ]))
      }

      // New message
      const onNewMessage = (message) => {
         setMessages(prev => ([...prev, message]))
      }

      // Typing indicators
      const onTyping = ({ fromUid }) => {
         if (!fromUid || fromUid === uId) return
         setTypingUsers(prev => new Set(prev).add(fromUid))
      }
      const onStopTyping = ({ fromUid }) => {
         if (!fromUid) return
         setTypingUsers(prev => {
            const next = new Set(prev)
            next.delete(fromUid)
            return next
         })
      }

      socket.on('chat:userJoined', onUserJoined)
      socket.on('chat:newMessage', onNewMessage)
      socket.on('chat:typing', onTyping)
      socket.on('chat:stopTyping', onStopTyping)

      return () => {
         socket.off('connect', onConnect)
         socket.off('disconnect', onDisconnect)
         socket.off('chat:userJoined', onUserJoined)
         socket.off('chat:newMessage', onNewMessage)
         socket.off('chat:typing', onTyping)
         socket.off('chat:stopTyping', onStopTyping)
         // If we created the socket, we own its lifecycle
         if (ownSocketRef.current) {
            try { ownSocketRef.current.disconnect() } catch { }
            ownSocketRef.current = null
         }
      }
   }, [socket, rId, uId])

   // Send typing event with debounce for stopTyping
   const handleInputChange = (e) => {
      const value = e.target.value
      setInput(value)

      if (!socket || !rId || !uId) return
      try {
         socket.emit('chat:typing', { roomId: rId, fromUid: uId })
      } catch { }

      // Debounce stopTyping
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
         try { socket.emit('chat:stopTyping', { roomId: rId, fromUid: uId }) } catch { }
      }, 900)
   }

   const sendMessage = () => {
      const text = input.trim()
      if (!text || !socket || !rId || !uId) return
      const localMessage = {
         roomId: rId,
         fromUid: uId,
         toUid: toUid || null,
         text,
         createdAt: new Date().toISOString()
      }
      // Optimistically render locally so it shows instantly
      setMessages(prev => ([...prev, localMessage]))
      // Send to server (server will also broadcast to the room/recipient)
      socket.emit('chat:message', localMessage)
      setInput('')
      // Immediately stop typing when message is sent
      try { socket.emit('chat:stopTyping', { roomId: rId, fromUid: uId }) } catch { }
   }

   const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         sendMessage()
      }
   }

   const renderTyping = () => {
      if (!typingUsers || typingUsers.size === 0) return null
      const others = Array.from(typingUsers).filter(uid => uid !== uId)
      if (others.length === 0) return null
      const label = others.length === 1 ? `User ${others[0]} is typing...` : 'Multiple users are typing...'
      return (
         <div style={{ padding: '6px 10px', color: '#9ca3af', fontSize: 12 }}>{label}</div>
      )
   }

   return (
      <div style={{
         display: 'flex', flexDirection: 'column',
         border: '1px solid #2a2a2a', borderRadius: 8,
         background: '#0f0f0f', color: '#e5e7eb',
         width: '100%', height:"100vh",
      }}>
         <div style={{ padding: 10, borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700 }}>Room: {rId}</div>
            <div style={{ fontSize: 12, color: connected ? '#10b981' : '#ef4444' }}>{connected ? 'Connected' : 'Disconnected'}</div>
         </div>

         <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
            {messages.map((m, idx) => {
               const mine = m.fromUid === uId
               if (m.system) {
                  return (
                     <div key={idx} style={{ textAlign: 'center', margin: '6px 0', color: '#9ca3af', fontSize: 12 }}>
                        {m.text}
                     </div>
                  )
               }
               return (
                  <div key={idx} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                     <div style={{
                        background: mine ? 'rgba(16,185,129,0.12)' : 'rgba(59,130,246,0.12)',
                        border: `1px solid ${mine ? 'rgba(16,185,129,0.35)' : 'rgba(59,130,246,0.35)'}`,
                        padding: '8px 10px', borderRadius: 8, maxWidth: '70%'
                     }}>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>
                           {mine ? 'You' : (m.fromUid || 'User')}
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>{new Date(m.createdAt).toLocaleTimeString()}</div>
                     </div>
                  </div>
               )
            })}
            <div ref={listEndRef} />
         </div>

         {renderTyping()}

         <div style={{ borderTop: '1px solid #1f2937', padding: 10, display: 'flex', gap: 8 }}>
            <textarea
               value={input}
               onChange={handleInputChange}
               onKeyDown={handleKeyDown}
               rows={2}
               style={{ flex: 1, resize: 'none', background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6, padding: 8 }}
               placeholder={placeholder}
            />
            <button
               onClick={sendMessage}
               style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 0, borderRadius: 6, padding: '8px 14px', fontWeight: 700 }}
            >Send</button>
         </div>
      </div>
   )
}

export default ChatBox
