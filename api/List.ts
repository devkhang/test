import Base from "./Base";

class List extends Base {
  constructor() {
    super({
      url: "lists",
    });
  }

  async checkCode(params?: any) {
    const rs = await this.execute({
      url: `lists/checkCode`,
      method: "get",
      params,
    });
    return rs;
  }

  async save(id: string | number, data?: any) {
    const rs = await this.execute({
      url: `lists/${id}/relations`,
      method: "put",
      data,
    });
    return rs;
  }
  async addProfiles(id: string | number, data?: any, subsidyForm?: number) {
    const rs = await this.execute({
      url: `lists/${id}/addProfiles?subsidyForm=${subsidyForm}`,
      method: "post",
      data,
    });
    return rs;
  }

  async checkExistUser(id: any) {
    return this.execute({
      url: `lists/user/${id}`,
      method: "get",
    });
  }
}
export default new List();
