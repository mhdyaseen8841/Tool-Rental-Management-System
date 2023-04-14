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

} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Router from 'next/router';



export default function ReturnDialog(details) {
 
 
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
       "requestId" : 1500002,
           request: {
            "cId":details.cId
          }
    }
   console.log(requestdata2);
    requestPost(requestdata2).then((res)=>{


      if(res.errorCode===3){
        Router
        .push('/login')
    }else{
      if(res.result[0] ==null){
        setItems([{}])
      }else{
        setItems(res.result);
        console.log("huuuuuuuuuuuuuuuuuuuu");
        console.log(items);
      }
      }
    
     
    }).catch(err=>{
      console.log(err);
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
      let flag=false;
      if(values.Notes){
        notes=values.Notes;
      }
      let itemsArr = [];
           
      for (let ind = 0; ind< items.length; ind++) {
        console.log("looooooooop"+ind)
        const element = document.getElementById(`return${ind}`);
        const checkelement = document.getElementById(`tick${ind}`);
        console.log(element.value);
        console.log(checkelement.checked);

        console.log("pending"+items[ind].pending)
      console.log("element.value"+element.value)

      var numberAsInt = parseInt(element.value, 10);  
      if(checkelement.checked){
     if(items[ind].pending<numberAsInt){
      
      console.log("items[ind].pending>element.value error adich ");
      setqtErr(true);
      setQtyError("Quantity should be less than or equal to pending quantity");
      flag=true;
      break;
     }
     else if(element.value==0){
      console.log("element.value===0 error adich ");
      setqtErr(true);
      setQtyError("Quantity should be greater than 0");
      flag=true;
      break
    }else{
      itemsArr.push({
        "itemId": items[ind].itemId,
"qty": element.value
  })
    }
  }
      }
      console.log(itemsArr);
      // details.submit(notes,itemsArr);
      if(flag==false){
        details.submit(notes,itemsArr);
      }else{
        
      }
}

    
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  
  const [state, setState] = useState({
    open: false,
    Transition: Fade,
  });

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  
  const alertTimeOut = () => {
    setTimeout(() => {
      setAlert();
    }, 2000);
  };
  const onclose = () => {
    formik.resetForm();
    details.onClose();
  };


  const styles = {
    disabled: {
      color: 'black',
      borderColor: 'black',
    },
  };
 
  return (
    <>
    {
      qterr && 
  

     <Snackbar open={open}  onClose={handleClose}>
  <Alert onClose={handleClose} autoHideDuration={4000} severity="error" sx={{ width: '100%' }}>
    {qtyerror}
  </Alert>
</Snackbar>
    }
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
            
            {}

            <TextField
              fullWidth
              type="text"
              label="Notes"
              variant="outlined"
              {...getFieldProps('Notes')}
              error={Boolean(touched.notes && errors.notes)}
              helperText={touched.notes && errors.notes}
            />
            
  
          </Stack>

{items.map((item,ind)=>{


return(
  <Stack direction="row" pt={2} spacing={2}>

          <TextField
      id={`item${ind}`}
      label="Item Name"
      defaultValue={item.itemName}
      disabled={true}
      variant="outlined"
      InputProps={{ style: styles.disabled }}
      InputLabelProps={{ style: styles.disabled }}
    />


<TextField
      id={`pending${ind}`}
      label="Outgoing Items"
      defaultValue={item.pending}
      disabled={true}
      variant="outlined"
      
      InputProps={{ style: styles.disabled }}
      InputLabelProps={{ style: styles.disabled }}
    />

<TextField
      id={`return${ind}`}
      label="Return Items"
      
      variant="outlined"
      
      InputProps={{ style: styles.disabled }}
      InputLabelProps={{ style: styles.disabled }}
    />

<Checkbox id={`tick${ind}`} color="success" />

</Stack>

)
}
)}
          
          
  
  
  
        </Container>
      </Dialog>
    </>
  );
}
