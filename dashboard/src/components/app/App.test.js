import React from "react";
// Necessary to get MaterialTable to work correctly.
import "jest-canvas-mock";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { App, indexPath, parseContentProps, ThemeWrapper } from "./App.js";

configure({ adapter: new Adapter() });

describe("App", () => {
  const example_sections = [
    {
      name: "Resources",
      items: [
        { title: "Data Sources", icon: "file-import", path: "/sources" },
        { title: "Materialized Views", icon: "copy", path: "/views" },
        { title: "Features", icon: "file-code", path: "/features" },
        { title: "Feature Sets", icon: "sitemap", path: "/feature-sets" },
        { title: "Training Sets", icon: "archive", path: "/training-sets" },
      ],
    },
    {
      name: "Monitoring",
      items: [
        { title: "Metrics", icon: "chart-line", path: "/metrics" },
        { title: "Deployment", icon: "server", path: "/deployment" },
      ],
    },
    {
      name: "Admin",
      items: [
        { title: "Users", icon: "users", path: "/users" },
        { title: "Settings", icon: "cogs", path: "/settings" },
        { title: "Billing", icon: "wallet", path: "/billing" },
        {
          title: "Documentation",
          icon: "book",
          path: "https://docs.streamsql.io",
          external: true,
        },
        { title: "Help", icon: "question", path: "/help" },
      ],
    },
  ];

  it("hasn't changed", () => {
    expect(shallow(<App sections={example_sections} />)).toMatchSnapshot();
  });

  describe("Wrapper", () => {
    it("hasn't changed", () => {
      expect(
        shallow(
          <ThemeWrapper>
            <div>abc</div>
          </ThemeWrapper>
        )
      ).toMatchSnapshot();
    });
  });

  describe("parseContentProps", () => {
    it("parses correctly", () => {
      const expected = [
        { title: "Data Sources", path: "/sources" },
        { title: "Materialized Views", path: "/views" },
        { title: "Features", path: "/features" },
        { title: "Feature Sets", path: "/feature-sets" },
        { title: "Training Sets", path: "/training-sets" },
        { title: "Metrics", path: "/metrics" },
        { title: "Deployment", path: "/deployment" },
        { title: "Users", path: "/users" },
        { title: "Settings", path: "/settings" },
        { title: "Billing", path: "/billing" },
        { title: "Help", path: "/help" },
      ];
      const actual = parseContentProps(example_sections);
      expect(actual).toEqual(expected);
    });
  });

  describe("indexPath", () => {
    it("choses first path", () => {
      const content = parseContentProps(example_sections);
      expect(indexPath(content)).toEqual("/sources");
    });

    it("throws on empty content", () => {
      // When catching the error, the throwing call must be wrapped in a lambda:
      // See: https://jestjs.io/docs/en/expect.html#tothrowerror
      expect(() => indexPath([])).toThrow();
    });
  });
});
