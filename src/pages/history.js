import Head from 'next/head';
import { Box, Container, Grid, Pagination,Snackbar,Alert } from '@mui/material';
import { useEffect,useState } from 'react';

import { HistoryListResults } from '../components/customer-history/history-list-results';
// import { HistoryListResults } from '../components/customer-history/history-item-results';

import { ItemResult } from '../components/customer-history/item-result';

import { ItemNameResult } from '../components/customer-history/item-name-result';

import { HistoryListToolbar } from '../components/customer-history/history-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'

import { useRouter } from 'next/router';
import { HistoryTotalResult } from '../components/customer-history/history-total-result';
const Page = () => {

 
  const router = useRouter();


  const [customers, setCustomers] = useState([])
  const [itemhistory, setItemHistory] = useState([])
  const [cId, setCid] = useState('');
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
const [table,setTable]=useState(1)

 const handleClose = ()=>{
  setOpen(false)
 }

 const changeTable=(btnName, Btnstatus=1)=>{
console.log(btnName, Btnstatus);
if(Btnstatus===2){
  console.log("item-name-result page result");
  console.log("tabbbllleeeeeee"+btnName);
  console.log("tabbbllleeeeeee"+Btnstatus);
  
  let data=   {
    "type" : "SP_CALL",
 "requestId" : 1600005,
     "request": {
"cId":router.query.cId,
 "itemId":btnName
    }
}
getCustomer(data,0)
  //not done
  // setTable(0)

}else{
  if(btnName==="history"){

    let data=  {
      "type" : "SP_CALL",
   "requestId" : 1400006,
       request: {
 "cId":router.query.cId
      }
}
getCustomer(data,1)
}else if(btnName==="total"){
  
  let data = {
    "type" : "SP_CALL",
    "requestId" : 1700005,
    request: {
      "cId" : cId,
   }
}

getCustomer(data,2)


}else{
  console.log("item-result page result")
  let data =  {
    "type" : "SP_CALL",
 "requestId" : 1500005,
     request: {
"cId":router.query.cId
    }
}
getCustomer(data,3)
 
}
 }
}
 
 
 function getCustomer(data,tableid){


    requestPost(data).then((res)=>{

console.log("tabbbllleeeeeee"+tableid);
if(tableid==3){
  if(res.result){
    if(res.result.item[0] ==null){
      setItemHistory([])
    }else{
      setItemHistory(res.result)

    }
    setTable(tableid)
  }else{
    setError(""+res)
        setOpen(true)
        setCustomers([])
      }
}else if(tableid==2){

    
  if(res.result){
    if(res.result[0][0] ==null){
      console.log("hloooooooooooo hiiiiiiiiiii hoiii")
      setCustomers([
       [],[]
      ])
    }else{
      console.log("kitiiiiiiiiiiiiiiiiiiiii kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
      setCustomers(res.result)
      console.log(res.result);
    }
    setTable(tableid)
  }else{
    setError(""+res)
        setOpen(true)
        setCustomers([
          [],[]
         ])

      }
    

}else{

      if(res.result){
      if(res.result[0] ==null){
        console.log("hloooooooooooo hiiiiiiiiiii hoiii")
        setCustomers([])
      }else{
        console.log("kitiiiiiiiiiiiiiiiiiiiii kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        setCustomers(res.result)
        console.log(res.result);
      }
      setTable(tableid)
    }else{
      setError(""+res)
          setOpen(true)
          setCustomers([])

          

        }
      }

      })
  }
  
  useEffect(() => {
if(router.query){
      setCid( router.query.cId)
    }
    if(!router.query.cId){
router.push('/')
    }
    let data=  {
      "type" : "SP_CALL",
   "requestId" : 1400006,
       request: {
 "cId":router.query.cId
      }
    }
   getCustomer(data,1)
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
        <HistoryListToolbar  getdata={getCustomer} setTable={changeTable} CtableId={table} cId={router.query.cId} cName={router.query.cName} />
        <Box sx={{ mt: 3 }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {error}
  </Alert>
</Snackbar>
{
  table===0?  <ItemNameResult customers={customers} getdata={getCustomer} />:table===1?
  <HistoryListResults customers={customers} getdata={getCustomer} />:table===2?
 //total page to be added
  <HistoryTotalResult customers={customers} getdata={getCustomer} />: 
     <ItemResult customers={itemhistory} getdata={getCustomer} />
}

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
