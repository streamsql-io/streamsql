import React from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "styles/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import Nav from "components/nav";
import ResourceList from "components/resource-list";
import { Redirect, Route } from "react-router-dom";

export const App = ({ sections }) => (
  <ThemeWrapper>
    <Nav sections={sections}>{routes(sections)}</Nav>
  </ThemeWrapper>
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

export const ThemeWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

const mapStateToProps = (state) => ({
  sections: state.navSections,
});

export default connect(mapStateToProps)(App);
