import Head from 'next/head';
import { Box, Container, Grid, Pagination,Snackbar,Alert } from '@mui/material';
import { useEffect,useState } from 'react';

import { HistoryListResults } from '../components/customer-history/history-list-results';
// import { HistoryListResults } from '../components/customer-history/history-item-results';

import { ItemResult } from '../components/customer-history/item-result';

import { ItemNameResult } from '../components/customer-history/item-name-result';

import { HistoryListToolbar } from '../components/customer-history/history-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { CustomerLayout } from "../components/customer-layout";
import requestPost from '../../serviceWorker'

import { useRouter } from 'next/router';
import { HistoryTotalResult } from '../components/customer-history/history-total-result';
import {RateCardResult} from '../components/customer-history/RateCardResult'

import Router from 'next/router';
const Page = () => {

 
  const router = useRouter();


  const [customers, setCustomers] = useState([])
  const [payment, setPayments]  = useState([])
  const [itemhistory, setItemHistory] = useState([])
  const [cId, setCid] = useState('');
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
const [table,setTable]=useState(1)
const [data,setData]=useState({})



const handleClose = ()=>{
  setOpen(false)
 }





 function getCustomer(){
  let  data =  {
    "type" : "SP_CALL",
  "requestId" : 1500005,
     request: {
  "cId":Router.query.cId
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
       console.log(res.result)
     }
    
 
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
        <HistoryListToolbar  getdata={getCustomer}   cId={router.query.cId} cName={router.query.cName} />
        <Box sx={{ mt: 3 }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {error}
  </Alert>
</Snackbar>


     <ItemResult customers={customers} getdata={getCustomer} />
     


        </Box>
      </Container>
    </Box>
  </>
);
    }
    


Page.getLayout = (page) =>{


 return(
  <CustomerLayout >
    {page}
  </CustomerLayout>
);
}

export default Page;