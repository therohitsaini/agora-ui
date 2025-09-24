import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';



const data = [
    { value: 5 }, { value: 6 }, { value: 5.5 }, { value: 7 }, { value: 6.5 },
    { value: 6.8 }, { value: 7.2 }, { value: 7.5 }, { value: 7.4 }, { value: 8 },
    { value: 7.8 }, { value: 8.2 }, { value: 9 },
];
const SparklineChart = () => {
    return (
        <ResponsiveContainer width="100%" height={50}>
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#00FF5A"
                    strokeWidth={2}
                    dot={false}
                />
                <Tooltip content={null} />
            </LineChart>
        </ResponsiveContainer>
    );
}




export const PageViewsBarChart = () => {
    const theme = useTheme();
    const colorPalette = [
        (theme.vars || theme).palette.primary.dark,
        (theme.vars || theme).palette.primary.main,
        (theme.vars || theme).palette.primary.light,
    ];
    return (
        <Card variant="outlined" sx={{ width: '100%', backgroundColor: "black", color: "white", border: "1px solid #545353", }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                    Page views and downloads
                </Typography>
                <Stack sx={{ justifyContent: 'space-between' }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignContent: { xs: 'center', sm: 'flex-start' },
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="h4" component="p" sx={{ color: 'white' }}>
                            1.3M
                        </Typography>
                        <Chip size="small" color="error" label="-8%" sx={{ color: 'white' }} />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                        Page views and downloads for the last 6 months
                    </Typography>
                </Stack>
                <BarChart
                    borderRadius={8}
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: 'band',
                            categoryGapRatio: 0.5,
                            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                            height: 24,
                            tickLabelStyle: {
                                fill: 'white',
                                fontSize: 12,
                            },
                            axisLine: {
                                stroke: '#545353',
                                strokeWidth: 1,
                            },
                            tickSize: 4,
                            tickStyle: {
                                stroke: '#545353',
                                strokeWidth: 1,
                            },
                        },
                    ]}
                    yAxis={[{
                        width: 50,
                        tickLabelStyle: {
                            fill: 'white',
                            fontSize: 12,
                        },
                        axisLine: {
                            stroke: '#545353',
                            strokeWidth: 1,
                        },
                        tickSize: 4,
                        tickStyle: {
                            stroke: '#545353',
                            strokeWidth: 1,
                        },
                    }]}
                    series={[
                        {
                            id: 'page-views',
                            label: 'Page views',
                            data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
                            stack: 'A',
                        },
                        {
                            id: 'downloads',
                            label: 'Downloads',
                            data: [3098, 4215, 2384, 2101, 4752, 3593, 2384],
                            stack: 'A',
                        },
                        {
                            id: 'conversions',
                            label: 'Conversions',
                            data: [4051, 2275, 3129, 4693, 3904, 2038, 2275],
                            stack: 'A',
                        },
                    ]}
                    height={250}
                    margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
                    grid={{
                        horizontal: true,
                        stroke: '#545353'
                    }}
                    sx={{
                        '& .MuiChartsAxis-line': {
                            stroke: '#545353',
                            strokeWidth: 1,
                        },
                        '& .MuiChartsAxis-tick': {
                            stroke: '#545353',
                            strokeWidth: 1,
                        },
                        '& .MuiChartsGrid-line': {
                            stroke: '#545353',
                            strokeWidth: 0.5,
                            strokeDasharray: '4 2',
                        },
                    }}
                    hideLegend
                />
            </CardContent>
        </Card>
    );
}