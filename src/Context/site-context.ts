import { createContext } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues, Control, UseFormWatch } from "react-hook-form";

//Types
export interface MoreInfoTypes {
    title: string;
    value: string;
}
export interface Socials {
    icon: string;
    url: string;
}
export interface Inputs {
    icon: string;
    logo: string;
    name: string;
    slogan: string;
    url: string;
    metaTitle: string;
    ogTitle: string;
    metaDescription: string;
    ogDescription: string;
    metaTag: string;
    ogImage: string;
    ogUrl: string;
    email: string;
    phone: string;
    office: string;
    headOffice: string;
    moreInfo: MoreInfoTypes[];
    socials: Socials[];
}
interface Context {
    register?: UseFormRegister<Inputs>;
    errors?: FieldErrors<Inputs>;
    setValue?: UseFormSetValue<Inputs>;
    control?: Control<Inputs>;
    getValues?: UseFormGetValues<Inputs>;
    watch?: UseFormWatch<Inputs>
}

export const SiteContext = createContext<Context>({});