import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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


export const ReportListResults = ({ data, label, getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [addDialog, setDialog] = useState();
  const [filter, setFilter] = useState(false);

  const [checked, setChecked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState([]);
  
  const heading = label.slice(1, -1)

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
    setOpen(true);
  };

  const handleOptionSelect = (event) => {
    setFilter(true)
    const { value } = event.target;

    if (selectedOptions.includes(value)) {
    
      let index = selectedOptions.indexOf(value);
      let headingIndex = selectedIndex[index];
      if (selectedOptions.length === 1) {
        setFilter(false)
      } 

      setSelectedIndex(selectedIndex.filter((option) => option !== headingIndex));
      setSelectedOptions(selectedOptions.filter((option) => option !== value));

    } else {
//check value position in heading array

let index = heading.indexOf(value);
console.log(index)

if (index !== -1) {
  // Add the index to the selectedIndex array
  setSelectedIndex((selectedIndex) => [...selectedIndex, index]);
}


     
         

      setSelectedOptions((options) => [...options, value]);
    }
    console.log("heyyyyyyyyyyyyyyyyyyyyyyy")
    console.log(selectedIndex)
 
  };

  const handleDialogClose = () => {
    
    setOpen(false);
  };



  const handleClose = () => {
    setDialog();
  };

  useEffect(() => {

    console.log(label)
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


      {localStorage.getItem('usertype') === 'owner' ? null : (
        <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained">
            Print
          </Button>

          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleCheckboxChange}>
            Filter
          </Button>

          <Dialog open={open} onClose={handleDialogClose}>
            <DialogTitle>Select filter options</DialogTitle>
            <DialogContent>
              {heading.map((label) => (
                <FormControlLabel
                key={label}
                  control={
                    <Checkbox
                      value={label}
                      onChange={handleOptionSelect}
                      checked={selectedOptions.includes(label)}
                    />
                  }
                  label={label}
                />
              ))}


            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
             
            </DialogActions>
          </Dialog>
        </Box>
      )}

      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>

              <TableCell>
                {label[0]}
              </TableCell>

              {filter ? (

                selectedOptions.map((label) => {
                  return (
                    <TableCell key={label}>
                      {label}
                    </TableCell>
                  )
                })
              ) : (

                heading.map((label) => {
                  return (
                    <TableCell key={label}>
                      {label}
                    </TableCell>
                  )
                })

              )}

              <TableCell>
                {label[label.length - 1]}
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>

            {data.map((row, index) => {

              let firstValue = row[0];
              let lastValue = row[row.length - 1];
              let middleValues = row.slice(1, -1);
              return (

                <TableRow key={index}>
                  <TableCell key={index}>{firstValue.name}<br />{firstValue.mobile}</TableCell>

{filter ? (
  

  selectedIndex.map((index) => {
    return (
      <TableCell key={index}>{middleValues[index].pendingStock}</TableCell>
    )
  }
  )
  ):(
    middleValues.map((cell, index) => (
      <TableCell key={index}>{cell.pendingStock}</TableCell>
    ))
  )}
             

                  <TableCell key={index}>{lastValue.pendingAmount}</TableCell>
                </TableRow>

              )

            })}

          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

ReportListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
