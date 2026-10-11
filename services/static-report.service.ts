import { ApiService } from "./api.service";

export class StaticReportService {
  static readonly host = 'https://core-dgt-dev.vnaapi.com/';

  static generateKey = async (data: any): Promise<string> => {
    return await ApiService.post(`${StaticReportService.host}static-report/generate-key`, data);
  };

  static upload = async (key: string, file: File): Promise<void> => {
    return await ApiService.upload(`${StaticReportService.host}static-report/upload/${key}`, file);
  };

  static get = async (key: string): Promise<{file?: { cdn?: string }}> => {
    return await ApiService.get(`${StaticReportService.host}static-report/${key}`);
  };
}
