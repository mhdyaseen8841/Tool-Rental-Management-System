import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Router from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import { filter } from 'lodash';
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
import FullScreenDialog from './active-inactive';
import requestPost from '../../../serviceWorker'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.cName.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.mobile.indexOf(query) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export const CustomerListResults = ({ customers,getdata, ...rest  }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

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
          pathname: '/',
          query: { redirect: '1' },
        })
    }else if(res.errorcode ==0){
        
     
      }else{
        getdata()
        
      }
     
    })


  }
const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
 
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
          pathname: '/',
          query: { redirect: '1' },
        })
        
    }else if(res.errorcode ==0){
       
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
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleFilterByName = (event) => {
    if(event.target.value.length >=3){
      setFilterName(event.target.value);
    }else{
      setFilterName("");
    }
  };

  const filteredUsers = applySortFilter(customers, getComparator(order, orderBy), filterName);
  return (
    <>
    <Box sx={{ mt: 3, mb:3 }}>
      <Card >
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              onChange={handleFilterByName}
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
        <TableContainer style={{ maxHeight: '400px' }}>
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Mobile Number
                </TableCell>
                {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (<TableCell>
    Actions
   </TableCell>)}
      
            

                
              </TableRow>
            </TableHead>
            <TableBody style={{ overflowY: 'scroll' }}>
              {filteredUsers.slice(0, limit).map((customer) => (
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
                      {customer.cName?(getInitials(customer.cName)):""}  
                      </Avatar>
                      <Link href={`/history/?cId=${customer.cId}&cName=${customer.cName}&phNo=${customer.mobile}`}>
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
             <br />
               {customer.altermobile}
             </TableCell>
             <TableCell>
    <FadeMenu   updateItem={(e)=>handleUPDATE(e,true,'UPDATE',{name:items.iName,itemId:items.itemId})} editUser={(e)=>handleAdd(e,true,'EDIT', {name:items.iName,mRent:items.mRent,dRent:items.dRent,tStock:items.tstock,itemId:items.itemId})}/>
    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
    
    </Card>
    </>
  );
};


CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
