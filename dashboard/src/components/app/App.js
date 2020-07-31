import React from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import theme from "styles/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import Nav from "components/nav";
import ResourceList from "components/resource-list";
import { Redirect, Route } from "react-router-dom";
import ResourcesAPI from "api/resources";

export const App = ({ sections }) => (
  <ThemeWrapper>
    <Nav sections={sections}>{routes(sections)}</Nav>
  </ThemeWrapper>
);

const apiHandle = new ResourcesAPI();

export const views = {
  RESOURCE_LIST: "ResourceList",
  EMPTY: "Empty",
};

const viewComponent = {
  [views.RESOURCE_LIST]: ResourceList,
  [views.EMPTY]: Box,
};

function routes(sections) {
  const content = parseContentProps(sections);
  const routes = contentRoutes(content);
  const redirect = defaultRedirect(content);
  return routes.concat(redirect);
}

function contentRoutes(content) {
  return content.map((item) => {
    // must be capitalized to work due to:
    // https://reactjs.org/docs/jsx-in-depth.html#choosing-the-type-at-runtime
    const Component = viewComponent[item.view];
    return (
      <Route key={item.path} path={item.path}>
        <Component api={apiHandle} {...item.viewProps} />
      </Route>
    );
  });
}

const defaultRedirect = (content) => {
  const path = indexPath(content);
  // If we just use path as the key, it'll collide with the actual Route, so we
  // prepend default_redirect_.
  const key = "default_redirect_" + path;
  return <Redirect exact key={key} from="/" to={path} />;
};

export const indexPath = (content) => {
  if (content.length === 0) {
    throw TypeError("Nav cannot be empty");
  }
  return content[0].path;
};

export function parseContentProps(sections) {
  return sections
    .flatMap((section) => section.items)
    .filter((item) => !item.external)
    .map(parseItem);
}

const parseItem = (item) => ({
  title: item.title,
  view: item.view || views.EMPTY,
  viewProps: item.viewProps || {},
  path: item.path,
});

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
