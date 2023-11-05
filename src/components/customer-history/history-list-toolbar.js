import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Link from 'next/link';
import { Search as SearchIcon } from "../../icons/search";
import { Upload as UploadIcon } from "../../icons/upload";
import { Download as DownloadIcon } from "../../icons/download";
import { useState, useEffect } from "react";
import Fade from '@mui/material/Fade';
import FullScreenDialog from "./add-history";
import ReturnDialog from "./add-Return";
import AddPaymetDialog from "./add-payment";
import requestPost from "../../../serviceWorker";
import { mt } from "date-fns/locale";
import Router from 'next/router';
import CalculateScreenDialog from "./calculateRent";





export const HistoryListToolbar = (props) => {
  console.log("prooooooooooops")
  console.log(props)
  console.log(sessionStorage.getItem("Cid"))
  const [open, setOpen] = useState(true);
  const [Sopen, setSOpen] = useState(false);

  const [addDialog, setDialog] = useState();
  const [cId, setCid] = useState(sessionStorage.getItem("Cid"));
  const [cName, setcName] = useState(sessionStorage.getItem("Cname"));
  const [ErrOpen, setErrOpen] = useState(false);
  const [error, setError] = useState("");
  const [Copen, setCopen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleErrClose = () => {
    setSOpen(false);
  };
  const handleClose = () => {
    setDialog();
    setCopen(false)
  };


  const handleCalculate = (e) => {
    
    const add = (date, data) => {
      console.log(data)
      console.log(date)
      let req =  {
        "type" : "SP_CALL",
        "requestId" : 1700006,
        "request": {
  	"cId" :  sessionStorage.getItem("Cid"),
      	"amount" : data.Amount,
"date" : date,
"note" : data.Notes,
"status" : data.Status
       }
  }
console.log(req)
      requestPost(req).then((res) => {


        if (res.errorCode === 3) {
          Router
            .push(

              {
                pathname: '/',
                query: { redirect: '1' },
              })

        } else {

          if (res.errorcode == 0) {
            setDialog();

          } else {
            props.getdata();
            setDialog();
          }
        }
      });
    };


    setOpen(true)

    setDialog(() => (
      <CalculateScreenDialog
        onClose={handleClose}
        open={open}
        submit={add}
        button="Add"
      />
    ));
    
  }

  const handleAdd = (e, upd = Boolean(false), button = "ADD", data = {}) => {
    setOpen(true);

    const add = (items, date) => {
      let req = {
        type: "SP_CALL",
        requestId: 1400001,
        request: {
          cId: sessionStorage.getItem("Cid"),
          status: 1,
          date: date,
          items: items,
        },
      };
console.log(req)
      requestPost(req).then((res) => {


        if (res.errorCode === 3) {
          Router
            .push(

              {
                pathname: '/',
                query: { redirect: '1' },
              })

        } else {

          if (res.errorcode == 0) {
            setDialog();

          } else {
            props.getdata();
            setDialog();
          }
        }
      });
    };

    setDialog(() => (
      <FullScreenDialog
        onClose={handleClose}
        open={open}
        submit={add}
        updated={upd}
        button={button}
        data={data}
      />
    ));
  };

  const handlePayment = () => {

    setOpen(true);

    const add = (amount,date) => {
      let req = {
        "type": "SP_CALL",
        "requestId": 1700001,
        request: {
          "cId": cId,
          "amount": amount,
          "date":date
        }
      };
      requestPost(req).then((res) => {
        if (res.errorCode === 3) {
          Router
            .push(

              {
                pathname: '/',
                query: { redirect: '1' },
              })

        } else {
          if (res.errorcode == 0) {
            setDialog();

          } else {


            props.getdata();

            setDialog();

          }
        }

      });
    }

    setDialog(() => (
      <AddPaymetDialog
        onClose={handleClose}
        cId={cId}
        open={open}
        submit={add}

      />
    ));




  }

  const handleRent = () => {
    setConfirmOpen(false)
    let req = {
      type: "SP_CALL",
      requestId: "returnCalculate",
      request: {
        cId: cId
      }
    }


    requestPost(req).then((res) => {
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })

      } else {

        if (res.errorcode == 0) {

        } else {
          props.getdata();

          setCopen(true)

        }
      }
    });
  }





  const handleReturn = (e, upd = Boolean(false), button = "ADD", data = {}) => {
    setOpen(true);

    const add = ( items,date) => {
      const req = {
        "type": "SP_CALL",
        "requestId": 1400001,
        "request": {
          "cId": cId,
          "status": 0,
          "date": date,
          "items": items
        }
      }

      requestPost(req).then((res) => {
        console.log('1111111111111111111111111111111111111111111111111')
console.log(res)
        if (res.errorCode === 3) {
          Router
            .push('/')

        } else {
          console.log('22222222222222222222222')
          if (res.errorcode == 0) {
            setDialog();

          } else {
            console.log('33333333333333333333333')
            props.getdata();

            setDialog();
          }
        }
      });

    };

    setDialog(() => (
      <ReturnDialog
        onClose={handleClose}
        open={open}
        submit={add}
        updated={upd}
        button={button}
        cId={cId}
        data={data}
      />
    ));
  };

  const [itemButton, setButtons] = useState([{}]);


  const confirmCalculate = () => {

    setConfirmOpen(true)


  }


  const ConfirmDialog = (props) => {


    return (
      <Dialog
        open={props.open}
        onClose={props.close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to confirm?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to confirm the calculate rent for the customer
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close}>Cancel</Button>
          <Button onClick={handleRent} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }


  function getItems() {
    let data = {
      type: "SP_CALL",
      requestId: 1200005,
      request: {},
    };

    //hello hi find if any problem in this
    requestPost(data).then((res) => {

      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        if (res.result) {
          if (res.result[0] == null) {
            setButtons([]);
          } else {
            setButtons(res.result);
          }
        } else {
          setError("" + res);
          setErrOpen(true);
          setButtons([]);
        }
      }

    });
  }

  useEffect(() => {
    getItems(); 
  }, []);
  useEffect(() => {
    setcName(sessionStorage.getItem("Cname"));
  }, [sessionStorage.getItem("Cname")]);

  return (
    <>


      <Box {...props}>
        <Snackbar open={Sopen} autoHideDuration={6000} onClose={handleErrClose}>
          <Alert onClose={handleErrClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar open={Copen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Payment Caluculated Successfully
          </Alert>
        </Snackbar>




        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
          }}
        >
          {addDialog}

          <ConfirmDialog open={confirmOpen} close={handleConfirmClose} />

          <Typography sx={{ m: 1 }} variant="h4">
            {cName}
          </Typography>

          {localStorage.getItem('usertype') === 'owner' ? (
            null
          ) : (<Box sx={{ m: 1 }}>
            <Button sx={{ ml: 2, mt: 2 }} color="info" variant="contained" onClick={handleCalculate}>
              Add Extra Amount
            </Button>
            <Button sx={{ ml: 2, mt: 2 }} color="success" variant="contained" onClick={handleAdd}>
              Add Rent
            </Button>
            <Button sx={{ ml: 2, mt: 2 }} color="error" variant="contained" onClick={(e) => handleReturn(e, true, "RETURN", {})}>
              Add Return
            </Button>
            <Button sx={{ ml: 2, mt: 2 }} color="primary" variant="contained" onClick={handlePayment}>
              Add Payment
            </Button>
          </Box>)}

        </Box>


      </Box>
    </>
  );
};
