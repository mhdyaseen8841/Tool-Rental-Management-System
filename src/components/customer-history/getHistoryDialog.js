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
import Router from 'next/router';

export default function GetHistoryDialog(details) {
  const [total, setTotal] = useState(0);
  let tt = 0;
  const onclose = () => {
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
      if (res.errorcode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        if (res.errorcode == 0) {

        } else {
          if (res.result[0] == null) {
            setData([{}]);
          } else {
            setData(res.result);
          }
        }

      }

    });
    data.map((item) => {
      tt = tt + (item.rate * item.qty)
    })
    setTotal(tt)
  }, [data]);

  return (
    <div>
      <Dialog open={details.open} onClose={onclose}

        fullWidth={true}
        maxWidth={"sm"}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <DialogTitle>Update Rate</DialogTitle>
          <DialogTitle>Total: ₹{total}</DialogTitle>
        </Stack>
        <DialogTitle>RENT HISTORY</DialogTitle>
        <DialogContent>


          {data.map((item) => {
            return (
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

                  <Grid item xs={details.hStatus ? 2 : 3}>
                    <Typography >{item.item}</Typography>
                  </Grid>

                  <Grid item xs={details.hStatus ? 2 : 3}>
                    <Typography >₹{item.rate}</Typography>
                  </Grid>

                  <Grid item xs={details.hStatus ? 2 : 3}>
                    <Typography >qty:{item.qty}</Typography>
                  </Grid>
{details.hStatus ?
(
<Grid item xs={3}>
<Typography >
<span style={{ fontWeight: 'bold' }}>Total:₹{item.qty*item.rate}</span></Typography>
</Grid>
):
(<></>)
}
                

                </Grid>
              </>)

          })}
        </DialogContent>
      </Dialog>
    </div>
  );
}
