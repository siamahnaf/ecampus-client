import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Add from "@/Components/Staff/Teacher/Add";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";

const AddTeacher = () => {
    return (
        <Layout main="staff" sub="addTeacher" title="Add Teacher">
            <PageHeader
                title="Staff"
                navs={["Dashboard", "Staff", "Add Teacher"]}
            />
            <Add />
        </Layout >
    );
};

export default AddTeacher;

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
    if (!data || (data?.getProfile.role !== "principal" && data?.getProfile.role !== "accountant")) {
        return { redirect: { destination: "/login", permanent: false } }
    }

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}