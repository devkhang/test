import Base from "./Base";
import { set, get, deleteLocal } from "src/hooks/useLocalStorage";
import jwt from "jwt-decode";
import _ from "lodash";

class Auth extends Base {
  constructor() {
    super({
      url: "auth",
    });
  }

  async login(username?: string, password?: string) {
    const rs = await this.execute({
      url: "auth/login",
      method: "post",
      data: {
        password: password,
        username: username,
      },
    });
    if (rs.success) {
      const token = _.get(rs, "data.token");
      set("token", token || "");
      set("user", jwt(token));
      set("avatar", _.get(get("user"), "avatar"));
    }
    return rs;
  }

  checkLogin(router: any) {
    const token = get("token");
    if (token) {
      const isExpire: any = jwt(token);
      if (isExpire.exp < Date.now() / 1000) {
        router.push("/login");
      }
      return true;
    } else {
      router.push("/login");
    }
  }

  logOut(router: any) {
    deleteLocal("token");
    deleteLocal("user");
    deleteLocal("avatar");
    deleteLocal("views");
    deleteLocal("infoDomain");
    deleteLocal("setHeader");

    router.push("/login");
  }

  async forgotPassword(data: any) {
    const rs = await this.execute({
      url: "auth/forgot-password",
      method: "post",
      data,
    });
    return rs;
  }

  async resetPassword(params: any) {
    return this.execute({
      url: "auth/reset-password",
      method: "get",
      params,
    });
  }
}

export default new Auth();
