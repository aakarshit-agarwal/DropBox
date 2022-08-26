import axios from 'axios';
import HttpError from '../error/HttpError';

export default class HttpRequest {
  public static async post(url: string, body: any): Promise<any> {
    await axios.post(url, body, {}).then((res: any) => {
      return res;
    }).catch((error: { message: any; }) => {
      console.log('Error:', error.message);
      throw new HttpError(500, "Dependency Service Exception");
    });
  }
  
  public static async get(url: string): Promise<any> {
    await axios.get(url, {}).then((res: any) => {
      return res;
    }).catch((error: { message: any; }) => {
      console.log('Error:', error.message);
      throw new HttpError(500, "Dependency Service Exception");
    });
  }
}
