import Base from "./Base";
import _ from "lodash";

class Media extends Base {
  constructor() {
    super({
      url: "profiles",
    });
  }

  async import(categoryId: any, data: any) {
    return this.execute({
      url: `profiles/import?type=${categoryId}`,
      method: "post",
      data,
    });
  }
}
export default new Media();
