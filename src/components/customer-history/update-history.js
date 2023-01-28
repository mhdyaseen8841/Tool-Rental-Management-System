import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import requestPost from '../../../serviceWorker'
// material
import { Dayjs } from 'dayjs';


import dayjs from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
 
  const [value, setValue] = useState(dayjs().format('YYYY-MM-DD'));

  const [update, setUpdate] = useState(details.updated);

// const [itemsArr,setItemsArr]=useState([{}])

     
    


  const validSchema = Yup.object().shape({
    qty: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('quantity is required')
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
    
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      console.log(values.qty);
    let  req={
        hId:details.data.hId,
        date:value,
        qty:values.qty
      }
details.submit(req)
     
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
            <Typography variant="h4">RENT HISTORY of {details.data.name}</Typography>
            
          
            <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Date"
    value={value}
    onChange={(newValue) => {
      setValue(newValue.format('YYYY-MM-DD'));
    }}
    renderInput={(params) => <TextField {...params} />}
  />
</LocalizationProvider>
                     <Stack direction="row" spacing={2}>
                      <FormControl>
                        <OutlinedInput type='number' id='qty'  label="quantity" labelId='qty'  
                         error={Boolean(touched.qty && errors.qty)}
                         helperText={touched.qty && errors.qty}
                         {...getFieldProps('qty')}
                         />
                      </FormControl>
                      </Stack>
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
