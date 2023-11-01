import { Box, Container, Grid } from '@mui/material';
import Image from 'next/image'

const Loader = () => {

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

export default Loader;