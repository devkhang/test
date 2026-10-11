import Base from "./Base";

class Setting extends Base {
  constructor() {
    super({
      url: "doets/setting",
    });
  }
}

export default new Setting();
