export default interface UserModel {
    _id: string,
    username: string,
    name?: string,
    password: string,
    access_token?: string
}
