import React, { useState } from 'react'
import { 
   Box, 
   Typography, 
   Avatar, 
   TextField, 
   IconButton, 
   List, 
   ListItem, 
   ListItemAvatar, 
   ListItemText, 
   Divider, 
   Badge, 
   Chip,
   Paper,
   InputAdornment
} from '@mui/material'
import { 
   Send, 
   Search, 
   MoreVert, 
   Phone, 
   VideoCall, 
   Info, 
   AttachFile, 
   EmojiEmotions, 
   Mic 
} from '@mui/icons-material'

// Mock data for chat list
const mockChats = [
   {
      id: '68cd22238f964c2597d8083e',
      name: 'Arun Sharma',
      lastMessage: 'Thank you for the consultation',
      time: '2:30 PM',
      unread: 2,
      online: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
   },
   {
      id: '68cd21a38f964c2597d80838',
      name: 'Priya Patel',
      lastMessage: 'Can you help me with my career guidance?',
      time: '1:45 PM',
      unread: 0,
      online: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
   },
   {
      id: '68cd23b48f964c2597d8084f',
      name: 'Rajesh Kumar',
      lastMessage: 'I need help with relationship issues',
      time: '12:20 PM',
      unread: 1,
      online: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
   }
]

// Mock messages for selected chat
const mockMessages = [
   {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'Arun Sharma',
      time: '2:25 PM',
      isMe: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
   },
   {
      id: 2,
      text: 'I need guidance on my career path',
      sender: 'You',
      time: '2:26 PM---',
      isMe: true,
      avatar: null
   },
   {
      id: 3,
      text: 'I would be happy to help you with career guidance. What field are you currently in?',
      sender: 'Arun Sharma',
      time: '2:27 PM',
      isMe: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
   },
   {
      id: 4,
      text: 'I am working in IT but want to switch to management',
      sender: 'You',
      time: '2:28 PM',
      isMe: true,
      avatar: null
   }
]

