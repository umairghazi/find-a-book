import { Grid } from '@mui/material';
import { SelectColumn } from './'

import './Layout.module.css'

export const Layout = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      textAlign="center"
    >
      <Grid
        sx={{ alignSelf: 'stretch', backgroundColor: "#D7E1F3" }}
        item
        xs
      >
        <SelectColumn />
      </Grid>
      <Grid item xs>
        <SelectColumn />
      </Grid>
      <Grid item xs>
        <SelectColumn />
      </Grid>
    </Grid>
  );
}
