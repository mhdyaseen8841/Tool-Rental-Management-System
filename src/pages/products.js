import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { useEffect,useState } from 'react';

import { ProductListResults } from '../components/product/product-list-results';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'

const Page = () => {


  const [customers, setCustomers] = useState([{}])

  function getCustomer(){
    let data=  {
      "type" : "SP_CALL",
      "requestId" : 1100005,
      request: {
     }
  }
  
    requestPost(data).then((res)=>{
      if(res.errorcode ==0){
        setCustomers([{}])
      }else{
      
        setCustomers(res.result)
      }
     
    })
  }
  
  useEffect(() => {
  
   getCustomer()
  }, [])


  return(
  <>
    <Head>
      <title>
        Products | Material Kit
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
        <ProductListToolbar  getdata={getCustomer} />
        <Box sx={{ mt: 3 }}>
          <ProductListResults customers={customers} getdata={getCustomer} />
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
