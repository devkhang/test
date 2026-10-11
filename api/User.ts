import Base from "./Base";
import _ from "lodash";

class User extends Base {
  constructor() {
    super({
      url: "users",
    });
  }

  async checkUser(params: any) {
    const rs = await this.execute({
      url: `users/checkUsername`,
      method: "get",
      params,
    });

    return rs;
  }

  async import(data: any) {
    const rs = await this.execute({
      url: `users/import`,
      method: "post",
      data,
    });

    return rs;
  }

  async update(id: string, data?: any) {
    const rs = await this.execute({
      url: `users/${id}`,
      method: "put",
      data,
    });
    return rs;
  }

  async getProfile(id: string) {
    const rs = await this.execute({
      url: `users/${id}`,
      method: "get",
    });
    return rs;
  }
}

export default new User();
