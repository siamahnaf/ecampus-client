import type { GetServerSideProps } from "next";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

//Components
import Form from "@/Components/Login/Form";
import Verify from "@/Components/Login/Verify";

//Context
import { LoginContext } from "@/Context/login-context";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";

const Login = () => {
    //Initialize Hook
    const router = useRouter();

    //State
    const [verify, setVerify] = useState<boolean>(router.query.verify === "true" ? true : false);

    return (
        <div className="xxl:container xxl:mx-auto">
            <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-8">
                    <Image src="/images/login-bg.svg" width={1351} height={988} alt="background-vector" style={{ width: "100%", height: "100vh", objectFit: "cover", objectPosition: "center" }} priority />
                </div>
                <div className="col-span-4">
                    <LoginContext.Provider value={{ verify, setVerify }}>
                        {verify ? (<Verify />) : (<Form />)}
                    </LoginContext.Provider>
                </div>
            </div>
        </div>
    );
};
export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    //Urql
    const { client, ssrCache } = initUrqlClient();

    //Headers
    const fetchOptions = {
        headers: {
            cookie: ctx.req.headers.cookie as string,
            "user-agent": ctx.req.headers["user-agent"] as string,
            "x-forwarded-for": ctx.req.socket?.remoteAddress as string
        }
    };

    //Queries
    const { data } = await client.query(
        GET_PROFILE, {}, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //--//
    if (data) {
        return { redirect: { destination: "/", permanent: false } }
    }

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}