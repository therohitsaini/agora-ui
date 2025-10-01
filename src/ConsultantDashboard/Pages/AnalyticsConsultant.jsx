import React from "react";
import {
   Card,
   CardContent,
   Typography,
   Box,
   Chip,
   Grid
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PieChartIcon from "@mui/icons-material/PieChart";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import {
   BarChart,
   Bar,
   XAxis,
   Tooltip,
   ResponsiveContainer
} from "recharts";

const data = [
   { name: "Mo", value: 200 },
   { name: "Tu", value: 300 },
   { name: "We", value: 400 },
   { name: "Th", value: 250 },
   { name: "Fr", value: 500 },
   { name: "Sa", value: 320 },
   { name: "Su", value: 280 }
];

const AnalyticsConsultant = () => {
   return (
      <Card
         sx={{
            bgcolor: "#121212", // black theme background
            color: "#fff",
            borderRadius: 3,
            boxShadow: 4
         }}
      >
         <CardContent>
            {/* Header */}
            <Typography variant="h6" fontWeight="bold">
               Earning Reports
            </Typography>
            <Typography variant="body2" color="gray">
               Weekly Earnings Overview
            </Typography>

            {/* Main Earnings */}
            <Box display="flex" alignItems="center" gap={1} mt={2}>
               <Typography variant="h4" fontWeight="bold">
                  $468
               </Typography>
               <Chip
                  label="+4.2%"
                  size="small"
                  sx={{ bgcolor: "rgba(0,200,83,0.2)", color: "#4caf50" }}
               />
            </Box>
            <Typography variant="caption" color="gray">
               You informed of this week compared to last week
            </Typography>

            {/* Chart */}
            <Box mt={3} height={150}>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                     <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        stroke="#aaa"
                     />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: "#1e1e1e",
                           border: "none",
                           color: "#fff"
                        }}
                     />
                     <Bar dataKey="value" fill="#7c4dff" radius={[6, 6, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </Box>

            {/* Stats */}
            <Grid container spacing={2} mt={2}>
               <Grid item xs={4} textAlign="center">
                  <AttachMoneyIcon sx={{ color: "#7c4dff" }} />
                  <Typography variant="body2" color="gray">
                     Earnings
                  </Typography>
                  <Typography fontWeight="bold">$545.69</Typography>
               </Grid>
               <Grid item xs={4} textAlign="center">
                  <PieChartIcon sx={{ color: "#00bcd4" }} />
                  <Typography variant="body2" color="gray">
                     Profit
                  </Typography>
                  <Typography fontWeight="bold">$256.34</Typography>
               </Grid>
               <Grid item xs={4} textAlign="center">
                  <CreditCardIcon sx={{ color: "#f44336" }} />
                  <Typography variant="body2" color="gray">
                     Expense
                  </Typography>
                  <Typography fontWeight="bold">$74.19</Typography>
               </Grid>
            </Grid>
         </CardContent>
      </Card>
   );
};

export default AnalyticsConsultant;
