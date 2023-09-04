import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PropTypes from "prop-types";
import {
  Divider,
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
import { Stack, color } from "@mui/system";
import CalculateScreenDialog from "./calculateRent";
import AlertDialog from "./extra-payment";

// export const HistoryListResults = ({ customers, getdata, ...rest }) => {
export const HistoryTotalResult = ({
  customers,
  payments,
  getdata,
  CtableId,
  ApiData,
  extraPayment,
  items,
  ...rest
}) => {
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const [addExtraDialog, setExtraDialog] = useState();
  const [total, setTotal] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [alertOpen,setAlertOpen] = useState(false);
  const [cId, setCid] = useState('');
  const [pendingItems, setPendingItems] = useState('');
  const router = useRouter();

  const handleClose = () => {
    setDialog();
    setExtraDialog();
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
              pathname: '/',
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
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        if (res.result[0] != null) {
          var msg = "*ITEMS PENDING*%0a";
          res.result.map((item) => {
            msg = `${msg}%0a${item.itemName} : ${item.pending}`
          })
          setPendingItems(msg);
        } else {
          setItems(res.result);
        }
      }
    }).catch(err => {
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
                pathname: '/',
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

  const handleUPDATE = (e, upd , button = 'UPDATE', data = {}) => {

    console.log('heyyyyyyyyyy')
       setOpen(true);
       
       
     
       
       const add = (date,datas) => {
         console.log(datas)
         
         
     
         let req={
           "type" : "SP_CALL",
           "requestId" : 1700007,
           request: {
             "expId" : data.expId,
             "amount" : datas.Amount,
     "date" : date,
     "note" : datas.Notes,
     "status" : datas.Status,
          }
     }
     console.log(req)
     
     
     requestPost(req).then((res)=>{
       if(res.errorCode===3){
         Router
         .push(
         
         {
           pathname: '/',
           query: { redirect: '1' },
         })
     }else{
     
     
       if(res.errorcode ==0){
        
       }else{
         getdata()
         
       }
     }
     
     setExtraDialog(); 
     });
     
     
       };
     
       setExtraDialog(() => (
         
         <CalculateScreenDialog
           onClose={handleClose}
           open={true}
            submit={add}
            updated={upd}
            button={button}
            data={data}
         />
       ));
     };

     const deleteConfirm = (cid) => {
      setAlertOpen(true)
      setCid(cid)
    }

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


  const deleteUsers = ()=>{
    let del = {
      "type" : "SP_CALL",
      "requestId" : 1700008,
      request: {
       "expId": cId
     }
    }
    requestPost(del).then((res)=>{
      if(res.errorCode===3){
        Router
        .push(
        
        {
          pathname: '/',
          query: { redirect: '1' },
        })
    }else if(res.errorcode ==0){
        
     
      }else{
        setAlertOpen(false)
        getdata()
        
      }
     
    })


  }

  const whatsAppMsg = `*AONE RENTAL* %0a https://aonerentals.in/tools/src/user/?cId=${sessionStorage.getItem('Cid')}`;

  return (
    <>
      {addDialog}
      {addExtraDialog}
      <AlertDialog open={alertOpen} setOpen={setAlertOpen} deleteCustomer={deleteUsers}/>
      <Grid container spacing={3}>
        <Grid container spacing={2} pl={2} pt={2}>
          <Grid item xs={12} sm={4} md={4}>
            <Paper elevation={3} sx={{ bgcolor: "#FF8E2B" }}>
              <Typography variant="subtitle1" color={"white"} align="center">
                Item Total + Extra Charges
              </Typography>
              <Typography variant="h5" color={"white"} align="center">
                {items ? items.items:0.00}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Paper elevation={3} sx={{ bgcolor: "#4079FC" }}>
              <Typography variant="subtitle1" color={"white"} align="center">
                Total Paid
              </Typography>
              <Typography variant="h5" color={"white"} align="center">
                {items ? items.paid:0.00}
              </Typography>
            </Paper>
          </Grid>


          <Grid item xs={12} sm={4} md={4}>
            <Paper elevation={3} sx={{ bgcolor: "#D14343" }}>
              <Typography variant="subtitle1" color={"white"} align="center">
                Pending Amount
              </Typography>
              <Typography variant="h5" color={"white"} align="center">
                {items ? ((items.items - items.paid).toFixed(2)):0.00}
              </Typography>
            </Paper>
          </Grid>

        </Grid>
        <Grid container spacing={2} pl={2}>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" p={2} >
              Item Amounts
            </Typography>
            <TableContainer component={Paper} style={{ height: 250  }}>
              <Table stickyHeader>
                {/* First table */}
                <TableHead >
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
          <Typography variant="h5" p={2} >
              Payments
            </Typography>

            <TableContainer component={Paper} style={{height: 250 }}>
              <Table stickyHeader>
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
          <Grid item xs={12} md={12}>
          <Typography variant="h5" p={2} >
              Extra Payments
            </Typography>
            <TableContainer component={Paper} style={{ height: 250  }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {extraPayment.map((data, ind) => {


                    return (
                        <TableRow key={ind}>
                          <TableCell>
                              {data.date}
                          </TableCell>


                          <TableCell>
                              {data.amount}
                          </TableCell>


                          <TableCell>
                              {data.note}
                          </TableCell>

                          <TableCell>
                              {data.status ? <Typography  variant="button" p={1} sx={{backgroundColor:"red", borderRadius:3 ,color:'#fff'}} maxWidth={150}>Add on</Typography> : <Typography  variant="button" p={1} sx={{backgroundColor:"green", borderRadius:3 ,color:'#fff'}} maxWidth={150}>Discount</Typography> }
                          </TableCell>


                          {localStorage.getItem('usertype') === 'owner' ? (
                            null
                          ) : (<TableCell>
                            <FadeMenu updateItem={(e) => handleUPDATE(e, true, 'EDIT', { Amount: data.amount, expId: data.expId, date: data.date, note: data.note, status: data.status })} callback={() => { deleteConfirm(data.expId) }} />
                          </TableCell>)}
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>



            </TableContainer >
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
        <a href={`https://wa.me/91${sessionStorage.getItem('Cphone')}?text=${whatsAppMsg}`} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon style={{ fontSize: 50, color: "#25D366" }} />
        </a>
      </div>
    </>
  );
};

HistoryTotalResult.propTypes = {
  customers: PropTypes.array.isRequired,
};
