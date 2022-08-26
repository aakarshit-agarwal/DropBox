import axios, { AxiosError } from 'axios';
import HttpError from '../error/HttpError';

export default class HttpRequest {
  public static async post(url: string, body: any): Promise<any> {
    let response = await axios.post(url, body, {})
    .catch((error: AxiosError) => {
      let errorCode: number = 500;
      let errorMessage: string = error.message;
      if(error.response) {
        errorCode = error.response.status;
        errorMessage = error.response.data as string;
      }
      throw new HttpError(errorCode, errorMessage);
    });
    return response;
  }
  
  public static async get(url: string, headers: any): Promise<any> {
    let response = await axios.get(url, {headers: headers})
    .catch((error: AxiosError) => {
      let errorCode: number = 500;
      let errorMessage: string = error.message;
      if(error.response) {
        errorCode = error.response.status;
        errorMessage = error.response.data as string;
      }
      throw new HttpError(errorCode, errorMessage);
    });
    return response;
  }

  public static async delete(url: string, headers: any): Promise<any> {
    let response = await axios.delete(url, {headers: headers})
    .catch((error: AxiosError) => {
      let errorCode: number = 500;
      let errorMessage: string = error.message;
      if(error.response) {
        errorCode = error.response.status;
        errorMessage = error.response.data as string;
      }
      throw new HttpError(errorCode, errorMessage);
    });
    return response;
  }
}
