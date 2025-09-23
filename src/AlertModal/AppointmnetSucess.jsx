import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Slide,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Optional animation for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppointmnetSucess({ open, onClose }) {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ textAlign: "center" }}>
                <CheckCircleOutlineIcon
                    color="success"
                    sx={{ fontSize: 60, mb: 1 }}
                />
                <Typography variant="h5" fontWeight="bold">
                    Appointment Booked!
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    Your appointment has been successfully scheduled.
                    We’ll notify you with further details.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{ textTransform: "none" }}
                >
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
}
