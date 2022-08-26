export default class Validation {

  public static validateAccessToken(access_token: string): boolean {
    return access_token !== undefined 
    && access_token.length > 0 
    && access_token.trim().length === access_token.length;
  }

  public static validateUserId(id: string): boolean {
    return id !== undefined 
    && id.length > 0 
    && id.trim().length === id.length;
  }

  public static validateUsername(username: string): boolean {
    return username !== undefined 
    && username.length > 0 
    && username.trim().length === username.length;
  }

  public static validatePassword(password: string): boolean {
    return password !== undefined 
    && password.length >= 8;
  }

  public static validateEmail(_email: string): boolean {
    return false;
  }

  public static validateString(input: string): boolean {
    if(input !== undefined && input.trim().length >= 0) {
        return true;
    } else {
        return false;
    }
  }
}
