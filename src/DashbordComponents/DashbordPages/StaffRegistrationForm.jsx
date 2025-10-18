import { Box, Button, TextField, Autocomplete, Checkbox } from '@mui/material'
import React, { Fragment } from 'react'
import { ArrowBack, ArrowRight } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify';
import { ScaleLoader } from 'react-spinners';

const DarkTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": { borderColor: "white" },
        "&:hover fieldset": { borderColor: "#26c6da" },
        "&.Mui-focused fieldset": { borderColor: "#00acc1" },
        borderRadius: "3px",
    },
    "& .MuiInputLabel-root": {
        color: "white",
        fontSize: "13px",

    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#00acc1",
    },
    "& .MuiInputBase-input": {
        color: "#fff",
        fontSize: "12px",
        padding: "10px 10px",

    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#555",
    },
    "& .MuiOutlinedInput-root.Mui-disabled": {
        "& fieldset": {
            borderColor: "#444",
        },
    },
});
const roleOptions = [
    { label: 'admin', value: 'admin' },
    { label: 'manager', value: 'manager' },
    { label: 'consultant', value: 'consultant' },
    { label: 'supervisor', value: 'supervisor' },
    { label: 'editor', value: 'editor' },
    { label: 'writer', value: 'writer' },
    { label: 'designer', value: 'designer' },
    { label: 'developer', value: 'developer' },
    { label: 'tester', value: 'tester' },
    { label: 'support', value: 'support' },
    { label: 'other', value: 'other' },
];

function StaffRegistrationForm({ isHandler, createEmployee, handleChange, employeeData, role, setRole }) {
    return (
        <Fragment>
            <ToastContainer />
            <Box sx={{ width: "100%", px: 20, height: "50vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>

                <Box sx={{ mt: 5 }}>

                    <div className='text-white mt-10 text-xl font-bold underline'>Add New Employee</div>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <div style={{ background: "#000", px: "20px", display: "flex", gap: "10px", width: "100%" }}>
                        <DarkTextField label="Full Name" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.fullname} onChange={handleChange} name="fullname" />
                        <DarkTextField label="Email" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.email} onChange={handleChange} name="email" />
                        <DarkTextField label="Phone Number" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.phone} onChange={handleChange} name="phone" />


                    </div>
                    <div style={{ background: "#000", px: "20px", display: "flex", gap: "10px", width: "100%" }}>
                        <DarkTextField label="Password" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.password} onChange={handleChange} name="password" />
                        <DarkTextField label="Address" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.address} onChange={handleChange} name="address" />
                        <DarkTextField label="City" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.city} onChange={handleChange} name="city" />



                    </div>
                    <div style={{ background: "#000", px: "20px", display: "flex", gap: "10px", width: "100%" }}>
                        <DarkTextField label="State" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.state} onChange={handleChange} name="state" />
                        <DarkTextField label="Zip" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.zip} onChange={handleChange} name="zip" />
                        <DarkTextField label="Country" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.country} onChange={handleChange} name="country" />

                    </div>
                    <div style={{ background: "#000", px: "20px", display: "flex", gap: "10px", width: "100%" }}>
                        <DarkTextField label="Date of Birth" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.dateOfBirth} onChange={handleChange} name="dateOfBirth" />
                        <DarkTextField label="Gender" required variant="outlined" size="small" sx={{ mb: 2, width: "100%" }} value={employeeData.gender} onChange={handleChange} name="gender" />
                        <Autocomplete
                            options={roleOptions}
                            value={roleOptions.find(o => o.value === role) || null}
                            onChange={(e, newValue) => {
                                setRole(newValue?.value ?? '')
                                console.log(newValue?.value)
                            }}
                            sx={{ mb: 2, width: "100%", backgroundColor: "#000" }}
                            getOptionLabel={(option) => option?.label ?? ''}
                            isOptionEqualToValue={(opt, val) => opt.value === val?.value}
                            renderInput={(params) => (
                                <DarkTextField
                                    {...params}
                                    label="Role"
                                    required
                                    variant="outlined"
                                    size="small"
                                    sx={{  backgroundColor: "#000" }}
                                />
                            )}
                        />
                    </div>
                    <div style={{ background: "#000",  display: "flex", gap: "5px", width: "100%"}}>
                        <Checkbox
                            checked={employeeData.isActive ? true : false}
                            onChange={handleChange}
                            name="isActive"
                            label="Active"
                            variant="outlined"
                            size="small"
                            sx={{  backgroundColor: "#000", color: "white",p: "0px" }}
                        />
                        <span className='text-slate-400  text-sm'>Are you sure you want to add this employee?</span>
                       
                    </div>
                    <Box sx={{ mt: 4, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button onClick={() => isHandler(false)} variant="outlined" sx={{ textTransform: 'none', px: 3, border: "1px solid rgba(240, 242, 242, 0.44)", color: "#00FFFF", '&:hover': { color: "#00FFFF", backgroundColor: "rgba(0,255,255,0.15)" } }}>
                            Go Back <ArrowRight sx={{ mr: 1, mb: "1.5px" }} />
                        </Button>
                        <Button onClick={() => createEmployee()} variant="outlined" sx={{ textTransform: 'none', px: 3, border: "1px solid rgba(240, 242, 242, 0.44)", color: "#00FFFF", '&:hover': { color: "#00FFFF", backgroundColor: "rgba(0,255,255,0.15)" } }}>
                            Add New Employee
                        </Button>
                    </Box>
                </Box>
            </Box>
     
        </Fragment>
    )
}

export default StaffRegistrationForm 