import React from "react";
// Necessary to get MaterialTable to work correctly.
import "jest-canvas-mock";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { App } from "./App.js";

configure({ adapter: new Adapter() });

describe("App", () => {
  it("hasn't changed", () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });
});
