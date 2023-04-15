import React, { useState, useEffect } from "react";

import requestPost from "../../../serviceWorker";

import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@material-ui/core";

import Router from 'next/router';


const GetHistoryModal = (details) => {
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
      if(res.errorcode===3){
        Router
        .push(
        
        {
          pathname: '/login',
          query: { redirect: '1' },
        })
      }else{

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
  }, []);

  return (
    <div>
    <Dialog open={details.open} onClose={onclose}>
      <DialogTitle>Update Rate</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText> */}
        
      </DialogContent>
    </Dialog>
  </div>
    // <Dialog open={details.open} onClose={details.onClose}>
    //   <DialogTitle>RENT HISTORY</DialogTitle>
    //   <DialogContent>
    //   <Table>
    //         <TableHead>
    //           <TableRow>
    //             <TableCell style={{ fontWeight: "bold" }} align="center">
    //               Date
    //             </TableCell>
    //             <TableCell style={{ fontWeight: "bold" }} align="center">
    //               Item
    //             </TableCell>
    //             <TableCell style={{ fontWeight: "bold" }} align="center">
    //               Rate
    //             </TableCell>
    //             <TableCell style={{ fontWeight: "bold" }} align="center">
    //               Qty
    //             </TableCell>
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {data.map((row) => (
    //             <TableRow>
    //               <TableCell style={{ fontWeight: "bold" }} align="center">
    //                 {row.date}
    //               </TableCell>
    //               <TableCell style={{ fontWeight: "bold" }} align="center">
    //                 {row.item}
    //               </TableCell>
    //               <TableCell style={{ fontWeight: "bold" }} align="center">
    //                 {row.rate}
    //               </TableCell>
    //               <TableCell style={{ fontWeight: "bold" }} align="center">
    //                 {row.qty}
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //   </DialogContent>
    // </Dialog>
  );
};

export default GetHistoryModal;
