import Head from 'next/head';
import { useState,useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { ItemListResults } from "../components/items/item-list-results";
import { ItemListToolbar } from "../components/items/item-list-toolbar";

import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'

import Router from 'next/router';
const Page = () => {

 
  const [items, setItems] = useState([{}])

  function getItems(){
    let data=  {
      "type" : "SP_CALL",
      "requestId" : 1200005,
      request: {
     }
}

  requestPost(data).then((res)=>{

    if(res.errorCode===3){
      Router
      .push(
      
      {
        pathname: '/login',
        query: { redirect: '1' },
      })
  }else{

    if(res.result[0] ==null){
      setItems([])
    }else{
      setItems(res.result)
    }

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
