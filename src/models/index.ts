export class Application {
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