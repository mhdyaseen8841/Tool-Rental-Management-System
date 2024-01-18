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
  SvgIcon,
  Button
} from '@mui/material';
import GetCustomerProfile from '../customer-history/GetCustomerProfile'

import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
// import FullScreenDialog from './active-inactive';
import FullScreenDialog from './add-customer';
import requestPost from '../../../serviceWorker'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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


export default function AlertDialog(props) {

  const confirm = () => {
    props.deleteCustomer();
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <div>

      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete?
        </DialogTitle>

        <DialogActions>
          <Button color="error" onClick={handleClose}>Decline</Button>
          <Button color="success" onClick={confirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export const ActiveInactiveListResults = ({ customers, getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(1000);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const [order, setOrder] = useState('asc');
  const [cId, setCid] = useState('');
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [profileOpen, setProfileOpen] = useState(false)

  const onProfileClose = () => {
    setProfileOpen(false)
  }
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleClose = () => {
    setDialog();
  };



  const handleActive = (cid) => {
    let req = {
      "type": "SP_CALL",
      "requestId": 1100004,
      request: {
        "cId": cid
      }
    }
    requestPost(req).then((res) => {
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else if (res.errorcode == 0) {


      } else {
        getdata()

      }

    })


  }
  const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {

    setOpen(true);
    let cid = data.cid;

    const add = (data, file) => {


      let req = {
        "type": "SP_CALL",
        "requestId": 1100002,
        request: {
          "cId": cid,
          "name": data.CustomerName,
          "mobile": data.Mobnum,
          "address": data.Address,
          "altermobile": data.AltMobnum,
          "proof": file,
          "coName": data.Carename,
          "coMobile": data.CareMobnum,
        }
      }

      requestPost(req).then((res) => {
        if (res.errorCode === 3) {
          Router
            .push(
              {
                pathname: '/',
                query: { redirect: '1' },
              })

        } else if (res.errorcode == 0) {

        } else {
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
    if (event.target.value.length >= 3) {
      setFilterName(event.target.value);
    } else {
      setFilterName("");
    }
  };

  const deleteCustomer = () => {
    let req = {
      "type": "SP_CALL",
      "requestId": 1100013,
      request: {
        "cId": cId
      }
    }
    requestPost(req).then((res) => {
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else if (res.errorcode == 0) {


      } else {
        setAlertOpen(false)
        getdata()

      }

    })


  }
  const deleteConfirm = (cid) => {
    setAlertOpen(true)
    setCid(cid)
  }


  const filteredUsers = applySortFilter(customers, getComparator(order, orderBy), filterName);
  return (
    <>
      <Box sx={{ mt: 3, mb: 3 }}>
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
        <AlertDialog open={alertOpen} setOpen={setAlertOpen} deleteCustomer={deleteCustomer} />
        {addDialog}

        <GetCustomerProfile open={profileOpen}
          onClose={onProfileClose}
          cId={cId}
        />
        <PerfectScrollbar>
          <Box >

            <TableContainer style={{ maxHeight: '2000px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell >
                      Name
                    </TableCell>
                    <TableCell>
                      Mobile Number
                    </TableCell>

                    {localStorage.getItem('usertype') === 'owner' ? (
                      null
                    ) : (<TableCell />)}
                  </TableRow>
                </TableHead>
                <TableBody style={{ overflowY: 'scroll' }}>
                  {filteredUsers.slice(0, limit).map((customer) => (
                    <TableRow
                      hover
                      key={customer.cId}
                      selected={selectedCustomerIds.indexOf(customer.cId) !== -1}
                      sx={{ padding: 0 }}
                    >

                      <TableCell sx={{ padding: '4px' }}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            cursor: 'pointer'
                          }}
                        >
                          <Avatar
                            onClick={() => {
                              setCid(customer.cId)
                              setProfileOpen(true)

                            }}
                            sx={{ mr: 2, ml: 2 }}

                          >
                            {customer.cName ? (getInitials(customer.cName)) : ""}
                          </Avatar>
                          <Typography
                            color="textPrimary"
                            variant="body1"
                          >
                            {customer.cName}
                          </Typography>

                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '4px' }}>
                        {customer.mobile}
                        <br />
                        {customer.altermobile}
                      </TableCell>
                      <TableCell sx={{ padding: '4px' }}>
                        
                        {localStorage.getItem('usertype') === 'owner' ?
                          null
                          :

                          <><Button
                            onClick={(e) => handleAdd(e, true, 'EDIT', { name: customer.cName, mobile: customer.mobile, altNum: customer.altermobile, address: customer.address, proof: customer.proof, cid: customer.cId, Carename: customer.coName, CareMobnum: customer.coMobile })}
                          >Edit</Button><Button color="success" onClick={() => handleActive(customer.cId)}>Active</Button>
                            <Button color="error" onClick={() => deleteConfirm(customer.cId)}>Delete</Button></>

                        }
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


ActiveInactiveListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