function ChatUI({ height }) {
   const [selectedChat, setSelectedChat] = useState(null)
   const [searchTerm, setSearchTerm] = useState('')
   const [messageInput, setMessageInput] = useState('')
   const [messages, setMessages] = useState(mockMessages)

   // Filter chats based on search
   const filteredChats = mockChats.filter(chat => 
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
   )

   const handleChatSelect = (chat) => {
      setSelectedChat(chat)
   }

   const handleSendMessage = () => {
      if (messageInput.trim()) {
         const newMessage = {
            id: messages.length + 1,
            text: messageInput,
            sender: 'You',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            avatar: null
         }
         setMessages(prev => [...prev, newMessage])
         setMessageInput('')
      }
   }

   const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         handleSendMessage()
      }
   }

   return (
      <Box sx={{ 
         display: 'flex', 
         height: { xs: '100vh', sm: '90vh', md: '85vh', lg: height || '40vh' },
         minHeight: '84vh',
         background: 'linear-gradient(135deg, #0f0f0f 0%,rgb(7, 6, 6) 100%)',
         color: 'white',
         flexDirection: { xs: 'column', md: 'row' },
         overflow: 'hidden',
      }}>
         {/* Left Sidebar - Chat List */}
         <Box sx={{ 
            width: { xs: '100%', md: 350 },
            height: { xs: '40vh', md: '100%' },
            minHeight: { xs: 300, md: 'auto' },
            border: '1px solid #2a2a2a',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.02)',
            flexShrink: 0
         }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #2a2a2a' }}>
               <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                  Messages
               </Typography>
               <TextField
                  fullWidth
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{
                     '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        '& fieldset': { borderColor: '#374151' },
                        '&:hover fieldset': { borderColor: '#4b5563' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                     },
                     '& .MuiInputBase-input::placeholder': { color: '#9ca3af' }
                  }}
                  InputProps={{
                     startAdornment: <Search sx={{ color: '#9ca3af', mr: 1 }} />
                  }}
               />
            </Box>

            {/* Chat List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
               <List sx={{ p: 0 }}>
                  {filteredChats.map((chat, index) => (
                     <React.Fragment key={chat.id}>
                        <ListItem
                           onClick={() => handleChatSelect(chat)}
                           sx={{
                              cursor: 'pointer',
                           
                              background: selectedChat?.id === chat.id ? 'rgba(21, 7, 213, 0.1)' : 'transparent',
                              '&:hover': { background: 'rgba(212, 200, 200, 0.05)' },
                            //   py: 1.5,
                            //   px: 2
                           }}
                        >
                           <ListItemAvatar>
                              <Badge
                                 overlap="circular"
                                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                 badgeContent={
                                    chat.online ? (
                                       <Box sx={{ 
                                          width: 12, 
                                          height: 12, 
                                          borderRadius: '50%', 
                                          background: '#10b981',
                                          border: '2px solid #1a1a1a'
                                       }} />
                                    ) : null
                                 }
                              >
                                 <Avatar src={chat.avatar} sx={{ width: 35, height: 35 }} />
                              </Badge>
                           </ListItemAvatar>
                           <ListItemText
                              primary={
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 400, fontSize: '14px', color: 'white' }}>
                                       {chat.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '10px', fontWeight: 500 }}>
                                       {chat.time}
                                    </Typography>
                                 </Box>
                              }
                              secondary={
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography 
                                       variant="body2" 
                                       sx={{ 
                                          color: '#9ca3af',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          maxWidth: 200,
                                          fontSize: '12px',
                                          fontWeight: 300
                                       }}
                                    >
                                       {chat.lastMessage}
                                    </Typography 
                                    >
                                    {chat.unread > 0 && (
                                       <Chip 
                                          label={chat.unread} 
                                          size="small" 
                                          sx={{ 
                                             background: '#3b82f6', 
                                             color: 'white',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                    
                                             height: 15,
                                             width: 15,
                                             fontSize: '10px'
                                          }} 
                                       />
                                    )}
                                 </Box>
                              }
                           />
                        </ListItem>
                        {index < filteredChats.length - 1 && <Divider sx={{ borderColor: '#2aa2a' }} />}
                     </React.Fragment>
                  ))}
               </List>
            </Box>
         </Box>

         {/* Right Side - Chat Area */}
         <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            height: { xs: '60vh', md: '100%' },
            minHeight: { xs: 400, md: 'auto' },
            border: '1px solid #2a2a2a'
         }}>
            {selectedChat ? (
               <>
                  {/* Chat Header */}
                  <Box sx={{ 
                     p: "7px", 
                     borderBottom: '1px solid #2a2a2a',
                     background: 'rgba(255, 255, 255, 0.02)',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     flexShrink: 0
                  }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={selectedChat.avatar} sx={{ width: 35, height: 35 }} />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            // alignItems: 'center',
                            gap: 0
                        }}>
                           <Typography variant="" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem', md: '1rem' }, color: 'white',mb:0 }}>
                              {selectedChat.name}
                           </Typography>
                           <Typography variant="caption" sx={{ color: selectedChat.online ? '#10b981' : '#9ca3af' }}>
                              {selectedChat.online ? 'Online' : 'Offline'}
                           </Typography>
                        </Box>
                     </Box>
                     <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton sx={{ color: '#9ca3af', display: { xs: 'none', sm: 'flex' } }}>
                           <Phone />
                        </IconButton>
                        <IconButton sx={{ color: '#9ca3af', display: { xs: 'none', sm: 'flex' } }}>
                           <VideoCall />
                        </IconButton>
                        <IconButton sx={{ color: '#9ca3af' }}>
                           <Info />
                        </IconButton>
                        <IconButton sx={{ color: '#9ca3af' }}>
                           <MoreVert />
                        </IconButton>
                     </Box>
                  </Box>

                  {/* Messages Area */}
                  <Box sx={{ 
                     flex: 1, 
                     p: 2,
                     display: 'flex',
                     flexDirection: 'column',
                     overflow: 'hidden',
                     background: '#0f0f0f'
                  }}>
                     {/* Messages List */}
                     <Box sx={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        mb: 2,
                        '&::-webkit-scrollbar': {
                           width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                           background: '#1a1a1a',
                        },
                        '&::-webkit-scrollbar-thumb': {
                           background: '#374151',
                           borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                           background: '#4b5563',
                        }
                     }}>
                        {messages.map((message) => (
                           <Box key={message.id} sx={{ 
                              display: 'flex', 
                              justifyContent: message.isMe ? 'flex-end' : 'flex-start', 
                              mb: 2 
                           }}>
                              <Box sx={{ 
                                 display: 'flex', 
                                 alignItems: 'flex-end', 
                                 gap: 1,
                                 maxWidth: '70%',
                                 flexDirection: message.isMe ? 'row-reverse' : 'row'
                              }}>
                                 {!message.isMe && (
                                    <Avatar 
                                       src={message.avatar} 
                                       sx={{ width: 32, height: 32, flexShrink: 0 }} 
                                    />
                                 )}
                                 <Paper sx={{
                                    p: 2,
                                    background: message.isMe 
                                       ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                                       : 'rgba(255, 255, 255, 0.05)',
                                    color: message.isMe ? 'white' : '#e5e7eb',
                                    borderRadius: 2,
                                    border: message.isMe 
                                       ? 'none' 
                                       : '1px solid rgba(255, 255, 255, 0.1)',
                                    maxWidth: '100%'
                                 }}>
                                    <Typography variant="body2" sx={{ 
                                       whiteSpace: 'pre-wrap',
                                       wordBreak: 'break-word'
                                    }}>
                                       {message.text}
                                    </Typography>
                                    <Typography variant="caption" sx={{ 
                                       display: 'block', 
                                       mt: 0.5, 
                                       opacity: 0.7,
                                       fontSize: '0.75rem'
                                    }}>
                                       {message.time}
                                    </Typography>
                                 </Paper>
                              </Box>
                           </Box>
                        ))}
                     </Box>

                     {/* Message Input */}
                     <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        alignItems: 'flex-end',
                        background: 'rgba(255, 255, 255, 0.02)',
                        p: 1,
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                     }}>
                        <IconButton sx={{ color: '#9ca3af', flexShrink: 0 }}>
                           <AttachFile />
                        </IconButton>
                        <TextField
                           fullWidth
                           multiline
                           maxRows={4}
                           value={messageInput}
                           onChange={(e) => setMessageInput(e.target.value)}
                           onKeyPress={handleKeyPress}
                           placeholder={`Message ${selectedChat.name}...`}
                           sx={{
                              '& .MuiOutlinedInput-root': {
                                 background: 'rgba(255, 255, 255, 0.05)',
                                 color: 'white',
                                 '& fieldset': { borderColor: 'transparent' },
                                 '&:hover fieldset': { borderColor: 'transparent' },
                                 '&.Mui-focused fieldset': { borderColor: 'transparent' }
                              },
                              '& .MuiInputBase-input::placeholder': { color: '#9ca3af' }
                           }}
                        />
                        <IconButton sx={{ color: '#9ca3af', flexShrink: 0 }}>
                           <EmojiEmotions />
                        </IconButton>
                        <IconButton sx={{ color: '#9ca3af', flexShrink: 0 }}>
                           <Mic />
                        </IconButton>
                        <IconButton 
                           onClick={handleSendMessage}
                           sx={{ 
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                              color: 'white',
                              flexShrink: 0,
                              '&:hover': {
                                 background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                              }
                           }}
                        >
                           <Send />
                        </IconButton>
                     </Box>
                  </Box>
               </>
            ) : (
               /* No Chat Selected */
               <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  color: '#9ca3af',
                  p: 2
               }}>
                  <Box sx={{ 
                     width: { xs: 80, sm: 120 }, 
                     height: { xs: 80, sm: 120 }, 
                     borderRadius: '50%', 
                     background: 'rgba(59, 130, 246, 0.1)',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     mb: 3
                  }}>
                     <Typography variant="h2" sx={{ color: '#3b82f6', fontSize: { xs: '2rem', sm: '3rem' } }}>
                        💬
                     </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                     Welcome to Chat
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 400, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                     Select a conversation from the sidebar to start chatting
                  </Typography>
               </Box>
            )}
         </Box>
      </Box>
   )
}

export default ChatUI
