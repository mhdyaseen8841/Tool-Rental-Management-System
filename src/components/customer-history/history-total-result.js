import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import FullScreenDialog from './update-history';
import requestPost from '../../../serviceWorker';


const customers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '555-1234',
    history: [
      {
        id: 1,
        itemName: 'Bike',
        startDate: '2022-01-01',
        endDate: '2022-01-08',
      },
      {
        id: 2,
        itemName: 'Scooter',
        startDate: '2022-02-01',
        endDate: '2022-02-05',
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '555-5678',
    history: [
      {
        id: 3,
        itemName: 'Car',
        startDate: '2022-03-01',
        endDate: '2022-03-31',
      },
    ],
  },
  {
    id: 2,
    name: 'Jeev Smith',
    email: 'jeev.smith@example.com',
    phoneNumber: '555-5678',
    history: [
      {
        id: 3,
        itemName: 'Car',
        startDate: '2022-03-01',
        endDate: '2022-03-31',
      },
    ],
  },
];


// export const HistoryListResults = ({ customers, getdata, ...rest }) => {
  export const HistoryTotalResult = ({customers, getdata, ...rest }) => {

    useEffect(() => {
        console.log("customers", customers)
        // getdata()
    }, [])

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <TableContainer component={Paper}>
          <Table>
            {/* First table */}
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Amount</TableCell>
              
              </TableRow>
            </TableHead>
            <TableBody>
              {customers && customers[0].map((item) => (
                <TableRow >
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={4}>
        <TableContainer component={Paper}>
          <Table>
            {/* Second table */}
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {customers && customers[1].map((customer) =>
               
                  <TableRow key={customer.pId}>
                    <TableCell>{customer.date}</TableCell>
                    <TableCell>{customer.amount}</TableCell>
                    <TableCell>{customer.amount}</TableCell>
                
                  </TableRow>
                
              )}
            </TableBody>
          </Table>
        </TableContainer>
    {/* Total box */}
    <Grid container spacing={3} mt={1}>
  <Grid item xs={12}>
    <Paper elevation={3}>
      <Typography variant="subtitle1"  align="center">
      Item Total: 2500
      </Typography>
    </Paper>
  </Grid>
</Grid>
<Grid container spacing={1} mt={1}>
  <Grid item xs={12}>
    <Paper elevation={3}>
      <Typography variant="subtitle1" align="center">
       Total Paid : 1500
      </Typography>
    </Paper>
  </Grid>
</Grid>
<Grid container spacing={1} mt={1}>
  <Grid item xs={12}>
    <Paper elevation={3}>
      <Typography variant="subtitle1" align="center">
      Pending Amount: 1000
      </Typography>
    </Paper>
  </Grid>
</Grid>




      </Grid>
    </Grid>
  );
};

HistoryTotalResult.propTypes = {
  customers: PropTypes.array.isRequired
};
