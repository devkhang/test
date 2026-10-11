import Base from "./Base";
import _ from "lodash";

class Media extends Base {
  constructor() {
    super({
      url: "common/media/upload",
    });
  }
}

export default new Media();
