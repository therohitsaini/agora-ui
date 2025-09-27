import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
// import SparklineChart from '../../Charts/SparklineChart';

const cardData = [
    {
        title: 'Users',
        value: 14000,
        change: '+25%',
        changeColor: 'green',
        icon: <TrendingUpIcon sx={{ color: 'green' }} />,
    },
    {
        title: 'Conversions',
        value: 325,
        change: '-25%',
        changeColor: 'red',
        icon: <TrendingDownIcon sx={{ color: 'red' }} />,
    },
    {
        title: 'Event count',
        value: 200000,
        change: '+5%',
        changeColor: 'lightblue',
        icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
    },
    {
        title: 'Bloked User',
        value: 1000,
        change: '+5%',
        changeColor: 'lightblue',
        icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
    },
];

function Overview() {
    const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        
        // Animate each value from 0 to target
        cardData.forEach((card, index) => {
            const targetValue = card.value;
            const duration = 2000; // 2 seconds
            const steps = 60; // 60 steps for smooth animation
            const stepValue = targetValue / steps;
            const stepDuration = duration / steps;
            
            let currentStep = 0;
            const interval = setInterval(() => {
                currentStep++;
                const newValue = Math.min(stepValue * currentStep, targetValue);
                
                setAnimatedValues(prev => {
                    const newValues = [...prev];
                    newValues[index] = Math.floor(newValue);
                    return newValues;
                });
                
                if (currentStep >= steps) {
                    clearInterval(interval);
                    if (index === cardData.length - 1) {
                        setIsAnimating(false);
                    }
                }
            }, stepDuration);
        });
    }, []);

    const formatValue = (value, index) => {
        const card = cardData[index];
        if (card.title === 'Users' || card.title === 'Event count' || card.title === 'Bloked User') {
            if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}k`;
            }
        }
        return value.toString();
    };
    return (
        <Box sx={{}}>
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
                                    borderRadius: "7px"
                                }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="gray">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatValue(animatedValues[index], index)}
                                    </Typography>
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
                        {/* <Card sx={{ backgroundColor: '#121212', color: 'white', width: "100%" }}>
                            <CardContent>
                                <Typography variant="subtitle2">Explore your data</Typography>
                                <Typography variant="body2" sx={{ color: 'gray', mt: 1, mb: 2 }}>
                                    Uncover performance and visitor insights with our data wizardry.
                                </Typography>
                                <Button variant="contained" size="small" sx={{ backgroundColor: '#fff', color: '#000' }}>
                                    Get insights
                                </Button>
                            </CardContent>
                        </Card> */}
                    </Box>
                </div>
            </Box>


        </Box>
    )
}

export default Overview