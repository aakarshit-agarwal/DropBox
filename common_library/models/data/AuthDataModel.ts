import { JwtPayload } from "jsonwebtoken";

export default class AuthDataModel {
    public jwtPayload: JwtPayload;
    public access_token: string;

    constructor(access_token: string, jwtPayload: JwtPayload) {
        this.jwtPayload = jwtPayload;
        this.access_token = access_token;
    }
}
