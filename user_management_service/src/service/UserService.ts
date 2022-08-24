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
import axios from 'axios';
import Logging from "@dropbox/common_library/logging/Logging";

export default class UserService {
    private userRepository: UserRepository;
    private eventPublisher: EventPublisher;
    private logger: Logging;

    constructor(applicationContext: any) {
        this.logger = applicationContext.logger;
        this.userRepository = new UserRepository(applicationContext);
        this.eventPublisher = new EventPublisher(applicationContext);
    }

    public async createUser(createUserRequest: CreateUserRequest) {
        this.logger.logInfo(`Calling createUser with createUserRequest: ${createUserRequest}`);
        let salt = await genSalt(10);
        let newUser = new UserModel(randomUUID(), createUserRequest.username, 
            await hash(createUserRequest.password, salt), createUserRequest.name);
        if(await this.userRepository.getUserByUsername(newUser.username)) {
            throw new HttpError(400, "Username already in use");
        }
        let result = await this.userRepository.saveUser(newUser);
        this.eventPublisher.createUser(result);
        this.logger.logInfo(`Returning createUser with result: ${result}`);
        return result;
    }

    public async getUser(id: string, authData: AuthDataModel) {
        this.logger.logInfo(`Calling getUser with id: ${id}, authData: ${authData}`);
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
        this.logger.logInfo(`Returning getUser with result: ${result}`);
        return result;
    }

    public async deleteUser(id: string, authData: AuthDataModel) {
        this.logger.logInfo(`Calling deleteUser with id: ${id}, authData: ${authData}`);
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
        this.logger.logInfo(`Returning deleteUser`);
    }

    public async loginUser(userData: LoginUserRequest) {
        this.logger.logInfo(`Calling loginUser with userData: ${userData}`);
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
        this.logger.logInfo(`Returning loginUser with result ${result}`);
        return result;
    }

    private async createAccessToken(user: UserModel) {
        this.logger.logInfo(`Calling createAccessToken with user: ${user}`);
        let access_token;
        let url = `http://${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_HOST}:${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT}/auth/`;
        axios.post(url, user, {}).then(res => {
            access_token = res.data.access_token;
        }).catch(err => {
            console.log('Error: ', err.message);
            throw new HttpError(500, "Dependency Service Exception");
        });
        this.logger.logInfo(`Returning createAccessToken with result ${access_token}`);
        return access_token;
    }
}
