import Head from 'next/head';
import { useEffect,useState } from 'react';
import { Box, Container } from '@mui/material';
import { UserListResults } from '../components/user/user-list-results';
import { UserListToolbar } from '../components/user/user-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import requestPost from '../../serviceWorker'
import Router from 'next/router'

const Page = () => {



  const [users, setUsers] = useState([{}])

function getUser(){
  let data=  {
    "type" : "SP_CALL",
   "requestId" : 1000005,
   "request": {
      }
}



  requestPost(data).then((res)=>{
 
    if(res.errorCode===3){
        Router.push('/login')
    }else{
        if(res.result[0] ==null){
            setUsers([{}])
          }else{
            setUsers(res.result)
          }
    }
  
  })
  // .catch((err)=>{
  //   setCustomers([{}])
  //   })


}

useEffect(() => {

 getUser()
}, [])


return(
  <>
    <Head>
      <title>
        Users | TRMS
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
        <UserListToolbar  getdata={getUser} />
        <Box sx={{ mt: 3 }}>
          <UserListResults users={users} getdata={getUser} />
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
