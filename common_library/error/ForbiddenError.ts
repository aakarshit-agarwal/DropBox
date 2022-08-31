import HttpError from "./HttpError";

export default class ForbiddenError implements HttpError {
    public name: string;
    public status: number;
    public message: string;
    public stack?: string;

    constructor(message?: string, status?: number, stack?: NodeJS.CallSite[]) {
        this.name = 'ForbiddenError';
        this.status = status ?? 403;
        this.message = message ?? 'Forbidden Error';
        this.stack = stack?.toString();
    }
}
