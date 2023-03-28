import React from "react";
import { useContext } from "react";
import { TreeViewContext } from "../context";
import { Application } from "../models";
import { TreeNode } from "./TreeNode";

const getUnique = (dataArray: Application[], propName: string) =>
  Array.from(new Set(dataArray.map((item: any) => item[propName])));

export const TreeView = () => {
  const { state, dispatch } = useContext(TreeViewContext);

  React.useEffect(() => {
    fetch("/data")
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "setApplications",
          payload: data.map((m: any) => new Application(m)),
        })
      );
  }, []);

  const treeData: TreeNode[] = getUnique(state.applications, "BCAP1")
    .sort()
    .map((bcap1) => {
      const bcap1_apps = state.applications.filter((f) => f.BCAP1 === bcap1);
      return {
        id: bcap1,
        label: bcap1,
        children: getUnique(bcap1_apps, "BCAP2")
          .sort()
          .map((bcap2) => {
            const bcap2_apps = state.applications.filter(
              (f) => f.BCAP2 === bcap2
            );
            return {
              id: bcap2,
              label: bcap2,
              children: getUnique(bcap2_apps, "BCAP3")
                .sort()
                .map((bcap3) => {
                  return {
                    id: bcap3,
                    label: bcap3,
                  };
                }),
            };
          }),
      };
    });

  return (
    <div key={"treeView"} style={{ display: "flex", flexDirection: "column" }}>
      {treeData.map((bcap1) => (
        <TreeNode key={bcap1.id} node={bcap1} indention={1} />
      ))}
    </div>
  );
};
