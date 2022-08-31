import HttpError from "./HttpError";

export default class DatabaseError implements HttpError {
    public name: string;
    public status: number;
    public message: string;
    public stack?: string;

    constructor(message?: string, status?: number, stack?: NodeJS.CallSite[]) {
        this.name = 'DatabaseError';
        this.status = status ?? 500;
        this.message = message ?? 'Database Error';
        this.stack = stack?.toString();
    }
}
