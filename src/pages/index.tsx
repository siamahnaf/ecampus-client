import type { GetServerSideProps } from "next";

//Layout
import Layout from "@/Layout";

//Urql
import { initUrqlClient } from "@/Urql/client";
import { GET_PROFILE } from "@/Urql/Query/Account/profile.query";

const Home = () => {
  return (
    <Layout main="dashboard">
      Dashboard
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //Urql
  const { client, ssrCache } = initUrqlClient();

  //Headers
  const fetchOptions = {
    headers: {
      cookie: ctx.req.headers.cookie as string,
      "user-agent": ctx.req.headers["user-agent"] as string,
      "x-forwarded-for": ctx.req.socket?.remoteAddress as string
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

  //Props
  return { props: { urqlState: ssrCache?.extractData() } }
}