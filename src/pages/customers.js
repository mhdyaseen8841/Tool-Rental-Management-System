import Head from 'next/head';
import { useEffect,useState } from 'react';
import { Box, Container,AlertTitle,Alert,Snackbar } from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'
const Page = () => {



  const [customers, setCustomers] = useState([{}])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

 const handleClose = ()=>{
  setOpen(false)
 }

function getCustomer(){
  let data=  {
    "type" : "SP_CALL",
    "requestId" : 1100005,
    request: {
   }
}

  requestPost(data).then((res)=>{


if(res.result){
    if(res.result[0] ==null){
      setCustomers([{}])
    }else{
      setCustomers(res.result)
    }
  }else{
setError(""+res)
    setOpen(true)
    setCustomers([{}])
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
        <CustomerListToolbar  getdata={getCustomer} />
        <Box sx={{ mt: 3 }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {error}
  </Alert>
</Snackbar>
          <CustomerListResults customers={customers} getdata={getCustomer} />
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
