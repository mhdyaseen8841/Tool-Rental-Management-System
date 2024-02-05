import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DateDialog from "./date-dialog";
import requestPost from "../../../serviceWorker";
import EditIcon from "@mui/icons-material/Edit";
import Router from "next/router";
export const ItemNameResult = ({ customers, getdata, itemName, ...rest }) => {
  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };

  const updateDate = (rId, date, cdate) => {
    let data = {
      date: date,
      rId: rId,
      cDate: cdate,
    };
    const add = (data) => {
      setDialog();
      requestPost(data).then((res) => {
        if (res.errorCode === 3) {
          Router.push({
            pathname: "/",
            query: { redirect: "1" },
          });
        } else {
          if (res.errorcode == 0) {
            let error = "error happend";
            alert(error);
          } else {
            getdata();
          }
        }
      });
    };
    setDialog(() => (
      <DateDialog
        onClose={handleClose}
        open={true}
        submit={add}
        updated={false}
        button={"Update"}
        data={data}
      />
    ));
  };

  return (
    <>
      <Typography align="right" sx={{ m: 1 }} variant="h4" color={"darkslategray"}>
        {itemName}
      </Typography>

      <Card {...rest}>
        {addDialog}

        <PerfectScrollbar>
          <Box>
            <TableContainer style={{ maxHeight: '1500px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>No.Item</TableCell>

                    <TableCell>Rent Date</TableCell>
                    <TableCell>Return Date</TableCell>
                    <TableCell>Days</TableCell>
                    <TableCell>quantity</TableCell>

                    <TableCell>Total(₹)</TableCell>
                    {localStorage.getItem("usertype") === "owner" ? null : (
                      <TableCell>Action</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer, index) =>
                    customer.days < 30 ? (
                      <TableRow
                        key={customer.mId}
                        sx={{ backgroundColor: "#4BB543" }}
                      >
                        <TableCell sx={{ color: "white",py:'8px' }}>{index + 1}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px',whiteSpace:'nowrap' }}>{customer.rentDate}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px',whiteSpace:'nowrap' }}>{customer.returnDate}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px' }}>{customer.days}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px' }}>{customer.qty}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px' }}>{customer.price}</TableCell>
                        {localStorage.getItem("usertype") === "owner" ? null : customer.status ==
                          0 ? (
                          <TableCell sx={{ cursor: "pointer", color: "white",py:'8px' }}>
                            Not Returned
                          </TableCell>
                        ) : (
                          <TableCell sx={{ cursor: "pointer", color: "white",py:'8px' }}>
                            <EditIcon
                              onClick={() =>
                                updateDate(customer.rId, customer.returnDate, customer.rentDate)
                              }
                            />
                          </TableCell>
                        )}
                        {/* <TableCell>
        <FadeMenu   updateItem={(e)=>handleAdd(e,true,'UPDATE', {name:customer.item,hId:customer.hId,qty:customer.qty})} />
        </TableCell> */}
                      </TableRow>
                    ) : (
                      <TableRow
                        key={customer.mId}
                        sx={{ backgroundColor: "#DC3545" }}
                      >
                        <TableCell sx={{ color: "white",py:'8px' }}>{index + 1}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px',whiteSpace:'nowrap' }}>{customer.rentDate}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px',whiteSpace:'nowrap' }}>{customer.returnDate}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px' }}>{customer.days}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px' }}>{customer.qty}</TableCell>
                        <TableCell sx={{ color: "white",py:'8px' }}>{customer.price}</TableCell>
                        {localStorage.getItem("usertype") === "owner" ? null : customer.status ==
                          0 ? (
                          <TableCell sx={{ cursor: "pointer", color: "white",py:'8px' }}>
                            Not Returned
                          </TableCell>
                        ) : (
                          <TableCell sx={{ cursor: "pointer", color: "white",py:'5px' }}>
                            <EditIcon
                              onClick={() =>
                                updateDate(customer.rId, customer.returnDate, customer.rentDate)
                              }
                            />
                          </TableCell>
                        )}

                        {/* <TableCell>
        <FadeMenu   updateItem={(e)=>handleAdd(e,true,'UPDATE', {name:customer.item,hId:customer.hId,qty:customer.qty})} />
        </TableCell> */}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </PerfectScrollbar>
      </Card>
    </>
  );
};

ItemNameResult.propTypes = {
  customers: PropTypes.array.isRequired,
};
