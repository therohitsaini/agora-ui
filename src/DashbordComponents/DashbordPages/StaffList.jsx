import React from 'react'
import { Fragment } from 'react'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import { Button } from '@mui/material'
import DataGridTable from '../../components/DataGridTable'

const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'email', headerName: 'Email', width: 100 },
    { field: 'phone', headerName: 'Phone', width: 100 },
    { field: 'action', headerName: 'Action', width: 100 },
]

const rows = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '1234567890' },
    { id: 3, name: 'Jim Doe', email: 'jim.doe@example.com', phone: '1234567890' },
]

function StaffList({ isHandler }) {
    return (
        <Fragment>
            <div>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt:2 }}>
                    <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 400, color: 'white' }}>Staff Management     List</Typography>
                    <Button onClick={() => isHandler(true)} variant="outlined" sx={{ textTransform: 'none', px: 4, borderColor: "#00FFFF", color: "#00FFFF", '&:hover': { borderColor: "#00FFFF", color: "#00FFFF", backgroundColor: "rgba(0,255,255,0.15)" } }}>
                        Add Staff
                    </Button>

                </Box>
                <Box sx={{ width: '100%', mt: 10 }}>
                    <DataGridTable columns={columns} rows={rows} />
                </Box>
            </div>
            <div className='w-full text-slate-600 py-10 text-center'>    © 2025 Saini Web Solutions. All rights reserved.</div>
        </Fragment>
    )
}

export default StaffList