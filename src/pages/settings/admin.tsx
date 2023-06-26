import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";

const Admin = () => {
    return (
        <Layout main="settings" sub="admin" title="Admin Management">
            <PageHeader
                title="Setting"
                navs={["Dashboard", "Setting", "Admin Management"]}
            />
            <div className="text-main text-lg text-center font-medium mt-10">
                This feature is coming soon!
            </div>
        </Layout>
    );
};

export default Admin;

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
    }

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}