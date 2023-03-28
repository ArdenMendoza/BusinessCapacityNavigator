import { useReducer } from "react";
import { BCapNavigator } from "./BCapNavigator";
import { TreeViewContext, treeViewReducer, TreeViewState } from "./context";

function App() {
  const [state, dispatch] = useReducer(treeViewReducer, new TreeViewState());

  return (
    <TreeViewContext.Provider value={{ state, dispatch }}>
      <div>
        <h1>React Coding Exercise</h1>
      </div>
      <BCapNavigator />
    </TreeViewContext.Provider>
  );
}

export default App;
