import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Stack, Container, Typography, TextField, Checkbox, Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Box } from '@mui/system';
import FileUpload from 'react-material-file-upload';
import Compressor from 'compressorjs';



export default function FullScreenDialog(details) {
    
  const [update, setUpdate] = useState(details.updated);

  const [files, setFiles] = useState();
  const [doc,setDoc]= useState(update?details.data.proof:'');
  const [imgbase64, setimgbase64] = useState('');
  const [imgPreview, setImgPreview] = useState();


  const getBase64 = (file) => {

    return new Promise((resolve) => {
      // Make new FileReader
      const reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        let baseURL = '';
        baseURL = reader.result;
        setDoc(baseURL)
        resolve(baseURL);
      };
    });
  };

  

  const handleFileChange = event => {
    setFiles(event)
    
     const fileObj = event && event[0];
     if (!fileObj) {
         return;
     }
    
 
     setImgPreview(URL.createObjectURL(event[0]))
     new Compressor(event[0], {      
       quality: 0.6,
       success: (compressedResult) => {
           getBase64(compressedResult).then((result) => {
               setimgbase64(result);
              
               setImgPreview();
 
              
             }).catch((err) => {
           })
       },
     });
   }


  const validSchema = Yup.object().shape({
    ItemName: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Name is required'),
    MonthlyRent: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Monthly Rent is required'),
    Stock: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Stock is required'),
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      ItemName: update ? details.data.name :'',
      MonthlyRent: update ? details.data.mRent : '',
      Stock: update ? details.data.tStock : '',
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      
      details.submit(values,doc)
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
            <Typography variant="h4">ITEM DETAILS</Typography>
            
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
              label="Monthly Rent"
              variant="outlined"
              value={details.update ? details.data.name : ''}
              {...getFieldProps('MonthlyRent')}
              error={Boolean(touched.MonthlyRent && errors.MonthlyRent || alertMsg)}
              helperText={touched.MonthlyRent && errors.MonthlyRent || alertMsg}
            />
           <TextField
           
           fullWidth
           type="text"
           label="Stock"
           variant="outlined"
           value={details.update ? details.data.name : ''}
           {...getFieldProps('Stock')}
           error={Boolean(touched.Stock && errors.Stock || alertMsg)}
           helperText={touched.Stock && errors.Stock || alertMsg}
         />



           
            
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
