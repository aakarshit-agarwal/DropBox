import { randomUUID } from "crypto";
import { genSalt, hash, compare } from "bcrypt";
import LoginUserRequest from '@dropbox/common_library/models/dto/LoginUserRequest';
import CreateUserRequest from '@dropbox/common_library/models/dto/CreateUserRequest';
import Validation from '@dropbox/common_library/utils/Validation';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';
import UserRepository from "./../repository/UserRepository";
import EventPublisher from './../events/EventPublisher';
import Logging, {LogMethodArgsAndReturn} from "@dropbox/common_library/logging/Logging";
import HttpRequest from "@dropbox/common_library/utils/HttpRequest";
import NotFoundError from '@dropbox/common_library/error/NotFoundError';
import UnauthorizedError from '@dropbox/common_library/error/UnauthorizedError';
import BadRequestError from '@dropbox/common_library/error/BadRequestError';


export default class UserService {
    private logger: Logging;
    private userRepository: UserRepository;
    private eventPublisher: EventPublisher;

    constructor(logger: Logging, userRepository: UserRepository, eventPublisher: EventPublisher) {
        this.logger = logger;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
        this.logger.logInfo("Initializing service");
    }

    @LogMethodArgsAndReturn
    public async createUser(createUserRequest: CreateUserRequest) {
        // Validations
        if(!Validation.validateUsername(createUserRequest.username)) {
            throw new NotFoundError('Invalid username');
        }
        if(!Validation.validatePassword(createUserRequest.password)) {
            throw new UnauthorizedError("Invalid password");
        }
        if(await this.userRepository.getUserByUsername(createUserRequest.username)) {
            throw new BadRequestError("Username already in use");
        }

        // Logic
        let salt = await genSalt(10);
        let newUserModel = new UserModel(randomUUID(), createUserRequest.username, 
            await hash(createUserRequest.password, salt), createUserRequest.name);
        let user = await this.userRepository.saveUser(newUserModel);
        this.logger.logInfo(`User created with Id: ${user._id}`);

        // Publishing Event
        this.eventPublisher.createUser(user);

        return {
            userId: user._id
        };
    }

    @LogMethodArgsAndReturn
    public async getUser(id: string, authData: AuthDataModel) {
        // Validations
        if(!Validation.validateUserId(id)) {
            throw new BadRequestError();
        }

        // Logic
        let user = await this.userRepository.getUser(id);
        if(!user) {
            throw new NotFoundError("User not found");
        }

        // Access check
        if(user._id !== authData.jwtPayload.id) {
            throw new UnauthorizedError("Not authorized to get this user");
        }

        return {
            User: {
                id: user._id,
                name: user.name,
                username: user.username,
                state: user.state    
            }
        };
    }

    @LogMethodArgsAndReturn
    public async deleteUser(id: string, authData: AuthDataModel) {
        // Validations
        if(!Validation.validateUserId(id)) {
            throw new BadRequestError("Invalid userId");
        }

        let user = await this.userRepository.getUser(id);
        if(!user) {
            throw new NotFoundError("User not found");
        }

        // Access Check
        if(user._id !== authData.jwtPayload.id) {
            throw new UnauthorizedError("Operation not allowed");
        }

        // Logic
        await this.userRepository.deleteUser(id);
        this.logger.logInfo(`User deleted with Id: ${user._id}`);

        // Publishing Event
        this.eventPublisher.deleteUser(id);
    }

    @LogMethodArgsAndReturn
    public async loginUser(userData: LoginUserRequest) {
        // Validations
        if(!Validation.validateUsername(userData.username)) {
            throw new BadRequestError("Invalid username");
        }        
        if(!Validation.validatePassword(userData.password)) {
            throw new UnauthorizedError("Invalid password");
        }

        // Logic
        let user = await this.userRepository.getUserByUsername(userData.username);
        if(!user) {
            throw new NotFoundError("User not found");
        }
        if(!await compare(userData.password, user.password)) {
            throw new UnauthorizedError("Invalid credentials");
        }
        user.access_token = await this.createAccessToken(user);
        await this.userRepository.saveUser(user);
        this.logger.logInfo(`Login successfull [userId=${user._id}]`);
        
        return { 
            id: user._id, 
            access_token: user.access_token 
        };
    }

    @LogMethodArgsAndReturn
    public async logoutUser(authData: AuthDataModel) {
        return await this.invalidateAccessToken(authData.access_token);
    }

    @LogMethodArgsAndReturn
    private async createAccessToken(user: UserModel) {
        let url = `http://${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_HOST}:${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT}/auth/`;
        this.logger.logDebug(`HttpRequest with URL`, url);
        let response = await HttpRequest.post(url, user);
        this.logger.logDebug(`HttpRequest Response`, JSON.stringify(response.data));
        return response.data.result.access_token;
    }

    @LogMethodArgsAndReturn
    private async invalidateAccessToken(access_token: string) {
        let url = `http://${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_HOST}:${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT}/auth/`;
        this.logger.logDebug(`HttpRequest with URL`, url);
        let response = await HttpRequest.delete(url, {authorization: "Bearer " + access_token});
        this.logger.logDebug(`HttpRequest Response`, JSON.stringify(response.data));
        return response.data.status;
    }
}
