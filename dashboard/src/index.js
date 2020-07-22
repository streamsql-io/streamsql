import React from "react";
import ReactDOM from "react-dom";
import "styles/base.css";
import App from "./components/app";
import ReduxWrapper from "./components/redux/wrapper";
import ReduxStore from "./components/redux/store";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ReduxWrapper store={ReduxStore}>
      <App />,
    </ReduxWrapper>
  </React.StrictMode>,
  document.querySelector("#root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
