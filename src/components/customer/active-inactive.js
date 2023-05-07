import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Stack, Container, Typography, TextField, Checkbox, Alert, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Card, Avatar, Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Compressor from 'compressorjs';
import requestPost from '../../../serviceWorker'
import { getInitials } from '../../utils/get-initials';
import PerfectScrollbar from 'react-perfect-scrollbar'
import FileUpload from 'react-material-file-upload';
import { Box } from '@mui/system';



export default function FullScreenDialog(details) {


  const [order, setOrder] = useState('asc');
  const [limit, setLimit] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const [customers, setCustomers] = useState([{}])





  function getCustomer(){
    let data=  {
      "type" : "SP_CALL",
      "requestId" : 1100006,
      request: {
     }
  }


  
    requestPost(data).then((res)=>{
      if(res.errorCode===3){
        Router
        .push(
        
        {
          pathname: '/',
          query: { redirect: '1' },
        })
    }else{
  
      if(res.result[0] ==null){
        setCustomers([])
      }else{
        setCustomers(res.result)
      }
     
  
    }
    })
    // .catch((err)=>{
    //   setCustomers([{}])
    //   })
  
  
  }
  
  useEffect(() => {
  
   getCustomer()
  }, [])
  

 
  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
 
  });
  

  const onclose = () => {
    formik.resetForm();
    details.onClose();
  };


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
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


  const filteredUsers = applySortFilter(customers, getComparator(order, orderBy), filterName);

  return (
    <div>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: 'relative',background: '#5048E5' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
               Active or Inactive Customer
            </Typography>
            
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>


          
        <Card >
      
      
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
                <TableCell>
                  Active/Inactive
                </TableCell>
      
            

                
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
              <Button
              variant="contained"
              color="primary"
              ></Button>
              </TableCell>
                
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
    
    </Card>
        </Container>
      </Dialog>
    </div>
  );
}
