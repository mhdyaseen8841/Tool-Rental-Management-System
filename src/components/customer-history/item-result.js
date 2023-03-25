import { useState,useEffect } from 'react';
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
  console.log(data);
  setOpen(true);


  const add = (data) => {
   

    let req={
      "type" : "SP_CALL",
      "requestId" : 1400002,
      request: data
    }
    
    requestPost(req).then((res)=>{
      if(res.errorcode ==0){
        let error="error happend"
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
        console.log(customers);
    console.log(customers.data);
    console.log(customers.item);
    }, []);
  return (
    
    <Card {...rest}>
        {addDialog}
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                
              
                <TableCell>
                 Date
                </TableCell>
                
                {item.map((itemHead) => (
                <TableCell>
                  {itemHead.name}
                </TableCell>
                )
                )}
                
               
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                //   key={customer.mId}
                //   selected={selectedCustomerIds.indexOf(customer.mId) !== -1}
                >
                 <TableCell>
                   
                    {customer[0]}
                  </TableCell>
                 {
                     customer.slice(1,customer.length-1).map((item) => (
<TableCell>
                    {item.outgoing}
                    {item.incoming}
                  </TableCell>
                     ))
                 }
                  
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


ItemResult.propTypes = {
  customers: PropTypes.array.isRequired
};
