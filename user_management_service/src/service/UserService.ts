import { randomUUID } from "crypto";
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
        let newUser: IUser = {
            _id: randomUUID(),
            username: createUserRequest.username,
            name: createUserRequest.name,
            password: createUserRequest.password
        };
        if(await this.userRepository.getUserByUsername(newUser.username)) {
            throw new HttpError(400, "Username already in use");
        }
        let result = await this.userRepository.createUser(newUser);
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

}
