import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useState } from 'react';
export default function FadeMenu(props) {





    const [isOpen, setIsOpen] = useState(false);


  
    const deletereq =()=>{
      setIsOpen(false);
   props.callback();
    }
  
    const edituser = ()=>{
      setIsOpen(false);
      props.editUser();
    }
    const updateitem = ()=>{
      setIsOpen(false);
      props.updateItem();
    }


    const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        :
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {props.editUser?   <MenuItem onClick={edituser}>Edit</MenuItem> : ''}
        
        { props.updateItem ?  <MenuItem onClick={updateitem}>Update</MenuItem> : '' }
        { props.callback ?   <MenuItem onClick={deletereq}>Delete</MenuItem> : ''}


      </Menu>
    </div>
  );
}