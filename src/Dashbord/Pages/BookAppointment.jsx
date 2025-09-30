import React, { Fragment, useRef, useState } from "react";
import { Box, Container, Typography, Button, Stack, Grid, Card, CardContent, TextField, MenuItem, Autocomplete, TextareaAutosize, } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import PaymentIcon from "@mui/icons-material/Payment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Navbar from "../../components/Navbar";
import Footer from "./Footer";
import AnimatedHero from "../../components/AnimatedHero";
import appointmentImage from "../../assets/image/consult.jpg"
import AppointmnetSucess from "../../AlertModal/AppointmnetSucess.jsx"



const services = [
    {
        id: 1,
        title: "Doctor Consultation",
        icon: <LocalHospitalIcon fontSize="large" color="error" />,
        desc: "Get health advice from experienced doctors."
    },
    {
        id: 2,
        title: "Astrology Consultation",
        icon: <AutoAwesomeIcon fontSize="large" color="warning" />,
        desc: "Discover insights about your future with trusted astrologers."
    },
    {
        id: 3,
        title: "Lawyer Consultation",
        icon: <GavelIcon fontSize="large" color="primary" />,
        desc: "Talk with professional lawyers for legal support and advice."
    }
];

const features = [
    { id: 1, title: "Trusted Experts", icon: <ThumbUpIcon color="success" />, desc: "Connect with verified consultants." },
    { id: 2, title: "Secure Payments", icon: <PaymentIcon color="info" />, desc: "All transactions are safe and protected." },
    { id: 3, title: "Easy Booking", icon: <AccessTimeIcon color="secondary" />, desc: "Book appointments in just a few clicks." },
    { id: 4, title: "Privacy First", icon: <SecurityIcon color="error" />, desc: "Your personal data stays confidential." }
];

const locations = ["IN", "Los Angeles", "Chicago"];
const cars = ["Sedan", "SUV", "Hatchback"];
const top100Films = [
    { label: 'Doctor', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'Astrologer', year: 1974 },
    { label: 'Lowyer', year: 2008 },
    { label: 'Other', year: 1957 },
]

