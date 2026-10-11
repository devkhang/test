import Base from "./Base";

class Dashboard extends Base {
  constructor() {
    super({
      url: "dashboard",
    });
  }

  async getTotalMeritoriousPerson() {
    return this.execute({
      url: `dashboard/count-ncc`,
      method: "get",
    });
  }

  async getTotalCompletedProfile() {
    return this.execute({
      url: `dashboard/count-profile-complete`,
      method: "get",
    });
  }

  async getTotalUnFinishedProfile() {
    return this.execute({
      url: `dashboard/count-profile-uncomplete`,
      method: "get",
    });
  }
  async getTotalAffiliatedUnit() {
    return this.execute({
      url: "dashboard/doet",
      method: "get",
    });
  }

  async getMonthlyAllowanceCost(year: string) {
    return this.execute({
      url: `dashboard/monthly-expenses/${year}`,
      method: "get",
    });
  }

  async getPeopleReceiveBenefit(year: string) {
    return this.execute({
      url: `dashboard/people-receiving-preferential/${year}`,
      method: "get",
    });
  }

  async getPaymentProgress(year: string) {
    return this.execute({
      url: `dashboard/payment-progress-provine/${year}`,
      method: "get",
    });
  }
}

export default new Dashboard();
