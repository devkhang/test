import Base from "./Base";

class Record extends Base {
  constructor() {
    super({
      url: "profile",
    });
  }

  async checkCode(params?: any) {
    const rs = await this.execute({
      url: `profiles/checkCode`,
      method: "get",
      params,
    });
    return rs;
  }

  async createInfo(data?: any, name?: string) {
    const rs = await this.execute({
      url: `profile/${name}`,
      method: "post",
      data,
    });
    return rs;
  }

  async getInfo(params?: any, name?: string) {
    const rs = await this.execute({
      url: `profile/${name}`,
      method: "get",
      params,
    });
    return rs;
  }

  async editInfo(id: string | number, data?: any, name?: string) {
    const rs = await this.execute({
      url: `profile/${name}/${id}`,
      method: "put",
      data,
    });
    return rs;
  }
}

export default new Record();
