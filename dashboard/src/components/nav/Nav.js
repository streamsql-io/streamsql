import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { PURPLE } from "styles/theme";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

import Icon from "@material-ui/core/Icon";

const drawerWidth = "15%";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    overflow: "hidden",
  },
  appBar: {
    position: "fixed",
    zIndex: theme.zIndex.drawer + 1,
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  container: {
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  content: {
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    flexWrap: "noWrap",
  },
  navlink_active: {
    color: PURPLE,
    // Prior to this, elements inside of <a> were overriding color, this
    // makes it more specific since we can't use !important.
    "& span": {
      color: PURPLE,
    },
  },
  main: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    overflowY: "auto",
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#FFFFFF",
    },

    "&::-webkit-scrollbar": {
      width: "12px",
      backgroundColor: "#FFFFFF",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    "&::-webkit-scrollbar-button": {
      display: "none",
      width: 0,
      height: 0,
    },
  },
}));

const Nav = ({ children }) => {
  const classes = useStyles();
  return (
    <Router>
      <Box display="flex" component="div" className={classes.root}>
        <NavDrawer classes={classes} />
        <Box className={classes.container}>
          <TopBar classes={classes} />
          <BelowTopBar classes={classes}>
            <Box component="main" className={classes.main}>
              {children}
            </Box>
          </BelowTopBar>
        </Box>
      </Box>
    </Router>
  );
};

const TopBar = ({ classes }) => (
  <AppBar className={classes.appBar}>
    <Toolbar>
      <Typography component="span" variant="h5">
        StreamSQL
      </Typography>
    </Toolbar>
  </AppBar>
);

const BelowTopBar = ({ children, classes }) => (
  <Grid container direction="column" className={classes.content}>
    {/* Adds a div the size of TopBar to shift everything under it */}
    <div className={classes.toolbar} />
    {children}
  </Grid>
);

const NavDrawer = ({ classes }) => (
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
    anchor="left"
  >
    <div className={classes.toolbar} />
    <Divider />
    <ResourcesDrawerList classes={classes} />
    <Divider />
    <MonitoringDrawerList classes={classes} />
    <Divider />
    <AdminDrawerList classes={classes} />
  </Drawer>
);

const ResourcesDrawerList = ({ classes }) => {
  const items = [
    { text: "Data Sources", icon: "file-import", path: "/sources" },
    { text: "Materialized Views", icon: "copy", path: "/views" },
    { text: "Features", icon: "file-code", path: "/features" },
    { text: "Feature Sets", icon: "sitemap", path: "/feature-sets" },
    { text: "Training Sets", icon: "archive", path: "/training-sets" },
  ];
  return <DrawerList classes={classes} name="Resources" items={items} />;
};

const MonitoringDrawerList = ({ classes }) => {
  const items = [
    { text: "Metrics", icon: "chart-line", path: "/metrics" },
    { text: "Deployment", icon: "server", path: "/deployment" },
  ];
  return <DrawerList classes={classes} name="Monitoring" items={items} />;
};

const AdminDrawerList = ({ classes }) => {
  const items = [
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
  ];
  return <DrawerList classes={classes} name="Administration" items={items} />;
};

export const DrawerList = ({ classes, name, items }) => (
  <List>
    <ListSubheader>{name}</ListSubheader>
    {items.map(({ text, icon, path, external }) => (
      <DrawerListLink
        key={text}
        path={path}
        classes={classes}
        external={external}
      >
        <ListItem button>
          <ListItemIcon>
            {/* Prior to overflow being set to visible, fa-sitemap was being
              cut-off since its slightly larger than a typical icon. */}
            <Icon style={{ overflow: "visible" }} className={`fa fa-${icon}`} />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </DrawerListLink>
    ))}
  </List>
);

export function DrawerListLink({ classes, path, external, children }) {
  if (external) {
    return (
      // _blank opens a new tab and noopender noreferrer blocks a known security
      // issue. Read more here: https://mathiasbynens.github.io/rel-noopener/
      <a target="_blank" rel="noopener noreferrer" href={path}>
        {children}
      </a>
    );
  } else {
    return (
      <NavLink to={path} activeClassName={classes.navlink_active}>
        {children}
      </NavLink>
    );
  }
}

export default Nav;
