import Head from 'next/head';
import { Box, Container, Grid, Pagination,Snackbar,Alert } from '@mui/material';
import { useEffect,useState } from 'react';


import { CustomerNotes } from '../components/customer-history/customer-notes';


import { HistoryListToolbar } from '../components/customer-history/history-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { CustomerLayout } from "../components/customer-layout";
import requestPost from '../../serviceWorker'

import { useRouter } from 'next/router';
import Loader from '../components/Loader';
import Router from 'next/router';
const Page = () => {

 
  const router = useRouter();


  const [customers, setCustomers] = useState([])
  const [item,setItem] = useState([])
  const [payment, setPayments]  = useState([])
  const [itemhistory, setItemHistory] = useState([])
  const [cId, setCid] = useState('');
  const [cName, setCname] = useState('');
  const [phNo, setPhNo] = useState('');
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
const [table,setTable]=useState(1)
const [data,setData]=useState({})

const [loader, setLoader] = useState(true)


const handleClose = ()=>{
  setOpen(false)
 }





 function getCustomer(){

  let  data =  {
    "type" : "SP_CALL",
  "requestId" : 2300008,
     request: {
  "cId":cId
    }
  }
 
   requestPost(data).then((res)=>{
    console.log("fdsfsdffffffffffff" )
     if(res.errorCode===3){
       Router
       .push(
       
       {
         pathname: '/',
         query: { redirect: '1' },
       })
       console.log("sdfasfsfafass")
   }else{

     if(res.result.data[0] ==null){
      setCustomers([])
      setItem([])
     }else{
    
       console.log(res.result)
       console.log(res.result.data)
       console.log(res.result.item)
       setCustomers(res.result.data)
       setItem(res.result.label)
     }
    
     setLoader(false)

   }
   })
   .catch((err)=>{
    console.log("eeeeeeeeeeeeeeeeeeee")
    console.log(err)
     setCustomers([])
     setItem([])
     })
 
 
 }
 
 useEffect(() => {
 let id = sessionStorage.getItem("Cid")
 let name = sessionStorage.getItem("Cname")
 let phone = sessionStorage.getItem("Cphone")
  if(!id){
Router.push('/dashboard')
  }else{
    setCname(name)
    setPhNo(phone)
    setCid( id)
    getCustomer()
  }
  
 }, [cId])
 


  return(
  <>
    <Head>
      <title>
      Notes | TRMS
      </title>
    </Head>
    {loader ? <Loader/>  
    : <Box
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


     <CustomerNotes customers={customers} items={item} getdata={getCustomer} />
     


        </Box>
      </Container>
    </Box>
}
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
