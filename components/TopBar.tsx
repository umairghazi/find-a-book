import { AppBar, Box, Toolbar, Typography } from '@mui/material';

export const TopBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Find a Book
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
