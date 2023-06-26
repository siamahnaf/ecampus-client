import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";

const AttendanceReport = () => {
    return (
        <Layout main="attendance" sub="attendanceReport" title="Attendance Report">
            <PageHeader
                title="Attendance"
                navs={["Dashboard", "Attendance", "Attendance Report"]}
            />
            <div className="text-main text-lg text-center font-medium mt-10">
                This is the beta features!
            </div>
        </Layout>
    );
};

export default AttendanceReport;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    //Urql
    const { ssrCache, client } = initUrqlClient();

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

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}