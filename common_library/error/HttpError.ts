export default interface HttpError extends Error {
    status: number;
    message: string;
    stack?: string
}
