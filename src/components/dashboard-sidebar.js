import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';

let items = [
  
  
  {
    href: '/dashboard',
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Dashboard',
    isOwner: true
  },
  {
    href: '/customers',
    icon: (<UsersIcon fontSize="small" />),
    title: 'Active Customers',
    isOwner: true
  },
  {
    href: '/items',
    icon: (<InventoryIcon fontSize="small" />),
    title: 'Items',
    isOwner: false
  },
  {
    href: '/users',
    icon: (<UsersIcon fontSize="small" />),
    title: 'Users',
    isOwner: false

  },
  {
    href: '/report',
    icon: (<UsersIcon fontSize="small" />),
    title: 'Report',
    isOwner: false

  },
  {
    href: '/inactive-customers',
    icon: (<UsersIcon fontSize="small" />),
    title: 'Inactive Customers',
    isOwner: false

  },
];




export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/dashboard"
              passHref
            >
              <a>
                {/* <Logo
                  sx={{
                    height: 42,
                    width: 42
                  }}
                /> */}
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  A-ONE RENTALS
                </Typography>
                
              </div>
              
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => {
if(localStorage.getItem('usertype') === 'owner' && item.isOwner ){
  console.log(item.isOwner)
return(
    <NavItem
      key={item.title}
      icon={item.icon}
      href={item.href}
      title={item.title}
    />
)
}else if(localStorage.getItem('usertype') === 'admin' ){


  return(
  
    <NavItem
      key={item.title}
      icon={item.icon}
      href={item.href}
      title={item.title}
    />
  
)

}
          })}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
       
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
