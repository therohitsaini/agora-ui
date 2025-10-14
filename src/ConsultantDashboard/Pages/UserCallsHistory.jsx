import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import DataGridTable from '../../components/DataGridTable';

function UserCallsHistory({ columns, rows }) {

    return (
        <Box sx={{ color: 'white' }}>
            <DataGridTable columns={columns} rows={rows} />
        </Box>
    );
}

export default UserCallsHistory;
