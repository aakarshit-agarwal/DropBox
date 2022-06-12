import { Model } from "mongoose";
import IUser from "../model/IUser";
import UserManagementModel from "./model/model";

export default class UserRepository {

    public userModel: Model<IUser>;

    constructor() {
        this.userModel = new UserManagementModel().userModel;
    }

    public async saveUser(user: IUser): Promise<IUser> {
        let newUser = new this.userModel(user);
        return await newUser.save();
    }

    public async getUser(id: string): Promise<IUser | null>{
        return await this.userModel.findById(id);
    }

    public async deleteUser(id: string) {
        return await this.userModel.findByIdAndDelete(id);
    }

    public async getUserByUsername(username: string): Promise<IUser | null> {
        return await this.userModel.findOne({ username: username });
    }

}
