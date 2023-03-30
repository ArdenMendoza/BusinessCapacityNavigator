import React, { useContext } from "react";
import { TreeView } from "./components/TreeView";
import { SelectedNode, TreeViewContext } from "./context";
import { Application } from "./models";
import { numberWithCommaAndDecimal } from "./utils/numberUtils";

const getUnique = (dataArray: Application[], propName: string) =>
  Array.from(new Set(dataArray.map((item: any) => item[propName])));

export const BCapNavigator = () => {
  const {
    state: { applications, selectedNode },
  } = useContext(TreeViewContext);
  const { dispatch } = useContext(TreeViewContext);

  const { min, max } = React.useMemo(
    () => ({
      min: applications.map((m) => m.spend).sort()[0],
      max: applications
        .map((m) => m.spend)
        .sort()
        .reverse()[0],
    }),
    [applications]
  );
  const [queryFilter, setQueryFilter] = React.useState({
    min: 0,
    max: 0,
  });

  const filteredApps = React.useMemo(
    () =>
      applications.filter(
        (app: Application) =>
          app.spend >= queryFilter.min && app.spend <= queryFilter.max
      ),
    [applications, queryFilter]
  );

  const treeData = React.useMemo(
    () =>
      getUnique(filteredApps, "BCAP1")
        .sort()
        .map((bcap1) => {
          const bcap1_apps = filteredApps.filter((f) => f.BCAP1 === bcap1);
          return {
            id: bcap1,
            label: bcap1,
            onClick: () =>
              dispatch({
                type: "setSelectedNode",
                payload: new SelectedNode(1, bcap1),
              }),
            children: getUnique(bcap1_apps, "BCAP2")
              .sort()
              .map((bcap2) => {
                const bcap2_apps = filteredApps.filter(
                  (f) => f.BCAP2 === bcap2
                );
                return {
                  id: bcap2,
                  label: bcap2,
                  onClick: () =>
                    dispatch({
                      type: "setSelectedNode",
                      payload: new SelectedNode(2, bcap2),
                    }),
                  children: getUnique(bcap2_apps, "BCAP3")
                    .sort()
                    .map((bcap3) => {
                      const bcap3_apps = filteredApps.filter(
                        (f) => f.BCAP3 === bcap3
                      );

                      return {
                        id: bcap3,
                        label: bcap3,
                        onClick: () =>
                          dispatch({
                            type: "setSelectedNode",
                            payload: new SelectedNode(3, bcap3),
                          }),
                      };
                    }),
                };
              }),
          };
        }),
    [filteredApps, queryFilter]
  );

  const visibleApps = React.useMemo(() => {
    return applications.filter((f) => {
      switch (selectedNode.level) {
        case 1:
          return f.BCAP1 === selectedNode.nodeName;
        case 2:
          return f.BCAP2 === selectedNode.nodeName;
        case 3:
          return f.BCAP3 === selectedNode.nodeName;
      }
    });
  }, [applications, selectedNode]);

  React.useEffect(() => {
    setQueryFilter({ min, max });
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
            setQueryFilter({ min, max: parseInt(val.currentTarget.value) })
          }
          value={queryFilter.max}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{`$ ${numberWithCommaAndDecimal(queryFilter.min, 2)}`}</div>
          <div>{`$ ${numberWithCommaAndDecimal(queryFilter.max, 2)}`}</div>
        </div>
      </div>
      <div style={{ flex: 1, borderLeft: "1px solid #888", padding: 15 }}>
        {visibleApps
          ?.filter(
            (f) => f.spend >= queryFilter.min && f.spend <= queryFilter.max
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
