import Head from 'next/head';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import requestPost from '../../serviceWorker'
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import { useEffect } from 'react';



const Login = () => {


  const router = useRouter();

  const [error, setError] = useState(false)
  const [errMsg, setErroMsg] = useState('')



  useEffect(() => {

    if (localStorage.getItem("uId")) {
      Router.push('/customers')
    }

    if (router.query.redirect) {
      localStorage.removeItem("uId");
      localStorage.removeItem("authtoken");
      localStorage.removeItem("usertype");
      localStorage.removeItem("username");
      setError(true)

    }
  }, [])

  

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setError(false)
  }
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: (res) => {

      let data = {
        "type": "Authetication",
        "request": {
          "username": res.username,
          "password": res.password
        }
      }



      requestPost(data).then((res) => {
        console.log(res);
        if (res.errorCode === 1) {
          localStorage.setItem('usertype', res.data.usertype)
          localStorage.setItem('uId', res.data.uId)
          localStorage.setItem('username', res.data.username)
          localStorage.setItem('authtoken', res.token)
          Router.push('/customers')
        } else {
          //erroorrrr
          setErroMsg(res.errorMsg)
          formik.setSubmitting(false)
          setOpen(true)
        }
      }).catch((err) => {
        formik.setSubmitting(false)
      })
    }
  });

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      formik.handleSubmit()
    }
  };
  return (
    <>
      <Head>
        <title>Login | AONE</title>
      </Head>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errMsg}
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Session Expired! Please Login Again
        </Alert>
      </Snackbar>


      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Sign in
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Sign in to A-ONE RENTALS
              </Typography>
            </Box>


            <TextField
              error={Boolean(formik.touched.username && formik.errors.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors.username}
              label="username"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.username}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
              onKeyDown={handleKeyDown}
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={formik.handleSubmit}
              >
                Sign In Now
              </Button>
            </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login;
