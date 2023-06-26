import { createContext, Dispatch, SetStateAction } from "react";
import { RequestPolicy } from "urql";

export const defaultVariable = {
    name: "",
    id: "",
    class: "",
    shift: "",
    section: "",
    group: "",
    limit: 10,
    page: 1
}

//Types
export interface Variables {
    name: string;
    id: string;
    class: string;
    shift: string;
    section: string;
    group: string;
    limit: number;
    page: number;
}
interface Context {
    variables: Variables;
    setVariables?: Dispatch<SetStateAction<Variables>>;
    policy: RequestPolicy;
    setPolicy?: Dispatch<SetStateAction<RequestPolicy>>;
}

export const PaginationContext = createContext<Context>({
    variables: defaultVariable,
    policy: "cache-and-network"
});