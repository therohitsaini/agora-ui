import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CallIcon from "@mui/icons-material/Call";
import { Chip, Paper } from "@mui/material";
import navLogo from "../assets/image/call-center.png"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../authProvider/AuthProvider";

function Navbar({ balance,  handleRecharge, }) {

    const [userInfoByID, setUserInfoByID] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const navigator = useNavigate();
    const { logout } = useAuth();

    const getUserByID = async (id) => {
        try {
            setIsLoading(true);
            const url = `${import.meta.env.VITE_BACK_END_URL}/api/users/${id}`;
            const fetchData = await fetch(url, { 
                method: "GET", 
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_user') || ''}`
                } 
            });
            
            const responseData = await fetchData.json();
            
            if (fetchData.ok) {
                setUserInfoByID(responseData.data || responseData);
                console.log("User data set:", responseData.data || responseData);
            } else {
                console.log("API Error:", responseData);
                setUserInfoByID({ walletBalance: 0 }); // Fallback
            }

        } catch (error) {
            console.log("Error fetching user by ID:", error);
            setUserInfoByID({ walletBalance: 0 }); // Fallback
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        const id = localStorage.getItem("user-ID");
        console.log("User ID from localStorage:", id);
        if (id) {
            getUserByID(id);
        } else {
            console.log("No user ID found in localStorage");
        }
    }, [])
    
  

    const logOutButton = () => {
        logout();
        navigator('/');
    }

    return (
        <AppBar position="sticky"
            sx={{
                // boxShadow: 2,
                marginTop: 0,
                bgcolor: " rgb(30, 28, 28)",
                // backgroundColor
                padding: "3px"
            }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <div className="nav-logo h-15  mr-2">
                    <img src={navLogo} alt="Agora Logo" className="h-full w-full object-cover" />
                </div>

                <div className="nav-contemt flex gap-10">
                    <ul className="un-order flex items-center gap-5">
                        <Link to="/home"  >Home</Link>
                        <Link to="/book-appointment">Service</Link>
                        <li>Home</li>
                    </ul>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3
                        }}>
                        <Paper
                            elevation={3}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: 2,
                                py: 0.5,
                                borderRadius: "7px",
                                bgcolor: "#474748",
                                cursor: "pointer",
                                transition: "all 0.3s ease",

                            }}
                        >
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                }}
                            >
                                <AccountBalanceWalletIcon fontSize="small" />
                            </Box>

                            <Box>
                                <Typography sx={{
                                    fontSize: "14px",
                                }} color="#a7a3a3">
                                    Wallet Balance
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "12px", fontWeight: "bold", color: "#9fa1a2a9" }}>
                                    {isLoading ? (
                                        "Loading..."
                                    ) : (
                                        `INR: ${userInfoByID?.walletBalance || 0}.00 Credits`
                                    )}
                                </Typography>
                            </Box>

                            <Chip
                                label="Add Credits"
                                size="small"
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#fff",
                                    borderRadius: "20px",
                                    px: 2,
                                    cursor: "pointer",
                                    background: "linear-gradient(45deg, #6366f1, #3b82f6)",
                                    boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                                    transition: "all 0.3s ease",

                                    "& .MuiChip-label": {
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        letterSpacing: "0.5px",
                                    },
                                }}
                                onClick={() => handleRecharge()}
                            />

                        </Paper>
                        <Button
                            variant=""
                            color="error"
                            onClick={logOutButton}
                            sx={{ fontSize: "14px", color: "red", textTransform: "none" }}
                        >
                            Log Out
                        </Button>
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
