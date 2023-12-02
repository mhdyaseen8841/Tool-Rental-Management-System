import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
import CalculateScreenDialog from './calculateRent';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';



export default function AlertDialog(props) {
 
  const confirm = () => {
    props.deleteCustomer();
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
     
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
         Confirm Delete?
        </DialogTitle>
        
        <DialogActions>
          <Button color="error" onClick={handleClose}>Decline</Button>
          <Button color="success" onClick={confirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}



export const ExtraPayment = ({ customers, getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const [data, setData] = useState([])
  const [item, setItem] = useState([])
  const [alertOpen, setAlertOpen] = useState(false);
  const [cId, setCid] = useState('');
  const handleClose = () => {
    setDialog();
  };

  
  const deleteConfirm = (cid) => {
    setAlertOpen(true)
    setCid(cid)
  }

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      //   newSelectedCustomerIds = customers.map((customer) => customer.mId);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };


  const handleUPDATE = (e, upd , button = 'UPDATE', data = {}) => {

    setOpen(true);

    
    const add = (date,datas) => {

      let req={
        "type" : "SP_CALL",
        "requestId" : 1700007,
        request: {
          "expId" : data.expId,
          "amount" : datas.Amount,
  "date" : date,
  "note" : datas.Notes,
  "status" : data.Status,
       }
  }
  
  
  requestPost(req).then((res)=>{
    if(res.errorCode===3){
      Router
      .push(
      
      {
        pathname: '/',
        query: { redirect: '1' },
      })
  }else{
  
  
    if(res.errorcode ==0){
     
    }else{
      getdata()
      
    }
  }
  
  setDialog(); 
  });
  
  
    };
  
    setDialog(() => (
      
      <CalculateScreenDialog
        onClose={handleClose}
        open={true}
         submit={add}
         updated={upd}
         button={button}
         data={data}
      />
    ));
  };
  

  const deleteUser = ()=>{
    let del = {
      "type" : "SP_CALL",
      "requestId" : 1700008,
      request: {
       "expId": cId
     }
    }
    requestPost(del).then((res)=>{
      if(res.errorCode===3){
        Router
        .push(
        
        {
          pathname: '/',
          query: { redirect: '1' },
        })
    }else if(res.errorcode ==0){
        
     
      }else{
        setAlertOpen(false)
        getdata()
        
      }
     
    })


  }

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setData(customers)
    }, [customers]);
    
  return (

    <Card {...rest}>
      {addDialog}
 <AlertDialog open={alertOpen} setOpen={setAlertOpen} deleteCustomer={deleteUser}/>
      <PerfectScrollbar>
        <Box >
          <TableContainer >
          <Table>
  <TableHead>
    <TableRow>
      <TableCell>Date</TableCell>
      <TableCell>Amount</TableCell>
      <TableCell>Notes</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map((data,ind) => {
      

      return (
        <React.Fragment key={data.expId}>
          <TableRow hover>
           
            
  <TableCell key={ind}>
    <Stack>
     {data.date}
    </Stack>
  </TableCell>

             
  <TableCell key={ind}>
    <Stack>
     {data.amount}
    </Stack>
  </TableCell>

             
  <TableCell key={ind}>
    <Stack>
     {data.note}
    </Stack>
  </TableCell>


{localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (    <TableCell>
    <FadeMenu   updateItem={(e)=>handleUPDATE(e,true,'UPDATE',{Amount:data.amount,expId:data.expId,date:data.date,note:data.note,status:data.status})} callback={()=>{deleteConfirm(data.expId)}}/>
    </TableCell>)}
          </TableRow>
           
        </React.Fragment>
      );
    })}
  </TableBody>
</Table>



          </TableContainer >
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};


ExtraPayment.propTypes = {
  customers: PropTypes.array.isRequired
};
