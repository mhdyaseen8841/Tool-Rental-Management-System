import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as Yup from 'yup';

import { useFormik } from 'formik';
import { useState } from 'react';
import { Grid } from '@mui/material';
import { useEffect,useRef } from 'react';

import requestPost from '../../../serviceWorker';

export default function DateDialog(details) {

  const inputRef = useRef(null);
  const [open, setOpen] = React.useState(false);
const [update, setUpdate] = useState(details.updated);
const [value, onChange] = useState(new Date());
const [startDate, setStartDate] = useState("");
const [minDate, setminDate] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



 const handleUpdate = () => {
  const selectedDate = inputRef.current.value;
  if(selectedDate === ""){
    alert("Please select a date")
  }else{

    let req= {
      "type" : "SP_CALL",
      "requestId" : 1600002,
      request: {
     "rId" : details.data.rId,
        "returnDate" : selectedDate
     }
}

    details.submit(req)

    setOpen(false);
  }
  
 }


  
  const onclose = () => {
    
    details.onClose();
  };

  useEffect(() => {
   
    setStartDate(details.data.date)
    setminDate(details.data.cDate)
  }, [])
  

  return (
    <div>
      <Dialog open={details.open} onClose={onclose}>
        <DialogTitle>Update Rate</DialogTitle>
        <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer components={['DatePicker']}> */}

        {/* <DatePicker label="Basic date picker" />
         */}
         
 <Grid sx={{alignItems:'center'}}>
        <input ref={inputRef} style={{   height:'30px',width:'150px', outline: 'none', borderRadius: '5px',borderColor: 'rgba(128, 128, 128, 0.5)', borderWidth: '1px'}} type="date"  max={startDate}  defaultValue={startDate} min={minDate} />

 </Grid>
      {/* </DemoContainer> */}
    </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={onclose}>Cancel</Button>
          <Button onClick={handleUpdate} >Update</Button>
        </DialogActions>
      </Dialog>
    </div>

    
  );
}