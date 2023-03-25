import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography,
  Snackbar,Alert
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { useState, useEffect } from 'react';
import FullScreenDialog from './add-history';
import requestPost from '../../../serviceWorker'
import { mt } from 'date-fns/locale';
export const HistoryListToolbar = (props) => 
{

  const [open, setOpen] = useState(true);

  const [addDialog, setDialog] = useState();
  const [cId, setCid] = useState(props.cId);
  const [cName, setcName] = useState(props.cName);
  const [ErrOpen, setErrOpen] = useState(false)
  const [error, setError] = useState('')

 const handleErrClose = ()=>{
  setOpen(false)
 }
  const handleClose = () => {
    setDialog();
  };

const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  setOpen(true);

  const add = (items,note,status) => {
   console.log("ciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiddddddddddddddddddddd");
    console.log(cId)
    console.log(items);
   let req={
    "type" : "SP_CALL",
 "requestId" : 1400001,
     request: {
"cId":cId,
"status":1,
"note" :note,
"items":items
    }
}



requestPost(req).then((res)=>{
  if(res.errorcode==0){
    setDialog();
    console.log(error);
            console.log('No internet connection found. App is running in offline mode.');
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

const [itemButton, setButtons] = useState([{}])
function getItems(){
  let data=  {
    "type" : "SP_CALL",
    "requestId" : 1200005,
    request: {
   }
}

requestPost(data).then((res)=>{
  if(res.result){
  if(res.result[0] ==null){
    setButtons([{}])
  }else{
    console.log(res);
    setButtons(res.result)
  }
 
}else{
  setError(""+res)
      setErrOpen(true)
      setButtons([{}])
    }
  })
}



useEffect(() => {
 getItems();
 console.log(props.cName);
 console.log(cName);
}, [])


return(
  
  <Box {...props}>

<Snackbar open={open} autoHideDuration={6000} onClose={handleErrClose}>
  <Alert onClose={handleErrClose} severity="error" sx={{ width: '100%' }}>
    {error}
  </Alert>
</Snackbar>
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
         {cName}
      </Typography>
      <Box sx={{ m: 1 }}>
        
        <Button
          color="primary"
          variant="contained"
          onClick={handleAdd}
        >
          Add History
        </Button>
      </Box>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
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
              placeholder="Search Product"
              variant="outlined"
            />




            
        
        
          </Box>
        </CardContent>
      </Card>
    </Box>

    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box >
        
         
          <Button
          sx={{ ml: 2,mt:2 }}
          color="primary"
          variant="contained"
          onClick={handleAdd}
        >
          HISTORY
        </Button>

 
        <Button
          sx={{ ml: 2,mt:2 }}
          color="primary"
          variant="contained"
          onClick={handleAdd}
        >
          ITEMS
        </Button>

          {itemButton.map(({iName, itemId}, index)  => {
return(
<Button
sx={{ ml: 2 ,mt :2 }}
color="primary"
variant="contained"
onClick={() => handleAdd(itemId)}
>
{iName}
</Button>
)
})}
        
         

        

      
        <Button
          sx={{ ml: 2,mt:2 }}
          color="primary"
          variant="contained"
          onClick={handleAdd}
        >
          TOTAL
        </Button>


  



            
        
        
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);
            }