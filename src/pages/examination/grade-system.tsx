import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Add from "@/Components/Examination/GradeSystem/Add";
import Lists from "@/Components/Examination/GradeSystem/Lists";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";

const GradeSystem = () => {
    return (
        <Layout main="examination" sub="gradeSystem" title="Grade System">
            <PageHeader
                title="Examination"
                navs={["Dashboard", "Examination", "Grade System"]}
            />
            <Add />
            <Lists />
        </Layout>
    );
};

export default GradeSystem;

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

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}