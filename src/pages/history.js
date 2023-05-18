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

let cName;
let phNo;
  const [customers, setCustomers] = useState([])
  const [item,setItem] = useState([])
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
  console.log(cId)   
 
  console.log('qqqqqqqqqqqqqqqqqqqqqq')
 let  data=   {
  "type" : "SP_CALL",
"requestId" : 1400006,
   "request": {
"cId":cId
  }
}
 
   requestPost(data).then((res)=>{
     console.log("fdsfsdffffffffffff" )
     console.log(res)
     if(res.errorCode===3){
       Router
       .push(
       
       {
         pathname: '/',
         query: { redirect: '1' },
       })
       console.log("sdfasfsfafass")
   }else{

    if(res.result){
      if(res.result[0] ==null){
        setCustomers([])
      }else{
        setCustomers(res.result)
      }

    }else{
      setError(""+res)
          setOpen(true)
          setCustomers([])
    
   }
   }
  })
   .catch((err)=>{
    console.log("eeeeeeeeeeeeeeeeeeee")
    console.log(err)
    setCustomers([
        
       ])
     

    
     })
 
 
 }
 
 useEffect(() => {
  if(router.query.cId){
    sessionStorage.setItem("Cid", router.query.cId)
    sessionStorage.setItem("Cname", router.query.cName)
    sessionStorage.setItem("Cphone", router.query.phNo)
        setCid(router.query.cId)
        cName= router.query.cName
        phNo = router.query.phNo
        getCustomer()
      }
      else {

   let id = sessionStorage.getItem("Cid")
   cName= sessionStorage.getItem("Cname")
    phNo = sessionStorage.getItem("Cphone")
    
   console.log(id)
   if(id){
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    setCid(id)
    console.log(id)
    getCustomer()
   }else{
  console.log(id)
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
  Router.push('/dashboard')
   }
      }
  
    }, [cId])
 


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
        <HistoryListToolbar  getdata={getCustomer}   cId={cId} cName={cName} />
        <Box sx={{ mt: 3 }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {error}
  </Alert>
</Snackbar>


  <HistoryListResults customers={customers}  getdata={getCustomer} />
     


        </Box>
      </Container>
    </Box>
  </>
);
    }
    


Page.getLayout = (page) =>{


 return(
  <CustomerLayout  cId={cId}>
    {page}
  </CustomerLayout>
);
}

export default Page;
