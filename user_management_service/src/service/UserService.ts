import { randomUUID } from "crypto";
import { genSalt, hash, compare } from "bcrypt";
import LoginUserRequest from '@dropbox/common_library/models/dto/LoginUserRequest';
import CreateUserRequest from '@dropbox/common_library/models/dto/CreateUserRequest';
import HttpError from '@dropbox/common_library/error/HttpError';
import Validation from '@dropbox/common_library/utils/Validation';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';
import UserRepository from "./../repository/UserRepository";
import EventPublisher from './../events/EventPublisher';
import Logger from './../logger/Logger';
import axios from 'axios';

export default class UserService {
    private userRepository: UserRepository;
    private eventPublisher: EventPublisher;

    constructor() {
        this.userRepository = new UserRepository();
        this.eventPublisher = new EventPublisher();
    }

    public async createUser(createUserRequest: CreateUserRequest) {
        Logger.logInfo(`Calling createUser with createUserRequest: ${createUserRequest}`);
        let salt = await genSalt(10);
        let newUser = new UserModel(randomUUID(), createUserRequest.username, 
            await hash(createUserRequest.password, salt), createUserRequest.name);
        if(await this.userRepository.getUserByUsername(newUser.username)) {
            throw new HttpError(400, "Username already in use");
        }
        let result = await this.userRepository.saveUser(newUser);
        this.eventPublisher.createUser(result);
        Logger.logInfo(`Returning createUser with result: ${result}`);
        return result;
    }

    public async getUser(id: string, authData: AuthDataModel) {
        Logger.logInfo(`Calling getUser with id: ${id}, authData: ${authData}`);
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
        Logger.logInfo(`Returning getUser with result: ${result}`);
        return result;
    }

    public async deleteUser(id: string, authData: AuthDataModel) {
        Logger.logInfo(`Calling deleteUser with id: ${id}, authData: ${authData}`);
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
        this.eventPublisher.deleteUser(id);
        Logger.logInfo(`Returning deleteUser`);
    }

    public async loginUser(userData: LoginUserRequest) {
        Logger.logInfo(`Calling loginUser with userData: ${userData}`);
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
        user.access_token = await this.createAccessToken(user);
        await this.userRepository.saveUser(user);
        let result = { id: user._id, access_token: user.access_token };
        Logger.logInfo(`Returning loginUser with result ${result}`);
        return result;
    }

    private async createAccessToken(user: UserModel) {
        Logger.logInfo(`Calling createAccessToken with user: ${user}`);
        let access_token;
        axios.post('http://authentication_management_service:3005/auth/', user, {}).then(res => {
            access_token = res.data.access_token;
        }).catch(err => {
            console.log('Error: ', err.message);
            throw new HttpError(500, "Dependency Service Exception");
        });
        Logger.logInfo(`Returning createAccessToken with result ${access_token}`);
        return access_token;
    }
}
