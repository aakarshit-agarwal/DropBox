import BaseModel from './BaseModel';
import UserStateModel from './UserStateModel';

export default class UserModel extends BaseModel {
    public username: string;
    public password: string;
    public name?: string;
    public state: UserStateModel = UserStateModel.ACTIVE;

    constructor(
        _id: string, username: string, password: string, name?: string, 
        createdAt?: Date, createdBy?: string, updatedAt?: Date, updatedBy?: string
    ) {
        super(_id, createdAt, createdBy, updatedAt, updatedBy);
        this.username = username;
        this.password = password;
        this.name = name;
    }
}
