import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchResources } from "./ResourceSlice.js";
import ResourceListView from "./ResourceListView.js";
import { setVersion } from "./VersionSlice.js";

const makeMapStateToProps = (initState, initProps) => {
  const type = initProps.type;
  return (state) => {
    const item = state.resourceList[type];
    const activeVersions = state.selectedVersion[type];
    return {
      title: type,
      resources: item.resources,
      loading: item.loading,
      failed: item.failed,
      activeVersions: activeVersions,
    };
  };
};

const makeMapDispatchToProps = (ignore, initProps) => {
  return (dispatch) => ({
    fetch: () => {
      const { type, api } = initProps;
      dispatch(fetchResources({ api, type }));
    },
    setVersion: (name, version) => {
      const { type } = initProps;
      dispatch(setVersion({ type, name, version }));
    },
  });
};

class ResourceList extends React.Component {
  componentDidMount() {
    this.props.fetch();
  }

  render() {
    // Only pass down props required for the view.
    const { api, fetch, type, ...viewProps } = this.props;
    return <ResourceListView {...viewProps} />;
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
