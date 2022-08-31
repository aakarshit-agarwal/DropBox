import HttpError from "./HttpError";

export default class DependencyError implements HttpError {
    public name: string;
    public status: number;
    public message: string;
    public stack?: string;

    constructor(message?: string, status?: number, stack?: NodeJS.CallSite[]) {
        this.name = 'DependencyError';
        this.status = status ?? 500;
        this.message = message ?? 'Dependency Error';
        this.stack = stack?.toString();
    }
}
