import { ApiService } from "services/api.service";

  export class AwsService {
    static readonly host = 'https://core-tenant-dev.vnaapi.com/';
  
    static upload = async (file: any): Promise<{ key: string; cdn: string; fileName: string; fileSize: number }> => {
      return await  ApiService.upload(`${AwsService.host}aws/upload/2eb1f40a-3875-48d6-b396-05a2561bd15f`, file);
    };
    
  }

  export function cdn(key?: string): string {
    if (!key) {
      return '';
    }
    if (key.startsWith('http')) {
      return key;
    }
    return `${process.env.NEXT_PUBLIC_CDN || 'https://static-dev.dggv.edu.vn/'}${key}`;
  }
  