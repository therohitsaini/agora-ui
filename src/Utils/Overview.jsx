import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';



function Overview({ overViewLength, totalClients = [], callsHistory = [] }) {
    const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
    const [isAnimating, setIsAnimating] = useState(false);

  const demmy = 11000
    const cardData = [
        {
            title: 'Total Clients',
            value: demmy ,
            change: '+2%',
            changeColor: 'green',
            icon: <TrendingUpIcon sx={{ color: 'green' }} />,
        },
        {
            title: 'Conversions',
            value: Array.isArray(totalClients) ? totalClients.length : 0,
            change: '-5%',
            changeColor: 'red',
            icon: <TrendingDownIcon sx={{ color: 'red' }} />,
        },
        {
            title: 'Total Call Minutes',
            value: 10000,
            change: '+20%',
            changeColor: 'green',
            icon: <TrendingUpIcon sx={{ color: 'green' }} />,
        },
        {
            title: 'Bloked User',
            value: 0,
            change: '+0.1%',
            changeColor: 'lightblue',
            icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
        },
    ];


    useEffect(() => {
        // restart animation whenever key values change (e.g., totalClients length)
        setIsAnimating(true);
        setAnimatedValues(Array(cardData.length).fill(0));

        const intervals = [];
        cardData.forEach((card, index) => {
            const targetValue = card.value;
            const duration = 2000; // 2 seconds
            const steps = 50;
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
            intervals.push(interval);
        });

        return () => {
            intervals.forEach(clearInterval);
        };
    }, [totalClients.length]);

    const formatValue = (value, index) => {
        const card = cardData[index];
        if (card.title === 'Total Clients' || card.title === 'Total Call Minutes' || card.title === 'Bloked User') {
            if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}k`;
            }
        }
        return value.toString();
    };

    // const cardData = [
    //     {
    //         title: 'Total Clients',
    //         value: overViewLength,
    //         change: '+2%',
    //         changeColor: 'green',
    //         icon: <TrendingUpIcon sx={{ color: 'green' }} />,
    //     },
    //     {
    //         title: 'Conversions',
    //         value: overViewLength,
    //         change: '-5%',
    //         changeColor: 'red',
    //         icon: <TrendingDownIcon sx={{ color: 'red' }} />,
    //     },
    //     {
    //         title: 'Event count',
    //         value: 100,
    //         change: '+0%',
    //         changeColor: 'lightblue',
    //         icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
    //     },
    //     {
    //         title: 'Bloked User',
    //         value: 0,
    //         change: '+0.1%',
    //         changeColor: 'lightblue',
    //         icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
    //     },
    // ];

    return (
        <Box sx={{
  
        }}>
            <Typography fontSize={20} gutterBottom color='white'>
                Overview
            </Typography>
            <Box>
                <div>
                    <Box sx={{ display: "flex", gap: 2 }} >
                        {
                            cardData.map((card, index) => (
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

                    </Box>
                </div>
            </Box>


        </Box>
    )
}

export default Overview