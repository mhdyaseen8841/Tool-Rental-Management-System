import Head from 'next/head';
import { Box, Container, Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';

import { ItemNameResult } from '../components/customer-history/item-name-result';

import { HistoryListToolbar } from '../components/customer-history/history-list-toolbar';
import { CustomerLayout } from "../components/customer-layout";
import requestPost from '../../serviceWorker'

import { useRouter } from 'next/router';
import Loader from '../components/Loader';
import Router from 'next/router';
const Page = () => {


  const router = useRouter();


  const [customers, setCustomers] = useState([])
  const [item, setItem] = useState([])

  const [cId, setCid] = useState('');
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loader, setLoader] = useState(true)



  const handleClose = () => {
    setOpen(false)
  }





  function getCustomer() {
    let data = {
      "type": "SP_CALL",
      "requestId": 1600005,
      "request": {
        "cId": cId,
        "itemId": router.query.id
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

        if (res.result) {
          if (res.result[0] == null) {
            setCustomers([])
          } else {
            setCustomers(res.result)
          }

        } else {
          setError("" + res)
          setOpen(true)
          setCustomers([])

        }
        setLoader(false)
      }
    })
      .catch((err) => {
        setCustomers([

        ])



      })


  }

  useEffect(() => {
    let id = sessionStorage.getItem("Cid")
    setItem(router.query.name)
    if (!id) {
      Router.push('/dashboard')
    } else {
      setCid(id)
      getCustomer()
    }

  }, [cId, router.query])



  return (
    <>
      <Head>
        <title>
          History | TRMS
        </title>
      </Head>
      {loader ? <Loader />
        :
        <Box
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


              <ItemNameResult itemName={item} customers={customers} getdata={getCustomer} />



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
