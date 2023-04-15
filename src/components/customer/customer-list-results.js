import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Router from 'next/router';
import SearchIcon from '@mui/icons-material/Search';

import Link from 'next/link';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  SvgIcon
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
import FullScreenDialog from './add-customer';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';

export const CustomerListResults = ({ customers,getdata, ...rest  }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };


  const deleteUser = (cid)=>{
    let del = {
      "type" : "SP_CALL",
      "requestId" : 1100003,
      request: {
       "cId": cid
     }
    }
    requestPost(del).then((res)=>{
      if(res.errorCode===3){
        Router
        .push(
        
        {
          pathname: '/login',
          query: { redirect: '1' },
        })
    }else if(res.errorcode ==0){
        
        console.log(error);
                console.log('No internet connection found. App is running in offline mode.');
      }else{
        getdata()
        
      }
     
    })


  }
const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  console.log('Editttttttttttt')
  console.log(data);
  setOpen(true);
let cid= data.cid;

  const add = (data,file) => {
   

    let req={
      "type" : "SP_CALL",
      "requestId" : 1100002,
      request: {
       "cId":cid,
       "name":data.CustomerName,
       "mobile" : data.Mobnum,
       "address" : data.Address,
       "altermobile" : data.AltMobnum,
 "proof" : file
     }
    }
    
    requestPost(req).then((res)=>{
      if(res.errorCode===3){
        Router
        .push(
        
        {
          pathname: '/login',
          query: { redirect: '1' },
        })
        
    }else if(res.errorcode ==0){
        
        console.log(error);
                console.log('No internet connection found. App is running in offline mode.');
      }else{
        getdata()
        
      }

    setDialog(); 
  });


  }


  setDialog(() => (
    
    <FullScreenDialog
      onClose={handleClose}
      open={open}
       submit={add}
       updated={upd}
       button={button}
       data={data}
    />
  ));
};





  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.cId);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

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
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  

  return (
    <>
    <Box sx={{ mt: 3, mb:3 }}>
      <Card >
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      color="action"
                      fontSize="small"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Search customer"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
    <Card {...rest}>
      
        {addDialog}
      <PerfectScrollbar>
        <Box >
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Mobile Number
                </TableCell>
                <TableCell>
                  Alternative number
                </TableCell>
                <TableCell>
                  Address
                </TableCell>

                {sessionStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (<TableCell>
    Actions
   </TableCell>)}

                
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.cId}
                  selected={selectedCustomerIds.indexOf(customer.cId) !== -1}
                >
                
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar
                        
                        sx={{ mr: 2 }}
                        
                      >
                        {"A"}
                      </Avatar>
                      <Link href={`/history/?cId=${customer.cId}&cName=${customer.cName}`}>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                         {customer.cName} 
                      </Typography>
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.mobile}
                  </TableCell>
                  <TableCell>
                    {customer.altermobile}
                  </TableCell>
                  <TableCell>
                    {customer.address}
                  </TableCell>
                
                  <TableCell>
                  {sessionStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (                  <FadeMenu  callback={()=>{deleteUser(customer.cId)}}  editUser={(e)=>handleAdd(e,true,'EDIT', {name:customer.cName,mobile:customer.mobile,altNum:customer.alterMobile,address:customer.address,proof:customer.proof,cid:customer.cId})}/>
  )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
    </>
  );
};


CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
