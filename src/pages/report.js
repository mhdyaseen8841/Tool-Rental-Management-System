import Head from 'next/head';
import { useState,useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { ReportListResults } from "../components/report/report-list-result";
import { ReportListToolbar } from "../components/report/report-list-toolbar";

import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'
import Loader from '../components/Loader';
import Router from 'next/router';
const Page = () => {

    const [data, setData] = useState([])
    const [label , setLabel] = useState([])
    const [loader, setLoader] = useState(true)

  const [items, setItems] = useState({})

  function getItems(){
    let data=  {
        "type" : "SP_CALL",
         "requestId" : 2300006,
         "request": {}
      }

  requestPost(data).then((res)=>{
console.log(res.result.label)
    if(res.errorCode===3){
      Router
      .push(
      
      {
        pathname: '/',
        query: { redirect: '1' },
      })
  }else{

    if(res.result.length ==0){
        console.log("empty")
        setData({})
        setLabel({})
    }else{
        console.log("not empty")
        console.log(res.result.data)
        console.log(res.result.label)

        setData(res.result.data)
        setLabel(res.result.label)
    //   setItems(res.result)
    }
    setLoader(false)
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
    {loader && <Loader/>  }
    
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <ReportListToolbar getdata={getItems} label={label}/>
        <Box sx={{ mt: 3 }}>
          <ReportListResults data={data} label={label} getdata={getItems} />
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
