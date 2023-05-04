import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';

export const ReportListToolbar = (props) => {
  const [open, setOpen] = useState(false);
  const [addDialog, setDialog] = useState();
  const handleClose = () => {
    setDialog();
  };

  
  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        {addDialog}
        <Typography sx={{ m: 1 }} variant="h4">
          Report
        </Typography>

        
      </Box>
    </Box>
  );
};
