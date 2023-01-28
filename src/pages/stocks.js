import Head from 'next/head';
import { useState,useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { StockListResults } from "../components/stocks/stock-list-results";
import { StockListToolbar } from "../components/stocks/stock-list-toolbar";

import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'


const Page = () => {

 
  const [stocks, setStocks] = useState([{}])

useEffect(() => {
  let data=  {
    "type" : "SP_CALL",
    "requestId" : 1200005,
    request: {
   }
}

  requestPost(data).then((res)=>{
    if(res.result[0] ==null){
      setStocks([{}])
    }else{
     
      setStocks(res.result)
    }
   
  })
 
}, [])




  return(
  <>
    <Head>
      <title>
        Customers | Material Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <StockListToolbar />
        <Box sx={{ mt: 3 }}>
          <StockListResults stocks={stocks} />
        </Box>
      </Container>
    </Box>
  </>
);
    }
Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
