import { combineReducers } from "redux";
import navSectionsReducer from "components/nav/slice";

export default combineReducers({
  navSections: navSectionsReducer,
});
