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


// mmmmmmmm
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
  TableContainer,
  TablePagination,
  TableHead,
  MenuItem,
  Autocomplete,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
  Backdrop,
  CircularProgress,

} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Router from 'next/router';



export default function FullScreenDialog(details) {

  const [update, setUpdate] = useState(details.updated);
  const [noOfRows, setNoOfRows] = useState(1);
  const [items, setItems] = useState([]);
  const [qtyerror, setQtyError] = useState('');
  const [qterr, setQtErr] = useState(false);
  const [backDropOpen, setBackDropOpen] = useState(false);

  const [selectedItems, setSelectedItems] = useState([...Array(noOfRows)].map(() => ''));

  const [selectedQuantities, setSelectedQuantities] = useState(Array(noOfRows).fill(1));

  const [selectedDate, setSelectedDate] = useState(new Date()); // Set the initial state to the current date

  const getData = (date) => {
    // Your logic to fetch data based on the selected date
  };

  const disableFutureDates = (date) => {
    return dayjs(date).isAfter(dayjs(), 'day'); // Disable dates after the current day
  };

  // const [itemsArr,setItemsArr]=useState([{}])
  useEffect(() => {


    const requestdata2 = {
      "type": "SP_CALL",
      "requestId": 1200005,
      request: {
      }
    }

    requestPost(requestdata2).then((res) => {
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        if (res.result[0] == null) {
          setItems([{}])
        } else {
          setItems(res.result.map((value) => { return { label: value.iName, itemId: value.itemId, astock: value.aStock, rentAmt: value.mRent } }));

        }
      }


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

      let itemsArr = []

      let shouldBreak = false;
      setQtyError('');
      for (let ind = 0; ind < noOfRows; ind++) {

        if (shouldBreak) {
          return;
        }

        if (selectedItems[ind] !== "") {

          if (selectedItems[ind]) {
            let aqty = items.find(obj => obj.itemId === selectedItems[ind]);

            const element = document.getElementById(`qty${ind}`);

            if (element.value) {
              if ((aqty.astock < element.value)) {


                setQtyError(aqty.label + ' Out of stock!, available stock is only ' + aqty.astock)
                setQtErr(true)
                shouldBreak = true;
                return;

              } else if (parseInt(element.value) <= 0) {

                setQtyError('enter ' + aqty.label + ' quantity greater than zero')
                setQtErr(true)
                shouldBreak = true;
                return;
              }

              else {
                setBackDropOpen(true)
                setQtyError('')
                setQtErr(false)

                let Inote = document.getElementById(`notes${ind}`).value;
                if (!Inote) {
                  Inote = ""
                }

                itemsArr.push({
                  "itemId": selectedItems[ind],
                  "qty": element.value,
                  "note": Inote
                })


              }
            } else {
              setQtyError('enter ' + aqty.label + ' quantity')
              setQtErr(true)
              shouldBreak = true;
              return;
            }


          }


        } else {
          setQtyError('select item')
          setQtErr(true)
          shouldBreak = true;
          return;
        }

      }


      if (qterr === false) {
        if (itemsArr.length === 0) {
          setQtyError('Add atleast one item')
          setQtErr(true)
        } else {
          setQtyError('')
          setQtErr(false)
          console.log(selectedDate);
          details.submit(itemsArr, selectedDate)
        }
      }

    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;



  const handleAddItem = () => {
    setNoOfRows(noOfRows + 1);
    setSelectedQuantities((prevQuantities) => [...prevQuantities, 1]);
  };



  const calculateTotalRent = () => {
    let totalRent = 0;
    for (let i = 0; i < noOfRows; i++) {
      const qty = parseInt(selectedQuantities[i]);
      const selectedItemId = selectedItems[i];
      const selectedItem = items.find((item) => item.itemId === selectedItemId);
      if (selectedItem) {
        const rentAmt = parseFloat(selectedItem.rentAmt);
        totalRent += rentAmt * qty;
      }
    }
    return totalRent;
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
    <>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDropOpen}
        >
          <CircularProgress color="primary" />
        </Backdrop>
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


            <Stack direction={'row'} justifyContent={"end"} gap={1}>
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
                  console.log(newDate);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>



            {[...Array(noOfRows)].map((elementInArray, ind) => (
              <Stack direction="row" key={ind} spacing={2}>
                <FormControl fullWidth key={ind}>
                  <InputLabel id={`item${ind}`}>Items</InputLabel>
                  <Select
                    sx={{ minWidth: 300 }}
                    labelId={`item-label-${ind}`}
                    id={`item${ind}`}
                    label="Items"
                    value={selectedItems[ind]}
                    onChange={(event) => {
                      setSelectedItems((prevItems) => {
                        prevItems[ind] = event.target.value;
                        return [...prevItems];
                      });
                    }}
                  >
                    {items.map(({ label, rentAmt, itemId }, index) => (
                      <MenuItem key={index} value={itemId}>
                        {label} - ₹{rentAmt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    // value={selectedQuantities[ind]}
                    onChange={(event) => {
                      setSelectedQuantities((prevQuantities) => {
                        prevQuantities[ind] = event.target.value;
                        return [...prevQuantities];
                      });
                    }}
                    id={`qty${ind}`}
                    labelId={`qty-label-${ind}`}
                  // defaultValue= {1}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    medium
                    type="text"
                    label="Notes"
                    variant="outlined"
                    id={`notes${ind}`}
                    labelId={`notes-label-${ind}`}
                    error={Boolean(touched.Notes && errors.Notes)}
                    helperText={touched.Notes && errors.Notes}
                  />
                </FormControl>
              </Stack>
            ))}

            <Stack direction="row" mb={2} justifyContent="space-between" alignItems="center">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginRight: '1rem', fontFamily: 'Arial' }}>
                  Total Amount:
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e88e5', fontFamily: 'Arial' }}>
                  ₹{calculateTotalRent().toFixed(2)}
                </Typography>
              </div>
              <Stack direction="row" alignItems="center" spacing={2}>

              </Stack>
              <Button
                variant="contained"
                onClick={handleAddItem}
                sx={{ backgroundColor: '#1e88e5', color: '#fff', fontFamily: 'Arial' }}
              >
                + Add Item
              </Button>
              {qterr && <Alert severity="error">{qtyerror}</Alert>}
            </Stack>
          </Stack>
        </Container>
      </Dialog>
    </>
  );
}
