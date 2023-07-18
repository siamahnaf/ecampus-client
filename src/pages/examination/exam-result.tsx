import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Search from "@/Components/Examination/Result/Search";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_ALL_EXAM } from "@/Urql/Query/Examination/exam.query";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";

const ExamResult = () => {
    return (
        <Layout main="examination" sub="examResult" title="Exam Result">
            <PageHeader
                title="Examination"
                navs={["Dashboard", "Examination", "Exam Result"]}
            />
            <Search />
        </Layout>
    );
};

export default ExamResult;


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

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}