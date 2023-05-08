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
import FullScreenDialogUpdated from './updated-list-popup';
export const ItemListToolbar = (props) => 
{

  const [open, setOpen] = useState(false);

  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };

const handleUpdate = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  setOpen(true);

  setDialog(() => (
    <FullScreenDialogUpdated
      onClose={handleClose}
      open={true}


    />
  ));
};
const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  setOpen(true);
  const add = (data,file) => {
    
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
   let req={
    "type" : "SP_CALL",
    "requestId" : 1200001,
    request: {
     "itemName": data.ItemName,
     "monthly": data.MonthlyRent,
     "daily": data.DailyRent,
     "stock": data.Stock
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
}else{


  if(res.errorcode ==0){
    setDialog();
    
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
      open={true}
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
     
      {localStorage.getItem('usertype') === 'owner' ? (
    null
  ) : (<Box sx={{ m: 1 }}>

<Button
  color="primary"
  variant="contained"
  onClick={handleUpdate}
  style={{ marginRight: '10px' }}
>
  Updated Lists
</Button>


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