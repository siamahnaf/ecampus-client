import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="overflow-hidden h-screen text-textColor">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
