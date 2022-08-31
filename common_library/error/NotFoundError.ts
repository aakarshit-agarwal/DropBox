import HttpError from "./HttpError";

export default class NotFoundError implements HttpError {
    public name: string;
    public status: number = 404;
    public message: string = 'Not found Error';
    public stack?: string;

    constructor(message?: string, status?: number, stack?: NodeJS.CallSite[]) {
        this.name = 'NotFoundError';
        this.status = status ?? 404;
        this.message = message ?? 'Not found Error';
        this.stack = stack?.toString();
    }

}
