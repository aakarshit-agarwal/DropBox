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
import Logging from "@dropbox/common_library/logging/Logging";
import HttpRequest from "@dropbox/common_library/utils/HttpRequest";

export default class UserService {
    private logger: Logging;
    private userRepository: UserRepository;
    private eventPublisher: EventPublisher;

    constructor(logger: Logging, userRepository: UserRepository, eventPublisher: EventPublisher) {
        this.logger = logger;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    public async createUser(createUserRequest: CreateUserRequest) {
        this.logger.logDebug(`Calling createUser with createUserRequest: ${createUserRequest}`);

        // Validations
        if(!Validation.validateUsername(createUserRequest.username)) {
            throw new HttpError(400, "Invalid username");
        }
        if(!Validation.validatePassword(createUserRequest.password)) {
            throw new HttpError(400, "Invalid password");
        }
        if(await this.userRepository.getUserByUsername(createUserRequest.username)) {
            throw new HttpError(400, "Username already in use");
        }

        // Logic
        let salt = await genSalt(10);
        let newUserModel = new UserModel(randomUUID(), createUserRequest.username, 
            await hash(createUserRequest.password, salt), createUserRequest.name);
        let user = await this.userRepository.saveUser(newUserModel);
        this.logger.logInfo(`User created with Id: ${user._id}`);

        // Publishing Event
        this.eventPublisher.createUser(user);

        let result = {
            userId: user._id
        };
        this.logger.logDebug(`Returning createUser with result: ${result}`);
        return result;
    }

    public async getUser(id: string, authData: AuthDataModel) {
        this.logger.logDebug(`Calling getUser with id: ${id}, authData: ${authData}`);

        // Validations
        if(!Validation.validateUserId(id)) {
            throw new HttpError(400, "Invalid userId");
        }

        // Logic
        let user = await this.userRepository.getUser(id);
        if(!user) {
            throw new HttpError(404, "User not found");
        }

        // Access check
        if(user._id !== authData.jwtPayload.id) {
            throw new HttpError(403, "Not authorized to get this user");
        }

        let result = {
            User: {
                id: user._id,
                name: user.name,
                username: user.username,
                state: user.state    
            }
        };
        this.logger.logDebug(`Returning getUser with result: ${result}`);
        return result;
    }

    public async deleteUser(id: string, authData: AuthDataModel) {
        this.logger.logDebug(`Calling deleteUser with id: ${id}, authData: ${authData}`);

        // Validations
        if(!Validation.validateUserId(id)) {
            throw new HttpError(400, "Invalid userId");
        }

        let user = await this.userRepository.getUser(id);
        if(!user) {
            throw new HttpError(404, "User not found");
        }

        // Access Check
        if(user._id !== authData.jwtPayload.id) {
            throw new HttpError(403, "Operation not allowed");
        }
        await this.userRepository.deleteUser(id);
        this.logger.logInfo(`User deleted with Id: ${user._id}`);

        // Publishing Event
        this.eventPublisher.deleteUser(id);

        this.logger.logDebug(`Returning deleteUser`);
    }

    public async loginUser(userData: LoginUserRequest) {
        this.logger.logDebug(`Calling loginUser with userData: ${userData}`);

        // Validations
        if(!Validation.validateUsername(userData.username)) {
            throw new HttpError(400, "Invalid username");
        }        
        if(!Validation.validatePassword(userData.password)) {
            throw new HttpError(400, "Invalid password");
        }

        // Logic
        let user = await this.userRepository.getUserByUsername(userData.username);
        if(!user) {
            throw new HttpError(400, "User not found");
        }
        if(!await compare(userData.password, user.password)) {
            throw new HttpError(400, "Invalid credentials");
        }
        user.access_token = await this.createAccessToken(user);
        await this.userRepository.saveUser(user);
        this.logger.logInfo(`Login successfull [userId=${user._id}]`);
        
        let result = { 
            id: user._id, 
            access_token: user.access_token 
        };
        this.logger.logDebug(`Returning loginUser with result ${result}`);
        return result;
    }

    private async createAccessToken(user: UserModel) {
        this.logger.logDebug(`Calling createAccessToken with user: ${user}`);
        let url = `http://${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_HOST}:${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT}/auth/`;
        let response = await HttpRequest.post(url, user);
        let access_token = response.data.access_token;
        this.logger.logDebug(`Returning createAccessToken with result ${access_token}`);
        return access_token;
    }
}
