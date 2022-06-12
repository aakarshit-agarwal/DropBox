import { randomUUID } from "crypto";
import { sign } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";
import CreateUserRequest from "./../dto/CreateUserRequest";
import HttpError from "./../error/HttpError";
import Validation from "./../middlewares/Validation";
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

    public async getUser(id: string) {
        if(!Validation.validateString(id)) {
            throw new HttpError(400, "Invalid userId input");
        }
        let userId = id;
        let result = await this.userRepository.getUser(userId);
        if(result == null) {
            throw new HttpError(400, "Invalid userId input");
        }
        return result;
    }

    public async deleteUser(id: string) {
        if(!Validation.validateString(id)) {
            throw new HttpError(400, "Invalid userId input");
        }
        let userId = id;
        let result = await this.userRepository.deleteUser(userId);
        if(result == null) {
            throw new HttpError(400, "Invalid userId input");
        } else {
            return null;
        }
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
            { id: user._id },
            process.env.ACCESS_TOKEN_KET!,
            { expiresIn: '2h' }
        );
        await this.userRepository.saveUser(user);
        return { id: user._id, access_token: user.access_token };
    }
}
