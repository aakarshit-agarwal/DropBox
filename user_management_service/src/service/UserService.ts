import { randomUUID } from "crypto";
import { sign, JwtPayload } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";
import LoginUserRequest from '@dropbox/common_library/models/dto/LoginUserRequest';
import CreateUserRequest from '@dropbox/common_library/models/dto/CreateUserRequest';
import HttpError from '@dropbox/common_library/error/HttpError';
import Validation from '@dropbox/common_library/utils/Validation';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';
import UserRepository from "./../repository/UserRepository";

export default class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async createUser(createUserRequest: CreateUserRequest) {
        let salt = await genSalt(10);
        let newUser: UserModel = {
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

    public async getUser(id: string, authData: AuthDataModel) {
        if(!Validation.validateString(id)) {
            throw new HttpError(400, "Invalid userId input");
        }
        let userId = id;
        let result = await this.userRepository.getUser(userId);
        if(result == null) {
            throw new HttpError(400, "Invalid userId input");
        }
        if(result._id !== authData.jwtPayload.id || result.username !== authData.jwtPayload.username) {
            throw new HttpError(403, "Operation not allowed");
        }
        return result;
    }

    public async deleteUser(id: string, authData: AuthDataModel) {
        if(!Validation.validateString(id)) {
            throw new HttpError(400, "Invalid userId input");
        }
        let userId = id;
        let existingUser = await this.userRepository.getUser(userId);
        if(existingUser == null) {
            throw new HttpError(400, "Invalid userId input");
        }
        if(existingUser._id !== authData.jwtPayload.id || existingUser.username !== authData.jwtPayload.username) {
            throw new HttpError(403, "Operation not allowed");
        }
        await this.userRepository.deleteUser(userId);
    }

    public async loginUser(userData: LoginUserRequest) {
        if(!Validation.validateString(userData.username)) {
            throw new HttpError(400, "Invalid username input");
        }        
        if(!Validation.validateString(userData.password)) {
            throw new HttpError(400, "Invalid password input");
        }
        let user = await this.userRepository.getUserByUsername(userData.username?.trim());
        if(user == null) {
            throw new HttpError(400, "Invalid userId input");
        }
        if(!await compare(userData.password, user.password)) {
            throw new HttpError(400, "Invalid password input");
        }
        let jwtPayload: JwtPayload = {
            id: user._id,
            username: user.username
        };
        user.access_token = sign(
            jwtPayload,
            process.env.ACCESS_TOKEN_KET!,
            { expiresIn: '1d' }
        );
        await this.userRepository.saveUser(user);
        return { id: user._id, access_token: user.access_token };
    }

    public async logoutUser(authData: AuthDataModel) {
        let user = await this.userRepository.getUser(authData.jwtPayload.id);
        if(user == null) {
            throw new HttpError(400, "Invalid access token");
        }
        user.access_token = undefined;
        await this.userRepository.saveUser(user);
        return;
    }
}
