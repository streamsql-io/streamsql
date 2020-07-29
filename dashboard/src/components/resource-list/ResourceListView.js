import React from "react";
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
  return (
    // MaterialTable doesn't support className, so we wrap it in a Box:
    // https://github.com/mbrn/material-table/issues/766
    <Box className={classes.table}>
      <MaterialTable
        title={title}
        columns={[{ title: "Name", field: "name" }]}
        data={resources}
        isLoading={loading}
        options={{
          search: true,
        }}
      />
    </Box>
  );
};

export default ResourceListView;
