import React from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "styles/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import Nav from "components/nav";
import ResourceList from "components/resource-list";
import { Redirect, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "reducers";

const store = configureStore({
  reducer: rootReducer,
});

export const App = ({ sections }) => (
  <Wrapper>
    <Nav sections={sections}>{routes(sections)}</Nav>
  </Wrapper>
);

function routes(sections) {
  const content = parseContentProps(sections);
  const routes = contentRoutes(content);
  const redirect = defaultRedirect(content);
  return routes.concat(redirect);
}

function contentRoutes(content) {
  return content.map((item) => (
    <Route key={item.path} path={item.path}>
      <ResourceList title={item.title} />
    </Route>
  ));
}

const defaultRedirect = (content) => {
  const path = indexPath(content);
  return <Redirect exact key={path} from="/" to={path} />;
};

export const indexPath = (content) => {
  if (content.length === 0) {
    throw "Nav cannot be empty";
  }
  return content[0].path;
};

export function parseContentProps(sections) {
  return sections
    .flatMap((section) => section.items)
    .filter((item) => !item.external)
    .map((item) => ({ title: item.title, path: item.path }));
}

export const Wrapper = ({ children }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </Provider>
);

const mapStateToProps = (state) => ({
  sections: state.navSections,
});

export default connect(mapStateToProps)(App);
