import Head from 'next/head';
import { Box, Container, Grid, Pagination, Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';

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
import { RateCardResult } from '../components/customer-history/RateCardResult'
import Loader from '../components/Loader';
import Router from 'next/router';
const Page = () => {


  const router = useRouter();


  const [customers, setCustomers] = useState([])
  const [items, setItem] = useState({})
  const [payment, setPayments] = useState([])
  const [extraPayment, setExtraPayments] = useState([])
  const [itemhistory, setItemHistory] = useState([])
  const [cId, setCid] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [table, setTable] = useState(1)
  const [data, setData] = useState({})

  const [loader, setLoader] = useState(true)


  const handleClose = () => {
    setOpen(false)
  }





  function getCustomer() {
    let data = {
      "type": "SP_CALL",
      "requestId": 1700005,
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
        if (res.items) {
          setItem(res.items)
        }

        if (res.result) {



          setCustomers(res.result[0])
          setPayments(res.result[1])
          setExtraPayments(res.result[2])
        } else {
          setError("" + res)
          setOpen(true)
          setCustomers([
            []
          ])
          setPayments([
            []
          ])

        }

        setLoader(false)
      }
    })
      .catch((err) => {
        setCustomers([
          []
        ])
        setPayments([
          []
        ])


      })


  }

  useEffect(() => {
    let id = sessionStorage.getItem("Cid")
    if (!id) {
      Router.push('/dashboard')
    } else {
      setCid(id)
      getCustomer()
    }

  }, [cId])



  return (
    <>
      <Head>
        <title>
          History | TRMS
        </title>
      </Head>
      {loader ? <Loader />
        : <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth={false}>
            <HistoryListToolbar getdata={getCustomer} cId={router.query.cId} cName={router.query.cName} />
            <Box sx={{ mt: 3 }}>
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              </Snackbar>


              <HistoryTotalResult customers={customers} payments={payment} extraPayment={extraPayment} items={items} getdata={getCustomer} />



            </Box>
          </Container>
        </Box>
      }
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
