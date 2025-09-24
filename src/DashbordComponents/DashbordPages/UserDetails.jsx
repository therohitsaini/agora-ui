import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    { field: 'id', headerName: 'ID', width: 70, height: 10 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 14 },
    { id: 6, lastName: 'Melisandre', firstName: 'Joshn', age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    { id: 10, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 11, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 12, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 13, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 14, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 15, lastName: 'Targaryen', firstName: 'Daenerys', age: 56 },
    { id: 16, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 17, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 18, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 19, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function UserDetails() {
    return (

        <ThemeProvider theme={darkTheme}>
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
                            backgroundColor: '#1c1ca2',
                            color: '#fff',
                            fontWeight: 'bold',
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
                            backgroundColor: "black"
                        }
                    }}
                />
            </Paper>
        </ThemeProvider>
    );
}
