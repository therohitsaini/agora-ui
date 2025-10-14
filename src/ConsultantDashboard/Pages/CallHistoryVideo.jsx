import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import DataGridTable from '../../components/DataGridTable'


function CallHistoryVideo({ columns, rows }) {

    const rowsVideo = rows?.filter((call) => call.CallType === 'video');
    console.log("rows____________VEDI", rows)
    return (
        <Box sx={{ color: 'white' }}>
            <DataGridTable columns={columns} rows={rowsVideo} />
        
               
        
        </Box>
    )
}

export default CallHistoryVideo