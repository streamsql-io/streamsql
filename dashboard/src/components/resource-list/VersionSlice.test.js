import { default as reducer, setVersion } from "./VersionSlice.js";
import { resourceTypes } from "api/resources";

describe("VersionSlice", () => {
  it("sets version", () => {
    const type = resourceTypes["DATA_SOURCE"];
    const name = "abc";
    const version = "v1";
    const payload = { type, name, version };
    const action = setVersion(payload);
    const newState = reducer(undefined, action);
    expect(newState).toMatchObject({ [type]: { [name]: version } });
  });
});
