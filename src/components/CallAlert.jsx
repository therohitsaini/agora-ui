
import {
    Snackbar,
    Slide,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
} from "@mui/material";

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

export default function CallAlert({ rejectCall, incomingCall, acceptCall, open }) {
    console.log("incomingCall", incomingCall);
    return (
        <Snackbar
            open={open}
            TransitionComponent={SlideTransition}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Card
                sx={{
                    minWidth: 400,
                    borderRadius: 3,
                    boxShadow: 6,
                    bgcolor: "background.paper",
                }}
            >
                <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        📞 Incoming {incomingCall.type} call
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        From user: {incomingCall.fromUid}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={acceptCall}
                            sx={{
                                bgcolor: "green.500",
                                "&:hover": { bgcolor: "green.700" },
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={rejectCall}
                        >
                            Reject
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Snackbar>
    );
}
