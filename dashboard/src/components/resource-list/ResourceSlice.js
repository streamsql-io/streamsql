import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Enum from "enum";

export const fetchResources = createAsyncThunk(
  "resourceList/fetchByType",
  async ({ api, type }, { signal }) => {
    const response = await api.fetchResources(type, signal);
    return response.data;
  },
  {
    condition: ({ api, type }, { getState }) => {
      const { resources, loading } = getState().resourceList[type];
      if (loading || resources) {
        return false;
      }
    },
  }
);

export const resourceTypes = new Enum([
  "DATA_SOURCE",
  "MATERIALIZED_VIEW",
  "FEATURE",
  "FEATURE_SET",
  "TRAINING_SET",
]);

const reduceFn = (map, type) => {
  map[type] = {};
  return map;
};
const reduceFnInitial = {};
export const initialState = resourceTypes.enums.reduce(
  reduceFn,
  reduceFnInitial
);

const resourceSlice = createSlice({
  name: "resourceList",
  // initialState is a map between each resource type to an empty object.
  initialState: initialState,
  extraReducers: {
    [fetchResources.pending]: (state, action) => {
      const type = action.meta.arg.type;
      const requestId = action.meta.requestId;
      state[type].resources = null;
      state[type].requestId = requestId;
      state[type].loading = true;
      state[type].failed = false;
    },
    [fetchResources.fulfilled]: (state, action) => {
      const type = action.meta.arg.type;
      const requestId = action.meta.requestId;
      if (requestId !== state[type].requestId) {
        return;
      }
      state[type].resources = action.payload;
      state[type].loading = false;
      state[type].failed = false;
    },
    [fetchResources.rejected]: (state, action) => {
      const type = action.meta.arg.type;
      const requestId = action.meta.requestId;
      if (requestId !== state[type].requestId) {
        return;
      }
      state[type].loading = false;
      state[type].failed = true;
    },
  },
});

export default resourceSlice.reducer;
