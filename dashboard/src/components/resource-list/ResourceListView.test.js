import React from "react";
// Necessary to get MaterialTable to work correctly.
import "jest-canvas-mock";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { ResourceListView } from "./ResourceListView.js";

configure({ adapter: new Adapter() });

describe("ResourceListView", () => {
  const sources = shallow(<ResourceListView title={"abc"} />);

  it("passes title to child prop", () => {
    expect(sources.children().props().title).toEqual("abc");
  });
});
