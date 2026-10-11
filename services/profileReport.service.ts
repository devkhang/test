import axios from "axios";

export class ProfileReportService {
  static readonly host = "https://api.rcp.com.vn/api/v1/";

  static getReport = async (type: string, token: string) => {
    const res =  await axios({
      url: `https://api.rcp.com.vn/api/v1/profiles/${type}`,
      method: "GET",
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });
   return res
  };
}
