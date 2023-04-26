import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import GetHistoryDialog from './getHistoryDialog';
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
import FullScreenDialog from './update-history';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';
import Router from 'next/router';

export const HistoryListResults = ({ customers,getdata, ...rest  }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };


  


const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  setOpen(true);


  const add = (data) => {
   

    let req={
      "type" : "SP_CALL",
      "requestId" : 1400002,
      request: data
    }
    
    requestPost(req).then((res)=>{
      if(res.errorcode ==3){
        Router
        .push(
        
        {
          pathname: '/',
          query: { redirect: '1' },
        })
      }else{

        if(res.errorcode ==0){
          let error="error happend"
        
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




const handleHModalAdd = (e,mid) => {
  //setOpen(true); 
  setDialog(() => (
    <GetHistoryDialog
      onClose={handleClose}
      open={true}
      mId={mid}
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
                  Status
                </TableCell>
                <TableCell>
                 Date
                </TableCell>
                
                <TableCell>
                  Feedback
                </TableCell>
                
                {/* {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (<TableCell>
    Actions
   </TableCell>)} */}
                
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(0, limit).map((customer) => (
                
                <TableRow
                  hover
                  key={customer.mId}
                  selected={selectedCustomerIds.indexOf(customer.mId) !== -1}
                >
                 
                 <TableCell
                  onClick={(e)=>handleHModalAdd(e,customer.mId)}
                  >
                    
                      <Button sx={{ backgroundColor: customer.status ? '#f32013' : '#4BB543' }}
 variant="contained">{customer.status ?'RENTED':'RETURN'}</Button>
                      
                  </TableCell>

                  <TableCell
                  onClick={(e)=>handleHModalAdd(e,customer.mId)}
                  >
                    {customer.Date}
                  </TableCell>
                  <TableCell
                   onClick={(e)=>handleHModalAdd(e,customer.mId)}>
                    {customer.feedback}
                  </TableCell>
                 
                  {/* {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : ( <TableCell>
    <FadeMenu   updateItem={(e)=>handleAdd(e,true,'UPDATE', {name:customer.item,hId:customer.hId,qty:customer.qty})} />
    </TableCell>)} */}
                 
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


HistoryListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
