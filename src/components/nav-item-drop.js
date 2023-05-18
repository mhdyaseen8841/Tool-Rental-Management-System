import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, ListItem } from '@mui/material';

export const NavItemDrop = (props) => {
  const { href, icon, title, arrowIcon, onClick, ...others } = props;
  const router = useRouter();
  const active = href ? router.pathname === href : false;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (onClick) {
      onClick(); // Call the onClick handler if provided
    }
  };

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2
      }}
      {...others}
    >
      <NextLink href={href} passHref>
        <Button
          component="a"
          startIcon={icon}
          disableRipple
          onClick={toggleDropdown}
          sx={{
            backgroundColor: active && 'rgba(255,255,255, 0.08)',
            borderRadius: 1,
            color: active ? 'green' : 'neutral.300',
            fontWeight: active && 'fontWeightBold',
            justifyContent: 'flex-start',
            px: 3,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            '& .MuiButton-startIcon': {
              color: active ? 'secondary.main' : 'neutral.400'
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)'
            },
            '&.selected': {
              backgroundColor: 'rgba(255,255,255, 0.08)',
              color: 'secondary.main',
              
            }
          }}
          className={isDropdownOpen ? 'selected' : ''}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {arrowIcon}
        </Button>
      </NextLink>
    </ListItem>
  );
};



NavItemDrop.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  arrowIcon: PropTypes.node
};
