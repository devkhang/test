import Base from "./Base";
import _ from "lodash";

class Media extends Base {
  constructor() {
    super({
      url: "report/exports",
    });
  }
}
export default new Media();
