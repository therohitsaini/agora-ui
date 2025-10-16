import { Avatar, Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { Fragment, useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from "@mui/icons-material/Home";
import InsightsIcon from "@mui/icons-material/Insights";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useAuth } from '../../authProvider/AuthProvider';
import HistoryIcon from '@mui/icons-material/History';
import { allUserDetailsContext } from '../ApiContext/ApiContextUserData';

const options = [
    'My Profile',
    'settings',
    'Log Out',

];




const menuItems = [
    { text: "Home", icon: <HomeIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/home" },
    { text: "Analytics", icon: <InsightsIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/analytics" },
    { text: "Add Consultant", icon: <PersonAddIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/consultant-root" },
    { text: "Clients", icon: <PeopleIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/clients" },
    { text: "Call History", icon: <HistoryIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/admin/admin-tabs" },
    
    {
        header: "Staff Management",
        items: [
            { text: "Staff", icon: <PeopleIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/admin/staff-root" },
        ],
    }
];

const secondaryItems = [
    { text: "Settings", icon: <SettingsIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/settings" },
    { text: "About", icon: <InfoIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/about" },
    { text: "Feedback", icon: <HelpOutlineIcon sx={{ fontSize: "16px" }} />, path: "/dashboard/feedback" },
];



function SideDrower({ menuItemConsultant, profileOptions }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    console.log("user", user)


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuSelect = (option) => {
        console.log("option", option)
        if (option === '/consultant-dashboard/profile') {
            navigate('/consultant-dashboard/profile');
        }
        if (option === 'Settings') {
            navigate('/consultant-dashboard/settings');
        }
        if (option === '/dashboard/profile') {
            navigate('/dashboard/profile');
        }
        if (option === '/dashboard/logout') {
            logout();
            navigate('/');
        }

        if (option === '/consultant-dashboard/logout') {
            logout();
            navigate('/');
        }
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <div className='side-bar flex flex-col justify-between h-full '>
                <Box>
                    <List sx={{ mt: 10, px: "10px" }}>
                        { (menuItemConsultant ? menuItemConsultant : menuItems).map((item) => {
                            // Render a section with header + nested items
                            if (item.header && Array.isArray(item.items)) {
                                return (
                                    <Box key={item.header} sx={{ mb: 1.5 }}>
                                        <Typography sx={{  py: 0.5, color: "#94a3b8", fontSize: 12, textTransform: "none" }}>
                                            {item.header}
                                        </Typography>
                                        {item.items.map((sub) => (
                                            <ListItem key={sub.text} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={sub.path}
                                                    sx={{
                                                        borderRadius: 2,
                                                        "&.Mui-selected": { backgroundColor: "#1e293b" },
                                                        p: "5px",
                                                        px: "10px",
                                                    }}
                                                    selected={location.pathname === sub.path}
                                                >
                                                    <ListItemIcon sx={{ color: "#fff", minWidth: 22, mr: 1 }}>
                                                        {sub.icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={sub.text} primaryTypographyProps={{ fontSize: "13px", color: "#fff" }} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </Box>
                                );
                            }

                            // Render a regular flat item
                            return (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            borderRadius: 2,
                                            "&.Mui-selected": { backgroundColor: "#1e293b" },
                                            p: "5px",
                                            px: "10px",
                                        }}
                                        selected={location.pathname === item.path}
                                    >
                                        <ListItemIcon sx={{ color: "#fff", minWidth: 22, mr: 1 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "13px", color: "#fff" }} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        }) }
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

                    {/* <Box
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
                    </Box> */}
                </Box>
                <div className=''>
                    <Divider sx={{ borderColor: "#334155" }} />
                    <div className='flex gap-4 '>
                        <Box display="flex" alignItems="center">
                            <Avatar src={user?.avatar || "https://img.freepik.com/free-photo/user-sign-icon-front-side_187299-47522.jpg?t=st=1759985913~exp=1759989513~hmac=c690e05b2ca433abd852b66886643ef74fd207f2e0476ac9bcdb5f5a6c4931c8&w=1480"} />
                            <Box ml={1.5} flexGrow={1}>
                                <Typography fontWeight="bold" fontSize={14}>
                                    {user?.fullName || "User"}
                                </Typography>
                                <Typography fontSize={12} sx={{ color: "#94a3b8",fontSize:"10px" }}>
                                    {user?.email || "user@email.com"}
                                </Typography>
                            </Box>
                        </Box>
                        <div className='settings   flex justify-center  items-center'>
                            <div className=''>
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={open ? 'long-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    sx={{ color: "white" }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{
                                        paper: {
                                            style: {
                                                // maxHeight: ITEM_HEIGHT * 4.5,
                                                width: '20ch',
                                            },
                                        },
                                        list: {
                                            'aria-labelledby': 'long-button',
                                        },
                                    }}
                                >
                                    {
                                        profileOptions?.map((option) => (
                                            <MenuItem
                                                sx={{
                                                    fontSize: "15px",
                                                    // fontWeight:"bold"
                                                }}
                                                key={option}
                                                // selected={location.pathname === option.path}
                                                onClick={() => handleMenuSelect(option.path)}
                                            >
                                                {option.text}
                                            </MenuItem>
                                        ))}
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SideDrower;
