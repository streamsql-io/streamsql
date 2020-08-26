import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { fetchResources } from "./ResourceSlice.js";
import ResourceListView from "./ResourceListView.js";
import { setVersion } from "./VersionSlice.js";
import { toggleTag } from "./TagSlice.js";

export const makeSelectFilteredResources = (type) => {
  const selectResources = (state) => state.resourceList[type].resources;
  const selectTags = (state) => state.selectedTags[type];
  return createSelector(selectResources, selectTags, (resources, tags) => {
    // Resources is null or undefined when loading.
    if (!resources) {
      return null;
    }
    const numSelected = Object.keys(tags).length;
    // If no tags are active, then don't filter anything.
    if (numSelected === 0) {
      return resources;
    }
    return resources.filter((resource) => {
      const resTags = resource.tags || [];
      const numFound = resTags.filter((itemTag) => tags[itemTag]).length;
      return numFound === numSelected;
    });
  });
};

const makeMapStateToProps = (initState, initProps) => {
  const type = initProps.type;
  return (state) => {
    const selector = makeSelectFilteredResources(type);
    const item = state.resourceList[type];
    const activeVersions = state.selectedVersion[type];
    const activeTags = state.selectedTags[type];
    return {
      title: type,
      resources: selector(state),
      loading: item.loading,
      failed: item.failed,
      activeVersions: activeVersions,
      activeTags: activeTags,
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
    toggleTag: (tag) => {
      const { type } = initProps;
      dispatch(toggleTag({ type, tag }));
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
