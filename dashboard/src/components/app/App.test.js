import React from "react";
// Necessary to get MaterialTable to work correctly.
import "jest-canvas-mock";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { App, parseContentProps, Wrapper } from "./App.js";

configure({ adapter: new Adapter() });

describe("App", () => {
  it("hasn't changed", () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });

  describe("Wrapper", () => {
    it("hasn't changed", () => {
      expect(
        shallow(
          <Wrapper>
            <div>abc</div>
          </Wrapper>
        )
      ).toMatchSnapshot();
    });
  });

  describe("parseContentProps", () => {
    const example_sections = [
      {
        name: "Resources",
        items: [
          { title: "Data Sources", icon: "file-import", path: "/sources" },
          { title: "Features", icon: "file-code", path: "/features" },
        ],
      },
      {
        name: "Monitoring",
        items: [],
      },
      {
        name: "Admin",
        items: [
          { title: "Users", icon: "users", path: "/users" },
          {
            title: "Documentation",
            icon: "book",
            path: "https://docs.streamsql.io",
            external: true,
          },
        ],
      },
    ];

    it("parses correctly", () => {
      const expected = [
        { title: "Data Sources", path: "/sources" },
        { title: "Features", path: "/features" },
        { title: "Users", path: "/users" },
      ];
      const actual = parseContentProps(example_sections);
      expect(actual).toEqual(expected);
    });
  });
});
