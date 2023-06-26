import { Success } from "../success.types";

export interface ProfileData {
    id: string;
    phone: string;
    name: string;
    image: string;
    role: string;
}
export interface GetProfileData {
    getProfile: ProfileData
}
export interface LogoutData {
    logout: Success
}

export interface UpdateProfileData {
    updateProfile: Success
}