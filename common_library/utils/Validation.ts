export default class Validation {
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
