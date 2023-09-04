import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
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
  Link,
  Paper,
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

import { useEffect } from 'react';

import requestPost from '../../../serviceWorker'

export const ReportListResults = ({ data, label, getdata, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [addDialog, setDialog] = useState();
  const [filter, setFilter] = useState(false);

let totalPending = 0;
  const [checked, setChecked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState([]);
  
  const heading = label.slice(1)

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



  const [totalItems, setTotalItems] = useState([{}])

  function getItems(){
    let data=  {
      "type" : "SP_CALL",
      "requestId" : 1200005,
      request: {
     }
}

  requestPost(data).then((res)=>{

    if(res.errorCode===3){
      Router
      .push(
      
      {
        pathname: '/',
        query: { redirect: '1' },
      })
  }else{

    if(res.result[0] ==null){
      setTotalItems([])
    }else{
      setTotalItems(res.result)
    }

  }
   
  })

}

  useEffect(() => {

    console.log(label)
    // console.log(items)
    getItems()
    

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


  const labelCounts = { pendingAmount: 0 };

// Loop through the data to count the labels
data.forEach((row) => {
  row.forEach((cell, index) => {
    if (index !== 0 && index !== row.length - 1) { // Ignore the first and last cells
      const label = heading[index - 1];
      if (!labelCounts[label]) {
        labelCounts[label] = cell.pendingStock;
      } else {
        labelCounts[label] += cell.pendingStock;
      }
    } else if (index === row.length - 1) { // Check if this is the pending amount column
      labelCounts.pendingAmount += cell.pendingAmount;
    }
  });
});


// total count of each label endsss///



const genereatePdf = () => {

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape
  
  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);
  
  
  const title = "Report";
  const headers=[label];
  
  const datas = data.map((ele)=> {
    const dt = [];
    ele.map((e,i)=>{
      if(i == 0){
        dt.push(e.name);
      }
      else{
        dt.push(e.pending);
      }
    })
    return dt;
  });

  console.log(datas);
  var today = new Date();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = mm+'-'+dd+'-'+yyyy;

  var newdat = "Date of Report Generated  : "+ today;

  let content = {
    startY: 50,
    head: headers,
    body: datas
  };
  autoTable(doc, content)
  doc.text(title, marginLeft, 20);
  //doc.autoTable(content);
  doc.setFontSize(10);
  doc.text(40, 35, "Total Amount Pending : " + totalPending + " Rs.")

  doc.setFontSize(10);
  doc.text(40, 45, newdat)

  doc.page=1;

  // doc.text(500,200, 'Page No:' + doc.page);

  doc.save('Report.pdf');
  }

  return (

    <Card {...rest}>
      {addDialog}


      {localStorage.getItem('usertype') === 'owner' ? null : (
        <Box sx={{ m: 1 }}>
          <Button color="primary" onClick={genereatePdf} variant="contained">
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
        <Table >
          <TableHead>
            <TableRow>

              <TableCell >
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

            </TableRow>
          </TableHead>
          <TableBody>

            {data.map((row, index) => {

              let firstValue = row[0];
              let lastValue = row[row.length - 1];
              let middleValues = row.slice(1);

              return (

                <TableRow key={index}>
                  <TableCell sx={{border:1}} key={index}>{firstValue.name}<br />{firstValue.mobile}</TableCell>

{filter ? (
  

  selectedIndex.map((index) => {
    return (
      <TableCell  sx={{border:1}}  key={index}>
        
        {middleValues[index].pendingStock !== 0 ? (
                    <div style={{ color: 'white', background: 'red', maxWidth: '60px', textAlign: 'center' }}>
                      {middleValues[index].pending}
                    </div>
                  ) : (
                    <div />
                  )}

        
         
         </TableCell>
    )
  }
  )
  ):(
    
    middleValues.map((cell, index) => {

     if(index === middleValues.length-1){
      console.log("------------------------------------------------------")
totalPending+=middleValues[index].pending
     }

     return(
      <TableCell sx={{border:1}}  key={index}>


{middleValues[index].pendingStock !== 0 ? (
                    <div style={{ color: 'white', background: 'red', maxWidth: '130px', textAlign: 'center' }}>
                      {middleValues[index].pending}
                    </div>
                  ) : (
                    <div />
                  )}
      </TableCell>
     )
            })
  )}
             

                 
                </TableRow>

                

              )

            })}
{filter ? (

<TableRow>
<TableCell sx={{border:1}} >
      Total
    </TableCell>

{selectedIndex.map((label, index) =>{
console.log(selectedIndex)
const value = totalItems.find((item) => item.iName === heading[label]);
console.log(value)
if(label!=heading.length-1){

return(
<TableCell sx={{border:1}}  key={label}>
available:{value.aStock} <br></br>
pending:{value.tStock - value.aStock}<br></br>
total:{value.tStock}
</TableCell>
)
}
})}
  </TableRow>
):(
<TableRow>
<TableCell sx={{border:1}} >
      Total
    </TableCell>

{heading.slice(0,-1).map((label, index) =>{
console.log(totalItems)
console.log(totalPending)
const value = totalItems.find((item) => item.iName === label);
console.log(value)
return(
<TableCell sx={{border:1}}  key={label}>
available:{value.aStock} <br></br>
pending:{value.tStock - value.aStock}<br></br>
total:{value.tStock}
</TableCell>
)
})}
<TableCell sx={{border:1}}  key={label}>
Grand Amount:<br></br>{Math.trunc(totalPending*100)/100}
</TableCell>
  </TableRow>

)}

          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

ReportListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
