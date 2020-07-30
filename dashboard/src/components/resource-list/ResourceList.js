import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchResources } from "./ResourceSlice.js";
import ResourceListView from "./ResourceListView.js";

const makeMapStateToProps = (initState, initProps) => {
  const type = initProps.type;
  return (state) => {
    const item = state.resourceList[type];
    return {
      title: type,
      resources: item.resources,
      loading: item.loading,
      failed: item.failed,
    };
  };
};

const makeMapDispatchToProps = (ignore, initProps) => {
  const type = initProps.type;
  const api = initProps.api;
  return (dispatch) => ({
    fetch: () => dispatch(fetchResources({ api: api, type: type })),
  });
};

class ResourceList extends React.Component {
  componentDidMount() {
    this.props.fetch();
  }

  render() {
    return <ResourceListView {...this.props} />;
  }
}

ResourceList.propTypes = {
  type: PropTypes.string.isRequired,
  api: PropTypes.object.isRequired,
  title: PropTypes.string,
  resources: PropTypes.array,
  loading: PropTypes.bool,
  failed: PropTypes.bool,
};

export default connect(
  makeMapStateToProps,
  makeMapDispatchToProps
)(ResourceList);
