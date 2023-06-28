import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Filter from "@/Components/Fee/Weaver/Filter";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";

const Weaver = () => {
    return (
        <Layout main="fee" sub="weaver" title="Weaver">
            <PageHeader
                title="Fee"
                navs={["Dashboard", "Fee", "Weaver"]}
            />
            <Filter />
        </Layout>
    );
};

export default Weaver;

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