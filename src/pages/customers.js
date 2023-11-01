import Head from 'next/head';
import { useEffect,useState } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'
import Router from 'next/router';
import Loader from '../components/Loader';
const Page = () => {



const [customers, setCustomers] = useState([{}])
const [loader, setLoader] = useState(true)

function getCustomer(){
  let data=  {
    "type" : "SP_CALL",
    "requestId" : 1100005,
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
      setCustomers([])
    }else{
      setCustomers(res.result)
    }
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


return(
  <>
    <Head>
      <title>
        Customers | TRMS
      </title>
    </Head>
    {loader ? <Loader/>  
    :<Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar  getdata={getCustomer} />
        <Box sx={{ mt: 3 }}>
          <CustomerListResults customers={customers} getdata={getCustomer} />
        </Box>
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
