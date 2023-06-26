import { createContext } from "react";

//Types
interface Context {
    verify: boolean;
    setVerify: Function;
}

export const LoginContext = createContext<Context>({
    verify: false,
    setVerify: () => false,
});