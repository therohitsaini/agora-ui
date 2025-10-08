import React from "react";
import {
   Card,
   CardContent,
   Avatar,
   Typography,
   Button,
   Box,
   Chip,

   Divider,
   Stack,

} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import { Fragment } from "react";
import { Link } from "react-router-dom";



function AstrologerCard({ id, photo, name, specialization, rating, experience, orders, price, discount, language, consultantStatus }) {

   return (
      <Fragment>
         <Link to={`/consultant-major-details/${id}`}>
            <Card
               sx={{
                  display: "flex",
                  // alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  background: "white",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  color: "black",
                  position: "relative",
                  overflow: "hidden",

                  "&:hover": {
                     transform: "translateY(-2px)",
                     boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                     // border: "1px solid rgba(59, 130, 246, 0.3)",
                  },
                  transition: "all 0.3s ease",
               }}
            >
               {/* Background Pattern */}
               <Box
                  sx={{
                     position: "absolute",
                     top: 0,
                     right: 0,
                     width: "100px",
                     height: "100px",
                     background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                     borderRadius: "50%",
                     transform: "translate(30px, -30px)",
                  }}
               />

               {/* Avatar Section */}
               <Box sx={{ position: "relative", mr: 3, height: "100%" }}>
                  <Avatar
                     src={photo || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"}
                     alt="Astrologer"
                     sx={{
                        width: 80,
                        height: 80,
                        border: "3px solid #3b82f6",
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                     }}
                  />
                  {/* Perfect Status Dot - Online/Offline */}
                  <Box
                     sx={{
                        position: 'absolute',
                        bottom: 5,
                        right: 10,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: consultantStatus ? '#10b981' : '#ef4444', // Green for online, Red for offline
                        border: '2px solid #ffffff',
                        boxShadow: consultantStatus 
                           ? '0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)'
                           : '0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)',
                        animation: consultantStatus ? 'pulse 2s infinite' : 'none', // Only animate when online
                        '@keyframes pulse': {
                           '0%': {
                              boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                           },
                           '70%': {
                              boxShadow: '0 0 0 8px rgba(16, 185, 129, 0)',
                           },
                           '100%': {
                              boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)',
                           },
                        },
                        zIndex: 1,
                        '&::before': {
                           content: '""',
                           position: 'absolute',
                           top: '50%',
                           left: '50%',
                           transform: 'translate(-50%, -50%)',
                           width: '6px',
                           height: '6px',
                           borderRadius: '50%',
                           backgroundColor: '#ffffff',
                           animation: consultantStatus ? 'innerPulse 1.5s infinite' : 'none', // Only animate when online
                        },
                        '@keyframes innerPulse': {
                           '0%, 100%': {
                              opacity: 1,
                              transform: 'translate(-50%, -50%) scale(1)',
                           },
                           '50%': {
                              opacity: 0.8,
                              transform: 'translate(-50%, -50%) scale(0.8)',
                           },
                        },
                     }}
                  />
               </Box>

               <CardContent sx={{ flex: 1, p: "0 !important", }}>
                  {/* Name + Verified */}
                  <Stack sx={{ display: 'flex' }} spacing={1} mb={1}>
                     <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }} alignItems="start" spacing={1}>
                        <Typography variant="h6" fontWeight="700" sx={{ color: "black" }}>
                           {name || "Advit Sharma"}
                        </Typography>
                        <VerifiedIcon fontSize="small" sx={{ color: "#10b981" }} />
                     </Box>


                  </Stack>

                  {/* Specialization */}
                  <Typography variant="body2" sx={{ color: "#000", opacity: 0.5, mb: 1 }}>
                     {specialization || "Vedic Astrology • Numerology • Vastu Shastra"}
                  </Typography>

                  {/* Rating & Experience */}
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                     <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                        <Typography variant="body2" sx={{ color: "green", fontWeight: "600" }}>
                           {rating || 4.9}
                        </Typography>
                     </Stack>
                     <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(148, 163, 184, 0.3)" }} />
                     <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                           {experience || 8} Years Exp
                        </Typography>
                     </Stack>
                  </Stack>

                  {/* Languages */}
                  <Stack direction="row" spacing={1} mb={2}>
                     {language?.map((lang) => (
                        <Chip
                           key={lang}
                           label={lang}
                           size="small"
                           sx={{
                              bgcolor: "rgba(148, 163, 184, 0.1)",
                              color: "#cbd5e1",
                              fontSize: "11px",
                              height: "24px",
                           }}
                        />
                     ))}
                  </Stack>

                  {/* Stats */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                     <Stack direction="row" alignItems="center" spacing={1}>
                        <PeopleIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                           {orders || 16945} Orders
                        </Typography>
                     </Stack>
                     <Box textAlign="right">
                        <Typography
                           variant="body2"
                           sx={{
                              textDecoration: "line-through",
                              color: "#64748b",
                              fontSize: "12px",
                           }}
                        >
                           {price}/min
                        </Typography>
                        <Typography variant="h6" sx={{ color: "green", fontWeight: "700", fontSize: "15px" }}>
                           {discount || 5}/min
                        </Typography>
                     </Box>
                  </Stack>

                  {/* Availability Bar
            <Box mb={2}>
               <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                     Available Today
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: "600" }}>
                     85% Booked
                  </Typography>
               </Stack>
               <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{
                     height: 6,
                     borderRadius: 3,
                     bgcolor: "rgba(148, 163, 184, 0.1)",
                     "& .MuiLinearProgress-bar": {
                        bgcolor: "#10b981",
                        borderRadius: 3,
                     },
                  }}
               />
            </Box> */}
               </CardContent>

               {/* Call Button */}
               {/* <Button
            variant="contained"
            sx={{
               ml: 2,
               background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
               "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  transform: "translateY(-1px)",
               },
               borderRadius: 2,
               px: 2,
               py: 1,
               textTransform: "none",
               fontWeight: "600",
               boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
            }}
            startIcon={<PhoneIcon />}
         >
            Call Now
         </Button> */}
            </Card>
         </Link>
      </Fragment>
   );
}
export default AstrologerCard;