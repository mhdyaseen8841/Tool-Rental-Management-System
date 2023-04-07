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
} from "@mui/material";
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
export const HistoryListToolbar = (props) => {
  const [open, setOpen] = useState(true);
  const [Sopen, setSOpen] = useState(false);

  const [addDialog, setDialog] = useState();
  const [cId, setCid] = useState(props.cId);
  const [cName, setcName] = useState(props.cName);
  const [ErrOpen, setErrOpen] = useState(false);
  const [error, setError] = useState("");
  const [Copen , setCopen] = useState(false);

  const handleErrClose = () => {
    setSOpen(false);
  };
  const handleClose = () => {
    setDialog();
    setCopen(false)
  };

  const handleAdd = (e, upd = Boolean(false), button = "ADD", data = {}) => {
    console.log("addddddddddddddddddddddddddd")
    setOpen(true);

    const add = (items, note, status) => {
      let req = {
        type: "SP_CALL",
        requestId: 1400001,
        request: {
          cId: cId,
          status: 1,
          note: note,
          items: items,
        },
      };

      requestPost(req).then((res) => {
        console.log(req)
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        if (res.errorcode == 0) {
          setDialog();
          console.log(error);
          console.log("No internet connection found. App is running in offline mode.");
        } else {
          props.getdata();
          setDialog();
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

  const add = (amount) => {
    let req = {
      "type" : "SP_CALL",
      "requestId" : 1700001,
      request: {
        "amount" : amount,
     }
    };
  }

  setDialog(() => (
    <AddPaymetDialog
      onClose={handleClose}
      open={open}
      submit={add}

    />
  ));



    
  }

  const handleRent = () => {
    let req = {
        type : "SP_CALL",
        requestId : "returnCalculate",
        request: {
 	    cId : cId
       }
  }


    requestPost(req).then((res) => {
      if (res.errorcode == 0) {
        //erroooooorrr

        //
        console.log(error);
        console.log("No internet connection found. App is running in offline mode.");
      } else {

        setCopen(true)
        
      }
    });
  }





  const handleReturn = (e, upd = Boolean(false), button = "ADD", data = {}) => {
    setOpen(true);

    const add = (note,items) => {
      const req=  {
        "type" : "SP_CALL",
     "requestId" : 1400001,
         "request": {
   "cId":cId,
 "status":0,
   "note" :note,
 "items":items
        }
  }

  requestPost(req).then((res) => {
    if (res.errorcode == 0) {
      setDialog();
      console.log(error);
      console.log("No internet connection found. App is running in offline mode.");
    } else {
      
      setDialog();
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
        cId= {cId}
        data={data}
      />
    ));
  };

  const [itemButton, setButtons] = useState([{}]);
  function getItems() {
    let data = {
      type: "SP_CALL",
      requestId: 1200005,
      request: {},
    };

    requestPost(data).then((res) => {
      if (res.result) {
        if (res.result[0] == null) {
          setButtons([{}]);
        } else {
          setButtons(res.result);
        }
      } else {
        setError("" + res);
        setErrOpen(true);
        setButtons([{}]);
      }
    });
  }

  useEffect(() => {
    getItems();
  }, []);

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
        <Typography sx={{ m: 1 }} variant="h4">
          {cName}
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button sx={{ ml: 2, mt: 2 }} color="info" variant="contained" onClick={handleRent}>
            Caluculate Rent
          </Button>
          <Button sx={{ ml: 2, mt: 2 }} color="success" variant="contained" onClick={handleAdd}>
            Add Rent
          </Button>
          <Button sx={{ ml: 2, mt: 2 }} color="error" variant="contained" onClick={(e)=>handleReturn(e, true, "RETURN" , {})}>
            Add Return
          </Button>
          <Button sx={{ ml: 2, mt: 2 }} color="primary" variant="contained" onClick={handlePayment}>
            Add Payment
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search Product"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box>
              <Button
                sx={{ ml: 2, mt: 2 }}
                color="primary"
                variant="contained"
                onClick={() => props.setTable("history")}
              >
                HISTORY
              </Button>

              <Button
                sx={{ ml: 2, mt: 2 }}
                color="primary"
                variant="contained"
                onClick={() => props.setTable("items")}
              >
                ITEMS
              </Button>

              {itemButton.map(({ iName, itemId }, index) => {
                return (
                  <Button
                    sx={{ ml: 2, mt: 2 }}
                    color="primary"
                    variant="contained"
                    onClick={() => props.setTable(itemId, 2)}
                  >
                    {iName}
                  </Button>
                );
              })}

              <Button
                sx={{ ml: 2, mt: 2 }}
                color="primary"
                variant="contained"
                onClick={() => props.setTable("total")}
              >
                TOTAL
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
    </>
  );
};
