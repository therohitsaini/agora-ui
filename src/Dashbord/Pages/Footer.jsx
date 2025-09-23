import React from "react";
import { Box, Container, Grid, Typography, Link, Stack, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
    return (
        <Box sx={{ bgcolor: "#1e1e1e", color: "white", py: 6, mt: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Branding */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            MyApp
                        </Typography>
                        <Typography variant="body2">
                            Connect with top doctors, astrologers, and lawyers easily.
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Quick Links
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="inherit" underline="hover">Home</Link>
                            <Link href="#" color="inherit" underline="hover">Services</Link>
                            <Link href="#" color="inherit" underline="hover">About</Link>
                            <Link href="#" color="inherit" underline="hover">Contact</Link>
                        </Stack>
                    </Grid>

                    {/* Services */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Services
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="inherit" underline="hover">Doctor</Link>
                            <Link href="#" color="inherit" underline="hover">Astrology</Link>
                            <Link href="#" color="inherit" underline="hover">Lawyer</Link>
                            <Link href="#" color="inherit" underline="hover">Therapist</Link>
                        </Stack>
                    </Grid>

                    {/* Contact / Social */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Contact
                        </Typography>
                        <Typography variant="body2">Email: info@myapp.com</Typography>
                        <Typography variant="body2">Phone: +91 9876543210</Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                            <IconButton color="inherit" href="#"><FacebookIcon /></IconButton>
                            <IconButton color="inherit" href="#"><TwitterIcon /></IconButton>
                            <IconButton color="inherit" href="#"><InstagramIcon /></IconButton>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Bottom Copyright */}
                <Box textAlign="center" mt={4}>
                    <Typography variant="body2" color="grey.500">
                        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
