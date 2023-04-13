import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
    Card, Divider
}
from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import requestPost from "../../../serviceWorker";
import { Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";

export default function GetHistoryDialog(details) {
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
      .required("Amount is required")
      .typeError("Amount must be a number")
      .positive("Amount must be a positive number"),
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      Amount: update ? details.data.Amount : "",
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      let data = {
        rId: details.data.rId,
        rate: values.Amount,
      };
      console.log(data);
      details.submit(data);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  const onclose = () => {
    formik.resetForm();
    details.onClose();
  };

  const [data, setData] = useState([{}]);
  useEffect(() => {
    let req = {
      type: "SP_CALL",
      requestId: 1400005,
      request: {
        mId: details.mId,
      },
    };
    requestPost(req).then((res) => {
      if (res.errorcode == 0) {
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        console.log(error);
        console.log("No internet connection found. App is running in offline mode.");
      } else {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        if (res.result[0] == null) {
          console.log("no data");
          setData([{}]);
        } else {
          setData(res.result);
        }
        console.log(res.result);
      }
    });
  }, []);

  return (
    <div>
      <Dialog open={details.open} onClose={onclose}
      
      fullWidth={true}
      maxWidth={"sm"}
      >
        <DialogTitle>Update Rate</DialogTitle>
        <DialogTitle>RENT HISTORY</DialogTitle>
        <DialogContent>
       

            {data.map((item) => (
              <>
              <Divider orientation="horizontal" flexItem />
                <Grid
 container
 rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    
 pl={3}
    pt={1}
    
   
    >   
     <Grid item xs={3}>
     <Typography >{item.date}</Typography>
  </Grid>
   
  <Grid item xs={3}>
     <Typography >{item.item}</Typography>
  </Grid>

  <Grid item xs={3}>
     <Typography >₹{item.rate}</Typography>
  </Grid>

  <Grid item xs={3}>
     <Typography >qty:{item.qty}</Typography>
  </Grid>
  
    </Grid>
    </>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
