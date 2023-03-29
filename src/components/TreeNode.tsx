import React, { useContext } from "react";
import { TreeViewContext } from "../context";
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
  const { state, dispatch } = useContext(TreeViewContext);

  const isExpanded = state.expandedNodes.includes(node.id);

  const handleToggle = () => {
    if (isExpanded) {
      dispatch({ type: "collapseNode", payload: node.id });
    } else {
      dispatch({ type: "expandNode", payload: node.id });
    }
  };

  return (
    <div key={node.id} style={{ margin: 5 }}>
      {node.children && (
        <button style={{ marginRight: 5 }} onClick={handleToggle}>
          {isExpanded ? "-" : "+"}
        </button>
      )}
      <span onClick={() => node.onClick && node.onClick()}>{node.label}</span>
      {node.children && isExpanded && (
        <div style={{ marginLeft: 30 }}>
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
