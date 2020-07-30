import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    margin: theme.spacing(4),
  },
}));

export const ResourceListView = ({ title, resources, loading, failed }) => {
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
        columns={[{ title: "Name", field: "name" }]}
        data={mutableRes}
        isLoading={initialLoad || loading || failed}
        options={{
          search: true,
        }}
      />
    </Box>
  );
};

ResourceListView.propTypes = {
  title: PropTypes.string.isRequired,
  resources: PropTypes.array,
  loading: PropTypes.bool,
  failed: PropTypes.bool,
};

export default ResourceListView;
