import type { GetServerSideProps } from "next";
import { useState } from "react";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Add from "@/Components/Examination/AddExam/Add";
import List from "@/Components/Examination/AddExam/List";

//Context
import { PaginationContext, Variables, defaultVariable } from "@/Context/pagination.context";

//Urql
import { RequestPolicy } from "urql";
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_EXAM_LIST } from "@/Urql/Query/Examination/exam.query";
import { GET_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";

const AddExam = () => {
    //State
    const [variables, setVariables] = useState<Variables>(defaultVariable);
    const [policy, setPolicy] = useState<RequestPolicy>("cache-and-network");

    return (
        <Layout main="examination" sub="addExam" title="Add Exam">
            <PageHeader
                title="Examination"
                navs={["Dashboard", "Examination", "Add Exam"]}
            />
            <PaginationContext.Provider value={{ variables, setVariables, policy, setPolicy }}>
                <Add />
                <List />
            </PaginationContext.Provider>
        </Layout >
    );
};

export default AddExam;

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
        GET_GRADE_SYSTEM,
        { searchInput: { search: "" } }, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //--//
    await client.query(
        GET_EXAM_LIST,
        { searchInput: { search: "" } }, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}