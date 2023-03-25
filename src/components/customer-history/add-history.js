import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import requestPost from '../../../serviceWorker'
// material
import {
  TextField,
  InputAdornment,
  Card,
  Table,
  Stack,
  Avatar,

  Alert,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
  MenuItem,
  Autocomplete,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,

} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Compressor from 'compressorjs';

import FileUpload from 'react-material-file-upload';




export default function FullScreenDialog(details) {
 
 
  const [update, setUpdate] = useState(details.updated);
  const [noOfRows, setNoOfRows] = useState(1);
  const [items, setItems] = useState([]);
  const [qtyerror, setQtyError] = useState('');
  const [qterr,setqtErr]=useState(false);
  const [selectedItems, setSelectedItems] = useState([...Array(noOfRows)].map(() => ""))
// const [itemsArr,setItemsArr]=useState([{}])
  useEffect(() => {

    
    
        const requestdata2 =   {
          "type" : "SP_CALL",
       "requestId" : 1200005,
           request: {
          }
    }
   
    requestPost(requestdata2).then((res)=>{
      if(res.result[0] ==null){
        setItems([{}])
      }else{
        setItems(res.result.map((value) => { return { label: value.iName, itemId: value.itemId,astock: value.astock  } }));
        console.log(items);
      }
     
    })
  },[])
     
    


  const validSchema = Yup.object().shape({
   
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
    
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      
      let notes="";
      if(values.Notes){
        notes=values.Notes;
      }
      let itemsArr = []
     console.log("submitttttttttttttttttttttttttttttttttt");
    console.log(selectedItems);
    let shouldBreak = false;
    setQtyError('');
    [...Array(noOfRows)].map((elementInArray, ind) => {


      if (shouldBreak) {
        return;
      }

      if (selectedItems[ind] !== "") {
       
if(selectedItems[ind]){
  let aqty=  items.find(obj => obj.itemId === selectedItems[ind]);
  
  console.log(aqty);
  const element = document.getElementById(`qty${ind}`);
  if(element){
    if((aqty.astock < element.value)  ){
    
        setQtyError(aqty.label+' Out of stock!, available stock is only '+aqty.astock)
        setqtErr(true)
        shouldBreak = true;
        return;
      
      console.log("out of stock");
    }else if(parseInt(element.value) <= 0){

        setQtyError('enter '+ aqty.label+' quantity greater than zero')
        setqtErr(true)
        shouldBreak = true;
        return;
    }
    
    else{
      setQtyError('')
      setqtErr(false)

      itemsArr.push({
        "itemId":selectedItems[ind],
        "qty":element.value,
  
      })
  
      console.log("heyheyhey");
    }
}
  
          
}


      }
    
    })
console.log(itemsArr);

if(qterr===false){
if(itemsArr.length === 0){
console.log("array null");
setQtyError('Add atleast one item')
setqtErr(true)
}else{
  setQtyError('')
  setqtErr(false)
  details.submit(itemsArr,notes,1)
}
}

    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  

  
  
  const alertTimeOut = () => {
    setTimeout(() => {
      setAlert();
    }, 2000);
  };
  const onclose = () => {
    formik.resetForm();
    details.onClose();
  };
 
  return (
    <div>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: 'relative',background: '#5048E5' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {details.button} RENT HISTORY
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {details.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">RENT HISTORY</Typography>
            
          
             <TextField
              fullWidth
              type="text"
              label="Notes"
              variant="outlined"
              {...getFieldProps('Notes')}
              error={Boolean(touched.Notes && errors.Notes)}
              helperText={touched.Notes && errors.Notes}
            /> 

              {[...Array(noOfRows)].map((elementInArray, ind) => {
                  return (
                 
                     <Stack direction="row" spacing={2}>
                    <FormControl fullWidth key={ind}> 
                   
                    <InputLabel id={`item${ind}`}>Items</InputLabel> 
                    <Select sx={{ minWidth: 300 }} labelId={`item-label-${ind}`} id={`item${ind}`}  label="Items" 
                     value={selectedItems[ind]}
                      onChange={(event) => {
                         setSelectedItems(prevItems => {
                           prevItems[ind] = event.target.value;
                        return [...prevItems];
                        });
                         }}>
                        {items.map(({label, itemId}, index)  => (
                            <MenuItem key={index} value={itemId} >{label}</MenuItem>
                        ))} 
                      </Select>
                      
                      </FormControl>
                      
                      <FormControl>
                        
                      <TextField label="Quantity" variant="outlined" type='number'  id={`qty${ind}`} labelId={`qty-label-${ind}`} defaultValue={1}  />
                        
                      </FormControl>
                      </Stack>
                  
                   
                  )
                })}


    

              <Stack direction="row" mb={2} justifyContent="space-between" pl={2} /* alignItems="center"  */ >
          <Button onClick={() => setNoOfRows(noOfRows + 1)}>+ Add Item</Button>
        </Stack>
       {qterr?<Alert severity="error">{qtyerror}</Alert>:''} 
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
