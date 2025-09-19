import React from "react";
import { Button, styled } from "@mui/material";

// Custom animated button using MUI styled
const AnimatedButton = styled(Button)(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    padding: "12px 24px",
    fontWeight: 600,
    fontSize: "16px",
    textTransform: "none",
    color: "#fff",
    background: "linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)",
    backgroundSize: "400% 400%",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",

    "&:hover": {
        animation: "gradientBG 3s ease infinite",
        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        transform: "translateY(-2px)",
    },

    "&:active": {
        transform: "translateY(0px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },

    "@keyframes gradientBG": {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
    },
}));

export default function GoogleAnimatedButton({ text = "Click Me", onClick }) {
    return <AnimatedButton onClick={onClick}>{text}</AnimatedButton>;
}