const BookAppointment = () => {
    const [value, setValue] = useState()
    const [consultType, setConsultType] = useState()
    const [openSuccess, setOpenSuccess] = useState(false);
    const userName = useRef("")
    const contactNumber = useRef()

    const appointmentDate = useRef("")
    const notes = useRef("")
    const startingTime = useRef("")
    const endTime = useRef("")

    const appointmentHandler = async (e) => {
        e.preventDefault();
        const paylod = {
            userName: userName.current.value,
            contactNumber: contactNumber.current.value,
            appointmentDate: appointmentDate.current.value,
            notes: notes.current.value,
            startingTime: startingTime.current.value,
            endTime: endTime.current.value,
            consultType: consultType
        }

        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-consltor/book-appointment`
            const fetchURL = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paylod),
            })
            const data = await fetchURL.json()
            if (fetchURL.ok) {
                alert("Sucess")
                setOpenSuccess(true)
            }
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <Fragment>
            <Navbar />
            <AppointmnetSucess open={openSuccess} onClose={() => setOpenSuccess(false)} />
            <Box>
                <AnimatedHero>

                    <Box
                        sx={{
                            bgcolor: "linear-gradient(135deg, #ff1744, #ff5252)",
                            color: "white",
                            minHeight: "90vh",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Container maxWidth="lg" sx={{}}>
                            <Stack spacing={3}>
                                <Typography variant="h2" fontWeight="bold" sx={{ textTransform: "uppercase" }}>
                                    Book Your Appointment Online
                                </Typography>
                                <Typography variant="h6" sx={{ maxWidth: "600px" }}>
                                    Connect with doctors, astrologers, and lawyers from anywhere. Easy, secure, and fast booking process.
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        size="large"

                                        sx={{
                                            bgcolor: "#ffff",
                                            color: "black",
                                            textTransform: "none",
                                            px: "20px",
                                            "&:hover": {
                                                bgcolor: "#110f10"
                                            }
                                        }}
                                    >
                                        Book Appointment
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<AccessTimeIcon />}
                                        sx={{ textTransform: "none", color: "white", borderColor: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
                                    >
                                        Learn More
                                    </Button>
                                </Stack>
                            </Stack>
                        </Container>
                    </Box>
                </AnimatedHero>
                <Box sx={{ py: 8, bgcolor: "#f9f9f9", }}>
                    <Container maxWidth="">
                        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                            Our Services
                        </Typography>
                        <Grid spacing={2} mt={5} sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            gap: "10px"
                        }}>
                            {
                                services.map((service) => (
                                    <Grid key={service.id}>
                                        <Card
                                            sx={{
                                                textAlign: "center",
                                                p: 3,
                                                borderRadius: 3,
                                                transition: "0.3s",
                                            }}
                                        >
                                            {service.icon}
                                            <CardContent>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    {service.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {service.desc}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </Container>
                </Box>

                <Box
                    sx={{
                        py: 8
                    }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                            Why Choose Us
                        </Typography>
                        <Grid container spacing={5} mt={2} justifyContent="center">
                            {features.map((feature) => (
                                <Grid item xs={12} sm={6} md={3} key={feature.id}>
                                    <Card
                                        sx={{
                                            textAlign: "center",
                                            p: 3,
                                            borderRadius: 3,
                                            height: "100%",
                                            transition: "0.3s",
                                            "&:hover": { boxShadow: 6 }
                                        }}
                                    >
                                        {feature.icon}
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {feature.desc}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
                <Box >

                    <Box
                        sx={{
                            position: "relative",
                            height: "100vh",
                            backgroundImage: `url(${appointmentImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                bgcolor: "rgba(63, 81, 181, 0.6)",
                            },
                        }}
                    >
                        <Container

                            sx={{
                                position: "relative",
                                zIndex: 1,
                                py: 10,
                                textAlign: "center",
                                color: "white",
                                width: "70%"

                            }}
                        >
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Fast And Easy Way to
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Book Appointment
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 5 }}>
                                Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever.
                            </Typography>

                            <Box
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 2,
                                    p: 4,
                                    mt: 3,


                                }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}>
                                    <div className="mui-label flex gap-5 justify-center">

                                        <TextField
                                            name="userName"
                                            inputRef={userName}
                                            sx={{ width: "100%" }}
                                            size="small"
                                            label="Name">

                                        </TextField>
                                        <TextField
                                            inputRef={contactNumber}
                                            name="contactNumber"
                                            sx={{ width: "100%" }}
                                            size="small"
                                            label="Number">
                                        </TextField>
                                        <Autocomplete
                                            disablePortal
                                            name="consultType"
                                            size="small"
                                            options={top100Films}
                                            sx={{ width: "100%" }}
                                            onChange={(e, newValue) => setConsultType(newValue?.label || "")}
                                            renderInput={(params) => <TextField {...params} label="Consultor" />}
                                        />
                                    </div>
                                    <div className="mui-label-2nd-row flex gap-5 justify-center">

                                        <input
                                            type="date"
                                            name="appointmentDate"
                                            ref={appointmentDate}
                                            id="date"
                                            value={value}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="
          w-full
          rounded-[3px]
          border border-gray-300
        
          
          text-sm
          text-gray-700
          shadow-sm
          focus:border-blue-500
          focus:ring focus:ring-blue-200 focus:ring-opacity-50
        "
                                        />
                                        <input
                                            name="startingTime"
                                            type="time"
                                            id="startTime"
                                            ref={startingTime}
                                            // value={startTime}


                                            className="
            w-full
            rounded-[3px]
            border border-gray-300
         
            py-2
            text-sm
            text-gray-700
            shadow-sm
            focus:border-blue-500
            focus:ring focus:ring-blue-200 focus:ring-opacity-50
          "
                                        />
                                        <input
                                            type="time"
                                            id="endTIme"
                                            name="endTime"
                                            ref={endTime}
                                            // value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}

                                            className="
            w-full
            rounded-[3px]
            border border-gray-300
         
            py-2
            text-sm
            text-gray-700
            shadow-sm
            focus:border-blue-500
            focus:ring focus:ring-blue-200 focus:ring-opacity-50
          "
                                        />
                                    </div>
                                    <div>
                                        <textarea name="notes" ref={notes} id="message" rows="4"
                                            class="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-[4px] border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Write your thoughts here...">
                                        </textarea>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={appointmentHandler}
                                            variant="contained"
                                            sx={{
                                                bgcolor: "black",
                                                textTransform: "none",
                                                px: 5
                                            }}
                                        >Book Appointment</Button>
                                    </div>
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </Box>
            <Footer />

        </Fragment >
    );
};

export default BookAppointment;
