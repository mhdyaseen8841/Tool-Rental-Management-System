import Head from 'next/head';
import { Box, Container, Grid, Pagination,Snackbar,Alert } from '@mui/material';
import { useEffect,useState } from 'react';

import { HistoryListResults } from '../components/customer-history/history-list-results';
import { HistoryListToolbar } from '../components/customer-history/history-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'

import { useRouter } from 'next/router';
const Page = () => {

 
  const router = useRouter();


  const [customers, setCustomers] = useState([{}])
  const [cId, setCid] = useState('');
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

 const handleClose = ()=>{
  setOpen(false)
 }

  function getCustomer(){

    if(router.query){
      setCid( router.query.cId)
    }
        
    let data=  {
      "type" : "SP_CALL",
   "requestId" : 1400006,
       request: {
 "cId":router.query.cId
      }
}


  
  
    requestPost(data).then((res)=>{

      if(res.result){
      if(res.result[0] ==null){
        setCustomers([{}])
      }else{
        console.log("hehehe haha");
        console.log(router.query.cName);
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

    if(!router.query.cId){
router.push('/')
    }
  
   getCustomer()
  }, [])


  return(
  <>
    <Head>
      <title>
      History | TRMS
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
        <HistoryListToolbar  getdata={getCustomer} cId={router.query.cId} cName={router.query.cName} />
        <Box sx={{ mt: 3 }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {error}
  </Alert>
</Snackbar>
          <HistoryListResults customers={customers} getdata={getCustomer} />
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
