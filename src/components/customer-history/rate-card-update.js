import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';

export default function FullScreenDialog(details) {
  const [open, setOpen] = React.useState(false);
const [update, setUpdate] = useState(details.updated);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const validSchema = Yup.object().shape({
    Amount: Yup.number()
    .required('Amount is required')
    .typeError('Amount must be a number')
    .positive('Amount must be a positive number')});

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
        Amount: update ? details.data.Amount :'',
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
     

       let data= {
            rId:details.data.rId,
            rate:values.Amount
        }
        console.log(data)
      details.submit(data)
     

    }
  });


  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  const onclose = () => {
    formik.resetForm();
    details.onClose();
  };

  return (
    <div>
      <Dialog open={details.open} onClose={onclose}>
        <DialogTitle>Update Rate</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount"
            type="number"
            {...getFieldProps('Amount')}
            error={Boolean(touched.Amount && errors.Amount)}
            helperText={touched.Amount && errors.Amount}
            fullWidth
            variant="outlined"          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onclose}>Cancel</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}