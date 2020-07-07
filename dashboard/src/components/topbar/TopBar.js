import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function TopBar() {
  return (
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography component="span" variant="h5">
            StreamSQL
          </Typography>
        </Toolbar>
      </AppBar>
  );
}

export default TopBar;
