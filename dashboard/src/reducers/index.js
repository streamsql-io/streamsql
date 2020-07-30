import { combineReducers } from "redux";
import { navSectionsReducer } from "components/app";
import { resourceReducer } from "components/resource-list";

export default combineReducers({
  navSections: navSectionsReducer,
  resourceList: resourceReducer,
});
