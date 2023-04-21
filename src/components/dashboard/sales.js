import { Bar,Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';

export const Sales = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [17,24,56,23,54,12,23],
        label: 'Shutter',
        maxBarThickness: 10
      },
      {
        backgroundColor: '#4753f2',
        data: [65,32,54,12,98,36,24],
        label: 'Jackey',
      },
    ],
    labels: props.label
  };

  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };
  const datesPick = () =>{
    return (
      <><Button

        size="small"
      >
        Last 7 days
      </Button><Button

        size="small"
      >
          Last 7 days
        </Button></>
    )
  }

  return (
    <Card {...props}>
      <CardHeader
        action={(
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="From" defaultValue={dayjs().startOf('month').format('MM/DD/YYYY')} renderInput={(params) => <TextField {...params} />}/>
            <DatePicker label="To" defaultValue={dayjs()} renderInput={(params) => <TextField {...params} />}/>
            </LocalizationProvider>
            </>
        )}
        title="Weekly Sales"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Line
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
         
      </Box>
    </Card>
  );
};
