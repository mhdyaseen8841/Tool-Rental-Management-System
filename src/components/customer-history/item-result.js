import { useState,useEffect } from 'react';
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
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';





export const ItemResult = ({ customers,getdata, ...rest  }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
const [data,setData]=useState([])
const [item,setItem]=useState([])
  const handleClose = () => {
    setDialog();
  };


  


const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
 
  setOpen(true);


  const add = (data) => {
   

 


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
    //   newSelectedCustomerIds = customers.map((customer) => customer.mId);
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
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setData(customers.data)
    setItem(customers.item)
         
  
    }, []);
  return (
    
    <Card {...rest}>
      
      <PerfectScrollbar>
        <Box >
        <TableContainer >
          <Table sx={{}}>
            <TableHead>
              <TableRow>
                
              
                <TableCell>
                 Date
                </TableCell>
                
                {item.map((itemHead,ind) => (
                <TableCell key={ind}>
                  {itemHead.name}
                </TableCell>
                )
                )}
                
               
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((customer) => (
                <TableRow
                  hover
                  key={customer.mId}
                //   selected={selectedCustomerIds.indexOf(customer.mId) !== -1}
                >
                  <TableCell sx={{whiteSpace:'nowrap'}}>
                    {customer[0]}
                  </TableCell>
                  {
                      customer.slice(1,customer.length).map((item,ind) => (
<TableCell key={ind}>
<Stack spacing={2}>
  {item.outgoing.qty != 0 ? <div style={{ color: 'white',background: 'red', maxWidth:'60px',textAlign:'center' }}>
    {item.outgoing.qty}</div> : <div/>}
  {item.incoming.qty != 0 ? <div style={{ color: 'white',background: 'green', maxWidth:'60px',textAlign:'center'  }}>
    {item.incoming.qty}</div> : <div/>}
</Stack>
                 
                  
                 
                  </TableCell>
                      ))
                  }
                  </TableRow>
              ))}
             
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


ItemResult.propTypes = {
  customers: PropTypes.array.isRequired
};
