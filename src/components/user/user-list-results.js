import { useState,useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Link from 'next/link';
import { DeleteOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import FullScreenDialog from './add-user';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';
import Router from 'next/router'
import { pink, red } from '@mui/material/colors';

export const UserListResults = ({ users,getdata, ...rest  }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const ref = useRef(null)
  const handleClose = () => {
    setDialog();
  };

  const StatusMenu = (prop)=>{

    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false);
    const spcall = (status)=>{
     
      const requestdata =  {
        "type" : "SP_CALL",
        "requestId" : 1000002,
        "request": {
         "uId" : prop.uId,
	       "userType" : status
       }
      }
      requestPost(requestdata).then((res) => {

        if(res.errorCode===3){
          Router
          .push(
          
          {
            pathname: '/',
            query: { redirect: '1' },
          })
      }else{
          getdata()
      }
          }).catch(() => {
        })
     }
    return(
      <>
     {localStorage.getItem('usertype') === 'owner' ? (
   <Button ref={ref} variant="contained" sx={{ cursor: 'pointer', userSelect: 'none' }} color={prop.status === "admin" ? 'primary' : 'error'}  >
   {prop.status === "admin" ? 'admin' : 'owner'}
 </Button>
  ) : (<Button ref={ref} variant="contained" sx={{ cursor: 'pointer', userSelect: 'none' }} color={prop.status === "admin" ? 'primary' : 'error'}  onClick={() => {setIsOpen(true); } }>
  {prop.status === "admin" ? 'admin' : 'owner'}
</Button>)}
      
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
         {prop.status === "admin" ?
          <MenuItem sx={{ color: 'text.secondary'  }} onClick={()=>{spcall("owner")}}>
            <ListItemIcon>
               {/* <Iconify icon="carbon:task-complete" width={24} height={24} /> */}
            </ListItemIcon>
            <ListItemText primary="owner" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          :
          <MenuItem sx={{ color: 'text.secondary' }} onClick={()=>{spcall("admin")}}>
            <ListItemIcon>
               {/* <Iconify icon="mdi:timer-sand-complete" width={24} height={24} /> */}
            </ListItemIcon>
            <ListItemText primary="admin" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        }
        </Menu></>);
  }


  const deleteUser = (uId)=>{
    let del = {
      "type" : "SP_CALL",
       "requestId" : 1000003,
       request: {
          "uId" : uId
          }
    }
    
    requestPost(del).then((res)=>{

      if(res.errorcode===3){
        Router
        .push(
        
        {
          pathname: '/',
          query: { redirect: '1' },
        })
    }else{
      if(res.errorcode ==0){
        
      
      }else{
        getdata()
        
      }
    }
    })




  }



  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = users.map((users) => users.userId);
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
        <Box>
          <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Type
                </TableCell>
                {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : ( <TableCell>
    Actions
   </TableCell>)}
               
                  
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, limit).map((users,ind) => (
                <TableRow
                  hover
                  key={ind}
                  selected={selectedCustomerIds.indexOf(users.uId) !== -1}
                >
                
           
                  <TableCell>
                    {users.username}
                  </TableCell>
                 <TableCell>
    <StatusMenu ref={ref} status={users.userType} uId={users.uId} />
  </TableCell>
                 
          
                  {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (<TableCell>
    <DeleteOutlined onClick={()=>{deleteUser(users.uId)}} sx={{cursor:"pointer", color: red[500]}} />
     </TableCell>)}
                  
                  

                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={users.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};


UserListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
