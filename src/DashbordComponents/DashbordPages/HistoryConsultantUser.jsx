import React from 'react'
import { Fragment } from 'react'
import Overview from '../../Utils/Overview'
import DataGridTable from '../../components/DataGridTable'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'

function HistoryConsultantUser() {
    const [historyConsultantUser, setHistoryConsultantUser] = useState([])
    const [id, setId] = useState(null)
    useEffect(() => {
        const id = localStorage.getItem('user-ID')
        setId(id)
    }, [])

    const columns = [
        // { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 100 },
        { field: 'consultantName', headerName: 'Consultant Name', flex: 1, minWidth: 150 },
        { field: 'ClientName', headerName: 'Client Name', flex: 1, minWidth: 150 },
        { field: 'CallType', headerName: 'Call Type', flex: 1, minWidth: 150 },
        { field: 'StartTime', headerName: 'Start Time', flex: 1, minWidth: 150 },
        { field: 'Duration', headerName: 'Duration', flex: 0.8, minWidth: 120 },
        { field: 'EndTime', headerName: 'End Time', flex: 1, minWidth: 150 },
    ];

    const rows_ = [
        {
            consultantName: 'John Doe',
            ClientName: 'Manish',
            CallType: 'Voice Call',
            StartTime: '2021-01-01',
            Duration: '10',
            EndTime: '2021-01-01'
        },
        {
            consultantName: 'John Doe',
            ClientName: 'Manish',
            CallType: 'Voice Call',
            StartTime: '2021-01-01',
            Duration: '10',
            EndTime: '2021-01-01'
        }
    ]


    const getAllHistoryConsultantUser = async () => {
        if (!id) {
            console.log("Id is not found")
            return
        }
        const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/consultant-all-user-history/${id}`
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const { historyConsultantUser } = await response.json()
 
        if (response.ok) {
            setHistoryConsultantUser(historyConsultantUser)
        } else {
            console.log("Failed to get history consultant user")
        }
    }
    useEffect(() => {
        getAllHistoryConsultantUser(id)
    }, [id])
    console.log("historyConsultantUser", historyConsultantUser)

const rows = historyConsultantUser.map((item) => ({
    id: item.id,
    consultantName: item.consultantSnapshot?.fullname,
    ClientName: item.userSnapshot?.fullname,
    CallType: item.type,
    StartTime: item.startTime,
    Duration: item.durationSeconds,
    EndTime: item.endTime,
}))

    return (
        <Fragment>
            <Overview />
            <Box sx={{
                width: '100%',
                marginTop: '20px'
            }}>
                <Typography
                    variant='h6'
                    className='text-white'
                    sx={{
                        fontSize: '1.5rem',
                        mb: 1,
                        textUnderlineOffset: '10px'
                    }}>History Consultant User</Typography>
            </Box>
            <DataGridTable columns={columns} rows={rows} />
        </Fragment>
    )
}

export default HistoryConsultantUser    