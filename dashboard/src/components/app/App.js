import React from 'react'
import TopBar from 'components/topbar';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
    <React.Fragment>
      <CssBaseline/>
      <div>
        <TopBar/>
      </div>
    </React.Fragment>
  );
}

export default App;
