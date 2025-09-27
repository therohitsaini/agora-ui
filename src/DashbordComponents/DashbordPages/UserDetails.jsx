import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { allUserDetailsContext } from '../ApiContext/ApiContextUserData';
import { getLatestUsers } from '../../Utils/Utils';
import { CircularProgress } from '@mui/material';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            paper: '#1e1e2f',
            default: '#121212',
        },
        text: {
            primary: '#ffffff',
        },
    },
});

const columns = [
    { field: 'id', headerName: 'ID', width: 170, height: 10 },
    { field: 'fullname', headerName: 'First name', width: 130 },
    { field: 'EmailId', headerName: 'Email Id', width: 180 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },

];



export default function UserDetails() {
    const { allUsers, loading, error } = useContext(allUserDetailsContext);
    console.log(allUsers)
    const latestClinet = getLatestUsers(allUsers, 10)
    console.log(latestClinet)

    const rows = latestClinet.map((item) => ({
        id: item._id,
        fullname: item.fullname,
        EmailId: item.email,
        // emailID: item.email,
        // permission: item.permission,
        // status: item.userStatus
    }));

    return (

        <ThemeProvider theme={darkTheme}>
            {
                loading
                    ?
                    <div className='text-3xl text-white h-[200px] w-full flex justify-center items-center'>
                        <CircularProgress enableTrackSlot size="3rem" />
                    </div>
                    :

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
    );
}
