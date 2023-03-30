import { createContext } from "react";
import { TreeNode } from "../components/TreeNode";
import { Application } from "../models";

export class SelectedNode {
  constructor(public level?: 1 | 2 | 3, public nodeName?: string) {}
}

export class TreeViewState {
  applications: Application[];
  expandedNodes: number[];
  selectedApps?: Application[];
  selectedNode: SelectedNode;
  constructor() {
    this.applications = [];
    this.expandedNodes = [];
    this.selectedNode = {};
  }
}
type TreeViewAction =
  | { type: "expandNode"; payload: number }
  | { type: "collapseNode"; payload: number }
  | { type: "setApplications"; payload: Application[] }
  | { type: "setSelectedNode"; payload: SelectedNode };

export const treeViewReducer = (
  state: TreeViewState,
  action: TreeViewAction
): TreeViewState => {
  switch (action.type) {
    case "expandNode":
      return {
        ...state,
        expandedNodes: [...state.expandedNodes, action.payload],
      };
    case "collapseNode":
      return {
        ...state,
        expandedNodes: state.expandedNodes.filter(
          (nodeId) => nodeId !== action.payload
        ),
      };
    case "setApplications":
      return {
        ...state,
        applications: action.payload,
      };
    case "setSelectedNode":
      return {
        ...state,
        selectedNode: action.payload,
      };
    default:
      return state;
  }
};

type TreeViewContextType = {
  state: TreeViewState;
  dispatch: React.Dispatch<TreeViewAction>;
};

export const TreeViewContext = createContext<TreeViewContextType>({
  state: new TreeViewState(),
  dispatch: () => {},
});
