import { useState, useEffect } from 'react';
import {

  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Card,
  TableContainer,
  Chip,
  Typography

} from '@mui/material';
import requestPost from '../../../serviceWorker'

export default function ItemTable(details) {


  const [data, setData] = useState([])



  function getData() {
    let datas = {
      "type": "SP_CALL",
      "requestId": 1300005,
      request: {
        "itemId": details.data
      }
    }


    requestPost(datas).then((res) => {

      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {

        if (res.result[0] == null) {
          setData([])
        } else {
          setData(res.result)
        }


      }
    })


  }

  useEffect(() => {

    getData()
  }, [])


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
                  Quantity
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Note
                </TableCell>

              </TableRow>
            </TableHead>


            <TableBody>

              {data.map((row, index) => {
                return (
                  <TableRow
                    key={index}

                  >
                    <TableCell>
                      {row.date}
                    </TableCell>
                    <TableCell>
                      {row.qty}
                    </TableCell>
                    <TableCell>
                      {row.status == 1 ? <Typography sx={{backgroundColor:'success.main' ,borderRadius:'20px',textAlign:'center',color:'white',fontWeight:'500',width:'100px'}}>Purchased</Typography>
                        : <Typography sx={{backgroundColor:'error.main' ,borderRadius:'20px' ,textAlign:'center',color:'white',fontWeight:'500',width:'80px'}}>Loss</Typography>}
                    </TableCell>
                    <TableCell>
                      {row.note}
                    </TableCell>
                  </TableRow>


                )



              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
