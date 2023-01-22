import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FadeMenu from '../more-items-btn';
import FullScreenDialog from './add-stocks';

export const StockListResults = ({ stocks, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [addDialog, setDialog] = useState();

  const handleClose = () => {
    setDialog();
  };

const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
  
  setOpen(true);
  const add = (data) => {
    
    setDialog(); 
  };
  setDialog(() => (
    
    <FullScreenDialog
      onClose={handleClose}
      open={open}
       submit={add}
       updated={upd}
       button={button}
       data={data}
    />
  ));
};


  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = stocks.map((stocks) => stocks.itemId);
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
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    
    <Card {...rest}>
        {addDialog}
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
               
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Monthly Rent
                </TableCell>
                <TableCell>
                  Daily Rent
                </TableCell>
                <TableCell>
                  Total Stocks
                </TableCell>
               
                <TableCell>
                   Actions
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.slice(0, limit).map((stocks) => (
                <TableRow
                  hover
                  key={stocks.id}
                  selected={selectedCustomerIds.indexOf(stocks.id) !== -1}
                >
                  
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                     
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {stocks.iName}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {stocks.mRent}
                  </TableCell>
                  <TableCell>
                    {stocks.dRent}
                  </TableCell>
                  <TableCell>
                    {stocks.tstock}
                  </TableCell>
                 
                  <TableCell>
                  <FadeMenu  callback={()=>{deleteUser(cId)}} editUser={(e)=>handleAdd(e,true,'EDIT', {name:'yaseen',mobile:'7445',email:'y@gmail.com',address:'puthukkadan house'})}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={stocks.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

StockListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
