import { combineReducers } from "redux";
import navSectionsReducer from "components/nav/slice";
import { resourceReducer } from "components/resource-list";

export default combineReducers({
  navSections: navSectionsReducer,
  resourceList: resourceReducer,
});
