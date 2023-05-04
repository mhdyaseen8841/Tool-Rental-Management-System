import { useState, useEffect } from 'react';
import {

    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Card, 
    TableContainer ,
   
  } from '@mui/material';


export default function ItemTable(details) {
    


  return (
    <div>
      <Card >
   
    <TableContainer >
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
                  Available Stocks
                </TableCell>
                <TableCell>
                  Total Stocks
                </TableCell>
          
              </TableRow>
            </TableHead>

            
            <TableBody>
            
                <TableRow
    
                >
                  
                </TableRow>
         
            </TableBody>
          </Table>
          </TableContainer>
       
     
      <TablePagination
        component="div"
  
     
      />
    </Card>
    </div>
  );
}
