import React from 'react'
import { Fragment } from 'react'
import Overview from './Overview'
import { PageViewsBarChart } from '../../Charts/SparklineChart'
import SessionsChart from '../../Charts/SessionsChart'
import UserDetails from './UserDetails'
import { Box } from '@mui/material'

function HomeContent() {
    return (
        <Fragment>
            <Overview />
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