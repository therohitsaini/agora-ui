import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
// import SparklineChart from '../../Charts/SparklineChart';

const cardData = [
    {
        title: 'Users',
        value: '14k',
        change: '+25%',
        changeColor: 'green',
        icon: <TrendingUpIcon sx={{ color: 'green' }} />,
    },
    {
        title: 'Conversions',
        value: '325',
        change: '-25%',
        changeColor: 'red',
        icon: <TrendingDownIcon sx={{ color: 'red' }} />,
    },
    {
        title: 'Event count',
        value: '200k',
        change: '+5%',
        changeColor: 'lightblue',
        icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
    },
];
function Overview() {
    return (
        <Box sx={{  }}>
            <Typography fontSize={20} gutterBottom color='white'>
                Overview
            </Typography>
            <Box>
                <div>
                    <Box sx={{ display: "flex", gap: 2 }} >
                        {cardData.map((card, index) => (
                            <Card
                                sx={{
                                    border: "1px solid #403e3e",
                                    backgroundColor: "black",
                                    color: 'white',
                                    width: "100%",
                                    boxShadow: "0px 4px 12px rgba(54, 52, 52, 0.4)",
                                    borderRadius:"7px"
                                }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="gray">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h5">{card.value}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        {card.icon}
                                        <Typography variant="body2" sx={{ color: card.changeColor, ml: 1 }}>
                                            {card.change}
                                        </Typography>

                                    </Box>
                                    <Typography variant="caption" color="gray">
                                        Last 30 days
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                        <Card sx={{ backgroundColor: '#121212', color: 'white', width: "100%" }}>
                            <CardContent>
                                <Typography variant="subtitle2">Explore your data</Typography>
                                <Typography variant="body2" sx={{ color: 'gray', mt: 1, mb: 2 }}>
                                    Uncover performance and visitor insights with our data wizardry.
                                </Typography>
                                <Button variant="contained" size="small" sx={{ backgroundColor: '#fff', color: '#000' }}>
                                    Get insights
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </div>
            </Box>


        </Box>
    )
}

export default Overview