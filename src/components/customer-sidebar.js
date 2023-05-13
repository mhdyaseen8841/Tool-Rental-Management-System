import { useEffect,useState } from 'react';
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
import requestPost from '../../serviceWorker'

let items = [
  
  {
    href: '/History',
    icon: (<UsersIcon fontSize="small" />),
    title: 'History'
  },

  {
    href: '/historyItems',
    icon: (<UsersIcon fontSize="small" />),
    title: 'Items'
  },
  {
    href: '/items',
    icon: (<InventoryIcon fontSize="small" />),
    title: 'Total'
  },
  {
    href: '/users',
    icon: (<UsersIcon fontSize="small" />),
    title: 'Rate Card'
  }
  // {
  //   href: '/history',
  //   icon: (<ShoppingBagIcon fontSize="small" />),
  //   title: 'history'
  // }
];



export const CustomerSidebar = (props) => {
  const { open, onClose } = props;
  const [buttons, setButtons] = useState([]);
  const [error, setError] = useState('');
  const [errOpen, setErrOpen] = useState(false);

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
  function getItems() {
    let data = {
      type: "SP_CALL",
      requestId: 1200005,
      request: {},
    };

    //hello hi find if any problem in this
    requestPost(data).then((res) => {

      if (res.errorCode === 3) {
        router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        if (res.result) {
          if (res.result[0] == null) {
            setButtons([]);
          } else {
            setButtons(res.result);
            console.log(res.result);
            items.push(
  ...res.result.map((dt) => {
    // Check if the item already exists in the array
    const exists = items.some((item) => item.title === dt.iName);

    // Only add the item if it doesn't already exist
    if (!exists) {
      return {
        href: '/' + dt.iName,
        icon: <ShoppingBagIcon fontSize="small" />,
        title: dt.iName,
      };
    }

    return null; // Skip this item if it already exists
  }).filter(Boolean) // Filter out any null values (i.e., items that already exist)
);
          }
        } else {
          setError("" + res);
          setErrOpen(true);
          setButtons([]);
        }
      }

    });
  }

  useEffect(() => {
    if(!localStorage.getItem("uId")){
      router.push('/')
    }else{
      getItems()
    }
    }, [])

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
          
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
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

CustomerSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
