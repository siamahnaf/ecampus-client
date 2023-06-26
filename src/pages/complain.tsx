import type { GetServerSideProps } from "next";
import { useState } from "react";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Lists from "@/Components/Complain/Lists";

//Context
import { PaginationContext, Variables, defaultVariable } from "@/Context/pagination.context";

//Urql
import { RequestPolicy } from "urql";
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_COMPLAIN_LIST } from "@/Urql/Query/Complain/complain.query";

const Section = () => {
    //State
    const [variables, setVariables] = useState<Variables>(defaultVariable);
    const [policy, setPolicy] = useState<RequestPolicy>("cache-and-network");

    return (
        <Layout main="complain" title="Complain">
            <PageHeader
                title="Complain"
                navs={["Dashboard", "Complain", "Complain List"]}
            />
            <PaginationContext.Provider value={{ variables, setVariables, policy, setPolicy }}>
                <Lists />
            </PaginationContext.Provider>
        </Layout >
    );
};

export default Section;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    //Urql
    const { client, ssrCache } = initUrqlClient();

    //Headers
    const fetchOptions = {
        headers: {
            cookie: ctx.req.headers.cookie as string,
            "user-agent": ctx.req.headers["user-agent"] as string,
            "x-forwarded-for": ctx.req.socket.remoteAddress as string
        }
    };

    //Queries
    const { data } = await client.query(
        GET_PROFILE, {}, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //--//
    if (!data || (data?.getProfile.role !== "principal")) {
        return { redirect: { destination: "/login", permanent: false } }
    };

    //--//
    await client.query(
        GET_COMPLAIN_LIST,
        { searchInput: defaultVariable }, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}