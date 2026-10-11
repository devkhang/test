import Base from "./Base";

class BurialFee extends Base {
  constructor() {
    super({
      url: "burial",
    });
  }
}

export default new BurialFee();
