import { createContext } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch, UseFormGetValues } from "react-hook-form";

export interface Receivers {
    id: string;
    name: string;
    role: string;
    type: string;
}

export interface Inputs {
    title: string;
    details: string;
    image: string;
    sms: string;
    receivers: Receivers[];
}

interface Context {
    register?: UseFormRegister<Inputs>;
    errors?: FieldErrors<Inputs>;
    setValue?: UseFormSetValue<Inputs>;
    getValues?: UseFormGetValues<Inputs>;
    watch?: UseFormWatch<Inputs>;
}

export const NotificationContext = createContext<Context>({});