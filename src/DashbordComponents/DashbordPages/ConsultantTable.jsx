import { Box, Button, Card, CardContent, Paper, ThemeProvider, Typography } from '@mui/material';
import React from 'react'
import { Fragment } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { darkTheme } from './Client';
import { DataGrid } from '@mui/x-data-grid';
import { useContext } from 'react';
import { allUserDetailsContext } from '../ApiContext/ApiContextUserData';
import { useEffect } from 'react';
import Overview from '../../Utils/Overview';


function ConsultantTable() {

    const { allConsultant, getAllConsultant } = useContext(allUserDetailsContext)


    const columns =
        [
            // { field: 'id', headerName: 'ID', width: 170, height: 10 },
            { field: 'fullname', headerName: 'First name', width: 180 },
            { field: 'EmailId', headerName: 'Email Id', width: 180 },
            { field: 'Phone', headerName: 'Contact Number', width: 150 },
            { field: 'Profession', headerName: 'Profession', width: 150 },
            { field: 'Experience', headerName: 'Experience', width: 150 },
            { field: 'Fees', headerName: 'Conversion Fees', width: 150 },

            {
                field: 'status',
                headerName: 'Status',
                width: 180,
                renderCell: (params) => {
                    const isActive = params.row.status === true;
                    console.log("isActive", isActive)

                    return (
                        <div className='flex gap-1 justify-center items-center'>
                            <Button
                                onClick={() =>
                                    isActive
                                        ? hanlderActiveToggle(params.row.id)
                                        : hanlderDeActiveToggle(params.row.id)
                                }
                                variant='contained'
                                color={isActive ? 'success' : 'error'}
                                sx={{
                                    fontFamily: 'revert-layer',
                                    height: '30px',
                                    color: 'white',
                                    fontSize: 9,
                                    height: "24px"
                                }}
                            >
                                {isActive ? 'Active' : 'Deactive'}
                            </Button>
                        </div>
                    );
                },
            },

        ]

    const hanlderActiveToggle = async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/api-consultant-update-status/${id}`
            const updateStatus = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: false })
            })
            const response = await updateStatus.json()
            console.log(response)

            // Refresh consultant data after successful update
            if (updateStatus.ok) {
                await getAllConsultant();
                console.log("✅ Consultant data refreshed after status update");
            }
        } catch (error) {
            console.log(error)
        }
    }
    const hanlderDeActiveToggle = async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/api-consultant-update-status/${id}`
            const updateStatus = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: true })
            })
            const response = await updateStatus.json()
            console.log(response)

            // Refresh consultant data after successful update
            if (updateStatus.ok) {
                await getAllConsultant();
                console.log("✅ Consultant data refreshed after status update");
            }
        } catch (error) {
            console.log(error)
        }
    }

    console.log("allConsultant", allConsultant)
    const rows = allConsultant.map((item) => ({
        id: item._id,
        fullname: item.fullName,
        EmailId: item.email,
        Phone: item.phone,
        Profession: item.profession,
        Experience: item.experience + " year ",
        Fees: " ₹ " + item.fees + " per minute",
        status: item?.consultantStatus
        // status: item.userStatus
    }));
    return (
        <Fragment>
            <div className='main-consultant-table-container flex flex-col gap-10'>
                <Box>
                    <Overview />
                </Box>
                <ThemeProvider theme={darkTheme}>
                    {

                        <Paper
                            sx={{
                                height: 450,
                                width: '100%',
                                backgroundColor: 'red',
                                borderRadius: 2,


                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                rowHeight={36}
                                columnHeaderHeight={40}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[7, 10]}
                                checkboxSelection
                                sx={{
                                    color: 'white',
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #222121c0',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        // backgroundColor: '#1c1ca2',
                                        color: '#fff',
                                        fontWeight: 'bold',

                                    },
                                    '& .MuiDataGrid-columnHeaderTitleContainer, .MuiDataGrid-cell': {
                                        display: 'flex', justifyContent: "center"
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: '#181818b3',
                                    },
                                    '& .MuiCheckbox-root svg': {
                                        fill: '#5e5b5b',
                                        width: 20,
                                        height: 20,
                                    },
                                    '& .MuiCheckbox-root': {
                                        padding: '2px',
                                    },
                                    '& .MuiDataGrid-topContainer ': {
                                        height: "2px"
                                    },
                                    '& .MuiDataGrid-main': {
                                        backgroundColor: "black",
                                        fontSize: "13px"
                                    }
                                }}
                            />
                        </Paper>
                    }

                </ThemeProvider>
            </div>
        </Fragment>
    )
}

export default ConsultantTable