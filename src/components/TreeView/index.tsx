import React from "react";
import { useContext } from "react";
import { TreeViewContext } from "../../context";
import { Application } from "../../models";
import { TreeNode } from "../TreeNode/index";
import styles from "./index.module.css";

export const TreeView = ({ treeData }: { treeData: TreeNode[] }) => {
  const { dispatch } = useContext(TreeViewContext);

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

  return (
    <div key={"treeView"} className={styles.treeViewContainer}>
      {treeData.map((bcap1) => (
        <TreeNode key={bcap1.id} node={bcap1} indention={1} />
      ))}
    </div>
  );
};
