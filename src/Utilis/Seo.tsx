import Head from 'next/head';

type Props = {
    title?: string;
}

const Seo = ({ title = "E-Campus" }: Props) => {
    return (
        <Head>
            <meta property="og:url" content="https://ecampus.com/" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${title} | Qualifications in educations`} />
            <meta property="og:description" content="I am Siam Ahnaf a full-stack web application Developer. I am skillful in NodeJs, ExpressJs, GraphQL, ReactJs, NextJs and almost all React UI-library & frameworks. Get quality full work at your desired time!" />
            <title>{`${title} | Qualifications in educations`}</title>
            <meta name="description" content="I am Siam Ahnaf a full-stack web application Developer. I am skillful in NodeJs, ExpressJs, GraphQL, ReactJs, NextJs and almost all React UI-library & frameworks. Get quality full work at your desired time!" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta name="author" content="Siam Ahnaf" />
        </Head>
    );
};
export default Seo;