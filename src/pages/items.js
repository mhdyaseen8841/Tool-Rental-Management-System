import Head from 'next/head';
import { useState,useEffect } from 'react';
import { Box, Container,Snackbar,Alert } from '@mui/material';
import { ItemListResults } from "../components/items/item-list-results";
import { ItemListToolbar } from "../components/items/item-list-toolbar";

import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'


const Page = () => {

 
  const [items, setItems] = useState([{}])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

 const handleClose = ()=>{
  setOpen(false)
 }

  function getItems(){
    let data=  {
      "type" : "SP_CALL",
      "requestId" : 1200005,
      request: {
     }
}

  requestPost(data).then((res)=>{
    if(res.result){
    if(res.result[0] ==null){
      setItems([{}])
    }else{
      console.log(res);
      setItems(res.result)
    }
   
  }else{
    setError(""+res)
        setOpen(true)
        setItems([{}])
      }
    })
}
  useEffect(() => {

    getItems()
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {error}
  </Alert>
</Snackbar>
      <Container maxWidth={false}>
        <ItemListToolbar getdata={getItems}/>
        <Box sx={{ mt: 3 }}>
          <ItemListResults items={items} getdata={getItems} />
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
