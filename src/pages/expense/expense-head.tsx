import type { GetServerSideProps } from "next";
import { useState } from "react";

//Layout
import Layout from "@/Layout";

//Components
import PageHeader from "@/Components/Common/PageHeader";
import Add from "@/Components/Expense/Head/Add";
import List from "@/Components/Expense/Head/List";

//Context
import { PaginationContext, Variables, defaultVariable } from "@/Context/pagination.context";

//Urql
import { RequestPolicy } from "urql";
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GET_EXPENSE_HEADS } from "@/Urql/Query/Expense/head.query";

const ExpenseHead = () => {
    //State
    const [variables, setVariables] = useState<Variables>(defaultVariable);
    const [policy, setPolicy] = useState<RequestPolicy>("cache-and-network");

    return (
        <Layout main="expense" sub="expenseHead" title="Add Expense Head">
            <PageHeader
                title="Expense"
                navs={["Dashboard", "Expense", "Add Expense Head"]}
            />
            <PaginationContext.Provider value={{ variables, setVariables, policy, setPolicy }}>
                <Add />
                <List />
            </PaginationContext.Provider>
        </Layout >
    );
};

export default ExpenseHead;

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
        GET_EXPENSE_HEADS,
        { searchInput: defaultVariable }, {
        fetchOptions,
        requestPolicy: "network-only"
    }).toPromise();

    //Props
    return { props: { urqlState: ssrCache?.extractData() } }
}