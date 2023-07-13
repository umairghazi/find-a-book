import type { NextPage } from 'next';
import { Container, Box } from '@mui/material';
import { Layout } from '../components';

const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Layout />
      </Box>
    </Container>
  );
};

export default Home