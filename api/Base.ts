import commons from "@vna/lib";

class Base extends commons.BaseApi {
  constructor(data: any) {
    super({
      ...data,
      timeout: 5000,
    });
  }
}

export default Base;
