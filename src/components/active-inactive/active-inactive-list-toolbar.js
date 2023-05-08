import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { useState, useEffect } from 'react';
// import FullScreenDialog from './active-inactive';
import FullScreenDialog from './add-customer';
import requestPost from '../../../serviceWorker'
import Router from 'next/router'
export const ActiveInactiveListToolbar = (props) => 
{

  const [open, setOpen] = useState(true);

  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };

const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  setOpen(true);

  const add = (data,file) => {
   
    
   let req={
      "type" : "SP_CALL",
      "requestId" : 1100001,
      request: {
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
  setDialog();
   
  }else{
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


return(
  <Box {...props}>
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
        Active/Inactive Customers
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