import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    margin: theme.spacing(4),
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
}) => {
  const classes = useStyles();
  const initialLoad = resources == null && !loading;
  const initRes = resources || [];
  const copy = (res) => res.map((o) => ({ ...o }));
  // MaterialTable can't handle immutable object, we have to make a copy
  // https://github.com/mbrn/material-table/issues/666
  const mutableRes = Object.isFrozen(initRes) ? copy(initRes) : initRes;
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
                tags={row.tags}
                tagClass={classes.tag}
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
        options={{
          search: true,
          draggable: false,
        }}
      />
    </Box>
  );
};

export const TagList = ({
  tags=[],
  tagClass,
}) => (
  <Grid container direction="horizontal">
      {tags.map((tag) => (
        <Chip className={tagClass} variant="outlined" label={tag}/>
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
