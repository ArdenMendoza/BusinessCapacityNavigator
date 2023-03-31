import React, { useContext } from "react";
import { TreeViewContext } from "../../context";
import styles from "./index.module.css";
export type TreeNode = {
  id: number;
  label: string;
  children?: TreeNode[];
  onClick?: () => void;
};

export const TreeNode: React.FC<{ node: TreeNode; indention: number }> = ({
  node,
  indention,
}) => {
  const {
    state: { expandedNodes, selectedNode },
    dispatch,
  } = useContext(TreeViewContext);

  const isExpanded = expandedNodes.includes(node.id);

  const handleToggle = () => {
    if (isExpanded) {
      dispatch({ type: "collapseNode", payload: node.id });
    } else {
      dispatch({ type: "expandNode", payload: node.id });
    }
  };

  return (
    <div key={node.id} className={styles.mainContainer}>
      {node.children && (
        <button onClick={handleToggle}>{isExpanded ? "-" : "+"}</button>
      )}
      <span
        className={`${styles.nodeLabel} ${
          node.label === selectedNode.nodeName && styles.nodeLabelSelected
        }`}
        onClick={() => node.onClick && node.onClick()}
      >
        {node.label}
      </span>
      {node.children && isExpanded && (
        <div className={styles.treeContainer}>
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              indention={indention + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
