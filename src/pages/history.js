import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
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
      if(res.result[0] ==null){
        setCustomers([{}])
      }else{
        console.log("hehehe haha");
        console.log(router.query.cName);
        setCustomers(res.result)
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
