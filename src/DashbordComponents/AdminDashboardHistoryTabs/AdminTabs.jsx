
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsultantUsers, fetchUsers } from '../../Store/users/UserSlice';
import { formatDateTime, formatSeconds, deriveDurationSeconds } from '../../Utils/TimeFormets';
import { CircularProgress } from '@mui/material';
import Overview from '../../Utils/Overview';
import CallHistory from '../DashbordPages/CallHistory';
import VoiceCallHistory from '../DashbordPages/VoiceCallHistory';
import VideoCallHistory from '../DashbordPages/VideoCallHistory';


const columns = [
    // { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 100 },
    { field: 'consultantName', headerName: 'Consultant Name', flex: 1, minWidth: 150 },
    { field: 'ClientName', headerName: 'Client Name', flex: 1, minWidth: 150 },
    { field: 'CallType', headerName: 'Call Type', flex: 1, minWidth: 150 },
    { field: 'StartTime', headerName: 'Start Time', flex: 1, minWidth: 150 },
    { field: 'Duration', headerName: 'Duration', flex: 0.8, minWidth: 120 },
    { field: 'EndTime', headerName: 'End Time', flex: 1, minWidth: 150 },
];

function AdminTabs() {
    const [value, setValue] = useState('1');
    const id = localStorage.getItem('user-ID');



    const dispatch = useDispatch()
    const { consultantList, consultantStatus } = useSelector(state => state.users)
    useEffect(() => {
        dispatch(fetchConsultantUsers())
    }, [id])

    console.log("consultantList", consultantList)

    if (!consultantList || !Array.isArray(consultantList.historyConsultantUser)) {
        return <div className='flex justify-center items-center h-[80vh]'>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e01cd5" />
                        <stop offset="100%" stopColor="#1CB5E0" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress size={70} thickness={4.5} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </div>;
    }

    const rows = (consultantList?.historyConsultantUser ?? []).map((item) => ({
        id: item.id,
        consultantName: item.consultantSnapshot?.fullname ?? '-',
        ClientName: item.userSnapshot?.fullname ?? '-',
        CallType: item.type ?? '-',
        StartTime: item.startTime ?? '-',
        Duration: item.durationSeconds ?? 0,
        EndTime: item.endTime ?? '-', // fixed typo
    }));


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const tabs = [
        {
            label: 'Call History',
            value: '1'
        },
        {
            label: 'Voice Calls',
            value: '2'
        },

        {
            label: 'Video Calls',
            value: '3'
        }
    ]

    return (
        <Box sx={{ width: '100%', typography: 'body1', mt: 5 }}>
            <Overview />
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, px: 2, mt: 5, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleChange}
                        aria-label="call history tabs"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "#00FFFF",
                                height: "3px",
                                borderRadius: "3px"
                            },
                        }}
                        sx={{
                            "& .MuiTab-root": {
                                color: "rgba(255,255,255,0.7)",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                borderRadius: "8px",
                                px: 3,
                                py: 1,
                                mx: 1,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    color: "#00FFFF",
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                },
                                "&.Mui-selected": {
                                    color: "#00FFFF",
                                    backgroundColor: "rgba(0,255,255,0.15)",
                                },
                            },
                        }}
                    >
                        {
                            tabs.map((tab) => (
                                <Tab label={tab.label} value={tab.value} />
                            ))}
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {/* <UserCallsHistory columns={columns} rows={rows} /> */}
                    <CallHistory columns={columns} rows={rows} />
                </TabPanel>
                <TabPanel value="2">
                    {/* <CallHistoryVoice columns={columns} rows={rows} /> */}
                    <VoiceCallHistory columns={columns} rows={rows} />
                </TabPanel>
                <TabPanel value="3">
                    {/* <CallHistoryVideo columns={columns} rows={rows} /> */}
                    <VideoCallHistory columns={columns} rows={rows} />
                </TabPanel>
            </TabContext>
            <div className='w-full text-slate-600 py-10 text-center'>    © 2025 Saini Web Solutions. All rights reserved.</div>
        </Box>
    );
}

export default AdminTabs;