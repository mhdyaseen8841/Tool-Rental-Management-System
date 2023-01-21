import Head from 'next/head';
import { useEffect,useState } from 'react';
import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'
const Page = () => {



  const [customers, setCustomers] = useState([{}])

useEffect(() => {
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
      console.log(res);
      setCustomers(res.result)
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
        <CustomerListToolbar />
        <Box sx={{ mt: 3 }}>
          <CustomerListResults customers={customers} />
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
