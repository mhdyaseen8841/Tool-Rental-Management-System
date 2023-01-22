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
import Compressor from 'compressorjs';

import RadioGroup from '@mui/material/RadioGroup';
import FileUpload from 'react-material-file-upload';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Box } from '@mui/system';
import Input from '@mui/material/Input';


export default function FullScreenDialog(details) {
 
  console.log(details.data);
  const [update, setUpdate] = useState(details.updated);
  const [files, setFiles] = useState();
  const [doc,setDoc]= useState(update?details.data.proof:'');
  const [imgbase64, setimgbase64] = useState('');
  const [imgPreview, setImgPreview] = useState();


  const getBase64 = (file) => {

    console.log(file);
    return new Promise((resolve) => {
      // Make new FileReader
      const reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // console.log('Called', reader);
        let baseURL = '';
        baseURL = reader.result;
        console.log(baseURL);
        setDoc(baseURL)
        resolve(baseURL);
      };
    });
  };

  

  const handleFileChange = event => {
    setFiles(event)
    console.log(event[0]);
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
             console.log("error", err);
           })
       },
     });
   }
 


  const validSchema = Yup.object().shape({
    CustomerName: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Name is required'),
    Mobnum: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Mobnum is required'),
    AltMobnum: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Altnum is required'),
    Address: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Address is required'),
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      CustomerName: update ? details.data.name :'',
      Mobnum: update ? details.data.mobile : '',
      AltMobnum : update ? details.data.mobile : '',
      Address: update ? details.data.address : '',
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      console.log("filesss");
      details.submit(values,doc)
     

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
              {details.button} CUSTOMER
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {details.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">CUSTOMER DETAILS</Typography>
            
            {}
            <TextField
              fullWidth
              type="text"
              label="Customer Name"
              variant="outlined"
              {...getFieldProps('CustomerName')}
              error={Boolean(touched.CustomerName && errors.CustomerName)}
              helperText={touched.CustomerName && errors.CustomerName}
            />
            <TextField
           
           fullWidth
           type="text"
           label="Mobile Number"
           variant="outlined"
           value={details.update ? details.data.name : ''}
           {...getFieldProps('Mobnum')}
           error={Boolean(touched.Mobnum && errors.Mobnum || alertMsg)}
           helperText={touched.Mobnum && errors.Mobnum || alertMsg}
         />
         <TextField
           
           fullWidth
           type="text"
           label="Alternative Number"
           variant="outlined"
           value={details.update ? details.data.name : ''}
           {...getFieldProps('AltMobnum')}
           error={Boolean(touched.AltMobnum && errors.AltMobnum || alertMsg)}
           helperText={touched.AltMobnum && errors.AltMobnum || alertMsg}
         />
            <TextField
              fullWidth
              type="text"
              label="Address"
              variant="outlined"
              {...getFieldProps('Address')}
              error={Boolean(touched.Address && errors.Address)}
              helperText={touched.Address && errors.Address}
            />
            
          { doc ? 
         <img
        
          style={{width: 150, height: 150, objectFit: 'contain' ,cursor: "pointer"  }}
          src={`${doc}`}
          role="presentation"
          alt="no network"
        />
       :  
       <Typography variant="subtitle2" sx={{cursor: "pointer"}}
     >
        No Image
      </Typography>

         }

          <FileUpload value={files} onChange={handleFileChange} />

          
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
