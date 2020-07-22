import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "styles/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import Nav from "components/nav";
import ResourceList from "components/resource-list";
import { Redirect, Route } from "react-router-dom";

const sections = [
  {
    name: "Resources",
    items: [
      { title: "Data Sources", icon: "file-import", path: "/sources" },
      { title: "Materialized Views", icon: "copy", path: "/views" },
      { title: "Features", icon: "file-code", path: "/features" },
      { title: "Feature Sets", icon: "sitemap", path: "/feature-sets" },
      { title: "Training Sets", icon: "archive", path: "/training-sets" },
    ],
  },
  {
    name: "Monitoring",
    items: [
      { title: "Metrics", icon: "chart-line", path: "/metrics" },
      { title: "Deployment", icon: "server", path: "/deployment" },
    ],
  },
  {
    name: "Admin",
    items: [
      { title: "Users", icon: "users", path: "/users" },
      { title: "Settings", icon: "cogs", path: "/settings" },
      { title: "Billing", icon: "wallet", path: "/billing" },
      {
        title: "Documentation",
        icon: "book",
        path: "https://docs.streamsql.io",
        external: true,
      },
      { title: "Help", icon: "question", path: "/help" },
    ],
  },
];

export const App = (props) => (
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
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default App;
