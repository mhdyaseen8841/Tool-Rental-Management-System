import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  Box,
  Button,
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
import FullScreenDialog from './rate-card-update';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';
import Router from 'next/router';
export const RateCardResult = ({ApiData,CtableId, customers,getdata, ...rest  }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };


  


const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
 
   
  setOpen(true);


  const add = (datas) => {
   

    let req={
      "type" : "SP_CALL",
      "requestId" : 1800002,
      "request": datas
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
       }else{
        getdata(CtableId,ApiData)
        
      }

    }

    setDialog(); 
  });


  }


  setDialog(() => (
    
    <FullScreenDialog
      onClose={handleClose}
      open={true}
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
                Item name
                </TableCell>
                
                  <TableCell>
                   Rate
                  </TableCell>
                 
                   <TableCell>
                   Actions
                  </TableCell> 

              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(0, limit).map((customer,index) => (
                <TableRow
                  hover
                  key={customer.rId}
                  selected={selectedCustomerIds.indexOf(customer.rId) !== -1}
                >
                 
                 
                  <TableCell>
                    {index+1}
                  </TableCell>
                  <TableCell>
                    {customer.itemName}
                  </TableCell>
                  <TableCell>
                    {customer.rate}
                  </TableCell>
                  
                   <TableCell>
                  <EditIcon sx={{cursor:"pointer"}}  onClick={(e)=>handleAdd(e,true,'UPDATE', {rId:customer.rId,Name:customer.itemName,Amount:customer.rate})} />
                  </TableCell> 
                </TableRow>
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


RateCardResult.propTypes = {
  customers: PropTypes.array.isRequired
};
