import React from "react";
import { iTreeNode, TreeNode } from "./TreeNode";

class Application {
  id: string;
  name: string;
  spend: number;
  BCAP1: string;
  BCAP2: string;
  BCAP3: string;
  constructor(data: any) {
    this.id = data["id"] ?? "";
    this.name = data["name"] ?? "";
    this.spend =
      typeof data["spend"] !== "string"
        ? data["spend"]
        : data["spend"] !== undefined
        ? Number(data["spend"])
        : 0;
    this.BCAP1 = data["BCAP1"];
    this.BCAP2 = data["BCAP2"];
    this.BCAP3 = data["BCAP3"];
  }
}

class Tree {
  constructor(public id: string, public name: string, public parent: string) {}
}

export const TreeView = () => {
  const [data, setData] = React.useState<Application[]>([]);
  React.useEffect(() => {
    fetch("/data")
      .then((res) => res.json())
      .then((data) => setData(data.map((m: any) => new Application(m))));
  }, []);

  const treeData: iTreeNode[] = React.useMemo(() => {
    const getUnique = (dataArray: Application[], propName: string) =>
      Array.from(new Set(dataArray.map((item: any) => item[propName])));

    return (
      getUnique(data, "BCAP1")
        .sort()
        .map((bcap1) => {
          const bcap1_apps = data.filter((f) => f.BCAP1 === bcap1);
          return {
            name: bcap1,
            children: getUnique(bcap1_apps, "BCAP2").map((bcap2) => {
              const bcap2_apps = data.filter((f) => f.BCAP2 === bcap2);
              return {
                name: bcap2,
                children: getUnique(bcap2_apps, "BCAP3").map((bcap3) => {
                  const bcap3_apps = data.filter((f) => f.BCAP3 === bcap3);
                  return {
                    name: bcap3,
                  };
                }),
              };
            }),
          };
        })
    );
  }, [data]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        {treeData.map((bcap1) => (
          <>
            <TreeNode name={bcap1.name} indention={1} />
            {bcap1.children?.map((bcap2) => (
              <>
                <TreeNode name={bcap2.name} indention={2} />
                {bcap2.children?.map((bcap3) => (
                  <>
                    <TreeNode name={bcap3.name} indention={3} />
                  </>
                ))}
              </>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};
