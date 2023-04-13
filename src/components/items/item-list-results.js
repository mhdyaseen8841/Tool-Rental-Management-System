import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Paper,
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
import FullScreenDialog from './add-item';
import FullScreenDialogUpdate from './update-item';
import requestPost from '../../../serviceWorker'

export const ItemListResults = ({ items,getdata, ...rest }) => {
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
  let itemId= data.itemId;
  
  const add = (data) => {
  
    let req={
      "type" : "SP_CALL",
      "requestId" : 1200002,
      request: {
       "itemId":itemId,
       "itemName":data.ItemName,
       "monthly":data.MonthlyRent,
       "daily":data.DailyRent,
       "stock":data.Stock,
       
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


  };

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


const handleUPDATE = (e, upd , button = 'UPDATE', data = {}) => {

  console.log(data);
  setOpen(true);
  console.log('tems idddddddddddddddddddddddddddddd')
  console.log(data.itemId)
  let itemId= data.itemId;
  

  
  const add = (data) => {
    console.log('final dataaaaaaaaaaaaaaaaaaaaaaaa')
console.log(data)

    let req={
      "type" : "SP_CALL",
      "requestId" : 1300001,
      request: {
  "itemId": itemId,
    "qty": data.StockNumber,
    "status": data.Status,
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


  };

  setDialog(() => (
    
    <FullScreenDialogUpdate
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
      newSelectedCustomerIds = items.map((items) => items.itemId);
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
     
    <TableContainer sx={{ display: 'block', overflowX: 'auto', minWidth: 650 }}>
                    <Table>
            <TableHead>
              <TableRow>
              
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Monthly Rent
                </TableCell>
                <TableCell>
                  Daily Rent
                </TableCell>
                <TableCell>
                  Available Stocks
                </TableCell>
                <TableCell>
                  Total Stocks
                </TableCell>
               
                <TableCell>
                   Actions
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.slice(0, limit).map((items) => (
                <TableRow
                  hover
                  key={items.itemId}
                  selected={selectedCustomerIds.indexOf(items.itemId) !== -1}
                >
               
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                     
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {items.iName}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {items.mRent}
                  </TableCell>
                  <TableCell>
                    {items.dRent}
                  </TableCell>
                  <TableCell>
                    {items.astock}
                  </TableCell>
                  <TableCell>
                    {items.tstock}
                  </TableCell>
                 
                  <TableCell>
                  <FadeMenu   updateItem={(e)=>handleUPDATE(e,true,'UPDATE',{name:items.iName,itemId:items.itemId})} editUser={(e)=>handleAdd(e,true,'EDIT', {name:items.iName,mRent:items.mRent,dRent:items.dRent,tStock:items.tstock,itemId:items.itemId})}/>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
       
     
      <TablePagination
        component="div"
        count={items.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ItemListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
