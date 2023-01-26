import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
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
      if(res.errorcode ==0){
        
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
      if(res.errorcode ==0){
        
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
    
    <Card {...rest}>
        {addDialog}
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
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
                <TableCell>
                   Actions
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.cId}
                  selected={selectedCustomerIds.indexOf(customer.cId) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer.cId) !== -1}
                      onChange={(event) => handleSelectOne(event, customer.cId)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={customer.avatarUrl}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.cName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.mobile}
                  </TableCell>
                  <TableCell>
                    {customer.alterMobile}
                  </TableCell>
                  <TableCell>
                    {customer.address}
                  </TableCell>
                
                  <TableCell>
                  <FadeMenu  callback={()=>{deleteUser(customer.cId)}}  editUser={(e)=>handleAdd(e,true,'EDIT', {name:customer.cName,mobile:customer.mobile,altNum:customer.alterMobile,address:customer.address,proof:customer.proof,cid:customer.cId})}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
  );
};


CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
