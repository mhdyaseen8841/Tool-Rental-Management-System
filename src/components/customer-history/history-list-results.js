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
  Dialog,
  DialogActions,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
import FullScreenDialog from './update-history';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import Router from 'next/router';
import { useEffect } from 'react';



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


export const HistoryListResults = ({ customers, getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [mId, setMid] = useState('');
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };


  const deleteConfirm = (mid) => {
    setAlertOpen(true)
    setMid(mid)
  }


  const deleteUser = () => {
    let del = {
      "type": "SP_CALL",
      "requestId": 1400004,
      request: {
        "mId": mId
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


      } else {
        setAlertOpen(false)
        getdata()

      }

    })
    setMid('')

  }

  const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
    setOpen(true);


    const add = (data) => {


      let req = {
        "type": "SP_CALL",
        "requestId": 1400002,
        request: data
      }

      requestPost(req).then((res) => {
        if (res.errorcode == 3) {
          Router
            .push(

              {
                pathname: '/',
                query: { redirect: '1' },
              })
        } else {

          if (res.errorcode == 0) {
            let error = "error happend"

          } else {
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




  const handleHModalAdd = (e, mid, hStatus) => {
    //setOpen(true); 
    setDialog(() => (
      <GetHistoryDialog
        onClose={handleClose}
        open={true}
        mId={mid}
        hStatus={hStatus}
      />
    ));


  };

  return (

    <Card {...rest}>
      <AlertDialog open={alertOpen} setOpen={setAlertOpen} deleteCustomer={deleteUser} />

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
                    Actions
                  </TableCell>

                  {/* {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (<TableCell>
    Actions
   </TableCell>)} */}

                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (

                  <TableRow
                    hover
                    key={customer.mId}
                    selected={selectedCustomerIds.indexOf(customer.mId) !== -1}
                  >

                    <TableCell
                      onClick={(e) => handleHModalAdd(e, customer.mId, customer.status)}
                    >

                      <Button sx={{ backgroundColor: customer.status ? '#f32013' : '#4BB543' }}
                        variant="contained">{customer.status ? 'RENTED' : 'RETURN'}</Button>

                    </TableCell>

                    <TableCell
                      onClick={(e) => handleHModalAdd(e, customer.mId)}
                    >
                      {customer.Date}
                    </TableCell>

                    {/* {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : ( <TableCell>
    <FadeMenu   updateItem={(e)=>handleAdd(e,true,'UPDATE', {name:customer.item,hId:customer.hId,qty:customer.qty})} />
    </TableCell>)} */}

                    <TableCell>
                      {customer.deleteStatus == '1' ? (
                        <Tooltip title="Delete">
                          <DeleteIcon cursor={'pointer'} color="error" onClick={() => { deleteConfirm(customer.mId) }} />
                        </Tooltip>

                      ) : (
                        <Tooltip title="Can't Delete, history older than 1 week">
                          <DeleteIcon cursor={'pointer'} color="disabledColor" />
                        </Tooltip>
                      )}

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer >
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};


HistoryListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
