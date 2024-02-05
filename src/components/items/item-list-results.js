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
  Snackbar,
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
import FullScreenDialogPopup from './item-popup';
import FullScreenDialogUpdate from './update-item';
import requestPost from '../../../serviceWorker'
import Router from 'next/router';
import AlertDialog from '../customer/customer-list-results';

export const ItemListResults = ({ items, getdata, ...rest }) => {
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const [itemId, setItemId] = useState();
  const [itemName, setItemName] = useState('');
  const [snackbarOpen, setSnackbaropen] = useState(false);
  const [errorMsg, setErrormsg] = useState('')

  const handleClose = () => {
    setDialog();
  };

  const handlePopup = (e, itemId) => {
    setOpen(true);
    setDialog(() => (

      <FullScreenDialogPopup
        onClose={() => { handleClose(); getdata(); }}
        open={open}

        button="close"
        data={itemId}
      />
    ));
  };

  const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
    setOpen(true);
    let itemId = data.itemId;

    const add = (data) => {

      let req = {
        "type": "SP_CALL",
        "requestId": 1200002,
        request: {
          "itemId": itemId,
          "itemName": data.ItemName,
          "monthly": data.MonthlyRent,
          "daily": data.DailyRent,
          "stock": data.Stock,

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
        } else {

          if (res.errorcode == 0) {


          } else {
            getdata()

          }

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


  const handleUPDATE = (e, upd, button = 'UPDATE', data = {}) => {


    setOpen(true);

    let itemId = data.itemId;



    const add = (data) => {

      let req = {
        "type": "SP_CALL",
        "requestId": 1300001,
        request: {
          "itemId": itemId,
          "qty": data.StockNumber,
          "status": data.Status,
          "note": data.Notes,
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
        } else {


          if (res.errorcode == 0) {

          } else {
            getdata()

          }
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

  const handleDelete = () => {
    let req = {
      "type": "SP_CALL",
      "requestId": 1200003,
      request: {
        "itemId": itemId,
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
      } else {


        if (res.errorcode == 0) {
          
        } else {
          getdata()
        }
        setErrormsg(res.errorMsg)
        setSnackbaropen(true)
        setAlertOpen(false)
      }

      setDialog();
    });
  }

  const deleteConfirm = (itemid, name) => {
    setAlertOpen(true)
    setItemId(itemid)
    setItemName(name)
  }
  return (

    <Card {...rest}>
      {addDialog}
      <AlertDialog open={alertOpen} setOpen={setAlertOpen} deleteCustomer={handleDelete} cName={itemName} />
      <Snackbar open={snackbarOpen} onClose={() => { setSnackbaropen(false) }} autoHideDuration={3000} message={errorMsg} anchorOrigin={{ vertical:'bottom',horizontal:'right'  }} />
      <TableContainer >
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
                Available Stocks
              </TableCell>
              <TableCell>
                Total Stocks
              </TableCell>
              {localStorage.getItem('usertype') === 'owner' ? (
                null
              ) : (<TableCell>
                Actions
              </TableCell>)}

            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                hover
                key={item.itemId}
              >

                <TableCell style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={(e) => handlePopup(e, item.itemId)}>
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
                      {item.iName}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  ₹{item.mRent}
                </TableCell>
                <TableCell>
                  {item.aStock}
                </TableCell>
                <TableCell>
                  {item.tStock}
                </TableCell>
                {localStorage.getItem('usertype') === 'owner' ? (
                  null
                ) : (<TableCell>
                  <FadeMenu
                    updateItem={(e) => handleUPDATE(e, true, 'UPDATE', { name: item.iName, itemId: item.itemId })}
                    editUser={(e) => handleAdd(e, true, 'EDIT', { name: item.iName, mRent: item.mRent, dRent: item.dRent, tStock: item.tstock, itemId: item.itemId })}
                    callback={() => { deleteConfirm(item.itemId, item.iName) }} />
                </TableCell>)}


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

ItemListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
