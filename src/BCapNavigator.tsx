import React, { useContext } from "react";
import { TreeView } from "./components/TreeView";
import { TreeViewContext } from "./context";
import { numberWithCommaAndDecimal } from "./utils/numberUtils";

export const BCapNavigator = () => {
  const {
    state: { applications },
  } = useContext(TreeViewContext);

  const { min, max } = React.useMemo(
    () => ({
      min: applications.map((m) => m.spend).sort()[0],
      max: applications.map((m) => m.spend).reverse()[0],
    }),
    [applications]
  );
  const [spendingValue, setSpendingValue] = React.useState(0);

  React.useEffect(() => {
    setSpendingValue(min);
  }, [min]);

  return (
    <div>
      <div>
        <TreeView />
        <hr />
        <div>{"Filters"}</div>
        <label htmlFor="spending">{"Spending"}</label>
        <input
          type="range"
          name="spending"
          min={min}
          max={max}
          onChange={(val) =>
            setSpendingValue(parseInt(val.currentTarget.value))
          }
        />
        <div>{`$ ${numberWithCommaAndDecimal(spendingValue, 2)}`}</div>
      </div>
    </div>
  );
};
