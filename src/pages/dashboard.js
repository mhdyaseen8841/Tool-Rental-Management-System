import Head from 'next/head';
import { useEffect,useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import { LatestOrders } from '../components/dashboard/latest-orders';
import { LatestProducts } from '../components/dashboard/latest-products';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { DashboardLayout } from '../components/dashboard-layout';
import { useRouter } from 'next/router';
import requestPost from '../../serviceWorker'
import Router from 'next/router';

const Page = () => {
const router=useRouter()



const [graphData, setGraphData] = useState([])
const [graphLabel, setGraphLabel] = useState([])
const [pieData,setPieData] = useState([])
const [pieLabel,setPieLabel] = useState([])
const [customers, setCustomers] = useState('')
const [items, setItems] = useState('')
const [amount, setAmount] = useState('')
const [users, setUsers] = useState('')

function getDashboardData(){
  let data=  {
    "type" : "SP_CALL",
    "requestId" : 2300005,
    request: {
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

  
      // setData(res.result)
      setCustomers(res.result.total.tCustomer)
      setItems(res.result.total.tItem)
      setUsers(res.result.total.tuser)
      setAmount(res.result.total.tAmount)
      setGraphData(res.result.graph.data)
      setGraphLabel(res.result.graph.label)
   setPieData(res.result.pie.pieData)
    setPieLabel(res.result.pie.pieLabel)

  }
  })
  // .catch((err)=>{
  //   setCustomers([{}])
  //   })


}

useEffect(() => {
  getDashboardData()
}, [])


  return(
  <>
    <Head>
      <title>
        Dashboard | AONERENTALS
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
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCustomers  data={customers}/>

          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <Budget data={items} />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TasksProgress  data={users} />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TotalProfit sx={{ height: '100%' }}  data={amount} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales data={graphData} label={graphLabel} />
          </Grid>
          <Grid
            item
            lg={4}
            md={12}
            xl={3}
            xs={12}
          >
            <TrafficByDevice data={pieData} label={pieLabel} sx={{ height: '100%' }} />
          </Grid>
        </Grid>
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
