import { Paper, ThemeProvider } from '@mui/material'
import React from 'react'
import { Fragment } from 'react'
import { darkTheme } from '../DashbordComponents/DashbordPages/Client'
import { DataGrid } from '@mui/x-data-grid'

function DataGridTable({ columns , rows}) {

 
   return (
      <Fragment>
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
                        getRowId={(row) => row.id ?? row._id ?? `${row.userId || 'u'}-${row.StartTime || 't'}`}
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
        

         </ThemeProvider>
      </Fragment>
   )
}

export default DataGridTable