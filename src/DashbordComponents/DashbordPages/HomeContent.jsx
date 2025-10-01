import React, { useContext } from 'react'
import { Fragment } from 'react'
import Overview from '../../Utils/Overview'
import { PageViewsBarChart } from '../../Charts/SparklineChart'
import SessionsChart from '../../Charts/SessionsChart'
import UserDetails from './UserDetails'
import { Box } from '@mui/material'
import { allUserDetailsContext } from '../ApiContext/ApiContextUserData'
import { cardData } from '../../FalbackData'

function HomeContent() {

    const { allUsers, loading, error } = useContext(allUserDetailsContext);
    const overViewLength = allUsers.length

    return (
        <Fragment>
            <Overview overViewLength={overViewLength} cardData={cardData} />
            <div className='flex gap-5 mt-5 my-5'>
                <SessionsChart />
                <PageViewsBarChart />
            </div>
            <Box
                sx={{

                }}>
                <p className='text-white my-4 text-md font-bold'>New  Clients </p>
                <UserDetails />
            </Box>
        </Fragment>
    )
}

export default HomeContent