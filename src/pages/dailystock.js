import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Box, Container, CircularProgress, Card, CardContent, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'
import Router from 'next/router';
import Loader from '../components/Loader';
const Page = () => {



  const [datas, setdatas] = useState([])
  const [labels, setLabels] = useState([])
  const [loader, setLoader] = useState(true)

  function getCustomer() {
    let data = {
      "type": "SP_CALL",
      "requestId": 2300010,
      request: {
      }
    }

    requestPost(data).then((res) => {
      console.log(res);
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {

        setLabels(res.result.label);
        setdatas(res.result.data);
        setLoader(false)

      }
    })
    // .catch((err)=>{
    //   setCustomers([{}])
    //   })


  }

  useEffect(() => {

    getCustomer()
  }, [])


  return (
    <>
      <Head>
        <title>
          Customers | TRMS
        </title>
      </Head>
      {loader ? <Loader />
        : <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth={false}>
            <>
              <Card >
                <PerfectScrollbar>
                  <Box >
                    <TableContainer style={{ maxHeight: '2000px' }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow  >
                            {
                              labels.map((item,ind) => (
                                <TableCell key={ind} sx={{textAlign:"center" }}>
                                  {item}
                                </TableCell>
                              ))
                            }






                          </TableRow>
                        </TableHead>
                        <TableBody style={{ overflowY: 'scroll' }}>
                          {datas.map((dt,ind) => (
                            <TableRow
                              hover
                              key={ind}
                            >
                              {
                                labels.map((item,index) => (
                                  <TableCell key={index} sx={{ padding: '4px',fontSize:14,fontWeight:600, textAlign:"center" }}>
                                    {dt[item]}
                                  </TableCell>
                                ))
                              }

                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </PerfectScrollbar>

              </Card>
            </>
          </Container>
        </Box>
      }
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
