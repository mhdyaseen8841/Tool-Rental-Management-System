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





export const CustomerNotes = ({ customers,items, getdata, ...rest }) => {
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
    console.log('customerffffffffffffffffffffffffffs')
    console.log(customers)
    console.log(items)
    setData(customers)
    setItem(items)
  
    }, [customers]);
  return (

    <Card {...rest}>

      <PerfectScrollbar>
        <Box >
          <TableContainer >
          <Table>
  <TableHead>
    <TableRow>
      <TableCell>Date</TableCell>
      
      {item.map((itemHead, ind) => (
        <TableCell key={ind}>{itemHead.itemName}</TableCell>
      ))}
      
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map((notes) => {
      

      return (
        <React.Fragment key={notes.mId}>
          <TableRow hover>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{notes[0]}</TableCell>
            
            {notes.slice(1).map((item, ind) => (
  <TableCell key={ind}>
    <Stack>
      {item.map((noteItem, noteInd) => {
        if (noteItem.note != ""){
        return(<div
          key={noteInd}
          style={{
            color:  'white',
            background: noteItem.status !== 0 ? 'red' : 'green',
            maxWidth: '60px',
            textAlign: 'center',
            borderRadius: '16px', 
            padding: '8px', 
            margin: '4px' 
          }}
        >
          {noteItem.note}
        </div>)
        }
    })}
    </Stack>
  </TableCell>
))}

          </TableRow>
           
        </React.Fragment>
      );
    })}
  </TableBody>
</Table>



          </TableContainer >
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};


CustomerNotes.propTypes = {
  customers: PropTypes.array.isRequired
};
