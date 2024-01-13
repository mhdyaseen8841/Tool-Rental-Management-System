import { useState,useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Stack, Container, Typography, TextField, ToggleButtonGroup, ToggleButton, Backdrop, CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


export default function CalculateScreenDialog(details) {
  const [update, setUpdate] = useState(details.updated);
  const [toggleStatus, setToggleStatus] = useState(details.updated ? details.data.status == 0 ? "0" : "1":"0");
  const [backDropOpen, setBackDropOpen] = useState(false);

  const validSchema = Yup.object().shape({
    Amount: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Amount is required'),
    
  });
  const initialDate = update ? details.data.date : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate); // Set the initial state to the current date

  const getData = (date) => {
    // Your logic to fetch data based on the selected date
  };

  const disableFutureDates = (date) => {
    return dayjs(date).isAfter(dayjs(), 'day'); // Disable dates after the current day
  };


  const [alertMsg, setAlert] = useState();

  const formik = useFormik({
    initialValues: {
      Amount: update ? details.data.Amount :'',
      Status: update ? details.data.Status :'1',
      Notes: update ? details.data.note :'',
    },
    validationSchema: validSchema,
    onSubmit: (values) => {
      setBackDropOpen(true)
      values.Status = toggleStatus;
      details.submit(selectedDate,values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const onclose = () => {
    formik.resetForm();
    details.onClose();
  };

  const handleAlignment = () => {
    setToggleStatus(toggleStatus === '1' ? '0' : '1');
  };

  return (
    <div>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDropOpen}
        >
          <CircularProgress color="primary" />
        </Backdrop>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {details.button} Extra Payment
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {details.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ my: 3 }}>
              <Typography variant="h4">ADD EXTRA PAYMENT</Typography>
              <ToggleButtonGroup value={toggleStatus} exclusive onChange={handleAlignment} sx={{ mt: 2 }}>
                <ToggleButton value="0" sx={{ backgroundColor: '#2EB561', color: 'white' }}>
                  <AddIcon />
                </ToggleButton>
                <ToggleButton value="1" sx={{ backgroundColor: '#FF0000', color: 'white' }}>
                  <RemoveIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Stack direction={'row'}  justifyContent={"end"} gap={1}>
  <DatePicker
    label="Select Date"
    format="dd-mm-yyyy"        
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
              type="text"
              label="Amount"
              variant="outlined"
              {...getFieldProps('Amount')}
              error={Boolean(touched.Amount && errors.Amount || alertMsg)}
              helperText={touched.Amount && errors.Amount || alertMsg}
            />
            <TextField
              fullWidth
              type="text"
              label="Notes"
              variant="outlined"
              {...getFieldProps('Notes')}
              error={Boolean(touched.Notes && errors.Notes || alertMsg)}
              helperText={touched.Notes && errors.Notes || alertMsg}
            />
          </Stack>
          
        </Container>
      </Dialog>
    </div>
  );
}
