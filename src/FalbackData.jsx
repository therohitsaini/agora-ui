import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export const cardData = [
   {
      title: 'Total Clients',
      value: 200,
      change: '+2%',
      changeColor: 'green',
      icon: <TrendingUpIcon sx={{ color: 'green' }} />,
   },
   {
      title: 'Conversions',
      value: 20,
      change: '-5%',
      changeColor: 'red',
      icon: <TrendingDownIcon sx={{ color: 'red' }} />,
   },
   {
      title: 'Event count',
      value: 100,
      change: '+0%',
      changeColor: 'lightblue',
      icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
   },
   {
      title: 'Bloked User',
      value: 0,
      change: '+0.1%',
      changeColor: 'lightblue',
      icon: <ShowChartIcon sx={{ color: 'lightblue' }} />,
   },
];