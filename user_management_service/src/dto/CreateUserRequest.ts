import HttpError from "./../error/HttpError";
import Validation from "./../middlewares/Validation";

 
export default  class CreateUserRequest {
  public username: string;
  public name: string;
  public password: string;

  constructor(data: any) {
    this.username = data.username?.trim();
    this.name = data.name?.trim();
    this.password = data.password;

    this.validateData();
  }

  private validateData() {
    if(!Validation.validateString(this.username)) {
      throw new HttpError(400, "Invalid username input");
    }
    if(!Validation.validateString(this.password)) {
      throw new HttpError(400, "Invalid password input");
    }
  }
}
