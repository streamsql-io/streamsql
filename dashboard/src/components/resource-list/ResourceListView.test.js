import React from "react";
// Necessary to get MaterialTable to work correctly.
import "jest-canvas-mock";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import produce from "immer";

import { ResourceListView, VersionSelector } from "./ResourceListView.js";

configure({ adapter: new Adapter() });

describe("ResourceListView", () => {
  it("passes through title", () => {
    const list = shallow(<ResourceListView title="test" title={"test"} />);
    expect(list.children().props().title).toBe("test");
  });

  it("sets resources to [] by default", () => {
    const list = shallow(<ResourceListView title="test" />);
    expect(list.children().props().data).toEqual([]);
  });

  it("passes through resources", () => {
    const list = shallow(
      <ResourceListView title="test" resources={[{ name: "abc" }]} />
    );
    expect(list.children().props().data).toEqual([{ name: "abc" }]);
  });

  it("makes resources mutable", () => {
    const immutData = produce([], (draft) => {
      draft.push(["abc"]);
    });
    const list = shallow(
      <ResourceListView title="test" resources={immutData} />
    );
    expect(Object.isFrozen(immutData)).toBe(true);
    expect(Object.isFrozen(list.children().props().data)).toBe(false);
  });

  it("sets isLoading when resources isn't set", () => {
    const list = shallow(<ResourceListView title="test" />);
    expect(list.children().props().isLoading).toEqual(true);
  });

  it("sets isLoading when loading", () => {
    const list = shallow(<ResourceListView title="test" loading={true} />);
    expect(list.children().props().isLoading).toEqual(true);
  });

  it("sets isLoading when failed", () => {
    const list = shallow(
      <ResourceListView title="test" loading={false} failed={true} />
    );
    expect(list.children().props().isLoading).toEqual(true);
  });

  describe("VersionSelector", () => {
    it("sets default active version", () => {
      const sel = shallow(<VersionSelector name="abc" versions={["1", "2"]} />);
      expect(sel.children().props().value).toBe("1");
    });

    it("onChange calls setVersion", () => {
      const onChange = jest.fn();
      const name = "abc";
      const clickVal = "2";
      const sel = shallow(
        <VersionSelector
          name={name}
          versions={["1", "2"]}
          setVersion={onChange}
        />
      );
      sel.children().prop("onChange")({ target: { value: clickVal } });
      expect(onChange).toHaveBeenCalledWith(name, clickVal);
    });
  });
});
