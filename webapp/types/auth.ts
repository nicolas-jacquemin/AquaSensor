import { APISuccessResponse } from "./api.js";

export type AuthResponse = APISuccessResponse<{
    token: string;
    refreshToken: string;
    expUTC: string;
    refreshExpUTC: string;
}>;
