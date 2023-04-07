import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import requestPost from '../../../serviceWorker'

import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import { ContactSupportOutlined } from '@mui/icons-material';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px', 
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    minWidth: 800,
    minHeight: 200,
  },
  tableHead: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableRow: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f2f2f2',
    },
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '8px',
  },
}));

const GetHistoryModal = (details) => {
  const classes = useStyles();


  const [data, setData] = useState([{}]);

  useEffect(() => {

    let req = {
      "type" : "SP_CALL",
        "requestId" : 1400005,
        "request": {
 	    "mId" : details.mId
     }
    }
    requestPost(req).then((res)=>{
      if(res.errorcode ==0){
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        console.log(error);
                console.log('No internet connection found. App is running in offline mode.');
      }else{
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        if(res.result[0]==null){
          console.log("no data")
          setData([{}])
        }
        else{

          setData(res.result)
        }
        console.log(res.result)
        
      }
     
    })

    
  }, []);

  return (



    <div>
      <Modal
        className={classes.modal}
        open={details.open}
        onClose={details.onClose}
        aria-labelledby="example-modal-title"
        aria-describedby="example-modal-description"
      >
        <div className={classes.paper}>
          <TableContainer component={Paper}>
          <Typography variant="h5" gutterBottom>
        RENT HISTORY
      </Typography>
            <Table className={classes.table} aria-label="example table">
              <TableHead>
                <TableRow className={classes.tableHead}>
                  <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">Date</TableCell>
                  <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">Item</TableCell>
                  <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">Rate</TableCell>
                  <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">Qty</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
  {data.map((row) => (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">{row.date}</TableCell>
      <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">{row.item}</TableCell>
      <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">{row.rate}</TableCell>
      <TableCell className={classes.tableCell} style={{ fontWeight: 'bold' }} align="center">{row.qty}</TableCell>
    </TableRow>
  ))}
</TableBody>


            </Table>
          </TableContainer>
        </div>
      </Modal>
    </div>
  );
};

export default GetHistoryModal;
