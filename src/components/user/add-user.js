import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Stack, Container, Typography, TextField, Checkbox, Alert, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Compressor from 'compressorjs';

import FileUpload from 'react-material-file-upload';




export default function FullScreenDialog(details) {
 


  const validSchema = Yup.object().shape({
    UserName: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Name is required'),
    UserPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });
  

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      UserName: details.data.name ,
      UserPassword:  details.data.password ,
      // UserName: update ? details.data.name :'',
      // UserPassword: update ? details.data.password :'',
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
     
      details.submit(values)
     

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
              {details.button} USER
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {details.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">USER DETAILS</Typography>
            
            {}
            <TextField
  fullWidth
  type="text"
  label="User Name"
  variant="outlined"
  {...getFieldProps('UserName')}
  error={Boolean(touched.UserName && errors.UserName)}
  helperText={touched.UserName && errors.UserName}
/>

        
      
        <TextField
  error={Boolean(touched.UserPassword && errors.UserPassword)}
  fullWidth
  helperText={touched.UserPassword && errors.UserPassword}
  label="Password"
  margin="normal"
  name="UserPassword"
  onBlur={formik.handleBlur}
  onChange={formik.handleChange}
  type="password"
  value={formik.values.UserPassword}
  variant="outlined"
/>

<FormControl>
  <FormLabel id="demo-controlled-radio-buttons-group">ADMIN / OWNER</FormLabel>
  <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    // value={value}
    // onChange={handleChange}
  >
     {Boolean(touched.Status && errors.Status || alertMsg)}
    {touched.Status && errors.Status || alertMsg} 
    <FormControlLabel {...getFieldProps('Status')} value="Admin" label="Admin" control={<Radio />} />

    <FormControlLabel {...getFieldProps('Status')} value="Owner" label="Owner" control={<Radio />} />
  </RadioGroup>
</FormControl>

         
          
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
