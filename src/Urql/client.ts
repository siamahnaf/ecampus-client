import { cacheExchange, Client, fetchExchange, ssrExchange, errorExchange, subscriptionExchange } from "urql";
import { createClient as createWSClient } from "graphql-ws";
import { useMemo } from "react";

let client: Client | null = null;

let ssrCache: ReturnType<typeof ssrExchange> | null = null;

const wsClient = typeof window !== "undefined" ? createWSClient({
    url: "ws://localhost:3001/ecampus" as string,
}) : null;

const isServer = typeof window === "undefined";
export function initUrqlClient(initialState?: any) {
    if (!client) {
        ssrCache = ssrExchange({ initialState, isClient: !isServer });
        client = new Client({
            url: process.env.NEXT_PUBLIC_API_URL as string,
            exchanges: [
                errorExchange({
                    onError: (error) => {
                        error.message = error.message.replace(/^\[.*\]\s*/, "");
                    }
                }),
                cacheExchange,
                ssrCache,
                fetchExchange,
                subscriptionExchange({
                    forwardSubscription(request) {
                        const input = { ...request, query: request.query || '' };
                        return {
                            subscribe(sink) {
                                if (typeof window !== "undefined" && wsClient) {
                                    const unsubscribe = wsClient?.subscribe(input, sink);
                                    return { unsubscribe };
                                }
                                return { unsubscribe: () => { } };
                            },
                        };
                    },
                }),
            ],
            fetchOptions: {
                credentials: "include"
            },
        });
    } else {
        ssrCache?.restoreData(initialState);
    }
    return { client, ssrCache };
}


export const useClient = (pageProps?: any) => {
    const urqlData = pageProps.urqlState;
    const { client } = useMemo(() => {
        return initUrqlClient(urqlData);
    }, [urqlData]);
    return client;
};