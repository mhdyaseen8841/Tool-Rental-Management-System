import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthGuard } from './auth-guard';
import { useRouter } from 'next/router';
import { CustomerNavbar } from "./customer-navbar";
import { CustomerSidebar } from "./customer-sidebar";
const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const CustomerLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const router = useRouter()
  useEffect(() => {
    if (!localStorage.getItem("uId")) {
      router.push('/')
    }
  }, [])

  const setValue = (data) => {

  }

  return (
    <AuthGuard>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            backgroundColor: '#eee'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <CustomerNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <CustomerSidebar
        setTable={setValue}
        cid={props.cId}
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </AuthGuard>
  );
};
