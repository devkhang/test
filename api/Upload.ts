import Base from "./Base";
class Upload extends Base {
  constructor() {
    super({
      url: "",
    });
  }

  async uploadFile(files?: any) {
    const data = new FormData();
    for (const key of Object.keys(files)) {
      data.append("file", files[key]);
    }
    const rs = await this.execute({
      url: "common/media/upload",
      method: "post",
      data,
    });
    return rs;
  }

  async getDetailFile(id?: any) {
    const rs = await this.execute({
      url: `profile/files/${id}`,
      method: "get",
    });
    return rs;
  }
}

export default new Upload();
