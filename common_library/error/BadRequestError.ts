import HttpError from "./HttpError";

export default class BadRequestError implements HttpError {
    public name: string;
    public status: number;
    public message: string;
    public stack?: string;

    constructor(message?: string, status?: number, stack?: NodeJS.CallSite[]) {
        this.name = 'BadRequestError';
        this.status = status ?? 400;
        this.message = message ?? 'Bad Request Error';
        this.stack = stack?.toString();
    }
}
