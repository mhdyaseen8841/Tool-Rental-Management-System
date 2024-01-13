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
  Backdrop,
  CircularProgress,
 
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';





export default function AddPaymetDialog(details) {
 
 

  const [selectedDate, setSelectedDate] = useState(new Date()); // Set the initial state to the current date
  const [backDropOpen, setBackDropOpen] = useState(false);

  const getData = (date) => {
    // Your logic to fetch data based on the selected date
  };

  const disableFutureDates = (date) => {
    return dayjs(date).isAfter(dayjs(), 'day'); // Disable dates after the current day
  };


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
      setBackDropOpen(true)
      details.submit(values.Amount,selectedDate);
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
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDropOpen}
        >
          <CircularProgress color="primary" />
        </Backdrop>
        <AppBar sx={{ position: 'relative',background: '#5048E5' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {details.button} ADD PAYMENT
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              ADD
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">ADD PAYMENT</Typography>
            
            <Stack direction={'row'}  justifyContent={"end"} gap={1}>
  <DatePicker
    label="Select Date"
    format="DD-MM-YYYY"
    inputFormat="dd-MM-yyyy" 
    value={selectedDate}
    shouldDisableDate={disableFutureDates}
    sx={{ width: '40%' }}
    onChange={(newDate) => {
      setSelectedDate(newDate);
      getData(newDate);

    }}
    renderInput={(params) => <TextField {...params} />}
  />
</Stack>

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
