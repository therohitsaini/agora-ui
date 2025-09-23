import React from "react";
import { Box, Container, Typography, Grid, TextField, MenuItem, Button } from "@mui/material";

const locations = ["New York", "Los Angeles", "Chicago"];
const cars = ["Sedan", "SUV", "Hatchback"];

const HeroBooking = () => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "100vh",
                backgroundImage: "url('/path-to-your-image.jpg')", // replace with your image
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(63, 81, 181, 0.6)", // overlay color
                },
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    position: "relative",
                    zIndex: 1,
                    py: 10,
                    textAlign: "center",
                    color: "white",
                }}
            >
                {/* Headings */}
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Fast And Easy Way To
                </Typography>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Rent A Car
                </Typography>
                <Typography variant="body1" sx={{ mb: 5 }}>
                    Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever.
                </Typography>

                {/* Booking Form */}
                <Box
                    sx={{
                        bgcolor: "white",
                        borderRadius: 2,
                        p: 4,
                        mt: 3,
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField select fullWidth label="Location" variant="outlined">
                                {locations.map((loc) => (
                                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Full Name" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Phone Number" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField select fullWidth label="Cars" variant="outlined">
                                {cars.map((car) => (
                                    <MenuItem key={car} value={car}>{car}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth type="date" variant="outlined" InputLabelProps={{ shrink: true }} label="Date" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth type="time" variant="outlined" InputLabelProps={{ shrink: true }} label="Time" />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Book Now
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroBooking;
