import React from "react";

export interface iTreeNode {
  name: string;
  children?: iTreeNode[];
  isExpanded?: boolean;
}

export const TreeNode = ({
  name,
  indention,
}: {
  name: string;
  indention: 1 | 2 | 3;
}) => {
  return (
    <div style={{ marginLeft: indention * 10, cursor: "pointer" }}>{name}</div>
  );
};
