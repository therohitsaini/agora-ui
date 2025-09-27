import { Avatar, Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from "@mui/icons-material/Home";
import InsightsIcon from "@mui/icons-material/Insights";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const menuItems = [
    { text: "Home", icon: <HomeIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/home" },
    { text: "Analytics", icon: <InsightsIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/analytics" },
    { text: "Add Consultant", icon: <PersonAddIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/consultant-root" },
    { text: "Clients", icon: <PeopleIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/clients" },
    { text: "Tasks", icon: <AssignmentIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/tasks" },
];

const secondaryItems = [
    { text: "Settings", icon: <SettingsIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/settings" },
    { text: "About", icon: <InfoIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/about" },
    { text: "Feedback", icon: <HelpOutlineIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/feedback" },
];

function SideDrower() {
    const location = useLocation();

    return (
        <Fragment>
            <div className='side-bar flex flex-col justify-between h-full'>
                <Box>
                    <List sx={{ mt: 10, px: "10px" }}>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        borderRadius: 2,
                                        "&.Mui-selected": {
                                            backgroundColor: "#1e293b",
                                        },
                                        p: "5px",
                                        px: "10px",
                                    }}
                                    selected={location.pathname === item.path}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: "#fff",
                                            minWidth: 22,
                                            mr: 1,
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{ fontSize: "13px", color: "#fff" }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <List sx={{ mt: 2, px: "7px" }}>
                        {
                            secondaryItems.map((item) => (
                                <ListItem key={item.text} sx={{ p: 0 }} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{ borderRadius: 2, px: 1.5, py: 0.75 }}
                                        selected={location.pathname === item.path}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: "#fff",
                                                minWidth: 22,
                                                mr: 1,
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: "13px",
                                                color: "#fff",
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                    </List>

                    <Box
                        sx={{
                            backgroundColor: "#1e293b",
                            p: 2,
                            borderRadius: 2,
                            mt: "auto",
                            mb: 2,
                        }}
                    >
                        <Typography fontWeight="bold" fontSize={14}>
                            Plan about to expire
                        </Typography>
                        <Typography fontSize={12} sx={{ color: "#94a3b8", mb: 1 }}>
                            Enjoy 10% off when renewing your plan today.
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: "#f1f5f9",
                                color: "#0f172a",
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor: "#e2e8f0",
                                },
                            }}
                        >
                            Get the discount
                        </Button>
                    </Box>
                </Box>

                <div>
                    <Divider sx={{ borderColor: "#334155" }} />
                    <Box display="flex" alignItems="center" p={1.5}>
                        <Avatar src="/avatar.png" />
                        <Box ml={1.5} flexGrow={1}>
                            <Typography fontWeight="bold" fontSize={14}>
                                Riley Carter
                            </Typography>
                            <Typography fontSize={12} sx={{ color: "#94a3b8" }}>
                                riley@email.com
                            </Typography>
                        </Box>
                    </Box>
                </div>
            </div>
        </Fragment>
    );
}

export default SideDrower;
