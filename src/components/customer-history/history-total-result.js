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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';


import requestPost from '../../../serviceWorker';
import React from 'react'
import FadeMenu from '../more-items-btn';



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

        <Grid item xs={12} sx={{ display: 'flex', flexDirection :'column', position: 'fixed', bottom: '20px' }}>
  <a href="https://wa.me/whatsappphonenumber" target="_blank" rel="noopener noreferrer">
    <WhatsAppIcon style={{ fontSize: 50, color: '#25D366'  }} />
  </a>
</Grid>

  
      </Grid>

      <Grid item xs={4}>
           {/* Total box */}
     <Grid container >
  <Grid item xs={12} >
  <Paper elevation={3} sx={{bgcolor: '#4BB543' }}>
      <Typography variant="subtitle1" color={'white'}  align="center">
      Item Total: 2500
      </Typography>
    </Paper>
  </Grid>
</Grid>
<Grid container spacing={1} mt={1}>
  <Grid item xs={12}>
    <Paper elevation={3} sx={{bgcolor: '#4079FC' }}>
      <Typography variant="subtitle1" color={'white'} align="center">
       Total Paid : 1500
      </Typography>
    </Paper>
  </Grid>
</Grid>
<Grid container spacing={1} mt={1}>
  <Grid item xs={12}>
  <Paper elevation={3} sx={{bgcolor: '#D14343' }}>
      <Typography variant="subtitle1" color={'white'} align="center">
      Pending Amount: 1000
      </Typography>
    </Paper>
  </Grid>
</Grid>


        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            {/* Second table */}
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {customers && customers[1].map((customer) =>
               
                  <TableRow key={customer.pId}>
                    <TableCell>{customer.date}</TableCell>
                    <TableCell>{customer.amount}</TableCell>
                    <TableCell> <FadeMenu  callback={()=>{deleteUser(customer.cId)}}  editUser={(e)=>handleAdd(e,true,'EDIT', {})}/></TableCell>
                   
                
                  </TableRow>

                
              )}
            </TableBody>
          </Table>
        </TableContainer>
        

      </Grid>
    </Grid>

    
    
    
  );
};

HistoryTotalResult.propTypes = {
  customers: PropTypes.array.isRequired
};
