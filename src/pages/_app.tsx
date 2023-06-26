import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "urql";

//Urql Init
import { useClient } from "@/Urql/client";

//Fonts
import { inter } from "@/Fonts";

export default function App({ Component, pageProps }: AppProps) {
  const client = useClient(pageProps);
  return (
    <Provider value={client}>
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </Provider >
  )
}
