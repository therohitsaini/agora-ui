import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    Paper,
    Grid,
} from '@mui/material';

const professions = [
    { value: 'Doctor', label: 'Doctor' },
    { value: 'Lawyer', label: 'Lawyer' },
    { value: 'Therapist', label: 'Therapist' },
];

export default function AddConsultantForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        profession: '',
        specialization: '',
        licenseNo: '',
        experience: '',
        fees: '',
        bio: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/add-consultant`
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Consultant Added Successfully!");
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    profession: "",
                    specialization: "",
                    licenseNo: "",
                    experience: "",
                    fees: "",
                    bio: "",
                });
            } else {
                alert(data.message || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error, please try again later.");
        }
    };

    return (
        <div className='w-[100%] h-[80%] flex justify-center items-center'>
            <Paper sx={{ maxWidth: "70%", mx: 'auto', p: 4, mt: 4, bgcolor: '#f0e9e9' }}>

                <Box component="form" sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "15px"
                }}
                    onSubmit={handleSubmit} noValidate>
                    <h1 className='heading text-xl font-bold'>Consultant Registration</h1>
                    <div className='flex min-w-full justify-center gap-2 '>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Full Name"
                                name="fullName"
                                sx={{
                                    width: "250px"
                                }}
                                value={formData.fullName}
                                onChange={handleChange}
                                variant="outlined"
                                color="primary"
                                size='small'
                                InputLabelProps={{ style: { color: '#040404', } }}
                                inputProps={{ style: { color: '#282727' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Email"
                                name="email"
                                type="email"
                                sx={{
                                    width: "250px"
                                }}
                                value={formData.email}
                                onChange={handleChange}
                                variant="outlined"
                                color="primary"
                                size='small'
                                InputLabelProps={{ style: { color: '#040404' } }}
                                inputProps={{ style: { color: '#282727' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Password"
                                name="password"
                                type="password"
                                sx={{
                                    width: "250px"
                                }}
                                value={formData.password}
                                onChange={handleChange}
                                variant="outlined"
                                color="primary"
                                size='small'
                                InputLabelProps={{ style: { color: '#040404' } }}
                                inputProps={{ style: { color: '#282727' } }}
                            />
                        </Grid>

                    </div>
                    <div className='flex justify-center gap-2 '>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                sx={{
                                    width: "250px"
                                }}
                                size='small'
                                value={formData.phone}
                                onChange={handleChange}
                                variant="outlined"
                                color="primary"
                                InputLabelProps={{ style: { color: '#040404' } }}
                                inputProps={{ style: { color: '#282727' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                required
                                label="Profession"
                                name="profession"
                                // fullWidth
                                sx={{
                                    width: "250px"
                                }}
                                size='small'
                                value={formData.profession}
                                onChange={handleChange}
                                variant="outlined"
                                color="primary"
                                InputLabelProps={{ style: { color: '#040404' } }}
                                inputProps={{ style: { color: '#282727' } }}
                            >
                                {professions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Specialization"
                                name="specialization"
                                sx={{
                                    width: "250px"
                                }}
                                value={formData.specialization}
                                onChange={handleChange}
                                variant="outlined"
                                color="primary"
                                size='small'
                                InputLabelProps={{ style: { color: '#040404' } }}
                                inputProps={{ style: { color: '#282727' } }}
                            />
                        </Grid>


                    </div>
                    <div className='flex gap-2 justify-center '>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="License / ID Number"
                                name="licenseNo"
                                sx={{
                                    width: "250px"
                                }}
                                value={formData.licenseNo}
                                onChange={handleChange}
                                variant="outlined"
                                size='small'
                                color="primary"
                                InputLabelProps={{ style: { color: '#040404' } }}
                                inputProps={{ style: { color: '#282727' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Years of Experience"
                                name="experience"
                                type="number"
                                sx={{
                                    width: "250px"
                                }}
                                size='small'
                                value={formData.experience}
                                onChange={handleChange}
                                inputProps={{ min: 0 }}
                                variant="outlined"
                                color="primary"
                                InputLabelProps={{ style: { color: '#040404' } }}
                            // inputProps={{ style: { color: '#282727' }, min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label=" Charges per minute"
                                name="fees"
                                type="number"
                                sx={{
                                    width: "250px"
                                }}
                                value={formData.fees}
                                onChange={handleChange}
                                inputProps={{ min: 0 }}
                                variant="outlined"
                                color="primary"
                                size='small'
                                InputLabelProps={{ style: { color: '#040404' } }}
                            // inputProps={{ style: { color: '#282727' }, min: 0 }}
                            />
                        </Grid>

                    </div>
                    <div >
                        <Grid item xs={12}>
                            <TextField
                                label="Brief Bio"
                                name="bio"
                                multiline
                                rows={4}

                                fullWidth
                                value={formData.bio}
                                onChange={handleChange}
                                variant="outlined"
                                color="black"
                                size='small'
                                InputLabelProps={{ style: { color: '#040404' } }}
                                inputProps={{ style: { color: '#282727' } }}
                            />
                        </Grid>
                    </div>
                    <Grid sx={{ display: "flex", justifyContent: "center" }} item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"

                            size="large"
                            sx={{ backgroundColor: '#0a0a0a', '&:hover': { backgroundColor: '#1a1a1b', }, textTransform: "none", px: "40px", }}
                        >
                            Add Consultant
                        </Button>
                    </Grid>

                </Box>
            </Paper >
        </div>
    );
}
