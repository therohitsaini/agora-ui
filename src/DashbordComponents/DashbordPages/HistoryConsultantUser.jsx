import React from 'react'
import { Fragment } from 'react'
import Overview from '../../Utils/Overview'
import DataGridTable from '../../components/DataGridTable'
import { Box, CircularProgress } from '@mui/material'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchConsultantUsers } from '../../Store/users/UserSlice'

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
    const dispatch = useDispatch()
    const { consultantList, consultantStatus } = useSelector(state => state.users)
    useEffect(() => {
        dispatch(fetchConsultantUsers())
    }, [id])

    if (consultantStatus === 'loading') {
        return <div>Loading...</div>
    }
    console.log("consultantList", consultantList.historyConsultantUser)
    console.log("consultantStatus", consultantStatus)

    if (!consultantList || !Array.isArray(consultantList.historyConsultantUser)) {
        return <div>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e01cd5" />
                        <stop offset="100%" stopColor="#1CB5E0" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress size={70} thickness={4.5} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </div>;
    }

    const rows = (consultantList?.historyConsultantUser ?? []).map((item) => ({
        id: item.id,
        consultantName: item.consultantSnapshot?.fullname ?? '-',
        ClientName: item.userSnapshot?.fullname ?? '-',
        CallType: item.type ?? '-',
        StartTime: item.startTime ?? '-',
        Duration: item.durationSeconds ?? 0,
        EndTime: item.endTime ?? '-', // fixed typo
    }));


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