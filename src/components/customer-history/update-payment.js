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
 
  Stack,
  Container,
  Typography,
 
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';




export default function FullScreenDialog(details) {
 
 

    


  const validSchema = Yup.object().shape({
    // Amount: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Amount is required'),
    Amount: Yup.number()
    .required('Amount is required')
    .typeError('Amount must be a number')
    .positive('Amount must be a positive number')
  
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
    
      details.submit(values.Amount)
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
    <>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: 'relative',background: '#5048E5' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {details.button} PAYMENT
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              ADD
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">UPDATE PAYMENT</Typography>
            
          
            <TextField
  fullWidth
  type="Text"
  label="Amount"
  variant="outlined"
  {...getFieldProps('Amount')}
  error={Boolean(touched.Amount && errors.Amount)}
  helperText={touched.Amount && errors.Amount}
  inputProps={{
    inputMode: 'numeric',
    pattern: '\\d*'
  }}
/>


        
          </Stack>
        </Container>
      </Dialog>
    </>
  );
}
