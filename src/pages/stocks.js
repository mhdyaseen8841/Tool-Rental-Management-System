import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { StockListResults } from "../components/stocks/stock-list-results";
import { StockListToolbar } from "../components/stocks/stock-list-toolbar";

import { DashboardLayout } from '../components/dashboard-layout';
import { customers } from '../__mocks__/customers';

const Page = () => (
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
        <StockListToolbar />
        <Box sx={{ mt: 3 }}>
          <StockListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
