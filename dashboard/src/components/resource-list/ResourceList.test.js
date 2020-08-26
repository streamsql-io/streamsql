import React from "react";
import "jest-canvas-mock";
import ReduxWrapper from "components/redux/wrapper";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { newTestStore } from "components/redux/store";
import { resourceTypes } from "api/resources";
import ResourceList from "./ResourceList.js";

configure({ adapter: new Adapter() });

describe("ResourceList", () => {
  const dataType = resourceTypes["DATA_SOURCE"];
  const mockFn = jest.fn(() => wrapInPromise(["abc"]));
  const mockApi = {
    fetchResources: mockFn,
  };

  const component = mount(
    <ReduxWrapper store={newTestStore()}>
      <ResourceList api={mockApi} type={dataType} />
    </ReduxWrapper>
  );

  it("fetches resources on mount.", () => {
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0][0]).toEqual(dataType);
  });

  it("correctly maps inital props from state.", () => {
    const viewProps = component.find("ResourceListView").props();
    expect(viewProps).toMatchObject({
      activeVersions: {},
      title: dataType,
      resources: null,
      loading: true,
      failed: false,
    });
    const expKeys = [
      "activeTags",
      "activeVersions",
      "title",
      "resources",
      "loading",
      "failed",
      "setVersion",
      "toggleTag",
    ];
    expect(Object.keys(viewProps).sort()).toEqual(expKeys.sort());
  });
});
