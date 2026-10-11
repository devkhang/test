import Base from "./Base";
import _ from "lodash";

class Role extends Base {
  constructor() {
    super({
      url: "roles",
    });
  }
}

export default new Role();
