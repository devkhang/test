import Base from "./Base";

class Category extends Base {
  constructor() {
    super({
      url: "categories",
    });
  }
}

export default new Category();
