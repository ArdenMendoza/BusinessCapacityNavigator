import React, { useContext } from "react";
import { TreeView } from "../TreeView";
import { SelectedNode, TreeViewContext } from "../../context";
import { Application } from "../../models";
import { numberWithCommaAndDecimal } from "../../utils/numberUtils";
import styles from "./index.module.css";

const getUnique = (dataArray: Application[], propName: string) =>
  Array.from(new Set(dataArray.map((item: any) => item[propName])));

export const BCapNavigator = () => {
  const {
    state: { applications, selectedNode },
    dispatch,
  } = useContext(TreeViewContext);

  const [spendingFilters, setSpendingFilters] = React.useState({
    min: 0,
    max: 0,
  });

  // TreeView props
  const filteredTreeViewApps = React.useMemo(
    () =>
      applications.filter(
        (app: Application) =>
          app.spend >= spendingFilters.min && app.spend <= spendingFilters.max
      ),
    [applications, spendingFilters]
  );
  const treeData = React.useMemo(
    () =>
      getUnique(filteredTreeViewApps, "BCAP1")
        .sort()
        .map((bcap1) => {
          const bcap1_apps = filteredTreeViewApps.filter(
            (f) => f.BCAP1 === bcap1
          );
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
                const bcap2_apps = filteredTreeViewApps.filter(
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
    [filteredTreeViewApps]
  );

  // Filter props
  const { min, max } = React.useMemo(
    () => ({
      min: applications.map((m) => m.spend).sort((a, b) => a - b)[0],
      max: applications
        .map((m) => m.spend)
        .sort((a, b) => a - b)
        .reverse()[0],
    }),
    [applications]
  );
  React.useEffect(() => {
    setSpendingFilters({ min, max });
  }, [min, max]);

  const appTilesData = React.useMemo(
    () =>
      applications
        .filter((f) => {
          switch (selectedNode.level) {
            case 1:
              return f.BCAP1 === selectedNode.nodeName;
            case 2:
              return f.BCAP2 === selectedNode.nodeName;
            case 3:
              return f.BCAP3 === selectedNode.nodeName;
          }
        })
        .filter(
          (f) =>
            f.spend >= spendingFilters.min && f.spend <= spendingFilters.max
        ),
    [applications, selectedNode, spendingFilters]
  );

  return (
    <div className={styles.bcapNavigatorContainer}>
      <div className={styles.leftPanel}>
        <h2>{"Navigation"}</h2>
        <TreeView treeData={treeData} />
        <hr />
        <h3>{"Filters"}</h3>
        <label htmlFor="spending">{"Spending"}</label>
        <input
          type="range"
          name="spending"
          min={min}
          max={max}
          onChange={(val) =>
            setSpendingFilters({ min, max: parseInt(val.currentTarget.value) })
          }
          value={spendingFilters.max}
        />
        <div className={styles.inputLabelsContainer}>
          <div>{`$ ${numberWithCommaAndDecimal(spendingFilters.min, 2)}`}</div>
          <div>{`$ ${numberWithCommaAndDecimal(spendingFilters.max, 2)}`}</div>
        </div>
      </div>
      <div className={styles.mainPanel}>
        {appTilesData?.map((m) => (
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
    <div key={id} className={styles.appTile}>
      <h2>{appName}</h2>
      <h3>{`Total spend $ ${numberWithCommaAndDecimal(spend, 2)}`}</h3>
    </div>
  );
};
