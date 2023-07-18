import type { GetServerSideProps } from "next";
import { useState } from "react";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Add from "@/Components/Examination/Conf/Add";
import List from "@/Components/Examination/Conf/List";

//Context
import { PaginationContext, Variables, defaultVariable } from "@/Context/pagination.context";

//Urql
import { RequestPolicy } from "urql";
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_CONF_LIST } from "@/Urql/Query/Examination/conf.query";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GET_ALL_SUBJECTS } from "@/Urql/Query/Academics/subject.query";
import { GET_ALL_EXAM } from "@/Urql/Query/Examination/exam.query";

const ExamConf = () => {
    //State
    const [variables, setVariables] = useState<Variables>(defaultVariable);
    const [policy, setPolicy] = useState<RequestPolicy>("cache-and-network");

    return (
        <Layout main="examination" sub="examConf" title="Exam Configuration">
            <PageHeader
                title="Examination"
                navs={["Dashboard", "Examination", "Exam Configuration"]}
            />
            <PaginationContext.Provider value={{ variables, setVariables, policy, setPolicy }}>
                <Add />
                <List />
            </PaginationContext.Provider>
        </Layout >
    );
};

export default ExamConf;

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
    if (!data) {
        return { redirect: { destination: "/login", permanent: false } }
    }

    //--//
    await client.query(
        GET_CONF_LIST,
        { searchInput: defaultVariable }, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();


    //--//
    await client.query(
        GET_ALL_EXAM,
        {}, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //--//
    await client.query(
        GET_ALL_CLASS,
        {}, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //--//
    await client.query(
        GET_ALL_SUBJECTS,
        {}, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}