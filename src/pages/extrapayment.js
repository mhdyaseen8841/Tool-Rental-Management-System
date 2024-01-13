import Head from 'next/head';
import { Box, Container, Grid, Pagination, Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';


import { ExtraPayment } from '../components/customer-history/extra-payment';


import { HistoryListToolbar } from '../components/customer-history/history-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { CustomerLayout } from "../components/customer-layout";
import requestPost from '../../serviceWorker'

import { useRouter } from 'next/router';

import Router from 'next/router';
const Page = () => {


  const router = useRouter();


  const [customers, setCustomers] = useState([])
  const [item, setItem] = useState([])
  const [payment, setPayments] = useState([])
  const [itemhistory, setItemHistory] = useState([])
  const [cId, setCid] = useState('');
  const [cName, setCname] = useState('');
  const [phNo, setPhNo] = useState('');
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [table, setTable] = useState(1)
  const [data, setData] = useState({})



  const handleClose = () => {
    setOpen(false)
  }





  function getCustomer() {

    let data = {
      "type": "SP_CALL",
      "requestId": 1700010,
      request: {
        "cId": cId
      }
    }

    requestPost(data).then((res) => {
      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {

        if (res.result[0] == null) {
          setCustomers([])
          setItem([])
        } else {
          setCustomers(res.result)
        }


      }
    })
      .catch((err) => {
        setCustomers([])
        setItem([])
      })


  }

  useEffect(() => {
    let id = sessionStorage.getItem("Cid")
    let name = sessionStorage.getItem("Cname")
    let phone = sessionStorage.getItem("Cphone")
    if (!id) {
      Router.push('/dashboard')
    } else {
      setCname(name)
      setPhNo(phone)
      setCid(id)
      getCustomer()
    }

  }, [cId])



  return (
    <>
      <Head>
        <title>
          Payment | TRMS
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
          <HistoryListToolbar getdata={getCustomer} cId={cId} cName={cName} />
          <Box sx={{ mt: 3 }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>


            <ExtraPayment customers={customers} getdata={getCustomer} />



          </Box>
        </Container>
      </Box>
    </>
  );
}



Page.getLayout = (page) => {


  return (
    <CustomerLayout >
      {page}
    </CustomerLayout>
  );
}

export default Page;
