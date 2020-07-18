import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";

import { DrawerLists, DrawerList, DrawerListLink, Nav, TopBar } from "./Nav.js";

configure({ adapter: new Adapter() });

describe("Nav", () => {
  const classes = {
    navlink_active: "",
    appBar: "",
  };

  it("hasn't changed", () => {
    const tree = renderer
      .create(
        <Nav>
          <div>abc</div>
          <div>def</div>
        </Nav>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("TopBar", () => {
    it("hasn't changed", () => {
      const tree = renderer.create(<TopBar classes={classes} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("DrawerLists", () => {
    const drawerLists = shallow(
      <DrawerLists classes={classes} sections={[{}, {}, {}]} />
    );

    it("renders sections", () => {
      expect(drawerLists.find("DrawerList")).toHaveLength(3);
    });

    it("prepends divider", () => {
      expect(drawerLists).toHaveLength(6);
      for (var i of [0, 2, 4]) {
        expect(drawerLists.at(i).name()).toMatch(/Divider/);
      }
    });
  });

  describe("DrawerList", () => {
    const items = [
      { text: "Users", icon: "users", path: "/users" },
      { text: "Settings", icon: "cogs", path: "/settings" },
      { text: "Billing", icon: "wallet", path: "/billing" },
      {
        text: "Documentation",
        icon: "book",
        path: "https://docs.streamsql.io",
        external: true,
      },
      { text: "Help", icon: "question", path: "/help" },
    ];
    const name = "Test List";
    const drawerList = shallow(
      <DrawerList classes={classes} name={name} items={items} />
    );
    it("renders header", () => {
      const header = drawerList.children().first();
      expect(header.text()).toEqual(name);
      // Material-UI wraps ListSubheader to add styles, so we use a regex.
      expect(header.name()).toMatch(/ListSubheader/);
    });

    it("renders items", () => {
      // Ignore the header
      const renderedItems = drawerList.children().slice(1);
      expect(renderedItems).toHaveLength(items.length);
      renderedItems.forEach((node) => {
        expect(node.name()).toEqual("DrawerListLink");
      });
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
