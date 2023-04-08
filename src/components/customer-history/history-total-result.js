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
import FullScreenDialog from './update-payment';



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
  export const HistoryTotalResult = ({customers,payments, getdata,CtableId,ApiData, ...rest }) => {

    const [open, setOpen] = useState(true);
    const [addDialog, setDialog] = useState();
    const [total ,setTotal] = useState(0)
    const [totalPaid ,setTotalPaid] = useState(0)
    const [totalDue ,setTotalDue] = useState(0)
    const [advance ,setAdvance] = useState(0)
   
   
   
    const handleClose = () => {
     
        setDialog();
    };


    const deleteUser = (pId) => {
        let req = {
          "type" : "SP_CALL",
          "requestId" : 1700003,
          request: {
            "pId" : pId,
         }
    }
    requestPost(req).then((res)=>{
      if(res.errorcode ==0){
        
        console.log(error);
                console.log('No internet connection found. App is running in offline mode.');
      }else{
        // getdata()
       
        getdata(CtableId,ApiData)

        
      }
     
    })
  }


const handleAdd = (pId,amount) => {
  console.log('calllleddddd')
setOpen(true)
    const add = (amount) => {
      console.log("amt")
        console.log(amount)
        let req =   {
          "type" : "SP_CALL",
          "requestId" : 1700002,
          request: {
            "pId" : pId,
            "amount" : amount,
         }
    }
  
        requestPost(req).then((res) => {
            if (res.errorcode == 0) {
                let error = "error happend"
                console.log(error);
                console.log('No internet connection found. App is running in offline mode.');
            } else {
              console.log("Amount Edited succesfully")
              setDialog();
              getdata(CtableId,ApiData)
            }
        })
    }
    setDialog(() => (
    
        <FullScreenDialog
          onClose={handleClose}
           open={open}
           submit={add}
           button='UPDATE'
           amount={amount}
      
        />
      ));
}



useEffect(() => {
  let totalAmount = 0;
  let totalPaidAmount = 0;

  for (let i = 0; i < customers.length; i++) {
    totalAmount += customers[i].amount;
  }

  for (let i = 0; i < payments.length; i++) {
    totalPaidAmount += payments[i].amount;
  }

  setTotal(totalAmount);
  setTotalPaid(totalPaidAmount);
  if(totalPaidAmount > totalAmount){
    setTotalDue(0);
  }else{
  setTotalDue(totalAmount - totalPaidAmount);
  }
  if(totalPaidAmount > totalAmount){
    setAdvance(totalPaidAmount - totalAmount);
  }else{
    setAdvance(0);
  }
}, [customers, payments]);

  return (
    <>
    {addDialog}
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
              {customers && customers[0] ? customers.map((item,index) => (
                <TableRow key={index} >
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                 
                </TableRow>
              )) : null}
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
  <Paper elevation={3} sx={{bgcolor: '#FF8E2B' }}>
      <Typography variant="subtitle1" color={'white'}  align="center">
      Item Total: {total}
      </Typography>
    </Paper>
  </Grid>
</Grid>
<Grid container spacing={1} mt={1}>
  <Grid item xs={12}>
    <Paper elevation={3} sx={{bgcolor: '#4079FC' }}>
      <Typography variant="subtitle1" color={'white'} align="center">
       Total Paid : {totalPaid}
      </Typography>
    </Paper>
  </Grid>
</Grid>
<Grid container spacing={1} mt={1}>
  <Grid item xs={12}>
  <Paper elevation={3} sx={{bgcolor: '#D14343' }}>
      <Typography variant="subtitle1" color={'white'} align="center">
      Pending Amount:   {totalDue}
      </Typography>
    </Paper>
  </Grid>
</Grid>
<Grid container spacing={1} mt={1}>
  <Grid item xs={12} >
  <Paper elevation={3} sx={{bgcolor: '#4BB543' }}>
      <Typography variant="subtitle1" color={'white'}  align="center">
      Advance: {advance}
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
            {payments && payments.map((customer) =>
               
               <TableRow key={customer.pId}>
                 <TableCell>{customer.date}</TableCell>
                 <TableCell>{customer.amount}</TableCell>
                 <TableCell> <FadeMenu  callback={()=>{deleteUser(customer.pId)}}  editUser={(e)=>handleAdd(customer.pId,customer.amount)}/></TableCell>
                
             
               </TableRow>

             
           )}
              
            </TableBody>
          </Table>
        </TableContainer>
        

      </Grid>
    </Grid>

    
    
    </>
  );
};

HistoryTotalResult.propTypes = {
  customers: PropTypes.array.isRequired
};
