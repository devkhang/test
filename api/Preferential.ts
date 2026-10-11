import Base from "./Base";
class Preferential extends Base {
  constructor() {
    super({
      url: "preferentials",
    });
  }
  async showData(data?: any) {
    const rs = await this.execute({
      url: `preferentials/`,
      method: "put",
      data,
    });
    return rs;
  }
}

export default new Preferential();
