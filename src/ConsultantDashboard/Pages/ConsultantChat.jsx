import React, { useState, useEffect } from 'react'
import { Box, Typography, Avatar, TextField, IconButton, Paper, List, ListItem, ListItemAvatar, ListItemText, Divider, Badge, Chip } from '@mui/material'
import { Send, Search, MoreVert, Phone, VideoCall, Info, AttachFile, EmojiEmotions, Mic } from '@mui/icons-material'
import ChatBox from '../../components/ChatBox'
import { Fragment } from 'react'

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

function ConsultantChat() {
   const [selectedChat, setSelectedChat] = useState(null)
   const [searchTerm, setSearchTerm] = useState('')
   const [chats, setChats] = useState(mockChats)
   const currentUserId = localStorage.getItem('user-ID') || '68cd21a38f964c2597d80838'

   // Filter chats based on search
   const filteredChats = chats.filter(chat => 
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
   )

   // Get room ID for selected chat
   const getRoomId = (chatId) => {
      return ['chat', currentUserId, chatId].sort().join(':')
   }

   const handleChatSelect = (chat) => {
      setSelectedChat(chat)
      // Mark messages as read
      setChats(prev => prev.map(c => 
         c.id === chat.id ? { ...c, unread: 0 } : c
      ))
   }

   return (
      <Box sx={{ 
         display: 'flex', 
         height: '80vh', 
         background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
         color: 'white',
      
      }}>
         {/* Left Sidebar - Chat List */}
         <Box sx={{ 
            width: 350, 
            border: '1px solid #2a2a2a',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.02)',
            
         }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #2a2a2a' }}>
               <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
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
            <Box sx={{ flex: 1, overflowY: 'auto', border: '1px solid red', }}>
               <List sx={{ p: 0 }}>
                  {filteredChats.map((chat, index) => (
                     <Fragment key={chat.id}>
                        <ListItem
                           onClick={() => handleChatSelect(chat)}
                           sx={{
                              cursor: 'pointer',
                              background: selectedChat?.id === chat.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                              '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                              // py: 2,
                              // px: 2,
                              // border: '1px solid blue',

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
                                          border: '2px solid red'
                                       }} />
                                    ) : null
                                 }
                              >
                                 <Avatar src={chat.avatar} sx={{ width: 40, height: 40 }} />
                              </Badge>
                           </ListItemAvatar>
                           <ListItemText
                              primary={
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 400,fontSize: '14px' }}>
                                       {chat.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#9ca3af',fontSize: '10px', fontWeight:500 }}>
                                       {chat.time}
                                    </Typography>
                                 </Box>
                              }
                              secondary={
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  }}>
                                    <Typography 
                                       variant="body2" 
                                       sx={{ 
                                          color: '#9ca3af',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          maxWidth: 200,
                                          fontSize: '12px',
                                          fontWeight:300
                                       }}
                                    >
                                       {chat.lastMessage}
                                    </Typography>
                                    {chat.unread > 0 && (
                                       <Chip 
                                          label={chat.unread} 
                                          size="small" 
                                          sx={{ 
                                             background: '#3b82f6', 
                                             color: 'white',
                                             height: 20,
                                             fontSize: '0.75rem'
                                          }} 
                                       />
                                    )}
                                 </Box>
                              }
                           />
                        </ListItem>
                        {index < filteredChats.length - 1 && <Divider sx={{ borderColor: '#2a2a2a' }} />}
                     </Fragment>
                  ))}
               </List>
            </Box>
         </Box>

         {/* Right Side - Chat Area */}
         <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid purple', }}>
            {selectedChat ? (
               <>
                  {/* Chat Header */}
                  <Box sx={{ 
                     p: 2, 
                     borderBottom: '1px solid blue',
                     background: 'rgba(255, 255, 255, 0.02)',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     border: '1px solid red',
                  }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid red', }}>
                        <Avatar src={selectedChat.avatar} sx={{ width: 40, height: 40 }} />
                        <Box>
                           <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {selectedChat.name}
                           </Typography>
                           <Typography variant="caption" sx={{ color: selectedChat.online ? '#10b981' : '#9ca3af' }}>
                              {selectedChat.online ? 'Online' : 'Offline'}
                           </Typography>
                        </Box>
                     </Box>
                     <Box sx={{ display: 'flex', gap: 1, border: '1px solid red', }}>
                        <IconButton sx={{ color: '#9ca3af' }}>
                           <Phone />
                        </IconButton>
                        <IconButton sx={{ color: '#9ca3af' }}>
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

                  {/* Chat Messages Area */}
                  <Box sx={{ flex: 1, p: 2, border: '1px solid red',height:"40vh"  }}>
                     <ChatBox 
                        roomId={getRoomId(selectedChat.id)}
                        toUid={selectedChat.id}
                     
                        sx={{
                          border: '1px solid blue',
                        }}
                        placeholder={`Message ${selectedChat.name}...`}
                     />
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
                  height:"40vh",
                  border: '4px solid blue',
               }}>
                  <Box sx={{ 
                     width: 120, 
                     height: 120, 
                     borderRadius: '50%', 
                     background: 'rgba(59, 130, 246, 0.1)',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     mb: 3
                  }}>
                     <Typography variant="h2" sx={{ color: '#3b82f6' }}>💬</Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                     Welcome to Chat
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 400 }}>
                     Select a conversation from the sidebar to start chatting with your clients
                  </Typography>
               </Box>
            )}
         </Box>
      </Box>
   )
}

export default ConsultantChat