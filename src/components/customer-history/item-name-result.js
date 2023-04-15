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
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
import FullScreenDialog from './update-history';
import DateDialog from './date-dialog';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Router from 'next/router';
export const ItemNameResult = ({ customers,getdata, ...rest  }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };

const updateDate = (rId,date,cdate) => {

  let data={
    "date":date,
    "rId":rId,
    "cDate":cdate

  }
  const add=(data)=>{
    setDialog();
   requestPost(data).then((res)=>{
    if(res.errorCode===3){
      Router
      .push(
      
      {
        pathname: '/login',
        query: { redirect: '1' },
      })
  }else{

    if(res.errorcode ==0){
      let error="error happend"
      alert(error)
      console.log(error);
              console.log('No internet connection found. App is running in offline mode.');
    }else{
      getdata()
      
    }

  }})

  }
  setDialog(() => (
    
    <DateDialog
      onClose={handleClose}
      open={true}
       submit={add}
       updated={false}
       button={'Update'}
       data={data}
    />
  ));
    }
  


const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
 
  setOpen(true);


  const add = (data) => {
   

    let req={
      "type" : "SP_CALL",
      "requestId" : 1400002,
      request: data
    }
    
    requestPost(req).then((res)=>{
      if(res.errorCode===3){
        Router
        .push(
        
        {
          pathname: '/login',
          query: { redirect: '1' },
        })
    }else{

      if(res.errorcode ==0){
        let error="error happend"
        console.log(error);
                console.log('No internet connection found. App is running in offline mode.');
      }else{
        getdata()
        
      }

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
      newSelectedCustomerIds = customers.map((customer) => customer.mId);
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
        <Box >
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                
              
                <TableCell>
                 No.Item
                </TableCell>
                
                <TableCell>
                  Date
                </TableCell>
                
                  <TableCell>
                   Days
                  </TableCell>
                  <TableCell>
                   Return Date
                  </TableCell>

                  <TableCell>
                   Total(₹)
                  </TableCell>

                  <TableCell>
                    Action
                  </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
  {customers.slice(0, limit).map((customer,index) => (
    customer.days<30 ? (
      <TableRow
        hover
        key={customer.mId}
        selected={selectedCustomerIds.indexOf(customer.mId) !== -1}
      >
        <TableCell>{index+1}</TableCell>
        <TableCell>{customer.rentDate}</TableCell>
        <TableCell>{customer.days}</TableCell>
        <TableCell>{customer.returnDate}</TableCell>
        <TableCell>{customer.price}</TableCell>
        <TableCell sx={{cursor:'pointer'}}>
          <EditIcon onClick={()=>updateDate(customer.rId,customer.returnDate,customer.rentDate)} />
        </TableCell>
        {/* <TableCell>
        <FadeMenu   updateItem={(e)=>handleAdd(e,true,'UPDATE', {name:customer.item,hId:customer.hId,qty:customer.qty})} />
        </TableCell> */}
      </TableRow>
    ) : (
      <TableRow
        hover
        key={customer.mId}
        selected={selectedCustomerIds.indexOf(customer.mId) !== -1}
        sx={{backgroundColor:'red'}}
      >
        <TableCell>{index+1}</TableCell>
        <TableCell>{customer.rentDate}</TableCell>
        <TableCell>{customer.days}</TableCell>
        <TableCell>{customer.returnDate}</TableCell>
        <TableCell>{customer.price}</TableCell>
        <TableCell sx={{cursor:'pointer'}}>
          <EditIcon onClick={()=>updateDate(customer.rId,customer.returnDate,customer.rentDate)} />
        </TableCell>
        {/* <TableCell>
        <FadeMenu   updateItem={(e)=>handleAdd(e,true,'UPDATE', {name:customer.item,hId:customer.hId,qty:customer.qty})} />
        </TableCell> */}
      </TableRow>
    )
  ))}
</TableBody>

          </Table>
          </TableContainer >
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


ItemNameResult.propTypes = {
  customers: PropTypes.array.isRequired
};
