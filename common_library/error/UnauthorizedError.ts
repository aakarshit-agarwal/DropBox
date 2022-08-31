import HttpError from "./HttpError";

export default class UnauthorizedError implements HttpError {
    public name: string;
    public status: number;
    public message: string;
    public stack?: string;

    constructor(message?: string, status?: number, stack?: NodeJS.CallSite[]) {
        this.name = 'UnauthorizedError';
        this.status = status ?? 401;
        this.message = message ?? 'Unauthorized Error';
        this.stack = stack?.toString();
    }
}
