import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Router from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import { filter } from 'lodash';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
import FullScreenDialog from '../active-inactive/add-customer';
import requestPost from '../../../serviceWorker'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, color } from '@mui/system';
import { MoreVert, SignalCellularNullSharp } from '@material-ui/icons';
import { useRef } from 'react';


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
          Do you want to Delete <b>{props.cName && props.cName}</b> ?
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


export const CustomerListResults = ({ customers, getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(1000);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const [snackbarOpen,setSnackOpen] = useState(false);
  const [errorMsg,setErrorMsg] = useState();
  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [alertOpen, setAlertOpen] = useState(false);
  const [cId, setCid] = useState('');
  const [cName, setCname] = useState('');

  const [islatest, setIsLatest] = useState(false)
  const handleClose = () => {
    setDialog();
  };


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
        console.log("edit");
        if (res.errorCode === 3) {
          Router
            .push(
              {
                pathname: '/',
                query: { redirect: '1' },
              })

        } else if (res.errorcode == 0) {
          setErrorMsg(<Alert severity='error'>{res.errorMsg}</Alert>);
          setSnackOpen(true);
        } else {
          getdata(islatest ? 1100010 : 1100005)

        }

        setDialog();
      });


    }


    setDialog(

      <FullScreenDialog
        onClose={handleClose}
        open={open}
        submit={add}
        updated={upd}
        button={button}
        data={data}
      />
    );
  };

  const deleteConfirm = (cid, name) => {
    setAlertOpen(true)
    setCid(cid)
    setCname(name)
  }

  const deleteUser = () => {
    let del = {
      "type": "SP_CALL",
      "requestId": 1100003,
      request: {
        "cId": cId
      }
    }
    requestPost(del).then((res) => {
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else if (res.errorcode == 0) {
        setErrorMsg(<Alert severity='error'>{res.errorMsg}</Alert>);
        setSnackOpen(true);
      } else {
        setAlertOpen(false)
        getdata(islatest ? 1100010 : 1100005)

      }

    })


  }

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


  const TableAction = ({ options = [] }) => {
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const ref = useRef(SignalCellularNullSharp)
    return (
      <>
        <IconButton
          ref={ref}
          onClick={(e) => { setOpen(true); setAnchorEl(event.currentTarget); }}
        >
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={ref.current}
          open={open}
          onClose={() => { setOpen(false) }}
          PaperProps={{
            style: {
              width: '15ch',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} onClick={option.clickHandle}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }

  const filteredUsers = applySortFilter(customers, getComparator(order, orderBy), filterName);
  return (
    <>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={()=>setSnackOpen(false)}
        ><Alert severity='error'>sample</Alert></Snackbar>
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
              <Stack direction={'row'} gap={2} mt={2}>
                <Button variant={islatest ? 'contained' : 'outlined'} onClick={() => { getdata(1100010); setIsLatest(true) }}>Latest Updated Customer</Button>
                <Button variant={islatest ? 'outlined' : 'contained'} onClick={() => { getdata(); setIsLatest(false) }}>All Customers</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Card {...rest}>
        <AlertDialog open={alertOpen} setOpen={setAlertOpen} deleteCustomer={deleteUser} cName={cName} />

        {addDialog}
        <PerfectScrollbar>
          <Box >
            <TableContainer style={{ maxHeight: '2000px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>

                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Mobile Number
                    </TableCell>
                    {islatest &&
                      (<TableCell>
                        Updated on
                      </TableCell>)
                    }
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

                      <TableCell sx={{ padding: '4px' }}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            cursor: 'pointer'
                          }}
                        >
                          <Avatar

                            sx={{ mr: 2, ml: 2 }}

                          >
                            {customer.cName ? (getInitials(customer.cName)) : ""}
                          </Avatar>
                          <Link href={`/historyItems/?cId=${customer.cId}&cName=${customer.cName}&phNo=${customer.mobile}`}>
                            <Typography
                              color="textPrimary"
                              variant="body1"
                            >
                              {customer.cName}
                            </Typography>
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '2px' }}>
                        {customer.mobile}
                        <br />
                        {customer.altermobile}
                      </TableCell>
                      {islatest &&
                      (<TableCell>
                        {customer.lastupdate}
                      </TableCell>)
                    }
                      <TableCell sx={{ padding: '2px' }}>
                        {localStorage.getItem('usertype') === 'owner' ? (
                          null
                        ) : (
                          <TableAction
                            options={[
                              { label: 'Edit', clickHandle: (e) => handleAdd(e, true, 'EDIT', { name: customer.cName, mobile: customer.mobile, altNum: customer.altermobile, address: customer.address, proof: customer.proof, cid: customer.cId, Carename: customer.coName, CareMobnum: customer.coMobile }) },
                              { label: 'Delete', clickHandle: () => { deleteConfirm(customer.cId, customer.cName) } }
                            ]} />)
                        }
                        {/* {localStorage.getItem('usertype') === 'owner' ? (
                          null
                        ) : (
                          <Stack direction={'row'} spacing={2}>
                            <EditIcon color='primary' cursor={'pointer'}
                              onClick={(e) => handleAdd(e, true, 'EDIT', { name: customer.cName, mobile: customer.mobile, altNum: customer.altermobile, address: customer.address, proof: customer.proof, cid: customer.cId, Carename: customer.coName, CareMobnum: customer.coMobile })}
                            >Edit</EditIcon>
                            <Tooltip title="Delete">
                              <DeleteIcon cursor={'pointer'} color="error" onClick={() => { deleteConfirm(customer.cId,customer.cName) }} />
                            </Tooltip>
                          </Stack>
                        )} */}
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
