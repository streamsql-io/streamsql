import React from "react";
// Necessary to get MaterialTable to work correctly.
import "jest-canvas-mock";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { ResourceList } from "./ResourceList.js";

configure({ adapter: new Adapter() });

describe("ResourceList", () => {
  const sources = shallow(<ResourceList title={"abc"} />);

  it("passes title to child prop", () => {
    expect(sources.children().props().title).toEqual("abc");
  });
});
