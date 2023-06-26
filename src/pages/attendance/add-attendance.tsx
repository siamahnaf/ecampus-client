import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Add from "@/Components/Attendance/Add";


//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";

const Section = () => {
    return (
        <Layout main="attendance" sub="addAttendance" title="Add Attendance">
            <PageHeader
                title="Add Attendance"
                navs={["Dashboard", "Attendance", "Add Attendance"]}
            />
            <Add />
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
    if (!data || (data?.getProfile.role !== "principal" && data?.getProfile.role !== "teacher")) {
        return { redirect: { destination: "/login", permanent: false } }
    }

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