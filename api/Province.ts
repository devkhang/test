import Base from "./Base";
import _ from "lodash";

class Province extends Base {
  constructor() {
    super({
      url: "province",
    });
  }

  async getDistrict(provinceId: any) {
    const rs = await this.execute({
      url: `province/${provinceId}/district`,
      method: "get",
    });

    return rs;
  }

  async getWard(districtId: any) {
    const rs = await this.execute({
      url: `province/${districtId}/ward`,
      method: "get",
    });

    return rs;
  }
}

export default new Province();
