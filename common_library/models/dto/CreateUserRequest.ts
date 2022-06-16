export default  class CreateUserRequest {
  public username: string;
  public name: string;
  public password: string;

  constructor(data: any) {
    this.username = data.username?.trim();
    this.name = data.name?.trim();
    this.password = data.password;
  }
}
