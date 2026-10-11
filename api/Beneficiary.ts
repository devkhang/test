import Base from "./Base";

class Beneficiary extends Base {
  constructor() {
    super({
      url: "profile/infoBeneficiaries",
    });
  }
}

export default new Beneficiary();
