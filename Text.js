import { Outlet, useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";

const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
];

export default function DashboardLayout() {
    const navigate = useNavigate();

    return (
        <Box display="flex" height="100vh">
            {/* Sidebar */}
            <Box
                sx={{
                    width: 240,
                    backgroundColor: "#111827",
                    color: "#fff",
                    p: 2,
                }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)}>
                                <ListItemIcon sx={{ color: "#fff", minWidth: 32, mr: 1 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{ fontSize: "14px", color: "#fff" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Content area */}
            <Box flexGrow={1} p={3} sx={{ backgroundColor: "#0f172a", color: "#fff" }}>
                <Outlet /> {/* Route components render here */}
            </Box>
        </Box>
    );
}
