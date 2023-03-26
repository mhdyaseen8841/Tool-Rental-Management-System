import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    position: 'relative',
    width: 500,
    maxHeight: '80vh',
    overflowY: 'auto',
    outline: 'none',
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  table: {
    minWidth: 500,
  },
}));

const GetHistoryModal = ({ open, onClose }) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Mock data for the table
    const data = [
      { id: 1, col1: 'Row 1, Column 1', col2: 'Row 1, Column 2', col3: 'Row 1, Column 3' },
      { id: 2, col1: 'Row 2, Column 1', col2: 'Row 2, Column 2', col3: 'Row 2, Column 3' },
      { id: 3, col1: 'Row 3, Column 1', col2: 'Row 3, Column 2', col3: 'Row 3, Column 3' },
    ];

    setTableData(data);
  }, []);

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className={classes.paper}>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="example table">
            <TableHead>
              <TableRow>
                <TableCell>Column 1</TableCell>
                <TableCell>Column 2</TableCell>
                <TableCell>Column 3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.col1}</TableCell>
                  <TableCell>{row.col2}</TableCell>
                  <TableCell>{row.col3}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
};

export default GetHistoryModal;
