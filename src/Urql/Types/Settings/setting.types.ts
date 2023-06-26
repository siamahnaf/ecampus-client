//Types
import { Inputs } from "@/Context/site-context";
import { Success } from "../success.types";

export interface AddSettingData {
    addSettings: Success
}

export interface GetSettingsData {
    getSettings: Inputs
}