import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MaterialTable from "material-table";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("json", json);

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    margin: theme.spacing(4),
  },
  detailPanel: {
    padding: theme.spacing(4),
  },
  config: {
    width: "100%",
  },
  detailButton: {
    margin: theme.spacing(1),
  },
  tag: {
    margin: theme.spacing(0.1),
  },
}));

export const ResourceListView = ({
  title,
  resources,
  loading,
  failed,
  activeTags,
  activeVersions = {},
  setVersion,
  toggleTag,
}) => {
  const classes = useStyles();
  const initialLoad = resources == null && !loading;
  const initRes = resources || [];
  const copy = (res) => res.map((o) => ({ ...o }));
  // MaterialTable can't handle immutable object, we have to make a copy
  // https://github.com/mbrn/material-table/issues/666
  const mutableRes = copy(initRes);
  return (
    <Box className={classes.table}>
      <MaterialTable
        title={title}
        columns={[
          { title: "Name", field: "name" },
          { title: "Description", field: "description" },
          {
            title: "Tags",
            field: "tags",
            render: (row) => (
              <TagList
                activeTags={activeTags}
                tags={row.tags}
                tagClass={classes.tag}
                toggleTag={toggleTag}
              />
            ),
          },
          {
            title: "Version",
            field: "versions",
            render: (row) => (
              <VersionSelector
                name={row.name}
                versions={row.versions}
                activeVersions={activeVersions}
                setVersion={setVersion}
              />
            ),
          },
        ]}
        data={mutableRes}
        isLoading={initialLoad || loading || failed}
        detailPanel={(rowData) => {
          return (
            <Grid
              container
              className={classes.detailPanel}
              direction="column"
              alignItems="center"
            >
              <Typography component="h3">Configuration</Typography>
              <Grid container item lg={6}>
                <SyntaxHighlighter
                  className={classes.config}
                  language="python"
                  style={okaidia}
                >
                  TEST
                </SyntaxHighlighter>
              </Grid>
              <Grid container item justify="center" direction="row" lg={6}>
                <Button
                  className={classes.detailButton}
                  variant="outlined"
                  color="secondary"
                >
                  View Usage
                </Button>
                <Button
                  className={classes.detailButton}
                  variant="outlined"
                  color="secondary"
                >
                  Monitor Values
                </Button>
              </Grid>
            </Grid>
          );
        }}
        onRowClick={(event, rowData, togglePanel) => togglePanel()}
        options={{
          search: true,
          draggable: false,
        }}
      />
    </Box>
  );
};

export const TagList = ({
  activeTags = {},
  tags = [],
  tagClass,
  toggleTag,
}) => (
  <Grid container direction="row">
    {tags.map((tag) => (
      <Chip
        key={tag}
        className={tagClass}
        color={activeTags[tag] ? "secondary" : "default"}
        onClick={() => toggleTag(tag)}
        variant="outlined"
        label={tag}
      />
    ))}
  </Grid>
);

export const VersionSelector = ({
  name,
  versions = [""],
  activeVersions = {},
  setVersion,
}) => (
  <FormControl>
    <Select
      value={activeVersions[name] || versions[0]}
      onChange={(event) => setVersion(name, event.target.value)}
    >
      {versions.map((version) => (
        <MenuItem key={version} value={version}>
          {version}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

ResourceListView.propTypes = {
  title: PropTypes.string.isRequired,
  resources: PropTypes.array,
  loading: PropTypes.bool,
  failed: PropTypes.bool,
  activeVersions: PropTypes.object,
  setVersion: PropTypes.func,
};

export default ResourceListView;
