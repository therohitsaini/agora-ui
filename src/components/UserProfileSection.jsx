import React from 'react'
import Navbar from './Navbar'
import Profile from './Profile'
import { Box, Button } from '@mui/material'
import { px } from 'framer-motion'
import { ArrowBack } from '@mui/icons-material'

function UserProfileSection() {
    const style = {
        mx: 1,
        px: 10
    }
    return (
        <div className='main-profile-container bg-black'>
            <Navbar />
            <Box sx={{
                m: 2
            }}>
                <Button variant="contained"  sx={{ margin: 2,px:3, color:"white", backgroundColor: '#969097', '&:hover': { backgroundColor: '#b54fc0' } }}>
                    <ArrowBack sx={{mr:1}} /> Back
                </Button>
            </Box>
            <Profile style={style} />
        </div>
    )
}

export default UserProfileSection   