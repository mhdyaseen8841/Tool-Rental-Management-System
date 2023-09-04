import Head from 'next/head';
import Image from 'next/image'
import Router from 'next/router';
import { useRouter } from 'next/router';
import { Box, Container, Grid } from '@mui/material';
import { useEffect } from 'react';



const Index = () => {


  const router = useRouter();



  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("uId")) {
        Router.push('/customers')
      } else {
        Router.push('/login')
      }
    }, 2000)

    if (router.query.redirect) {
      localStorage.removeItem("uId");
      localStorage.removeItem("authtoken");
      localStorage.removeItem("usertype");
      localStorage.removeItem("username");
    }
  }, [])
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Image src="/LogoAnimated.gif" width="300px" height="170px"></Image>
      </Grid>
    </Grid>
  );
};

export default Index; 
