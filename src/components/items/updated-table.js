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


export default function UpdatedTable(details) {
    


  return (
    <div>
      <Card >
   
    <TableContainer >
                    <Table>
            <TableHead>
              <TableRow>
              
                <TableCell>
                  Date
                </TableCell>

                <TableCell>
                  Item Name
                </TableCell>
                <TableCell>
                  Qty
                </TableCell>
           
                <TableCell>
                  Notes
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
