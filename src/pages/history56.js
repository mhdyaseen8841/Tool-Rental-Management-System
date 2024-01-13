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

import Router from 'next/router';
const Page = () => {


  const router = useRouter();


  const [customers, setCustomers] = useState([])
  const [payment, setPayments] = useState([])
  const [itemhistory, setItemHistory] = useState([])
  const [cId, setCid] = useState('');
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [table, setTable] = useState(1)
  const [data, setData] = useState({})



  const handleClose = () => {
    setOpen(false)
  }

  const changeTable = (btnName, Btnstatus = 1) => {
    if (Btnstatus === 2) {


      let data = {
        "type": "SP_CALL",
        "requestId": 1600005,
        "request": {
          "cId": cId,
          "itemId": btnName
        }
      }
      setData(data)
      getCustomer(0, data)
      //not done
      // setTable(0)

    } else {
      if (btnName === "history") {

        let data = {
          "type": "SP_CALL",
          "requestId": 1400006,
          request: {
            "cId": cId
          }
        }
        setData(data)
        getCustomer(1, data)
      } else if (btnName === "total") {

        let data = {
          "type": "SP_CALL",
          "requestId": 1700005,
          request: {
            "cId": cId,
          }
        }
        setData(data)
        getCustomer(2, data)


      } else if (btnName === "ratecard") {

        let data = {
          "type": "SP_CALL",
          "requestId": 1800005,
          "request": {
            "cId": cId,
          }
        }
        setData(data)
        getCustomer(4, data)


      } else {
        let data = {
          "type": "SP_CALL",
          "requestId": 1500005,
          request: {
            "cId": cId
          }
        }
        setData(data)
        getCustomer(3, data)

      }
    }
  }


  function getCustomer(tableid, datas) {


    requestPost(datas).then((res) => {

      if (res.errorcode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {

        if (tableid == 3) {
          if (res.result) {
            setItemHistory(res.result)
            setTable(tableid)
          } else {
            setError("" + res)
            setOpen(true)
            setCustomers([])
          }
        } else if (tableid == 2) {

          if (res.result) {

            if ((res.result[0][0] == null) && (res.result[1][0] == null)) {
              setCustomers([])
              setPayments([])
            } else {
              if (res.result[0][0] == null) {
                setCustomers([])
                setPayments(res.result[1])
              } else if (res.result[1][0] == null) {

                setCustomers(res.result[0])
                setPayments([])
              } else {
                setCustomers(res.result[0])
                setPayments(res.result[1])
              }

            }
            setTable(tableid)
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


        } else {

          if (res.result) {
            if (res.result[0] == null) {
              setCustomers([])
            } else {
              setCustomers(res.result)
            }
            setTable(tableid)
          } else {
            setError("" + res)
            setOpen(true)
            setCustomers([])



          }
        }
      }

    })
  }

  useEffect(() => {
    if (router.query.cId) {
      sessionStorage.setItem("Cid", router.query.cId)
      setCid(router.query.cId)
    }
    else {
      let id = sessionStorage.getItem("Cid")
      if (id) {
        setCid(id)
      } else {
        Router.push('/dashboard')
      }
    }
    let data = {
      "type": "SP_CALL",
      "requestId": 1400006,
      request: {
        "cId": cId
      }
    };
    setData(data)
    getCustomer(1, data)
  }, [cId])


  return (
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
          <HistoryListToolbar getdata={getCustomer} setTable={changeTable} ApiData={data} CtableId={table} cId={router.query.cId} cName={router.query.cName} />
          <Box sx={{ mt: 3 }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
            {
              table === 0 ? <ItemNameResult customers={customers} getdata={getCustomer} /> : table === 1 ?
                <HistoryListResults customers={customers} getdata={getCustomer} /> : table === 2 ?
                  //total page to be added
                  <HistoryTotalResult customers={customers} ApiData={data} CtableId={table} payments={payment} getdata={getCustomer} /> :
                  table === 3 ?
                    <ItemResult customers={itemhistory} getdata={getCustomer} /> :
                    <RateCardResult CtableId={table} ApiData={data} customers={customers} getdata={getCustomer} />
            }

          </Box>
        </Container>
      </Box>
    </>
  );

}


Page.getLayout = (page) => {


  return (
    <CustomerLayout setTable={page.changeTable}>
      {page}
    </CustomerLayout>
  );
}

export default Page;
