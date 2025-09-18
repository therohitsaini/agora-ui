import React from "react";
import { Modal, Box, Typography, IconButton, Fade, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const InsufficientBalanceAlert = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 500 } }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "rgba(255, 255, 255, 0.2)", 
                        backdropFilter: "blur(15px)",
                        WebkitBackdropFilter: "blur(15px)", 
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        borderRadius: 4,
                        p: 4,
                        width: 500,
                        textAlign: "center",
                        outline: "none",
                        // border: "1px solid rgba(255,255,255,0.3)",
                    }}
                >
                 
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 12,
                            top: 12,
                            color: "grey.200",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box
                        sx={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            bgcolor: "error.light",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                            fontSize: "2rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        }}
                    >
                        😮‍💨
                    </Box>

                    <Typography variant="h6" fontWeight="600" color="white" gutterBottom>
                        Insufficient Balance
                    </Typography>

                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        Call cannot be connected. Please recharge your account to continue.
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
};

export default InsufficientBalanceAlert;
