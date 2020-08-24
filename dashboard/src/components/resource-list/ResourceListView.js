import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    margin: theme.spacing(4),
  },
}));

export const ResourceListView = ({
  title,
  resources,
  loading,
  failed,
  activeVersions = {},
  setVersion,
}) => {
  const classes = useStyles();
  const initialLoad = resources == null && !loading;
  const initRes = resources || [];
  const copy = (res) => resources.map((o) => ({ ...o }));
  // MaterialTable can't handle immutable object, we have to make a copy
  // https://github.com/mbrn/material-table/issues/666
  const mutableRes = Object.isFrozen(initRes) ? copy(initRes) : initRes;
  return (
    <Box className={classes.table}>
      <MaterialTable
        title={title}
        columns={[
          { title: "Name", field: "name" },
          {
            title: "Versions",
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
