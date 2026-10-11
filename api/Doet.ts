import Base from "./Base";
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

class Doet extends Base {
  constructor() {
    super({
      url: "doets",
    });
  }

  async getItems(token: string, params: any) {
    const rs = getData("doets", token, params);
    return rs;
  }
}

export default new Doet();
