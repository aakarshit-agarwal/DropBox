import { randomUUID } from "crypto";
import { sign } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";
import CreateUserRequest from "./../dto/CreateUserRequest";
import HttpError from "./../error/HttpError";
import Validation from "@dropbox/common_library/middlewares/Validation";
import IUser from "./../model/IUser";
import UserRepository from "./../repository/UserRepository";

export default class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async createUser(createUserRequest: CreateUserRequest) {
        let salt = await genSalt(10);
        let newUser: IUser = {
            _id: randomUUID(),
            username: createUserRequest.username,
            name: createUserRequest.name,
            password: await hash(createUserRequest.password, salt)
        };
        if(await this.userRepository.getUserByUsername(newUser.username)) {
            throw new HttpError(400, "Username already in use");
        }
        let result = await this.userRepository.saveUser(newUser);
        return result;
    }

    public async getUser(id: string, authData: any) {
        if(!Validation.validateString(id)) {
            throw new HttpError(400, "Invalid userId input");
        }
        let userId = id;
        let result = await this.userRepository.getUser(userId);
        if(result == null) {
            throw new HttpError(400, "Invalid userId input");
        }
        if(result._id !== authData.id || result.username !== authData.username) {
            throw new HttpError(403, "Operation not allowed");
        }
        return result;
    }

    public async deleteUser(id: string, authData: any) {
        if(!Validation.validateString(id)) {
            throw new HttpError(400, "Invalid userId input");
        }
        let userId = id;
        let existingUser = await this.userRepository.getUser(userId);
        if(existingUser == null) {
            throw new HttpError(400, "Invalid userId input");
        }
        if(existingUser._id !== authData.id || existingUser.username !== authData.username) {
            throw new HttpError(403, "Operation not allowed");
        }
        await this.userRepository.deleteUser(userId);
    }

    public async loginUser(userData: IUser) {
        if(!Validation.validateString(userData.username)) {
            throw new HttpError(400, "Invalid username input");
        }        
        if(!Validation.validateString(userData.password)) {
            throw new HttpError(400, "Invalid password input");
        }
        let inputUser: IUser = {
            username: userData.username?.trim(),
            password: userData.password
        };
        let user = await this.userRepository.getUserByUsername(inputUser.username);
        if(user == null) {
            throw new HttpError(400, "Invalid userId input");
        }
        if(!await compare(inputUser.password, user.password)) {
            throw new HttpError(400, "Invalid password input2");
        }
        user.access_token = sign(
            { id: user._id, username: user.username },
            process.env.ACCESS_TOKEN_KET!,
            { expiresIn: '2h' }
        );
        await this.userRepository.saveUser(user);
        return { id: user._id, access_token: user.access_token };
    }

    public async logoutUser(authData: any) {
        let user = await this.userRepository.getUser(authData.id);
        if(user == null) {
            throw new HttpError(400, "Invalid access token");
        }
        user.access_token = undefined;
        await this.userRepository.saveUser(user);
        return;
    }
}
