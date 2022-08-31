// Package Imports
import {inject, injectable} from "inversify";
import "reflect-metadata";

// Common Library Imports
import UserModel from "@dropbox/common_library/models/data/UserModel";
import MongoUserModel from "@dropbox/common_library/models/mongo/MongoUserModel";
import Logging, {LogMethodArgsAndReturn} from "@dropbox/common_library/logging/Logging";

// Local Imports
import DependencyTypes from '../DependencyTypes';

@injectable()
export default class UserRepository {
    private logger: Logging;

    constructor(
        @inject(DependencyTypes.Logger) logger: Logging
    ) {
        this.logger = logger;
    }

    @LogMethodArgsAndReturn
    public async saveUser(user: UserModel): Promise<UserModel> {
        let newUser = new MongoUserModel.userModel(user);
        return await newUser.save();
    }

    public async getUser(id: string): Promise<UserModel | null>{
        return await MongoUserModel.userModel.findById(id);
    }

    @LogMethodArgsAndReturn
    public async deleteUser(id: string) {
        return await MongoUserModel.userModel.findByIdAndDelete(id);
    }

    @LogMethodArgsAndReturn
    public async getUserByUsername(username: string): Promise<UserModel | null> {
        return await MongoUserModel.userModel.findOne({ username: username });
    }
}
