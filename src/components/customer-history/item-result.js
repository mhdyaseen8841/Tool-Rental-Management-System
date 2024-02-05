import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
import FullScreenDialog from './update-history';
import requestPost from '../../../serviceWorker'
import { DataUsageSharp } from '@mui/icons-material';
import { borderBottom } from '@mui/system';





export const ItemResult = ({ customers, items, getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();
  const [data, setData] = useState([])
  const [item, setItem] = useState([])

  const handleClose = () => {
    setDialog();
  };


  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      //   newSelectedCustomerIds = customers.map((customer) => customer.mId);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setData(customers)
    setItem(items)

  }, [customers]);
  const [total, setTotal] = useState([])
  let itemTotalArr = []
  return (

    <Card {...rest}>

      <PerfectScrollbar>
        <Box >
          <TableContainer component={Paper} style={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>

                  {item.map((itemHead, ind) => (
                    <TableCell key={ind} sx={{ textAlign: 'center' }}>{itemHead.name}</TableCell>
                  ))}

                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((customer) => {
                  // let itemTotals = customer.slice(1).map((item) => item.incoming.qty - item.outgoing.qty);

                  return (
                    <React.Fragment key={customer.mId}>
                      <TableRow sx={{ borderBottom: 3, borderColor: '#aaa' }}>
                        <TableCell sx={{position: "sticky",left: 0,background: "white", whiteSpace: 'nowrap', borderBottom: 1, borderColor: '#aaa', py: '4px' }}>{customer[0]}</TableCell>

                        {customer.slice(1).map((item, ind) => {
                          if (itemTotalArr[ind] == undefined) {
                            itemTotalArr[ind] = item.incoming.qty - item.outgoing.qty
                          }
                          else {
                            itemTotalArr[ind] += item.incoming.qty - item.outgoing.qty
                          }
                          return (

                            <TableCell key={ind} sx={{ borderBottom: 1, borderColor: '#aaa', justifyContent: 'center', alignItems: 'center', py: '4px' }}>
                              <Stack sx={{ alignItems: 'center' }}>
                                {item.outgoing.qty !== 0 ? (
                                  <div style={{ color: 'white', background: 'red', width: '60px', textAlign: 'center', padding: ' 0 4px 0 4px',fontWeight:'600',fontSize: '16px' }}>
                                    {item.outgoing.qty}
                                  </div>
                                ) : (
                                  <div />
                                )}
                                {item.incoming.qty !== 0 ? (
                                  <div style={{ color: 'white', background: 'green', width: '60px', textAlign: 'center', padding: ' 0 4px 0 4px',fontWeight:'600',fontSize: '16px'  }}>
                                    {item.incoming.qty}
                                  </div>
                                ) : (
                                  <div />
                                )}
                              </Stack>
                            </TableCell>
                          )
                        })}

                      </TableRow>


                    </React.Fragment>
                  );
                })}
              </TableBody>
              <TableFooter sx={{
                left: 0,
                bottom: 0, // <-- KEY
                zIndex: 2,
                position: 'sticky'
              }}>
                <TableRow style={{ backgroundColor: '#bbb' }}>
                  <TableCell ><Typography variant='button' style={{ fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: '18px' }}>Total Items</Typography></TableCell>
                  {itemTotalArr.map((total, ind) => (
                    <TableCell key={ind} sx={{ textAlign: 'center' }}>
                      <Typography variant='h5' style={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }} >{Math.abs(total)}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer >
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};


ItemResult.propTypes = {
  customers: PropTypes.array.isRequired
};
