import { Box, Button, TextField } from '@mui/material'
import React, { Fragment } from 'react'
import { ArrowBack, ArrowRight } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
const DarkTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        color: "#26c6da",               // input text color
        "& fieldset": { borderColor: "#26c6da" },       // cyan border default
        "&:hover fieldset": { borderColor: "#26c6da" }, // cyan border hover
        "&.Mui-focused fieldset": { borderColor: "#00acc1" }, // cyan focus
        borderRadius: "8px",
    },
    "& .MuiInputLabel-root": {
        color: "#26c6da",               // label color (unfocused)
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#00acc1",            // label color (focused)
    },
    "& .MuiInputBase-input": {
        color: "#fff",               // input text
        fontSize: "14px",
        padding: "10px",
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
function StaffRegistrationForm({ isHandler }) {
    return (
        <Fragment>
            <Box>
                <div className='text-white'>Create New Staff Member</div>
                <Box sx={{ mt: 5 }}>
                    <Button onClick={() => isHandler(false)} variant="outlined" sx={{ textTransform: 'none', px: 3, border: "none", color: "#00FFFF", '&:hover': { color: "#00FFFF", backgroundColor: "rgba(0,255,255,0.15)" } }}>
                        Go Back <ArrowRight sx={{ mr: 1, mb: "1.5px" }} />
                    </Button>
                </Box>
                <Box sx={{ mt: 5 }}>
                    <div style={{ background: "#000", padding: "20px",display:"flex",gap:"10px",flexWrap:"wrap"  }}>
                        <DarkTextField label="Name" required variant="outlined" size="small" sx={{ mb: 2, width: 300 }} />
                        <DarkTextField label="Email" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="Phone" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="Address" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="City" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="State" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="Zip" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="Country" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="Date of Birth" variant="outlined" size="small" sx={{ width: 300 }} />
                        <DarkTextField label="Gender" variant="outlined" size="small" sx={{ width: 300 }} />
                    </div>
                </Box>
            </Box>

        </Fragment>
    )
}

export default StaffRegistrationForm