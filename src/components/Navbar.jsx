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

function Navbar({ balance, logOutButton, handleRecharge, userInfoByID }) {




    return (
        <AppBar position="static"
            sx={{
                // boxShadow: 2,
                marginTop: 0,
                bgcolor: " rgba(52, 49, 49, 0.668)",
                padding: "3px"
            }}>
            <Toolbar>
                <div className="nav-logo h-15  mr-2">
                    <img src={navLogo} alt="Agora Logo" className="h-full w-full object-cover" />
                </div>
                <Typography
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{
                        flexGrow: 1,
                        fontWeight: "bold"
                    }}
                >

                </Typography>

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
                                INR: {userInfoByID?.walletBalance}.00 Credits
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
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
