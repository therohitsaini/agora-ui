import React, { useContext, useEffect } from 'react'
import { Fragment } from 'react'
import Overview from '../../Utils/Overview'
import UserDetails from './UserDetails'
import { Box } from '@mui/material'
import { allUserDetailsContext } from '../ApiContext/ApiContextUserData'
import { cardData } from '../../FalbackData'

function HomeContent() {

    const { allUsers, loading, error } = useContext(allUserDetailsContext);
    const overViewLength = allUsers.length

    const getNewClients = async () => {
        try {
            const response = await fetch(`https://admin.shopify.com/store/rohit-12345839/apps/vc-node`)
            const data = await response.json()
            console.log( "new clients", data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getNewClients()
    }, [])

    return (
        <Fragment>
            <Overview overViewLength={overViewLength} cardData={cardData} />
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