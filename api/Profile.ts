import Base from "./Base";

class Profile extends Base {
  constructor() {
    super({
      url: "profiles",
    });
  }

  async putPrenferetial(id: any, data?: any) {
    const rs = await this.execute({
      url: `profiles/${id}/relations`,
      method: "put",
      data,
    });
    return rs;
  }

  async putInfoBeneficiaries(id: any, data?: any) {
    const rs = await this.execute({
      url: `profiles/${id}/relations`,
      method: "put",
      data,
    });
    return rs;
  }

  async updatePrefersForList(profileId: any, prefersId: any, data?: any) {
    const rs = await this.execute({
      url: `profiles/${profileId}/prefer/${prefersId}`,
      method: "post",
      data,
    });
    return rs;
  }
}

export default new Profile();
