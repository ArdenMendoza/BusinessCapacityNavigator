import React, { useContext } from "react";
import { TreeNode } from "./components/TreeNode";
import { TreeView } from "./components/TreeView";
import { TreeViewContext } from "./context";
import { Application } from "./models";
import { numberWithCommaAndDecimal } from "./utils/numberUtils";

const getUnique = (dataArray: Application[], propName: string) =>
  Array.from(new Set(dataArray.map((item: any) => item[propName])));

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
  const [spendingLimits, setSpendingLimits] = React.useState({
    min: 0,
    max: 0,
  });

  const treeData: TreeNode[] = getUnique(applications, "BCAP1")
    .sort()
    .map((bcap1) => {
      const bcap1_apps = applications.filter((f) => f.BCAP1 === bcap1);
      return {
        id: bcap1,
        label: bcap1,
        children: getUnique(bcap1_apps, "BCAP2")
          .sort()
          .map((bcap2) => {
            const bcap2_apps = applications.filter((f) => f.BCAP2 === bcap2);
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

  React.useEffect(() => {
    setSpendingLimits({ min, max });
  }, [min, max]);

  return (
    <div style={{ display: "flex", gap: 5 }}>
      <div>
        <TreeView treeData={treeData} />
        <hr />
        <div>{"Filters"}</div>
        <label htmlFor="spending">{"Spending"}</label>
        <input
          type="range"
          name="spending"
          min={min}
          max={max}
          onChange={(val) =>
            setSpendingLimits({ min, max: parseInt(val.currentTarget.value) })
          }
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{`$ ${numberWithCommaAndDecimal(spendingLimits.min, 2)}`}</div>
          <div>{`$ ${numberWithCommaAndDecimal(spendingLimits.max, 2)}`}</div>
        </div>
      </div>
      <hr />
      <div style={{ flex: 1 }}></div>
    </div>
  );
};
