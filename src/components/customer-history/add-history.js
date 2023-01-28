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
        setItems(res.result.map((value) => { return { label: value.iName, itemId: value.itemId } }));
        
      }
     
    })
  },[])
     
    


  const validSchema = Yup.object().shape({
    Notes: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Note is required'),

  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
    
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      console.log(values.Notes)
      let itemsArr = []
     console.log("submitttttttttttttttttttttttttttttttttt");
    console.log(selectedItems);
   
    [...Array(noOfRows)].map((elementInArray, ind) => {

      if (selectedItems[ind] !== "") {
       console.log(ind);
if(selectedItems[ind]){
          itemsArr.push({
            "itemId":selectedItems[ind],
            "qty": document.getElementById(`qty${ind}`).value,

          })
}


      }
     
    })
console.log(itemsArr);
details.submit(itemsArr,values.Notes,1)
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
                    <Select sx={{ minWidth: 400 }} labelId={`item-label-${ind}`} id={`item${ind}`}  label="Items" 
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
                        <OutlinedInput type='number' id={`qty${ind}`} labelId={`qty-label-${ind}`} defaultValue={1}  />
                        
                      </FormControl>
                      </Stack>
                  
                   
                  )
                })}


    

              <Stack direction="row" mb={2} justifyContent="space-between" pl={2} /* alignItems="center"  */ >
          <Button onClick={() => setNoOfRows(noOfRows + 1)}>+ Add Item</Button>
        </Stack>
          
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
