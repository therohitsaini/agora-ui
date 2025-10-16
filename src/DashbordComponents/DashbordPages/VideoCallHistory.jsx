import React from 'react'
import { Box } from '@mui/material'
import DataGridTable from '../../components/DataGridTable'

function VideoCallHistory({ columns, rows }) {  
    const rowsVideo = rows?.filter((call) => call.CallType === 'video');
    console.log("rows____________", rows)
  return (
    <Box sx={{ color: 'white' , width: '100%' }}>
            <DataGridTable columns={columns} rows={rowsVideo} />
        </Box>
  )
}

export default VideoCallHistory