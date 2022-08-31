import HttpError from "./HttpError";

export default class NotImplementedError implements HttpError {
    public name: string;
    public status: number = 501;
    public message: string = 'Not Implemented Error';
    public stack?: string;

    constructor(message?: string, status?: number, stack?: NodeJS.CallSite[]) {
        this.name = 'NotImplementedError';
        this.status = status ?? 501;
        this.message = message ?? 'Not Implemented Error';
        this.stack = stack?.toString();
    }

}
