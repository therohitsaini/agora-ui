import React, { useState } from 'react'
import { Fragment } from 'react'
import StaffRegistrationForm from '../DashbordPages/StaffRegistrationForm'
import StaffList from '../DashbordPages/StaffList'
import { Box } from '@mui/material'
      
function StaffRoot() {
    const [isTrue, setIsTrue] = useState(false)
    const isHandler = async () => {
        setIsTrue(!isTrue)
    }
    return (
        <Fragment>
            <Box >
                    {
                        isTrue ? <StaffRegistrationForm isHandler={isHandler} /> : <StaffList isHandler={isHandler} />
                    }
                </Box>
        </Fragment>
    );
}

export default StaffRoot;