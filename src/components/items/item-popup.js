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
    

 

  const [alertMsg, setAlert] = useState();
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
 
  const onclose = () => {
  
    details.onClose();
  };

  useEffect(() => {
    setDialog(() => (
      <ItemTable
      data={details.data}
      />
    ));
  }, []);
  
  return (
    <div>

  
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
