import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography, Snackbar
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { useState, useEffect } from 'react';
import FullScreenDialog from '../active-inactive/add-customer';
import requestPost from '../../../serviceWorker'
import Router from 'next/router'
export const CustomerListToolbar = (props) => {

  const [open, setOpen] = useState(true);

  const [addDialog, setDialog] = useState();

  const [msg, setMsg] = useState();

  const [snackbarOpen, setSnackOpen] = useState(false)

  const handleClose = () => {
    setDialog();
  };

  const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
    setOpen(true);
    const add = async (data, file, cPic) => {
      let req = {
        "type": "SP_CALL",
        "requestId": 1100001,
        "request": {
          "name": data.CustomerName,
          "mobile": data.Mobnum,
          "address": data.Address,
          "altermobile": data.AltMobnum,
          "proof": cPic,
          "coName": data.Carename,
          "coMobile": data.CareMobnum,
          "documents": [],
          "status": 0
        }
      };

      for (let i = 0; i < file.length; i++) {
        req.request.documents.push({
          "doc": file[i]
        });
      }

      const rs = requestPost(req).then((res) => {
        if (res.errorCode === 3) {
          Router
            .push(

              {
                pathname: '/',
                query: { redirect: '1' },
              })

        } else if (res.errorCode == 0) {
          setMsg(res.errorMsg);
          setSnackOpen(true);

          // setDialog();

        } else {
          props.getdata()
          setDialog();

        }



      })


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


  return (
    <Box {...props}>
      <Snackbar
        open={snackbarOpen}
        onClose={() => { setSnackOpen(false) }}
        autoHideDuration={3000}
        message={msg}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        {addDialog}
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          Customers
        </Typography>
        <Box sx={{ m: 1 }}>


          {localStorage.getItem('usertype') === 'owner' ? (
            null
          ) : (<Button
            color="primary"
            variant="contained"
            onClick={handleAdd}
          >
            Add Customer
          </Button>)}

        </Box>
      </Box>

    </Box>
  );
}