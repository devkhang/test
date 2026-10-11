import Base from "./Base";

class Year extends Base {
  constructor() {
    super({
      url: "years",
    });
  }
}

export default new Year();
