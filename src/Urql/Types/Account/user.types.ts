import { Success } from "../success.types";

export interface UserLoginData {
    login: Success
}

export interface ResendCodeData {
    resendCode: Success
}

export interface VerifyPhoneData {
    verify: Success
}