import Base from "./Base";
import { set, get, deleteLocal } from "src/hooks/useLocalStorage";
import jwt from "jwt-decode";
import _ from "lodash";

class User extends Base {
  constructor() {
    super({
      url: "users",
    });
  }

  async login(username?: string, password?: string) {
    const rs = await this.execute({
      url: "auth/login",
      method: "post",
      data: {
        password: password || "12345678",
        username: username || "superadmin",
      },
      headers: { origin: "admin-dev.rcp.com.vn" },
    });

    if (rs.success) {
      const token = _.get(rs, "data.token");

      set("token", token || "");
      set("user", jwt(token));
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
    deleteLocal("views");

    router.push("/login");
  }

  async changePassword(old_password: any, new_password: any) {
    const rs = await this.execute({
      url: "profiles/change-password",
      method: "post",
      data: {
        old_password,
        new_password,
      },
    });
    return rs;
  }
}

export default new User();
