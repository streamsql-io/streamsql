import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "styles/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import Nav from "components/nav";

const sections = [
  {
    name: "Resources",
    items: [
      { text: "Data Sources", icon: "file-import", path: "/sources" },
      { text: "Materialized Views", icon: "copy", path: "/views" },
      { text: "Features", icon: "file-code", path: "/features" },
      { text: "Feature Sets", icon: "sitemap", path: "/feature-sets" },
      { text: "Training Sets", icon: "archive", path: "/training-sets" },
    ],
  },
  {
    name: "Monitoring",
    items: [
      { text: "Metrics", icon: "chart-line", path: "/metrics" },
      { text: "Deployment", icon: "server", path: "/deployment" },
    ],
  },
  {
    name: "Admin",
    items: [
      { text: "Users", icon: "users", path: "/users" },
      { text: "Settings", icon: "cogs", path: "/settings" },
      { text: "Billing", icon: "wallet", path: "/billing" },
      {
        text: "Documentation",
        icon: "book",
        path: "https://docs.streamsql.io",
        external: true,
      },
      { text: "Help", icon: "question", path: "/help" },
    ],
  },
];

export const App = (props) => (
  <Wrapper>
    <Nav sections={sections}></Nav>
  </Wrapper>
);

export const Wrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default App;
