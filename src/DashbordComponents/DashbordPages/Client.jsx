import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { allUserDetailsContext } from '../ApiContext/ApiContextUserData';
import { useContext } from 'react';
import Overview from '../../Utils/Overview';
import { cardData } from '../../FalbackData';

export const darkTheme = createTheme({
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
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
      console.log("Row Data:", params.row);

      return (
        <div className='h-full w-full flex justify-center items-center '>
          <Box
            sx={{
              px: 1,
              // py:,
              borderRadius: "7px",
              fontSize: "11px",
              height: "20px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: params.row.status ? "#6dde16de" : "gray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "70px",
            }}
          >
            {params.row.status ? "Online" : "Offline"}
          </Box>
        </div>
      );
    },
  }

  //     field: 'fullName',
  //     headerName: 'Full name',
  //     description: 'This column has a value getter and is not sortable.',
  //     sortable: false,
  //     width: 160,
  //     // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },
];


function Client() {
  const { allUsers, loading, error } = useContext(allUserDetailsContext);
  console.log(allUsers)
  const rows = allUsers.map((item) => ({
    id: item._id,
    fullname: item.fullname,
    EmailId: item.email,
    // emailID: item.email,
    // permission: item.permission,
    status: item?.isActive
  }));
  // const cardData = [
  //   {
  //     title: 'Total Users',
  //     value: allUsers.length,
  //     change: '+25%',
  //     changeColor: 'green',
  //     icon: <TrendingUpIcon sx={{ color: 'green' }} />,
  //   },
  //   {
  //     title: 'Active User',
  //     value: '325',
  //     change: '-25%',
  //     changeColor: 'red',
  //     icon: <TrendingDownIcon sx={{ color: 'red' }} />,
  //   },
  //   {
  //     title: 'Recent Join',
  //     value: '20',
  //     change: '+5%',
  //     changeColor: 'lightblue',
  //     icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
  //   },
  //   {
  //     title: 'Bloked User',
  //     value: '120',
  //     change: '+5%',
  //     changeColor: 'lightblue',
  //     icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
  //   },
  // ];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* <Typography fontSize={20} gutterBottom color='white'>
        Client
      </Typography> */}
      <Box>
        <Overview cardData={cardData} />
      </Box>
      <ThemeProvider theme={darkTheme}>
        {
          loading
            ?
            <div className='text-3xl text-white'>

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

    </Box>
  )
}

export default Client