import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Stack, Container, Typography, TextField, Checkbox, Alert ,FormControl } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import ItemTable from './item-table';



export default function FullScreenDialogPopup(details) {
    
  const [update, setUpdate] = useState(details.updated);


  const validSchema = Yup.object().shape({
    ItemName: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Name is required'),
    StockNumber: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Stock is required'),
    Status: Yup.string().required('Status is required'),
    


  });

  const [alertMsg, setAlert] = useState();
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
 
  const formik = useFormik({
    initialValues: {
      ItemName: update ? details.data.name :'',
    
    },
    validationSchema: validSchema,
    onSubmit: (values) => {
    
      details.submit(values)
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  

  const onAdd = () => {
 
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

  useEffect(() => {
    setDialog(() => (
      <ItemTable />
    ));
  }, []);
  
  return (
    <div>

      <ItemTable/>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
             Item Detail
            </Typography>
           
          </Toolbar>
        </AppBar>
    
     
        <Container maxWidth="lg" sx={{ pt: 5 }}>
            {addDialog}
         </Container>



      </Dialog>
      
    </div>
  );
}
