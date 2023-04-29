import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';

import { useEffect } from 'react';


export const ReportListResults = ({ data,label,getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();



  const handleClose = () => {
    setDialog();
  };
  
  useEffect(() => {

    console.log('jjjjjjjjjiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    // console.log(items)
    
   }, [])
   


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

    // setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    
    <Card {...rest}>
        {addDialog}
     
    <TableContainer >
                    <Table>
            <TableHead>
              <TableRow>

            {label.map((label) => (
                <TableCell>
                  {label} 
                </TableCell>

            ))}
              
               
              </TableRow>
            </TableHead>
            <TableBody>
              
            {data.map((row, index) => {
              
              let firstValue = row[0];
               let lastValue = row[row.length - 1];
                let middleValues = row.slice(1, -1);
             return (
                
              <TableRow key={index}>
              <TableCell key={index}>{firstValue.name}<br/>{firstValue.mobile}</TableCell>
              
              
              {middleValues.map((cell, index) => (
                <TableCell key={index}>{cell.pendingStock}</TableCell>
              ))}
              
              <TableCell key={index}>{lastValue.pendingAmount}</TableCell>
            </TableRow>
              
                )
              
              })}
                

              
            </TableBody>
          </Table>
          </TableContainer>
       
     
      {/* <TablePagination
        component="div"
        // count={items.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </Card>
  );
};

ReportListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
