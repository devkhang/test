import Base from "./Base";
import _ from "lodash";

class Insurance extends Base {
  constructor() {
    super({
      url: "insurance",
    });
  }
}

export default new Insurance();
