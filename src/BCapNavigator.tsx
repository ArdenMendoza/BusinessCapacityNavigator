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
    state: { applications, selectedApps },
  } = useContext(TreeViewContext);
  const { dispatch } = useContext(TreeViewContext);

  const { min, max } = React.useMemo(
    () => ({
      min: applications.map((m) => m.spend).sort()[0],
      max: applications.map((m) => m.spend).reverse()[0],
    }),
    [applications]
  );
  const [spendingFilter, setSpendingFilter] = React.useState({
    min: 0,
    max: 0,
  });

  const treeData: TreeNode[] = getUnique(
    applications.filter(
      (f) => f.spend >= spendingFilter.min && f.spend <= spendingFilter.max
    ),
    "BCAP1"
  )
    .sort()
    .map((bcap1) => {
      const bcap1_apps = applications.filter((f) => f.BCAP1 === bcap1);
      return {
        id: bcap1,
        label: bcap1,
        onClick: () =>
          dispatch({ type: "setSelectedApps", payload: bcap1_apps }),
        children: getUnique(bcap1_apps, "BCAP2")
          .sort()
          .map((bcap2) => {
            const bcap2_apps = applications.filter((f) => f.BCAP2 === bcap2);
            return {
              id: bcap2,
              label: bcap2,
              onClick: () =>
                dispatch({ type: "setSelectedApps", payload: bcap2_apps }),
              children: getUnique(bcap2_apps, "BCAP3")
                .sort()
                .map((bcap3) => {
                  const bcap3_apps = applications.filter(
                    (f) => f.BCAP3 === bcap3
                  );

                  return {
                    id: bcap3,
                    label: bcap3,
                    onClick: () =>
                      dispatch({
                        type: "setSelectedApps",
                        payload: bcap3_apps,
                      }),
                  };
                }),
            };
          }),
      };
    });

  React.useEffect(() => {
    setSpendingFilter({ min, max });
  }, [min, max]);

  return (
    <div style={{ display: "flex", gap: 5 }}>
      <div style={{ padding: "0px 10px", minWidth: 300 }}>
        <h2 style={{ marginTop: 0 }}>{"Navigation"}</h2>
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
            setSpendingFilter({ min, max: parseInt(val.currentTarget.value) })
          }
          value={spendingFilter.max}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{`$ ${numberWithCommaAndDecimal(spendingFilter.min, 2)}`}</div>
          <div>{`$ ${numberWithCommaAndDecimal(spendingFilter.max, 2)}`}</div>
        </div>
      </div>
      <div style={{ flex: 1, borderLeft: "1px solid #888", padding: 15 }}>
        {selectedApps
          ?.filter(
            (f) =>
              f.spend >= spendingFilter.min && f.spend <= spendingFilter.max
          )
          ?.map((m) => (
            <AppTile id={m.id} appName={m.name} spend={m.spend} />
          ))}
      </div>
    </div>
  );
};

const AppTile = ({
  id,
  appName,
  spend,
}: {
  id: string;
  appName: string;
  spend: number;
}) => {
  return (
    <div
      key={id}
      style={{
        border: "black solid 1px",
        padding: 10,
        margin: 10,
        float: "left",
        width: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: 0 }}>{appName}</h2>
      <h3>{`Total spend $ ${numberWithCommaAndDecimal(spend, 2)}`}</h3>
    </div>
  );
};
