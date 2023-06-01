export type APISuccessResponse<T> = {
    request: string;
    data: T;
    status: number;
}