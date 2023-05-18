import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import requestPost from '../../../serviceWorker'
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// material
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

} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Router from 'next/router';



export default function ReturnDialog(details) {
console.log('detailsssssssssssssssssssssssssss')
console.log(details)

  const [update, setUpdate] = useState(details.updated);
  const [noOfRows, setNoOfRows] = useState(1);
  const [items, setItems] = useState([]);
  const [qtyerror, setQtyError] = useState('');
  const [qterr, setqtErr] = useState(false);
  const [selectedItems, setSelectedItems] = useState([...Array(noOfRows)].map(() => ""))
  // const [itemsArr,setItemsArr]=useState([{}])
  const [selectedDate, setSelectedDate] = useState(new Date()); // Set the initial state to the current date

  const getData = (date) => {
    // Your logic to fetch data based on the selected date
  };

  const disableFutureDates = (date) => {
    return dayjs(date).isAfter(dayjs(), 'day'); // Disable dates after the current day
  };

  useEffect(() => {


    const requestdata2 = {
     
      "type": "SP_CALL",
      "requestId": 1500002,
      request: {
        "cId": details.cId
      }
      
    }
    console.log('cccccccccccccccccccccccccccccccccccc')
    console.log(details.cId)
   
    requestPost(requestdata2).then((res) => {
console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
      console.log(res.result);
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '',
              query: { redirect: '1' },
            })
      } else {
        if (res.result[0] == null) {
          setItems([])
        } else {
          console.log(res.result);
          setItems(res.result);
         
        }
      }


    }).catch(err => {
     
    })
  }, [])




  const validSchema = Yup.object().shape({

  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {

    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      let notes = "";
      let flag = false;
      if (values.Notes) {
        notes = values.Notes;
      }
      let itemsArr = [];
      
      if (items.length === 0) {
        flag=true;
        setqtErr(true);
        setQtyError("No pending items");
      }

      for (let ind = 0; ind < items.length; ind++) {
        
        const element = document.getElementById(`return${ind}`);
        const checkelement = document.getElementById(`tick${ind}`);
       
        var numberAsInt = parseInt(element.value, 10);
        if (checkelement.checked) {
          if (items[ind].pending < numberAsInt) {
            setqtErr(true);
            flag = true;
            break;
          }
          else if (element.value == 0) {
            setqtErr(true);
            setQtyError("Quantity should be greater than 0");
            flag = true;
            break
          } else {
            itemsArr.push({
              "itemId": items[ind].itemId,
              "qty": element.value
            })
          }
        }
      }
      if(itemsArr.length == 0){
        setqtErr(true);
        setQtyError("check one of the list");
      }else{
      // details.submit(notes,itemsArr);
      if (flag == false) {
        console.log('details')
        console.log(details)
        details.submit(notes, itemsArr);
      } 
    }
    }


  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;


  const [state, setState] = useState({
    open: false,
    Transition: Fade,
  });

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
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


  const styles = {
    disabled: {
      color: 'black',
      borderColor: 'black',
    },
  };

  return (
    <>
      {
        qterr &&
        <Snackbar open={open} onClose={handleClose}>
          <Alert onClose={handleClose} autoHideDuration={4000} severity="error" sx={{ width: '100%' }}>
            {qtyerror}
          </Alert>
        </Snackbar>
      }
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: 'relative', background: '#5048E5' }}>
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
        <Container maxWidth="md">

<Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
  <Typography variant="h4">RENT HISTORY</Typography>
</Stack>
<Stack direction={'row'}  justifyContent={"end"} gap={1}>
  <DatePicker
    label="Select Date"
    format="DD-MM-YYYY"
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


{items.map((item, ind) => {
  return (
    <Stack direction="row" key={ind} pt={2} spacing={2}>
      <TextField
        id={`item${ind}`}
        label="Item Name"
        defaultValue={item.itemName}
        disabled={true}
        variant="outlined"
        InputProps={{ style: styles.disabled }}
        InputLabelProps={{ style: styles.disabled }}
      />

      <TextField
        id={`pending${ind}`}
        label="Outgoing Items"
        defaultValue={item.pending}
        disabled={true}
        variant="outlined"
        InputProps={{ style: styles.disabled }}
        InputLabelProps={{ style: styles.disabled }}
      />

      <TextField
        id={`return${ind}`}
        label="Return Items"
        variant="outlined"
        InputProps={{ style: styles.disabled }}
        InputLabelProps={{ style: styles.disabled }}
      />

      <TextField
        fullWidth
        type="text"
        label="Notes"
        variant="outlined"
        {...getFieldProps(`notes${ind}`)}
        error={Boolean(touched[`notes${ind}`] && errors[`notes${ind}`])}
        helperText={touched[`notes${ind}`] && errors[`notes${ind}`]}
      />

      <Checkbox id={`tick${ind}`} color="success" />
    </Stack>
  );
})}

</Container>

      </Dialog>
    </>
  );
}
