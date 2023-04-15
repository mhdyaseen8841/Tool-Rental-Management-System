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
import FullScreenDialog from './add-item';
import requestPost from '../../../serviceWorker'
import Router from 'next/router';
export const ItemListToolbar = (props) => 
{

  const [open, setOpen] = useState(false);

  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };

const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  setOpen(true);
  const add = (data,file) => {
    console.log("stocksssssssssssssssssss");
    console.log(data);
    console.log(file);
    
   let req={
    "type" : "SP_CALL",
    "requestId" : 1200001,
    request: {
     "itemName": data.ItemName,
     "monthly": data.MonthlyRent,
     "daily": data.DailyRent,
     "stock": data.Stock,
     "proof" : file
   }
}



requestPost(req).then((res)=>{
  if(res.errorCode===3){
    Router
        .push(
        
        {
          pathname: '/login',
          query: { redirect: '1' },
        })
}else{


  if(res.errorcode ==0){
    setDialog();
    console.log(error);
            console.log('No internet connection found. App is running in offline mode.');
  }else{
    props.getdata()
    setDialog();
  }
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
        Items
      </Typography>
     
      {sessionStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (<Box sx={{ m: 1 }}>
    <Button
      color="primary"
      variant="contained"
      onClick={handleAdd}
    >
      Add Items
    </Button>
  </Box>)}
      
    </Box>
    
  </Box>
);
            }