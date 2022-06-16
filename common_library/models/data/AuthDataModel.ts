import { JwtPayload } from "jsonwebtoken";

export default class AuthDataModel {
    public jwtPayload: JwtPayload;
    public bearer_access_token: string;

    constructor(bearer_access_token: string, jwtPayload: JwtPayload) {
        this.jwtPayload = jwtPayload;
        this.bearer_access_token = bearer_access_token;
    }
}
