import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resourceTypes } from "api/resources";

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

const reduceFn = (map, type) => {
  map[type] = {};
  return map;
};
const reduceFnInitial = {};
export const initialState = Object.values(resourceTypes).reduce(
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
