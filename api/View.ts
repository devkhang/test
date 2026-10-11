import Base from "./Base";
import _ from "lodash";
import axios from "axios";

export async function getData(path, token, params) {
  const input: any = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  params && (input.params = params);

  return await axios
    .get(process.env.apiUrl + path, input)
    .then((response) => {
      return response;
    })
    .catch((errors) => errors);
}

class View extends Base {
  constructor() {
    super({
      url: "views",
    });
  }

  async getItems(token: string, params: any) {
    const rs = await getData("views", token, params);
    return rs;
  }
}

export default new View();
