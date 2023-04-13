import Head from 'next/head';
import { useEffect,useState } from 'react';
import { Box, Container } from '@mui/material';
import { UserListResults } from '../components/user/user-list-results';
import { UserListToobar } from '../components/user/user-list-toolbar';
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
    if(res.result[0] ==null){
      setCustomers([{}])
    }else{
      setCustomers(res.result)
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
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <UserListToobar  getdata={getCustomer} />
        <Box sx={{ mt: 3 }}>
          <UserListResults customers={customers} getdata={getCustomer} />
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
