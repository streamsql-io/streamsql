import { combineReducers } from "redux";
import { navSectionsReducer } from "components/app";
import { resourceReducer, versionReducer } from "components/resource-list";

export default combineReducers({
  navSections: navSectionsReducer,
  resourceList: resourceReducer,
  selectedVersion: versionReducer,
});
