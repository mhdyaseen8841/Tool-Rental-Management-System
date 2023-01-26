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
import { Box } from '@mui/system';
import FileUpload from 'react-material-file-upload';
import Compressor from 'compressorjs';



export default function FullScreenDialogUpdate(details) {
    console.log('heehehe');
  console.log(details.data);
  const [update, setUpdate] = useState(details.updated);


  const validSchema = Yup.object().shape({
    ItemName: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Name is required'),
    StockNumber: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Stock is required'),
    Status: Yup.string().required('Status is required'),
    


  });

  const [alertMsg, setAlert] = useState();
 
  const formik = useFormik({
    initialValues: {
      ItemName: update ? details.data.name :'',
    
    },
    validationSchema: validSchema,
    onSubmit: (values) => {
      console.log("filesss");
      console.log(values)
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
  return (
    <div>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {details.button} Items
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {details.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">ITEM UPDATE</Typography>
            
            <TextField
              fullWidth
              type="text"
              label="Stock Name"
              variant="outlined"
              {...getFieldProps('ItemName')}
              error={Boolean(touched.ItemName && errors.ItemName)}
              helperText={touched.ItemName && errors.ItemName}
            />

            <TextField
           
           fullWidth
           type="text"
           label="Stock Number"
           variant="outlined"
          
           {...getFieldProps('StockNumber')}
           error={Boolean(touched.StockNumber && errors.StockNumber || alertMsg)}
           helperText={touched.StockNumber && errors.StockNumber || alertMsg}
         />
            
          
   
 
    <FormControl>
  <FormLabel id="demo-controlled-radio-buttons-group">ADD / LESS Stock</FormLabel>
  <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    // value={value}
    // onChange={handleChange}
  >
    <FormControlLabel {...getFieldProps('Status')} value="1" error={Boolean(touched.Status && errors.Status || alertMsg)}
           helperText={touched.Status && errors.Status || alertMsg} control={<Radio />} label="+" />

    <FormControlLabel {...getFieldProps('Status')} value="0" error={Boolean(touched.Status && errors.Status || alertMsg)}
           helperText={touched.Status && errors.Status || alertMsg} control={<Radio />} label="-" />
  </RadioGroup>
</FormControl>


           
            
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
