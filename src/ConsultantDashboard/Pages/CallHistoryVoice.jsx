import React from 'react'
import { Box } from '@mui/material'
import DataGridTable from '../../components/DataGridTable'

function CallHistoryVoice({ columns, rows }) {

    const rowsVoice = rows?.filter((call) => call.CallType === 'audio');
    console.log("rows____________", rows)
    return (
        <Box sx={{ color: 'white' }}>
            <DataGridTable columns={columns} rows={rowsVoice} />
        </Box>
    )
}

export default CallHistoryVoice
