
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ActiveCalls from './UserCallsHistory';
import MissedCalls from './MissedCalls';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../Store/users/UserSlice';
import UserCallsHistory from './UserCallsHistory';
import CallHistoryVoice from './CallHistoryVoice';
import { formatDateTime, formatSeconds, deriveDurationSeconds } from '../../Utils/TimeFormets';
import CallHistoryVideo from './CallHistoryVideo';
import { CircularProgress } from '@mui/material';

function ClientCallsHistory() {
    const [value, setValue] = useState('1');
    const id = localStorage.getItem('user-ID');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.users.list);
    const status = useSelector(state => state.users.status);
    useEffect(() => {
        dispatch(fetchUsers(id));
    }, [id]);

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
    const columns =
        [
            { field: 'fullname', headerName: 'First name', width: 180 },
            { field: 'EmailId', headerName: 'Email Id', width: 180 },
            { field: 'CallType', headerName: 'Call Type', width: 150 },
            { field: 'StartTime', headerName: 'Start Time', width: 150 },
            { field: 'Duration', headerName: 'Duration', width: 150 },
            { field: 'EndTime', headerName: 'End Time', width: 150 },

        ];



    const rows = userData?.map((call, idx) => {
        const durationSec = deriveDurationSeconds(call.startTime, call.endTime, call.durationSeconds)
        const rowId = call?.id || call?._id || `${call?.userId || 'unknown'}-${call?.startTime || idx}-${idx}`
        return {
            id: rowId, // must be unique per row for the grid
            fullname: call?.user?.fullname || call?.user?.fullName || '-',
            EmailId: call?.user?.EmailId || call?.user?.email || '-',
            CallType: call?.type || '-',
            StartTime: formatDateTime(call?.startTime),
            Duration: formatSeconds(durationSec),
            EndTime: formatDateTime(call?.endTime),
        }
    })

    if (status === 'loading') {
        return <div className='text-white flex justify-center items-center h-[80vh]'> <svg width={0} height={0}>
            <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e01cd5" />
                    <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
            </defs>
        </svg>
            <CircularProgress size={70} thickness={4.5} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} /></div>
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, px: 2, mt: 10, borderColor: 'divider' }}>
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
                    <UserCallsHistory columns={columns} rows={rows} />
                </TabPanel>
                <TabPanel value="2">
                    <CallHistoryVoice columns={columns} rows={rows} />
                </TabPanel>
                <TabPanel value="3">
                    <CallHistoryVideo columns={columns} rows={rows} />
                </TabPanel>
            </TabContext>
            <div className='w-full text-slate-600 py-10 text-center'>    © 2025 Saini Web Solutions. All rights reserved.</div>
        </Box>
    );
}

export default ClientCallsHistory;