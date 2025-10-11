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
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";

function Navbar() {

    const [userInfoByID, setUserInfoByID] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const navigator = useNavigate();
    const { logout } = useAuth();
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
    const [anchorElUser, setAnchorElUser] = useState(null);
    const profileOptions = [
        { text: "Profile", path: "/user-profile-section" },
        { text: "Settings", path: "/dashboard/settings" },
        { text: "Logout", path: "/dashboard/logout" },
    ]

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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

    const handleRecharge = async () => {
        const url = `${import.meta.env.VITE_BACK_END_URL}/api/razerpay-create-order/create-order`
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amountINR: 1, userId })
        });
        const data = await res.json();
        const order = data.order;

        console.log("TEXT", order)
        // if()
        const options = {
            key: "rzp_test_RJ31PhSmp5nbLQ",
            amount: order?.amount,
            currency: order?.currency,
            name: "My Calling App",
            description: "Wallet Recharge",
            order_id: order?.id,
            handler: async function (response) {

                await fetch(`${import.meta.env.VITE_BACK_END_URL}/api/razerpay-create-order/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...response, userId, amountINR: 1 })
                });
                alert("Recharge Success! Refresh wallet balance.");
            },
            // prefill: { name: currentUser?.name, email: currentUser?.email, contact: "9999999999" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };



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
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {/* {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={setting === 'Logout' ? logOutButton : handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))} */}
                                {
                                    profileOptions.map((option) => (
                                        
                                        <MenuItem key={option.text} onClick={() => handleCloseUserMenu(option.path)}>
                                            <Typography sx={{ textAlign: 'center' }}>{option.text}</Typography>
                                        </MenuItem>
                                    ))
                                }
                            </Menu>
                        </Box>

                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
