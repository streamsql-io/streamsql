import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";

import { TopBar, DrawerListLink } from "./Nav.js";

configure({ adapter: new Adapter() });

describe("Nav", () => {
  const classes = {
    navlink_active: "",
    appBar: "",
  };

  describe("TopBar", () => {
    it("hasn't changed", () => {
      const tree = renderer.create(<TopBar classes={classes} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });


  describe("DrawerListLink", () => {
    // These tests are run on both internal and external NavLinks
    const genericTests = (val) => {
      it("renders children", () => {
        expect(val.children()).toHaveLength(1);
        expect(val.first().text()).toEqual("abc");
      });
    };

    describe("internal", () => {
      const internal = shallow(
        <DrawerListLink path="/abc" classes={classes}>
          <div>abc</div>
        </DrawerListLink>
      );
      genericTests(internal);
      it("Sets path correctly", () => {
        expect(internal.props().to).toEqual("/abc");
      });
    });

    describe("external", () => {
      const external = shallow(
        <DrawerListLink
          path="https://streamsql.io"
          classes={classes}
          external={true}
        >
          <div>abc</div>
        </DrawerListLink>
      );
      genericTests(external);
      it("Sets href correctly", () => {
        expect(external.props().href).toEqual("https://streamsql.io");
      });
    });
  });
});
