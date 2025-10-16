import React from 'react'
import { Box } from '@mui/material'
import DataGridTable from '../../components/DataGridTable'

function CallHistory({ columns, rows }) {
    return (
        <Box sx={{ color: 'white' }}>
            <DataGridTable columns={columns} rows={rows} />
        </Box>
    )
}

export default CallHistory