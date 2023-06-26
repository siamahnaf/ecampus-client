import type { GetServerSideProps } from "next";
//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Add from "@/Components/Fee/AddFees/Add";
import Lists from "@/Components/Fee/AddFees/Lists";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GET_FEES_LIST } from "@/Urql/Query/Fee/fees.query";

const AddFee = () => {
    return (
        <Layout main="fee" sub="addFee" title="Add Fee">
            <PageHeader
                title="Fee"
                navs={["Dashboard", "Fee", "Add Fee"]}
            />
            <Add />
            <Lists />
        </Layout>
    );
};

export default AddFee;

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

    //--//
    await client.query(
        GET_ALL_CLASS,
        {}, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //--//
    await client.query(
        GET_FEES_LIST,
        { searchInput: { search: "" } }, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}