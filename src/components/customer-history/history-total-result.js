import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PropTypes from "prop-types";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Router from 'next/router';
import requestPost from "../../../serviceWorker";
import React from "react";
import FadeMenu from "../more-items-btn";
import FullScreenDialog from "./update-payment";

// export const HistoryListResults = ({ customers, getdata, ...rest }) => {
export const HistoryTotalResult = ({
  customers,
  payments,
  getdata,
  CtableId,
  ApiData,
  ...rest
}) => {
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const [total, setTotal] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [pendingItems, setPendingItems] = useState('');
  const router = useRouter();

  const handleClose = () => {
    setDialog();
  };

  const deleteUser = (pId) => {
    let req = {
      type: "SP_CALL",
      requestId: 1700003,
      request: {
        pId: pId,
      },
    };
    requestPost(req).then((res) => {

      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/login',
              query: { redirect: '1' },
            })
      } else {


        if (res.errorcode == 0) {
         
        } else {
          // getdata()

          getdata(CtableId, ApiData);
        }
      }
    });
  };

  const getPendingItems = () => {
    const requestdata2 = {
      "type": "SP_CALL",
      "requestId": 1500002,
      request: {
        "cId": router.query.cId
      }
    }
    requestPost(requestdata2).then((res) => {
      if (res.errorCode === 3) {
        Router
          .push(
            {
              pathname: '/login',
              query: { redirect: '1' },
            })
      } else {
        console.log(res.result);
        if (res.result[0] != null) {
          var msg = "*ITEMS PENDING*%0a";
          res.result.map((item)=>{
           msg =  `${msg}%0a${item.itemName} : ${item.pending}`
          })
          setPendingItems(msg);
          console.log(msg);
        } else {
          setItems(res.result);
        }
      }
    }).catch(err => {
      console.log(err);
    })
  }

  const handleAdd = (pId, amount) => {
   
    setOpen(true);
    const add = (amount) => {
    
      let req = {
        type: "SP_CALL",
        requestId: 1700002,
        request: {
          pId: pId,
          amount: amount,
        },
      };

      requestPost(req).then((res) => {

        if (res.errorCode === 3) {
          Router
            .push(

              {
                pathname: '/login',
                query: { redirect: '1' },
              })
        } else {

          if (res.errorcode == 0) {
            let error = "error happend";
          
          } else {
           
            setDialog();
            getdata(CtableId, ApiData);
          }

        }
      });
    };
    setDialog(() => (
      <FullScreenDialog
        onClose={handleClose}
        open={open}
        submit={add}
        button="UPDATE"
        amount={amount}
      />
    ));
  };

  useEffect(() => {
   
    let totalAmount = 0;
    let totalPaidAmount = 0;

    for (let i = 0; i < customers.length; i++) {
      totalAmount += customers[i].amount;
    }

    for (let i = 0; i < payments.length; i++) {
      totalPaidAmount += payments[i].amount;
    }

    setTotal(totalAmount);
    setTotalPaid(totalPaidAmount);
    if (totalPaidAmount > totalAmount) {
      setTotalDue(0);
    } else {
      setTotalDue(totalAmount - totalPaidAmount);
    }
    if (totalPaidAmount > totalAmount) {
      setAdvance(totalPaidAmount - totalAmount);
    } else {
      setAdvance(0);
    }
    getPendingItems();
  }, [customers, payments]);

  const whatsAppMsg = `*AONE RENTAL* %0a %0aItem Total : ${total} %0aTotal Paid : ${totalPaid} %0aPending Amount : ${totalDue} %0aAdvance : ${advance} %0a %0a${pendingItems}`;

  return (
    <>
      {addDialog}
      <Grid container spacing={3}>
        <Grid container spacing={2} pl={2} pt={2}>
          <Grid item xs={12} sm={3} md={3}>
            <Paper elevation={3} sx={{ bgcolor: "#FF8E2B" }}>
              <Typography variant="subtitle1" color={"white"} align="center">
                Item Total
              </Typography>
              <Typography variant="h5" color={"white"} align="center">
                {total}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={3} md={3}>
            <Paper elevation={3} sx={{ bgcolor: "#4079FC" }}>
              <Typography variant="subtitle1" color={"white"} align="center">
                Total Paid
              </Typography>
              <Typography variant="h5" color={"white"} align="center">
                {totalPaid}
              </Typography>
            </Paper>
          </Grid>


          <Grid item xs={12} sm={3} md={3}>
            <Paper elevation={3} sx={{ bgcolor: "#D14343" }}>
              <Typography variant="subtitle1" color={"white"} align="center">
                Pending Amount
              </Typography>
              <Typography variant="h5" color={"white"} align="center">
                {totalDue}
              </Typography>
            </Paper>
          </Grid>


          <Grid item xs={12} sm={3} md={3}>
            <Paper elevation={3} sx={{ bgcolor: "#4BB543" }}>
              <Typography noWrap variant="subtitle1" color={"white"} align="center">
                Advance
              </Typography>
              <Typography variant="h5" color={"white"} align="center">
                {advance}
              </Typography>
            </Paper>
          </Grid>

        </Grid>
        <Grid container spacing={3} pt={2}>

          <Grid item xs={12} md={4}>
            <TableContainer component={Paper}>
              <Table>
                {/* First table */}
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers && customers[0]
                    ? customers.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                      </TableRow>
                    ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>

          </Grid>

          <Grid item xs={12} md={8}>


            {/* Total box */}


            <TableContainer component={Paper} >
              <Table>
                {/* Second table */}
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    {localStorage.getItem('usertype') === 'owner' ? (
                      null
                    ) : (<TableCell>Action</TableCell>)}

                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments &&
                    payments.map((customer) => (
                      <TableRow key={customer.pId}>
                        <TableCell>{customer.date}</TableCell>
                        <TableCell>{customer.amount}</TableCell>

                        {localStorage.getItem('usertype') === 'owner' ? (
                          null
                        ) : (<TableCell>

                          <FadeMenu
                            callback={() => {
                              deleteUser(customer.pId);
                            }}
                            editUser={(e) => handleAdd(customer.pId, customer.amount)}
                          />
                        </TableCell>)}

                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>


          </Grid>
        </Grid>

      </Grid>
      <div
        style={{
          position: "fixed",
          right: 20,
          bottom: 20
        }}
      >
        <a href={`https://wa.me/91${router.query.phNo}?text=${whatsAppMsg}`} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon style={{ fontSize: 50, color: "#25D366" }} />
        </a>
      </div>
    </>
  );
};

HistoryTotalResult.propTypes = {
  customers: PropTypes.array.isRequired,
};
